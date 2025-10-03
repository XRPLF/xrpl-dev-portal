---
seo:
    description: Format for permissions that can be granted to other accounts.
label:
    - Permissions
status: not_enabled
---
# Permission Values

[Permission delegation](/docs/concepts/accounts/permission-delegation.md) defines permissions that can be granted to other accounts. These permissions fall into the following categories:

- **Transaction Type Permissions** - Permission to send transactions with the specified [transaction type](../transactions/types/index.md).
- **Granular Permissions** - Permission to send transactions with a specific subset of functionality.

{% amendment-disclaimer name="PermissionDelegation" /%}

## Numeric and String Values

In the [canonical binary format](../binary-format.md) for transactions and ledger data, permission values are stored in a numeric form (specifically, as a 32-bit unsigned integer). However, in JSON they can be specified and returned in string format for convenience, similar to how transaction type names (`TransactionType` fields) work.

When specifying a permission value in JSON, you can use either the numeric value or the string value. When serving data, the server supplies the string value if it is known, and falls back to the numeric value otherwise.

{% admonition type="warning" name="Caution" %}
Not all client libraries support numeric PermissionValue types. In most cases, you should use the string names of the permissions you want to grant.
{% /admonition %}

- For **transaction type permissions**, the string is the name of the transaction type exactly (case-sensitive). For example, a permission value of `"PaymentChannelClaim"` grants permission to send [PaymentChannelClaim transactions][].
- For **granular permissions**, the string is the name of the granular permission (case-sensitive). For example, a permission value of `"TrustlineAuthorize"` grants permission to send TrustSet transactions that authorize trust lines (but not ones that modify other settings such as the trust line limit or freeze status).

The numeric value `0` is reserved for "full permissions", meaning permission to send transactions of all types, but it is not possible to delegate full permissions.

## Transaction Type Permissions

Transaction Type Permissions have numeric values from 1 to 65536 (that is, 2<sup>16</sup>), inclusive. They correspond with known transaction types, except you add 1 when specifying a transaction type as a permission value. For example, the string `"Payment"` corresponds to a `TransactionType` value of `0`, but a `PermissionValue` value of `1`. To grant permissions to make Payment transactions, you can specify either `"PermissionValue": "Payment"` or `"PermissionValue": 1`.

For a mapping of transaction types known by a server and their corresponding numeric transaction type values, check the `TRANSACTION_TYPES` field in the [server_definitions method][].

### List of Non-Delegatable Permissions

Some transaction types can't be delegated. If you attempt to grant these permissions to a delegate, the transaction fails with a [result code](../transactions/transaction-results/) such as `tecNO_PERMISSION`. This includes all transaction types that can be used to grant other permissions to different key pairs or accounts. Additionally, all [pseudo-transaction types](/docs/references/protocol/transactions/pseudo-transaction-types/pseudo-transaction-types) can't be delegated since they can't be sent by normal accounts anyway.

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

{% admonition type="warning" name="Known Issue" %}
With only the PermissionDelegation amendment, it's possible to assign permissions for transaction types that are reserved, unassigned, or part of amendments that are not currently enabled; it's also possible to assign PermissionValue `0` for full permissions. However, these values do not actually grant any permissions. This is a bug, and a future amendment will prevent assigning values outside of currently-enabled, delegatable transaction types or known granular permissions.
{% /admonition %}

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
| `65545`       | `PaymentMint`            | [Payment][]            | Can send payments that mint new fungible tokens or MPTs. |
| `65546`       | `PaymentBurn`            | [Payment][]            | Can send payments that burn fungible tokens or MPTs. |
| `65547`       | `MPTokenIssuanceLock`    | [MPTokenIssuanceSet][] | Can lock the balances of a particular MPT issued by the account. {% amendment-disclaimer name="MPTokensV1" /%} |
| `65548`       | `MPTokenIssuanceUnlock`  | [MPTokenIssuanceSet][] | Can unlock the balances of a particular MPT issued by the account. {% amendment-disclaimer name="MPTokensV1" /%} |

### Limitations to Granular Permissions

The set of granular permissions is hard-coded. No custom configurations are allowed. For example, you cannot add permissions based on specific currencies. Adding a new granular permission requires an amendment.


{% raw-partial file="/docs/_snippets/common-links.md" /%}
