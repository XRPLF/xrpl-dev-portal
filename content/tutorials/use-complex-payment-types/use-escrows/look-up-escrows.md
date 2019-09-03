# Look up escrows

All pending escrows are stored in the ledger as [Escrow objects](escrow.html).

You can look up escrow objects by the [sender's address](#look-up-escrows-by-sender-address) or the [destination address](#look-up-escrows-by-destination-address) using the [account_objects method][].

## Look up escrows by sender address

You can use the [account_objects method][] to look up escrow objects by sender address.

Let's say that you want to look up all pending escrow objects with a sender address of `rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`. You can do this using the following example request, where the sender address is the `account` value.

Request:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include '_code-samples/escrow/websocket/account_objects-request.json' %}
```

<!-- MULTICODE_BLOCK_END -->


The response resembles the following example. Note that the response includes all pending escrow objects with `rfztBskAVszuS3s5Kq7zDS74QtHrw893fm` as the sender or destination address, where the sender address is the `Account` value and the destination address is the `Destination` value.

In this example, the second and fourth escrow objects meet our lookup criteria because their `Account` (sender address) values are set to `rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`.

Response:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include '_code-samples/escrow/websocket/account_objects-response.json' %}
```

<!-- MULTICODE_BLOCK_END -->

## Look up escrows by destination address

You can use the [account_objects method][] to look up escrow objects by destination address.

**Note:** You can only look up pending escrow objects by destination address if those escrows were created after the [fix1523 amendment][] was enabled on 2017-11-14.

Let's say that you want to look up all pending escrow objects with a destination address of `rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`. You can do this using the following example request, where the destination address is the `account` value.

Request:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include '_code-samples/escrow/websocket/account_objects-request.json' %}
```

<!-- MULTICODE_BLOCK_END -->


The response resembles the following example. Note that the response includes all pending escrow objects with `rfztBskAVszuS3s5Kq7zDS74QtHrw893fm` as the destination or sender address, where the destination address is the `Destination` value and the sender address is the `Account` value.

In this example, the first and third escrow objects meet our lookup criteria because their `Destination` (destination address) values are set to `rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`.

Response:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include '_code-samples/escrow/websocket/account_objects-response.json' %}
```

<!-- MULTICODE_BLOCK_END -->



## See Also

- **Concepts:**
    - [XRP](xrp.html)
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
