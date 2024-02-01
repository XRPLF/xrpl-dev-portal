---
html: look-up-escrows.html
parent: use-escrows.html
seo:
    description: Look up pending escrows by sender or destination address.
labels:
  - Escrow
  - Smart Contracts
---
# Look up Escrows

All pending escrows are stored in the ledger as [Escrow objects](../../../../concepts/payment-types/escrow.md). You can look them up by the sender's address or the destination address.

**Note:** You can only look up pending escrow objects by destination address if those escrows were created after the [fix1523 amendment][] was enabled on 2017-11-14.

Use the [account_objects method][], where the sender or destination address is the `account` value.

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-request.json" language="json" /%}
{% /tab %}

{% /tabs %}

The response includes all pending escrow objects with `rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`, where the sender address is the `Account` value, or the destination address is the `Destination` value.

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-response.json" language="json" /%}
{% /tab %}

{% /tabs %}



## See Also

- **Concepts:**
    - [What is XRP?](../../../../introduction/what-is-xrp.md)
    - [Payment Types](../../../../concepts/payment-types/index.md)
        - [Escrow](../../../../concepts/payment-types/escrow.md)
- **Tutorials:**
    - [Send XRP](../../send-xrp.md)
    - [Look Up Transaction Results](../../../../concepts/transactions/finality-of-results/look-up-transaction-results.md)
    - [Reliable Transaction Submission](../../../../concepts/transactions/reliable-transaction-submission.md)
- **References:**
    - [EscrowCancel transaction][]
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [account_objects method][]
    - [tx method][]
    - [Escrow ledger object](../../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
