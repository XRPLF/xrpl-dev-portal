//---------- List of requests ------------------------//
// Must be loaded after apitool-rest.js //
var URL_BASE = "https://api.ripple.com:443";
var DOC_BASE = "ripple-rest.html";

var DEFAULT_ADDRESS_1 = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
var DEFAULT_ADDRESS_2 = "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX";
var DEFAULT_ADDRESS_3 = "rJnZ4YHCUsHvQu7R6mZohevKJDHFzVD6Zr";
var DEFAULT_HASH = "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E";
var DEFAULT_SECRET = "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9";

Request('ACCOUNTS');

Request('Generate Wallet', {
    method: GET,
    path: "/v1/wallet/new",
    description: 'Randomly generate keys for a potential new Ripple account.',
    link: '#generate-wallet'
});

Request('Get Account Balances', {
    method: GET,
    path: '/v1/accounts/{:address}/balances?{:query_params}',
    description: 'Retrieve the current balances for the given Ripple account.',
    link: '#get-account-balances',
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "currency=USD"
    }
});

Request('Get Account Settings', {
    method: GET,
    path: '/v1/accounts/{:address}/settings',
    description: 'Retrieve the current settings for the given Ripple account.',
    link: '#get-account-settings',
    params: {
        "{:address}": DEFAULT_ADDRESS_1
    }
});

Request('Update Account Settings', {
    method: POST,
    path: '/v1/accounts/{:address}/settings?{:query_params}',
    description: 'Change the current settings for the given Ripple account.',
    link: '#update-account-settings',
    test_only: true,
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "validated=true"
    },
    body: {
        secret: DEFAULT_SECRET,
        settings: {
            require_destination_tag: false,
            require_authorization: false,
            disallow_xrp: false,
            disable_master: false,
            email_hash: "98b4375e1d753e5b91627516f6d70977"
        }
    }
});

Request("PAYMENTS");

Request('Prepare Payment', {
    method: GET,
    path: '/v1/accounts/{:source_address}/payments/paths/{:destination_address}/{:amount}?{:query_params}',
    description: 'Retrieve possible payment objects for a desired payment.',
    link: '#prepare-payment',
    params: {
        "{:source_address}": DEFAULT_ADDRESS_1,
        "{:destination_address}": DEFAULT_ADDRESS_2,
        "{:amount}": "1+USD+rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "{:query_params}": "source_currencies=USD"
    }
});

Request('Submit Payment', {
    method: POST,
    path: '/v1/accounts/{:source_address}/payments?{:query_params}',
    description: 'Send a prepared payment to the network.',
    link: '#submit-payment',
    test_only: true,
    body: {
      "secret": DEFAULT_SECRET,
      "client_resource_id": "348170b9-16b9-4927-854d-7f9d4a2a692d",
      "payment":     {
          "source_account": DEFAULT_ADDRESS_1,
          "source_tag": "",
          "source_amount": {
            "value": "1",
            "currency": "USD",
            "issuer": ""
          },
          "source_slippage": "0",
          "destination_account": DEFAULT_ADDRESS_2,
          "destination_tag": "",
          "destination_amount": {
            "value": "1",
            "currency": "USD",
            "issuer": DEFAULT_ADDRESS_1
          },
          "invoice_id": "",
          "paths": "[]",
          "partial_payment": false,
          "no_direct_ripple": false
        }
    },
    params: {
        "{:source_address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "validated=true"
    }
});

Request("Confirm Payment", {
    method: GET,
    path: "/v1/accounts/{:address}/payments/{:id}",
    description: "Retrieve details of a payment and its status.",
    link: "#confirm-payment",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:id}": DEFAULT_HASH
    }
});

Request("Get Payment History", {
    method: GET,
    path: "/v1/accounts/{:address}/payments?{:query_params}",
    description: "Browse through the history of payments sent and received by an account.",
    link: "#get-payment-history",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "direction=incoming&exclude_failed=true"
    }
});

Request("ORDERS");

Request("Place Order", {
    method: POST,
    path: "/v1/accounts/{:address}/orders?{:query_params}",
    description: "Place an order on the ripple network.",
    link: "#place-order",
    test_only: true,
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "validated=true"
    },
    body: {
        "secret": DEFAULT_SECRET,
        "order": {
            "type": "sell",
            "taker_pays": {
                "currency": "JPY",
                "value": "4000",
                "counterparty": "rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6"
            },
            "taker_gets": {
                "currency": "USD",
                "value": ".25",
                "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
            },
            "immediate_or_cancel": true
        }
    }
});

Request("Cancel Order", {
    method: DELETE,
    path: "/v1/accounts/{:address}/orders/{:order}/?{:query_params}",
    description: "Cancel an order on the ripple network.",
    link: "#cancel-order",
    test_only: true,
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "validated=true",
        "{:order}": "23"
    },
    body: {
        "secret": DEFAULT_SECRET
    }
});

Request("Get Account Orders", {
    method: GET,
    path: "/v1/accounts/{:address}/orders?{:query_params}",
    description: "Get open currency-exchange orders associated with the Ripple address.",
    link: "#get-account-orders",
    params: {
        "{:address}": DEFAULT_ADDRESS_3,
        "{:query_params}": "ledger=10399192&limit=15"
    }
});

Request("Get Order Transaction", {
    method: GET,
    path: "/v1/accounts/{:address}/orders/{:hash}",
    description: "Get the details of an order transaction.",
    link: "#get-order-transaction",
    params: {
        "{:address}": "rEQWVz1qN4DWw5J17s3DgXQzUuVYDSpK6M",
        "{:hash}": "D53A3B99AC0C3CAF35D72178390ACA94CD42479A98CEA438EEAFF338E5FEB76D"
    }
});

Request("Get Order Book", {
    method: GET,
    path: "/v1/accounts/{:address}/order_book/{:base}/{:counter}?{:query_params}",
    description: "Get the order book for a currency pair",
    link: "#get-order-book",
    params: {
        "{:address}": DEFAULT_ADDRESS_3,
        "{:base}": "BTC+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "{:counter}": "USD+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "{:query_params}": "limit=10"
    }
});

Request("TRUST LINES");

Request("Get Trustlines", {
    method: GET,
    path: "/v1/accounts/{:address}/trustlines?{:query_params}",
    description: "Check the status of one or more trustlines attached to an account.",
    link: "#get-trustlines",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "currency=USD&counterparty=ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
    }
});

Request("Grant Trustline", {
    method: POST,
    path: "/v1/accounts/{:address}/trustlines?{:query_params}",
    description: "Add or modify a trustline from this account.",
    link: "#grant-trustline",
    test_only: true,
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "validated=true"
    },
    body: {
        "secret": DEFAULT_SECRET,
        "trustline": {
            "limit": "110",
            "currency": "USD",
            "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "allows_rippling": false
        }
    }
});

Request("NOTIFICATIONS");

Request("Check Notifications", {
    method: GET,
    path: "/v1/accounts/{:address}/notifications/{:id}",
    description: "Monitor an account for all kinds of transactions.",
    link: "#check-notifications",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:id}": DEFAULT_HASH
    }
});

Request("RIPPLED SERVER STATUS");

Request("Check Connection", {
    method: GET,
    path: "/v1/server/connected",
    description: "Check whether the REST server is connected to a rippled server.",
    link: "#check-connection"
});

Request("Get Server Status", {
    method: GET,
    path: "/v1/server",
    description: "Retrieve information about the current status of the Ripple-REST server and the rippled server it is connected to.",
    link: "#get-server-status"
});

Request("UTILITIES");

Request("Retrieve Ripple Transaction", {
    method: GET,
    path: "/v1/transactions/{:id}",
    description: "Retrieve a raw Ripple transaction",
    link: "#retrieve-ripple-transaction",
    params: {
        "{:id}": DEFAULT_HASH
    }
});

Request("Retrieve Transaction Fee", {
    method: GET,
    path: "/v1/transaction-fee",
    description: "Retrieve the current transaction fee for the connected rippled server(s).",
    link: "#retrieve-transaction-fee",
});

Request("Generate UUID", {
    method: GET,
    path: "/v1/uuid",
    description: "Create a universally-unique identifier (UUID) to use as the client resource ID for a payment.",
    link: "#create-client-resource-id"
});

//helper to fill the default payment with a new UUID
function get_uuid(callback) {
    $.get(URL_BASE + "/v1/uuid").done(callback);
}

$(document).ready(function(){
    get_uuid(function(resp,status,xhr) {
        requests["submit-payment"].body.client_resource_id = resp.uuid;
        if (window.location.hash == "#submit-payment") {
            //we might have already loaded the call by the time the AJAX
            // completes, so refresh the default body.
            // Debatably a bad idea, because if the AJAX takes so long that the
            // user has already started editing the call, it'll reset it.
            select_request("submit-payment");
        }
    });
});

//---------- End req. List ---------------------------//
