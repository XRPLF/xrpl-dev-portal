---
seo:
    description: Grant another account permission to send some transactions for you, or revoke that permission.
labels:
  - Accounts
  - Permissions
  - Delegate
status: not_enabled
requiredAmendment: PermissionDelegation
txIcon: modify
---
# DelegateSet
{% source-link path="src/libxrpl/tx/transactors/delegate/DelegateSet.cpp" /%}

[Delegate permissions](/docs/concepts/accounts/permission-delegation) to another account to send transactions on your behalf. This transaction type can grant, change, or revoke permissions; it creates, modifies, or deletes a [Delegate ledger entry][] accordingly.

{% amendment-disclaimer name="PermissionDelegation" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "DelegateSet",
    "Account": "rw81qtsfF9rws4RbmYepf5394gp81TQv5Y",
    "Authorize": "r9GAKojMTyexqvy8DXFWYq63Mod5k5wnkT",
    "Fee": "1",
    "Flags": 0,
    "LastLedgerSequence": 4747822,
    "Permissions": [
        {
            "Permission": {
                "PermissionValue": "AccountDomainSet"
            }
        }
    ],
    "Sequence": 4747802
}
```

{% tx-example txid="13E1C2CE2BCECB6223AEA39407169C5429FE9A126825CDD6952E3FF4C728F603" server="devnet" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field         | Required? | JSON Type            | Internal Type | Description |
|:--------------|-----------|----------------------|---------------|-------------|
| `Authorize`   | Yes       | String - [Address][] | AccountID     | The account being granted permissions, also called the _delegate_. |
| `Permissions` | Yes       | Array                | Array         | A list of up to 10 [Permission objects](#permission-objects) each specifying a different permission granted to the delegate. The delegate's permissions are updated to match this set of permissions exactly. To revoke all permissions, use an empty array; this is only valid when a [Delegate ledger entry][] already exists for the delegate. |

If a [Delegate ledger entry][] does not exist to record the granted permissions, this transaction creates one. If it already exists, the transaction updates the set of permissions to match the list in the transaction: any permissions not listed are revoked. If all permissions are revoked, the transaction deletes the Delegate ledger entry. An empty `Permissions` list is only valid for deleting an existing Delegate ledger entry; if no such entry exists, the transaction fails with `tecNO_ENTRY`.

{% admonition type="success" name="Tip" %}
If you want to delegate more than 10 permissions, consider using [multi-signing](/docs/concepts/accounts/multi-signing.md) instead.
{% /admonition %}

### Permission Objects

Each item in the `Permissions` array is an inner object with the following nested field:

| Field             | JSON Type            | [Internal Type][] | Required? | Description     |
|:------------------|:---------------------|:------------------|:----------|:----------------|
| `PermissionValue` | String or Number     | UInt32            | Yes       | A permission to grant to the delegate, which can be either a transaction type or a granular permission. See [Permission Values](../../data-types/permission-values.md) for a full list. |


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description |
|:--------------------------|:------------|
| `tecDIR_FULL`             | The sender owns too many items in the ledger already.<br>This error is effectively impossible to receive if {% amendment-disclaimer name="fixDirectoryLimit" compact=true /%} is enabled. |
| `tecINSUFFICIENT_RESERVE` | The sender does not have enough XRP to meet the [reserve requirement](/docs/concepts/accounts/reserves.md) of creating a new Delegate ledger entry. |
| `tecNO_ENTRY`             | The `Permissions` list is empty but no [Delegate ledger entry][] exists for the delegate. An empty list is only valid for deleting an existing entry. |
| `tecNO_PERMISSION`        | At least one permission in the `Permissions` list is not delegatable. See [Permission Values](../../data-types/permission-values.md) for which permissions are not delegatable. |
| `tecNO_TARGET`            | The account specified in the `Authorize` field does not exist in the ledger. |
| `temARRAY_TOO_LARGE`      | The `Permissions` list is too large. It cannot contain more than 10 entries. |
| `temDISABLED`             | The [PermissionDelegation amendment][] is not enabled. |
| `temMALFORMED`            | The transaction was invalid. For example, the `Authorize` account is the same as the sender of the transaction, the `Permissions` list contains duplicate entries, or one of the permissions in the list is not a valid permission. |

## See Also

- [Delegate ledger entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
