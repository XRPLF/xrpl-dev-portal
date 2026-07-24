---
seo:
    description: Create, transfer, or end reserve sponsorship for a ledger object or account.
labels:
    - Fees
    - Accounts
    - Sponsorship
status: not_enabled
requiredAmendment: Sponsor
txIcon: modify
---
# SponsorshipTransfer
{% source-link path="src/libxrpl/tx/transactors/sponsor/SponsorshipTransfer.cpp" /%}

Create, transfer, or end reserve sponsorship for a ledger object or account. The transaction can be submitted by the sponsor or sponsee, depending on the required operation. See [Sponsorship Scenarios](#sponsorship-scenarios) for details on each operation.

{% admonition type="warning" name="Warning" %}
This transaction cannot be [delegated](/docs/concepts/accounts/permission-delegation.md) to another account.
{% /admonition %}

{% amendment-disclaimer name="Sponsor" /%}

## Example JSON

```json
{
    "TransactionType": "SponsorshipTransfer",
    "Account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
    "ObjectID": "1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
    "Sponsor": "rfkDkFai4jUfCvAJiZ5Vm7XvvWjYvDqeYo",
    "SponsorFlags": 2,        // spfSponsorReserve
    "Flags": 131072,          // tfSponsorshipCreate
    "Fee": "12",
    "Sequence": 43
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} transactions use the following fields:

| Field Name | JSON Type | [Internal Type][] | Required? | Description |
| :--------- | :-------- | :---------------- | :-------- | :---------- |
| `ObjectID` | String    | Hash256           | No        | The ID of the ledger object to transfer sponsorship. Required if the transaction is dealing with a sponsored object, rather than a sponsored account. If omitted, the transaction refers to the `Account` sending the transaction. |
| `Sponsee`  | String    | AccountID         | No        | The wallet address of the sponsee account. Required if the sponsor is ending a sponsorship on behalf of a sponsee. If omitted, the `Account` field is assumed to be the sponsee. |

{% admonition type="info" name="Note" %}
Which of these fields you must include, and whether they are required, depends on the operation. See [Sponsorship Scenarios](#sponsorship-scenarios) for the exact fields each operation needs.
{% /admonition %}

## {% $frontmatter.seo.title %} Flags

{% code-page-name /%} transactions support additional values in the `Flags` field, as follows:

| Flag Name               | Hex Value    | Decimal Value | Description |
| :---------------------- | :----------- | :------------ | :---------- |
| `tfSponsorshipEnd`      | `0x00010000` | 65536         | End an existing sponsorship. The reserve burden returns to the object's owner. |
| `tfSponsorshipCreate`   | `0x00020000` | 131072        | Create a new sponsorship for an unsponsored object or account.  |
| `tfSponsorshipReassign` | `0x00040000` | 262144        | Transfer an existing sponsorship to a new sponsor.  |

## Sponsorship Scenarios

A {% code-page-name /%} transaction performs one of three operations: **create**, **reassign**, or **end** a sponsorship. Each is selected by its own flag (`tfSponsorshipCreate`, `tfSponsorshipReassign`, or `tfSponsorshipEnd`), and the fields you include and who can submit the transaction differ for each. 

The tabs below describe the requirements for each operation.

{% tabs %}

{% tab label="Create Sponsorship" %}
Use the `tfSponsorshipCreate` flag to sponsor an object or account that isn't currently sponsored. Only the sponsee can submit the transaction with this configuration. The reserve sponsorship transfers to the account specified in the `Sponsor` field.

To submit a transaction for this scenario:

- Include the `ObjectID` field when sponsoring an object. Omit when sponsoring an account.
- The target object must be a [ledger entry type that supports sponsorship](/docs/concepts/accounts/sponsored-fees-and-reserves.md). Sponsoring any other object type fails with `tecNO_PERMISSION`.
- The target object or account must not currently be sponsored.
- Provide the `Sponsor` field and the `SponsorFlags.spfSponsorReserve` flag.
- Include the `SponsorSignature` when sponsoring an account. This is optional when sponsoring an object.
- Do not include the `Sponsee` field.

When successful:

- The `Sponsor` field is set on the object or account.
- The new sponsor's `SponsoringOwnerCount` or `SponsoringAccountCount` is incremented.
- For objects, the owner's `SponsoredOwnerCount` is also incremented.
{% /tab %}

{% tab label="Reassign Sponsorship" %}
Use the `tfSponsorshipReassign` flag to transfer an existing sponsorship to a new sponsor specified in the `Sponsor` field. Only the sponsee can submit the transaction with this configuration.

To submit a transaction for this scenario:

- Include the `ObjectID` field when reassigning sponsorship of an object. Omit when reassigning sponsorship of an account.
- The target object or account must currently be sponsored.
- Provide the `Sponsor` field with the `SponsorFlags.spfSponsorReserve` flag.
- Include the `SponsorSignature` when sponsoring an account. This is optional when sponsoring an object.
- Do not include the `Sponsee` field.

When successful:

- The `Sponsor` field is updated to the new sponsor.
- The old sponsor's `SponsoringOwnerCount` or `SponsoringAccountCount` is decremented.
- The new sponsor's `SponsoringOwnerCount` or `SponsoringAccountCount` is incremented.
{% /tab %}

{% tab label="End Sponsorship" %}
Use the `tfSponsorshipEnd` flag to dissolve an existing sponsorship. Either the sponsor or the sponsee can submit the transaction with this configuration. The reserve burden returns to the object or account owner.

To submit a transaction for this scenario:

- Provide the `ObjectID` when ending sponsorship for an object. Omit when ending sponsorship for an account.
- The target object or account must currently be sponsored.
- Do not include the `Sponsor` and `SponsorFlags` fields.

When successful:

- The `Sponsor` field is removed from the object or account.
- The old sponsor's `SponsoringOwnerCount` or `SponsoringAccountCount` is decremented.
- For objects, the owner's `SponsoredOwnerCount` is also decremented.
{% /tab %}

{% /tabs %}

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description |
| :------------------------ | :---------- |
| `tecINSUFFICIENT_RESERVE` | The account taking on the reserve burden does not have sufficient XRP to cover it. |
| `tecNO_ENTRY`             | The `ObjectID` is specified but does not exist on the ledger. |
| `tecNO_PERMISSION`        | The transaction lacks the required permissions. This can occur when:<ul><li>The object is a ledger entry type that does not support sponsorship.</li><li>The submitter is not the current sponsor or sponsee when ending a sponsorship.</li><li>The object or account is already sponsored when creating a sponsorship.</li></ul> |
| `temINVALID_FLAG`         | The transaction has invalid flags. This can occur when:<ul><li>The transaction does not have exactly one of `tfSponsorshipCreate`, `tfSponsorshipReassign`, or `tfSponsorshipEnd` set.</li><li>The `spfSponsorReserve` flag is missing when creating or reassigning a sponsorship.</li><li>The `SponsorFlags` field is present when ending a sponsorship.</li></ul> |
| `temMALFORMED`            | The transaction is malformed. This can occur when:<ul><li>The `Sponsor` field is missing when creating or reassigning a sponsorship.</li><li>The `Sponsor` field is present when ending a sponsorship.</li><li>The `Sponsee` field is present when creating or reassigning a sponsorship.</li></ul> |
| `terNO_ACCOUNT`           | The `Sponsee` field is specified when ending a sponsorship, but that account does not exist on the ledger. |

## See Also

- **References:**
    - [Sponsorship ledger entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
