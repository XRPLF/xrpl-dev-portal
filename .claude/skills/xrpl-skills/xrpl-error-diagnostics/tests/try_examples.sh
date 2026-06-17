#!/usr/bin/env bash
#
# Walk through the skill's scenarios. The script-based examples run live against
# mainnet; the model-routing examples are printed as prompts to paste into a
# Claude Code session that has the xrpl-error-diagnostics skill loaded.
#
#   ./tests/try_examples.sh            # run everything
#   ./tests/try_examples.sh scripts    # only the runnable script examples
#   ./tests/try_examples.sh prompts    # only the copy-paste model prompts
#
set -u
cd "$(dirname "$0")/.." || exit 1

PY="scripts/.venv/bin/python"
[ -x "$PY" ] || PY="python"   # fall back to whatever python is on PATH

# A single, healthy node — avoids xrplcluster.com's load-balancer occasionally
# routing to an amendment-blocked node. Override with: NET=<url> ./try_examples.sh
NET="${NET:-https://s1.ripple.com:51234}"

# Real failed mainnet tx hashes (on-ledger forever, so stable as fixtures).
# Refresh with: see the discovery query in tests/README if a public node prunes them.
TX_KILLED=013AC99E3453AEF27F7AC5D3D6267E042D759221BB1F715B4A6C1DCC6ACD9FF7
TX_PATH_DRY=05E37E7369F82500E967899F8A24A49ACFB1124DF2E99FF806C255BE0EC147D0
TX_DST_TAG=2BF5CF82007A5CD92AAEA34B60C4AAEA1D0E96CE9EB3FADB0A8AFADAA9D6E735
ACCT=rUftBQjFSdXyjRCdi2P5NQxj57VhpPmPSU   # an active account, for account/patterns

run() {  # run <description> <command...>
  echo
  echo "=============================================================="
  echo "▶ $1"
  echo "  \$ ${*:2}"
  echo "--------------------------------------------------------------"
  "${@:2}"
}

scripts_suite() {
  run "tx hash → diagnose.py extracts the on-ledger result code (tecPATH_DRY)" \
    $PY scripts/diagnose.py --network "$NET" tx "$TX_PATH_DRY"
  run "tx hash → tecDST_TAG_NEEDED" \
    $PY scripts/diagnose.py --network "$NET" tx "$TX_DST_TAG"
  run "tx hash → tecKILLED" \
    $PY scripts/diagnose.py --network "$NET" tx "$TX_KILLED"
  run "explain → tecPATH_DRY with related state (lines / book / AMM) + specific cause" \
    $PY scripts/diagnose.py --network "$NET" explain "$TX_PATH_DRY"
  run "explain → tecDST_TAG_NEEDED confirms destination's lsfRequireDestTag flag" \
    $PY scripts/diagnose.py --network "$NET" explain "$TX_DST_TAG"
  run "explain → tecKILLED checks the order book + amendment context" \
    $PY scripts/diagnose.py --network "$NET" explain "$TX_KILLED"
  run "account → live reserve / spendable / flag snapshot" \
    $PY scripts/diagnose.py --network "$NET" account "$ACCT"
  run "patterns → recurring failures across recent history" \
    $PY scripts/diagnose.py --network "$NET" patterns "$ACCT"
  run "error_stats → most common on-ledger errors (last 12 months)" \
    $PY scripts/error_stats.py --top 8
  run "error_stats → markdown format, 30-day window" \
    $PY scripts/error_stats.py --last-days 30 --top 5 --format md
}

prompts_suite() {
  cat <<'EOF'

==============================================================
▶ MODEL-ROUTING SCENARIOS (paste each into Claude Code with the skill loaded)
   Check the response does what's in [expect].
--------------------------------------------------------------

1. Bare result code
   PROMPT: "I got tecINSUFFICIENT_RESERVE submitting a TrustSet. What's wrong?"
   [expect] Opens tec-codes.md; gives the reserve formula and asks for / uses
            the account address; no generic "check your reserve" hand-waving.

2. API (method-level) error
   PROMPT: "account_info returns actNotFound for an address I'm sure exists."
   [expect] api-errors.md; distinguishes method-level error from a tx result
            code; suggests network mismatch / unfunded account checks.

3. Symptom only
   PROMPT: "I sent XRP to an exchange and they say they never got it. The tx
            shows tesSUCCESS though."
   [expect] semantic-failures.md (missing DestinationTag case); asks for the
            tx hash or address.

4. Amendment / "is this a bug?"
   PROMPT: "tfImmediateOrCancel offer returns tecKILLED on mainnet but it
            worked on an older network. Is this a bug?"
   [expect] Explains the ImmediateOfferKilled amendment; suggests the `feature`
            RPC to confirm enabled status. Does NOT call it a bug.

5. NEGATIVE — must decline, not invent an on-ledger cause
   PROMPT: "My transactions never confirm. I'm connecting to
            wss://s.altnet.rippletest.net but my account is on mainnet."
   [expect] Identifies a client/network misconfiguration (wrong endpoint),
            says the on-ledger state is fine, and stops — no fabricated
            tec/tef diagnosis.

EOF
}

case "${1:-all}" in
  scripts) scripts_suite ;;
  prompts) prompts_suite ;;
  all)     scripts_suite; prompts_suite ;;
  *) echo "usage: $0 [scripts|prompts|all]"; exit 2 ;;
esac
