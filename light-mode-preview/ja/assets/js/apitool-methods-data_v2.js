//---------- List of requests ------------------------//
// Must be loaded after apitool-rest.js //
//var DOC_BASE = "reference-data-api.html";
//var URL_BASE = "https://data-staging.ripple.com";

var DEFAULT_ADDRESS_1 = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
var KRW_TRADER_ADDRESS = "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw";
var JPY_TRADER_ADDRESS = "rK5j9n8baXfL4gzUoZsfxBvvsv97P5swaV";
var DEFAULT_HASH = "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E";
var DEFAULT_LEDGER = "3170DA37CE2B7F045F889594CBC323D88686D2E90E8FFD2BBCD9BAD12E416DB5";
var VALIDATOR_PUBKEY = "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK";
var LEDGER_WITH_VALIDATIONS = "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7";

// general methods -----------------------------------//

Request("LEDGER CONTENTS");

Request('Get Ledger', {
    method: GET,
    path: "/v2/ledgers/{:ledger_identifier}?{:query_params}",
    description: "Get a ledger by its sequence number or identifying hash.",
    link: "#get-ledger",
    params: {
        "{:ledger_identifier}": DEFAULT_LEDGER,
        "{:query_params}": "transactions=true&binary=false&expand=true"
    }
});

Request('Get Transaction', {
    method: GET,
    path: "/v2/transactions/{:hash}?{:query_params}",
    description: "Get a transaction by its identifying hash.",
    link: "#get-transaction",
    params: {
        "{:hash}": DEFAULT_HASH,
        "{:query_params}": "binary=false"
    }
});

Request('Get Transactions', {
    method: GET,
    path: "/v2/transactions/?{:query_params}",
    description: "Search through all transactions",
    link: "#get-transactions",
    params: {
        "{:query_params}": "descending=true&limit=3&result=tesSUCCESS&type=OfferCreate"
    }
});

Request('Get Payments', {
    method: GET,
    path: "/v2/payments/{:currency}?{:query_params}",
    description: "Get Payments over time, where Payments are defined as Payment-type transactions where the sender of the transaction is not also the destination. ",
    link: "#get-payments",
    params: {
        "{:currency}": "BTC+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "{:query_params}": "limit=2"
    }
});


Request('Get Exchanges', {
    method: GET,
    path: "/v2/exchanges/{:base}/{:counter}?{:query_params}",
    description: "Get exchanges for a currency pair over time.",
    link: "#get-exchanges",
    params: {
        "{:base}": "USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "{:counter}": "XRP",
        "{:query_params}": "descending=true&limit=3&result=tesSUCCESS&type=OfferCreate"
    }
});

Request('Get Exchange Rates', {
    method: GET,
    path: "/v2/exchange_rates/{:base}/{:counter}?{:query_params}",
    description: "Get an exchange rate for a given currency pair at a specific time.",
    link: "#get-exchange-rates",
    params: {
        "{:base}": "USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "{:counter}": "XRP",
        "{:query_params}": "date=2015-11-13T00:00:00Z"
    }
});

Request('Normalize', {
    method: GET,
    path: "/v2/normalize?{:query_params}",
    description: "Convert an amount from one currency and issuer to another, using the network exchange rates.",
    link: "#normalize",
    params: {
        "{:query_params}": "amount=100&currency=XRP&exchange_currency=USD&exchange_issuer=rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
    }
});

Request('Get Daily Reports', {
    method: GET,
    path: "/v2/reports/{:date}?{:query_params}",
    description: "Get an aggregated summary of payments per account for one day.",
    link: "#get-daily-reports",
    params: {
        "{:date}": "2015-08-19T00:00:00Z",
        "{:query_params}": "accounts=true&payments=true"
    }
});

Request('Get Stats', {
    method: GET,
    path: "/v2/stats/?{:query_params}",
    description: "Get an aggregated summary of payments per account for one day.",
    link: "#get-daily-summary",
    params: {
        "{:query_params}": "start=2015-08-30&end=2015-08-31&interval=day&family=metric&metrics=accounts_created,exchanges_count,ledger_count,payments_count"
    }
});

Request('Get Capitalization', {
    method: GET,
    path: "/v2/capitalization/{:currency}?{:query_params}",
    description: "Get capitalization data for a specific currency and issuer.",
    link: "#get-capitalization",
    params: {
        "{:currency}": "USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "{:query_params}": "start=2015-01-01T00:00:00Z&end=2015-10-31&interval=month"
    }
});

Request('Get Active Accounts', {
    method: GET,
    path: "/v2/active_accounts/{:base}/{:counter}?{:query_params}",
    description: "Get information on which accounts are actively trading in a specific currency pair.",
    link: "#get-active-accounts",
    params: {
        "{:base}": "USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "{:counter}": "XRP",
        "{:query_params}": "period=7day"
    }
});

Request('Get Exchange Volume', {
    method: GET,
    path: "/v2/network/exchange_volume?{:query_params}",
    description: "Get aggregated exchange volume for a given time period.",
    link: "#get-exchange-volume",
    params: {
        "{:query_params}": "start=2015-10-01T00:00:00&end=2015-11-15T00:00:00&interval=week&exchange_currency=USD&exchange_issuer=rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
    }
});

Request('Get Payment Volume', {
    method: GET,
    path: "/v2/network/payment_volume?{:query_params}",
    description: "Get aggregated payment volume for a given time period.",
    link: "#get-exchange-volume",
    params: {
        "{:query_params}": "start=2015-10-01T00:00:00&end=2015-11-15T00:00:00&interval=week&exchange_currency=USD&exchange_issuer=rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
    }
});

Request('Get Issued Value', {
    method: GET,
    path: "/v2/network/issued_value?{:query_params}",
    description: "Get aggregated payment volume for a given time period.",
    link: "#get-exchange-volume",
    params: {
        "{:query_params}": "start=2015-10-01T00:00:00&end=2015-11-15T00:00:00&exchange_currency=USD&exchange_issuer=rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
    }
});


Request('Get XRP Distribution', {
    method: GET,
    path: "/v2/network/xrp_distribution?{:query_params}",
    description: "Get info on how much XRP is available and how much has been distributed outside of Ripple (the company).",
    link: "#get-xrp-distribution",
    params: {
        "{:query_params}": "limit=3&descending=true"
    }
});

Request('Get Top Currencies', {
    method: GET,
    path: "/v2/network/top_currencies/{:date}?{:query_params}",
    description: "Get most used currencies for a given date.",
    link: "#get-top-currencies",
    params: {
        "{:date}": "2016-04-14",
        "{:query_params}": "limit=2"
    }
});

Request('Get Top Markets', {
    method: GET,
    path: "/v2/network/top_markets/{:date}",
    description: "Get most active markets for a given date.",
    link: "#get-top-currencies",
    params: {
        "{:date}": "2016-04-15"
    }
});

// account methods -----------------------------------//

Request("ACCOUNTS");

Request('Get Account', {
    method: GET,
    path: "/v2/accounts/{:address}",
    description: "Get creation info for a specific account.",
    link: "#get-account",
    params: {
        "{:address}": DEFAULT_ADDRESS_1
    }
});

Request('Get Accounts', {
    method: GET,
    path: "/v2/accounts/?{:query_params}",
    description: "Get info for all account creations.",
    link: "#get-accounts",
    params: {
        "{:query_params}": "descending=true&parent=rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
    }
});

Request('Get Account Balances', {
    method: GET,
    path: "/v2/accounts/{:address}/balances?{:query_params}",
    description: "Get a given account's balances at a given time.",
    link: "#get-account-balances",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "currency=USD&date=2015-01-01T00:00:00Z&limit=3"
    }
});


Request('Get Account Orders', {
    method: GET,
    path: "/v2/accounts/{:address}/orders?{:query_params}",
    description: "Get orders in the order books, placed by a specific account.",
    link: "#get-account-orders",
    params: {
        "{:address}": JPY_TRADER_ADDRESS,
        "{:query_params}": "limit=2&date=2015-11-11T00:00:00Z"
    }
});


Request('Get Account Transaction History', {
    method: GET,
    path: "/v2/accounts/{:address}/transactions?{:query_params}",
    description: "Get transactions that affected the given account.",
    link: "#get-account-transaction-history",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "type=Payment&result=tesSUCCESS&limit=3"
    }
});

Request('Get Transaction By Account and Sequence', {
    method: GET,
    path: "/v2/accounts/{:address}/transactions/{:sequence}?{:query_params}",
    description: "Get a transaction using the sending account and sequence number.",
    link: "#get-transaction-by-account-and-sequence",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:sequence}": 10,
        "{:query_params}": "binary=true"
    }
});

Request('Get Account Payments', {
    method: GET,
    path: "/v2/accounts/{:address}/payments?{:query_params}",
    description: "Get payments to and from a given account.",
    link: "#get-account-payments",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "currency=USD&limit=3"
    }
});

Request('Get Account Exchanges - All', {
    method: GET,
    path: "/v2/accounts/{:address}/exchanges?{:query_params}",
    description: "Get all currency changes in which a given account participated.",
    link: "#get-account-exchanges",
    params: {
        "{:address}": KRW_TRADER_ADDRESS,
        "{:query_params}": "start=2015-08-01T00:00:00Z&end=2015-08-31T00:00:00Z"
    }
});

Request('Get Account Exchanges - Single Currency Pair', {
    method: GET,
    path: "/v2/accounts/{:address}/exchanges/{:base}/{:counter}?{:query_params}",
    description: "Get exchanges of a specific currency pair in which a given account participated.",
    link: "#get-account-exchanges",
    params: {
        "{:address}": KRW_TRADER_ADDRESS,
        "{:base}": "KRW+rUkMKjQitpgAM5WTGk79xpjT38DEJY283d",
        "{:counter}": "XRP",
        "{:query_params}": "start=2015-08-08T00:00:00Z&end=2015-08-31T00:00:00Z&limit=2"
    }
});

Request('Get Account Balance Changes', {
    method: GET,
    path: "/v2/accounts/{:address}/balance_changes?{:query_params}",
    description: "Get detailed account of all changes to an account's balance.",
    link: "#get-account-balance-changes",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "descending=true&limit=3"
    }
});

Request('Get Account Reports By Day', {
    method: GET,
    path: "/v2/accounts/{:address}/reports/{:date}?{:query_params}",
    description: "Get summary of account activity for a given account on a certain day.",
    link: "#get-account-reports",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:date}": "2015-08-27T00:00:00",
        "{:query_params}": "accounts=true&payments=true&descending=true"
    }
});

Request('Get Account Reports Range', {
    method: GET,
    path: "/v2/accounts/{:address}/reports?{:query_params}",
    description: "Get multiple daily summaries of account activity.",
    link: "#get-account-reports",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "accounts=true&payments=true&descending=true"
    }
});

Request('Get Account Transaction Stats', {
    method: GET,
    path: "/v2/accounts/{:address}/stats/transactions?{:query_params}",
    description: "Get daily summaries of transaction activity for an account.",
    link: "#get-account-transaction-stats",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "limit=2&descending=true"
    }
})

Request('Get Account Value Stats', {
    method: GET,
    path: "/v2/accounts/{:address}/stats/value?{:query_params}",
    description: "Get daily summaries of the currency held by an account.",
    link: "#get-account-value-stats",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "limit=2&descending=true"
    }
})
//-------------- Validation Network 00----------------//

Request("VALIDATION NETWORK");


Request('Get Transaction Costs', {
    method: GET,
    path: "/v2/network/fees?{:query_params}",
    description: "Get stats on the transaction cost.",
    link: "#get-transaction-costs",
    params: {
        "{:query_params}": "interval=day&limit=3&descending=true"
    }
});

Request('Get Ledger Validations', {
    method: GET,
    path: "/v2/ledgers/{:ledger_hash}/validations?{:query_params}",
    description: "Get data on validations for a specific ledger hash.",
    link: "#get-ledger-validations",
    params: {
        "{:ledger_hash}": LEDGER_WITH_VALIDATIONS,
        "{:query_params}": "limit=2"
    }
});

Request('Get Ledger Validation', {
    method: GET,
    path: "/v2/ledgers/{:ledger_hash}/validations/{:validation_public_key}",
    description: "Get data on validation for a specific ledger hash by a specific validator.",
    link: "#get-ledger-validation",
    params: {
        "{:ledger_hash}": LEDGER_WITH_VALIDATIONS,
        "{:validation_public_key}": VALIDATOR_PUBKEY
    }
});

Request('Get Topology', {
    method: GET,
    path: "/v2/network/topology?{:query_params}",
    description: "Get topology of servers running the Ripple peer-to-peer network.",
    link: "#get-topology",
    params: {
        "{:query_params}": "verbose=true"
    }
});

Request('Get Topology Nodes', {
    method: GET,
    path: "/v2/network/topology/nodes?{:query_params}",
    description: "Get data on servers running the Ripple peer-to-peer network.",
    link: "#get-topology-nodes",
    params: {
        "{:query_params}": "verbose=true"
    }
});

Request('Get Topology Node', {
    method: GET,
    path: "/v2/network/topology/nodes/{:pubkey}",
    description: "Get data on servers running the Ripple peer-to-peer network.",
    link: "#get-topology-nodes",
    params: {
        "{:pubkey}": "n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor"
    }
});

Request('Get Topology Links', {
    method: GET,
    path: "/v2/network/topology/links?{:query_params}",
    description: "Get links in the topology of servers running the Ripple peer-to-peer network.",
    link: "#get-topology-links",
    params: {
        "{:query_params}": "verbose=true"
    }
});

// Removed in v2.4.0
// Request('Get Validations', {
//     method: GET,
//     path: "/v2/network/validations?{:query_params}",
//     description: "Get validation votes.",
//     link: "#get-validations",
//     params: {
//         "{:query_params}": "limit=3&descending=true"
//     }
// });

Request('Get Validator', {
    method: GET,
    path: "/v2/network/validators/{:validation_public_key}?{:query_params}",
    description: "Get details of a single validator by validation public key.",
    link: "#get-validator",
    params: {
        "{:validation_public_key}": VALIDATOR_PUBKEY,
        "{:query_params}": "verbose=true"
    }
});

Request('Get Validators', {
    method: GET,
    path: "/v2/network/validators?{:query_params}",
    description: "Get details of known validators.",
    link: "#get-validators",
    params: {
        "{:validation_public_key}": VALIDATOR_PUBKEY,
        "{:query_params}": "format=json"
    }
});

// Removed in v2.4.0
// Request('Get Validator Validations', {
//     method: GET,
//     path: "/v2/network/validators/{:validation_public_key}/validations?{:query_params}",
//     description: "Get validation votes from a single validator.",
//     link: "#get-validator-validations",
//     params: {
//         "{:validation_public_key}": VALIDATOR_PUBKEY,
//         "{:query_params}": "limit=3"
//     }
// });

Request('Get Single Validator Reports', {
    method: GET,
    path: "/v2/network/validators/{:validation_public_key}/reports?{:query_params}",
    description: "Get validation vote stats for a single validator over time.",
    link: "#get-single-validator-reports",
    params: {
        "{:validation_public_key}": VALIDATOR_PUBKEY,
        "{:query_params}": "format=json"
    }
});

Request('Get Daily Validator Reports', {
    method: GET,
    path: "/v2/network/validator_reports?{:query_params}",
    description: "Get validation vote stats for all validators for a single day.",
    link: "#get-single-validator-reports",
    params: {
        "{:query_params}": "format=json"
    }
});

Request('Get Validator Manifests', {
    method: GET,
    path: "/v2/network/validators/{:validation_public_key}/manifests",
    description: "Get validation vote stats for all validators for a single day.",
    link: "#get-validator-manifests",
    params: {
        "{:validation_public_key}": VALIDATOR_PUBKEY,
        "{:query_params}": "format=json"
    }
});

//-------------- Gateway Information -----------------//

Request("GATEWAY INFORMATION");

Request('Get All Gateways', {
    method: GET,
    path: "/v2/gateways",
    description: "Get information about known gateways.",
    link: "#get-all-gateways",
    params: {}
});

Request('Get Gateway', {
    method: GET,
    path: "/v2/gateways/{:gateway}",
    description: "Get information about a specific known gateway.",
    link: "#get-gateway",
    params: {
        "{:gateway}": "Gatehub"
    }
});

//-------------- Health Checks -----------------------//

Request("HEALTH CHECKS");

Request('API Health Check', {
    method: GET,
    path: "/v2/health/api?{:query_params}",
    description: "Check the health of the API service.",
    link: "#health-check-api",
    params: {
        "{:query_params}": "verbose=true"
    }
});

Request('Importer Health Check', {
    method: GET,
    path: "/v2/health/importer?{:query_params}",
    description: "Check the health of the Ledger Importer service.",
    link: "#health-check-ledger-importer",
    params: {
        "{:query_params}": "verbose=true"
    }
});

Request('Nodes ETL Health Check', {
    method: GET,
    path: "/v2/health/nodes_etl?{:query_params}",
    description: "Check the health of the Extract, Transform, Load service for network topology data.",
    link: "#health-check-nodes-etl",
    params: {
        "{:query_params}": "verbose=true"
    }
});

Request('Validations ETL Health Check', {
    method: GET,
    path: "/v2/health/nodes_etl?{:query_params}",
    description: "Check the health of the Extract, Transform, Load service for ledger validations.",
    link: "#health-check-validations-etl",
    params: {
        "{:query_params}": "verbose=true"
    }
});

//---------- End req. List ---------------------------//
