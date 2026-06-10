---
seo:
    description: Redeem a check.
labels:
    - Checks
    - Payments
txIcon: finish
requiredAmendment: Checks
---
# CheckCash
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/CashCheck.cpp "Source")

Attempts to redeem a [check](../../../../concepts/payment-types/checks.md) to receive up to the amount authorized by the corresponding [CheckCreate transaction][]. Only the `Destination` address of a check can cash it with a CheckCash transaction. Cashing a check this way is similar to executing a [Payment][] initiated by the destination.

Since the funds for a check are not guaranteed, redeeming a check can fail because the sender does not have a high enough balance or because there is not enough liquidity to deliver the funds. If this happens, the check remains in the ledger and the destination can try to cash it again later, or for a different amount.

{% admonition type="info" name="Note" %}
If you cash a Check for an MPT you've never held before, this transaction automatically creates the required [MPToken entry][] for your account.
{% /admonition %}

{% amendment-disclaimer name="Checks" /%}

{% amendment-disclaimer name="MPTokensV2" mode="updated" /%}

## Example {% $frontmatter.seo.title %} JSON

{% tabs %}

{% tab label="XRP" %}
```json
{
    "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
    "TransactionType": "CheckCash",
    "Amount": "100000000",
    "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
    "Fee": "12"
}
```
{% /tab %}

{% tab label="MPT" %}
```json
{
    "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
    "TransactionType": "CheckCash",
    "Amount": {
        "mpt_issuance_id": "00000003430427B80BD2D09D36B70B969E12801065F22308",
        "value": "100"
    },
    "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
    "Fee": "12"
}
```
{% /tab %}

{% /tabs %}

{% tx-example txid="67B71B13601CDA5402920691841AC27A156463678E106FABD45357175F9FF406" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field        | JSON Type           | [Internal Type][] | Description         |
|:-------------|:--------------------|:------------------|:--------------------|
| `CheckID`    | String              | UInt256           | The ID of the [Check ledger object](../../ledger-data/ledger-entry-types/check.md) to cash, as a 64-character hexadecimal string. |
| `Amount`     | [Currency Amount][] | Amount            | _(Optional)_ Redeem the Check for exactly this amount, if possible. The currency must match that of the `SendMax` of the corresponding CheckCreate transaction. You must provide either this field or `DeliverMin`. |
| `DeliverMin` | [Currency Amount][] | Amount            | _(Optional)_ Redeem the Check for at least this amount and for as much as possible. The currency must match that of the `SendMax` of the corresponding CheckCreate transaction. You must provide either this field or `Amount`. |

The transaction ***must*** include either `Amount` or `DeliverMin`, but not both.

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code | Description |
|:-----------|:------------|
| `tecDST_TAG_NEEDED` | The destination of the Check has the `RequireDest` flag enabled but the Check, as created, does not have a destination tag. |
| `tecEXPIRED` | The Check identified by the `CheckID` field has already expired. |
| `tecFROZEN` | The destination's trust line to the issuer is frozen. |
| `tecLOCKED` | The check specifies an MPT that is currently [locked](../../../../concepts/tokens/fungible-tokens/deep-freeze.md#how-does-mpt-freezelock-behavior-differ-from-iou) at the issuance or individual token level. |
| `tecNO_AUTH` | The destination is not authorized to receive the token. This can occur when:<ul><li>The trust line token's issuer uses [Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md) and the trust line that would receive the tokens does not exist, or has not been authorized.</li><li>The destination is not authorized to hold the MPT.</li><li>The MPT's **Can Transfer** flag is not enabled and neither the sender nor the destination is the issuer.</li></ul> |
| `tecNO_ENTRY` | The Check identified by the `CheckID` field does not exist. |
| `tecNO_PERMISSION` | The sender of the CheckCash transaction is not the `Destination` of the check. |
| `tecPATH_PARTIAL` | The requested amount exceeds the Check's `SendMax`, the Check owner has insufficient available funds, or the `DeliverMin` amount could not be delivered. |
| `temBAD_CURRENCY` | The `Amount` or `DeliverMin` does not match the currency (and issuer, if not XRP) of the Check. |
| `temDISABLED` | `Amount` or `DeliverMin` specifies an MPT but the [MPTokensV2 amendment][] is not enabled. |
| `temMALFORMED` | The transaction specifies both `Amount` and `DeliverMin`, or omits both. |

## See Also

- [Check entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
