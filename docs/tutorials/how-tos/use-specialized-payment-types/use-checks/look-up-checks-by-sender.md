---
html: look-up-checks-by-sender.html
parent: use-checks.html
seo:
    description: Get a list of pending Checks sent by an account.
labels:
  - Checks
---
# Look Up Checks by Sender

This tutorial shows how to look up [Checks](../../../../concepts/payment-types/checks.md) by their sender. You may also want to [look up Checks by recipient](look-up-checks-by-recipient.md).

## 1. Look up all Checks for the address

To get a list of all incoming and outgoing Checks for an account, use the `account_objects` command with the sending account's address and set the `type` field of the request to `checks`.


### Example Request

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/getChecks.js" language="js" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_code-samples/checks/json-rpc/account_objects-req.json" language="json" /%}
{% /tab %}

{% /tabs %}

### Example Response

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/get-checks-resp.txt" language="" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_code-samples/checks/json-rpc/account_objects-resp.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

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

{% raw-partial file="/docs/_snippets/common-links.md" /%}
