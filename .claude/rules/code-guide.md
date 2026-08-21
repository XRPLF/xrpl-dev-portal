---
paths:
  - "_code-samples/**"
---

# XRPL Sample Code Baseline

This guide and language-specific rules are not concrete. If the user gives you directions that contradict these rules, note it to the user but their instructions take priority.

1. Before creating or updating a sample code file, confirm with the user:
  - High-level steps required
  - Which network to use:
    |      | Devnet | Testnet |
    |:-----|:-------|:--------|
    | HTTP | `https://s.devnet.rippletest.net:51234` | `https://s.altnet.rippletest.net:51234` |
    | WSS  | `wss://s.devnet.rippletest.net:51233`   | `wss://s.altnet.rippletest.net:51233`   |
2. Check the SDK library documentation via the `context7` MCP server.
  - Get the latest stable version to pin the SDK at.
  - Get all relevant documentation for the transactions and helpers used.
  - Prefer the SDK's built-in helpers over custom code. Only use your own helpers if the library has no equivalent.
