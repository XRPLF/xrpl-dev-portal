---
seo:
    description: Verify that an account holds a valid credential on the XRP Ledger.
labels:
    - Credentials
---

# Verify Credentials in Javascript

This tutorial describes how to verify that an account holds a valid [credential](/docs/concepts/decentralized-storage/credentials) on the XRP Ledger, which has different use cases depending on the type of credential and the meaning behind it. A few possible reasons to verify a credential include:

- Confirming that a recipient has passed a background check before sending a payment.
- Checking a person's professional certifications, after verifying their identity with a [DID](/docs/concepts/decentralized-storage/decentralized-identifiers).
- Displaying a player's achievements in a blockchain-connected game.

This tutorial uses sample code in Javascript using the [xrpl-js library](../index.md).

## Prerequisites

- You must have Node.js insalled and know how to run Javascript code from the command line. Node.js v18 is required for xrpl.js.
- You should have a basic understanding of the XRP Ledger.
- The credential you want to verify should exist in the ledger already, and you should know the addresses of both the issuer and the holder, as well as the official credential type you want to check.
    - For sample code showing how to create credentials, see [Build a Credential Issuing Service](../build-apps/credential-issuing-service.md).

## Setup

First, download the complete sample code for this tutorial from GitHub:

- {% repo-link path="_code-samples/verify-credential/js/" %}Verify Credential sample code{% /repo-link %}

Then, in the appropriate directory, install dependencies:

```sh
npm install
```

This installs the appropriate version of the `xrpl.js` library. There are no other dependencies for this tutorial outside of the Python standard library.

## Overview

The Verify Credential sample code consists of one file, `verify_credential.js`, and contains two main parts:

1. A function, `verifyCredential(...)` which can be called with appropriate arguments to verify that a credential exists and is valid. This function can be imported into other code to be used as part of a larger application.
2. A commandline utility that can be used to verify any credential.

## Usage

To test that you have the code installed and working properly, you can run the commandline utility with no arguments to check the existence of a default credential on Devnet, such as:

```sh
node verify_credential.js
```

If all goes well, you should see output such as the following:

```text

```

If the code reports that the credential was not found when called with no arguments, it's possible that the example credential has been deleted or the Devnet has been reset. If you have another credential you can verify, you can provide the details as commandline arguments. For example:

```sh
node verify_credential.js rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA my_credential
```

A full usage statement is available with the `-h` flag.

## Interactive Shell
