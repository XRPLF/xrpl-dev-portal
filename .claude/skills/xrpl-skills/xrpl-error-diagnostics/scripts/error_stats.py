#!/usr/bin/env python3
"""Rank the most common on-ledger XRPL transaction errors from real network data.

Source of truth: XRPScan's daily result-code time series
(https://api.xrpscan.com/api/v1/metrics/result), which counts every transaction
result recorded on-ledger since 2013. Only `tec*` codes and `tesSUCCESS` appear
here — pre-flight rejections (`tem*`/`tef*`/`tel*`/`ter*`) and API errors are NOT
on-ledger and so cannot be counted from this source.

**Mainnet only, by design.** XRPScan covers Mainnet, and a network-wide error
baseline is only meaningful there: Testnet/Devnet traffic is dominated by
whatever bot or amendment test is running that week, so an aggregate "how common
is this error" figure for a test network measures the bot, not real developer
patterns. There is also no historical metrics API for the test networks. To help
a developer on Testnet or Devnet, diagnose their *specific* transaction or
account instead — `diagnose.py tx|explain|account|patterns --network testnet`
(or `devnet`) query the node directly and work on every network.

Companion to diagnose.py: this tells you *which* tec errors are common; diagnose.py
explains *why* a specific one fired.
"""
from __future__ import annotations

import argparse
import collections
import datetime as dt
import json
import sys
import urllib.request

ENDPOINT = "https://api.xrpscan.com/api/v1/metrics/result"
SUCCESS = "tesSUCCESS"


def fetch(url: str, timeout: int) -> list[dict]:
    # XRPScan returns 403 to the default urllib User-Agent; send an explicit one.
    req = urllib.request.Request(url, headers={"User-Agent": "xrpl-error-diagnostics/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


def in_range(date_str: str, since: str | None, until: str | None) -> bool:
    day = date_str[:10]
    if since and day < since:
        return False
    if until and day > until:
        return False
    return True


def tally(rows: list[dict], since: str | None, until: str | None) -> collections.Counter:
    counts: collections.Counter = collections.Counter()
    for row in rows:
        if not in_range(row["date"], since, until):
            continue
        for code, n in row["result"].items():
            counts[code] += n
    return counts


def build_report(counts: collections.Counter, top: int) -> dict:
    total = sum(counts.values())
    failures = {k: v for k, v in counts.items() if k != SUCCESS}
    fail_total = sum(failures.values())
    ranked = sorted(failures.items(), key=lambda kv: -kv[1])[:top]
    return {
        "total_transactions": total,
        "successful": counts.get(SUCCESS, 0),
        "failed": fail_total,
        "failure_rate_pct": round(100 * fail_total / total, 2) if total else 0.0,
        "top_errors": [
            {
                "code": code,
                "count": n,
                "pct_of_failures": round(100 * n / fail_total, 2) if fail_total else 0.0,
                "pct_of_all_tx": round(100 * n / total, 4) if total else 0.0,
            }
            for code, n in ranked
        ],
    }


def print_markdown(report: dict, since: str | None, until: str | None) -> None:
    span = f"{since or 'start'} → {until or 'today'}"
    print(f"**XRPL on-ledger transaction results** (mainnet, {span})")
    print(
        f"\nTotal: {report['total_transactions']:,} · "
        f"failed (tec): {report['failed']:,} ({report['failure_rate_pct']}%)\n"
    )
    print("| Code | Count | % of failures | % of all tx |")
    print("| :--- | ---: | ---: | ---: |")
    for e in report["top_errors"]:
        print(
            f"| `{e['code']}` | {e['count']:,} | "
            f"{e['pct_of_failures']}% | {e['pct_of_all_tx']}% |"
        )


def print_table(report: dict, since: str | None, until: str | None) -> None:
    span = f"{since or 'start'} → {until or 'today'}"
    print(f"XRPL on-ledger transaction results  [mainnet, {span}]")
    print(
        f"  total: {report['total_transactions']:,}  |  "
        f"failed (tec): {report['failed']:,}  "
        f"({report['failure_rate_pct']}%)\n"
    )
    print(f"  {'code':<28}{'count':>14}{'% of fails':>12}{'% of all tx':>13}")
    print(f"  {'-'*28}{'-'*14:>14}{'-'*12:>12}{'-'*13:>13}")
    for e in report["top_errors"]:
        print(
            f"  {e['code']:<28}{e['count']:>14,}"
            f"{e['pct_of_failures']:>11}%{e['pct_of_all_tx']:>12}%"
        )


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--since", help="ISO date (YYYY-MM-DD) lower bound, inclusive")
    p.add_argument("--until", help="ISO date (YYYY-MM-DD) upper bound, inclusive")
    p.add_argument("--last-days", type=int, help="only the last N days (overrides --since); default 365")
    p.add_argument("--all", action="store_true", help="use the full history (2013-present)")
    p.add_argument("--top", type=int, default=15, help="how many error codes to show (default 15)")
    p.add_argument("--format", choices=["table", "md", "json"], default="table")
    p.add_argument("--timeout", type=int, default=60)
    p.add_argument("--url", default=ENDPOINT, help="override the metrics endpoint")
    args = p.parse_args(argv)

    try:
        rows = fetch(args.url, args.timeout)
    except Exception as exc:  # network / JSON failure — report, don't traceback
        print(f"error: failed to fetch {args.url}: {exc}", file=sys.stderr)
        return 1
    if not rows:
        print("error: endpoint returned no data", file=sys.stderr)
        return 1

    # Window precedence: --all > --last-days > --since > default (last 12 months).
    since = args.since
    days = args.last_days
    if days is None and args.since is None and not args.all:
        days = 365  # default window: last 12 months
    if not args.all and days is not None:
        last_day = dt.date.fromisoformat(rows[-1]["date"][:10])
        since = (last_day - dt.timedelta(days=days)).isoformat()

    counts = tally(rows, since, args.until)
    report = build_report(counts, args.top)
    report["range"] = {"since": since, "until": args.until, "network": "mainnet"}

    if args.format == "json":
        print(json.dumps(report, indent=2))
    elif args.format == "md":
        print_markdown(report, since, args.until)
    else:
        print_table(report, since, args.until)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
