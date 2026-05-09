---
seo:
  description: Issue, accept, and delete a credential on the XRP Ledger.
metadata:
  indexPage: true
labels:
  - Credentials
---

# Manage Credentials

This tutorial shows you how to manage the full lifecycle of [Credentials][] on the XRP Ledger: issuing a credential to a subject, accepting the credential, and deleting it.

{% amendment-disclaimer name="Credentials" /%}

## Goals

By the end of this tutorial, you will be able to:

- Issue a credential to a subject account.
- Accept a credential as the subject.
- Delete a credential from the ledger.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library set up in your development environment. This page provides examples for the following:
  - **Java** with the [xrpl4j library][]. See [Get Started Using Java][] for setup steps.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link repo="devportal" path="_code-samples/credential/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="Java" %}
From the code sample folder, use `mvn` to install dependencies.

```bash
mvn install
```
{% /tab %}
{% /tabs %}

### 2. Set up client and fund accounts

To get started, import the necessary libraries and instantiate a client to connect to the XRPL Testnet. This example imports:

{% tabs %}
{% tab label="Java" %}
- `xrpl4j`: Used for XRPL client connection, transaction submission, and wallet handling.
- `OkHttp`, `Guava`, `Jackson`: Used for HTTP URL construction, unsigned integer arithmetic, and JSON serialization.
- `java.util.concurrent`: Used for async operations.

{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" before="/**" /%}

{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="/**" before="// ----- Prepare CredentialCreate" /%}

The `createAndFundWallet()` helper generates an Ed25519 keypair, funds it from the Testnet faucet, and polls Testnet until the account is visible on a validated ledger.

{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// Generates a new Ed25519 keypair" before="// Fetches the next transaction sequence number" /%}
{% /tab %}
{% /tabs %}

### 3. Prepare CredentialCreate transaction

Create the [CredentialCreate transaction][] object.

{% tabs %}
{% tab label="Java" %}
{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// ----- Prepare CredentialCreate" before="// ----- Sign, submit, and wait for CredentialCreate" /%}
{% /tab %}
{% /tabs %}

The credential is identified by the issuer, subject, and credential type (written as a hexadecimal string).

### 4. Submit CredentialCreate transaction

Sign and submit the `CredentialCreate` transaction to the XRP Ledger.

{% tabs %}
{% tab label="Java" %}
{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// ----- Sign, submit, and wait for CredentialCreate" before="// ----- Prepare CredentialAccept" /%}

The `signSubmitAndWait()` helper signs a transaction, submits it, and polls Testnet until it reaches a validated ledger.

{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// Signs and submits a transaction" before="// Checks for a tesSUCCESS result code" /%}

The `requireSuccess` helper verifies that the transaction succeeded with a `tesSUCCESS` result code and posts a link to the transaction metadata on the XRPL Explorer.

{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// Checks for a tesSUCCESS result code" /%}
{% /tab %}
{% /tabs %}

### 5. Prepare CredentialAccept transaction

Create the [CredentialAccept transaction][] object. The subject account must accept the credential to make it valid.

{% tabs %}
{% tab label="Java" %}
{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// ----- Prepare CredentialAccept" before="// ----- Sign, Submit, and wait for CredentialAccept" /%}
{% /tab %}
{% /tabs %}

### 6. Submit CredentialAccept transaction

Sign and submit the `CredentialAccept` transaction to the XRP Ledger.

{% tabs %}
{% tab label="Java" %}
{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// ----- Sign, Submit, and wait for CredentialAccept" before="// ----- Prepare CredentialDelete" /%}
{% /tab %}
{% /tabs %}

### 7. Prepare CredentialDelete transaction

Create the [CredentialDelete transaction][] object. Either the issuer or the subject can delete a credential.

{% tabs %}
{% tab label="Java" %}
{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// ----- Prepare CredentialDelete" before="// ----- Sign, Submit, and wait for CredentialDelete" /%}
{% /tab %}
{% /tabs %}

### 8. Submit CredentialDelete transaction

Sign and submit the `CredentialDelete` transaction to the XRP Ledger.

{% tabs %}
{% tab label="Java" %}
{% code-snippet file="/_code-samples/credential/java/src/main/java/com/example/xrpl/ManageCredentials.java" language="java" from="// ----- Sign, Submit, and wait for CredentialDelete" before="// ===== Helper functions" /%}
{% /tab %}
{% /tabs %}

## See Also

**Concepts**:
  - [Credentials][]

**Tutorials**:
  - [Verify Credentials](./verify-credentials.md)

**References**:
  - [CredentialCreate transaction][]
  - [CredentialAccept transaction][]
  - [CredentialDelete transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
