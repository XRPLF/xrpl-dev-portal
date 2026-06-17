# JSON-RPC / WebSocket API errors

API methods (`account_info`, `submit`, `path_find`, etc.) return a string `error` (e.g. `"actNotFound"`) plus an `error_message`. These are **method-level** errors, meaning the request was malformed, the resource doesn't exist, or the node can't serve you right now.

Transaction-engine errors (`tec*`, `tef*`, `tem*`, `ter*`) are different: they appear **inside** a successful method response under `engine_result`, not as a top-level `error`. If you have an `engine_result`, see [tec-codes.md](tec-codes.md) and [tef-tel-tem-ter-codes.md](tef-tel-tem-ter-codes.md).

## Canonical sources

For the full list of API errors, their formatting, and per-method error definitions, defer to:

- Error formatting: <https://xrpl.org/docs/references/http-websocket-apis/api-conventions/error-formatting>
- Per-method errors: linked from each method's page under <https://xrpl.org/docs/references/http-websocket-apis/public-api-methods>

This file does not redefine errors. It records the few diagnostic recipes where a specific follow-up query disambiguates the failure.

---

## Reading a `submit` response

`submit` can fail at two layers. Read these fields in order:

| Field | What it tells you |
| :---- | :---- |
| `error` | Method-level failure — the request itself was rejected (e.g. `invalidTransaction` for an unparseable blob). Returned *instead of* the `engine_result*` fields, not alongside them. |
| `engine_result` | Tx-engine code: `tesSUCCESS`, `terQUEUED`, or any `tec*` / `tef*` / `tem*` / `ter*`. |
| `engine_result_code` | Numeric form of `engine_result`. |
| `engine_result_message` | Human-readable description of `engine_result`. |

Two responses look similar but mean very different things:

- `engine_result: "temMALFORMED"` and **no** top-level `error` — the request was accepted but the tx is malformed; rejected before broadcast. Fix the tx, resubmit. (A submission that can't even be parsed returns a top-level `error: "invalidTransaction"` *instead of* an `engine_result`.)
- No `error`, `engine_result: "terQUEUED"` — accepted into the queue. Poll `tx` to see when it lands.

---

## Recipes: API errors with a specific follow-up query

For each error below, run the query in the **Check** column before doing anything else. Anything not listed has no special recipe — read `error_message` and consult the canonical source above.

| Error | Check | What it tells you |
| :---- | :---- | :---- |
| `actNotFound` | `server_info` → `network_id`; confirm the address | Account never funded, or wrong network. Account exists only after a payment ≥ `reserve_base_xrp`. |
| `lgrNotFound` | `server_info` → `complete_ledgers` | Requested ledger is outside this node's history range. Use `validated` / `current`, or query a node with deeper history. |
| `noNetwork` / `notSynced` / `notReady` | `server_info` → `server_state` | Healthy values are `full` or `proposing`. Anything else (`disconnected`, `connected`, `syncing`) means this node can't answer authoritatively — switch endpoint or wait. |
| `amendmentBlocked` | `server_info` → `amendment_blocked: true`; `feature` for the list | rippled is too old for an amendment that activated. No workaround other than upgrading rippled. |
| `noPath` (`ripple_path_find` / `path_find`) | `account_lines` on source and destination for the involved currency/issuer; `book_offers` for the cross-currency hops | Same recipe as `tecPATH_DRY`: no trust line, no liquidity, or both. |
| `unknownCmd` / `noPermission` | Confirm the method name; check whether it's admin-only | Admin commands (e.g. `stop`, `ledger_accept`) need an admin port (default 5005 for JSON-RPC, 6006 for WebSocket on local rippled) from an allowlisted IP. |
| `tooBusy` / `slowDown` | None on the server — back off the client | `tooBusy` = node overloaded; `slowDown` = client rate-limited. Retry with exponential backoff or move endpoints. |

For tx-engine errors (`tec*`, `tef*`, `tem*`, `ter*`), see [tec-codes.md](tec-codes.md) and [tef-tel-tem-ter-codes.md](tef-tel-tem-ter-codes.md).
