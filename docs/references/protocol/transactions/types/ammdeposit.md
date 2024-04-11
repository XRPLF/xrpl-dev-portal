---
html: ammdeposit.html
parent: transaction-types.html
seo:
    description: Deposit funds into an Automated Market Maker in exchange for LPTokens.
labels:
  - AMM
---
# AMMDeposit
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/AMMDeposit.cpp "Source")

_(Added by the [AMM amendment][])_

Deposit funds into an [Automated Market Maker](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) (AMM) instance and receive the AMM's liquidity provider tokens (_LP Tokens_) in exchange. You can deposit one or both of the assets in the AMM's pool.

If successful, this transaction creates a [trust line](../../../../concepts/tokens/fungible-tokens/index.md) to the AMM Account (limit 0) to hold the LP Tokens.

## Example {% $frontmatter.seo.title %} JSON

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

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field         | JSON Type           | [Internal Type][] | Required? | Description |
|:--------------|:--------------------|:------------------|:----------|:------------|
| `Asset`       | Object              | STIssue           | Yes       | The definition for one of the assets in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `Asset2`      | Object              | STIssue           | Yes       | The definition for the other asset in the AMM's pool. In JSON, this is an object with `currency` and `issuer` fields (omit `issuer` for XRP). |
| `Amount`      | [Currency Amount][] | Amount            | No        | The amount of one asset to deposit to the AMM. If present, this must match the type of one of the assets (tokens or XRP) in the AMM's pool. |
| `Amount2`     | [Currency Amount][] | Amount            | No        | The amount of another asset to add to the AMM. If present, this must match the type of the other asset in the AMM's pool and cannot be the same asset as `Amount`. |
| `EPrice`      | [Currency Amount][] | Amount            | No        | The maximum effective price, in the deposit asset, to pay for each LP Token received. |
| `LPTokenOut`  | [Currency Amount][] | Amount            | No        | How many of the AMM's LP Tokens to buy. |


### AMMDeposit Modes

This transaction has five modes, defined by which flag you specify. Each mode expects a specific combination of fields. The modes fall into two categories:

- **Double-asset deposits**, in which you provide both assets in the AMM's pool, proportional to the balance of the assets already there. These deposits are not subject to a fee.
- **Single-asset deposits**, in which you provide only one of the AMM's two assets. The AMM charges a fee, debited from the LP Tokens paid out, based on how much your deposit shifts the balance of assets in the pool.

The following combinations of fields indicate a **double-asset deposit**:

| Flag Name           | Flag Value   | Fields Specified       | Meaning |
|---------------------|--------------|------------------------|---------|
| `tfLPToken`         | `0x00010000` | `LPTokenOut` only      | Deposit both of this AMM's assets, in amounts calculated so that you receive the specified amount of LP Tokens in return. The amounts deposited maintain the relative proportions of the two assets the AMM already holds. |
| `tfTwoAsset`        | `0x00100000` | `Amount` and `Amount2` | Deposit both of this AMM's assets, up to the specified amounts. The actual amounts deposited must maintain the same balance of assets as the AMM already holds, so the amount of either one deposited MAY be less than specified. The amount of LP Tokens you get in return is based on the total value deposited. |
| `tfTwoAssetIfEmpty` | `0x00800000` | `Amount` and `Amount2` | Deposit both of this AMM's assets, in exactly the specified amounts, to an AMM with an empty asset pool. The amount of LP Tokens you get in return is based on the total value deposited. |

The following combinations of fields indicate a **single asset deposit**:

| Flag Name           | Flag Value   | Fields Specified           | Meaning |
|---------------------|--------------|----------------------------|---------|
| `tfSingleAsset`     | `0x00080000` | `Amount` only              | Deposit exactly the specified amount of one asset, and receive an amount of LP Tokens based on the resulting share of the pool (minus fees). |
| `tfOneAssetLPToken` | `0x00200000` | `Amount` and `LPTokenOut`  | Deposit up to the specified amount of one asset, so that you receive exactly the specified amount of LP Tokens in return (after fees). |
| `tfLimitLPToken`    | `0x00400000` | `Amount` and `EPrice`      | Deposit up to the specified amount of one asset, but pay no more than the specified effective price per LP Token (after fees). |

Any other combination of these fields and flags is invalid.


### Single Asset Deposit Fee

 The fee for a single asset deposit is calculated to be the same as if you had used the AMM to trade part of the deposit amount for the other asset, then done a double-asset deposit. The AMM's trading fee applies to the amount you would need to trade for, but not to the rest of the deposit. _For example, if the AMM's asset pool is split perfectly evenly between USD and EUR, and you try to deposit 100 USD, the amount of LP Tokens you receive is slightly less than if you had deposited 50 EUR + 50 USD, because you pay the trading fee to convert some of your USD to an equal amount of EUR._

 The formula for how many LP Tokens you receive for a double-asset deposit is:

[{% inline-svg file="/docs/img/amm-single-asset-deposit-formula.svg" /%}](/docs/img/amm-single-asset-deposit-formula.svg "L = T × ( (( 1 + (B - (F × (1 - W) × B)) ÷ P)^W) - 1)")
<!-- TODO: improve graphic -->

Where:

- `L` is the amount of LP Tokens returned
- `T` is the total outstanding LP Tokens before the deposit
- `B` is the amount of the asset being deposited
- `F` is the trading fee, as a decimal
- `W` is the weight of the deposit asset in the pool. This is defined as 0.5 for all AMM pools (meaning a 50/50 split), so exponentiation by W is equivalent to taking the square root.
- `P` is the total amount of the deposit asset in the pool before the deposit


### Empty AMM Special Case

In some cases, an AMM can exist with no assets in its pool. You cannot perform normal deposits into an AMM in such a state because the ratio between the assets is undefined (0/0). Instead, you can use a special "Empty AMM" deposit case with the flag `tfTwoAssetIfEmpty` and exact amounts of both assets. This directly sets the ratio between the assets in the same way an [AMMCreate transaction][] does when an AMM is initially created. Like a double-asset deposit, this is not subject to a fee.

You can only do a special "Empty AMM" deposit if the AMM is empty.

### AMMDeposit Flags

Transactions of the AMMDeposit type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name           | Hex Value    | Decimal Value | Description           |
|:--------------------|:-------------|:--------------|:----------------------|
| `tfLPToken`         | `0x00010000` | 65536         | Perform a double-asset deposit and receive the specified amount of LP Tokens. |
| `tfSingleAsset`     | `0x00080000` | 524288        | Perform a single-asset deposit with a specified amount of the asset to deposit. |
| `tfTwoAsset`        | `0x00100000` | 1048576       | Perform a double-asset deposit with specified amounts of both assets. |
| `tfOneAssetLPToken` | `0x00200000` | 2097152       | Perform a single-asset deposit and receive the specified amount of LP Tokens. |
| `tfLimitLPToken`    | `0x00400000` | 4194304       | Perform a single-asset deposit with a specified effective price. |
| `tfTwoAssetIfEmpty` | `0x00800000` | 8388608       | Perform a special double-asset deposit to an AMM with an empty pool. |

You must specify **exactly one** of these flags, plus any [global flags](../common-fields.md#global-flags).


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code              | Description                                  |
|:------------------------|:---------------------------------------------|
| `tecAMM_EMPTY`          | The AMM currently holds no assets, so you cannot do a normal deposit. You must use the Empty AMM Special Case deposit instead. |
| `tecAMM_NOT_EMPTY`      | The transaction specified `tfTwoAssetIfEmpty`, but the AMM was not empty. |
| `tecAMM_FAILED`         | The conditions on the deposit could not be satisfied. For example, the requested effective price in the `EPrice` field is too low. |
| `tecFROZEN`             | The transaction tried to deposit a [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md) token. |
| `tecINSUF_RESERVE_LINE` | The sender of this transaction does meet the increased [reserve requirement](../../../../concepts/accounts/reserves.md) of processing this transaction, probably because they need a new trust line to hold the LP Tokens, and they don't have enough XRP to meet the additional owner reserve for a new trust line. |
| `tecUNFUNDED_AMM`       | The sender does not have a high enough balance to make the specified deposit. |
| `temBAD_AMM_TOKENS`     | The transaction specified the LP Tokens incorrectly. For example, the `issuer` is not the AMM's associated AccountRoot address or the `currency` is not the currency code for this AMM's LP Tokens, or the transaction specified this AMM's LP Tokens in one of the asset fields. |
| `temBAD_AMOUNT`         | An amount specified in the transaction is invalid. For example, a deposit amount is negative. |
| `temBAD_FEE`            | A fee value specified in the transaction is invalid. For example, the trading fee is outside the allowable range. |
| `temMALFORMED`          | The transaction specified an invalid combination of fields. See [AMMDeposit Modes](#ammdeposit-modes). |
| `terNO_ACCOUNT`         | An account specified in the request does not exist. |
| `terNO_AMM`             | The Automated Market Maker instance for the asset pair in this transaction does not exist. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
