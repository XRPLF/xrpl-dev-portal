---
paths:
  - "docs/tutorials/**/*.md"
---

# XRPL Tutorial Conventions

The template below shows the full structure a tutorial should follow. HTML comments serve two roles, distinguished by prefix:

- `<!-- TODO: ... -->` marks a slot that needs to be filled in by the author
- `<!-- RULE: ... -->` describes the convention that applies at that spot

If the tutorial doesn't already link to a specific code sample, prompt the user for which code samples to use.

---

# Tutorial Title
<!-- RULE: Title should be an imperative task. -->
This tutorial shows you how to <!-- TODO: 2-3 sentences of what/why/when. Link out to concept docs rather than explaining at length. If the tutorial uses a feature that isn't enabled on mainnet yet, add the {% amendment-disclaimer /%} markdoc tag in a new line. You can verify the status of amendments at https://xrpl.org/resources/known-amendments.md -->


## Goals

By the end of this tutorial, you will be able to:

<!-- TODO: Bullet points describing what the reader will learn. -->


## Prerequisites
<!-- RULE: List any knowledge and tool requirements in addition to the ones listed below. -->
To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an [XRP Ledger client library](../../references/client-libraries.md) installed. This page provides examples for the following:
<!-- TODO: Update the list of supported languages. -->
  - **JavaScript** with the [xrpl.js library][]. See [Get Started Using JavaScript][] for setup steps.
  - **Python** with the [xrpl-py library][]. See [Get Started Using Python][] for setup steps.
  - **Go** with the [xrpl-go library][]. See [Get Started Using Go][] for setup steps.
  - **Java** with the [xrpl4j library][]. See [Get Started Using Java][] for setup steps.

## Source Code
<!-- TODO: Update the repo-link path to the topic parent folder housing all the sample codes. -->
You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/<topic>/" %}code samples section of this website's repository{% /repo-link %}.


## Steps
<!-- RULE: Language-specific instructions are always wrapped in {% tabs %} markdoc, even if only one language is used. Each step after 1 uses the {% code-snippet %} markdoc tag. Code samples use unique comments to break code samples into logical steps. The first snippet in step 2 omits `from=`; the last step snippet omits `before=`. NEVER copy-paste source code into the tutorial. -->

### 1. Install dependencies
<!-- TODO: Update the list of commands to match included code sample languages. -->
{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```bash
npm install
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}

{% tab label="Go" %}
From the code sample folder, use `go` to install dependencies.

```bash
go mod tidy
```
{% /tab %}

{% tab label="Java" %}
From the code sample folder, use `mvn` to install dependencies.

```bash
mvn install
```
{% /tab %}
{% /tabs %}


### 2. Set up client and accounts
<!-- RULE: This step covers: importing dependencies, instantiating the client, defining hardcoded values/constants, deriving wallets, loading setup data, or funding new wallets via faucet. The code sample should have this front-loaded already. -->

To get started, import the necessary libraries and instantiate a client to connect to the XRPL. This example imports:
<!-- TODO: List the imports used in the code samples and what they're used for. Follow this sample format:

{% tabs %}
{% tab label="JavaScript" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `fs` and `child_process`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" before="// This step checks" /%}
{% /tab %}
{% tab label="Python" %}
- `xrpl`: Used for XRPL client connection, transaction submission, and wallet handling.
- `json`: Used for loading and formatting JSON data.
- `os`, `subprocess`, and `sys`: Used to run tutorial set up scripts.

{% code-snippet file="/_code-samples/lending-protocol/py/create_loan_broker.py" language="py" before="# This step checks" /%}
{% /tab %}
{% /tabs %}

-->

<!-- TODO: If the code sample uses setup data, add additional explanation for the loaded data. Follow this sample format:

Next, load the vault owner account and vault ID. The vault owner will also be the loan broker.
{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// This step checks" before="// Prepare LoanBrokerSet" /%}

This example uses preconfigured accounts and vault data from the `lendingSetup.js` script, but you can replace `loanBroker` and `vaultID` with your own values.
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan_broker.py" language="py" from="# This step checks" before="# Prepare LoanBrokerSet" /%}

This example uses preconfigured accounts and vault data from the `lending_setup.py` script, but you can replace `loan_broker` and `vault_id` with your own values.
{% /tab %}
{% /tabs %}

-->


### 3. <!-- TODO: imperative sentence-case heading for this step -->
<!-- RULE: Each step from 3 and on should follow the code sample, broken down by the major steps defined by code comments. Duplicate this block for each additional step. Steps generally follow a prepare transaction, submit transaction, extract transaction response cadence. -->
<!-- TODO: Briefly describe what happens in each step before adding the {% code-snippet %}. Follow this sample format:

Create the [LoanBrokerSet transaction][] object. The management fee rate is set in 1/10th basis points. A value of `1000` equals 1% (100 basis points).

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/lending-protocol/js/createLoanBroker.js" language="js" from="// Prepare LoanBrokerSet" before="// Submit, sign" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/lending-protocol/py/create_loan_broker.py" language="py" from="# Prepare LoanBrokerSet" before="# Submit, sign" /%}
{% /tab %}
{% /tabs %}

-->


## See Also

<!-- TODO: Links to related concepts, tutorials, use cases, and references. Include reference docs for every API method, transaction type, and ledger entry used in the tutorial — even if those links are redundant with inline links throughout the prose. Follow this sample format:

**Concepts**:
  - [Lending Protocol][]
  - [Single Asset Vault](../../../../concepts/tokens/single-asset-vaults.md)

**Tutorials**:
  - [Create a Single Asset Vault](../use-single-asset-vaults/create-a-single-asset-vault.md)
  - [Deposit and Withdraw First-Loss Capital](./deposit-and-withdraw-cover.md)
  - [Create a Loan](./create-a-loan.md)

**References**:
  - [LoanBrokerSet transaction][]

-->

{% raw-partial file="/docs/_snippets/common-links.md" /%}
