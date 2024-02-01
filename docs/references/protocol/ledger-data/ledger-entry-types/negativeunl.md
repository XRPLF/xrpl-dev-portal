---
html: negativeunl.html
parent: ledger-entry-types.html
seo:
    description: List of validators currently believed to be offline.
labels:
  - Blockchain
---
# NegativeUNL

_(Added by the [NegativeUNL amendment][].)_

The `NegativeUNL` ledger entry type contains the current status of the [Negative UNL](../../../../concepts/consensus-protocol/negative-unl.md), a list of trusted validators currently believed to be offline.

Each ledger version contains **at most one** `NegativeUNL` entry. If no validators are currently disabled or scheduled to be disabled, there is no `NegativeUNL` entry.

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "DisabledValidators": [
    {
      "DisabledValidator": {
        "FirstLedgerSequence": 1609728,
        "PublicKey": "ED6629D456285AE3613B285F65BBFF168D695BA3921F309949AFCD2CA7AFEC16FE"
      }
    }
  ],
  "Flags": 0,
  "LedgerEntryType": "NegativeUNL",
  "index": "2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), the {% code-page-name /%} ledger entry has the following fields:

| Name                  | JSON Type | [Internal Type][] | Required? | Description          |
|:----------------------|:----------|:------------------|:----------|:---------------------|
| `DisabledValidators`  | Array     | Array             | No        | A list of `DisabledValidator` objects (see below), each representing a trusted validator that is currently disabled. |
| `LedgerEntryType`     | String    | UInt16            | Yes       | The value `0x004E`, mapped to the string `NegativeUNL`, indicates that this entry is the Negative UNL. |
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
