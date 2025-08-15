---
seo:
    description: Look up pending escrows by sender or destination address.
labels:
  - Escrow
  - Smart Contracts
---
# Look up Escrows

This tutorial shows how to look up outstanding [escrows](../../../../concepts/payment-types/escrow.md) in the XRP Ledger by their sender or recipient's address.

{% admonition type="info" name="Note" %}For escrows that were created _before_ the [fix1523 amendment][] was enabled on 2017-11-14, you can only look up those escrows by sender address, not by the recipient's address.{% /admonition %}

## Goals

By following this tutorial, you should learn how to:

- Read a paginated response from the [account_objects method][].
- Identify when an escrow is mature or if it has expired.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library, such as **xrpl.js**, installed.

##  Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```sh
npm i
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Set up client and account

To get started, import the client library and instantiate an API client. For this tutorial, you also need the address of an account that has one or more pending escrows. The sample code uses a mainnet address that has been set up with at least one incoming and one outgoing escrow that should remain in place until 2035 at least.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/list-escrows.js" language="js" before="// Look up the official close time" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/list_escrows.py" language="py" before="# Look up the official close time" /%}
{% /tab %}
{% /tabs %}

### 3. Get the latest validated ledger

To know if escrows have matured or expired, you need to know the official close time of the most recently validated ledger. Use the [ledger method][] to get the latest validated ledger, and save its `close_time` and `ledger_hash` values to use when looking up escrows.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/list-escrows.js" language="js" from="// Look up the official close time" before="// Look up objects" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/list_escrows.py" language="py" from="# Look up the official close time" before="# Look up objects" /%}
{% /tab %}
{% /tabs %}

### 4. Look up escrows linked to the account

To get a list of all escrows linked to an account, use the [account_objects method][] with the results filtered to the escrow type. The list may be [paginated][Marker], so you may need to make multiple requests to get them all, depending on how many objects are linked to the account. Due to the way filtering works, some pages may be empty even if there are more escrows on later pages.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/list-escrows.js" language="js" from="// Look up objects" before="// Define helper function" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/list_escrows.py" language="py" from="# Look up objects" before="# Define helper function" /%}
{% /tab %}
{% /tabs %}

### 5. Define helper function for displaying amounts

With {% amendment-disclaimer name="TokenEscrow" compact=true /%}, escrows can send three types of funds: XRP, [trust line tokens](../../../../concepts/tokens/fungible-tokens/trust-line-tokens.md), or [multi-purpose tokens](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md). To help handle all three types of amount object, create a function that takes an unknown amount value from the ledger and returns a string containing a display value that is more human-readable.

{% admonition type="info" name="Note" %}This sample function provides only the most basic level of formatting for currency amounts. Better user interfaces can and should provide a higher level of parsing, including normalizing currency codes and looking up MPT information.{% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/list-escrows.js" language="js" from="// Define helper function" before="// Summarize results" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/list_escrows.py" language="py" from="# Define helper function" before="# Summarize results" /%}
{% /tab %}
{% /tabs %}

### 6. Display information about the escrows

Each entry in the list you built earlier should be an [Escrow ledger entry][] sent either to or from the account whose address you specified when looking them up. Use the fields of those objects to display more information about the escrows.

For the `FinishAfter` (maturity time) and `CancelAfter` (expiration time) fields, compare them to the official close time of the most recently validated ledger to see if the escrow has matured or expired, respectively. These fields are formatted natively as [seconds since the Ripple Epoch][], so be sure to convert them to a more human-readable format for display.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/escrow/js/list-escrows.js" language="js" from="// Summarize results" /%}

When done, disconnect the WebSocket client.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/escrow/py/list_escrows.py" language="py" from="# Summarize results" /%}
{% /tab %}
{% /tabs %}


## See Also

- **Concepts:**
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
    - [Escrow ledger entry](../../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
