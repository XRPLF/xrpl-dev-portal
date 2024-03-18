The prerequisites for cashing a check are the same whether you are cashing it for an exact amount or a flexible amount.

- You need the ID of a Check object currently in the ledger.
    - For example, the ID of one Check in these examples is `838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334`, although you must use a different ID to go through these steps yourself.
- The **address** and **secret key** of the Check's stated recipient. The address must match the `Destination` address in the Check object.
- If the Check is for a [token](../concepts/tokens/index.md), you (the recipient) must have a [trust line](../concepts/tokens/fungible-tokens/index.md) to the issuer. Your limit on that trust line must be high enough to hold your previous balance plus the amount you would receive.
- A [secure way to sign transactions](../concepts/transactions/secure-signing.md).
- A [client library](../references/client-libraries.md) that can connect to the XRP Ledger, or [any HTTP or WebSocket client](../tutorials/http-websocket-apis/build-apps/get-started.md).
