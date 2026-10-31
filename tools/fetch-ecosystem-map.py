#!/usr/bin/env python3
"""
Fetch the XRPL Commons ecosystem map and write the project list for /about/uses.

Writes @theme/data/ecosystem-projects.json and the project logos under
static/img/uses/projects/. Source: https://map.xrpl-commons.org

Every Active, visible project is kept, except the few in SKIP. Each one is sorted
into the categories the Uses page already has: first by its Commons category
(CATEGORY_MAP), then by per-project corrections (PROJECT_CATEGORIES). Projects that
match no category are skipped and listed in the output, so a new Commons category
never lands on the page unreviewed.

Logos are saved under a name that includes a hash of their source URL, so an
unchanged logo is not downloaded again. Raster logos are trimmed and resized to
WebP. SVG logos are kept only if they contain no scripts or external references.
A logo that fails keeps its previous file, or the card shows no logo.

Requires Pillow (pip install pillow).

Validates the response before writing, so a failed or malformed fetch never
writes over a good snapshot. Refuses to drop more than half of the projects at
once unless run with --allow-shrink.
"""

import argparse
import hashlib
import io
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required: pip install pillow")

API = "https://map.xrpl-commons.org/api"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "@theme/data/ecosystem-projects.json"
LOGO_DIR = ROOT / "static/img/uses/projects"
LOGO_URL = "/img/uses/projects"
USER_AGENT = "xrpl-dev-portal ecosystem sync (+https://github.com/XRPLF/xrpl-dev-portal)"

# Logos are shown at up to 184x48 CSS pixels, so this covers 2x screens.
LOGO_MAX = (368, 96)

CATEGORIES = [
    "infrastructure", "developer_tooling", "interoperability", "wallet", "nfts",
    "exchanges", "gaming", "security", "payments", "cbdc", "sustainability", "custody",
]

# Commons category -> Uses page categories. None means "decide per project".
CATEGORY_MAP = {
    # Apps
    "AI Agent": None,
    "Accounting": "payments",
    "Asset Creation, Minting & Marketplaces": "nfts",
    "Asset Creator": "nfts",
    "Bank": "payments",
    "Browser": "wallet",
    "Centralized Exchange": "exchanges",
    "Clubs & Collectives": None,
    "Collectible & Asset Marketplace": "nfts",
    "Collectible Collection": "nfts",
    "Community Management": None,
    "Crypto Asset Managers": "exchanges",
    "Custody Solution": "custody",
    "Digital Art Studio & Experimental Labs": "nfts",
    "Fiat Onramp & Payment": "payments",
    "Funding Platform": "payments",
    "Gaming": "gaming",
    "Gaming Platform & Studio": "gaming",
    "Generative Art Collection": "nfts",
    "Hardware Wallet": "wallet",
    "Human Resource Coordination": None,
    "Identity & Data Management": "security",
    "Individual Non-Custodial Wallet": "wallet",
    "Institutional Trading Services & Position Manager": "exchanges",
    "Lending": "exchanges",
    "Loyalty Program": "payments",
    "Media & IP": "nfts",
    "Media & News": None,
    "Messaging Trading Bot": "exchanges",
    "Messenger App": None,
    "Metaverse": "gaming",
    "Multi-Party Computation & Institutional Wallet": "custody",
    "Music Platform": "nfts",
    "OTC Desk": "exchanges",
    "Physical Collectible Infrastructure": "nfts",
    "Portfolio Tracker": "infrastructure",
    "Prime Brokerage": "exchanges",
    "Privacy-Focused Wallet": "wallet",
    "Publishing": None,
    "Quest & Bounty Network": None,
    "Smart Contract & Collaborative Wallet": "wallet",
    "Social Network": None,
    "Social Trading": "exchanges",
    "Stablecoin": "payments",
    "Staking Provider": None,
    "Tax Software": "payments",
    "Video & Streaming": None,
    "Wearables & Avatar Platform": None,
    "Yield": "exchanges",
    # Core Infrastructure
    "Core Services": "infrastructure",
    "Infrastructure Hardware": "infrastructure",
    "Layer 1": "interoperability",
    "Layer 2": "interoperability",
    "VM": "developer_tooling",
    # Developer Tools & Services
    "Block Explorer": "infrastructure",
    "Chain Monitoring": "infrastructure",
    "Compliance": "security",
    "Data Provenance": "infrastructure",
    "Dev Tools & Infra": "developer_tooling",
    "Developer Data": "infrastructure",
    "Development Framework": "developer_tooling",
    "Embedded Wallets, Account Abstraction & Wallet-as-a-Service": "developer_tooling",
    "Enterprise Blockchain Developer Tool": "developer_tooling",
    "Gaming Developer Tool": "gaming",
    "Governance Tool": "developer_tooling",
    "Indexing": "infrastructure",
    "Messaging & Notification Tool": "developer_tooling",
    "Modeling & Simulation & Research": "developer_tooling",
    "Payment & Onramp Tool": "payments",
    "Price Data": "infrastructure",
    "Rollup-as-a-Service": "interoperability",
    "Security": "security",
    "Security & Auditing": "security",
    "Security & Bug Bounties": "security",
    "User & Community Analytics": "infrastructure",
    "Verifiable AI/ML Inference": "developer_tooling",
    "Vertical-Specific-Data": None,
    # Interoperability
    "Bridges & Cross-Chain Messaging": "interoperability",
    "Cross-Chain Liquidity": "interoperability",
    "Intents & Transaction Abstraction": "interoperability",
    # Protocols
    "Aggregator": "exchanges",
    "Data resource Coordination": "infrastructure",
    "Decentralized Exchange": "exchanges",
    "Decentralized Social Protocol": None,
    "Derivates Exchange": "exchanges",
    "Distributed Training & Inference": None,
    "Exchange Token": "exchanges",
    "Identity & Data Sovereignty Protocol": "infrastructure",
    "Liquid Restaking": "exchanges",
    "Liquid Staking": "exchanges",
    "Memecoin & Tipping Token": None,
    "Messaging & Notification": "developer_tooling",
    "Oracle": "infrastructure",
    "Payments": "payments",
    "Platform Utility Token": None,
    "Prediction Market": "exchanges",
    "Privacy Preserving Protocol": "security",
    "Resource Coordination & Compute": "infrastructure",
    "Resource Coordination & Data Storage": "infrastructure",
    "Risk Management": "security",
    "Token Launchpad": "exchanges",
    # XRPL Content
    "Visuals": None,
    # EVM Sidechain
    "API": "infrastructure",
    "Apps": None,
    "Bridge": "interoperability",
    "DeFi": "exchanges",
    "Explorer": "infrastructure",
    "NFT": "nfts",
    "RWA": "exchanges",
    "Tools": None,
    "Wallet": "wallet",
}

# Corrections where the Commons category does not match what the project does,
# or where it gives none.
PROJECT_CATEGORIES = {
    "alphaday": ["infrastructure"],
    "anchain": ["security"],
    "anodex": ["exchanges"],
    "archax": ["exchanges", "custody"],
    "axelarscan": ["infrastructure", "interoperability"],
    "band-protocol": ["infrastructure"],
    "bitso": ["exchanges", "payments"],
    "carbonland-trust": ["sustainability"],
    "co-pass": ["security"],
    "confiel": ["cbdc"],
    "copump": ["exchanges"],
    "cryptum": ["developer_tooling"],
    "d3-labs": ["payments"],
    "dhali": ["developer_tooling", "payments"],
    "easya": ["developer_tooling"],
    "ens-xrplevm-org": ["infrastructure"],
    "eolas": ["developer_tooling"],
    "equil": ["nfts"],
    "evernode": ["interoperability", "developer_tooling"],
    "falcon-finance": ["exchanges", "payments"],
    "fluidefi": ["exchanges"],
    "forte": ["security"],
    "gatehub": ["wallet", "exchanges"],
    "geochain": ["infrastructure"],
    "goldsky": ["infrastructure"],
    "grove": ["infrastructure"],
    "humanode-biomapper": ["security"],
    "ident-agency": ["security"],
    "interledger-foundation": ["payments", "interoperability"],
    "mandla-wallet": ["wallet"],
    "meta-carbon": ["sustainability"],
    "midasrwa": ["nfts", "exchanges"],
    "onchaingm": ["gaming"],
    "onthedexlive": ["infrastructure"],
    "onxrp": ["nfts", "exchanges"],
    "orbit-chain": ["interoperability"],
    "palmera": ["wallet", "custody"],
    "peak": ["nfts"],
    "phiwallet": ["nfts", "wallet"],
    "posthuman": ["infrastructure"],
    "quicknode": ["infrastructure"],
    "quidli": ["payments"],
    "range": ["security", "infrastructure"],
    "reown": ["developer_tooling"],
    "reown-dapp-with-social-login": ["developer_tooling"],
    "riddle": ["exchanges"],
    "ripple": ["payments", "custody"],
    "ripplebids": ["payments"],
    "rubyscore": ["infrastructure"],
    "safe-global-multisig": ["wallet"],
    "securitize": ["nfts", "exchanges"],
    "self": ["security"],
    "spacewatch": ["nfts"],
    "stasis": ["payments"],
    "supermojo": ["payments"],
    "textrp": ["payments"],
    "thallo": ["sustainability"],
    "thingsgoonline": ["sustainability"],
    "verifyed": ["security"],
    "vnx-on-xrpl": ["payments"],
    "ward-protocol": ["developer_tooling"],
    "x-tokenize": ["nfts"],
    "xao-dao": ["developer_tooling"],
    "xpmarket": ["exchanges", "nfts"],
    "xrise33": ["exchanges"],
    "xrp-address": ["wallet"],
    "xrp-ledger": ["developer_tooling", "infrastructure"],
    "xrp-ledger-foundation": ["infrastructure", "developer_tooling"],
    "xrp-toolkit": ["wallet"],
    "xrpawz": ["nfts"],
    "xrpl-ai-signals-by-liisa": ["infrastructure", "nfts"],
    "xrpl-cheat-sheet": ["developer_tooling"],
    "xrpl-commons": ["developer_tooling"],
    "xrpl-discord-bot": ["developer_tooling"],
    "xrpl-jobs": ["developer_tooling"],
    "xrpl-labs": ["developer_tooling", "wallet"],
    "xrpl-meta": ["developer_tooling"],
    "xrpl-nft-api": ["developer_tooling"],
    "xrpl-pulse": ["developer_tooling"],
    "xrpl-x-address-format": ["developer_tooling"],
    "yellow-network": ["developer_tooling", "exchanges"],
    "zkcodex": ["infrastructure"],
    "zns-bio": ["infrastructure"],
    "zns-connect": ["infrastructure"],
}

# Map entries whose listed URL no longer works.
URL_OVERRIDES = {
    "anodex": "https://anodos.finance/",
    "nodestake": "https://nodestake.org/",
    "onchaingm": "https://onchaingm.com/",
    "the-shillverse": "https://app.theshillverse.com/",
    "wirex": "https://www.wirexapp.com/",
    "xrp-for-salesforce": "https://web3enabler.com/product/xrp-for-salesforce/",
}

# Left off the page even though the map lists them as Active. Checked September 2026.
SKIP = {
    "dcent": "held back for now",
    "filedgr": "held back for now",
    "sologenic": "held back for now",
    "sologenic-dex": "held back for now",
    # Site down, parked or shut down
    "aigent.run": "site down",
    "axiom": "site down",
    "block-trac": "site certificate expired",
    "bpm-wallet": "site under construction",
    "casino-coin": "site down",
    "cosmos-explorer": "site down",
    "fractal-id": "site offline",
    "grove": "shut down",
    "hammy-swap": "site down",
    "hubsecure": "site behind a login",
    "kaiju-labs": "site down",
    "leap-wallet": "site down",
    "ledger-observer": "site down",
    "litebit": "shut down, now part of Bitvavo",
    "loansnap": "shut down",
    "mintable": "shutting down",
    "mintiq-market": "domain parked",
    "neefty": "site down",
    "nexus-by-the-ai-dao-e": "site now points elsewhere",
    "peerkat": "site down",
    "riddle": "site down",
    "sonde": "site down",
    "stedas-crypto": "site now points elsewhere",
    "strobe": "site down",
    "surgedex": "site down",
    "three": "site down",
    "web3pro": "site down",
    "wind": "site down",
    "xangecom": "site not launched",
    "xmart": "shut down",
    "xrp-balance": "site down",
    "xrpl-metrics": "site down",
}

# Live although the map still lists them as Pre-launch.
ACTIVE_ANYWAY = {"staticbit"}

# Listed on the Uses page but not on the Commons map yet.
EXTRA_PROJECTS = [
    {
        "slug": "bitget-wallet",
        "name": "Bitget Wallet",
        "description": "Bitget Wallet is a non-custodial wallet designed to make crypto simple and secure for everyone.",
        "url": "https://web3.bitget.com/",
        "logo": "/img/uses/projects/bitget-wallet.svg",
        "categories": ["wallet"],
    },
    {
        "slug": "first-ledger",
        "name": "First Ledger",
        "description": "First Ledger is a trading bot and token launchpad for the XRP Ledger, used through Telegram.",
        "url": "https://firstledger.net/",
        "logo": "/img/uses/projects/first-ledger.svg",
        "categories": ["exchanges"],
    },
    {
        "slug": "hummingbot",
        "name": "Hummingbot",
        "description": "Hummingbot is an open-source framework for building market-making and trading bots, with a connector for the XRP Ledger DEX.",
        "url": "https://hummingbot.org/exchanges/xrpl/",
        "logo": "/img/uses/projects/hummingbot.webp",
        "categories": ["developer_tooling", "exchanges"],
    },
    {
        "slug": "magnetic",
        "name": "Magnetic",
        "description": "Magnetic is a decentralized exchange on the XRP Ledger with AMM pools, farming, NFTs and a token launchpad.",
        "url": "https://xmagnetic.org/",
        "logo": "/img/uses/projects/magnetic.webp",
        "categories": ["exchanges"],
    },
    {
        "slug": "opulencex",
        "name": "OpulenceX",
        "description": "OpulenceX builds the OpulX NFT marketplace and an AMM and yield farm on the XRP Ledger.",
        "url": "https://www.opulencex.io/",
        "logo": "/img/uses/projects/opulencex.webp",
        "categories": ["nfts", "exchanges"],
    },
]

# Shown first in each category's popup on the page; the rest follow alphabetically.
SPOTLIGHT = [
    "xrpscan", "bithomp", "onthedexlive", "cryptum", "evernode", "xaman",
    "crossmark", "edge", "gemwallet", "joey-wallet", "bifrost-wallet",
    "bitget-wallet", "aesthetes", "audiotarky", "xrpcafe",
    "xpmarket", "x-tokenize", "zerpmon", "anchain", "ripple", "carbonland-trust",
    "gatehub", "bitgo",
]

REQUIRED = {
    "sections": ("_id", "name"),
    "categories": ("_id", "name", "sectionId"),
    "projects": ("slug", "name", "status", "visible", "categoryId", "url"),
}

TRACKING_PARAMS = re.compile(r"^(utm_.*|_ga|_gl|gclid|fbclid|mc_cid|mc_eid|igshid)$")


def get(url):
    if urllib.parse.urlparse(url).scheme != "https":
        raise RuntimeError(f"Refusing non-https URL: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def get_json(name):
    data = json.loads(get(f"{API}/{name}"))
    if not isinstance(data, list) or not data:
        raise RuntimeError(f"Unexpected response shape from /api/{name}: {type(data).__name__}")
    for item in data:
        missing = [k for k in REQUIRED[name] if not isinstance(item, dict) or k not in item]
        if missing:
            raise RuntimeError(f"/api/{name} entry is missing {', '.join(missing)}: {str(item)[:200]}")
    return data


def clean_text(text):
    text = (text or "").replace("**", "")
    text = re.sub(r"\s*[\u2013\u2014]\s*", " - ", text)  # site style: plain hyphens only
    return re.sub(r"\s+", " ", text).strip()


def clean_url(url):
    """Drop tracking parameters; any other URL is returned unchanged."""
    url = url.strip()
    parts = urllib.parse.urlsplit(url)
    pairs = urllib.parse.parse_qsl(parts.query, keep_blank_values=True)
    kept = [(k, v) for k, v in pairs if not TRACKING_PARAMS.match(k)]
    if len(kept) == len(pairs):
        return url
    return urllib.parse.urlunsplit(parts._replace(query=urllib.parse.urlencode(kept)))


def site_key(url):
    host_path = re.sub(r"^[a-z]+://", "", (url or "").strip().lower())
    return re.sub(r"^www\.", "", host_path).rstrip("/")


def write_atomic(path, data):
    tmp = path.with_name(path.name + ".part")
    tmp.write_bytes(data)
    os.replace(tmp, path)


def luminance(rgb):
    r, g, b = rgb
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255


def is_light_raster(im):
    """True for a light logo on a transparent background, which vanishes on white."""
    rgba = im.convert("RGBA")
    pixels = list(rgba.getdata())
    visible = [p[:3] for p in pixels if p[3] > 128]
    transparent = sum(1 for p in pixels if p[3] < 32)
    if not visible or transparent < 0.05 * len(pixels):
        return False
    return sum(luminance(p) for p in visible) / len(visible) > 0.8


SVG_COLOR = re.compile(r"(?:fill|stroke|stop-color)\s*[:=]\s*[\"']?\s*(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)")


def check_svg(data):
    """Parse an SVG logo, reject anything that could run or load content, and
    return True if every color in it is light."""
    lowered = data.lower()
    if b"<!doctype" in lowered or b"<!entity" in lowered:
        raise RuntimeError("SVG has a DOCTYPE or entities")
    root = ET.fromstring(data)
    if root.tag.split("}")[-1] != "svg":
        raise RuntimeError("not an SVG document")
    for el in root.iter():
        tag = el.tag.split("}")[-1].lower()
        if tag in ("script", "foreignobject", "iframe", "embed", "object"):
            raise RuntimeError(f"SVG contains <{tag}>")
        styles = [el.text or ""] if tag == "style" else []
        for key, value in el.attrib.items():
            name = key.split("}")[-1].lower()
            if name.startswith("on"):
                raise RuntimeError(f"SVG has an {name} handler")
            if name == "href" and not value.startswith(("#", "data:image/")):
                raise RuntimeError("SVG links to an external resource")
            if name == "style":
                styles.append(value)
        for css in styles:
            if "@import" in css or re.search(r"url\(\s*[\"']?(?!#)", css):
                raise RuntimeError("SVG style loads an external resource")

    colors = []
    for value in SVG_COLOR.findall(data.decode("utf-8", "replace")):
        value = value.lower()
        if value in ("none", "transparent", "currentcolor", "inherit"):
            continue
        if value == "white":
            colors.append(1.0)
        elif value.startswith("#") and len(value) in (4, 7, 9):
            hexes = value[1:4] if len(value) == 4 else value[1:7]
            if len(hexes) == 3:
                hexes = "".join(c * 2 for c in hexes)
            colors.append(luminance(tuple(int(hexes[i:i + 2], 16) for i in (0, 2, 4))))
        else:
            colors.append(0.0)  # named colors other than white read as dark
    return bool(colors) and min(colors) > 0.8


def trim(im):
    """Crop transparent or white margins so logos line up in their frames."""
    rgba = im.convert("RGBA")
    alpha = rgba.getchannel("A")
    if alpha.getextrema()[0] < 16:
        box = alpha.point(lambda a: 255 if a > 16 else 0).getbbox()
    else:
        corners = [rgba.getpixel(p)[:3] for p in ((0, 0), (rgba.width - 1, 0),
                   (0, rgba.height - 1), (rgba.width - 1, rgba.height - 1))]
        if not all(min(c) > 240 for c in corners):
            return rgba  # a solid tile is part of the logo, keep it
        gray = rgba.convert("L")
        box = gray.point(lambda v: 255 if v < 235 else 0).getbbox()
    return rgba.crop(box) if box else rgba


def sniff(data):
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if data[:3] == b"\xff\xd8\xff":
        return "jpg"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "gif"
    if data.lstrip()[:5] in (b"<?xml", b"<!--") or data.lstrip()[:4] == b"<svg":
        return "svg"  # check_svg confirms the root element is <svg>
    return None


def logo_on_dark(path):
    if path.suffix == ".svg":
        return check_svg(path.read_bytes())
    with Image.open(path) as im:
        return is_light_raster(im)


def save_logo(project):
    """Download a project's logo. Returns (file name, downloaded)."""
    source = project["logo"]
    stem = f"{project['slug']}-{hashlib.sha1(source.encode()).hexdigest()[:8]}"
    for existing in LOGO_DIR.glob(f"{stem}.*"):
        if existing.suffix in (".webp", ".svg") and existing.stat().st_size > 0:
            return existing.name, False

    data = get(source)
    kind = sniff(data)
    if kind == "svg":
        check_svg(data)
    elif kind:
        im = trim(Image.open(io.BytesIO(data)))
        im.thumbnail(LOGO_MAX, Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=90, method=6)
        data, kind = buf.getvalue(), "webp"
    else:
        raise RuntimeError("unrecognized image format")
    path = LOGO_DIR / f"{stem}.{kind}"
    write_atomic(path, data)
    return path.name, True


def main():
    parser = argparse.ArgumentParser(description=__doc__.strip().splitlines()[0])
    parser.add_argument("--allow-shrink", action="store_true",
                        help="write even if more than half of the projects would disappear")
    args = parser.parse_args()

    sections = {s["_id"]: s["name"] for s in get_json("sections")}
    categories = {c["_id"]: c for c in get_json("categories")}
    projects = get_json("projects")
    if not any(p["status"] == "Active" and p["visible"] for p in projects):
        raise RuntimeError("No Active, visible projects in the response")

    previous = json.loads(OUT.read_text(encoding="utf-8"))["projects"] if OUT.exists() else []
    previous_logos = {p["slug"]: p.get("logo") for p in previous}

    # A skipped project's duplicates are skipped too.
    skipped_sites = {site_key(p["url"]) for p in projects if p["slug"] in SKIP}
    urls, by_site = {}, {}
    for p in projects:
        active = p["status"] == "Active" or p["slug"] in ACTIVE_ANYWAY
        if not p["visible"] or not active or not p["url"]:
            continue
        if p["slug"] in SKIP or site_key(p["url"]) in skipped_sites:
            continue
        urls[p["slug"]] = URL_OVERRIDES.get(p["slug"]) or clean_url(p["url"])
        # The map lists some projects more than once; keep the first one created.
        key = site_key(urls[p["slug"]])
        if key not in by_site or p.get("createdAt", "") < by_site[key].get("createdAt", ""):
            by_site[key] = p

    selected, unmatched, no_category, unknown_categories = [], [], [], set()
    for p in sorted(by_site.values(), key=lambda p: p["slug"]):
        category = categories.get(p["categoryId"])
        if category:
            default = CATEGORY_MAP.get(category["name"])
            if category["name"] not in CATEGORY_MAP and p["slug"] not in PROJECT_CATEGORIES:
                unknown_categories.add(category["name"])
        else:
            default = None
        cats = PROJECT_CATEGORIES.get(p["slug"]) or ([default] if default else [])
        if cats:
            selected.append((p, cats))
        elif category:
            unmatched.append(p["slug"])
        else:
            no_category.append(p["slug"])

    LOGO_DIR.mkdir(parents=True, exist_ok=True)

    def fetch(pc):
        project = pc[0]
        if not project.get("logo"):
            return None, False, False, None
        try:
            name, downloaded = save_logo(project)
            return name, downloaded, logo_on_dark(LOGO_DIR / name), None
        except Exception as e:  # keep going; one bad logo must not stop the sync
            old = previous_logos.get(project["slug"])
            try:
                if old and old.startswith(LOGO_URL) and (LOGO_DIR / Path(old).name).exists():
                    name = Path(old).name
                    return name, False, logo_on_dark(LOGO_DIR / name), f"{project['slug']}: {e}"
            except Exception:
                pass
            return None, False, False, f"{project['slug']}: {e}"

    with ThreadPoolExecutor(max_workers=4) as pool:
        logos = list(pool.map(fetch, selected))

    out = []
    for (p, cats), (name, _, on_dark, _) in zip(selected, logos):
        entry = {
            "slug": p["slug"],
            "name": clean_text(p["name"]),
            "description": clean_text(p.get("description")),
            "url": urls[p["slug"]],
            "logo": f"{LOGO_URL}/{name}" if name else None,
            "categories": cats,
        }
        if on_dark:
            entry["logoOnDark"] = True
        out.append(entry)
    failed = [error for *_, error in logos if error]

    listed = {e["slug"] for e in out} | {site_key(e["url"]) for e in out}
    for extra in EXTRA_PROJECTS:
        if extra["slug"] in listed or site_key(extra["url"]) in listed:
            print(f"{extra['slug']} is on the map now; remove it from EXTRA_PROJECTS.", file=sys.stderr)
        else:
            out.append(extra)
    out.sort(key=lambda e: (e["name"].lower(), e["slug"]))

    bad = [e["slug"] for e in out if not e["categories"] or any(c not in CATEGORIES for c in e["categories"])]
    if bad:
        raise RuntimeError(f"Unknown Uses page category for: {', '.join(bad)}")
    if previous and len(out) < len(previous) / 2 and not args.allow_shrink:
        raise RuntimeError(f"Only {len(out)} projects, down from {len(previous)}. "
                           "Check the map, or rerun with --allow-shrink.")

    slugs = {e["slug"] for e in out}
    snapshot = {
        "source": "https://map.xrpl-commons.org",
        "spotlight": [s for s in SPOTLIGHT if s in slugs],
        "projects": out,
    }
    write_atomic(OUT, (json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n").encode("utf-8"))

    # Remove logos that no project points to any more, now that the new list is saved.
    in_use = {Path(e["logo"]).name for e in out if e["logo"] and e["logo"].startswith(LOGO_URL)}
    removed = [f.name for f in LOGO_DIR.iterdir() if f.is_file() and f.name not in in_use]
    for name in removed:
        (LOGO_DIR / name).unlink()

    downloaded = sum(1 for _, got, _, _ in logos if got)
    print(f"Wrote {len(out)} projects to {OUT.relative_to(ROOT)} "
          f"({downloaded} logos downloaded, {len(removed)} removed).")
    missing_spotlight = [s for s in SPOTLIGHT if s not in slugs]
    if missing_spotlight:
        print(f"SPOTLIGHT entries not on the page: {', '.join(missing_spotlight)}", file=sys.stderr)
    if failed:
        print("Logos that failed (previous logo kept where there was one):\n  " + "\n  ".join(failed),
              file=sys.stderr)
    if unknown_categories:
        print(f"New Commons categories, add them to CATEGORY_MAP: {', '.join(sorted(unknown_categories))}",
              file=sys.stderr)
    if unmatched:
        print(f"Skipped, no matching category: {', '.join(unmatched)}", file=sys.stderr)
    if no_category:
        print(f"Skipped, category missing on the map and none set here: {', '.join(no_category)}",
              file=sys.stderr)


if __name__ == "__main__":
    main()
