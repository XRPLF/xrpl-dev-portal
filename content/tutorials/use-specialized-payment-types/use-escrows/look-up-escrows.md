---
html: look-up-escrows.html
parent: use-escrows.html
blurb: Look up pending escrows by sender or destination address.
labels:
  - Escrow
  - Smart Contracts
---
# Look up Escrows

All pending escrows are stored in the ledger as [Escrow objects](escrow.html). You can look them up by the sender's address or the destination address.

**Note:** You can only look up pending escrow objects by destination address if those escrows were created after the [fix1523 amendment][] was enabled on 2017-11-14.

Use the [account_objects method][], where the sender or destination address is the `account` value.

Request:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include '_code-samples/escrow/websocket/account_objects-request.json' %}
```

<!-- MULTICODE_BLOCK_END -->

The response includes all pending escrow objects with `rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`, where the sender address is the `Account` value, or the destination address is the `Destination` value.

Response:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include '_code-samples/escrow/websocket/account_objects-response.json' %}
```

<!-- MULTICODE_BLOCK_END -->



## See Also

- **Concepts:**
    - [What is XRP?](what-is-xrp.html)
    - [Payment Types](payment-types.html)
        - [Escrow](escrow.html)
- **Tutorials:**
    - [Send XRP](send-xrp.html)
    - [Look Up Transaction Results](look-up-transaction-results.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
- **References:**
    - [EscrowCancel transaction][]
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [account_objects method][]
    - [tx method][]
    - [Escrow ledger object](escrow-object.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
