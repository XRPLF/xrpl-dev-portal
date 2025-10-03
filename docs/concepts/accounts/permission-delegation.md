---
seo:
    description: Learn how XRPL Account Permission Delegation enables secure, granular control over your account transactions. Explore DelegateSet transactions for comprehensive permission and access management on the XRP Ledger.
labels:
  - Accounts
  - Permissions
status: not_enabled
---
# Permission Delegation

Permission delegation is the function of granting various permissions to another account to send permissions on behalf of your account. You can use permission delegation to enable flexible security paradigms such as role-based access control, instead of or alongside techniques such as [multi-signing](./multi-signing.md).

 {% amendment-disclaimer name="PermissionDelegation" /%}


## Background: The Need for Permission Delegation

Managing your [cryptographic keys](./cryptographic-keys.md) is one of the more challenging parts of using a blockchain. As part of a defense-in-depth strategy, a secure configuration should limit the damage that can occur if a secret key is compromised. One way to do this is to rotate keys regularly and to keep master keys off of computers that are always connected to the internet and serving user traffic. However, many use cases involve frequently and automatically signing transactions, which typically requires having secret keys on an internet-connected server.

Permission Delegation can reduce this problem by granting very limited permissions to separate accounts that have their keys available online for day-to-day tasks. Meanwhile, the keys with full control over the account can be kept offline, so that you only use them for special tasks, like issuing tokens. This is especially helpful when using compliance features like [Authorized Trust Lines](../tokens/fungible-tokens/authorized-trust-lines.md) that require a stablecoin issuer to individually approve each user after meeting regulatory requirements like Know Your Customer rules. With a proper configuration, you can minimize the consequences of a delegate's keys being compromized.


## How Permission Delegation Works

The account on whose behalf transactions are being sent is called the _delegator_. The account sending the transactions is called the _delegate_.

The delegator first sends a [DelegateSet transaction][] to designate an account as its delegate and to specify which permissions the delegate has. The delegator can update or revoke the permissions at any time by sending another DelegateSet transaction. A delegator can have more than one delegate, and can grant different sets of permissions to each delegate.

A delegate can send transactions that execute as if they were sent by the delegator. These transactions specify both the delegator's information as well as the address of the delegate who is sending the transaction. The delegate can sign these transactions with any of the following:

- The delegate's master key pair
- A regular key pair that the delegate has authorized
- A multi-signing list that the delegate has authorized

The delegate can only send transactions that match the permissions it has. Permissions come in two types:

- **Transaction Type Permissions** - Permission to send transactions of a specific [transaction type](/docs/references/protocol/transactions/types/index.md). Some types cannot be delegated.
- **Granular Permissions** - Permission to send transactions with a specific subset of functionality.

For a complete list of transaction types that can or cannot be delegated as well as a list of granular permissions, see [Permission Values](/docs/references/protocol/data-types/permission-values.md).

### Limitations of Permission Delegation

The main limiting factor on how many delegates you can have is that you must hold enough XRP to meet the [reserve requirement](./reserves.md). Each delegate's permissions are tracked with a [Delegate ledger entry][], which counts as one item towards the delegator's owner reserve.

Each delegate can be granted up to 10 permissions.

Some permissions cannot be delegated, especially permissions that would allow the delegate to change cryptographic keys or grant additional permissions.

The available set of granular permissions is hard-coded, and the permissions cannot be customized. For example, you cannot grant permission to send only certain currencies and not others.

## Comparison with Multi-Signing

Permission delegation is similar to multi-signing in that it allows other key pairs to sign transactions that "come from" your account. However, there are key differences in functionality between the two, as summarized in the following table:

|                  | Permission Delegation | Multi-Signing |
|------------------|-----------------------|---------------|
| Transaction cost | Paid by the delegate | Paid by the account that owns the list |
| Permission control | Can only send transactions matching specific permissions granted | Can send any transactions except [specific cases that require the master key pair](./cryptographic-keys.md#special-permissions) |
| M-of-N permission | Not supported | Configurable quorum and weights with up to 32 signers |
| Unfunded accounts | Delegates must have funded accounts on ledger | Signers can be funded accounts or key pairs with no account on ledger. |
| Key management | Delegate manages their own keys, including multi-signing | Signers with funded accounts can manage their own keys but cannot perform nested multi-signing. |


## See Also

- **References:**
    - [DelegateSet transaction][] - Grant, update, or revoke permissions to a specific delegate.
    - [Delegate ledger entry][] - Data structure on the ledger that records which permissions have been granted.
- **Code Samples:**
    - {% repo-link path="_code-samples/delegate-permissions/" %}**Delegate Permissions**{% /repo-link %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
