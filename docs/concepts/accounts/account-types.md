---
html: account-types.html
parent: accounts.html
seo:
    description: Businesses sending transactions on the XRP Ledger automatically should set up separate addresses for different purposes to minimize risk.
labels:
  - Tokens
  - Security
---
# Account Types

{% partial file="/docs/_snippets/issuing-and-operational-addresses-intro.md" /%}


## Funds Lifecycle

When a token issuer follows this separation of roles, funds tend to flow in specific directions, as in the following diagram:

[{% inline-svg file="/docs/img/issued-currency-funds-flow.svg" /%}](/docs/img/issued-currency-funds-flow.svg "Diagram: Funds flow from the issuing address to standby addresses, to operational addresses, to customer and partner addresses, and finally back to the issuing address.")

The issuing address creates tokens by sending payments to standby addresses. These tokens have negative value from the perspective of the issuing address, since they (often) represent obligations. The same tokens have positive value from other perspectives, including from the perspective of a standby address.

The standby addresses, which are operated by actual humans, send those tokens to operational addresses. This step allows the issuing address to be used as little as possible after this point, while having at least some tokens available on standby.

Operational addresses, which are operated by automated systems, send payments to other counterparties, such as liquidity providers, partners, and other customers. Those counterparties may send funds freely among themselves multiple times.

As always, token payments must "ripple through" the issuer across trust lines.

Eventually, someone sends tokens back to the issuer. This destroys those tokens, reducing the issuer's obligations in the XRP Ledger. If the token is a stablecoin, this is the first step of redeeming the tokens for the corresponding off-ledger assets.


## Issuing Address

The issuing address is like a vault. Partners, customers, and operational addresses create trust lines to the issuing address, but this address sends as few transactions as possible. Periodically, a human operator creates and signs a transaction from the issuing address to refill the balances of a standby or operational address. Ideally, the secret key used to sign these transactions should never be accessible from any internet-connected computer.

Unlike a vault, the issuing address can receive payments directly from customers and partners. Since all transactions in the XRP Ledger are public, automated systems can watch for payments to the issuing address without needing a secret key.

### Issuing Address Compromise

If a malicious actor learns the secret key behind a institution's issuing address, that actor can create new tokens and send them to users or trade them in the decentralized exchange. This can make a stablecoin issuer insolvent. It can become difficult for the financial institution to distinguish legitimately-obtained tokens and redeem them fairly. If a financial institution loses control of its issuing address, the institution must create a new issuing address, and all users who have trust lines to the old issuing address must create new trust lines with the new address.

### Multiple Issuing Addresses

A financial institution can issue more than one type of token in the XRP Ledger from a single issuing address. However, there are some settings that apply equally to all (fungible) tokens issued from an address, including the percentage for [transfer fees](../tokens/transfer-fees.md) and the [global freeze](../tokens/fungible-tokens/freezes.md) status. If the financial institution wants the flexibility to manage settings differently for each type of token, the institution must multiple issuing addresses.


## Operational Addresses

An operational address is like a cash register. It makes payments on behalf of the institution by transferring tokens to customers and partners. To sign transactions automatically, the secret key for an operational address must be stored on a server that is connected to the internet. (The secret key can be stored encrypted, but the server must decrypt it to sign transactions.) Customers and partners do not, and should not, create trust lines to an operational address.

Each operational address has a limited balance of tokens and XRP. When the balance of an operational address gets low, the financial institution refills it by sending a payment from the issuing address or a standby address.

### Operational Address Compromise

If a malicious actor learns the secret key behind an operational address, the financial institution can only lose as much as that operational address holds. The institution can switch to a new operational address with no action from customers and partners.


## Standby Addresses

Another optional step that an institution can take to balance risk and convenience is to use "standby addresses" as an intermediate step between the issuing address and operational addresses. The institution can fund additional XRP Ledger addresses as standby addresses, whose keys are not available to always-online servers, but are entrusted to different trusted users.

When an operational address is running low on funds (either tokens or XRP), a trusted user can use a standby address to refill the operational address's balance. When a standby addresses run low on funds, the institution can use the issuing address to send more funds to a standby address in a single transaction, and the standby addresses can distribute those funds among themselves if necessary. This improves security of the issuing address, allowing it to make fewer total transactions, without leaving too much money in the control of a single automated system.

As with operational addresses, a standby address must have an accounting relationship with the issuing address, and not with customers or partners. All precautions that apply to operational addresses also apply to standby addresses.

### Standby Address Compromise

If a standby address is compromised, the consequences are like an operational address being compromised. A malicious actor can steal any balances possessed by the standby address, and the financial institution can change to a new standby address with no action from customers and partners.


## See Also

- **Concepts:**
    - [Accounts](index.md)
    - [Cryptographic Keys](cryptographic-keys.md)
- **Tutorials:**
    - [Assign a Regular Key Pair](../../tutorials/how-tos/manage-account-settings/assign-a-regular-key-pair.md)
    - [Change or Remove a Regular Key Pair](../../tutorials/how-tos/manage-account-settings/change-or-remove-a-regular-key-pair.md)
- **References:**
    - [account_info method][]
    - [SetRegularKey transaction][]
    - [AccountRoot object](../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
