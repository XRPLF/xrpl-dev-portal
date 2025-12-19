---
seo:
    description: Build a credential issuing microservice with Javascript and Node.js.
---

# Build a Credential Issuing Service

_(Requires the Credentials amendment. {% not-enabled /%})_

This tutorial demonstrates how to build and use a microservice that issues [Credentials](../../concepts/decentralized-storage/credentials.md) on the XRP Ledger, in the form of a RESTlike API, using the [Express](https://expressjs.com/) framework for Node.js.


## Prerequisites

To complete this tutorial, you should meet the following guidelines:

- You have [Node.js](https://nodejs.org/en/download/) v18 or higher installed.
- You are somewhat familiar with modern JavaScript programming and have completed the [Get Started Using JavaScript tutorial](../get-started/get-started-javascript.md).
- You have some understanding of the XRP Ledger, its capabilities, and of cryptocurrency in general. Ideally you have completed the [Basic XRPL guide](https://learn.xrpl.org/).


## Setup

First, download the complete sample code for this tutorial from GitHub:

- {% repo-link path="_code-samples/issue-credentials/js/" %}Credential Issuing Service sample code{% /repo-link %}

Then, in the appropriate directory, install the dependencies:

```sh
npm install
```

This should install appropriate versions of Express, xrpl.js and a few other dependencies. You can view all dependencies in the {% repo-link path="_code-samples/issue-credentials/js/package.json" %}`package.json`{% /repo-link %} file.

To use the API that this microservice provides, you also need an HTTP client such as [Postman](https://www.postman.com/downloads/), [RESTED](https://github.com/RESTEDClient/RESTED), or [cURL](https://curl.se/).


## Overview

The Credential Issuer microservice, mostly implemented in `issuer_service.js`, provides a RESTlike API with the following methods:

| Method | Description |
|---|----|
| `POST /credential` | Request that the issuer issue a specific credential to a specific account. |
| `GET /admin/credential` | List all credentials issued by the issuer's address, optionally filtering only for credentials that have or have not been accepted by their subject. |
| `DELETE /admin/credential` | Delete a specific credential from the XRP Ledger, which revokes it. |

{% admonition type="info" name="Note" %}Some of the methods have `/admin` in the path because they are intended to be used by the microservice's administrator. However, the sample code does not implement any authentication.{% /admonition %}

The sample code also contains a simple commmandline interface for a user account to accept a credential issued to it, as `accept_credential.js`.

The other files contain helper code that is used by one or both tools.


## Usage

### 1. Get Accounts

To use the credential issuing service, you need two accounts on the Devnet, where the Credentials amendment is already enabled. Go to the [XRP Faucets page](../../../resources/dev-tools/xrp-faucets.page.tsx) and select **Devnet**. Then, click the button to Generate credentials, saving the key pair (address and secret), twice. You will use one of these accounts as a **credential issuer** and the other account as the **credential subject** (holder), so make a note of which is which.

### 2. Start Issuer Service

To start the issuer microservice, run the following command from the directory with the sample code:

```sh
node issuer_service.js
```

It should prompt you for your **issuer account** seed. Input the secret key you saved previously and press Enter.

The output should look like the following:

```txt
✔ Issuer account seed:
✅ Starting credential issuer with XRPL address rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3
🔐 Credential issuer service running on port: 3005
```

Double-check that the XRPL address displayed matches the address of the credential issuer keys you saved earlier.

### 3. Request Credential

To request a credential, make a request such as the following:

{% tabs %}

{% tab label="Summary" %}
* HTTP method: `POST`
* URL: `http://localhost:3005/credential`
* Headers:
    * `Content-Type: application/json`
* Request Body:
    ```json
    {
        "subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
        "credential": "TestCredential",
        "documents": {
            "reason": "please"
        }
    }
    ```
{% /tab %}

{% tab label="cURL" %}
```sh
curl -H "Content-Type: application/json" -X POST -d '{"subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG", "credential": "TestCredential", "documents": {"reason": "please"}}' http://localhost:3005/credential
```
{% /tab %}

{% /tabs %}

The parameters of the JSON request body should be as follows:

| Field | Type | Required? | Description |
|---|---|---|---|
| `subject` | String - Address | Yes | The XRPL classic address of the subject of the credential. Set this to the address that you generated at the start of this tutorial for the credential holder account. |
| `credential` | String | Yes | The type of credential to issue. The example microservice accepts any string consisting of alphanumeric characters as well as the special characters underscore (`_`), dash (`-`), and period (`.`), with a minimum length of 1 and a maximum length of 64 characters. |
| `documents` | Object | Yes | As a credential issuer, you typically need to verify some confidential information about someone before you issue them a credential. As a placeholder, the sample code checks for a nested field named `reason` that contains the string `please`. |
| `expiration` | String - ISO8601 Datetime | No | The time after which the credential expires, such as `2025-12-31T00:00:00Z`. |
| `uri` | String | No | Optional URI data to store with the credential. This data will become public on the XRP Ledger. If provided, this must be a string with minimum length 1 and max length 256, consisting of only characters that are valid in URIs, which are numbers, letters, and the following special characters: `-._~:/?#[]@!$&'()*+,;=%`. Conventionally, it should link to a Verifiable Credential document as defined by the W3C. |

This microservice immediately issues any credential that the user requests. A successful response from the API uses the HTTP status code `201 Created` and has a response body with the result of submitting the transaction to the XRP Ledger. You can use the `hash` value from the response to look up the transaction using an explorer such as [https://devnet.xrpl.org/](https://devnet.xrpl.org/).

{% admonition type="warning" name="Differences from Production" %}For a real credential issuer, you would probably check the credential type and only issue specific types of credentials, or maybe even just one type. <br><br> If checking the user's documents requires human intervention or takes longer than the amount of time an API request should wait to respond, you would need to store credential requests to some kind of storage, like a SQL database. You might also want to add a separate method for admins (or automated processes) to reject or issue the credential after checking the documents.{% /admonition %}

### 4. List Credentials

To show a list of credentials issued by the issuing account, make the following request:

{% tabs %}

{% tab label="Summary" %}
* HTTP method: `GET`
* URL: `http://localhost:3005/admin/credential`
* Query parameters (optional): Use `?accepted=yes` to filter results to only credentials that the subject has accepted, or `?accepted=no` for credentials the user has not accepted.
{% /tab %}

{% tab label="cURL" %}
```sh
curl http://localhost:3005/admin/credential
```
{% /tab %}

{% /tabs %}

A response could look like the following:

```json
{
 "credentials": [
    {
      "subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
      "credential": "TstCredential",
      "accepted": true
    }
  ]
}
```

In the response, each entry in the `credentials` array represents a Credential issued by the issuer account and stored in the blockchain. The details should match the request from the previous step, except that the `documents` are omitted because they are not saved on the blockchain.

### 5. Accept Credential

For a credential to be valid, the subject of the credential has to accept it. You can use `accept_credential.js` to do this:

```sh
node accept_credential.js
```

It should prompt you for your **subject account** seed. Input the secret key you saved previously and press Enter.

The script displays a list of Credentials that have been issued to your account and have not been accepted yet. Use the arrrow keys to scroll through the choices in the prompt and select the credential you want to accept, then press Enter. For example:

```text
✔ Subject account seed:
? Accept a credential?
  0) No, quit.
  1) 'TstzzzCredential' issued by rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3
  2) 'Tst9Credential' issued by rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3
❯ 3) 'TCredential1' issued by rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3
  4) 'Tst1Credential' issued by rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3
  5) 'Tst0Credential' issued by rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3
  6) 'Tst6Credential' issued by rPLY4DWhB4VA7PPZ8nvZLhShXeVZqeKif3
```

### 6. Revoke Credential

To revoke an issued credential, make a request such as the following:

{% tabs %}

{% tab label="Summary" %}
* HTTP method: `DELETE`
* URL: `http://localhost:3005/admin/credential`
* Headers:
    * `Content-Type: application/json`
* Request Body:
    ```json
    {
        "subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG",
        "credential": "TestCredential"
    }
    ```
{% /tab %}

{% tab label="cURL" %}
```sh
curl -H "Content-Type: application/json" -X DELETE -d '{"subject": "rBqPPjAW6ubfFdmwERgajvgP5LtM4iQSQG", "credential": "TestCredential"}' http://localhost:3005/admin/credential
```
{% /tab %}

{% /tabs %}

The parameters of the JSON request body should be as follows:

| Field | Type | Required? | Description |
|---|---|---|---|
| `subject` | String - Address | Yes | The XRPL classic address of the subject of the credential to revoke. |
| `credential` | String | Yes | The type of credential to revoke. This must match a credential type previously issued. |

A successful response from the API uses the HTTP status code `200 OK` and has a response body with the result of submitting the transaction to the XRP Ledger. You can use the `hash` value from the response to look up the transaction using an explorer.

## Code Walkthrough

The code for this tutorial is divided among the following files:

| File | Purpose |
|---|---|
| `accept_credential.js` | Commandline interface for a credential subject to look up and accept Credentials. |
| `credential.js` | Provides functions that validate credential input, verify supporting documents, and convert between the microservice’s simplified Credential format and the full XRPL representation of Credentials. |
| `errors.js` | Custom error classes that standardize how the server reports validation errors and XRPL transaction failures. |
| `issuer_service.js` | Defines the microservice as an Express app, including API methods and error handling. |
| `look_up_credentials.js` | A helper function for looking up Credentials tied to an account, including pagination and filtering, used by both the credential issuer and holder. |

### accept_credential.js

This file is meant to be run as a commandline tool so it starts with a [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)), followed by dependencies grouped by type: external packages (Node.js modules) first, and local modules last.

{% code-snippet file="/_code-samples/issue-credentials/js/accept_credential.js" language="js" before="const XRPL_SERVER =" /%}

It returns a `Wallet` instance in the `initWallet()` function, with the subject account's key pair, using a seed either passed as an environment variable, or input as a password:

{% code-snippet file="/_code-samples/issue-credentials/js/accept_credential.js" language="js" from="const XRPL_SERVER" before="async function main()" /%}

The `main()` function contains the core logic for the script. At the begining of the function it sets up the XRPL client, and calls `initWallet()` to instantiate a `Wallet` object:

{% code-snippet file="/_code-samples/issue-credentials/js/accept_credential.js" language="js" from="async function main()" before="const pendingCredentials =" /%}

It then looks up pending credentials using the `lookUpCredentials(...)` function imported from `look_up_credentials.js`:

{% code-snippet file="/_code-samples/issue-credentials/js/accept_credential.js" language="js" from="const pendingCredentials = " before="const choices" /%}

Next is a text menu that displays each of the unaccepted credentials returned by the lookup, as well as the option to quit:

{% code-snippet file="/_code-samples/issue-credentials/js/accept_credential.js" language="js" from="choices = " before="const chosenCred = " /%}

If the user picked a credential, the code constructs a [CredentialAccept transaction][], signs and submits it, and waits for it to be validated by consensus before displaying the result.

{% code-snippet file="/_code-samples/issue-credentials/js/accept_credential.js" language="js" from="const chosenCred = "  before="main().catch" /%}

Finally, the code runs the `main()` function:

{% code-snippet file="/_code-samples/issue-credentials/js/accept_credential.js" language="js" from="main().catch" /%}

### issuer_service.js

This file defines the Express app of the issuer microservice. It opens by importing dependencies, grouped into external packages and local files:

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" before="dotenv.config()" /%}

It returns a `Wallet` instance in the `initWallet()` function, with the subject account's key pair, using a seed either passed as an environment variable, or input as a password:

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="dotenv.config()" before="// Error handling" /%}

A function called `handleAppError(...)` is defined to handle errors thrown by the microservice.

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="// Error handling" before="async function main()" /%}

The `main()` function contains the core logic for the script. At the begining of the function it sets up the XRPL client, and calls `initWallet()` to instantiate a `Wallet` object:

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="async function main()" before="// Define Express app" /%}

Next, it creates the Express app:

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="// Define Express app" before="// POST /credential" /%}

After that come the definitions for the three API methods, starting with `POST /credential`. Users call this method to request a credential from the service. This method parses the request body as JSON and validates it. If this succeeds, it uses the data to fill out a `CredentialCreate` transaction. Finally, it checks the transaction's [result](../../references/protocol/transactions/transaction-results/index.md) to decide which HTTP response code to use:

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="// POST /credential" before="// GET /admin/credential" /%}

The next API method is `GET /admin/credential`, which looks up credentials issued by the service. It uses the `lookUpCredentials(...)` method defined in `look_up_credentials.js` to get a list of credentials. Then it calls the `serializeCredential(...)` and `parseCredentialFromXrpl(...)` functions, imported from `credential.js`, to transform each ledger entry from the XRP Ledger format to the simplified representation the microservice uses.

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="// GET /admin/credential" before="// DELETE /admin/credential" /%}

The final API method, `DELETE /admin/credential`, deletes a Credential from the ledger, revoking it. This again uses functions from `credential.js` to validate user inputs and translate them into XRPL format where necessary. After that, it attempts to look up the Credential in the ledger and returns an error if it doesn't exist. This way, the issuer doesn't have to pay the cost of sending a transaction that would fail. Finally, the method checks the transaction result and sets the HTTP response code accordingly.

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="// DELETE /admin/credential" before="const PORT = process.env.PORT" /%}

The port for the microservice is set to either an environment variable called `PORT` or to `3000`, and the application listens for connections at the assigned port:

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="const PORT = process.env.PORT" before="// Start the server" /%}

Finally, the code runs the `main()` function:

{% code-snippet file="/_code-samples/issue-credentials/js/issuer_service.js" language="js" from="// Start the server"  before="/**" /%}

### look_up_credentials.js

This file implements lookup of Credentials. Both the issuer code and the subject code use this function to look up their own credentials.

This code performs [pagination using markers](../../references/http-websocket-apis/api-conventions/markers-and-pagination.md) to get all the results from the ledger. It also filters results based on the issuer/subject account, so that lookup by issuer, for example, doesn't include credentials that someone else issued _to_ the issuer account. Finally, it can optionally check the accepted status of the Credentials and only include ones that are or aren't accepted.

{% code-snippet file="/_code-samples/issue-credentials/js/look_up_credentials.js" language="js" /%}

### credential.js

This file defines a set of helper functions that validate credential related input, verify request data, and convert between the issuer microservice's simplified Credential format and the XRP Ledger object representation. It throws typed errors on invalid input.

The file starts with importing dependencies, grouped into external packages and local files:

{% code-snippet file="/_code-samples/issue-credentials/js/credential.js" before="// Regex constants" language="js" /%}

It then defines regular expression constants that are used further on in the code to validate  the credential and uri:

{% code-snippet file="/_code-samples/issue-credentials/js/credential.js"  from="// Regex constants" before="/**" language="js" /%}

The function `validateCredentialRequest(...)` checks that the user input meets various requirements. It also parses the user-provided timestamp from a string to a native Javascript Date object if necessary.

{% code-snippet file="/_code-samples/issue-credentials/js/credential.js"  from="/**" before="// Convert " language="js" /%}

The `credentialFromXrpl(...)` function converts an XRPL ledger entry into a usable credential object (for example, converting the credential field from hexadecimal to a native string). The API methods that read data from the XRP Ledger use this function so that their output is formatted the same way as user input in the other API methods.

{% code-snippet file="/_code-samples/issue-credentials/js/credential.js"  from="// Convert an XRPL ledger" before="// Convert to an object" language="js" /%}

The `credentialToXrpl(...)` function returns an object which is formatted for submitting to the XRP Ledger:

{% code-snippet file="/_code-samples/issue-credentials/js/credential.js"  from="Convert to an object" before="export function verifyDocuments" language="js" /%}

Finally, the `verifyDocuments(...)` function checks for an additional field, `documents`. For a realistic credential issuer, you might require the user to provide specific documents in the request body, like a photo of their government-issued ID or a cryptographically signed message from another business, which your code would check. For this tutorial, the check is only a placeholder:

{% code-snippet file="/_code-samples/issue-credentials/js/credential.js"  from="export function verifyDocuments" language="js" /%}

### errors.js

This file defines custom error classes used by the credential issuer service to provide consistent error handling and help distinguish between different kinds of failures:

{% code-snippet file="/_code-samples/issue-credentials/js/errors.js"  language="js" /%}

## Next Steps

Using this service as a base, you can extend the service with more features, such as:

- Security/authentication to protect API methods from unauthorized use.
- Actually checking user documents to decide if you should issue a credential.

Alternatively, you can use credentials to for various purposes, such as:

- Define a [Permissioned Domain](/docs/concepts/tokens/decentralized-exchange/permissioned-domains) that uses your credentials to grant access to features on the XRP Ledger.
- [Verify credentials](../compliance-features/verify-credentials-javascript.md) manually to grant access to services that exist off-ledger.

## See Also

- [Python: Build a Credential Issuing Service](../sample-apps/credential-issuing-service-in-javascript.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
