---
seo:
    description: XRPL accounts can delegate both transaction permissions and granular permissions to other accounts.
labels:
  - Accounts
  - Permissions
status: not_enabled
---
# Permission Delegation

Permission delegation is the function of granting various permissions to another account to send permissions on behalf of your account. This can be used instead of or alongside techniques such as [multi-signing](./multi-signing.md) to enable flexible security paradigms such as role-based access control.

## Background

Managing your [cryptographic keys](./cryptographic-keys.md) is one of the more challenging parts of using a blockchain. As part of a defense-in-depth strategy, a secure configuration should limit the damage that can occur if a secret key is compromised. One way to do this is to rotate keys regularly and to keep master keys off of computers that are always connected to the internet and serving user traffic. However, many use cases involve frequently and automatically signing transactions, which typically necessitates having secret keys on an internet-connected server.

Permission Delegation can help optimize for these sorts of challenges by granting very limited permissions to separate accounts that can have their keys available online, while keeping the master keys for the main account offline and only using them manually in special cases when rare, important tasks like issuing tokens are necessary. This is especially helpful when using compliance features like [Authorized Trust Lines](../tokens/fungible-tokens/authorized-trust-lines.md) that require a stablecoin issuer to individually approve each user after meeting regulatory requirements like Know Your Customer rules. With a proper configuration, the keys that are used to approve users cannot be used to perform other actions like issuing new tokens or rotating the issuer's key pairs.


## How It Works

The account on whose behalf transactions are being sent is called the _delegating account_. The account sending the transactions is called the _delegate_.

The delegating account first sends a [DelegateSet transaction][] to designate an account as its delegate and to specify which permissions the delegate has. The delegating account can update or revoke the permissions at any time by sending another DelegateSet transaction.

The delegate can send transactions that execute as if they were sent by the delegating account. These transactions specify both the delegating account's information as well as the address of the delegate who is sending the transaction. The delegate can sign these transactions with any of the following:

- The delegate's master key pair
- A regular key pair that the delegate has authorized
- A multi-signing list that the delegate has authorized

The delegate can only send transactions that match the permissions it has. Permissions come in two types:

- **Transaction Type Permissions** - Permission to send transactions of a specific [transaction type](/docs/references/protocol/transactions/types/index.md). Some types cannot be delegated.
- **Granular Permissions** - Permission to send transactions with a specific subset of functionality.

For a complete list of transaction types that can or cannot be delegated as well as a list of granular permissions, see [Permission Values](/docs/references/protocol/data-types/permission-values.md).


## Comparison with Multi-Signing

|                  | Permission Delegation | Multi-Signing |
|------------------|-----------------------|---------------|
| Transaction cost | Paid by the delegate | Paid by the account that owns the list |
| Permission control | Can only send transactions matching specific permissions granted | Can send any transactions except specific cases that require the master key pair |
| M-of-N permission | Not supported | Configurable quorum and weights with up to 32 signers |
| Unfunded accounts | Delegates must have funded accounts on ledger | Signers can be funded accounts or key pairs with no account on ledger. |
| Key management | Delegate manages their own keys, including multi-signing | Signers can manage their own keys but cannot perform nested multi-signing. |


## See Also

- **References:**
    - [DelegateSet transaction][] - Grant, update, or revoke permissions to a specific delegate.
    - [Delegate ledger entry][] - Data structure on the ledger that records which permissions have been granted.
- **Code Samples:**
    - {% repo-link path="_code-samples/delegate-permissions/" %}**Delegate Permissions**{% /repo-link %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
