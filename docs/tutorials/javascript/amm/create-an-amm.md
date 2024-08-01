# Create an AMM

This example shows how to:

1. Check if the AMM exists.
2. Create the AMM.
3. Check the AMM info.

**TODO: Create test harness for AMMs.**

## Usage

You can download the [AMM Samples]() archive to try the sample in your own browser.


### Get Accounts

1. Open `1.create-amm.html` in a browser.
2. Get test accounts.
    - If you have existing Testnet account seeds:
        1. Paste the account seeds in the **Seeds** field.
        2. Click **Get Accounts from Seeds**.
    - If you do not have existing Testnet accounts:
        1. Click **Get New Standby Account**.
        2. Click **Get New Operational Account**.

### Select Assets

1. Choose the assets you want to create an AMM pair for.
2. Click the `Check AMM`. Since there can only be one AMM for a specific pair of assets, it's best to check first before trying to create one.
3. Click `Check AMM Creation Cost` to look up the fee required for creating the AMM.

### Create AMM

1. Click `Create AMM`.

### Look Up AMM

1. Click `Look Up AMM`.


## Code Walkthrough

### 3. Select and acquire assets

As the creator of an AMM, you are also the first liquidity provider and you have to supply it with a starting pool of assets. Other users of the XRP Ledger can also become liquidity providers by supplying assets after the AMM exists. It's crucial to choose assets carefully because, as a liquidity provider for an AMM, you are supplying some amounts of both for users to swap between. If one of the AMM's assets becomes worthless, other users can use the AMM to trade for the other asset, leaving the AMM (and thus, its liquidity providers including you) holding only the worthless one. Technically, the AMM always holds some positive amount of both assets, but the amounts can be very small.

You can choose any pair of fungible assets in the XRP Ledger, including XRP or tokens, as long as they meet the [restrictions on AMM assets](../../../concepts/tokens/decentralized-exchange/automated-market-makers.md#restrictions-on-assets).

For each of the two assets, you need to know its currency code and issuer; as an exception, XRP has no issuer. For each of the assets, you must hold a balance of the asset (or _be_ the issuer). The following sample code acquires two assets, "TST" (which it buys using XRP) and "FOO" (which it receives from the issuer).

{% code-snippet file="/_code-samples/create-amm/js/create-amm.js" from="// Acquire tokens" before="// Check if AMM already exists" language="js" /%}

This tutorial includes some example code to issue FOO tokens from a second test address. This is not realistic for a production scenario, because tokens do not inherently have value, but it makes it possible to demonstrate creating a new AMM for a unique currency pair. In production, you would acquire a second token in some other way, such as making an off-ledger deposit with the [stablecoin issuer](../../../use-cases/tokenization/stablecoin-issuer.md), or buying it in the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md).

The helper function for issuing follows an abbreviated version of the steps in the [Issue a Fungible Token](issue-a-fungible-token.md) tutorial:

{% code-snippet file="/_code-samples/create-amm/js/create-amm.js" from="/* Issue tokens" language="js" /%}


### 4. Check if the AMM exists

Since there can only be one AMM for a specific pair of assets, it's best to check first before trying to create one. Use the [amm_info method][] to check whether the AMM already exists. For the request, you specify the two assets. The response should be an `actNotFound` error if the AMM does not exist.


{% code-snippet file="/_code-samples/create-amm/js/create-amm.js" from="// Check if AMM already exists" before="// Look up AMM transaction cost" language="js" /%}

If the AMM does already exist, you should double-check that you specified the right pair of assets. If someone else has already created this AMM, you can deposit to it instead. <!-- TODO: link to a tutorial about depositing to and withdrawing from an AMM when one exists -->


### 5. Look up the AMMCreate transaction cost

Creating an AMM has a special [transaction cost][] to prevent spam: since it creates objects in the ledger that no one owns, you must burn at least one [owner reserve increment](../../../concepts/accounts/reserves.md) of XRP to send the AMMCreate transaction. The exact value can change due to [fee voting](https://xrpl.org/fee-voting.html), so you should look up the current incremental reserve value using the [server_state method][].

It is also a good practice to display this value and give a human operator a chance to stop before you send the transaction. Burning an owner reserve is typically a much higher cost than sending a normal transaction, so you don't want it to be a surprise. (Currently, on both Mainnet and Devnet, the cost of sending a typical transaction is 0.000010 XRP but the cost of AMMCreate is 2 XRP.)


{% code-snippet file="/_code-samples/create-amm/js/create-amm.js" from="// Look up AMM transaction cost" before="// Create AMM" language="js" /%}


### 6. Send AMMCreate transaction

Send an [AMMCreate transaction][] to create the AMM. Important aspects of this transaction include:

| Field | Value | Description |
|-------|--------|-------------|
| `Asset` | [Currency Amount][] | Starting amount of one asset to deposit in the AMM. |
| `Asset2` | [Currency Amount][] | Starting amount of the other asset to deposit in the AMM. |
| `TradingFee` | Number | The fee to charge when trading against this AMM instance. The maximum value is `1000`, meaning a 1% fee; the minimum value is `0`. If you set this too high, it may be too expensive for users to trade against the AMM; but the lower you set it, the more you expose yourself to currency risk from the AMM's assets changing in value relative to one another. |
| `Fee` | String - XRP Amount | The transaction cost you looked up in a previous step. Client libraries may require that you add a special exception or reconfigure a setting to specify a `Fee` value this high. |

For the two starting assets, it does not matter which is `Asset` and which is `Asset2`, but you should specify amounts that are about equal in total value, because otherwise other users can profit at your expense by trading against the AMM.

**Tip:** Use `fail_hard` when submitting this transaction, so you don't have to pay the high transaction cost if the transaction initially fails. (It's still _possible_ that the transaction could tentatively succeed, and then fail and still burn the transaction cost, but this protects you from burning XRP on many of types of failures.)


{% code-snippet file="/_code-samples/create-amm/js/create-amm.js" from="// Create AMM" before="// Confirm that AMM exists" language="js" /%}


### 7. Check AMM info

If the AMMCreate transaction succeeded, it creates the AMM and related objects in the ledger. You _could_ check the metadata of the AMMCreate transaction, but it is often easier to call the [amm_info method][] again to get the status of the newly-created AMM.


{% code-snippet file="/_code-samples/create-amm/js/create-amm.js" from="// Confirm that AMM exists" before="// Check token balances" language="js" /%}


In the result, the `amm` object's `lp_token` field is particularly useful because it includes the issuer and currency code of the AMM's LP Tokens, which you need to know for many other AMM-related transactions. LP Tokens always have a hex currency code starting with `03`, and the rest of the code is derived from the issuers and currency codes of the tokens in the AMM's pool. The issuer of the LP Tokens is the AMM address, which is randomly chosen when you create an AMM.

Initially, the AMM's total outstanding LP Tokens, reported in the `lp_token` field of the `amm_info` response, match the tokens you hold as its first liquidity provider. However, after other accounts deposit liquidity to the same AMM, the amount shown in `amm_info` updates to reflect the total issued to all liquidity providers. Since others can deposit at any time, even potentially in the same ledger version where the AMM was created, you shouldn't assume that this amount represents your personal LP Tokens balance.


###  8. Check trust lines

You can also use the [account_lines method][] to get an updated view of your token balances. Your balances should be decreased by the amounts you deposited, but you now have a balance of LP Tokens that you received from the AMM.


{% code-snippet file="/_code-samples/create-amm/js/create-amm.js" from="// Check token balances" before="// Disconnect" language="js" /%}


The `account_lines` response shows only the tokens held by the account you looked up (probably yours). If you have a lot of tokens, you may want to specify the AMM address as the `peer` in the request so you don't have to [paginate](../../../references/http-websocket-apis/api-conventions/markers-and-pagination.md) over multiple requests to find the AMM's LP Tokens. In this tutorial, your account probably only holds the three different tokens, so you can see all three in the same response.

**Tip:** If one of the assets in the AMM's pool is XRP, you need to call the [account_info method][] on your account to see the difference in your balance (the `Balance` field of the account object).
