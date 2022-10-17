---
html: negativeunl.html
parent: ledger-object-types.html
blurb: List of validators currently believed to be offline.
labels:
  - Blockchain
---
# NegativeUNL

_(Added by the [NegativeUNL amendment][].)_

The `NegativeUNL` object type contains the current status of the [Negative UNL](negative-unl.html), a list of trusted validators currently believed to be offline.

Each ledger version contains **at most one** `NegativeUNL` object. If no validators are currently disabled or scheduled to be disabled, there is no `NegativeUNL` object in the ledger.

## Example {{currentpage.name}} JSON

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


A `NegativeUNL` object has the following fields:

| Name                  | JSON Type | [Internal Type][] | Required? | Description          |
|:----------------------|:----------|:------------------|:----------|:---------------------|
| `DisabledValidators`  | Array     | Array             | No        | A list of `DisabledValidator` objects (see below), each representing a trusted validator that is currently disabled. |
| `Flags`               | Number    | UInt32            | Yes       | A bit-map of boolean flags. No flags are defined for the NegativeUNL object type, so this value is always `0`. |
| `LedgerEntryType`     | String    | UInt16            | Yes       | The value `0x004E`, mapped to the string `NegativeUNL`, indicates that this object is the Negative UNL. |
| `ValidatorToDisable`  | String    | Blob              | No        | The public key of a trusted validator that is scheduled to be disabled in the next flag ledger. |
| `ValidatorToReEnable` | String    | Blob              | No        | The public key of a trusted validator in the Negative UNL that is scheduled to be re-enabled in the next flag ledger. |

## DisabledValidator Objects
<!-- SPELLING_IGNORE: DisabledValidator -->

Each `DisabledValidator` object represents one disabled validator. In JSON, a `DisabledValidator` object has one field, `DisabledValidator`, which in turn contains another object with the following fields:

| Name                  | JSON Type | [Internal Type][] | Description          |
|:----------------------|:----------|:------------------|:---------------------|
| `FirstLedgerSequence` | Number    | UInt32            | The [ledger index][] when the validator was added to the Negative UNL. |
| `PublicKey`           | String    | Blob              | The master public key of the validator, in hexadecimal. |



## NegativeUNL ID Format

The `NegativeUNL` object ID is the hash of the `NegativeUNL` space key (`0x004E`) only. This means that the ID of the `NegativeUNL` object in a ledger is always:

```
2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244
```

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
