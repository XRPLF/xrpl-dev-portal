# Look Up Checks by Sender

_Requires the [Checks amendment][]._

This tutorial shows how to look up [Checks](checks.html) by their sender. You may also want to [look up Checks by recipient](look-up-checks-by-recipient.html).

## 1. Look up all Checks for the address

<!--{# TODO: Update if https://github.com/ripple/rippled/issues/2443 gets done #}-->

To get a list of all incoming and outgoing Checks for an account, use the `account_objects` command with the sending account's address and set the `type` field of the request to `checks`.

**Note:** The commandline interface to the `account_objects` command does not accept the `type` field. You can use the [json method][] to send the JSON-RPC format request on the commandline instead.

**Caution:** RippleAPI does not have built-in support for the `account_objects` method. You can make a raw request in the WebSocket format using the `api.connection.request(websocket_request_json)` method. The response to this method is in the `rippled` API format. (For example, XRP is specified in integer "drops" rather than as a decimal.)

### Example Request

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

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

*RippleAPI*

```
{% include '_code-samples/checks/js/get-checks-resp.txt' %}
```

*JSON-RPC*

```json
200 OK

{% include '_code-samples/checks/json-rpc/account_objects-resp.json' %}
```

<!-- MULTICODE_BLOCK_END -->

## 2. Filter the responses by sender

The response may include Checks where the account from the request is the sender and Checks where the account is the recipient. Each member of the `account_objects` array of the response represents one Check. For each such Check object, the address in the `Account` is address of that Check's sender.

The following pseudocode demonstrates how to filter the responses by sender:

```js
sender_address = "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za"
account_objects_response = get_account_objects({
    account: sender_address,
    ledger_index: "validated",
    type: "check"
})

for (i=0; i < account_objects_response.account_objects.length; i++) {
  check_object = account_objects_response.account_objects[i]
  if (check_object.Account == sender_address) {
    log("Check from sender:", check_object)
  }
}
```

<!--{# common links #}-->
[RippleAPI]: rippleapi-reference.html
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled-api-links.md' %}
