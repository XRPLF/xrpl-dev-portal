var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

;(function() {
  var DOC_BASE = '';

  var request_button  = $('#request_button');
  var online_state    = $('#online_state');
  var command_list    = $('#command_list');
  var commands        = $(command_list).find('li');
  var command_table   = $('#command_table');
  var input           = $('#input');
  var description     = $(input).find('#description');
  var options         = $(input).find('#options');
  var output          = $('#output');
  var response        = $('#response');
  var request         = $('#request');
  var status          = $('#status');
  var info            = $('#info');
  var spinner = $(".loader");

  var BASE_HOST_DEFAULT = 's2.ripple.com';
  var BASE_PORT_DEFAULT = 443;

  var remote = new ripple.Remote({
    trusted:        true,
    local_signing:  true,
    local_fee:      false,
    servers: [
      {
        host:    BASE_HOST_DEFAULT,
        port:    BASE_PORT_DEFAULT,
        secure:  true
      }
    ]
  });

  function new_remote(options) {
    remote = new ripple.Remote(options);
  }

  function set_online_state(state) {
    var state = state.toLowerCase();
    $(online_state).removeClass();
    $(online_state).addClass(state);
    $(online_state).text(state);
  };

  remote.on('disconnect', function() {
    set_online_state('disconnected');
  });

  remote.on('connect', function() {
    var msg = "connected";
    if (remote._servers.length === 1) {
        msg = "connected to "+remote._servers[0].getHostID();
    } else if (remote._servers.length > 1) {
        msg = "connected to "+remote._servers.length+" servers";
    }
    set_online_state(msg);
  });

  /* ---- ---- ---- ---- ---- */

  //For tracking request IDs
  function id() { return id._c; };

  id._c = 2;

  id.reset = function() {
    id._c = remote._get_server()._id;
  };

  /* ---- ---- ---- ---- ---- */

  //Build requests
  var selected_request = { };
  var requests = { };

  $(commands).each(function(i, el) {
    requests[$(el).text()] = 0;
  });

  function Request(cmd, attrs) {
    var obj = {
      id:       void(0),
      name:     cmd,
      message:  { command:  cmd }
    }

    Object.keys(attrs || { }).forEach(function(k) {
      if (k[0] === '_') {
        obj[k] = attrs[k];
      } else {
        obj.message[k] = attrs[k];
      }
    });

    requests[cmd] = obj;

    return obj;
  };

  var sample_address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
  var sample_address_2 = 'ra5nK24KXen9AHvsdFTKHSANinZseWnPcX';
  var sample_tx = 'E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7';

  /* ---- ---- */

  Request('server_info', {
    _description: 'Get information about the state of the server for human consumption. Results are subject to change without notice.',
    _link: DOC_BASE + 'server_info.html'
  });

  Request('server_state', {
    _description: 'Get information about the state of the server for machine consumption.',
    _link: DOC_BASE + 'server_state.html'
  });

  Request('ping', {
    _description: 'Check connectivity to the server.',
    _link: DOC_BASE + 'ping.html'
  });

  /* ---- ---- */

  Request('subscribe', {
    accounts: [ ],
    streams: [ 'server', 'ledger' ],
    _description: 'Start receiving selected streams from the server.',
    _link: DOC_BASE + 'subscribe.html',
    _stream: true
  });

  Request('unsubscribe', {
    accounts: [ ],
    streams: [ 'server', 'ledger' ],
    _description: 'Stop receiving selected streams from the server.',
    _link: DOC_BASE + 'unsubscribe.html',
    _stream: true
  });

  /* ---- ---- */

  Request('ledger', {
    ledger_index:  void(0),
    ledger_hash:   void(0),
    full:          false,
    expand:        false,
    transactions:  true,
    accounts:      true,
    _description: 'Returns ledger information.',
    _link: DOC_BASE + 'ledger.html'
  });

  Request('ledger_entry', {
    type:          'account_root',
    account_root:  sample_address,
    ledger_index:   'validated',
    ledger_hash:  void(0),
    _description: 'Get a single node from the ledger',
    _link: DOC_BASE + 'ledger_entry.html'
  });

  Request('ledger_closed', {
    _description: 'Get the most recent closed ledger index.',
    _link: DOC_BASE + 'ledger_closed.html'
  });

  Request('ledger_current', {
    _description: 'Get the current in-progress ledger index.',
    _link: DOC_BASE + 'ledger_current.html'
  });

  /* ---- ---- */

  Request('account_info', {
    account: sample_address,
    _description: 'Get information about the specified account.',
    _link: DOC_BASE + 'account_info.html'
  });

  Request('account_lines', {
    account:        sample_address,
    account_index:  void(0),
    ledger:         'current',
    _description: "Get a list of trust lines connected to an account.",
    _link: DOC_BASE + 'account_lines.html'
  });

  Request('account_offers', {
    account:        sample_address,
    account_index:  void(0),
    ledger:         'current',
    _description: 'Get a list of offers created by an account.',
    _link: DOC_BASE + 'account_offers.html'
  });

  Request('account_tx', {
    account:           sample_address,
    ledger_index_min:  -1,
    ledger_index_max:  -1,
    binary:            false,
    count:             false,
    limit:             10,
    forward:           false,
    marker:            void(0),
    _description: 'Get a list of transactions that applied to a specified account.',
    _link: DOC_BASE + 'account_tx.html'
  });

  Request('account_currencies', {
    account:           sample_address,
    strict:            true,
    ledger_index:      "validated",
    account_index:     0,
    _description: 'Returns a list of currencies the account can send or receive.',
    _link: DOC_BASE + 'account_currencies.html'
  });

  Request('gateway_balances', {
    account:           sample_address,
    strict:            true,
    hotwallet:         [],
    ledger_index:      "validated",
    account_index:     0,
    _description: 'Returns a list of currencies the account can send or receive.',
    _link: DOC_BASE + 'gateway_balances.html'
  });

  /* ---- ---- */

  Request('transaction_entry', {
    tx_hash:       sample_tx,
    ledger_index:  348734,
    ledger_hash:   void(0),
    _description: 'Get information about a specified transaction.',
    _link: DOC_BASE + 'transaction_entry.html'
  });

  Request('tx', {
    transaction: sample_tx,
    _description: 'Returns information about a specified transaction.',
    _link: DOC_BASE + 'tx.html'
  });

  Request('tx_history', {
    start: 10,
    _description: 'Returns the last N transactions starting from start index, in descending order, by ledger sequence number. Server sets N.',
    _link: DOC_BASE + 'tx_history.html'
  });

  Request('book_offers', {
    ledger_hash: void(0),
    ledger_index: void(0),
    taker: sample_address,
    taker_gets: {
      currency: 'XRP'
    },
    taker_pays: {
      currency: 'USD',
      issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
    },
    limit: 10,
    _description: 'Returns a snapshot of the offers for an order book.',
    _link: DOC_BASE + 'book_offers.html'
  });

  Request('path_find', {
    subcommand: 'create',
    source_account: sample_address,
    destination_account: sample_address_2,
    destination_amount: {
        "currency": "USD",
        "value": "0.01",
        "issuer": sample_address_2
    },
    _description: 'Start or stop searching for payment paths between specified accounts.',
    _link: DOC_BASE + 'path_find.html',
    _stream: true
  });

  Request('ripple_path_find', {
    ledger_hash : void(0),
    ledger_index : void(0),
    source_account : sample_address,
    source_currencies : [ { currency : 'USD' } ],
    destination_account : sample_address_2,
    destination_amount : {
        "currency": "USD",
        "value": "0.01",
        "issuer": sample_address_2
    },
    _description: 'Find a path between specified accounts once. For repeated usage, call <strong>path_find</strong> instead.',
    _link: DOC_BASE + 'ripple_path_find.html'
  });

  Request('submit', {
    secret: 'sn3nxiW7v8KXzPzAqzyHXbSSKNuN9',
    tx_json: {
      Flags: 0,
      TransactionType: 'AccountSet',
      Account: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Sequence: void(0),
      Fee: '10000',
      Flags: 0
    },
    _description: 'Submits a transaction to the network.',
    _link: DOC_BASE + 'submit.html',
    _takes_secret: true
  });

  Request('sign', {
  tx_json : {
      "TransactionType" : "Payment",
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Amount" : {
         "currency" : "USD",
         "value" : "1",
         "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      }
   },
   secret : "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
   offline: false,
   fee_mult_max: 1000,
   _description: 'Sends a transaction to be signed by the server.',
   _link: DOC_BASE + 'sign.html',
    _takes_secret: true
});

  /* ---- ---- ---- ---- ---- */

  function rewrite_obj(obj) {
    if (typeof obj === 'string') {
      var obj = JSON.parse(obj);
    }

    var rewrite = { };
    if (obj.id) rewrite.id = obj.id;
    if (obj.command) rewrite.command = obj.command;
    if (obj.status) rewrite.status = obj.status;
    if (obj.type) rewrite.type = obj.type;

    Object.keys(obj).forEach(function(k) {
      if (!rewrite.hasOwnProperty(k)) {
        rewrite[k] = obj[k];
      }
    });

    return rewrite;
  };

  var cm_request = CodeMirror(request.get(0), {
    mode: 'javascript',
    json: true,
    smartIndent: false
  });

  var cm_response = CodeMirror(response.get(0), {
    mode: 'javascript',
    json: true,
    smartIndent: false,
    readOnly: true
  });

  function set_input(command) {
    var message = command.message;

    if (command._description) {
      //$(description).html(command._description).show();
      $(description).html(command._description);
      $(description).append(" <a class='button btn btn-primary' href='"+command._link+"'>Read more</a>");
    } else {
      $(description).hide();
    }

    $('#selected_command').html($('<a>')
                                .attr('href', command._link)
                                .text(command.name));

    cm_request.setValue(JSON.stringify(message, null, 2));
  };

  var STREAM_PAUSED = false;
  var STREAM_SHOWN  = false;
  var WAITING       = false;
  var events = [ ];

  function set_output(message) {
    var parsed = rewrite_obj(message);
    var is_response = (parsed.type === 'response');

    if (is_response && parsed.id === id._c) {
      if (!WAITING) return;
      else WAITING = false;
      spinner.hide();

      var request_header = '<span class="request_name">'
      + selected_request.name;
      + '</span>';

      var timestamp = '<span class="timestamp">'
      + (Date.now() - selected_request.t) + 'ms'
      + '</span>';

      $(request_button).removeClass('depressed');

      $(info).html(request_header + timestamp);

      $(response).removeClass()
      $(response).addClass(parsed.error ? 'error' : 'success');

      cm_response.setValue(JSON.stringify(parsed, null, 2));

      ++id._c;
    } else if (!is_response && !STREAM_PAUSED) {
      var el = $('<div class="status">').get(0);

      $(status).prepend(el);

      CodeMirror(el, {
        value:        JSON.stringify(parsed, null, 2),
        mode:         'javascript',
        json:         true,
        smartIndent:  false,
        readOnly:     true
      });

      events.unshift(parsed);
    }
  };

  function select_request(request) {
    selected_request = requests[request];
    selected_request.message.id = id();
    selected_request.message = rewrite_obj(selected_request.message);
    set_input(selected_request);

    //Remove sign button & sequence number lookup

//    if (selected_request.name !== 'submit') {
//      $('#sign_button').hide();
//      return;
//    }

    if (selected_request._takes_secret === true) {
        $("#test_warning").show();
    } else {
        $("#test_warning").hide();
    }

    if (selected_request._stream === true) {
        $("#stream_output").show();
    } else {
        $("#stream_output").hide();
    }

    if (!remote._connected) {
      remote.once('connected', function() {
        select_request(request);
      });
      return;
    }

//    $('#sign_button').show();

//    var tx_json = selected_request.message.tx_json;

//    if (ripple.UInt160.is_valid(tx_json.Account)) {
//      selected_request.message.id = id._c;
//      remote.request_account_info(tx_json.Account, function(err, info) {
//        id.reset();
//        tx_json.Sequence = info.account_data.Sequence;
//        set_input(selected_request);
//      });
//    }
  };

  /* ---- ---- ---- ---- ---- */

  $(commands).click(function() {
    var cmd = $(this).text().trim();

    if (!requests[cmd]) return;

    select_request(cmd, true);
    window.location.hash = cmd;

    $(this).siblings().removeClass('selected');
    $(this).addClass('selected');
  });

  var previous_key = void(0);

  $(window).keydown(function(e) {
    if (e.which === 13 && previous_key === 17) {
      //ctrl + enter
      e.preventDefault();
      e.stopPropagation();
      $(request_button).click();
    }
    previous_key = e.which;
  });

  /* ---- ---- ---- ---- ---- */

  function prepare_request(request) {

    var isArray = Array.isArray(request);
    var result  = isArray ? [ ] : { };

    Object.keys(request).forEach(function(k) {
      var v = request[k];
      switch (typeof v) {
        case 'undefined': break;
        case 'object':
          result[k] = prepare_request(v);
          break;
        default:
          result[k] = v;
          break
      }
    });

    if (isArray) {
      result = result.filter(function(el) {
        return el !== null && typeof el !== 'undefined'
      });
    }

    var empty = isArray && result.length === 0;

    return empty ? void(0) : result;
  };

  $('#stream_show').click(function() {
    if ($(status).is(':visible')) {
      $(status).hide();
      $(status).empty();
      $(this).text('show');
      STREAM_SHOWN = false;
    } else {
      $(this).text('hide');
      $(status).show();
      STREAM_SHOWN = true;

      events.forEach(function(event) {
        var el = $('<div class="json status">')[0];
        $(status).append(el);
        CodeMirror(el, {
          value: JSON.stringify(event, null, 2),
          mode: 'javascript',
          json: true
        });
      });
    }
  });

  $('#stream_pause').click(function() {
    if ($(this).hasClass('paused')) {
      $(this).removeClass('paused');
      $(this).text('pause');
      $(status).removeClass('obscured');
      STREAM_PAUSED = false;
    } else {
      $(this).addClass('paused');
      $(this).text('unpause');
      $(status).addClass('obscured');
      STREAM_PAUSED = true;
    };
  });

//stop opening all links in new tabs
//  $(document.body).delegate('a', 'click', function(e) {
//    e.preventDefault();
//    e.stopPropagation();
//    window.open($(this).attr('href'));
//  });

  var tooltip = $('#tooltip');
  var mousedown = false;

  $(window).mousedown(function() { mousedown = true; });
  $(window).mouseup(function() { mousedown = false; });

//get rid of sign button
//  $('#sign_button').click(function() {
//    if (selected_request._signed) return;
//
//    var self = this;
//    var message = cm_request.getValue();
//
//    try {
//      message = JSON.parse(message);
//    } catch(e) {
//      alert('Invalid JSON');
//      return;
//    }
//
//    var tx_json = message.tx_json;
//
//    if (!ripple.UInt160.is_valid(tx_json.Account)) {
//      alert('Account is invalid');
//      return;
//    }
//
//    if (!message.secret) {
//      alert('Transacting account must have specified secret');
//      return;
//    }
//
//    $(this).addClass('depressed');
//
//    remote.account(tx_json.Account).get_next_sequence(function(e, s) {
//      id.reset();
//      tx_json.Sequence = s;
//
//      try {
//        var tx = remote.transaction();
//        tx.tx_json = tx_json;
//        tx._secret = message.secret;
//        tx.complete();
//        tx.sign();
//      } catch(e) {
//        alert('Unable to sign transaction ' + e.message);
//        $(self).removeClass('depressed');
//        return;
//      }
//
//      message.tx_blob = tx.serialize().to_hex();
//
//      delete message.secret;
//      delete message.tx_json;
//
//      selected_request.message = message;
//      selected_request._signed = true;
//
//      set_input(selected_request);
//
//      $(self).removeClass('depressed');
//    });
//  });

  function send_request() {
    var request = remote.request_server_info();
    var value   = cm_request.getValue();

    try {
      var message = JSON.parse(value);
    } catch(e) {
      alert('Invalid request JSON');
      return;
    }

    $(this).addClass('depressed');
    $(response).addClass('obscured');

    WAITING                  = true;
    selected_request.message = message;
    selected_request.t       = Date.now();
    spinner.show();

    request.message = prepare_request(message);
    request.request();
  };

  function init() {
    id._c = remote._get_server()._id;
    remote._get_server().on('message', set_output);
    $(request_button).click(send_request);
  };

  $(function() {
    set_online_state('connecting');

    if (urlParams["base_url"]) {
        base_url = urlParams["base_url"].split(":");
        if (base_url.length == 2) {
            base_host = base_url[0];
            base_port = base_url[1];
        } else {
            base_host = base_url[0];
            base_port = BASE_PORT_DEFAULT;
        }

        if (urlParams["use_wss"]
            && urlParams["use_wss"].toLowerCase() === "false") {
            use_wss = false;
        } else {
            use_wss = true;
        }

        new_remote({
            trusted:        true,
            local_signing:  true,
            local_fee:      false,
            servers: [
              {
                host:    base_host,
                port:    base_port,
                secure:  use_wss
              }
            ]
        });
    }

    remote.connect(init);

    if (window.location.hash) {
      var cmd   = window.location.hash.slice(1).toLowerCase();
      var keys  = Object.keys(requests);
      var index = keys.indexOf(cmd);

      if (index === -1) return;

      var el = $(commands).eq(index);

      select_request(cmd);
      window.cmd = cmd;

      $(el).siblings().removeClass('selected');
      $(el).addClass('selected');
    } else {
      select_request('server_info');
    }
  });

})();
