---
seo:
    description: Verify that an account holds a valid credential on the XRP Ledger.
labels:
    - Credentials
---
# Verify Credentials in Python

This tutorial describes how to verify that an account holds a valid [credential](../../concepts/decentralized-storage/credentials.md) on the XRP Ledger, which has different use cases depending on the type of credential and the meaning behind it. A few possible reasons to verify a credential include:

- Confirming that a recipient has passed a background check before sending a payment.
- Checking a person's professional certifications, after verifying their identity with a [DID](../../concepts/decentralized-storage/decentralized-identifiers.md).
- Displaying a player's achievements in a blockchain-connected game.

This tutorial uses sample code in Python using the [xrpl-py library](../index.md).

## Prerequisites

- You must have Python installed and know how to run Python code from the command line. Python 3.8 or later is required for xrpl-py.
- You should have a basic understanding of the XRP Ledger.
- The credential you want to verify should exist in the ledger already, and you should know the addresses of both the issuer and the holder, as well as the official credential type you want to check.
     - For sample code showing how to create credentials, see [Build a Credential Issuing Service](../sample-apps/credential-issuing-service-in-python.md).

## Setup

First, download the complete sample code for this tutorial from GitHub:

- {% repo-link path="_code-samples/verify-credential/py/" %}Verify Credential sample code{% /repo-link %}

Then, in the appropriate directory, set up a virtual environment and install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

This installs the appropriate version of the `xrpl-py` library. There are no other dependencies for this tutorial outside of the Python standard library.

## Overview

The Verify Credential sample code consists of one file, `verify_credential.py`, and contains two main parts:

1. A function, `verify_credential(...)` which can be called with appropriate arguments to verify that a credential exists and is valid. This function can be imported into other code to be used as part of a larger application.
2. A commandline utility that can be used to verify any credential.

## Usage

To test that you have the code installed and working properly, you can run the commandline utility with no arguments to check the existence of a default credential on Devnet, such as:

```sh
python verify_credential.py
```

If all goes well, you should see output such as the following:

```text
Encoded credential_type as hex: 6D795F63726564656E7469616C
Looking up credential...
{'ledger_index': 'validated', 'method': 'ledger_entry', 'api_version': 2, 'credential': {'subject': 'rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA', 'issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'credential_type': '6D795F63726564656E7469616C'}, 'binary': False}
Found credential:
{'CredentialType': '6D795F63726564656E7469616C', 'Flags': 65536, 'Issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'IssuerNode': '0', 'LedgerEntryType': 'Credential', 'PreviousTxnID': '7D1257779E2D298C07C7E0C73CD446534B143FBD1F13DB268A878E40FD153B9A', 'PreviousTxnLgrSeq': 803275, 'Subject': 'rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA', 'SubjectNode': '0', 'index': '9603F0E204A8B1C61823625682EB0ECE98A4ECF22FF46CD4845FA9BFA3606B24'}
Credential is valid.
```

If the code reports that the credential was not found when called with no arguments, it's possible that the example credential has been deleted or the Devnet has been reset. If you have another credential you can verify, you can provide the details as commandline arguments. For example:

```sh
python verify_credential.py rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA my_credential
```

A full usage statement is available with the `-h` flag.

### Interactive Shell

You can open an interactive python shell and import the `verify_credential` function, as in the following example:

```py
>>> from verify_credential import verify_credential
>>> from xrpl.clients import JsonRpcClient
>>> client = JsonRpcClient("https://s.devnet.rippletest.net:51234/")
>>> verify_credential(client, issuer="rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS", subject="rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA", credential_type="my_credential")
True
```

You can import the `verify_credential(...)` function into other scripts and use it the same way.

### Other Examples

The following examples show other possible scenarios. The data for these examples may or may not still be present in Devnet. For example, anyone can delete an expired credential.

{% tabs %}
{% tab label="Valid with Expiration" %}
```text
$ ./verify_credential.py rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S long_lasting_credential

Encoded credential_type as hex: 6C6F6E675F6C617374696E675F63726564656E7469616C
Looking up credential...
{'ledger_index': 'validated', 'method': 'ledger_entry', 'api_version': 2, 'credential': {'subject': 'rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S', 'issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'credential_type': '6C6F6E675F6C617374696E675F63726564656E7469616C'}, 'binary': False}
Found credential:
{'CredentialType': '6C6F6E675F6C617374696E675F63726564656E7469616C', 'Expiration': 1167724800, 'Flags': 65536, 'Issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'IssuerNode': '0', 'LedgerEntryType': 'Credential', 'PreviousTxnID': 'C65794B7C322F028DB0D2DD72C9FF69D53A676B1608B77ADEF22311AFB22BFF7', 'PreviousTxnLgrSeq': 996934, 'Subject': 'rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S', 'SubjectNode': '0', 'index': 'FC4BB495DAE7C9F4615174188B3C5F2E337680017BA90E1F126DE08CAD15FD66'}
Credential has expiration: 2037-01-01T08:00:00+00:00
Looking up validated ledger to check for expiration.
Most recent validated ledger is: 2025-03-11T20:01:51+00:00
Credential is valid.
```
{% /tab %}

{% tab label="Expired" %}
```text
$ ./verify_credential.py rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S expiring_credential

Encoded credential_type as hex: 6578706972696E675F63726564656E7469616C
Looking up credential...
{'ledger_index': 'validated', 'method': 'ledger_entry', 'api_version': 2, 'credential': {'subject': 'rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S', 'issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'credential_type': '6578706972696E675F63726564656E7469616C'}, 'binary': False}
Found credential:
{'CredentialType': '6578706972696E675F63726564656E7469616C', 'Expiration': 795038400, 'Flags': 65536, 'Issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'IssuerNode': '0', 'LedgerEntryType': 'Credential', 'PreviousTxnID': 'E497F1EFE2E198EDED0D94ADDEE4CEFACDDC3B1674133A0123C765F8061B9600', 'PreviousTxnLgrSeq': 997087, 'Subject': 'rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S', 'SubjectNode': '0', 'index': 'F3A9475871E7BA994E257732D0C7CB0B91CACBBB9F840BDFA6ABABD6F71454CD'}
Credential has expiration: 2025-03-11T20:00:00+00:00
Looking up validated ledger to check for expiration.
Most recent validated ledger is: 2025-03-11T20:02:03+00:00
Credential is expired.
```
{% /tab %}

{% tab label="Unaccepted" %}
```text
$ ./verify_credential.py rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S unaccepted_credential

Encoded credential_type as hex: 756E61636365707465645F63726564656E7469616C
Looking up credential...
{'ledger_index': 'validated', 'method': 'ledger_entry', 'api_version': 2, 'credential': {'subject': 'rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S', 'issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'credential_type': '756E61636365707465645F63726564656E7469616C'}, 'binary': False}
Found credential:
{'CredentialType': '756E61636365707465645F63726564656E7469616C', 'Flags': 0, 'Issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'IssuerNode': '0', 'LedgerEntryType': 'Credential', 'PreviousTxnID': '59DB4B17E5552AB1CA1E2A89F5C03E51C2ACD0D293955FA701AE4A1801E94C96', 'PreviousTxnLgrSeq': 997107, 'Subject': 'rs9DtpwyCSGMCyxiYEvVG29ZXo99iFjZ9S', 'SubjectNode': '0', 'index': '8E5AD9444D566BE5C6F87C94D696139CEEE43ACB9A96137A59C003B48DF565C6'}
Credential is not accepted.
```
{% /tab %}
{% tab label="Hexadecimal Credential Type" %}
```text
$ ./verify_credential.py rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA 6D795F63726564656E7469616C -b

Looking up credential...
{'ledger_index': 'validated', 'method': 'ledger_entry', 'api_version': 2, 'credential': {'subject': 'rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA', 'issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'credential_type': '6D795F63726564656E7469616C'}, 'binary': False}
Found credential:
{'CredentialType': '6D795F63726564656E7469616C', 'Flags': 65536, 'Issuer': 'rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS', 'IssuerNode': '0', 'LedgerEntryType': 'Credential', 'PreviousTxnID': '7D1257779E2D298C07C7E0C73CD446534B143FBD1F13DB268A878E40FD153B9A', 'PreviousTxnLgrSeq': 803275, 'Subject': 'rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA', 'SubjectNode': '0', 'index': '9603F0E204A8B1C61823625682EB0ECE98A4ECF22FF46CD4845FA9BFA3606B24'}
Credential is valid.
```
{% /tab %}
{% /tabs %}


## Code Walkthrough

### 1. Initial setup

The `verify_credential.py` file implements the code for this tutorial. 
This file can be run as a commandline tool, so it starts with a [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)). Then it imports dependencies, with standard lib first and then specific parts of the `xrpl-py` library:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" before="# Set up logging" /%}

The next section of the code sets the default log level for messages that might be written to the console through the utility:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Set up logging" before="# Define an error to throw" /%}

Then it defines a type of exception to throw if something goes wrong when connecting to the XRP Ledger:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Define an error to throw" before="# Main function" /%}

### 2. Main function

The `verify_credential(...)` function performs the main work for this tutorial. The function definition and docstring define the parameters:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Main function" before="# Handle function inputs" /%}

The first thing the function does is verify that the user provided a credential type in either the `credential_type` or `credential_type_hex` parameter. The XRP Ledger APIs require the credential type to be hexadecimal, so it converts the user input if necessary:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Handle function inputs" before="# Perform XRPL lookup" /%}

Next, it calls the [ledger_entry method](../../references/http-websocket-apis/public-api-methods/ledger-methods/ledger_entry.md#get-credential-entry) to look up the requested Credential ledger entry:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Perform XRPL lookup" before="# Confirm that the credential has been accepted" /%}

If it succeeds in finding the credential, the function continues by checking that the credential has been accepted by its holder. Since anyone can issue a credential to anyone else, a credential is only considered valid if its subject has accepted it.

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Confirm that the credential has been accepted" before="# Confirm that the credential is not expired" /%}

Then, if the credential has an expiration time, the function checks that the credential is not expired. If the credential has no expiration, this step can be skipped. A credential is officially considered expired if its expiration time is before the [official close time](../../concepts/ledgers/ledger-close-times.md) of the most recently validated ledger. This is more universal than comparing the expiration to your own local clock. Thus, the code uses the [ledger method][] to look up the most recently validated ledger:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Confirm that the credential is not expired" before="# Credential has passed all checks" /%}

If none of the checks up to this point have returned a `False` value, then the credential must be valid. This concludes the `verify_credential(...)` main function:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Credential has passed all checks" before="# Commandline usage" /%}

### 3. Commandline interface

This file also implements a commandline utility which runs when the file is executed directly as a Python script. Some variables, such as the set of available networks, are only needed for this mode:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Commandline usage" before="# Parse arguments" /%}

Then it uses the [argparse library](https://docs.python.org/3/library/argparse.html) to define and parse the arguments that the user can pass from the commandline:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Parse arguments" before="# Call verify_credential" /%}

After parsing the commandline args, it sets the appropriate values and passes them to `verify_credential(...)` to perform the credential verification:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Call verify_credential" before="# Return a nonzero exit code" /%}

Finally, it returns a nonzero exit code if this credential was not verified. This can be useful for shell scripts:

{% code-snippet file="/_code-samples/verify-credential/py/verify_credential.py" language="py" from="# Call verify_credential" before="# Return a nonzero exit code" /%}

Otherwise, the code exits as normal, which returns a successful exit code of `0` to the shell.

## Next Steps

Now that you know how to use `xrpl-py` to verify credentials, you can try building this or related steps together into a bigger project. For example:

- Incorporate credential verification into a [wallet application](../sample-apps/build-a-desktop-wallet-in-python.md).
- Issue your own credentials with a [credential issuing service](../sample-apps/credential-issuing-service-in-python.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
