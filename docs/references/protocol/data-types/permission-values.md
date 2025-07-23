---
seo:
    description: Format for permissions that can be granted to other accounts.
label:
    - Permissions
---
# Permission Values

The Permission Delegation amendment {% not-enabled /%} defines permissions that can be granted to other accounts. These permissions fall into three categories:

- **Full Permissions** - Permission to send transactions of any type.
- **Transaction Type Permissions** - Permission to send transactions with the specified [transaction type](../transactions/types/index.md).
- **Granular Permissions** - Permission to send transactions with a specific subset of functionality.

## Numeric and String Values

In the [canonical binary format](../binary-format.md) for transactions and ledger data, permission values are stored in a numeric form (specifically, as a 32-bit unsigned integer). However, in JSON they can be specified and returned in string format for convenience, similar to how transaction type names (`TransactionType` fields) work.

When specifying a permission value in JSON, you can use either the numeric value or the string value. When serving data, 

The numeric value `0` is reserved for "full permissions", meaning permission to send transactions of all types. ***TODO: but can you actually delegate full permissions?***

## Transaction Type Permissions

Transaction Type Permissions have numeric values from 1 to 65536 (2<sup>16</sup>), inclusive. They correspond with known transaction types, except you add 1 when specifying a transaction type as a permission value. For example, the string `"Payment"` corresponds to a `TransactionType` value of `0`, but a `PermissionValue` type of `1`. To grant permissions to make Payment transactions, you can specify either `"PermissionValue": "Payment"` or `"PermissionValue": 1`.

For a mapping of transaction types known by a server and their corresponding numeric transaction type values, check the `TRANSACTION_TYPES` field in the [server_definitions method][].

### List of Non-Delegatable Permissions

Some transaction types are not delegatable. If you attempt to grant these permissions to a delegate, the transaction fails with a [result code](../transactions/transaction-results/) such as `tecNO_PERMISSION`. This includes all transaction types that can be used to grant other permissions to different key pairs or accounts. Additionally, all [pseudo-transaction types](/docs/references/protocol/transactions/pseudo-transaction-types/pseudo-transaction-types) are not delegatable since they are not meant to be sent by normal accounts anyway.

The following permissions cannot be delegated:

| Transaction Type    | Permission Value |
|:--------------------|:-----------------|
| [AccountSet][]      | `4` |
| [SetRegularKey][]   | `6` |
| [SignerListSet][]   | `13` |
| [AccountDelete][]   | `22` |
| [LedgerStateFix][]  | `54` |
| [DelegateSet][]     | `65` |
| [EnableAmendment][] | `101` |
| [SetFee][]          | `102` |
| [UNLModify][]       | `103` |

## Granular Permissions
[[Source]](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/detail/permissions.macro "Source")

Granular Permissions have numeric types of 65537 and up, corresponding to specific names of permissions. Values that are not defined are not allowed. Each granular permission is a subset of a single transaction type's functionality.

| Numeric Value | Name                     | Transaction Type       | Description |
|:--------------|:-------------------------|:-----------------------|:------------|
| `65537`       | `TrustlineAuthorize`     | [TrustSet][]           | Can [authorize individual trust lines](/docs/concepts/tokens/fungible-tokens/authorized-trust-lines). |
| `65538`       | `TrustlineFreeze`        | [TrustSet][]           | Can [freeze individual trust lines](/docs/concepts/tokens/fungible-tokens/freezes). |
| `65539`       | `TrustlineUnfreeze`      | [TrustSet][]           | Can [unfreeze individual trust lines](/docs/concepts/tokens/fungible-tokens/freezes). |
| `65540`       | `AccountDomainSet`       | [AccountSet][]         | Can set the `Domain` field of the account. |
| `65541`       | `AccountEmailHashSet`    | [AccountSet][]         | Can set the `EmailHash` field of the account. |
| `65542`       | `AccountMessageKeySet`   | [AccountSet][]         | Can set the `MessageKey` field of the account. |
| `65543`       | `AccountTransferRateSet` | [AccountSet][]         | Can set the [transfer fee of fungible tokens issued by the account](/docs/concepts/tokens/transfer-fees). |
| `65544`       | `AccountTickSizeSet`     | [AccountSet][]         | Can set the [tick size of fungible tokens issued by the account](/docs/concepts/tokens/decentralized-exchange/ticksize). |
| `65545`       | `PaymentMint`            | [Payment][]            | Can send payments that mint new fungible tokens. ***TODO: Or MPTs? What about indirectly?*** |
| `65546`       | `PaymentBurn`            | [Payment][]            | Can send payments that burn fungible tokens. ***TODO: Or MPTs? More clarification needed.*** |
| `65547`       | `MPTokenIssuanceLock`    | [MPTokenIssuanceSet][] | Can lock the balances of a particular MPT issued by the account. _(Requires the [MPTokensV1 amendment][] {% not-enabled /%}.)_ |
| `65548`       | `MPTokenIssuanceUnlock`  | [MPTokenIssuanceSet][] | Can unlock the balances of a particular MPT issued by the account. _(Requires the [MPTokensV1 amendment][] {% not-enabled /%}.)_ |


{% raw-partial file="/docs/_snippets/common-links.md" /%}
