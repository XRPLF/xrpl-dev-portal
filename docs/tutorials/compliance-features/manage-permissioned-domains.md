---
seo:
    description: Create and manage a permissioned domain to restrict access to financial services that meet compliance requirements.
labels:
  - Decentralized Finance
  - Permissioned Domains
---
# Use Permissioned Domains

This tutorial shows how to create a [permissioned domain](../../concepts/tokens/decentralized-exchange/permissioned-domains.md), which can be used to grant access to specific other features like [Permissioned DEXes](../../concepts/tokens/decentralized-exchange/permissioned-dexes.md) and [Single Asset Vaults](../../concepts/tokens/single-asset-vaults.md). It also shows how to modify a domain to update its set of accepted credentials and how to delete a permissioned domain.


## Goals

By following this tutorial, you should learn how to:

- Create a permissioned domain.
- Modify or delete a permissioned domain.

## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger, including what [permissioned domains](../../concepts/tokens/decentralized-exchange/permissioned-domains.md) and [credentials](../../concepts/decentralized-storage/credentials.md) are.
- Have an [XRP Ledger client library](../../references/client-libraries.md), such as **xrpl.js**, installed.


## Source Code

You can find the complete source code for this tutorial's examples in the {% repo-link path="_code-samples/permissioned-domains/" %}code samples section of this website's repository{% /repo-link %}.


## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Connect and get account(s)

To get started, import the client library and instantiate an API client. You also need an issuer address and credential type for the credential that will grant access to your domain. The credentials themselves don't have to be issued yet; you can do that separately before or after setting up the domain, or you can rely on credentials issued by a third party.

{% admonition type="success" name="Tip" %}
This tutorial doesn't cover the process of issuing and accepting credentials. For examples of that, see:

- [Manage Credentials](./manage-credentials.md)
- [Build a Credential Issuing Service in JavaScript](../sample-apps/credential-issuing-service-in-javascript.md) or [in Python](../sample-apps/credential-issuing-service-in-python.md)
{% /admonition %}

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/permissioned-domains/py/create_domain.py" language="py" before="# Create a domain" /%}
{% /tab %}
{% /tabs %}


### 3. Send PermissionedDomainSet transaction

To create a permissioned domain, send a [PermissionedDomainSet transaction][] omitting the `DomainID` field. In the `AcceptedCredentials` field, specify the credentials that grant access to the domain.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/permissioned-domains/py/create_domain.py" language="py" from="# Create a domain" before="# Find Domain ID" /%}
{% /tab %}
{% /tabs %}

### 4. Find the Domain ID

To identify the permissioned domain later, you need its Domain ID. It is possible to calculate this using the [Permissioned Domain ID format](/docs/references/protocol/ledger-data/ledger-entry-types/permissioneddomain#permissioneddomain-id-format), but it is often easier to find it in the metadata of the transaction that created the domain. Look through the [transaction metadata](/docs/references/protocol/transactions/metadata) for a `CreatedNode` of type `PermissionedDomain`. The `LedgerIndex` field of that entry is the Domain ID.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/permissioned-domains/py/create_domain.py" language="py" from="# Find Domain ID" before="# Save config" /%}
{% /tab %}
{% /tabs %}

You need to know the Domain ID to modify or delete the domain, as well as when setting up a [permissioned DEX](/docs/concepts/tokens/decentralized-exchange/permissioned-dexes) or anything else that uses the permissioned domain for access.

{% admonition type="info" name="Caution" %}
The sample code also saves the generated values for use with other sample scripts. Of course, saving secret keys in plaintext on disk is not ideal from a security perspective, but it's acceptable for Testnet accounts with no real-world value. You should use a more robust system when working with Mainnet accounts.
{% /admonition %}

## Other Tasks

Other tasks you might do with a permissioned domain include modifying it to change the set of accepted credentials, or deleting it. The code samples below omit the setup steps for these tasks, but you can see the {% repo-link path="_code-samples/permissioned-domains/" %}full source code{% /repo-link %} for specifics.

### Modify a Permissioned Domain

To modify an existing domain, send a [PermissionedDomainSet transaction][] like the one that created it, except this time you actually _do_ specify the `DomainID` field.

{% tabs %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/permissioned-domains/py/modify_domain.py" language="py" from="# Modify a permissioned domain" /%}
{% /tab %}
{% /tabs %}

### Delete a Permissioned Domain

To delete a permissioned domain that you own, send a [PermissionedDomainDelete transaction][] with the `DomainID` of the domain to delete.

{% tabs %}
{% tab label="Python" %}
Make sure to import the correct transaction type first.

```py
from xrpl.models.transactions import PermissionedDomainDelete
```

{% code-snippet file="/_code-samples/permissioned-domains/py/delete_domain.py" language="py" from="# Delete a permissioned domain" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts:**
    - [Credentials](/docs/concepts/decentralized-storage/credentials)
    - [Permissioned Domains](/docs/concepts/tokens/decentralized-exchange/permissioned-domains)
    - [Permissioned DEXes](/docs/concepts/tokens/decentralized-exchange/permissioned-dexes)
    - [Single Asset Vaults](/docs/concepts/tokens/single-asset-vaults)
- **Tutorials:**
    - [Manage Credentials](./manage-credentials.md)
    - [Build a Credential Issuing Service in JavaScript](../sample-apps/credential-issuing-service-in-javascript.md)
    - [Build a Credential Issuing Service in Python](../sample-apps/credential-issuing-service-in-python.md)
    - [Trade in the Decentralized Exchange](../defi/dex/trade-in-the-decentralized-exchange.md)
- **References:**
    - [PermissionedDomainSet transaction][]
    - [PermissionedDomainDelete transaction][]
    - [PermissionedDomain entry][]


{% raw-partial file="/docs/_snippets/common-links.md" /%}
