---
seo:
    description: Use Tickets to send a transaction outside the normal Sequence order.
labels:
  - Accounts
  - Transactions
---
# Use Tickets

[Tickets](../../../concepts/accounts/tickets.md) let you reserve Sequence numbers in advance so you can send transactions out of order. This is useful when collecting signatures on multi-signed transactions while normal account activity continues, or queuing transactions for later submission.

This tutorial walks through creating a batch of Tickets, using one in a transaction, and applying the same pattern to multi-signed workflows.

{% amendment-disclaimer name="TicketBatch" /%}

## Goals

By the end of this tutorial, you will be able to:

- Create Tickets to reserve Sequence numbers for future use.
- Use a Ticket to send a transaction outside the normal Sequence order.

## Prerequisites

To complete this tutorial, you need:

- A basic understanding of the XRP Ledger.
- A basic understanding of how [Sequence numbers](../../../references/protocol/data-types/basic-data-types.md#account-sequence) work in transactions.
- An XRP Ledger [client library](../../../references/client-libraries.md) set up.
- (Optional) A basic understanding of [multi-signing](../../../concepts/accounts/multi-signing.md), if you plan to combine it with Tickets.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/use-tickets/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

Install dependencies for your language from the code sample folder.

{% tabs %}
{% tab label="JavaScript" %}
```sh
npm install
```
{% /tab %}
{% tab label="Python" %}
```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% tab label="Go" %}
```sh
go mod download
```
{% /tab %}
{% /tabs %}

### 2. Set up client and account

Import the XRPL client library, connect to the network, and generate a test account funded by the [Testnet](../../../concepts/networks-and-servers/parallel-networks.md) faucet. Using a live test network lets you submit transactions without risking real XRP.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" before="// Create Tickets" language="js" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/use-tickets/py/use-tickets.py" before="# Create Tickets" language="py" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/use-tickets/go/main.go" before="// Create Tickets" language="go" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
When you're building production-ready software, use an existing account and manage your keys using a [secure signing configuration](../../../concepts/transactions/secure-signing.md).
{% /admonition %}

### 3. Create Tickets

Send a [TicketCreate transaction][] and set the `TicketCount` field to the number of Tickets you want to create (up to 250 per account). Each new Ticket reserves a future [Sequence Number][] you can use later. Each Ticket also counts toward your account's [owner reserve](../../../concepts/accounts/reserves.md), which is released when the Ticket is used. Tickets stay reserved on the ledger until you consume them, regardless of any other transactions your account sends.

Submit the transaction and wait for validation. For example, to create 10 Tickets:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Create Tickets" before="// Check Available Tickets" language="js" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/use-tickets/py/use-tickets.py" from="# Create Tickets" before="# Check Available Tickets" language="py" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/use-tickets/go/main.go" from="// Create Tickets" before="// Check Available Tickets" language="go" /%}
{% /tab %}
{% /tabs %}

{% admonition type="info" name="Note" %}
A transaction is not final until it is validated by [consensus](../../../concepts/consensus-protocol/index.md), which typically occurs 4-7 seconds after submission. The submit-and-wait call above blocks until validation completes, so the validated result is already available.

For production code that needs to handle longer waits or transaction expiration, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).
{% /admonition %}

### 4. Check available Tickets

To send a Ticketed transaction, you need a Ticket Sequence number. Use the [account_objects method][] to list your Tickets. See the method's [Response Format](../../../references/http-websocket-apis/public-api-methods/account-methods/account_objects.md#response-format) for the response shape.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Check Available Tickets" before="// Use a Ticket" language="js" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/use-tickets/py/use-tickets.py" from="# Check Available Tickets" before="# Use a Ticket" language="py" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/use-tickets/go/main.go" from="// Check Available Tickets" before="// Use a Ticket" language="go" /%}
{% /tab %}
{% /tabs %}

You can repeat the next step as long as you have unused Tickets.

### 5. Use a Ticket

Now that you have a Ticket available, you can use it in a transaction. This can be any [type of transaction](../../../references/protocol/transactions/types/index.md). You can use Tickets in any order, but each can only be used once. For the multi-signing variant, see [With Multi-Signing](#with-multi-signing) below.

{% admonition type="info" name="The Ticket pattern" %}
For any transaction that uses a Ticket, set the `Sequence` field to `0` and include a `TicketSequence` field with one of your available Ticket Sequence numbers.
{% /admonition %}

The following example uses an [AccountSet transaction][] with no fields set, making it a no-op that requires no setup. Ticketed transactions go through the same [consensus](../../../concepts/consensus-protocol/index.md) process as Sequenced transactions.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Use a Ticket" language="js" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/use-tickets/py/use-tickets.py" from="# Use a Ticket" language="py" /%}
{% /tab %}
{% tab label="Go" %}
{% code-snippet file="/_code-samples/use-tickets/go/main.go" from="// Use a Ticket" language="go" /%}
{% /tab %}
{% /tabs %}

After the transaction is validated, the Ticket is consumed and removed from the ledger. The available Ticket count drops by one.

{% admonition type="success" name="Tip" %}
You can use this same pattern to cancel an unused Ticket — just send a no-op AccountSet using the Ticket you no longer need.
{% /admonition %}

## With Multi-Signing

Reserve a Ticket for each [multi-signed transaction](../../../concepts/accounts/multi-signing.md) to hold its slot while you collect signatures. Then submit each transaction as soon as its signatures are complete, in any order.

In this scenario, [step 5: Use a Ticket](#5-use-a-ticket) becomes a multi-step process: prepare the transaction, circulate it among signers, and combine their signatures. See [Send a Multi-Signed Transaction](../../best-practices/key-management/send-a-multi-signed-transaction.md) for more details.

For complete working examples that combine Tickets and multi-signing, see `use-tickets-multisig.js` (JavaScript) or `use-tickets-to-multisign.py` (Python) in the [code samples directory](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/use-tickets/). A Go variant isn't currently available.

You can prepare multiple multi-signed transactions simultaneously, each using a different Ticket.

{% admonition type="success" name="Tip" %}
For this scenario, omit the `LastLedgerSequence` field so that the transaction does not expire while you collect signatures. How you do this varies by library:

- **xrpl.js:** Specify `"LastLedgerSequence": null` when auto-filling the transaction.
- **xrpl-py:** Set `last_ledger_sequence=None` on the transaction.
- **xrpl-go:** Leave the field unset before signing.
- **`rippled` directly:** Omit the field from the prepared instructions. The server doesn't provide a default.
{% /admonition %}

## See Also

- **Concepts:**
    - [Tickets](../../../concepts/accounts/tickets.md)
    - [Multi-Signing](../../../concepts/accounts/multi-signing.md)
    - [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md)
- **Tutorials:**
    - [Set Up Multi-Signing](../../best-practices/key-management/set-up-multi-signing.md)
    - [Send a Multi-Signed Transaction](../../best-practices/key-management/send-a-multi-signed-transaction.md)
- **References:**
    - [account_objects method][]
    - [TicketCreate transaction][]
    - [Transaction Common Fields][common fields]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
