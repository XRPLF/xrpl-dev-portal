---
seo:
    description: An transaction that delegates a set of permissions to another account.
labels:
  - Accounts
  - Permissions
  - Delegate
status: not_enabled
---

# DelegateSet 
The `DelegateSet` transaction creates, modifies, or deletes a `Delegate` ledger object, thereby granting, changing, or revoking delegated permissions between accounts.

_(Requires the [PermissionDelegation amendment][] {% not-enabled /%})_

## Example `DelegateSet` JSON

```json
{ 
  "TransactionType": "DelegateSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": [
    {
      "Permission": {
        "PermissionValue": "Payment"
      }
    },
    {
      "Permission": {
        "PermissionValue": "TrustSet"
      }
    }
  ]
}
```
## `DelegateSet` Fields

In addition to the common fields, `DelegateSet` transactions have the following fields:

| Field | Required? | JSON Type | Internal Type | Description |
|-------|-----------|-----------|---------------|-------------|
| `TransactionType` | Yes | string | UInt16         | The transaction type (DelegateSet). |
| `Account` | Yes | string | AccountID       | The address of the account that is delegating the permission(s). |
| `Authorize`| Yes | string | AccountID | The address of the account that is being granted the permission(s).
| `Permissions` | Yes | string | STArray | An array of permission objects. Each object contains a `Permission` object with a `PermissionValue` field specifying the permission being granted. To modify permissions, include all desired permissions in the `Permissions` array. Omitted permissions are revoked. |

## Updating Permissions

Sending a new `DelegateSet` with the same `Account` and `Authorize` fields updates and replaces the permission list.


## Revoking Permissions

Permissions are revoked using the `DelegateSet` transaction by specifying only the desired permissions and omitting any previous permissions that are no longer needed.

### Revoke All Permissions

To revoke all permissions, send a `DelegateSet` transaction with an empty `Permissions` array:

```json
tx_json = {
  "TransactionType": "DelegateSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": []
}
```

### Revoke Specific Permissions 

To revoke specific permissions, include only the permissions that should remain active in the `Permissions` array.

## Security

Giving permissions to other parties requires a high degree of trust, especially when the delegated account can potentially access funds (the `Payment` permission) or charge reserves (any transaction that can create objects). In addition, any account that has permissions for the entire `AccountSet`, `SetRegularKey`, or `SignerListSet` transactions can give themselves any permissions even if this was not originally part of the intention.

With granular permissions, however, users can give permissions to other accounts for only parts of transactions without giving them full control. This is especially helpful for managing complex transaction types like `AccountSet`.

### Granular Permissions

These permissions support control over some smaller portion of a transaction, rather than being able to do all of the functionality that the transaction allows.

These permissions fall into the gap between the size of the `UInt16` and the `UInt32` (the size of the `SignerListID` field).

| Value | Name  | Description |
|-------|-------|-------------|
|`65537`|`TrustlineAuthorize`|Authorize a trustline.|
|`65538`|`TrustlineFreeze`|Freeze a trustline.|
|`65539`|`TrustlineUnfreeze`|Unfreeze a trustline.|
|`65540`|`AccountDomainSet`|Modify the domain of an account.|
|`65541`|`AccountEmailHashSet`|Modify the `EmailHash` of an account.|
|`65542`|`AccountMessageKeySet`|Modify the `MessageKey` of an account.|
|`65543`|`AccountTransferRateSet`|Modify the transfer rate of an account.|
|`65544`|`AccountTickSizeSet`|Modify the tick size of an account.|
|`65545`|`PaymentMint`|Send a payment for a currency where the sending account is the issuer.|
|`65546`|`PaymentBurn`|Send a payment for a currency where the destination account is the issuer.|
|`65547`|`MPTokenIssuanceLock`|Use the `MPTIssuanceSet` transaction to lock (freeze) a holder.|
|`65548`|`MPTokenIssuanceUnlock`|Use the `MPTIssuanceSet` transaction to unlock (unfreeze) a holder.|

For example, if an account is authorized by `TrustlineFreeze`, it can freeze a trust line by sending a `TrustSet` transaction. However, since it is only authorized to freeze trust lines, it cannot perform other `TrustSet` operations such as unfreezing a trust line, setting No Ripple, applying Deep Freeze, etc.
When an account is authorized by both `TrustlineFreeze` and `TrustSet`, the delegation is still valid, but the granular permission `TrustlineFreeze` has no effect, since the account is already permitted to perform all actions under `TrustSet`.

For multi-signing a delegation transaction, which is sent by a delegated account, the multi signers must be the delegated account's signers instead of the delegating account's multi signers.

### Limitations to Granular Permissions

The set of permissions must be hard-coded. No custom configurations are allowed. For example, you cannot add permissions based on specific currencies. 

In addition, each permission needs to be implemented on its own in the source code. Adding a new permission requires an amendment.


## Failure Conditions

The `DelegateSet` transaction fails if:

- The `Permissions` array contains more than 10 entries.
- The `Permissions` array contains duplicate entries.
- Any of the specified `PermissionValues` are invalid.
- The `Authorize` account does not exist.

## State Changes

A successful `DelegateSet` transaction results in the creation, modification, or deletion of a `Delegate` ledger object.

- If no `Delegate` object exists for the given `Account` and `Authorize` pair, a new one is created.
- If a `Delegate` object already exists, its `Permissions` field is updated.
- If the `Permissions` array is empty, the `Delegate` object is deleted.

## Error Cases

- If the `Account` is the same as `Authorize`, return `temMALFORMED`.

- If the `Authorize` account does not exist, return `tecNO_TARGET`.

- If the `Permissions` list size exceeds 10, return `temARRAY_TOO_LARGE`.

- If `Permissions` contains a duplicate value, return `temMALFORMED`.

- If `Permissions` contains transactions that are disabled for delegation, return `tecNO_PERMISSION`.
The transactions disabled for delegation include: `AccountSet`, `RegularKeySet`, `SignerListSet`, `AccountDelete`, `DelegateSet`, `EnableAmendment`, `SetFee`, `UNLModify`, `LedgerStateFix`.

- If the Account does not have enough balance to meet the reserve requirement, (because `DelegateSet` will create a ledger object `ltDELEGATE`, whose owner is `Account`), return `tecINSUFFICIENT_RESERVE`.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
