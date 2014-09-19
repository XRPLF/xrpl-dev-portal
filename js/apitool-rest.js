var commands = $("#command_list li");
var request_body = $("#request_body");
var request_button = $("#request_button");
var response_body = $("#response_body");
var response_code = $("#rest_responsecode");
var rest_url = $('#rest_url');
var rest_method = $("#rest_method");
var selected_command = $("#selected_command");

var GET = "GET";
var POST = "POST";
var PUT = "PUT";
var DELETE = "DELETE";
var URL_BASE = "https://api.ripple.com:443";


function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

//Build requests
var requests = { };
function Request(name, obj) {
    obj.name = name;
    requests[slugify(name)] = obj;

    return obj;
};

$(commands).click(function() {
    var cmd = slugify($(this).text().trim());

    if (!requests[cmd]) return;

    select_request(cmd, true);
    window.location.hash = cmd;

    $(this).siblings().removeClass('selected');
    $(this).addClass('selected');
});


//---------- List of requests ------------------------//

Request('Generate Account', {
    method: GET,
    path: "/v1/accounts/new",
    description: 'Generate the keys for a potential new account',
    link: 'ripple-rest.html#generating-accounts'
});

Request('Get Account Balances', {
    method: GET,
    path: '/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/balances',
    description: 'Retrieve the current balances for the given Ripple account',
    link: 'ripple-rest.html#account-balances'
});

Request('Get Account Settings', {
    method: GET,
    path: '/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/settings',
    description: 'Retrieve the current settings for the given Ripple account',
    link: 'ripple-rest.html#account-settings'
});

Request('Update Account Settings', {
    method: POST,
    path: '/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/settings',
    description: 'Change the current settings for the given Ripple account',
    link: 'ripple-rest.html#updating-account-settings',
    body: {
        secret: "sssssssssssssssssssssssssssss",
        settings: {
            transfer_rate: 100,
            password_spent: false,
            require_destination_tag: false,
            require_authorization: false,
            disallow_xrp: false,
            disable_master: false,
            transaction_sequence: 22
        } 
    }
});

Request('Prepare Payment', {
    method: GET,
    path: '/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/payments/paths/ra5nK24KXen9AHvsdFTKHSANinZseWnPcX/1+USD+rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
    description: 'Change the current settings for the given Ripple account',
    link: 'ripple-rest.html#preparing-a-payment'
});

Request('Submit Payment', {
    method: POST,
    path: '/v1/payments',
    description: 'Send a prepared payment to the network.',
    link: 'ripple-rest.html#submitting-a-payment',
    body: {
        "secret": "s...",
        "client_resource_id": "...",
        "payment": {
            "source_account": "rPs7nVbSops6xm4v77wpoPFf549cqjzUy9",
            "source_tag": "",
            "source_amount": {
                "value": "1",
                "currency": "XRP",
                "issuer": ""
            },
            "source_slippage": "0",
            "destination_account": "rKB4oSXwPkRpb2sZRhgGyRfaEhhYS6tf4M",
            "destination_tag": "",
            "destination_amount": {
                "value": "1",
                "currency": "XRP",
                "issuer": ""
            },
            "invoice_id": "",
            "paths": "[]",
            "no_direct_ripple": false,
            "partial_payment": false,
            "direction": "outgoing",
            "state": "validated",
            "result": "tesSUCCESS",
            "ledger": "6141074",
            "hash": "85C5E6762DE7969DC1BD69B3C8C7387A5B8FCE6A416AA1F74C0ED5D10F08EADD",
            "timestamp": "2014-04-18T01:21:00.000Z",
            "fee": "0.000012",
            "source_balance_changes": [
                {
                    "value": "-1.000012",
                    "currency": "XRP",
                    "issuer": ""
                }
            ],
            "destination_balance_changes": [
                {
                    "value": "1",
                    "currency": "XRP",
                    "issuer": ""
                }
            ]
        }
    }
});

Request("Confirm Payment", {
    method: GET,
    path: "/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/payments/9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E",
    description: "Retrieve details of a payment and its status",
    link: "ripple-rest.html#confirming-a-payment"
});

Request("Get Payment History", {
    method: GET,
    path: "/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/payments",
    description: "Browse through the history of payments sent and received by an account",
    link: "ripple-rest.html#payment-history",
});

Request("Get Trustlines", {
    method: GET,
    path: "/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/trustlines?currency=USD",
    description: "Check the status of one or more trustlines attached to an account",
    link: "ripple-rest.html#reviewing-trustlines"
});

Request("Grant Trustline", {
    method: POST,
    path: "/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/trustlines",
    description: "Add or modify a trustline from this account",
    link: "ripple-rest.html#granting-a-trustline",
    body: {
        "secret": "sneThnzgBgxc3zXPG....",
        "trustline": {
            "limit": "110",
            "currency": "USD",
            "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "allows_rippling": false
        }
    }
});

Request("Check Notifications", {
    method: GET,
    path: "/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/notifications/9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E",
    description: "Browse through the history of payments sent and received by an account",
    link: "ripple-rest.html#checking-notifications"
});

Request("Check Connection", {
    method: GET,
    path: "/v1/server/connected",
    description: "Check whether the REST server is connected to a rippled server",
    link: "ripple-rest.html#check-connection-state"
});

Request("Get Server Status", {
    method: GET,
    path: "/v1/server",
    description: "Retrieve information about the current status of the Ripple-REST server and the rippled server it is connected to",
    link: "ripple-rest.html#get-server-status"
});

Request("Retrieve Ripple Transaction", {
    method: GET,
    path: "/v1/tx/85C5E6762DE7969DC1BD69B3C8C7387A5B8FCE6A416AA1F74C0ED5D10F08EADD",
    description: "Retrieve a raw Ripple transaction",
    link: "ripple-rest.html#retrieve-ripple-transaction"
});

Request("Generate UUID", {
    method: GET,
    path: "/v1/uuid",
    description: "Create a universally-unique identifier (UUID) to use as the client resource ID for a payment",
    link: "ripple-rest.html#create-client-resource-id"
});

//---------- End req. List ---------------------------//

var cm_request = CodeMirror(request_body.get(0), {
    mode: 'javascript',
    json: true,
    smartIndent: false
});

var cm_response = CodeMirror(response_body.get(0), {
    mode: 'javascript',
    json: true,
    smartIndent: false,
    readOnly: true
});

function update_method() {
    method = $(this).val();
    if (method == GET || method == DELETE) {
        request_body.hide();
    } else {
        request_body.show();
    }
}

function select_request(request) {
    command = requests[request];

    if (command.description) {
        $(description).html($('<a>')
            .attr('href', command.link)
            .html(command.description));
        $(description).show();
    } else {
        $(description).hide();
    }

    selected_command.html($('<a>')
                    .attr('href', command.link)
                    .text(command.name));
                                
    //rest_url.val(command.path);
    rest_url.text(command.path);

    rest_method.val(command.method);
    rest_method.change();
    
    if (command.method == POST || command.method == PUT) {
        cm_request.setValue(JSON.stringify(command.body, null, 2));
    } else {
        //No body, so wipe out the current contents.
        //This prevents confusion if the user toggles the HTTP method dropdown
        cm_request.setValue("");
    }
    
    reset_response_area();
};


function send_request() {
    var method = rest_method.val();
    if (method != GET && method != POST && method != PUT && method != DELETE) {
        console.log("ERROR: unrecognized http method");
        return;
    }
    //var path = rest_url.val();
    var path = rest_url.text();

    $(this).addClass('depressed');
    response_body.addClass('obscured');

    if (method == PUT || method == POST) {
        var body   = cm_request.getValue();
        $.ajax({
            type: method,
            url: URL_BASE + path,
            data: body
        }).done(set_output).fail(error_output);
    } else {
        $.ajax({
            type: method,
            url: URL_BASE + path
        }).done(success_output).fail(error_output).always(reset_sending_status);
    }
}

function error_output(xhr,status,statusText) {
    response_code.text(xhr.status+" "+xhr.statusText);
    cm_response.setValue(xhr.responseText);
}

function success_output(body,status,xhr) {
    response_code.text(xhr.status+" "+xhr.statusText);
    cm_response.setValue(JSON.stringify(body, null, 2));
}

function reset_sending_status() {
    response_body.removeClass('obscured');
    request_button.removeClass('depressed');
}

function reset_response_area() {
    cm_response.setValue("");
    response_code.text("");
}

$(document).ready(function() {
    request_button.click(send_request);
    rest_method.change(update_method);

    if (window.location.hash) {
      var cmd   = window.location.hash.slice(1).toLowerCase();
      var keys  = Object.keys(requests);
      var index = keys.indexOf(cmd);

      if (index === -1) return;

      var el = commands.eq(index);

      select_request(cmd);

      $(el).siblings().removeClass('selected');
      $(el).addClass('selected');
    } else {
      select_request('generate-account');
    }
});
