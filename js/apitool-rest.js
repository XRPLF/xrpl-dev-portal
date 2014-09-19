var commands = $("#command_list li");
var GET = "GET";
var POST = "POST";
var PUT = "PUT";
var DELETE = "DELETE";

var URL_BASE = "https://api.ripple.com:443";

//Build requests
var requests = { };

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

$(commands).click(function() {
    var cmd = slugify($(this).text().trim());

    if (!requests[cmd]) return;

    select_request(cmd, true);
    window.location.hash = cmd;

    $(this).siblings().removeClass('selected');
    $(this).addClass('selected');
});


function Request(name, obj) {
    obj.name = name;
    requests[slugify(name)] = obj;

    return obj;
};

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
    },
    description: 'Change the current settings for the given Ripple account',
    link: 'ripple-rest.html#updating-account-settings'
});

Request('Prepare Payment', {
    method: GET,
    path: '/v1/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/payments/paths/ra5nK24KXen9AHvsdFTKHSANinZseWnPcX/1+USD+rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
    description: 'Change the current settings for the given Ripple account',
    link: 'ripple-rest.html#preparing-a-payment'
});

//---------- End req. List ---------------------------//

var cm_request = CodeMirror($("#request_body").get(0), {
    mode: 'javascript',
    json: true,
    smartIndent: false
});

var cm_response = CodeMirror($("#response_body").get(0), {
    mode: 'javascript',
    json: true,
    smartIndent: false,
    readOnly: true
});

function update_method() {
    method = $(this).val();
    if (method == GET || method == DELETE) {
        $("#request_body").hide();
    } else {
        $("#request_body").show();
    }
}

function select_request(request) {
    command = requests[request];

    if (command.description) {
        $(description).html($('<a>').attr('href', command.link).html(command.description));
        $(description).show();
    } else {
        $(description).hide();
    }

    $('#selected_command').html($('<a>')
                                .attr('href', command.link)
                                .text(command.name));
                                
    //$('#rest_url').val(command.path);
    $('#rest_url').text(command.path);

    $("#rest_method").val(command.method);
    $("#rest_method").change();
    
    if (command.method == POST || command.method == PUT) {
        cm_request.setValue(JSON.stringify(command.body, null, 2));
    }
    
    //reset response area
    cm_response.setValue("");
    $("#rest_responsecode").text("");
};


function send_request() {
    var method = $("#rest_method").val();
    if (method != GET && method != POST && method != PUT && method != DELETE) {
        console.log("ERROR: unrecognized http method");
        return;
    }
    //var path = $("#rest_url").val();
    var path = $("#rest_url").text();

    $(this).addClass('depressed');
    $("#response_body").addClass('obscured');

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
        }).done(set_output).fail(error_output);
    }
}

function error_output(xhr,status,statusText) {
    $("#rest_responsecode").text(xhr.status+" "+xhr.statusText);
    cm_response.setValue(xhr.responseText);
    $("#response_body").removeClass('obscured');
}

function set_output(body,status,xhr) {
    $("#rest_responsecode").text(xhr.status+" "+xhr.statusText);
    cm_response.setValue(JSON.stringify(body, null, 2));
    $("#response_body").removeClass('obscured');
}



$(document).ready(function() {
    $("#request_button").click(send_request);
    $("#rest_method").change(update_method);

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
