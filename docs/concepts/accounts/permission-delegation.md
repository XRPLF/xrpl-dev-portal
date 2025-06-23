---
seo:
    description: XRPL accounts can delegate both transaction permissions and granular permissions to other accounts.
labels:
  - Accounts
  - Permissions
status: not_enabled
---
# Permission Delegation
XRPL accounts can delegate both transaction permissions and granular permissions to other accounts, enhancing flexibility and enabling use cases such as implementing role-based access control. This delegation is managed using the [`DelegateSet`](../../references/protocol/transactions/types/delegateset.md) transaction.

_(Requires the [PermissionDelegation amendment][] {% not-enabled /%})_

## Assigning Permissions

You can assign permissions to another account by submitting a `DelegateSet` transaction.

```json
tx_json = {
  "TransactionType": "DelegateSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": [
    {
      "Permission": {
        "PermissionValue": "Payment"
      } 
    } 
  ] 
} 
```

| Field | Description |
|-------|-------------|
| `Account` | The address of the account that is delegating the permission(s). |
| `Authorize` | The address of the account that is being granted the permission(s). |
| `Permissions` | An array of permission objects, specifying the permissions to delegate. Each permission is defined within a `Permission` object, using the `PermissionValue` field. See [XLS-74d, Account Permissions] for a complete list of valid `PermissionValues`. |  

## Revoking Permissions

Permissions can be revoked using the `DelegateSet` transaction. There are two ways to revoke permissions:

### Revoke All Permissions

To revoke all permissions previously granted to a delegated account, send a `DelegateSet` transaction with an empty `Permissions` array:

```json
tx_json = {
  "TransactionType": "DelegateSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": []
}
```

### Revoke Specific Permissions

To revoke specific permissions, send a `DelegateSet` transaction that includes _only_ the permissions that should remain active. Any permissions previously granted to the `Authorize` account that aren't included in the `Permissions` array are revoked.

## Sending Transactions with Delegated Permissions

When an account has been granted permissions, it can send transactions on behalf of the delegating account using the `Delegate` field.

For example, if `rDelegatingAccount` has delegated the `TrustSet` permission to `rDelegatedAccount`, then `rDelegatedAccount` can submit a `TrustSet` transaction on behalf of `rDelegatingAccount` as follows:

```json
transaction_json = {
  "TransactionType": "TrustSet",
  "Account": "rDelegatingAccount",
  "Delegate": "rDelegatedAccount",
  "LimitAmount": {
    "currency": "USD",
    "issuer": "rIssuerAccount",
    "value": "1000"
  }
} 
```

| Field | Description |
|-------|-------------|
| `Account` | The address of the account that granted permission for the transaction (the _delegating_ account). |
| `Delegate` | The address of the account submitting and signing the transaction. This must be the account that was granted permission (the _delegated_ account). |

The account that sends this transaction is _rDelegatedAccount_, although the Account field is the _rDelegatingAccount_. The secret for this transaction is the _rDelegatedAccount_ secret, which means _rDelegatedAccount_ signs the transaction.

## Error Cases

- If the `PermissionDelegation` feature is not enabled, return `temDISABLED`.

- If the _rDelegatedAccount_ is not authorized by the _rDelegatingAccount_ for the transaction type or satisfying the granular permissions given by _rDelegatingAccount_, the transaction returns `tecNO_DELEGATE_PERMISSION`.

- If the _rDelegatedAccount_ does not have enough balance to pay the transaction fee, the transaction returns `terINSUF_FEE_B` . (_rDelegatedAccount_ pays the fee, which is the sender in `Delegate` field, not the `Account` field).

- If the transaction creates a ledger object, but _rDelegatingAccount_ does not have enough balance to cover the reserve, the transaction returns `tecINSUFFICIENT_RESERVE`.

- If the key used to sign this account does not match with _rDelegatedAccount_, the transaction returns `rpcBAD_SECRET`.

- If the `TradingFee` is invalid (non-XRP currency or negative value), return `temBAD_FEE`.

Any other errors are the same as when the _rDelegatingAccount_ sends transaction for itself.

{% admonition type="warning" name="Important" %}
* Delegating permissions grants significant control. Ensure you trust the delegated account.
* The account specified in the `Delegate` field is responsible for paying the transaction fee.
* A delegated account can only perform actions that have been explicitly permitted.
{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
