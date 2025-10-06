---
seo:
    description: List of validators currently believed to be offline.
labels:
    - Blockchain
---
# NegativeUNL
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L85-L91 "Source")

The `NegativeUNL` ledger entry type contains the current status of the [Negative UNL](../../../../concepts/consensus-protocol/negative-unl.md), a list of trusted validators currently believed to be offline.

Each ledger version contains **at most one** `NegativeUNL` entry. If no validators are currently disabled or scheduled to be disabled, there is no `NegativeUNL` entry.

{% amendment-disclaimer name="NegativeUNL" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "DisabledValidators": [
      {
        "DisabledValidator": {
          "FirstLedgerSequence": 91371264,
          "PublicKey": "ED58F6770DB5DD77E59D28CB650EC3816E2FC95021BB56E720C9A12DA79C58A3AB"
        }
      }
    ],
    "Flags": 0,
    "LedgerEntryType": "NegativeUNL",
    "PreviousTxnID": "8D47FFE664BE6C335108DF689537625855A6A95160CC6D351341B92624D9C5E3",
    "PreviousTxnLgrSeq": 91442944,
    "index": "2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), the {% code-page-name /%} ledger entry has the following fields:

| Name                  | JSON Type | [Internal Type][] | Required? | Description          |
|:----------------------|:----------|:------------------|:----------|:---------------------|
| `DisabledValidators`  | Array     | Array             | No        | A list of `DisabledValidator` objects (see below), each representing a trusted validator that is currently disabled. |
| `LedgerEntryType`     | String    | UInt16            | Yes       | The value `0x004E`, mapped to the string `NegativeUNL`, indicates that this entry is the Negative UNL. |
| `PreviousTxnID`       | String    | UInt256           | No        | The identifying hash of the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `PreviousTxnLgrSeq`   | Number    | UInt32            | No        | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. {% amendment-disclaimer name="fixPreviousTxnID" /%} |
| `ValidatorToDisable`  | String    | Blob              | No        | The public key of a trusted validator that is scheduled to be disabled in the next flag ledger. |
| `ValidatorToReEnable` | String    | Blob              | No        | The public key of a trusted validator in the Negative UNL that is scheduled to be re-enabled in the next flag ledger. |

### DisabledValidator Objects
<!-- SPELLING_IGNORE: DisabledValidator -->

Each `DisabledValidator` object represents one disabled validator. In JSON, a `DisabledValidator` object has one field, `DisabledValidator`, which in turn contains another object with the following fields:

| Name                  | JSON Type | [Internal Type][] | Description          |
|:----------------------|:----------|:------------------|:---------------------|
| `FirstLedgerSequence` | Number    | UInt32            | The [ledger index][] when the validator was added to the Negative UNL. |
| `PublicKey`           | String    | Blob              | The master public key of the validator, in hexadecimal. |


## {% $frontmatter.seo.title %} Flags

There are no flags defined for the {% code-page-name /%} entry.


## NegativeUNL ID Format

The ID of the `NegativeUNL` entry is the hash of the `NegativeUNL` space key (`0x004E`) only. This means that the ID is always:

```
2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244
```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
