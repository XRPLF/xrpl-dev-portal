//---------- List of requests ------------------------//
// Must be loaded after apitool-rest.js //
var DOC_BASE = "historical_data.html";
var URL_BASE = "https://history.ripple.com:443";

var DEFAULT_ADDRESS_1 = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
var DEFAULT_HASH = "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E";
var DEFAULT_LEDGER = "3170DA37CE2B7F045F889594CBC323D88686D2E90E8FFD2BBCD9BAD12E416DB5";


Request('Get Account Transaction History', {
    method: GET,
    path: "/v1/accounts/{:address}/transactions?{:query_params}",
    description: "Retrieve transactions that affected the given account.",
    link: "#get-account-transaction-history",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "type=Payment&result=tesSUCCESS"
    }
});

Request('Get Transaction By Account and Sequence', {
    method: GET,
    path: "/v1/accounts/{:address}/transactions/{:sequence}?{:query_params}",
    description: "Retrieve a specific transaction, by the account that sent it and the sequence number it used.",
    link: "#get-transaction-by-account-and-sequence",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:sequence}": 1,
        "{:query_params}": "binary=false"
    }
});

Request('Get Transaction', {
    method: GET,
    path: "/v1/transactions/{:hash}?{:query_params}",
    description: "Retrieve a transactions by its identifying hash.",
    link: "#get-transaction",
    params: {
        "{:hash}": DEFAULT_HASH,
        "{:query_params}": "binary=false"
    }
});

Request('Get Ledger', {
    method: GET,
    path: "/v1/ledgers/{:ledger_identifier}?{:query_params}",
    description: "Retrieve a ledger by its sequence number or identifying hash.",
    link: "#get-ledger",
    params: {
        "{:ledger_identifier}": DEFAULT_LEDGER,
        "{:query_params}": "transactions=true&binary=false&expand=true"
    }
});

//---------- End req. List ---------------------------//
