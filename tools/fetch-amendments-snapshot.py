#!/usr/bin/env python3
"""
Fetch mainnet amendment data and write to @theme/data/amendments-snapshot.json.

Run on a schedule by .github/workflows/update-amendments-snapshot.yml

Validates the response before writing, so a failed or malformed fetch never
writes over a good snapshot. Always rewrites with a fresh fetched_at (even when the
amendment data is unchanged) so the timestamp reflects data freshness.
"""

import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ENDPOINT = "https://vhs.prod.ripplex.io/v1/network/amendments/vote/main/"
OUT = Path(__file__).resolve().parent.parent / "@theme/data/amendments-snapshot.json"


def main():
    req = urllib.request.Request(ENDPOINT, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.load(resp)

    if (
        data.get("result") != "success"
        or not isinstance(data.get("amendments"), list)
        or not data["amendments"]
    ):
        amendments = data.get("amendments")
        shape = len(amendments) if isinstance(amendments, list) else type(amendments).__name__
        raise RuntimeError(f"Unexpected response shape: result={data.get('result')}, amendments={shape}")

    # Sort by name for stable, reviewable diffs (the render re-sorts for display).
    amendments = sorted(data["amendments"], key=lambda a: a["name"])

    snapshot = {
        "fetched_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "result": data["result"],
        "count": data.get("count", len(amendments)),
        "amendments": amendments,
    }

    OUT.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(amendments)} amendments to {OUT} (fetched_at {snapshot['fetched_at']}).")


if __name__ == "__main__":
    main()
