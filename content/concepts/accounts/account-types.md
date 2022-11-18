# Account Types

In the XRP Ledger, financial institutions typically use multiple XRP Ledger accounts to minimize the risk associated with a compromised secret key. The industry standard is to separate roles as follows:

* One *issuing account*, also known as a "cold wallet." This account is the hub of the financial institution's accounting relationships in the ledger, but sends as few transactions as possible.
* One or more *operational accounts*, also known as "hot wallets." Automated, internet-connected systems use the secret keys to these accounts to conduct day-to-day business like transfers to customers and partners.
* Optional *standby accounts*, also known as "warm wallets." Trusted human operators use these accounts to transfer money to the operational accounts.

## Issuing Account

The issuing account is like a vault. Partners, customers, and operational accounts create trust lines to the issuing account, but this account sends as few transactions as possible. Periodically, a human operator creates and signs a transaction from the issuing account to refill the balances of a standby or operational account. Ideally, the secret key used to sign these transactions should never be accessible from any internet-connected computer.

Unlike a vault, the issuing account can receive payments directly from customers and partners. Since all transactions in the XRP Ledger are public, automated systems can watch for payments to the issuing account without needing a secret key.

### Issuing Account Compromise

If a malicious actor learns the secret key behind a institution's issuing account, that actor can create new tokens and send them to users or trade them in the decentralized exchange. This can make a stablecoin issuer insolvent. It can become difficult for the financial institution to distinguish legitimately-obtained tokens and redeem them fairly. If a financial institution loses control of its issuing account, the institution must create a new issuing account, and all users who have trust lines to the old issuing account must create new trust lines with the new account.

### Multiple Issuing Accounts

A financial institution can issue more than one type of token in the XRP Ledger from a single issuing account. However, there are some settings that apply equally to all (fungible) tokens issued from an account, including the percentage for [transfer fees](../tokens/transfer-fees.md) and the [global freeze](../tokens/freezing-tokens.md) status. If the financial institution wants the flexibility to manage settings differently for each type of token, the institution must multiple issuing accounts.


## Operational Accounts

An operational account is like a cash register. It makes payments on behalf of the institution by transferring tokens to customers and partners. To sign transactions automatically, the secret key for an operational account must be stored on a server that is connected to the internet. (The secret key can be stored encrypted, but the server must decrypt it to sign transactions.) Customers and partners do not, and should not, create trust lines to an operational account.

Each operational account has a limited balance of tokens and XRP. When the balance of an operational account gets low, the financial institution refills it by sending a payment from the issuing account or a standby account.

### Operational Account Compromise

If a malicious actor learns the secret key behind an operational account, the financial institution can only lose as much as that operational account holds. The institution can switch to a new operational account with no action from customers and partners.


## Standby Accounts

Another optional step that an institution can take to balance risk and convenience is to use "standby accounts" as an intermediate step between the issuing account and operational accounts. The institution can fund additional XRP Ledger accounts as standby accounts, whose keys are not available to always-online servers, but are entrusted to different trusted users.

When an operational account is running low on funds (either tokens or XRP), a trusted user can use a standby account to refill the operational account's balance. When a standby accounts run low on funds, the institution can use the issuing account to send more funds to a standby account in a single transaction, and the standby accounts can distribute those funds among themselves if necessary. This improves security of the issuing account, allowing it to make fewer total transactions, without leaving too much money in the control of a single automated system.

As with operational accounts, a standby account must have an accounting relationship with the issuing account, and not with customers or partners. All precautions that apply to operational accounts also apply to standby accounts.

### Standby Account Compromise

If a standby account is compromised, the consequences are like an operational account being compromised. A malicious actor can steal any balances possessed by the standby account, and the financial institution can change to a new standby account with no action from customers and partners.

## Funds Lifecycle

When a token issuer follows this separation of roles, funds tend to flow in specific directions, as in the following diagram:

<!--
{{ include_svg("../../../img/issued-currency-funds-flow.svg", "Diagram: Funds flow from the issuing account to standby accounts, to operational accounts, to customer and partner accounts, and finally back to the issuing account.")}}
-->

The issuing account creates tokens by sending payments to standby accounts. These tokens have negative value from the perspective of the issuing account, since they (often) represent obligations. The same tokens have positive value from other perspectives, including from the perspective of a standby account.

The standby accounts, which are operated by actual humans, send those tokens to operational accounts. This step allows the issuing account to be used as little as possible after this point, while having at least some tokens available on standby.

Operational accounts, which are operated by automated systems, send payments to other counterparties, such as liquidity providers, partners, and other customers. Those counterparties may send funds freely among themselves multiple times.

As always, token payments must "ripple through" the issuer across trust lines with sufficient limits.

Eventually, someone sends tokens back to the issuer. This destroys those tokens, reducing the issuer's obligations in the XRP Ledger. If the token is a stablecoin, this is the first step of redeeming the tokens for the corresponding off-ledger assets.

<!--

## See Also

- **Concepts:**
    - [Accounts](accounts.html)
    - [Cryptographic Keys](cryptographic-keys.html)
- **Tutorials:**
    - [Become an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html)
    - [Assign a Regular Key Pair](assign-a-regular-key-pair.html)
    - [Change or Remove a Regular Key Pair](change-or-remove-a-regular-key-pair.html)
- **References:**
    - [account_info method][]
    - [SetRegularKey transaction][]
    - [AccountRoot object](accountroot.html)
-->