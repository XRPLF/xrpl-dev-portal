---
html: use-tickets.html
parent: manage-account-settings.html
seo:
    description: Use Tickets to send a transaction outside of normal Sequence order.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Accounts
steps: ['Generate', 'Connect', 'Check Sequence', 'Prepare & Sign', 'Submit', 'Wait', 'Intermission', 'Check Tickets', 'Prepare Ticketed Tx', 'Submit Ticketed Tx', 'Wait Again']
---
# Use Tickets

[Tickets](../../../concepts/accounts/tickets.md) provide a way to send transactions out of the normal order. This tutorial walks through the steps of creating a Ticket, then using it to send another transaction.

## Prerequisites

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript" src="/js/tutorials/use-tickets.js"></script>

This page provides JavaScript examples that use the [xrpl.js](https://js.xrpl.org/) library. See [Get Started Using JavaScript](../../javascript/build-apps/get-started.md) for setup instructions.

Since JavaScript works in the web browser, you can read along and use the interactive steps without any setup.



## Steps

This tutorial is divided into a few phases:

- (Steps 1-2) **Setup:** You need an XRP Ledger address and secret. For production, you can use the same address and secret consistently. For this tutorial, you can generate new test credentials as needed. You also need to be connected to the network.
- (Steps 3-6) **Create Tickets:** Send a transaction to set aside some Tickets.
- (Optional) **Intermission:** After creating Tickets, you can send various other transactions at any time before, during, and after the following steps.
- (Steps 7-10) **Use Ticket:** Use one of your set-aside Tickets to send a transaction. You can repeat these steps while skipping the previous parts as long as you have at least one Ticket remaining to use.

### 1. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. For development purposes, you can get these on the [Testnet](../../../concepts/networks-and-servers/parallel-networks.md) using the following interface:

{% partial file="/docs/_snippets/interactive-tutorials/generate-step.md" /%}

When you're building production-ready software, you should use an existing account, and manage your keys using a [secure signing configuration](../../../concepts/transactions/secure-signing.md).


### 2. Connect to Network

You must be connected to the network to submit transactions to it. Since Tickets are only available on Devnet so far, you should connect to a Devnet server. For example:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Connect to" before="// Get credentials" language="js" /%}
{% /tab %}

{% /tabs %}

**Note:** The code samples in this tutorial use JavaScript's [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

For this tutorial, click the following button to connect:

{% partial file="/docs/_snippets/interactive-tutorials/connect-step.md" /%}


### 3. Check Sequence Number

Before you create any Tickets, you should check what [Sequence Number][] your account is at. You want the current Sequence number for the next step, and the Ticket Sequence numbers it sets aside start from this number.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Check Sequence" before="// Prepare and Sign TicketCreate" language="js" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Check Sequence" steps=$frontmatter.steps %}

<button id="check-sequence" class="btn btn-primary previous-steps-required">Check Sequence Number</button>

{% loading-icon message="Querying..." /%}

<div class="output-area"></div>

{% /interactive-block %}



### 4. Prepare and Sign TicketCreate

Construct a [TicketCreate transaction][] using the sequence number you determined in the previous step. Use the `TicketCount` field to specify how many Tickets to create. For example, to prepare a transaction that would make 10 Tickets:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Prepare and Sign TicketCreate" before="// Submit TicketCreate" language="js" /%}
{% /tab %}

{% /tabs %}

Record the transaction's hash and `LastLedgerSequence` value so you can [be sure whether or not it got validated](../../../concepts/transactions/reliable-transaction-submission.md) later.


{% interactive-block label="Prepare & Sign" steps=$frontmatter.steps %}

<button id="prepare-and-sign" class="btn btn-primary previous-steps-required">Prepare & Sign</button>
<div class="output-area"></div>

{% /interactive-block %}



### 5. Submit TicketCreate

Submit the signed transaction blob that you created in the previous step. For example:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Submit TicketCreate" before="// Wait for Validation" language="js" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Submit" steps=$frontmatter.steps %}

<button id="ticketcreate-submit" class="btn btn-primary previous-steps-required" data-tx-blob-from="#tx_blob" data-wait-step-name="Wait">Submit</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### 6. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).)

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Wait for Validation" before="// Check Available" language="js" /%}
{% /tab %}

{% /tabs %}

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" /%}


### (Optional) Intermission

The power of Tickets is that you can carry on with your account's business as usual while you are getting Ticketed transactions ready. When you want to send a transaction using a Ticket, you can do that in parallel with other sending transactions, including ones using different Tickets, and submit a Ticketed transaction at any time. The only constraint is that each Ticket can only be used once.

**Tip:** You can come back here to send Sequenced transactions between or during any of the following steps, without interfering with the success of your Ticketed transaction.

{% interactive-block label="Intermission" steps=$frontmatter.steps %}

<button id="intermission-payment" class="btn btn-primary previous-steps-required">Payment</button>
<button id="intermission-escrowcreate" class="btn btn-primary previous-steps-required">EscrowCreate</button>
<button id="intermission-accountset" class="btn btn-primary previous-steps-required">AccountSet</button>
<div class="output-area"></div>

{% /interactive-block %}



### 7. Check Available Tickets

When you want to send a Ticketed transaction, you need to know what Ticket Sequence number to use for it. If you've been keeping careful track of your account, you already know which Tickets you have, but if you're not sure, you can use the [account_objects method][] to look up your available tickets. For example:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Check Available Tickets" before="// Prepare and Sign Ticketed" language="js" /%}
{% /tab %}

{% /tabs %}


{% interactive-block label="Check Tickets" steps=$frontmatter.steps %}

<button id="check-tickets" class="btn btn-primary previous-steps-required">Check Tickets</button>
<div class="output-area"></div>

{% /interactive-block %}

**Tip:** You can repeat the steps from here through the end as long as you have Tickets left to be used!

### 8. Prepare Ticketed Transaction

Now that you have a Ticket available, you can prepare a transaction that uses it.

This can be any [type of transaction](../../../references/protocol/transactions/types/index.md) you like. The following example uses a no-op [AccountSet transaction][] since that doesn't require any other setup in the ledger. Set the `Sequence` field to `0` and include a `TicketSequence` field with the Ticket Sequence number of one of your available Tickets.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Prepare and Sign Ticketed" before="// Submit Ticketed Transaction" language="js" /%}
{% /tab %}

{% /tabs %}

{% admonition type="success" name="Tip" %}
If you don't plan to submit the TicketCreate transaction right away, you should be sure not to set the `LastLedgerSequence` so that the transaction does not expire. The way you do this varies by library:

- **xrpl.js:** Specify `"LastLedgerSequence": null` when auto-filling the transaction.
- **`rippled`:** Omit `LastLedgerSequence` from the prepared instructions. The server does not provide a value by default.
{% /admonition %}

{% interactive-block label="Prepare Ticketed Tx" steps=$frontmatter.steps %}

<div id="ticket-selector">
  <h4>Select a Ticket:</h4>
  <div class="form-area"></div>
</div>
<button id="prepare-ticketed-tx" class="btn btn-primary previous-steps-required">Prepare Ticketed Transaction</button>
<div class="output-area"></div>

{% /interactive-block %}


### 9. Submit Ticketed Transaction

Submit the signed transaction blob that you created in the previous step. For example:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/use-tickets/js/use-tickets.js" from="// Submit Ticketed Transaction" before="// Wait for Validation (again)" language="js" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Submit Ticketed Tx" steps=$frontmatter.steps %}

<button id="ticketedtx-submit" class="btn btn-primary previous-steps-required" data-tx-blob-from="#tx_blob_t" data-wait-step-name="Wait Again">Submit</button>
<div class="output-area"></div>

{% /interactive-block %}


### 10. Wait for Validation

Ticketed transactions go through the consensus process the same way that Sequenced transactions do.

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" variables={label: "Wait Again"} /%}

## With Multi-Signing

One of the main use cases for Tickets is to be able to collect signatures for several [multi-signed transactions](../../../concepts/accounts/multi-signing.md) in parallel. By using a Ticket, you can send a multi-signed transaction as soon as it is fully signed and ready to go, without worrying about which one will be ready first. <!-- STYLE_OVERRIDE: will -->

In this scenario, [step 8, "Prepare Ticketed Transaction"](#8-prepare-ticketed-transaction) is slightly different. Instead of preparing and signing all at once, you would follow the steps for [sending any multi-signed transaction](send-a-multi-signed-transaction.md): first prepare the transaction, then circulate it among trusted signers to collect their signatures, and finally combine the signatures into the final multi-signed transaction.

You could do this in parallel for several different potential transactions as long as each one uses a different Ticket.


## See Also

- **Concepts:**
    - [Tickets](../../../concepts/accounts/tickets.md)
    - [Multi-Signing](../../../concepts/accounts/multi-signing.md)
- **Tutorials:**
    - [Set Up Multi-Signing](set-up-multi-signing.md)
    - [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md)
- **References:**
    - [account_objects method][]
    - [sign_for method][]
    - [submit_multisigned method][]
    - [TicketCreate transaction][]
    - [Transaction Common Fields](../../../references/protocol/transactions/common-fields.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
