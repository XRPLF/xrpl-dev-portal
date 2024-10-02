---
seo:
    description: Get a list of pending checks sent from or to an account.
labels:
  - Checks
---
# Look Up Checks

This tutorial shows how to look up [Checks](../../../../concepts/payment-types/checks.md) by their sender or recipient, in JavaScript.

## Prerequisites

- You should be familiar with the basics of using the [xrpl.js client library](../../../javascript/build-apps/get-started.md).
- To get any results, the addresses you're looking up must have at least one Check entry in the ledger. See also: [Send a Check](./send-a-check.md).

## Source Code

The complete source code for this tutorial is available in the source repository for this website:

{% repo-link path="_code-samples/checks/js/" %}Checks sample code{% /repo-link %}

## Steps

### 1. Look up all Checks for the address

To get a list of all incoming and outgoing Checks for an account, use the `account_objects` command and set the `type` field of the request to `checks`. You may need to make multiple requests if the result is [paginated](../../../../references/http-websocket-apis/api-conventions/markers-and-pagination.md).

{% code-snippet file="/_code-samples/checks/js/get-checks.js" from="// Loop through account objects" before="// Filter results" /%}


### 2. Filter the responses by recipient

The response may include Checks where the account from the request is the sender or the recipient. Each member of the `account_objects` array of the response represents one Check. For each such Check object, the address in the `Destination` is address of that Check's recipient, such as in the following code:

{% code-snippet file="/_code-samples/checks/js/get-checks.js" from="// Filter results" before="// Disconnect" /%}

To filter by sender, check the address in the `Account` field of the Check instead.

{% admonition type="success" name="tip" %}For each Check entry in the results, the Check's ID is in the `index` field. You'll need this value to cash or cancel the Check.{% /admonition %}


{% raw-partial file="/docs/_snippets/common-links.md" /%}
