---
html: look-up-checks-by-recipient.html
parent: use-checks.html
blurb: Get a list of pending checks sent to an account.
labels:
  - Checks
---
# Look Up Checks by Recipient

This tutorial shows how to look up [Checks](checks.html) by their recipient. You may also want to [look up Checks by sender](look-up-checks-by-sender.html).

## 1. Look up all Checks for the address

To get a list of all incoming and outgoing Checks for an account, use the `account_objects` command with the recipient account's address and set the `type` field of the request to `checks`.

<!-- Moved this note to the account_objects method page. -->
**Note:** The commandline interface to the `account_objects` command does not accept the `type` field. You can use the [json method][] to send the JSON-RPC format request on the commandline instead.

### Example Request

<!-- MULTICODE_BLOCK_START -->

*ripple-lib 1.x*

```js
{% include '_code-samples/checks/js/getChecks.js' %}
```

*JSON-RPC*

```json
{% include '_code-samples/checks/json-rpc/account_objects-req.json' %}
```

<!-- MULTICODE_BLOCK_END -->

### Example Response

<!-- MULTICODE_BLOCK_START -->

*ripple-lib 1.x*

```
{% include '_code-samples/checks/js/get-checks-resp.txt' %}
```

*JSON-RPC*

```json
200 OK

{% include '_code-samples/checks/json-rpc/account_objects-resp.json' %}
```

<!-- MULTICODE_BLOCK_END -->


## 2. Filter the responses by recipient

The response may include Checks where the account from the request is the sender and Checks where the account is the recipient. Each member of the `account_objects` array of the response represents one Check. For each such Check object, the address in the `Destination` is address of that Check's recipient.

The following pseudocode demonstrates how to filter the responses by recipient:

```js
recipient_address = "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za"
account_objects_response = get_account_objects({
    account: recipient_address,
    ledger_index: "validated",
    type: "check"
})

for (i=0; i < account_objects_response.account_objects.length; i++) {
  check_object = account_objects_response.account_objects[i]
  if (check_object.Destination == recipient_address) {
    log("Check to recipient:", check_object)
  }
}
```

<!--{# common links #}-->
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled-api-links.md' %}
