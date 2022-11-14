# Token Types

You can use tokens for a variety of purposes on the XRP Ledger.

## Stablecoins

A common model for tokens in the XRP Ledger is that an issuer holds assets of equivalent value outside of the XRP Ledger, and issues tokens representing that value on the ledger. This type of issuer is sometimes called a _gateway_ because currency can move into and out of the XRP Ledger through their service. If the assets that back a token use the same amounts and denomination as the tokens in the ledger, that token can be considered a "stablecoin" because—in theory—the exchange rate between that token and its off-ledger representation should be stable at 1:1.

A stablecoin issuer should offer _deposits_ and _withdrawals_ to exchange the tokens for the actual currency or asset in the world outside the XRP Ledger.

In practice, the XRP Ledger is a computer system that cannot enforce any rules outside of itself, so stablecoins on the XRP Ledger depend on their issuer's integrity. If you can't count on the stablecoin's issuer to redeem your tokens for the real thing on demand, then you shouldn't expect the stablecoin to retain its value. As a user, you should be mindful of who's issuing the tokens: are they reliable, lawful, and solvent? If not, it's probably best not to hold those tokens.

For more information on how to run a gateway, see Becoming an XRP Ledger Gateway.


## Community Credit

Another way you can use the XRP Ledger is for "community credit", a system where individuals who know each other can use the XRP Ledger to track who owes who else how much money. A powerful feature of the XRP Ledger is that it can automatically and atomically use these debts to settle payments through rippling.

For example, if Asheesh owes Marcus $20, and Marcus owes Bharath $50, Bharath can "pay" Asheesh $20 by canceling that much of Marcus's debt to him in exchange for canceling Asheesh's debt to Marcus. The reverse is also possible: Asheesh can pays Bharath through Marcus by increasing their respective debts. The XRP Ledger can settle complex chains of exchanges like this in a single transaction without the accounts in the middle needing to do anything manually.

For more on this type of usage, see paths. <!--{# TODO: It would be nice to be able to link to a page with more illustrative examples of community credit. #}-->


## Other Tokens

There are other use cases for tokens issued in the XRP Ledger. For example, you can create an "Initial Coin Offering" (ICO) by issuing a fixed amount of currency to a secondary address, then "throwing away the key" to the issuer.

**Warning:** ICOs may be [regulated as securities](https://www.sec.gov/oiea/investor-alerts-and-bulletins/ib_coinofferings) in the USA. <!-- SPELLING_IGNORE: ico, icos -->

Be sure to research the relevant regulations before engaging in any financial service business.
