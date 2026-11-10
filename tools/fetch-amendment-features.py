#!/usr/bin/env python3
"""
Fetch the amendment feature pages from opensource.ripple.com, with the status
of each feature's amendment, and write them to
@theme/data/amendment-features.json for the /amendments page.

Sources:
- ripple/opensource.ripple.com on GitHub: the pages in the site's Amendments
  sidebar (title, summary, key dates, resource cards, draft docs).
- The Mainnet and Devnet ledgers: which amendments are enabled, and which have
  a majority on Mainnet.
- Validator History Service (VHS): activation dates and transactions, the
  version that introduced each amendment, and current validator votes.
- unl.xrplf.org: the default UNL, so votes are counted by master key.
- XRPLF/rippled: features.macro at the latest release, to tell amendments
  that are open for voting from those still in development.
- blog/ in this repo: the date each release was announced.

Run by .github/workflows/update-amendment-features.yml, or manually:
    python3 tools/fetch-amendment-features.py

Set GITHUB_TOKEN to raise the GitHub API rate limit. Validates each source
before writing, so a failed fetch never replaces a good snapshot.
"""

import base64
import hashlib
import json
import os
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "@theme/data/amendment-features.json"

OSR_REPO = "ripple/opensource.ripple.com"
OSR_SITE = "https://opensource.ripple.com"
VHS = "https://vhs.prod.ripplex.io/v1/network"
RIPPLED_REPO = "XRPLF/rippled"
MACRO_PATH = "include/xrpl/protocol/detail/features.macro"
DUNL_URL = "https://unl.xrplf.org"
MAINNET = "https://xrplcluster.com/"
DEVNET = "https://s.devnet.rippletest.net:51234/"
AMENDMENTS_INDEX = "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4"
RIPPLE_EPOCH = 946684800

# xrpld stops counting a validator's votes after 24 hours without hearing
# from it: about 21,500 ledgers.
STALE_LEDGERS = 21500

# Pages with no amendment ID in their AmendmentTracker ("N/A", or no tracker).
FEATURE_AMENDMENTS = {
    "xls-100-smart-escrows": "SmartEscrow",
    "xls-80-permissioned-domains": "PermissionedDomains",
    "xls-77-deep-freeze": "DeepFreeze",
    "xls-70-credentials": "Credentials",
}

# Card links that are broken on opensource.ripple.com. None drops the card.
URL_OVERRIDES = {
    "https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0085d-token-escrow":
        "https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0085-token-escrow",
    "https://ripple.github.io/xrpl-wasm-stdlib/xrpl_wasm_stdlib/guide/index.html":
        "https://ripple.github.io/xrpl-wasm-stdlib/xrpl_common_stdlib/guide/index.html",
    "https://xrpl-dev-portal--d70d45.preview.redocly.app/docs/concepts/tokens/decentralized-exchange": None,
    "https://xrpl.org/docs/concepts/tokens/fungible-tokens/deep-freeze":
        "https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes#deep-freeze",
    "https://xrpl.org/docs/tutorials/compliance-features/create-permissioned-domains-in-javascript":
        "https://xrpl.org/docs/tutorials/compliance-features/manage-permissioned-domains",
}

# Card text that is out of date, keyed by (page slug, card title).
TEXT_OVERRIDES = {
    ("xls-94-dynamic-mpts", "XLS Spec"):
        "Technical spec for the feature outlining requirements, design, and implementation details.",
}

RESOURCE_KINDS = [
    ("spec", ["spec"]),
    ("audit", ["audit"]),
    ("security", ["security"]),
    ("performance", ["perf"]),
    ("qa", ["qa"]),
    ("tutorial", ["tutorial"]),
    ("concept", ["concept", "docs", "documentation"]),
    ("code", ["code sample"]),
    ("blog", ["blog", "insights"]),
    ("demo", ["demo"]),
]


def fetch(url, accept="application/json", github=False):
    headers = {"Accept": accept, "User-Agent": "xrpl-dev-portal"}
    token = os.environ.get("GITHUB_TOKEN")
    if github and token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def fetch_json(url, github=False):
    return json.loads(fetch(url, github=github))


def jsx_attr(block, name):
    """Return a string attribute value from a JSX tag, or None."""
    m = re.search(rf'\b{name}\s*=\s*"((?:[^"\\]|\\.)*)"', block, re.S)
    if m:
        return " ".join(m.group(1).split())
    m = re.search(rf"\b{name}\s*=\s*\{{\s*['\"`]((?:[^'\"`\\]|\\.)*)['\"`]\s*\}}", block, re.S)
    return " ".join(m.group(1).split()) if m else None


def strip_tags(text):
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\{\s*['\"]([^'\"]*)['\"]\s*\}", r"\1", text)
    return " ".join(text.split())


def resource_kind(title, url):
    t = title.lower()
    for kind, words in RESOURCE_KINDS:
        if any(w in t for w in words):
            return kind
    # Other cards that point at a docs page, such as Lending V1.1's topics.
    return "concept" if "/docs/" in url else "other"


def iso_date(text):
    m = re.search(r"([A-Z][a-z]{2}) (\d{1,2}), (\d{4})", text)
    return datetime.strptime(" ".join(m.groups()), "%b %d %Y").strftime("%Y-%m-%d") if m else None


def parse_feature_page(slug, source):
    header = re.search(r"<FeatureHeader(.*?)/>", source, re.S)
    content = re.search(r"<FeatureContent(.*?)/>", source, re.S)
    tracker = re.search(r"<AmendmentTracker(.*?)/>", source, re.S)
    if not header or not content:
        raise RuntimeError(f"{slug}: FeatureHeader or FeatureContent not found")
    tracker = tracker.group(1) if tracker else None

    resources = []
    for card in re.finditer(r"<Card\b(.*?)>(.*?)</Card>", source, re.S):
        attrs, body = card.group(1), card.group(2)
        title = jsx_attr(attrs, "title")
        url = jsx_attr(attrs, "to")
        if not title or not url:
            continue
        if url.startswith("/"):
            url = OSR_SITE + url
        if url in URL_OVERRIDES:
            url = URL_OVERRIDES[url]
            if url is None:
                continue
        para = re.search(r"<p>(.*?)</p>", body, re.S)
        text = TEXT_OVERRIDES.get((slug, title), strip_tags(para.group(1)) if para else "")
        # The cards speak as Ripple ("our blog post"); on xrpl.org, say whose.
        text = re.sub(r"\bin our blog post\b", "in a Ripple blog post", text)
        text = re.sub(r"\bour\b", "Ripple's", text)
        resource = {"title": title, "kind": resource_kind(title, url), "url": url, "text": text}
        github = jsx_attr(body, "github")
        if github:
            resource["github"] = github
        resources.append(resource)

    title = jsx_attr(header.group(1), "title") or slug
    xls = re.findall(r"XLS-0*(\d+)", title)
    if not xls:
        # Pages that extend other specs link to each of them, e.g. "XLS-65 Spec".
        xls = [n for r in resources for n in re.findall(r"^XLS-0*(\d+) Spec$", r["title"])]

    amendment_id = jsx_attr(tracker, "amendmentId") if tracker else None
    if amendment_id and not re.fullmatch(r"[0-9A-F]{64}", amendment_id):
        amendment_id = None

    # Pages without a tracker list their key dates as text.
    fixed_dates = [] if tracker else [
        {"date": d, "event": e}
        for d, e in re.findall(r'\{\s*date:\s*"([^"]+)",\s*event:\s*"([^"]+)"\s*\}', source)
    ]
    spec_date = jsx_attr(tracker, "xlsSpecDate") if tracker else next(
        (iso_date(d["date"]) for d in fixed_dates if d["event"].startswith("XLS Spec")), None)
    devnet_date = jsx_attr(tracker, "devnetDate") if tracker else next(
        (iso_date(d["date"]) for d in fixed_dates if "Devnet" in d["event"]), None)

    return {
        "slug": slug,
        "xls": ", ".join(f"XLS-{n}" for n in xls),
        "title": re.sub(r"^XLS-0*\d+\s+", "", title).strip(),
        "summary": jsx_attr(header.group(1), "subtitle") or "",
        "description": jsx_attr(content.group(1), "description") or "",
        "xls_spec_date": spec_date,
        "devnet_date": devnet_date,
        "fixed_dates": fixed_dates,
        "source_url": f"{OSR_SITE}/docs/{slug}",
        "resources": resources,
        "amendment_id": amendment_id,
    }


def fetch_subpages():
    """Map page slug -> its other doc pages, titled as the site's sidebar shows them."""
    data = fetch_json(f"{OSR_SITE}/page-data/shared/sidebar-sidebars.yaml.json")
    pages = {}

    def walk(items):
        for item in items:
            m = re.match(r"docs/([^/]+)/.+\.md$", item.get("fsPath") or "")
            if m and item.get("link"):
                pages.setdefault(m.group(1), []).append({"title": item["label"], "url": OSR_SITE + item["link"]})
            walk(item.get("items", []))

    walk(data.get("items", []))
    return pages


def fetch_features():
    tree = fetch_json(f"https://api.github.com/repos/{OSR_REPO}/git/trees/main?recursive=1", github=True)
    raw = f"https://raw.githubusercontent.com/{OSR_REPO}/main/"
    pages = {
        item["path"].split("/")[1] for item in tree["tree"]
        if re.fullmatch(r"docs/[^/]+/index\.page\.tsx", item["path"])
    }
    # Only the pages listed in the site's sidebar, in its order.
    sidebars = fetch(raw + "sidebars.yaml", accept="text/plain")
    listed = [s for s in re.findall(r"page:\s*docs/([^/]+)/index\.page\.tsx", sidebars) if s in pages]
    subpages = fetch_subpages()

    features = []
    for slug in listed:
        feature = parse_feature_page(slug, fetch(raw + f"docs/{slug}/index.page.tsx", accept="text/plain"))
        feature["subpages"] = subpages.get(slug, [])
        features.append(feature)
    if len(features) < 10:
        raise RuntimeError(f"Only {len(features)} feature pages parsed; refusing to write")
    return features


def ledger_amendments(url):
    """Return (enabled IDs, {ID: time the majority started}) from a network's ledger."""
    body = json.dumps({"method": "ledger_entry", "params": [
        {"index": AMENDMENTS_INDEX, "ledger_index": "validated"}]}).encode()
    req = urllib.request.Request(url, data=body, headers={
        "Content-Type": "application/json", "User-Agent": "xrpl-dev-portal"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        node = json.load(resp)["result"].get("node")
    if not node or not node.get("Amendments"):
        raise RuntimeError(f"{url}: no Amendments ledger entry")
    majorities = {
        m["Majority"]["Amendment"]: datetime.fromtimestamp(
            m["Majority"]["CloseTime"] + RIPPLE_EPOCH, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        for m in node.get("Majorities", [])
    }
    return set(node["Amendments"]), majorities


def fetch_votes():
    data = fetch_json(f"{VHS}/amendments/vote/main")
    if data.get("result") != "success" or not data.get("amendments"):
        raise RuntimeError("VHS amendments/vote/main: unexpected response")
    return data["amendments"]


B58 = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"


def node_public_key(hex_key):
    """Encode a hex validator public key as an nH... node public key."""
    payload = bytes([0x1C]) + bytes.fromhex(hex_key)
    check = hashlib.sha256(hashlib.sha256(payload).digest()).digest()[:4]
    n = int.from_bytes(payload + check, "big")
    out = ""
    while n:
        n, r = divmod(n, 58)
        out = B58[r] + out
    return out


def fetch_dunl():
    """The default UNL, with each validator's current signing key and the
    last ledger VHS saw it validate."""
    blob = json.loads(base64.b64decode(fetch_json(DUNL_URL)["blob"]))
    masters = [node_public_key(v["validation_public_key"]) for v in blob["validators"]]
    if len(masters) < 20:
        raise RuntimeError(f"Default UNL has only {len(masters)} validators; refusing to write")
    known = fetch_json(f"{VHS}/validators/main")
    known = known.get("validators", []) if isinstance(known, dict) else known
    by_master = {v["master_key"]: v for v in known if v.get("master_key")}
    validators = []
    for master in masters:
        v = by_master.get(master, {})
        validators.append({
            "master_key": master,
            "signing_key": v.get("signing_key"),
            "last_seen": int(v["current_index"]) if v.get("current_index") else None,
        })
    return {
        "newest_ledger": max(int(v["current_index"]) for v in known if v.get("current_index")),
        "validators": validators,
    }


def tally(vote, dunl, newest):
    """Return the master keys of default UNL validators voting yes.

    VHS lists every validator it has heard from, including old signing keys
    after a key rotation, and keeps votes it last saw days ago. Map signing
    keys to master keys, keep each validator's newest vote, and drop votes
    xrpld would no longer count.
    """
    signing = {v["signing_key"]: v["master_key"] for v in dunl["validators"] if v["signing_key"]}
    seen = {}
    for v in vote.get("voted", {}).get("validators", []):
        master = signing.get(v["signing_key"])
        if master and int(v["ledger_index"]) > seen.get(master, -1):
            seen[master] = int(v["ledger_index"])
    return sorted(m for m, index in seen.items() if newest - index <= STALE_LEDGERS)


def fetch_macro(ref):
    """Return (all names, names a server can vote for) from features.macro at a git ref."""
    text = fetch(f"https://raw.githubusercontent.com/{RIPPLED_REPO}/{ref}/{MACRO_PATH}", accept="text/plain")
    names, votable = set(), set()
    for kind, args in re.findall(r"^\s*XRPL_(FEATURE|FIX|RETIRE_FEATURE|RETIRE_FIX)\s*\(([^)]*)\)", text, re.M):
        parts = [a.strip() for a in args.split(",")]
        name = "fix" + parts[0] if kind.endswith("FIX") else parts[0]
        names.add(name)
        if not kind.startswith("RETIRE") and parts[1].lower().endswith("yes") and not parts[2].endswith("Obsolete"):
            votable.add(name)
    if len(names) < 50:
        raise RuntimeError(f"features.macro at {ref}: only {len(names)} entries parsed")
    return names, votable


def latest_release():
    releases = fetch_json(f"https://api.github.com/repos/{RIPPLED_REPO}/releases?per_page=100", github=True)
    versions = [
        re.sub(r"^[^\d]*", "", r["tag_name"]) for r in releases
        if not r.get("draft") and not r.get("prerelease")
    ]
    versions = [v for v in versions if re.fullmatch(r"\d+\.\d+\.\d+", v)]
    if not versions:
        raise RuntimeError("No rippled releases found")
    return max(versions, key=lambda v: tuple(int(x) for x in v.split(".")))


def release_post(version):
    """Return (path, date) of the xrpl.org release announcement for a server version."""
    for name in (f"xrpld-{version}", f"rippled-{version}"):
        for path in ROOT.glob(f"blog/*/{name}.md"):
            date = re.search(r'^date:\s*"?(\d{4}-\d{2}-\d{2})', path.read_text(encoding="utf-8"), re.M)
            return "/" + str(path.relative_to(ROOT).with_suffix("")), date.group(1) if date else None
    return None, None


def amendment_id(name):
    return hashlib.sha512(name.encode()).hexdigest()[:64].upper()


def build():
    features = fetch_features()
    votes = fetch_votes()
    mainnet_enabled, majorities = ledger_amendments(MAINNET)
    devnet_enabled, _ = ledger_amendments(DEVNET)
    release = latest_release()
    release_names, votable = fetch_macro(release)
    develop_names, _ = fetch_macro("develop")
    dunl = fetch_dunl()

    vhs_by_id = {a["id"]: a for a in votes}
    names = {amendment_id(n): n for n in release_names | develop_names}
    names.update({a["id"]: a["name"] for a in votes if a.get("name") not in (None, "Unknown")})
    newest_vote = max((int(v["ledger_index"]) for a in votes
                       for v in a.get("voted", {}).get("validators", [])), default=0)

    amendments = []
    for feature in features:
        page_id = feature.pop("amendment_id")
        name = FEATURE_AMENDMENTS.get(feature["slug"]) or names.get(page_id)
        feature["amendment"] = name
        if not name:
            continue
        aid = amendment_id(name)
        vhs = vhs_by_id.get(aid, {})
        version = (vhs.get("rippled_version") or "").split("-")[0] or None
        entry = {"id": aid, "name": name, "introduced": version, "devnet": aid in devnet_enabled}
        if aid in mainnet_enabled:
            entry["mainnet"] = {"status": "enabled", "date": vhs.get("date"), "tx_hash": vhs.get("tx_hash")}
        elif name in votable:
            entry["mainnet"] = {"status": "voting", "majority_since": majorities.get(aid), "eta": vhs.get("eta")}
            entry["votes"] = tally(vhs, dunl, newest_vote)
        if version:
            post, date = release_post(version)
            if post:
                entry["release_post"] = post
                entry["release_date"] = date
        amendments.append(entry)

    return {
        "fetched_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "dunl": dunl,
        "features": features,
        "amendments": amendments,
    }


def main():
    snapshot = build()
    OUT.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(snapshot['features'])} feature pages to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
