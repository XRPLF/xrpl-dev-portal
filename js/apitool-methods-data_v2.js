//---------- List of requests ------------------------//
// Must be loaded after apitool-rest.js //
var DOC_BASE = "data_api_v2.html";
var URL_BASE = "https://data.ripple.com:443";

var DEFAULT_ADDRESS_1 = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
var DEFAULT_HASH = "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E";
var DEFAULT_LEDGER = "3170DA37CE2B7F045F889594CBC323D88686D2E90E8FFD2BBCD9BAD12E416DB5";

// general methods -----------------------------------//

Request("GENERAL METHODS");

Request('Get Ledger', {
    method: GET,
    path: "/v2/ledgers/{:ledger_identifier}?{:query_params}",
    description: "Retrieve a ledger by its sequence number or identifying hash.",
    link: "#get-ledger",
    params: {
        "{:ledger_identifier}": DEFAULT_LEDGER,
        "{:query_params}": "transactions=true&binary=false&expand=true"
    }
});

Request('Get Transaction', {
    method: GET,
    path: "/v2/transactions/{:hash}?{:query_params}",
    description: "Retrieve a transactions by its identifying hash.",
    link: "#get-transaction",
    params: {
        "{:hash}": DEFAULT_HASH,
        "{:query_params}": "binary=false"
    }
});

Request('Get Transactions', {
    method: GET,
    path: "/v2/transactions/?{:query_params}",
    description: "Retrieve a transactions by its identifying hash.",
    link: "#get-transactions",
    params: {
        "{:query_params}": "descending=true&limit=3&result=tesSUCCESS&type=OfferCreate"
    }
});

// account methods -----------------------------------//

Request("ACCOUNT METHODS");

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
        "{:query_params}": "interval=week&descending=true"
    }
});

Request('Get Account Transaction History', {
    method: GET,
    path: "/v2/accounts/{:address}/transactions?{:query_params}",
    description: "Retrieve transactions that affected the given account.",
    link: "#get-account-transaction-history",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "type=Payment&result=tesSUCCESS&limit=3"
    }
});

Request('Get Transaction By Account and Sequence', {
    method: GET,
    path: "/v2/accounts/{:address}/transactions/{:sequence}?{:query_params}",
    description: "Retrieve a transaction using the sending account and sequence number.",
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
    description: "Retrieve payments to and from a given account.",
    link: "#get-account-payments",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "currency=USD&limit=3"
    }
});
//---------- End req. List ---------------------------//
