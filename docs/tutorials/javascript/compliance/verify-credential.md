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

- You must have Node.js installed and know how to run Javascript code from the command line. Node.js v18 is required for xrpl.js.
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

This installs the appropriate version of the `xrpl.js` library and a few other dependencies. You can view all dependencies in the {% repo-link path="_code-samples/verify-credentials/js/package.json" %}`package.json`{% /repo-link %} file.

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
info: Encoded credential_type as hex: 5465737443726564656E7469616C
info: Looking up credential...
info: {
  "command": "ledger_entry",
  "credential": {
    "subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
    "issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
    "credential_type": "5465737443726564656E7469616C"
  },
  "ledger_index": "validated"
}
info: Found credential:
info: {
  "CredentialType": "5465737443726564656E7469616C",
  "Flags": 65536,
  "Issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
  "IssuerNode": "0",
  "LedgerEntryType": "Credential",
  "PreviousTxnID": "B078C70D17820069BDF913146F9908A209B4E10794857A3E474F4C9C5A35CA6A",
  "PreviousTxnLgrSeq": 1768183,
  "Subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
  "SubjectNode": "0",
  "index": "F2ACB7292C4F4ACB18010251F1653934DC17F06AA5BDE7F484F65B5A648D70CB"
}
info: Credential is valid.
```

If the code reports that the credential was not found when called with no arguments, it's possible that the example credential has been deleted or the Devnet has been reset. If you have another credential you can verify, you can provide the details as commandline arguments. For example:

```sh
node verify_credential.js rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3 rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG TestCredential
```

A full usage statement is available with the `-h` flag.

### Other Examples

The following examples show other possible scenarios. The data for these examples may or may not still be present in Devnet. For example, anyone can delete an expired credential.

{% tabs %}
{% tab label="Valid with Expiration" %}
```text
$ ./verify_credential.js rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3 rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG TCredential777

info: Encoded credential_type as hex: 5443726564656E7469616C373737
info: Looking up credential...
info: {
  "command": "ledger_entry",
  "credential": {
    "subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
    "issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
    "credential_type": "5443726564656E7469616C373737"
  },
  "ledger_index": "validated"
}
info: Found credential:
info: {
  "CredentialType": "5443726564656E7469616C373737",
  "Expiration": 798647105,
  "Flags": 65536,
  "Issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
  "IssuerNode": "0",
  "LedgerEntryType": "Credential",
  "PreviousTxnID": "D32F66D1446C810BF4E6310E21111C0CE027140292347F0C7A73322F08C07D7E",
  "PreviousTxnLgrSeq": 2163057,
  "Subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
  "SubjectNode": "0",
  "URI": "746573745F757269",
  "index": "6E2AF1756C22BF7DC3AA47AD303C985026585B54425E7FACFAD6CD1867DD39C2"
}
info: Credential has expiration: 2025-04-22T14:25:05.000Z
info: Looking up validated ledger to check for expiration.
info: Most recent validated ledger is: 2025-04-22T13:47:30.000Z
info: Credential is valid.
```
{% /tab %}
{% tab label="Expired" %}
```text
$ ./verify_credential.js rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3 rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG TCredential777

info: Encoded credential_type as hex: 5443726564656E7469616C373737
info: Looking up credential...
info: {
  "command": "ledger_entry",
  "credential": {
    "subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
    "issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
    "credential_type": "5443726564656E7469616C373737"
  },
  "ledger_index": "validated"
}
info: Found credential:
info: {
  "CredentialType": "5443726564656E7469616C373737",
  "Expiration": 798647105,
  "Flags": 65536,
  "Issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
  "IssuerNode": "0",
  "LedgerEntryType": "Credential",
  "PreviousTxnID": "D32F66D1446C810BF4E6310E21111C0CE027140292347F0C7A73322F08C07D7E",
  "PreviousTxnLgrSeq": 2163057,
  "Subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
  "SubjectNode": "0",
  "URI": "746573745F757269",
  "index": "6E2AF1756C22BF7DC3AA47AD303C985026585B54425E7FACFAD6CD1867DD39C2"
}
info: Credential has expiration: 2025-04-22T14:25:05.000Z
info: Looking up validated ledger to check for expiration.
info: Most recent validated ledger is: 2025-04-22T14:40:00.000Z
info: Credential is expired.
```
{% /tab %}

{% tab label="Unaccepted" %}
```text
$ ./verify_credential.js rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3 rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG Tst9Credential

info: Encoded credential_type as hex: 5473743943726564656E7469616C
info: Looking up credential...
info: {
  "command": "ledger_entry",
  "credential": {
    "subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
    "issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
    "credential_type": "5473743943726564656E7469616C"
  },
  "ledger_index": "validated"
}
info: Found credential:
info: {
  "CredentialType": "5473743943726564656E7469616C",
  "Expiration": 797007605,
  "Flags": 0,
  "Issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
  "IssuerNode": "0",
  "LedgerEntryType": "Credential",
  "PreviousTxnID": "A7A5F2AF66222B7ECDBC005477BDDCE35E1460FC53339A7800CBDE79DBBB6FE4",
  "PreviousTxnLgrSeq": 1633091,
  "Subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
  "SubjectNode": "0",
  "URI": "746573745F757269",
  "index": "4282469903F9046C8E559447CB1B17A18362E2AFC04399BB7516EFB0B1413EAB"
}
info: Credential is not accepted.
```
{% /tab %}

{% tab label="Hexadecimal Credential Type" %}
```text
$ ./verify_credential.js rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3 rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG 5473743343726564656E7469616C -b

info: Looking up credential...
info: {
  "command": "ledger_entry",
  "credential": {
    "subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
    "issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
    "credential_type": "5473743343726564656E7469616C"
  },
  "ledger_index": "validated"
}
info: Found credential:
info: {
  "CredentialType": "5473743343726564656E7469616C",
  "Flags": 65536,
  "Issuer": "rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3",
  "IssuerNode": "0",
  "LedgerEntryType": "Credential",
  "PreviousTxnID": "062DA0586A57A32220785159D98F5206A14C4B98F5A7D8A9BCDB6836E33C45FE",
  "PreviousTxnLgrSeq": 1768019,
  "Subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
  "SubjectNode": "0",
  "URI": "746573745F757269",
  "index": "8548D8DC544153044D17E38499F8CB4E00E40A93085FD979AB8B949806668843"
}
info: Credential is valid.
```
{% /tab %}
{% /tabs %}


## Code Walkthrough

### 1. Initial setup

The `verify_credential.js` file implements the code for this tutorial.
This file can be run as a commandline tool, so it starts with a [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)). Then it imports the relevant dependencies, including the specific parts of the `xrpl.js` library:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" before="// Set up logging" /%}

The next section of the code sets the default log level for messages that might be written to the console through the utility:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Set up logging" before="// Define an error to throw" /%}

Then it defines a type of exception to throw if something goes wrong when connecting to the XRP Ledger:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Define an error to throw" before="const CREDENTIAL" /%}

Finally, a regular expression to validate the credential format and the [lsfAccepted](../../../references/protocol/ledger-data/ledger-entry-types/credential.md#credential-flags) flag are defined as constants for use further on in the code.

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="const CREDENTIAL" before="async function verifyCredential" /%}

### 2. verifyCredential function

The `verifyCredential(...)` function performs the main work for this tutorial. The function definition and comments define the parameters:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="async function verifyCredential" before="// Encode credentialType as uppercase hex" /%}

The XRP Ledger APIs require the credential type to be hexadecimal, so it converts the user input if necessary:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Encode credentialType as uppercase hex" before="// Perform XRPL lookup" /%}

Next, it calls the [ledger_entry method](/docs/references/http-websocket-apis/public-api-methods/ledger-methods/ledger_entry#get-credential-entry) to look up the requested Credential ledger entry:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Perform XRPL lookup" before="// Check if the credential has been accepted" /%}

If it succeeds in finding the credential, the function continues by checking that the credential has been accepted by its holder. Since anyone can issue a credential to anyone else, a credential is only considered valid if its subject has accepted it.

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="Check if the credential has been accepted" before="// Confirm that the credential is not expired" /%}

Then, if the credential has an expiration time, the function checks that the credential is not expired. If the credential has no expiration, this step can be skipped. A credential is officially considered expired if its expiration time is before the [official close time](/docs/concepts/ledgers/ledger-close-times) of the most recently validated ledger. This is more universal than comparing the expiration to your own local clock. Thus, the code uses the [ledger method][] to look up the most recently validated ledger:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Confirm that the credential is not expired" before="// Credential has passed all checks" /%}

If none of the checks up to this point have returned a `false` value, then the credential must be valid. This concludes the `verifyCredential(...)` function:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Credential has passed all checks" before="// Commandline usage" /%}

### 3. Commandline interface

This file also implements a commandline utility which runs when the file is executed directly as a Node.js script. Some variables, such as the set of available networks, are only needed for this mode:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Commandline usage" before="// Parse arguments" /%}

Then it uses the [commander package](https://www.npmjs.com/package/commander) to define and parse the arguments that the user can pass from the commandline:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Parse arguments" before="// Call verify_credential" /%}

After parsing the commandline args, it sets the appropriate values and passes them to `verifyCredential(...)` to perform the credential verification:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Call verify_credential" before="// Return a nonzero exit code" /%}

It returns a nonzero exit code if this credential was not verified. This can be useful for shell scripts:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="// Return a nonzero exit code" before="main().catch" /%}

Finally, the code runs the `main()` function:

{% code-snippet file="/_code-samples/verify-credential/js/verify_credential.js" language="js" from="main().catch" /%}


## Next Steps

Now that you know how to use `xrpl.js` to verify credentials, you can try building this or related steps together into a bigger project. For example:

- Incorporate credential verification into a [wallet application](../build-apps/build-a-desktop-wallet-in-javascript.md).
- Issue your own credentials with a [credential issuing service](../build-apps/credential-issuing-service.md).

## See Also

- [Verify Credentials in Python](../../python/compliance/verify-credential.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
