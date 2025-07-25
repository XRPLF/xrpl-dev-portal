---
html: ammwithdraw.html
parent: transaction-types.html
seo:
    description: Return LPTokens into an Automated Market Maker in exchange for a share of the assets the pool holds.
labels:
  - AMM
---
# AMMWithdraw
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/AMMWithdraw.cpp "Source")

Withdraw assets from an [Automated Market Maker](../../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) (AMM) instance by returning the AMM's liquidity provider tokens (LP Tokens).

_(Added by the [AMM amendment][].)_

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account" : "rJVUeRqDFNs2xqA7ncVE6ZoAhPUoaJJSQm",
    "Amount" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        "value" : "5"
    },
    "Amount2" : "50000000",
    "Asset" : {
        "currency" : "TST",
        "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    },
    "Asset2" : {
        "currency" : "XRP"
    },
    "Fee" : "10",
    "Flags" : 1048576,
    "Sequence" : 10,
    "TransactionType" : "AMMWithdraw"
}
```

{% tx-example txid="E606F37847E012E0D71267ED18CEA8B235AD9409BB6C2383A7D53ADEC2F314D4" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field        | JSON Type           | [Internal Type][] | Required? | Description |
|:-------------|:--------------------|:------------------|:----------|:------------|
| `Asset`      | Object              | Issue             | Yes       | The definition for one of the assets in the AMM's pool. The asset can be XRP, a token, or an MPT (see: [Specifying Without Amounts][]). |
| `Asset2`     | Object              | Issue             | Yes       | The definition for the other asset in the AMM's pool. The asset can be XRP, a token, or an MPT (see: [Specifying Without Amounts][]). |
| `Amount`     | [Currency Amount][] | Amount            | No        | The amount of one asset to withdraw from the AMM. This must match the type of one of the assets (tokens or XRP) in the AMM's pool. |
| `Amount2`    | [Currency Amount][] | Amount            | No        | The amount of another asset to withdraw from the AMM. If present, this must match the type of the other asset in the AMM's pool and cannot be the same type as `Amount`. |
| `EPrice`     | [Currency Amount][] | Amount            | No        | The minimum effective price, in LP Token returned, to pay per unit of the asset to withdraw. |
| `LPTokenIn`  | [Currency Amount][] | Amount            | No        | How many of the AMM's LP Tokens to redeem. |

{% admonition type="info" name="Note" %}For a double-asset withdrawal, it is possible for `Asset` to correspond to _either_ `Amount` or `Amount2` as long as `Asset2` corresponds to the other one. It is recommended to match them (that is, `Amount2` is an amount of the asset defined in `Asset2`) because it is less confusing that way.{% /admonition %}

### AMMWithdraw Modes

This transaction has several modes, depending on which flags you specify. Each mode expects a specific combination of fields. The modes fall into two categories:

- **Double-asset withdrawals**, in which you receive both assets from the AMM's pool in proportions that match their balances there. These withdrawals are not subject to a fee.
- **Single-asset withdrawals**, in which you receive one asset from the AMM's pool. The AMM charges a fee based on how much your deposit shifts the balance of assets in the pool. Depending on the withdraw mode, the amount of the fee can be added to the amount of LP Tokens paid in, or debited from the amount of the asset paid out.

The following combinations of fields indicate a **double-asset withdrawal**:

| Flag Name(s)    | Flag Value   | Fields Specified       | Meaning |
|-----------------|--------------|------------------------|---------|
| `tfLPToken`     | `0x00010000` | `LPTokenIn` only      | Return the specified amount of LP Tokens and receive both assets from the AMM's pool in amounts based on the returned LP Tokens' share of the total LP Tokens issued. |
| `tfWithdrawAll` | `0x00020000` | No Fields              | Return _all_ of your LP Tokens and receive as much as you can of both assets in the AMM's pool. |
| `tfTwoAsset`    | `0x00100000` | `Amount` and `Amount2` | Withdraw both of this AMM's assets, in up to the specified amounts. The actual amounts received maintains the balance of assets in the AMM's pool. |

The following combinations of fields indicate a **single asset withdrawal**:

| Flag Name(s)            | Flag Value   | Fields Specified         | Meaning |
|-------------------------|--------------|--------------------------|---------|
| `tfSingleAsset`         | `0x00080000` | `Amount` only            | Withdraw exactly the specified amount of one asset, by returning as many LP Tokens as necessary. |
| `tfOneAssetWithdrawAll` | `0x00040000` | `Amount` only            | Withdraw at least the specified amount of one asset, by returning _all_ of your LP Tokens. Fails if you can't receive at least the specified amount. The specified amount can be 0, meaning the transaction succeeds if it withdraws any positive amount. |
| `tfOneAssetLPToken`     | `0x00200000` | `Amount` and `LPTokenIn` | Withdraw up to the specified amount of one asset, by returning up to the specified amount of LP Tokens. |
| `tfLimitLPToken`        | `0x00400000` | `Amount` and `EPrice`    | Withdraw up to the specified amount of one asset, but pay no more than the specified effective price in LP Tokens per unit of the asset received. |

Any other combination of these fields is invalid.

### Single Asset Withdrawal Fee

The fee for a single asset withdrawal is calculated to be the same as if you had done a double-asset withdrawal and then used the AMM to trade all of the other asset for the one you are withdrawing. The trading fee applies to the amount you would need to trade for, but not to the rest of the withdrawal.

<!-- TODO: add a formula and example calculation(s) of single-asset withdrawal fees -->

### AMM Deletion

If the transaction withdraws the last of the AMM's assets, it automatically tries to delete the AMM along with all associated trust lines. However, there is a limit to how many empty trust lines can be removed in one transaction. If too many empty trust lines exist, the AMM remains in the ledger in an empty state; it can be deleted with further [AMMDelete transactions][], or it can be refilled with a special "empty AMM" two-asset [AMMDeposit transaction][]. While an AMM is empty, no other operations on it are valid.

### AMMWithdraw Flags

Transactions of the AMMWithdraw type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name               | Hex Value    | Decimal Value | Description           |
|:------------------------|:-------------|:--------------|:----------------------|
| `tfLPToken`             | `0x00010000` | 65536         | Perform a double-asset withdrawal and receive the specified amount of LP Tokens. |
| `tfWithdrawAll`         | `0x00020000` | 131072        | Perform a double-asset withdrawal returning all your LP Tokens. |
| `tfOneAssetWithdrawAll` | `0x00040000` | 262144        | Perform a single-asset withdrawal returning all of your LP Tokens. |
| `tfSingleAsset`         | `0x00080000` | 524288        | Perform a single-asset withdrawal with a specified amount of the asset to withdrawal. |
| `tfTwoAsset`            | `0x00100000` | 1048576       | Perform a double-asset withdrawal with specified amounts of both assets. |
| `tfOneAssetLPToken`     | `0x00200000` | 2097152       | Perform a single-asset withdrawal and receive the specified amount of LP Tokens. |
| `tfLimitLPToken`        | `0x00400000` | 4194304       | Perform a single-asset withdrawal with a specified effective price. |

You must specify **exactly one** of these flags, plus any [global flags](../common-fields.md#global-flags).


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code              | Description                                  |
|:------------------------|:---------------------------------------------|
| `tecAMM_EMPTY`          | The AMM has no assets in its pool. In this state, you can only delete the AMM or fund it with a new deposit. |
| `tecAMM_BALANCE`        | The transaction would withdraw all of one asset from the pool, or rounding would cause a "withdraw all" to leave a nonzero amount behind. |
| `tecAMM_FAILED`         | The conditions on the withdrawal could not be satisfied; for example, the requested effective price in the `EPrice` field is too low. |
| `tecAMM_INVALID_TOKENS` | The AMM for this token pair does not exist, or one of the calculations resulted in a withdrawal amount rounding to zero. |
| `tecFROZEN`             | The transaction tried to withdraw a [frozen](../../../../concepts/tokens/fungible-tokens/freezes.md) token. |
| `tecINSUF_RESERVE_LINE` | The sender of this transaction does not meet the increased [reserve requirement](../../../../concepts/accounts/reserves.md) of processing this transaction, probably because they need at least one new trust line to hold one of the assets to be withdrawn, and they don't have enough XRP to meet the additional owner reserve for a new trust line. |
| `tecNO_AUTH`            | The sender is not authorized to hold one of the AMM assets. |
| `temMALFORMED`          | The transaction specified an invalid combination of fields. See [AMMWithdraw Modes](#ammwithdraw-modes). (This error can also occur if the transaction is malformed in other ways.) |
| `temBAD_AMM_TOKENS`     | The transaction specified the LP Tokens incorrectly; for example, the `issuer` is not the AMM's associated AccountRoot address or the `currency` is not the currency code for this AMM's LP Tokens, or the transaction specified this AMM's LP Tokens in one of the asset fields.  |
| `terNO_AMM`             | The Automated Market Maker instance for the asset pair in this transaction does not exist. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
