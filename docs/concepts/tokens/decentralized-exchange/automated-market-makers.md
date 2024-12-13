---
seo:
    description: Automated Market Makers (AMMs) are an essential part of cryptocurrency, providing liquidity between asset pairs. Learn more about AMMs and the XRP Ledger.
labels:
  - XRP
  - Decentralized Exchange
  - AMM
---
# Automated Market Makers

_(Added by the [AMM amendment][])_

Automated Market Makers (AMMs) provide liquidity in the XRP Ledger's decentralized exchange. Each AMM holds a pool of two assets. You can swap between the two assets at an exchange rate set by a formula.

![Automated Market Maker](/docs/img/cpt-amm.png)

Those who deposit assets into an AMM are called _liquidity providers_. In return, liquidity providers receive _LP tokens_ from the AMM. 

![LP receiving LP Tokens](/docs/img/cpt-amm-lp-receiving-lpts.png)

LP tokens enable liquidity providers to:

- Redeem their LP tokens for a share of the assets in the AMM pool, including fees collected.
- Vote to change the AMM fee settings, each vote weighted by how many LP tokens the voter holds.
- Bid some of their LP tokens to receive a temporary discount on the AMM trading fees.

## How the AMM Works

An AMM holds two different assets: at most one of these can be XRP, and one or both of them can be [tokens](../index.md). 
For any given pair of assets, there can be up to one AMM in the ledger. Anyone can create the AMM for an asset pair if it doesn't exist, or deposit to an AMM if it already exists.

When you want to trade in the decentralized exchange, your [Offers](offers.md) and [Cross-Currency Payments](../../payment-types/cross-currency-payments.md) can automatically use AMMs to complete the trade. A single transaction might execute by matching Offers, AMMs, or a mix of both, depending on what's cheaper.

![1 Transaction using offers, AMMs, or both.](/docs/img/cpt-amm-or-offer.png)

{% admonition type="info" name="Note" %}

You can determine if a `Payment` or `OfferCreate` transaction interacted with an AMM by checking for a [`RippleState`](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md) ledger entry in the transaction metadata. A `Flags` value of `16777216` indicates AMM liquidity was consumed.

{% /admonition %}

An AMM sets its exchange rate based on the balance of assets in the pool. When you trade against an AMM, the exchange rate adjusts based on how much your trade shifts the balance of assets the AMM holds. As its supply of one asset goes down, the price of that asset goes up; as its supply of an asset goes up, the price of that asset goes down.

![As supply increases, prices drop, and vice-versa.](/docs/img/cpt-amm-balance.png)

An AMM gives generally better exchange rates when it has larger overall amounts in its pool. This is because any given trade causes a smaller shift in the balance of the AMM's assets. The more a trade unbalances the AMM's supply of the two assets, the more extreme the exchange rate becomes.

The AMM also charges a percentage trading fee on top of the exchange rate.

The XRP Ledger implements a _geometric mean_ AMM with a weight parameter of 0.5, so it functions like a _constant product_ market maker. For a detailed explanation of the _constant product_ AMM formula and the economics of AMMs in general, see [Kris Machowski's Introduction to Automated Market Makers](https://www.machow.ski/posts/an_introduction_to_automated_market_makers/).

### Token Issuers

Tokens with different issuers are considered different assets. This means that there can be an AMM for two tokens with the same currency code but different issuers.  For example, _FOO_ issued by WayGate is different than _FOO_ issued by StableFoo. Similarly, the tokens can have the same issuer but different currency codes. The trade direction doesn't matter; the AMM for FOO.WayGate to XRP is the same as the AMM for XRP to FOO.WayGate.

### Currency Risk

When the flow of funds between the two assets in a pool is relatively active and balanced, the fees provide a source of passive income for liquidity providers. However, when the relative price between the assets shifts, liquidity providers can take a loss on the [currency risk](https://www.investopedia.com/terms/c/currencyrisk.asp).

### DEX Interaction

AMMs are integrated with the central limit order book (CLOB)-based DEX to enhance liquidity. Offers and payments are automatically optimized to determine whether swapping within a liquidity pool, through the order books, or both, provides the best rate and executes accordingly. This ensures that transactions use the most efficient path for trades, whether through offers on the DEX or through AMM pools, or a combination of the two.

The diagram below illustrates how an offer interacts with other offers and AMM liquidity in the DEX.

![Offer path through DEX.](/docs/img/amm-clob-diagram.png)

You can also use the test harness below to experiment with offers and AMM interactions.

<!-- Interactive Tutorial -->

<script src="https://unpkg.com/xrpl@4.0.0/build/xrpl-latest.js"></script>
<script type="application/javascript" src="/js/tutorials/amm-clob-interactive.js"></script>

<div style="padding: 5px">
  <div id="header">
    <button id="startButton" type="button" class="btn btn-primary" style="margin-bottom: 5px">Start Demo</button>
  </div>
  <div id="amm-box" style="border: 1px solid black; height: 250px; margin-bottom: 5px; padding: 5px; background-color: #f0f0f0">
  <p style="font-weight: bold">XRP/TST AMM</p>
  <textarea id="ammInfoField" style="height: 80%; width: 100%; resize: none"></textarea>
  </div>
  <div id="offers-box" style="display:flex; gap: 5px">
    <div id="alice-box" style="border: 1px solid black; width: 50%; background-color: #f0f0f0; padding: 5px">
      <p style="font-weight: bold">Alice's Wallet</p>
      <textarea readonly id="aliceWalletField" style="height: 30px; width: 225px; resize: none"></textarea>
      <div style="display: flex; gap: 10px">
        <label style="display: flex; align-items: center; gap: 10px">Taker Gets:
          <textarea id="aliceTakerGetsAmount" style="height: 30px; width: 100px; resize: none"></textarea>
        </label>
        <label style="display: flex; align-items: center; gap: 10px">Currency:
          <select id="aliceTakerGetsCurrency" style="height: 30px">
            <option>XRP</option>
            <option>USD</option>
          </select>
        </label>
      </div>
      <div style="display:flex; gap: 10px">
        <label style="display: flex; align-items: center; gap: 10px">Taker Pays:
          <textarea id="aliceTakerPaysAmount" style="height: 30px; width: 100px; resize: none"></textarea>
        </label>
        <label style="display: flex; align-items: center; gap: 10px">Currency:
          <select id="aliceTakerPaysCurrency" style="height: 30px">
            <option>USD</option>
            <option>XRP</option>
          </select>
        </label>
      </div>
      <button id= "aCreateOfferButton" type="button" class="btn btn-primary" style="margin-bottom: 5px">Create Offer</button>
      <p style="font-weight: bold">Alice's Offers</p>
      <textarea id="aliceOffersField" style="height: 210px; width: 100%; resize: none"></textarea>
    </div>
    <div id="bob-box" style="border: 1px solid black; width: 50%; background-color: #f0f0f0; padding: 5px">
      <p style="font-weight: bold">Bob's Wallet</p>
      <textarea readonly id="bobWalletField" style="height: 30px; width: 225px; resize: none"></textarea>
      <div style="display: flex; gap: 10px">
        <label style="display: flex; align-items: center; gap: 10px">Taker Gets:
          <textarea id="bobTakerGetsAmount" style="height: 30px; width: 100px; resize: none"></textarea>
        </label>
        <label style="display: flex; align-items: center; gap: 10px">Currency:
          <select id="bobTakerGetsCurrency" style="height: 30px">
            <option>XRP</option>
            <option>USD</option>
          </select>
        </label>
      </div>
      <div style="display:flex; gap: 10px">
        <label style="display: flex; align-items: center; gap: 10px">Taker Pays:
          <textarea id="bobTakerPaysAmount" style="height: 30px; width: 100px; resize: none"></textarea>
        </label>
        <label style="display: flex; align-items: center; gap: 10px">Currency:
          <select id="bobTakerPaysCurrency" style="height: 30px">
            <option>USD</option>
            <option>XRP</option>
          </select>
        </label>
      </div>
      <button id="bCreateOfferButton" type="button" class="btn btn-primary" style="margin-bottom: 5px">Create Offer</button>
      <p style="font-weight: bold">Bob's Offers</p>
      <textarea id="bobOffersField" style="height: 210px; width: 100%; resize: none"></textarea>
    </div>
  </div>
</div>

<!-- Interactive Tutorial -->

### Restrictions on Assets

To prevent misuse, some restrictions apply to the assets used in an AMM. If you try to create an AMM with an asset that does not meet these restrictions, the transaction fails. The rules are as follows:

- The asset must not be an LP token from another AMM.
- If the asset is a token whose issuer uses [Authorized Trust Lines](../fungible-tokens/authorized-trust-lines.md), the creator of the AMM must be authorized to hold those tokens. Only your authorized trust lines can deposit that token into the AMM or withdraw it; however, you can still deposit or withdraw the other asset.
- If the [Clawback amendment][] is enabled, the issuer of the token must not have enabled the ability to claw back their tokens.

## LP Tokens

Whoever creates the AMM becomes the first liquidity provider, and receives LP tokens that represent 100% ownership of assets in the AMM's pool. They can redeem some or all of those LP tokens to withdraw assets from the AMM in proportion to the amounts currently there. (The proportions shift over time as people trade against the AMM.) The AMM does not charge a fee when withdrawing both assets.

For example, if you created an AMM with 5 ETH and 5 USD, and then someone exchanged 1.26 USD for 1 ETH, the pool now has 4 ETH and 6.26 USD in it. You can spend half your LP tokens to withdraw 2 ETH and 3.13 USD.

![Example AMM exchange and LP Token withdrawal](/docs/img/cpt-amm-lp-tokens.png)

Anyone can deposit assets to an existing AMM. When they do, they receive new LP tokens based on how much they deposited. The amount that a liquidity provider can withdraw from an AMM is based on the proportion of the AMM's LP tokens they hold compared to the total number of LP tokens outstanding.

LP tokens are like other tokens in the XRP Ledger. You can use them in many types of payment, or trade them in the decentralized exchange. (To receive LP tokens as payment, you must set up a [trust line](../fungible-tokens/index.md) with a non-zero limit with the AMM Account as the issuer.) However, you can _only_ send LP tokens directly to the AMM (redeeming them) using the [AMMWithdraw][] transaction type, not through other types of payments. Similarly, you can only send assets to the AMM's pool through the [AMMDeposit][] transaction type.

The AMM is designed so that an AMM's asset pool is empty if and only if the AMM has no outstanding LP tokens. This situation can only occur as the result of an [AMMWithdraw][] transaction; when it does, the AMM is automatically deleted.

### LP Token Currency Codes

LP tokens use a special type of currency code in the 160-bit hexadecimal ["non-standard" format](../../../references/protocol/data-types/currency-formats.md#nonstandard-currency-codes). These codes have the first 8 bits `0x03`. The remainder of the code is a SHA-512 hash, truncated to the first 152 bits, of the two assets' currency codes and their issuers. (The assets are placed in a "canonical order" with the numerically lower currency+issuer pair first.) As a result, the LP tokens for a given asset pair's AMM have a predictable, consistent currency code.


## Trading Fees

Trading fees are a source of passive income for liquidity providers. They offset the currency risk of letting others trade against the pool's assets. Trading fees are paid to the AMM, not directly to liquidity providers. Liquidity providers benefit because they can redeem their LP tokens for a percentage of the AMM pool.

Liquidity providers can vote to set the fee from 0% to 1%, in increments of 0.001%. Liquidity providers have an incentive to set trading fees at an appropriate rate: if fees are too high, trades will use order books to get a better rate instead; if fees are too low, liquidity providers don't get any benefit for contributing to the pool. <!-- STYLE_OVERRIDE: will --> 

Each AMM gives its liquidity providers the power to vote on its fees, in proportion to the number of LP tokens they hold. To vote, a liquidity provider sends an [AMMVote][] transaction. Whenever anyone places a new vote, the AMM recalculates its fee to be an average of the latest votes, weighted by how many LP tokens those voters hold. Up to 8 liquidity providers' votes can be counted this way; if more liquidity providers try to vote, then only the top 8 votes (by most LP tokens held) are counted. Even though liquidity providers' share of LP tokens can shift rapidly for many reasons (such as trading those tokens using [Offers](offers.md)), the trading fees are only recalculated whenever someone places a new vote (even if that vote is not one of the top 8).

### Auction Slot

The XRP Ledger's AMM design includes an _auction slot_. A liquidity provider can bid LP Tokens to claim the auction slot to receive a discount on the trading fee for a 24-hour period. The LP tokens that were bid are returned to the AMM.

With any AMM, when the price of its assets shifts significantly in external markets, traders can use arbitrage to profit off the AMM. That can result in a loss for liquidity providers. The auction mechanism is intended to return more of that value to liquidity providers, and more quickly bring the AMM's prices back into balance with external markets.

No more than one account can hold the auction slot at a time, but as the successful bidder you can name up to 4 additional accounts to receive the discount. If the slot is currently occupied, you must outbid the current slot holder to displace them. If someone displaces you, you get a percentage of your bid back, based on how much time remains. As long as you hold an active auction slot, you pay a discounted trading fee equal to 1/10 (one tenth) of the normal trading fee when making trades against that AMM.

The minimum bid to win the auction slot, if it is empty or expired, is equal to the current total number of LP Tokens outstanding multiplied by the trading fee, divided by 25. (In pseudocode, `MinBid = LPTokens * TradingFee / 25`.) If the auction slot is occupied, you must bid at least the minimum plus up to 105% of what the current slot holder paid, discounted by how much time they have remaining.

## Representation in the Ledger

In the ledger's state data, an AMM consists of multiple [ledger entries](../../../references/protocol/ledger-data/ledger-entry-types/index.md):

- An [AMM entry][] describing the automated market maker itself.

- A special [AccountRoot entry][] that issues the AMM's LP tokens, and holds the AMM's XRP (if it has any).

    The address of this AccountRoot is chosen somewhat randomly when the AMM is created, and it is different if the AMM is deleted and re-created. This is to prevent people from funding the AMM account with excess XRP in advance.

- [Trust lines](../fungible-tokens/index.md) to the special AMM Account for the tokens in the AMM's pool.

These ledger entries are not owned by any account, so the [reserve requirement](../../accounts/reserves.md) does not apply to them. However, to prevent spam, the transaction to create an AMM has a special [transaction cost](../../transactions/transaction-cost.md) that requires the sender to burn a larger than usual amount of XRP.


## Deletion

An AMM is deleted when an [AMMWithdraw transaction][] withdraws all assets from its pool. This only happens by redeeming all of the AMM's outstanding LP tokens. Deleting the AMM removes all the ledger entries associated with it, such as:

- AMM
- AccountRoot
- Trust lines for the AMM's LP tokens. Those trust lines would have a balance of 0 but may have other details, such as the limit, set to a non-default value.
- Trust lines for the tokens that were in the AMM pool.

If there are more than 512 trust lines attached to the AMM account when it would be deleted, the withdraw succeeds and deletes as many trust lines as it can, but leaves the AMM in the ledger with no assets in its pool.

While an AMM has no assets in its pool, anyone can delete it by sending an [AMMDelete transaction][]; if the remaining number of trust lines is still greater than the limit, multiple AMMDelete transactions might be necessary to fully delete the AMM. Alternatively, anyone can perform a [special deposit](../../../references/protocol/transactions/types/ammdeposit.md#empty-amm-special-case) to fund the AMM as if it were new. No other operations are valid on an AMM with an empty asset pool.

There is no refund or incentive for deleting an empty AMM.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
