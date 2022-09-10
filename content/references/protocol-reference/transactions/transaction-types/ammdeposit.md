---
html: ammdeposit.html
parent: transaction-types.html
blurb: Deposit funds into an Automated Market Maker in exchange for LPTokens.
labels:
  - AMM
status: not_enabled
---
# AMMDeposit
[[Source]](https://github.com/gregtatcam/rippled/blob/amm-core-functionality/src/ripple/app/tx/impl/AMMDeposit.cpp "Source")
<!-- TODO: Update source link to merged version when available -->

{% include '_snippets/amm-disclaimer.md' %}

Deposit funds into an Automated Market-Maker (AMM) instance and receive the AMM's liquidity provider tokens (_LP Tokens_) in exchange. You can deposit one or both of the assets in the AMM's pool.

## Example {{currentpage.name}} JSON

```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Amount" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        "value" : "2.5"
    },
    "Amount2" : "30000000",
    "Asset" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    },
    "Asset2" : {
        "currency" : "XRP"
    },
    "Fee" : "10",
    "Flags" : 1048576,
    "Sequence" : 7,
    "TransactionType" : "AMMDeposit"
}
```

{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type           | [Internal Type][] | Required? | Description |
|:--------------|:--------------------|:------------------|:----------|:------------|
| `Asset`       | Object              | STIssue           | Yes       | The definition for one of the assets in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `Asset2`      | Object              | STIssue           | Yes       | The definition for the other asset in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `Amount`      | [Currency Amount][] | Amount            | No        | The amount of one asset to deposit to the AMM. If present, this must match the type of one of the assets (tokens or XRP) in the AMM's pool. |
| `Amount2`     | [Currency Amount][] | Amount            | No        | The amount of another asset to add to the AMM. If present, this must match the type of the other asset in the AMM's pool and cannot be the same asset as `Amount`. |
| `EPrice`      | [Currency Amount][] | Amount            | No        | The maximum effective price, in the deposit asset, to pay for each LP Token received. |
| `LPTokenOut`  | [Currency Amount][] | Amount            | No        | How many of the AMM's LP Tokens to buy. |


### AMMDeposit Modes

This transaction has several modes, depending on which flags you specify. Each mode expects a specific combination of fields. The modes fall into two categories: 

- **Double-asset deposits**, in which you provide both assets in the AMM's pool in proportions that match the balance of those assets already there. These deposits are not subject to a fee.
- **Single-asset deposits**, in which you provide only one of the AMM's two assets. You can envision a single-asset deposit as trading _some_ of the deposited asset for the other asset, then performing a double-asset deposit. The trading fee applies to the amount you would need to trade for, but not to the rest of the deposit; the amount of the fee is debited from the LP Tokens paid out. _For example, if the AMM's asset pool is split perfectly evenly between USD and EUR, and you try to deposit 100 USD, the amount of LP Tokens you receive is slightly less than if you had deposited 50 EUR + 50 USD, because you pay the trading fee to convert some of your USD to an equal amount of EUR._

The following combinations of fields indicate a **double-asset deposit**:

| Flag Name    | Flag Value   | Fields Specified       | Meaning |
|--------------|--------------|------------------------|---------|
| `tfLPToken`  | `0x00010000` | `LPTokenOut` only      | Deposit both of this AMM's assets, in amounts calculated so that you receive the specified amount of LP Tokens in return. The amounts deposited maintain the relative proportions of the two assets the AMM already holds. |
| `tfTwoAsset` | `0x00100000` | `Amount` and `Amount2` | Deposit both of this AMM's assets, up to the specified amounts. The actual amounts deposited must maintain the same balance of assets as the AMM already holds, so the amount of either one deposited MAY be less than specified. The amount of LP Tokens you get in return is based on the total value deposited. |

The following combinations of fields indicate a **single asset deposit**:

| Flag Name           | Flag Value   | Fields Specified           | Meaning |
|---------------------|--------------|----------------------------|---------|
| `tfSingleAsset`     | `0x00080000` | `Amount` only              | Deposit exactly the specified amount of one asset, and receive an amount of LP Tokens based on the resulting share of the pool (minus fees). |
| `tfOneAssetLPToken` | `0x00200000` | `Amount` and `LPTokenOut`  | Deposit up to the specified amount of one asset, so that you receive exactly the specified amount of LP Tokens in return (after fees). |
| `tfLimitLPToken`    | `0x00400000` | `Amount` and `EPrice`      | Deposit up to the specified amount of one asset, but pay no more than the specified effective price per LP Token (after fees). |

Any other combination of these fields and flags is invalid.


### Single Asset Deposit Fee Calculations

If you deposit one asset, the AMM charges a fee by reducing the total amount of LP Tokens it pays out, weighted by how much your deposit shifts the balance of assets in the pool. This is equivalent to if you had traded part of the deposit amount for the other asset, then performed a double-asset deposit. The formula for how many LP Tokens you receive for a double-asset deposit is as follows:

<!-- TODO: improve graphic -->

{{ include_svg("img/amm-single-asset-deposit-formula.svg", "L = T × ( (( (B - (F × (1 - W) × B)) ÷ P)^W) - 1)") }}

Where:

- `L` is the amount of LP Tokens returned
- `T` is the total outstanding LP Tokens before the deposit <!-- TODO: or is it after the deposit? -->
- `B` is the amount of the asset being deposited
- `F` is the trading fee, as a decimal
- `W` is the weight of the deposit asset in the pool <!-- TODO: before the deposit? how is this calculated? -->
- `P` is the total amount of the deposit asset in the pool before the deposit <!-- TODO: or is it after the deposit? -->

### AMMDeposit Flags

Transactions of the AMMDeposit type support additional values in the [`Flags` field](transaction-common-fields.html#flags-field), as follows:

| Flag Name           | Hex Value    | Decimal Value | Description           |
|:--------------------|:-------------|:--------------|:----------------------|
| `tfLPToken`         | `0x00010000` | 65536         | Perform a double-asset deposit and receive the specified amount of LP Tokens. |
| `tfSingleAsset`     | `0x00080000` | 524288        | Perform a single-asset deposit with a specified amount of the asset to deposit. |
| `tfTwoAsset`        | `0x00100000` | 1048576       | Perform a double-asset deposit with specified amounts of both assets. |
| `tfOneAssetLPToken` | `0x00200000` | 2097152       | Perform a single-asset deposit and receive the specified amount of LP Tokens. |
| `tfLimitLPToken`    | `0x00400000` | 4194304       | Perform a single-asset deposit with a specified effective price. |

You must specify **exactly one** of these flags, in addition to any [global flags](transaction-common-fields.html#global-flags).


## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code              | Description                                  |
|:------------------------|:---------------------------------------------|
| `temBAD_AMM_OPTIONS`    | The transaction specified an invalid combination of fields. See [AMMDeposit Modes](#ammdeposit-modes). |
| `tecFROZEN`             | The transaction tried to deposit a [frozen](freezes.html) token. |
| `tecAMM_BALANCE`        | The AMM does not have enough of one of the assets to accept the deposit (for example, to satisfy the trade portion of a single-asset deposit) or the sender does not have enough of a given token. |
| `temBAD_AMM_TOKENS`     | The transaction specified the LP Tokens incorrectly; for example, the `issuer` is not the AMM's associated AccountRoot address or the `currency` is not the currency code for this AMM's LP Tokens, or the transaction specified this AMM's LP Tokens in one of the asset fields. |
| `tecAMM_FAILED_DEPOSIT` | The conditions on the deposit could not be satisfied; for example, the requested effective price in the `EPrice` field is too low. |
| `tecAMM_INVALID_TOKENS` | The AMM for this token pair does not exist, or one of the calculations resulted in a deposit amount rounding to zero. |
| `tecNO_PERMISSION`      | One of the assets to deposit in this transaction uses [Authorized Trust Lines](authorized-trust-lines.html) but the sender's trust line is not authorized. <!-- TODO: shouldn't this be impossible, since you can't get any amount of a token you aren't authorized to hold? --> |
| `terNO_ACCOUNT`         | An account specified in the request does not exist. |
| `terNO_AMM`             | The Automated Market Maker instance for the asset pair in this transaction does not exist. |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
