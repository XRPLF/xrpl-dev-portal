---
seo:
    description: Verify that an account holds a valid credential on the XRP Ledger.
labels:
    - Credentials
---
# Verify Credentials

This tutorial describes how to verify that an account holds a valid [credential](/docs/concepts/decentralized-storage/credentials) on the XRP Ledger, which has different use cases depending on the type of credential and the meaning behind it. A few possible reasons to verify a credential include:

- Confirming that a recipient has passed a background check before sending a payment.
- Checking a person's professional certifications, after verifying their identity with a [DID](/docs/concepts/decentralized-storage/decentralized-identifiers).
- Displaying a player's achievements in a blockchain-connected game.

## Goals

By following this tutorial, you should learn how to:

- Fetch a Credential entry from the ledger.
- Recognize if a credential has been accepted and when it has expired.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger client library, such as **xrpl.js**, installed.
- Know the issuer, subject, and credential type of the credential you want to verify. For purposes of this tutorial, you can use sample values of data that exists in the public network.
    - For information on how to create your own credentials, see the [Build a Credential Issuing Service](../build-apps/credential-issuing-service.md) tutorial.

## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/verify-credential/" %}code samples section of this website's repository{% /repo-link %}.

## Steps

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

### 2. Set up client and define constants

To get started, import the client library and instantiate an API client. You also need to specify the details of the credential you want to verify.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" before="// Look up Credential" /%}
{% /tab %}
{% /tabs %}

### 3. Look up the credential

Use the [ledger_entry method][] to request the credential, using the latest validated ledger version. The response includes the [Credential entry][] as it is stored in the ledger.

If the request fails with an `entryNotFound` error, then the specified credential doesn't exist in the ledger—maybe you got one of the values wrong or maybe the credential has been deleted.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Look up Credential" before="// Check if the credential has been accepted" /%}
{% /tab %}
{% /tabs %}

### 4. Check if the credential has been accepted

Since a credential isn't valid until the subject has accepted it, you need to check if the credential has been accepted to know if it's valid. The accepted status of a credential is stored as a flag in the `Flags` field, so you use the bitwise-AND operator to see if that particular flag is enabled.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Check if the credential has been accepted" before="// Confirm that the credential is not expired" /%}
{% /tab %}
{% /tabs %}

### 5. Check credential expiration

If the credential has an expiration time, you need to confirm that it has not passed, causing the credential to expire. As with all expirations in the XRP Ledger, expiration is compared with the official close time of the previous ledger, so use the [ledger method][] to fetch the ledger header and compare against the close time.

If the credential does not have an expiration time, then it remains valid indefinitely.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Confirm that the credential is not expired" before="// Credential has passed" /%}
{% /tab %}
{% /tabs %}

### 6. Declare credential valid

If the credential has passed all checks to this point, it is valid. In summary, the checks were:

- The credential exists in the latest validated ledger.
- It has been accepted by the subject.
- It has not expired.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Credential has passed" /%}
{% /tab %}
{% /tabs %}


## Next Steps

Now that you know how to use `xrpl.js` to verify credentials, you can try building this or related steps together into a bigger project. For example:

- Incorporate credential verification into a [wallet application](../build-apps/build-a-desktop-wallet-in-javascript.md).
- Issue your own credentials with a [credential issuing service](../build-apps/credential-issuing-service.md).

## See Also

- [Verify Credentials in Python](../../python/compliance/verify-credential.md)
- **References:**
    - API methods:
        - [ledger_entry method][]
        - [ledger method][]
    - Ledger entries
        - [Credential entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
