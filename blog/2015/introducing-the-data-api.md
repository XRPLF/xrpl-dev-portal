---
date: 2015-08-05
category: 2015
labels:
    - Features
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing the Data API

Ripple Labs data is moving under one roof, the Data API – a version two of the Historical Database API – and one infrastructure, Hadoop. We are building a much more robust and reliable way to import, parse, and house data that is not taxing on the Ripple network. Housing all of our endpoints together will allow us to scale much faster and with more confidence as the ledger and our data needs grow.

The Data API also includes a lot of new capabilities, including:

-   historical normalization of currency values against XRP
-   added fields for exchanges that show the makers and takers of liquidity
-   more information on each account, including the funding source and date
-   a new endpoint to show account balance changes
-   new metrics in transaction stats

We are making these changes quickly and are focusing our resources on building out and testing new endpoints. Documentation for the Data API will soon be available on [ripple.com/build](http://ripple.com/build). The API will live at [data.ripple.com](http://data.ripple.com). In the meantime, you can look through the [Data API in GitHub](https://github.com/ripple/rippled-historical-database/blob/develop/README.md).

Because we are pulling all of the data endpoints under one API, we are shutting down some of our underutilized endpoints that are relying on infrastructure we are not moving forward with. The first shutdown will be CouchDB on August 19th, which we used early on for Ripple Charts. We are replacing some of the endpoints that hit CouchDB in the Data API, but other, less frequently used calls are being removed. In the next few months, we will also be shutting down the Ripple Charts API and replacing aspects of that by expanding the Data API. The Historical Database API – version one – will live in parallel to the Data API as we make this transition. It will be deprecated by the end of the year.

The following endpoints will be shut down:

- /api/totalNetworkValue       
- /api/totalValueSent          
- /api/valueSent               
- /api/offers                  
- /api/currencyBalances        
- /api/accounttransactionstats
- /api/accounttrust            
- /api/ledgersclosed           


The following endpoints will be replicated on the Data API:

| Current                     | Data API                        |
|:----------------------------|:--------------------------------|
| /api/offersExercised        | /v2/exchanges                   |
| /api/exchangeRates          | /v2/exchange_rates              |
| /api/topMarkets             | TBD                             |
| /api/totalIssued            | TBD                             |
| /api/totalPaymentVolume     | TBD                             |
| /api/payments               | TBD                             |
| /api/accountsCreated        | /v2/accounts                    |
| /api/gateways               | TBD                             |
| /api/currencies             | TBD                             |
| /api/marketTraders          | TBD                             |
| /api/issuerCapitalization   | TBD                             |
| /api/accounttransactions    | /v2/accounts/:account/payments  |
| /api/accountoffersexercised | /v2/accounts/:account/exchanges |
| /api/transactionstats       | /v2/stats                       |
