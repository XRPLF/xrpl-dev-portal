#!/usr/bin/env python3
"""XRPL on-ledger diagnostics. Requires: pip install -U xrpl-py

Three subcommands turn a hash or address into specific numbers. Explanations
of error codes and recommended fixes live in the references/*.md files.

  diagnose.py tx       <hash>     fetch a tx; show result code + key fields
  diagnose.py explain  <hash>     fetch a tx AND the related ledger state that
                                  explains *why* it failed (counterparty flags,
                                  trust lines, order book, AMM, owned objects)
  diagnose.py account  <addr>     snapshot: balance, sequence, owners, reserve, flags
  diagnose.py patterns <addr>     scan last 50 txs for recurring failure patterns

`explain` goes a step past `tx`: instead of just "this code means X", it pulls
the surrounding objects the error is *about* and renders cause + concrete fix.
"""
from __future__ import annotations

import argparse
import os
import sys
from collections import Counter

try:
    from xrpl.clients import JsonRpcClient
    from xrpl.models.currencies import XRP, IssuedCurrency
    from xrpl.models.requests import (AccountInfo, AccountLines, AccountNFTs, AccountObjects,
                                      AccountTx, BookOffers, LedgerEntry, ServerState, Tx)
    from xrpl.utils import drops_to_xrp
except ImportError:
    sys.exit("ERROR: xrpl-py is not installed. Run: pip install -U xrpl-py")

try:  # AMM support is recent; degrade gracefully if the installed xrpl-py lacks it.
    from xrpl.models.requests import AMMInfo
except ImportError:
    AMMInfo = None


NETWORKS = {
    "mainnet": "https://xrplcluster.com",
    "testnet": "https://s.altnet.rippletest.net:51234",
    "devnet":  "https://s.devnet.rippletest.net:51234",
    "local":   "http://localhost:51234",
}

FLAGS = {
    "lsfDisableMaster":  0x00100000,
    "lsfRequireDestTag": 0x00020000,
    "lsfRequireAuth":    0x00040000,
    "lsfDisallowXRP":    0x00080000,
    "lsfGlobalFreeze":   0x00400000,
    "lsfDefaultRipple":  0x00800000,
    "lsfDepositAuth":    0x01000000,
}

_STATUS = {"tes": ("✓", "32"), "tec": ("✗", "31"), "tef": ("✗", "31"),
           "tem": ("✗", "31"), "tel": ("⚠", "33"), "ter": ("⏳", "33")}
_USE_COLOR = sys.stdout.isatty() and "NO_COLOR" not in os.environ


def _c(s: str, code: str) -> str:
    return f"\x1b[{code}m{s}\x1b[0m" if _USE_COLOR else s


def _section(title: str, items: list[str]) -> str:
    if not items:
        return ""
    return "\n".join([_c(title, "36;1")] + [f"  • {x}" for x in items])


def _header(code: str, summary: str) -> str:
    glyph, color = _STATUS.get(code[:3], ("?", "37"))
    return f"{_c(f'{glyph} {code}', f'{color};1')}  {summary}"


def resolve_network(name_or_url: str) -> str:
    if name_or_url in NETWORKS:
        return NETWORKS[name_or_url]
    if name_or_url.startswith(("http://", "https://")):
        return name_or_url
    raise SystemExit(f"Unknown network '{name_or_url}'. Use one of "
                     f"{', '.join(NETWORKS)} or a full URL.")


def safe_request(client: JsonRpcClient, req) -> dict:
    try:
        return client.request(req).result or {}
    except Exception as exc:
        return {"error": "request_failed", "error_message": str(exc)}


def fetch_account(client: JsonRpcClient, address: str):
    info = safe_request(client, AccountInfo(account=address, ledger_index="validated"))
    if "error" in info:
        return None
    return info.get("account_data")


def reserve_drops(client: JsonRpcClient) -> tuple[int, int]:
    ss = safe_request(client, ServerState())
    vl = ss.get("state", {}).get("validated_ledger", {}) if "error" not in ss else {}
    return int(vl.get("reserve_base", 1_000_000)), int(vl.get("reserve_inc", 200_000))


def decode_flags(flags_int: int) -> list[str]:
    return [name for name, bit in FLAGS.items() if flags_int & bit]


def cmd_tx(client: JsonRpcClient, args) -> int:
    resp = safe_request(client, Tx(transaction=args.hash))
    if "error" in resp:
        msg = resp.get("error_message", resp.get("error"))
        print(_c(f"✗ Could not fetch transaction: {msg}", "31;1"))
        return 1

    meta = resp.get("meta") or {}
    body = resp.get("tx_json") or resp
    code = (meta.get("TransactionResult") if isinstance(meta, dict) else None) or "(unknown)"
    summary = ("Transaction succeeded." if code == "tesSUCCESS"
               else "Transaction failed; look up the code in references/*.md for the fix.")

    facts = [
        f"Hash: {args.hash}",
        f"Account: {body.get('Account', '(unknown)')}",
        f"Type: {body.get('TransactionType', '(unknown)')}",
    ]
    if "Sequence" in body:
        facts.append(f"Sequence: {body['Sequence']}")
    if "Fee" in body:
        facts.append(f"Fee: {body['Fee']} drops")
    if "LastLedgerSequence" in body:
        facts.append(f"LastLedgerSequence: {body['LastLedgerSequence']}")
    delivered = meta.get("delivered_amount") if isinstance(meta, dict) else None
    if delivered is not None:
        facts.append(f"delivered_amount: {delivered}")

    print(_header(code, summary))
    print()
    print(_section("FACTS", facts))
    if code != "tesSUCCESS" and body.get("Account"):
        print()
        print(_c("Next:", "36;1")
              + f" diagnose.py account {body['Account']} for the account's reserve / flag state.")
    return 0


def cmd_account(client: JsonRpcClient, args) -> int:
    acct = fetch_account(client, args.address)
    if not acct:
        print(_c(f"✗ Account {args.address} not found on the validated ledger.", "31;1"))
        base, _ = reserve_drops(client)
        print(f"  Fund with at least {drops_to_xrp(str(base))} XRP to create it.")
        return 1
    base, inc = reserve_drops(client)
    bal = int(acct["Balance"])
    owners = int(acct.get("OwnerCount", 0))
    reserve_now = base + owners * inc
    spendable = max(bal - reserve_now, 0)
    flags = decode_flags(int(acct.get("Flags", 0)))

    facts = [
        f"Balance: {drops_to_xrp(str(bal))} XRP ({bal} drops)",
        f"Sequence: {acct.get('Sequence')}",
        f"OwnerCount: {owners}",
        f"Reserve held: {drops_to_xrp(str(reserve_now))} XRP "
        f"(base {drops_to_xrp(str(base))} + {owners}×{drops_to_xrp(str(inc))})",
        f"Spendable: {drops_to_xrp(str(spendable))} XRP",
        f"Reserve for 1 more owned object: {drops_to_xrp(str(reserve_now + inc))} XRP",
        f"Flags: {', '.join(flags) or 'none'}",
        f"RegularKey: {acct.get('RegularKey') or '(none configured)'}",
    ]
    print(_c(f"Account {args.address}", "36;1"))
    print()
    print(_section("FACTS", facts))
    return 0


def cmd_patterns(client: JsonRpcClient, args) -> int:
    resp = safe_request(client, AccountTx(account=args.address, limit=50))
    if "error" in resp:
        msg = resp.get("error_message", resp.get("error"))
        print(_c(f"✗ account_tx unavailable: {msg}", "31;1"))
        return 1
    txs = resp.get("transactions") or []
    if not txs:
        print(_c(f"No transactions found for {args.address}.", "33"))
        return 0

    codes: Counter = Counter()
    fees: list[int] = []
    for entry in txs:
        meta = entry.get("meta") or {}
        body = entry.get("tx") or entry.get("tx_json") or {}
        result = meta.get("TransactionResult") if isinstance(meta, dict) else None
        if result:
            codes[result] += 1
        fee = body.get("Fee")
        if isinstance(fee, str) and fee.isdigit():
            fees.append(int(fee))

    nonsuccess = sum(n for c, n in codes.items() if c != "tesSUCCESS")
    findings = [f"Scanned {len(txs)} tx(s); {nonsuccess} non-success result(s)."]
    for code, n in codes.most_common():
        if code != "tesSUCCESS" and n >= 2:
            findings.append(f"{n}× {code} — recurring.")
    reserve_hits = sum(codes[c] for c in codes if "RESERVE" in c)
    if reserve_hits >= 2:
        findings.append(f"{reserve_hits} reserve-related failure(s) — balance trending into reserve.")
    if codes.get("tefPAST_SEQ", 0) >= 2:
        findings.append("Multiple tefPAST_SEQ — concurrent submission or stale sequence cache.")
    if codes.get("tecDST_TAG_NEEDED", 0) >= 2:
        findings.append("Multiple tecDST_TAG_NEEDED — destinations require tags; cache the mapping.")
    if len(fees) >= 5:
        spread = max(fees) - min(fees)
        if spread >= 10:
            findings.append(
                f"Fee spread {min(fees)}–{max(fees)} drops (Δ {spread}) over {len(fees)} txs."
            )

    print(_c(f"Patterns for {args.address}", "36;1"))
    print()
    print(_section("FINDINGS", findings))
    return 0


# --------------------------------------------------------------------------- #
# explain: fetch a failed tx AND the related ledger state behind the error.
#
# Each recipe takes (client, tx_body, meta) and returns (context_lines, cause,
# fix). The recipes mirror the per-code diagnostic recipes in references/*.md —
# keep them in sync with those files. Register a code in _EXPLAIN_RECIPES to add
# coverage; unmapped codes fall back to _explain_generic.
# --------------------------------------------------------------------------- #

def _decode_currency(cur: str) -> str:
    """Human label for a currency code. 40-char hex non-standard codes that hold
    trailing-zero-padded ASCII (e.g. '50484E4958…' → 'PHNIX') are decoded; standard
    3-char codes and undecodable hex pass through unchanged."""
    if isinstance(cur, str) and len(cur) == 40:
        try:
            raw = bytes.fromhex(cur)
        except ValueError:
            return cur
        ascii_part = raw.rstrip(b"\x00")
        if ascii_part and all(32 <= b < 127 for b in ascii_part):
            return ascii_part.decode("ascii")
        return cur[:8] + "…"  # opaque hex (LP tokens, demurrage) — keep it short
    return cur


def _asset_of(amount) -> tuple[str, str | None, str]:
    """Return (raw_currency, issuer|None, display) for an Amount/SendMax field.

    [0] keeps the RAW code (the API needs it to rebuild IssuedCurrency); the
    display string and `_code()` use the decoded human label.
    """
    if isinstance(amount, str):
        return ("XRP", None, f"{drops_to_xrp(amount)} XRP")
    if isinstance(amount, dict):
        cur = amount.get("currency", "?")
        iss = amount.get("issuer")
        val = amount.get("value", "?")
        tag = f".{iss[:8]}…" if iss else ""
        return (cur, iss, f"{val} {_decode_currency(cur)}{tag}")
    return ("?", None, str(amount))


def _code(asset) -> str:
    """Decoded human label for an asset's currency, for use in prose."""
    return _decode_currency(asset[0])


def _cur(asset: tuple[str, str | None, str]):
    cur, iss = asset[0], asset[1]
    return XRP() if cur == "XRP" and not iss else IssuedCurrency(currency=cur, issuer=iss)


def _lines(client: JsonRpcClient, account: str, peer: str | None) -> list[dict]:
    resp = safe_request(client, AccountLines(account=account, peer=peer,
                                             ledger_index="validated"))
    return resp.get("lines") or [] if "error" not in resp else []


def _find_line(lines: list[dict], currency: str, issuer: str | None) -> dict | None:
    for ln in lines:
        if ln.get("currency") == currency and ln.get("account") == issuer:
            return ln
    return None


def _book_state(client: JsonRpcClient, pays, gets) -> str:
    # Payment is the taker: it pays `pays`, gets `gets`.
    pair = f"{_code(pays)}→{_code(gets)}"
    book = safe_request(client, BookOffers(taker_pays=_cur(pays), taker_gets=_cur(gets),
                                           ledger_index="validated", limit=5))
    if "error" in book:
        return f"order book {pair}: query failed ({book.get('error')})"
    offers = book.get("offers") or []
    if not offers:
        return f"order book {pair}: EMPTY (no DEX liquidity)"
    return f"order book {pair}: {len(offers)}+ offer(s) present"


def _amm_state(client: JsonRpcClient, a, b) -> str:
    pair = f"{_code(a)}/{_code(b)}"
    if AMMInfo is None:
        return f"AMM pool {pair}: (xrpl-py too old to query)"
    amm = safe_request(client, AMMInfo(asset=_cur(a), asset2=_cur(b)))
    if "error" not in amm and amm.get("amm"):
        return f"AMM pool {pair}: exists"
    return f"AMM pool {pair}: none"


def _explain_reserve(client, body, meta):
    code = meta.get("TransactionResult")
    if code == "tecNO_LINE_INSUF_RESERVE":
        who, whose = body.get("Destination") or body.get("Account"), "destination"
    else:
        who, whose = body.get("Account"), "sender"
    base, inc = reserve_drops(client)
    acct = fetch_account(client, who)
    if not acct:
        return ([f"{whose} {who}: not found on the validated ledger."],
                "Account does not exist.", f"Fund {who} first.")
    bal, owners = int(acct["Balance"]), int(acct.get("OwnerCount", 0))
    held, need = base + owners * inc, base + (owners + 1) * inc
    gap = max(need - bal, 0)
    ctx = [
        f"{whose}: {who}",
        f"Balance: {drops_to_xrp(str(bal))} XRP",
        f"OwnerCount: {owners} → reserve held {drops_to_xrp(str(held))} XRP "
        f"(base {drops_to_xrp(str(base))} + {owners}×{drops_to_xrp(str(inc))})",
        f"One more owned object needs {drops_to_xrp(str(need))} XRP "
        f"— short by {drops_to_xrp(str(gap))} XRP",
    ]
    objs = safe_request(client, AccountObjects(account=who, ledger_index="validated", limit=400))
    items = objs.get("account_objects") or [] if "error" not in objs else []
    if items:
        by_type = Counter(o.get("LedgerEntryType", "?") for o in items)
        ctx.append("Owned objects by type (each ≈ 1 owner reserve):")
        ctx += [f"    {n}× {t}" for t, n in by_type.most_common()]
    cause = (f"A new owned object would drop {who} below its reserve "
             f"({drops_to_xrp(str(need))} XRP needed); short by {drops_to_xrp(str(gap))} XRP.")
    fix = (f"Fund {who} with ≥{drops_to_xrp(str(gap))} XRP, or delete an owned object "
           f"(cancel a stale Offer / remove an unused trust line) to free "
           f"{drops_to_xrp(str(inc))} XRP each.")
    return ctx, cause, fix


def _explain_path(client, body, meta):
    # Path codes fire on more than Payments. Route the non-Payment shapes to
    # recipes that won't give Payment-specific advice (SendMax/Paths/trust lines).
    ttype = body.get("TransactionType")
    if ttype == "CheckCash":
        return _explain_checkcash(client, body, meta)
    if ttype != "Payment":
        return _explain_generic_path(client, body, meta)

    src, dst = body.get("Account"), body.get("Destination")
    amount, send_max = body.get("Amount"), body.get("SendMax")
    src_asset = _asset_of(send_max if send_max is not None else amount)
    dst_asset = _asset_of(amount)
    s_code, d_code = _code(src_asset), _code(dst_asset)
    ctx = [f"Source: {src}", f"Destination: {dst}",
           f"Sending (max): {src_asset[2]}", f"Delivering: {dst_asset[2]}"]
    # Track the most specific blocker found, narrowing the generic "no path".
    blocker = None
    if src_asset[0] != "XRP":
        ln = _find_line(_lines(client, src, src_asset[1]), src_asset[0], src_asset[1])
        if ln is None:
            ctx.append(f"Source has NO {s_code} trust line — can't source this currency.")
            blocker = f"Source holds no {s_code} trust line, so it can't supply the send currency."
        else:
            frozen = ln.get("freeze") or ln.get("freeze_peer")
            try:
                zero = float(ln.get("balance", "0")) == 0
            except (TypeError, ValueError):
                zero = False
            ctx.append(f"Source trust line {s_code}: balance {ln.get('balance')}, "
                       f"limit {ln.get('limit')}" + (" [FROZEN]" if frozen else ""))
            if frozen:
                blocker = f"Source's {s_code} trust line is frozen — funds can't move."
            elif zero:
                blocker = f"Source holds 0 {s_code} — nothing to convert (liquidity is irrelevant)."
    if dst_asset[0] != "XRP":
        ln = _find_line(_lines(client, dst, dst_asset[1]), dst_asset[0], dst_asset[1])
        if ln is None:
            ctx.append(f"Destination has NO {d_code} trust line — can't receive it "
                       f"(unless auto-created).")
            blocker = blocker or (f"Destination has no {d_code} trust line, "
                                  f"so it can't receive the delivered currency.")
        else:
            frozen = ln.get("freeze") or ln.get("freeze_peer")
            ctx.append(f"Destination trust line {d_code}: limit {ln.get('limit')}"
                       + (" [FROZEN]" if frozen else ""))
    if src_asset[:2] != dst_asset[:2]:
        book = _book_state(client, src_asset, dst_asset)
        amm = _amm_state(client, src_asset, dst_asset)
        ctx += [book, amm]
        if blocker is None and "EMPTY" in book and "none" in amm:
            blocker = "No DEX offers and no AMM pool for this pair — zero market liquidity."
    cause = blocker or ("Source, destination, and a market all exist, but no path delivered any "
                        "amount at execution time (e.g. rate moved, or a hop froze).")
    fix = ("Establish the missing trust line, widen SendMax, set tfPartialPayment if "
           "partial delivery is OK, or supply explicit Paths. See tec-codes.md → tecPATH_DRY.")
    return ctx, cause, fix


def _explain_checkcash(client, body, meta):
    code = meta.get("TransactionResult")
    casher = body.get("Account")
    requested = _asset_of(body.get("Amount") or body.get("DeliverMin"))
    ctx = [f"Casher: {casher}", f"Requested: {requested[2]}"]
    check_id = body.get("CheckID")
    node = None
    if check_id:
        r = safe_request(client, LedgerEntry(index=check_id))
        node = r.get("node") if "error" not in r else None
    if not node:
        return (ctx + ["Check object not found (already cashed/cancelled, or wrong CheckID)."],
                "The referenced Check is no longer on-ledger.",
                "Verify the CheckID; a Check can only be cashed once.")
    sender = node.get("Account")
    send_max = _asset_of(node.get("SendMax"))
    ctx += [f"Check sender: {sender}", f"Check SendMax: {send_max[2]}"]
    cause = f"Cashing the Check couldn't deliver the full requested amount ({code})."
    fix = ("Cash a smaller Amount, or use DeliverMin to accept a partial cash. "
           "See tec-codes.md → tecPATH_PARTIAL.")
    if send_max[0] == "XRP":
        acct = fetch_account(client, sender)
        req_drops = int(body.get("Amount")) if isinstance(body.get("Amount"), str) else None
        if acct:
            base, inc = reserve_drops(client)
            bal, owners = int(acct["Balance"]), int(acct.get("OwnerCount", 0))
            spend = max(bal - (base + owners * inc), 0)
            ctx.append(f"Check sender spendable XRP now: {drops_to_xrp(str(spend))}")
            if req_drops is not None and spend < req_drops:
                cause = (f"XRP Check: sender {sender} has only {drops_to_xrp(str(spend))} XRP "
                         f"spendable (above reserve), below the requested {requested[2]} — "
                         f"can't honor it in full.")
                fix = (f"Cash ≤ {drops_to_xrp(str(spend))} XRP, set DeliverMin for a partial cash, "
                       f"or have the sender fund up.")
            else:
                # current state explains a PAST failure: the balance has since recovered.
                cause = (f"XRP Check: sender now has {drops_to_xrp(str(spend))} XRP spendable "
                         f"(≥ the requested {requested[2]}). They were short when the cash ran; "
                         f"spendable balance moves between submission and now.")
                fix = ("Retry the CheckCash — if it still fails, the sender's spendable balance "
                       "dipped below the amount at that moment; use DeliverMin to tolerate it.")
    else:
        iss = send_max[1]
        ln = _find_line(_lines(client, casher, iss), send_max[0], iss)
        if ln is None:
            ctx.append(f"Casher has NO {_code(send_max)} trust line — can't receive this IOU.")
        else:
            ctx.append(f"Casher {_code(send_max)} line: balance {ln.get('balance')}, "
                       f"limit {ln.get('limit')}")
        issinfo = fetch_account(client, iss) if iss else None
        if issinfo and issinfo.get("TransferRate"):
            ctx.append(f"Issuer TransferRate: {issinfo['TransferRate']} "
                       f"(>1e9 means a fee reduces the delivered amount)")
        cause = ("IOU Check: the full amount couldn't be delivered — trust-line limit reached "
                 "or the issuer's transfer fee ate into it.")
    return ctx, cause, fix


def _explain_generic_path(client, body, meta):
    ttype = body.get("TransactionType")
    ctx = [f"Account: {body.get('Account')}", f"Type: {ttype}"]
    return (ctx,
            f"{meta.get('TransactionResult')}: required liquidity/path wasn't available for this {ttype}.",
            f"See tec-codes.md for {ttype}'s path requirements.")


def _explain_trustline(client, body, meta):
    code, ttype = meta.get("TransactionResult"), body.get("TransactionType")
    if ttype == "Payment":
        holder, asset, role = body.get("Destination"), _asset_of(body.get("Amount")), "destination"
    elif ttype == "TrustSet":
        holder, asset, role = body.get("Account"), _asset_of(body.get("LimitAmount")), "sender"
    else:
        holder, asset, role = body.get("Account"), _asset_of(body.get("TakerPays")), "sender"
    cur, iss, disp = asset
    ctx = [f"{role.capitalize()}: {holder}", f"Asset: {disp}"]
    if iss:
        issinfo = fetch_account(client, iss)
        if issinfo:
            iflags = decode_flags(int(issinfo.get("Flags", 0)))
            ctx.append(f"Issuer {iss} flags: {', '.join(iflags) or 'none'}")
            if "lsfRequireAuth" in iflags:
                ctx.append("Issuer has lsfRequireAuth — lines need explicit authorization.")
        ln = _find_line(_lines(client, holder, iss), cur, iss)
        if ln is None:
            ctx.append(f"No {_decode_currency(cur)} trust line between {holder} and the issuer "
                       f"— line is MISSING.")
        else:
            ctx.append(f"Trust line exists: limit {ln.get('limit')}, balance {ln.get('balance')}, "
                       f"authorized={ln.get('authorized', False)}, "
                       f"peer_authorized={ln.get('peer_authorized', False)}.")
    if code == "tecNO_AUTH":
        cause = "Trust line exists but the issuer (lsfRequireAuth) hasn't authorized it."
        fix = "Issuer submits TrustSet with tfSetfAuth to authorize the holder's line."
    elif code == "tecNO_LINE_REDUNDANT":
        cause = "TrustSet tried to reset a line to default, but no line exists to reset."
        fix = "Set a non-default LimitAmount to create the line, or do nothing."
    else:
        cause = "A required trust line does not exist where the transaction needs one."
        fix = "Submit a TrustSet from the holder to the issuer to establish the line."
    return ctx, cause, fix


def _explain_frozen(client, body, meta):
    ttype = body.get("TransactionType")
    asset = _asset_of(body.get("Amount") if ttype == "Payment"
                      else body.get("TakerPays") or body.get("Amount"))
    holder = body.get("Destination") if ttype == "Payment" else body.get("Account")
    cur, iss, disp = asset
    ctx = [f"Asset: {disp}", f"Holder: {holder}"]
    if iss:
        issinfo = fetch_account(client, iss)
        if issinfo:
            iflags = decode_flags(int(issinfo.get("Flags", 0)))
            ctx.append(f"Issuer {iss} flags: {', '.join(iflags) or 'none'}")
            if "lsfGlobalFreeze" in iflags:
                ctx.append("Issuer has GLOBAL FREEZE — all its tokens are frozen.")
        ln = _find_line(_lines(client, holder, iss), cur, iss)
        if ln:
            ctx.append(f"Trust line freeze={ln.get('freeze', False)}, "
                       f"freeze_peer={ln.get('freeze_peer', False)}.")
    cause = "A trust line in the path is frozen (individual, global, or deep freeze)."
    fix = "Issuer must clear the freeze, or route around the issuer. See tec-codes.md → tecFROZEN."
    return ctx, cause, fix


def _explain_dst_tag(client, body, meta):
    dst = body.get("Destination")
    info = fetch_account(client, dst)
    ctx = [f"Destination: {dst}"]
    if info:
        flags = decode_flags(int(info.get("Flags", 0)))
        ctx.append(f"Destination flags: {', '.join(flags) or 'none'}")
        ctx.append(f"lsfRequireDestTag set: {'lsfRequireDestTag' in flags}")
    ctx.append(f"DestinationTag in tx: {body.get('DestinationTag', '(none)')}")
    cause = "Destination requires a DestinationTag and the payment omitted one."
    fix = ("Resubmit with the correct DestinationTag. Confirm the tag with the destination "
           "operator — a wrong tag can credit the wrong account.")
    return ctx, cause, fix


def _explain_no_dst(client, body, meta):
    dst = body.get("Destination")
    base, _ = reserve_drops(client)
    info = fetch_account(client, dst)
    ctx = [f"Destination: {dst}", f"Exists on validated ledger: {bool(info)}",
           f"Base reserve to create an account: {drops_to_xrp(str(base))} XRP"]
    amt = body.get("Amount")
    if isinstance(amt, str):
        ctx.append(f"XRP being sent: {drops_to_xrp(amt)} XRP")
    cause = "Destination account doesn't exist; this payment can't (or doesn't) fund its creation."
    fix = f"Send ≥ {drops_to_xrp(str(base))} XRP (plus a margin) to create the account first."
    return ctx, cause, fix


def _explain_unfunded(client, body, meta):
    src = body.get("Account")
    base, inc = reserve_drops(client)
    acct = fetch_account(client, src)
    amount, send_max = body.get("Amount"), body.get("SendMax")
    pay = _asset_of(send_max if send_max is not None else amount) if amount is not None else None
    ctx = [f"Sender: {src}"]
    if acct:
        bal, owners = int(acct["Balance"]), int(acct.get("OwnerCount", 0))
        held = base + owners * inc
        ctx.append(f"XRP balance {drops_to_xrp(str(bal))}; reserve held {drops_to_xrp(str(held))}; "
                   f"spendable {drops_to_xrp(str(max(bal - held, 0)))} XRP")
    if pay and pay[0] != "XRP":
        ln = _find_line(_lines(client, src, pay[1]), pay[0], pay[1])
        if ln:
            ctx.append(f"Source {_code(pay)} balance: {ln.get('balance')} (limit {ln.get('limit')})")
        else:
            ctx.append(f"Source holds NO {_code(pay)} trust line — can't fund this payment.")
    if pay:
        ctx.append(f"Trying to send: {pay[2]}")
    cause = "Sender doesn't hold enough of the source asset at execution time."
    fix = ("Fund the source, lower the Amount/SendMax, or use tfPartialPayment if partial "
           "delivery is acceptable.")
    return ctx, cause, fix


def _explain_no_permission(client, body, meta):
    """tecNO_PERMISSION spans several unrelated gates — dispatch by tx type."""
    ttype = body.get("TransactionType")
    ctx = [f"Type: {ttype}", f"Account: {body.get('Account')}"]
    if ttype == "Payment":
        dst = body.get("Destination")
        info = fetch_account(client, dst)
        if info:
            flags = decode_flags(int(info.get("Flags", 0)))
            ctx.append(f"Destination {dst} flags: {', '.join(flags) or 'none'}")
            if "lsfDepositAuth" in flags:
                objs = safe_request(client, AccountObjects(account=dst, type="deposit_preauth",
                                                           ledger_index="validated"))
                pre = objs.get("account_objects") or [] if "error" not in objs else []
                authed = body.get("Account") in [o.get("Authorize") for o in pre]
                ctx.append(f"lsfDepositAuth set; DepositPreauth entries: {len(pre)}; "
                           f"sender preauthorized: {authed}")
        cause = "Destination uses DepositAuth and the sender isn't preauthorized."
        fix = "Destination adds a DepositPreauth for the sender (or send from an authorized account)."
    elif ttype in ("EscrowFinish", "EscrowCancel"):
        owner = body.get("Owner")
        objs = safe_request(client, AccountObjects(account=owner, type="escrow",
                                                   ledger_index="validated"))
        escrows = objs.get("account_objects") or [] if "error" not in objs else []
        ctx.append(f"Escrow owner {owner} has {len(escrows)} escrow object(s).")
        cause = "EscrowFinish before FinishAfter, or a missing/incorrect crypto-condition Fulfillment."
        fix = ("Wait until FinishAfter (XRPL epoch), and include the Fulfillment if the escrow "
               "carries a Condition.")
    elif ttype == "NFTokenCreateOffer":
        owner, nft = body.get("Owner"), body.get("NFTokenID", "")
        is_sell = bool(int(body.get("Flags", 0)) & 1)
        nft_flags = int(nft[:4], 16) if len(nft) >= 4 else 0
        transferable = bool(nft_flags & 0x0008)
        holds = None
        ctx.append(f"Offer kind: {'sell' if is_sell else 'buy'}")
        ctx.append(f"NFTokenID flags: 0x{nft_flags:04x} (transferable={transferable})")
        if owner and AccountNFTs is not None:
            nfts = safe_request(client, AccountNFTs(account=owner))
            entries = nfts.get("account_nfts") or [] if "error" not in nfts else []
            holds = any(n.get("NFTokenID") == nft for n in entries)
            ctx.append(f"Named Owner {owner} currently holds the NFT: {holds}")
        if not transferable:
            cause = "NFToken is non-transferable — only offers to/from the issuer are permitted."
            fix = "Route the trade through the issuer; non-transferable NFTs can't trade peer-to-peer."
        elif holds is False:
            cause = "Buy offer names an Owner who no longer holds this NFTokenID."
            fix = "Re-target the offer at the account that currently holds the token."
        else:
            # transferable + (owner verified holding, or not a buy offer): ownership ruled out.
            cause = ("NFT is transferable and the named owner holds it — so this is an issuer-side "
                     "transfer restriction (authorized-minter / domain rules), not an ownership "
                     "or balance problem.")
            fix = "Check the issuer's NFT transfer rules; the token and owner state themselves are fine."
    else:
        cause = f"tecNO_PERMISSION on {ttype}: the account isn't permitted to perform this action."
        fix = "Check this transaction type's permission rules in tec-codes.md → tecNO_PERMISSION."
    return ctx, cause, fix


def _explain_killed(client, body, meta):
    gets, pays = _asset_of(body.get("TakerGets")), _asset_of(body.get("TakerPays"))
    ctx = [f"TakerGets (you receive): {gets[2]}", f"TakerPays (you give): {pays[2]}"]
    if gets[:2] != pays[:2]:
        ctx.append(_book_state(client, pays, gets))
    ctx.append(f"Flags: {body.get('Flags', '(none)')} "
               f"(tfImmediateOrCancel / tfFillOrKill control kill behavior)")
    cause = ("An immediate-or-cancel / fill-or-kill offer matched nothing "
             "(post-ImmediateOfferKilled amendment). Verify the amendment is enabled on this "
             "network with the feature RPC before treating it as anything but expected.")
    fix = "Use tfImmediateOrCancel if partial fill is OK, or place a passive offer to rest on the books."
    return ctx, cause, fix


def _explain_success(client, body, meta):
    amount = body.get("Amount")
    delivered = meta.get("delivered_amount") if isinstance(meta, dict) else None
    ctx = []
    if amount is not None:
        ctx.append(f"Amount requested: {_asset_of(amount)[2]}")
    if delivered is not None:
        ctx.append(f"delivered_amount: {_asset_of(delivered)[2]}")

    def _val(a):
        if isinstance(a, str):
            return int(a)
        if isinstance(a, dict):
            try:
                return float(a.get("value"))
            except (TypeError, ValueError):
                return None
        return None

    av, dv = _val(amount), _val(delivered)
    if av is not None and dv is not None and dv < av:
        ctx.append("delivered < requested → partial delivery (tfPartialPayment) or transfer fee.")
    flags = body.get("Flags")
    if isinstance(flags, int) and flags & 0x00020000:
        ctx.append("tfPartialPayment is SET — credit recipients from delivered_amount, never Amount.")
    cause = ("Transaction succeeded on-ledger. If the outcome looks wrong it's semantic: "
             "partial payment, transfer fee, missing DestinationTag, rippling, or a freeze.")
    fix = ("See semantic-failures.md. Most common: credit from delivered_amount; check the "
           "destination's lsfRequireDestTag; check the issuer's TransferRate.")
    return ctx, cause, fix


def _explain_generic(client, body, meta):
    ctx = [f"Account: {body.get('Account')}", f"Type: {body.get('TransactionType')}"]
    if body.get("Destination"):
        ctx.append(f"Destination: {body.get('Destination')}")
    return (ctx, f"No relational recipe for {meta.get('TransactionResult')} yet.",
            "See the matching references/*.md for the diagnostic recipe.")


_EXPLAIN_RECIPES = {
    "tecINSUFFICIENT_RESERVE": _explain_reserve,
    "tecINSUF_RESERVE_LINE":   _explain_reserve,
    "tecINSUF_RESERVE_OFFER":  _explain_reserve,
    "tecNO_LINE_INSUF_RESERVE": _explain_reserve,
    "tecPATH_DRY":     _explain_path,
    "tecPATH_PARTIAL": _explain_path,
    "tecNO_LINE":           _explain_trustline,
    "tecNO_AUTH":           _explain_trustline,
    "tecNO_LINE_REDUNDANT": _explain_trustline,
    "tecFROZEN":        _explain_frozen,
    "tecNO_PERMISSION": _explain_no_permission,
    "tecDST_TAG_NEEDED": _explain_dst_tag,
    "tecNO_DST":          _explain_no_dst,
    "tecNO_DST_INSUF_XRP": _explain_no_dst,
    "tecUNFUNDED_PAYMENT": _explain_unfunded,
    "tecUNFUNDED_OFFER":   _explain_unfunded,
    "tecUNFUNDED":         _explain_unfunded,
    "tecKILLED":   _explain_killed,
    "tesSUCCESS":  _explain_success,
}


def cmd_explain(client: JsonRpcClient, args) -> int:
    resp = safe_request(client, Tx(transaction=args.hash))
    if "error" in resp:
        msg = resp.get("error_message", resp.get("error"))
        print(_c(f"✗ Could not fetch transaction: {msg}", "31;1"))
        return 1
    meta = resp.get("meta") or {}
    body = resp.get("tx_json") or resp
    # API v2 (xrpl-py 5.x default) renames the Payment `Amount` response field to
    # `DeliverMax`. Normalize so recipes can read `Amount` uniformly.
    if body.get("Amount") is None and body.get("DeliverMax") is not None:
        body = {**body, "Amount": body["DeliverMax"]}
    code = (meta.get("TransactionResult") if isinstance(meta, dict) else None) or "(unknown)"
    summary = ("Transaction succeeded on-ledger." if code == "tesSUCCESS"
               else "Transaction failed on-ledger.")
    facts = [
        f"Hash: {args.hash}",
        f"Type: {body.get('TransactionType', '(unknown)')}",
        f"Account: {body.get('Account', '(unknown)')}",
    ]
    print(_header(code, summary))
    print()
    print(_section("FACTS", facts))

    recipe = _EXPLAIN_RECIPES.get(code, _explain_generic)
    try:
        ctx, cause, fix = recipe(client, body, meta)
    except Exception as exc:  # a recipe bug shouldn't crash the whole report
        ctx, cause, fix = ([f"(context gathering failed: {exc})"],
                           code, "See the matching references/*.md.")
    print()
    print(_section("CONTEXT", ctx))
    print()
    print(_c("→ Cause:", "33;1"), cause)
    print(_c("→ Fix:  ", "32;1"), fix)
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="diagnose.py",
        description="XRPL on-ledger diagnostics. See SKILL.md for context.",
    )
    p.add_argument("--network", default="mainnet",
                   help="mainnet | testnet | devnet | local | <https URL>")
    sub = p.add_subparsers(dest="cmd", required=True)
    s_tx = sub.add_parser("tx", help="Fetch a tx and show its result code and key fields.")
    s_tx.add_argument("hash", help="Transaction hash.")
    s_exp = sub.add_parser("explain",
                           help="Fetch a tx AND the related ledger state explaining why it failed.")
    s_exp.add_argument("hash", help="Transaction hash.")
    s_acct = sub.add_parser("account", help="Snapshot of an account's on-ledger state.")
    s_acct.add_argument("address", help="Account address (r…).")
    s_pat = sub.add_parser("patterns", help="Scan last 50 txs for recurring failures.")
    s_pat.add_argument("address", help="Account address (r…).")
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    client = JsonRpcClient(resolve_network(args.network))
    if args.cmd == "tx":
        return cmd_tx(client, args)
    if args.cmd == "explain":
        return cmd_explain(client, args)
    if args.cmd == "account":
        return cmd_account(client, args)
    if args.cmd == "patterns":
        return cmd_patterns(client, args)
    return 2


if __name__ == "__main__":
    sys.exit(main())

