var commands = $("#command_list li");
var request_body = $("#request_body");
var request_button = $("#request_button");
var response_body = $("#response_body");
var response_code = $("#rest_responsecode");
var rest_url = $('#rest_url');
var rest_method = $("#rest_method");
var selected_command = $("#selected_command");
var spinner = $(".loader");
var reminders = $("#rest_url_wrapper .rest_reminders");
var test_warning = $("#test_warning");

var GET = "GET";
var POST = "POST";
var PUT = "PUT";
var DELETE = "DELETE";
var URL_BASE = "https://api.ripple.com:443";

var DOC_BASE = "ripple-rest.html";


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

var DEFAULT_ADDRESS_1 = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
var DEFAULT_ADDRESS_2 = "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX";
var DEFAULT_HASH = "9D591B18EDDD34F0B6CF4223A2940AEA2C3CC778925BABF289E0011CD8FA056E";

Request('Generate Account', {
    method: GET,
    path: "/v1/accounts/new",
    description: 'Generate the keys for a potential new account',
    link: '#generating-accounts'
});

Request('Get Account Balances', {
    method: GET,
    path: '/v1/accounts/{:address}/balances?{:query_params}',
    description: 'Retrieve the current balances for the given Ripple account',
    link: '#account-balances',
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "currency=USD"
    }
});

Request('Get Account Settings', {
    method: GET,
    path: '/v1/accounts/{:address}/settings',
    description: 'Retrieve the current settings for the given Ripple account',
    link: '#account-settings',
    params: {
        "{:address}": DEFAULT_ADDRESS_1
    }
});

Request('Update Account Settings', {
    method: POST,
    path: '/v1/accounts/{:address}/settings',
    description: 'Change the current settings for the given Ripple account.',
    link: '#updating-account-settings',
    test_only: true,
    params: {
        "{:address}": DEFAULT_ADDRESS_1
    },
    body: {
        secret: "sssssssssssssssssssssssssssss",
        settings: {
            require_destination_tag: false,
            require_authorization: false,
            disallow_xrp: false,
            disable_master: false,
            email_hash: "98b4375e1d753e5b91627516f6d70977"
        } 
    }
});

Request('Prepare Payment', {
    method: GET,
    path: '/v1/accounts/{:source_address}/payments/paths/{:destination_address}/{:amount}?{:query_params}',
    description: 'Change the current settings for the given Ripple account',
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
    path: '/v1/payments',
    description: 'Send a prepared payment to the network.',
    link: '#submitting-a-payment',
    test_only: true,
    body: {
      "secret": "sssssssssssssssssssssssssssss",
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
    }
});

Request("Confirm Payment", {
    method: GET,
    path: "/v1/accounts/{:address}/payments/{:hash}",
    description: "Retrieve details of a payment and its status",
    link: "#confirming-a-payment",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:hash}": DEFAULT_HASH
    }
});

Request("Get Payment History", {
    method: GET,
    path: "/v1/accounts/{:address}/payments?{:query_params}",
    description: "Browse through the history of payments sent and received by an account",
    link: "#payment-history",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "direction=incoming&exclude_failed=true"
    }
});

Request("Get Trustlines", {
    method: GET,
    path: "/v1/accounts/{:address}/trustlines?{:query_params}",
    description: "Check the status of one or more trustlines attached to an account",
    link: "#reviewing-trustlines",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:query_params}": "currency=USD&counterparty=ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
    }
});

Request("Grant Trustline", {
    method: POST,
    path: "/v1/accounts/{:address}/trustlines",
    description: "Add or modify a trustline from this account.",
    link: "#granting-a-trustline",
    test_only: true,
    params: {
        "{:address}": DEFAULT_ADDRESS_1
    },
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
    path: "/v1/accounts/{:address}/notifications/{:hash}",
    description: "Browse through the history of payments sent and received by an account",
    link: "#checking-notifications",
    params: {
        "{:address}": DEFAULT_ADDRESS_1,
        "{:hash}": DEFAULT_HASH
    }
});

Request("Check Connection", {
    method: GET,
    path: "/v1/server/connected",
    description: "Check whether the REST server is connected to a rippled server",
    link: "#check-connection-state"
});

Request("Get Server Status", {
    method: GET,
    path: "/v1/server",
    description: "Retrieve information about the current status of the Ripple-REST server and the rippled server it is connected to",
    link: "#get-server-status"
});

Request("Retrieve Ripple Transaction", {
    method: GET,
    path: "/v1/tx/{:hash}",
    description: "Retrieve a raw Ripple transaction",
    link: "#retrieve-ripple-transaction",
    params: {
        "{:hash}": DEFAULT_HASH
    }
});

Request("Generate UUID", {
    method: GET,
    path: "/v1/uuid",
    description: "Create a universally-unique identifier (UUID) to use as the client resource ID for a payment",
    link: "#create-client-resource-id"
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

function update_method(el) {
    if (el === undefined) {
        method = $(this).val();
    } else {
        method = $(el).val();
    }
    
    if (method == GET || method == DELETE) {
        request_body.hide();
    } else {
        request_body.show();
        cm_request.refresh();
    }
}

function change_path(command) {
    rest_url.empty();
    reminders.html("&nbsp;");
    
    var re = /(\{:[^}]+\})/g; // match stuff like {:address}
    params = command.path.split(re);
    
    //console.log(params);
    for (i=0; i<params.length; i++) {
        if (params[i].match(/\{:[^}]+\}/) !== null) {
            if (command.params === undefined || command.params[params[i]] === undefined) {
                var default_val = params[i];
            } else {
                var default_val = command.params[params[i]];
            }
            //rest_url.append("<span class='editable' contenteditable='true' id='resturl_"+params[i]+"'>"+default_val+"</span>");
            
            var new_div = $("<div>").appendTo(rest_url);
            var new_param = $("<input type='text' id='resturl_"+params[i]+"' value='"+default_val+"' class='editable' title='"+params[i]+"' />").appendTo(new_div);
            new_param.autosizeInput({"space": 0});
            //var new_label = $("<label class='reminder' for='resturl_"+params[i]+"'>"+params[i]+"</label>").appendTo(new_div);
            
            
        } else {
            rest_url.append("<span class='non_editable'>"+params[i]+"</span>");
        }
    }
}

function select_request(request) {
    command = requests[request];
    
    if (command.test_only === true) {
        test_warning.show();
    } else {
        test_warning.hide();
    }

    if (command.description) {
        $(description).html($('<a>')
            .attr('href', DOC_BASE+command.link)
            .html(command.description));
        $(description).show();
    } else {
        $(description).hide();
    }

    selected_command.html($('<a>')
                    .attr('href', DOC_BASE+command.link)
                    .text(command.name));
                                
    //rest_url.val(command.path);
    //rest_url.text(command.path);
    change_path(command);

    
//    rest_method.val(command.method);
//    rest_method.change();
    request_button.val(command.method);
    request_button.text(command.method+" request");
    update_method(request_button);
    
    if (command.method == POST || command.method == PUT) {
        cm_request.setValue(JSON.stringify(command.body, null, 2));
    } else {
        //No body, so wipe out the current contents.
        //This prevents confusion if the user toggles the HTTP method dropdown
        cm_request.setValue("");
    }
    
    reset_response_area();
};

//helper to fill the default payment with a new UUID
function get_uuid(callback) {
    $.get(URL_BASE + "/v1/uuid").done(callback);
}

function get_path() {
    s = "";
    rest_url.find(".non_editable, .editable").each(function() {
        if (this.tagName == "INPUT") {
            s += $(this).val();
        } else {
            s += $(this).text();
        }
    });
    return s;
}

function send_request() {
    //var method = rest_method.val();
    var method = request_button.val();
    if (method != GET && method != POST && method != PUT && method != DELETE) {
        console.log("ERROR: unrecognized http method");
        return;
    }
    //var path = rest_url.val();
    var path = get_path();

    $(this).addClass('depressed');
    response_body.addClass('obscured');

    if (method == PUT || method == POST) {
        var body   = cm_request.getValue();
        $.ajax({
            type: method,
            url: URL_BASE + path,
            data: body,
            contentType: 'application/json',
            processData: false
        }).done(success_output).fail(error_output).always(reset_sending_status);
    } else {
        $.ajax({
            type: method,
            url: URL_BASE + path
        }).done(success_output).fail(error_output).always(reset_sending_status);
    }
    
    spinner.show();
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
    spinner.hide();
}

function reset_response_area() {
    cm_response.setValue("");
    response_code.text("");
}

$(document).ready(function() {
    request_button.click(send_request);
    //rest_method.change(update_method);
    
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
