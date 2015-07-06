//---------- List of requests ------------------------//
// Must be loaded after apitool-rest.js //
var DOC_BASE = "charts_api.html";
var URL_BASE = "https://api.ripplecharts.com:443";

var DEFAULT_ADDRESS_1 = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
var TIME_20140101 = "2014-01-01T00:00:00.000Z";
var TIME_20150101 = "2015-01-01T00:00:00.000Z";
var TIME_20150101_2 = "2015-01-01T02:00:00.000Z";


Request('Account Offers Exercised', {
    method: POST,
    path: "/api/account_offers_exercised",
    description: "Retrieve currency-exchange orders being exercised for a single account.",
    link: "#account-offers-exercised",
    params: {},
    body: {
        account: DEFAULT_ADDRESS_1,
        startTime: TIME_20140101,
        limit: 5,
        offset: 0,
        format: "json"
    }
});

Request('Accounts Created', {
    method: POST,
    path: "/api/accounts_created",
    description: "Retrieve information about the creation of new Ripple accounts.",
    link: "#accounts-created",
    params: {},
    body: {
        "startTime": TIME_20140101,
        "endTime": "2015-03-31T00:00:00.000Z",
        "timeIncrement": "week",
        "descending": true,
        "reduce": true
    }
});

Request('Exchange Rates', {
    method: POST,
    path: "/api/exchange_rates",
    description: "Retrieve information about the exchange rates between one or more pairs of currency.",
    link: "#exchange-rates",
    params: {},
    body: {
        "pairs": [
            {
                "base": {
                    "currency": "CNY",
                    "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK"
                },
                "counter": {
                    "currency": "XRP"
                }
            },
            {
                "base": {
                    "currency": "MXN",
                    "issuer": "rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn"
                },
                "counter": {
                    "currency": "USD",
                    "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
                }
            }
        ],
        "range": "day"
    }
});

Request('Issuer Capitalization', {
    method: POST,
    path: "/api/issuer_capitalization",
    description: "Retrieve the total capitalization (outstanding balance) of specified currency issuers over time.",
    link: "#issuer-capitalization",
    params: {},
    body: {
        "currencies": [
            {
                "currency": "USD",
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
            },
            {
                "currency": "USD",
                "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
            }
        ],
        "startTime": TIME_20140101,
        "endTime": TIME_20150101,
        "timeIncrement": "month"
    }
});

Request('Ledgers Closed', {
    method: POST,
    path: "/api/ledgers_closed",
    description: "Retrieve information about ledgers closed over time.",
    link: "#ledgers-closed",
    params: {},
    body: {
        "startTime": TIME_20140101,
        "endTime": TIME_20150101,
        "timeIncrement": "month",
        "descending": false,
        "reduce": true,
        "format": "json"
    }
});

Request('Market Traders', {
    method: POST,
    path: "/api/market_traders",
    description: "Return a list of accounts that participated in trading a specified currency exchange.",
    link: "#market-traders",
    params: {},
    body: {
        "base": {
            "currency": "XRP"
        },
        "counter": {
            "currency": "KRW",
            "issuer": "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d"
        },
        "startTime": TIME_20150101,
        "transactions": true,
        "format": "json"
    }
});

Request('Offers', {
    method: POST,
    path: "/api/offers",
    description: "Returns all currency-exchange orders and cancellations over time for a specified currency pair, including unfulfilled offers.",
    link: "#offers",
    params: {},
    body: {
        "base": {
            "currency": "GBP",
            "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
        },
        "counter": {
            "currency": "XRP"
        },
        "startTime": "2015-03-01T00:00:00.000Z",
        "endTime": "2015-03-07T00:00:00.000Z",
        "timeIncrement": "day",
        "descending": false,
        "reduce": true,
        "format": "json"
    }
});

Request('Offers Exercised', {
    method: POST,
    path: "/api/offers_exercised",
    description: "Retrieve information about currency-exchange orders being exercised on the network, for a specific pair of currencies and timeframe.",
    link: "#offers-exercised",
    params: {},
    body: {
        "base": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "counter": {
            "currency": "BTC",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "endTime": TIME_20150101,
        "startTime": TIME_20150101_2,
        "timeIncrement": "minute",
        "timeMultiple": 15,
        "format": "json"
    }
});

Request('Top Markets', {
    method: POST,
    path: "/api/top_markets",
    description: "Returns the total trade volume for a selection of the largest currency-exchange markets in the Ripple Network during a given time period.",
    link: "#top-markets",
    params: {},
    body: {
        "startTime": TIME_20150101,
        "interval": "week",
        "exchange": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
      }
    }
});

Request('Total Network Value', {
    method: POST,
    path: "/api/total_network_value",
    description: "Retrieve the total amount of currency held in the network, as of a specified time.",
    link: "#total-network-value",
    params: {},
    body: {
        "time": TIME_20150101,
        "exchange":{
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
    }
});

Request('Total Value Sent', {
    method: POST,
    path: "/api/total_value_sent",
    description: "The total amount of money sent, in payments and currency exchanges, for a curated list of currencies and issuers.",
    link: "#total-value-sent",
    params: {},
    body: {
        "startTime": TIME_20150101,
        "interval": "month",
        "exchange": {
            "currency": "USD",
            "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
    }
});

Request('Transaction Stats', {
    method: POST,
    path: "/api/transaction_stats",
    description: "Retrieve information about Ripple transactions during a specific time frame.",
    link: "#transaction-stats",
    params: {},
    body: {
        "startTime": TIME_20150101,
        "endTime": TIME_20150101_2,
        "timeIncrement": "hour",
        "descending": true,
        "reduce": true,
        "format": "json"
    }
});

Request('Value Sent', {
    method: POST,
    path: "/api/value_sent",
    description: "Retrieve the total amount of a single currency sent, in payments and currency exchanges, during a specific time period.",
    link: "#value-sent",
    params: {},
    body: {
        "currency": "JPY",
        "issuer": "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN",
        "startTime": TIME_20150101,
        "endTime": TIME_20150101_2,
        "timeIncrement": "hour",
        "descending": false,
        "reduce": true,
        "format": "json"
    }
});

//---------- End req. List ---------------------------//
