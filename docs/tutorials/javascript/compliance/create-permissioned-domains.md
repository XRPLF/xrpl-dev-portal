---
seo:
  description: Create a permissioned domain to restrict access to financial services that meet compliance requirements.
labels:
  - Decentralized Finance
  - Permissioned Domains
---

# Create Permissioned Domains

Permissioned domains are controlled environments within the broader ecosystem of the XRP Ledger blockchain. Domains restrict access to other features such as Permissioned DEXes and Lending Protocols, only allowing access to them for accounts with specific credentials.

This example shows how to:

1. Issue a credential to an account.
2. Create a permissioned domain with the issued credential.
3. Delete the permissioned domain.

[![Create Permissioned Domain Test Harness](/docs/img/create-permissioned-domain-1.png)](/docs/img/create-permissioned-domain-1.png)

Download the [Modular Tutorials](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/modular-tutorials/) folder.

{% admonition type="info" name="Note" %}
Without the Modular Tutorial Samples, you will not be able to try the examples that follow.
{% /admonition %}

## Get Accounts

To get test accounts:

1. Open `create-permissioned-domains.html` in a browser.
2. Get test accounts.
   - If you copied the gathered information from another tutorial:
     1. Paste the gathered information to the **Result** field.
     2. Click **Distribute Account Info**.
   - If you have an existing account seed:
     1. Paste the account seed to the **Account 1 Seed** or **Account 2 Seed** field.
     2. Click **Get Account 1 from Seed** or **Get Account 2 from Seed**.
   - If you do not have existing accounts:
     1. Click **Get New Account 1**.
     2. Click **Get New Account 2**.

[![Created Accounts](/docs/img/create-permissioned-domain-2.png)](/docs/img/create-permissioned-domain-2.png)

## Issue a Credential

1. Click the **Account 1** radial button. This account will be the credential issuer.
2. Copy the account 2 address into **Subject**.
3. Enter a **Credential Type**. For example, _KYC_.
4. Click **Create Credential**.

[![Created Credential](/docs/img/create-permissioned-domain-3.png)](/docs/img/create-permissioned-domain-3.png)

## Create a Permissioned Domain

1. Click **Create Permissioned Domain**.
2. Copy the _LedgerIndex_ value from the metadata response.
3. (Optional) Update the permissioned domain with a different credential.
   1. Change the **Credential Type**.
   2. Click **Create Credential**.
   3. Copy the _LedgerIndex_ value into **DomainID**.
   4. Click **Create Permissioned Domain**.

[![Created Domain](/docs/img/create-permissioned-domain-4.png)](/docs/img/create-permissioned-domain-4.png)

## Delete a Permissioned Domain

1. Copy the _LedgerIndex_ value into **DomainID**.
2. Click **Delete Permissioned Domain**.

[![Deleted Domain](/docs/img/create-permissioned-domain-5.png)](/docs/img/create-permissioned-domain-5.png)

# Code Walkthrough

## credential-manager.js

### Create Credential

Define a function that issues a credential to a subject and connects to the XRP Ledger.

{% code-snippet file="/_code-samples/modular-tutorials/credential-manager.js" language="js" from="// Create credential function" before="// Gather transaction info" /%}

Gather the issuer information, subject, and credential type. Convert the credential type value to a hex string if not already in hex. Wrap the code in a `try-catch` block to handle errors.

{% code-snippet file="/_code-samples/modular-tutorials/credential-manager.js" language="js" from="// Gather transaction info" before="// Submit transaction" /%}

Submit the `CredentialCreate` transaction and report the results. Parse the metadata response to return only relevant credential info.

{% code-snippet file="/_code-samples/modular-tutorials/credential-manager.js" language="js" from="// Submit transaction" /%}

## permissioned-domain-manager.js

### Create Permissioned Domain

Define a function that creates a permissioned domain and connects to the XRP Ledger.

{% code-snippet file="/_code-samples/modular-tutorials/permissioned-domain-manager.js" language="js" from="/// Create permissioned domain" before="// Gather transaction info" /%}

Gather issuer information, credential type, and domain ID. Format the transaction depending on if the optional domain ID field is included. Wrap the code in a `try-catch` block to handle errors.

{% code-snippet file="/_code-samples/modular-tutorials/permissioned-domain-manager.js" language="js" from="// Gather transaction info" before="// Submit transaction" /%}

Submit the `PermissionedDomainSet` transaction and report the results. The metadata is formed differently if a domain ID is included; parse the response accordingly.

{% code-snippet file="/_code-samples/modular-tutorials/permissioned-domain-manager.js" language="js" from="// Submit transaction" before="// End create permissioned domain" /%}

### Delete Permissioned Domain

Define a function to delete a permissioned domain and connect to the XRP Ledger.

{% code-snippet file="/_code-samples/modular-tutorials/permissioned-domain-manager.js" language="js" from="// Delete permissioned domain" before="// Get delete domain transaction info" /%}

Gather account information and domain ID values. Wrap the code in a `try-catch` block to handle errors.

{% code-snippet file="/_code-samples/modular-tutorials/permissioned-domain-manager.js" language="js" from="// Get delete domain transaction info" before="// Submit delete domain transaction" /%}

Submit the `PermissionedDomainDelete` transaction and report the results.

{% code-snippet file="/_code-samples/modular-tutorials/permissioned-domain-manager.js" language="js" from="// Submit delete domain transaction" /%}
