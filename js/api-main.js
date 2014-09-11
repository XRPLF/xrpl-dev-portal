
;(function() {

  var request_button  = $('#request_button');
  var online_state    = $('#online_state');
  var command_wrapper = $('#command_wrapper');
  var command_list    = $(command_wrapper).find('#command_list');
  var commands        = $(command_list).find('li');
  var command_table   = $(command_wrapper).find('#command_table');
  var input           = $(command_wrapper).find('#input');
  var description     = $(input).find('#description');
  var options         = $(input).find('#options');
  var output          = $(command_wrapper).find('#output');
  var response        = $(command_wrapper).find('#response');
  var request         = $(command_wrapper).find('#request');
  var status          = $(command_wrapper).find('#status');
  var info            = $(command_wrapper).find('#info');

  var remote = new ripple.Remote({
    trusted:        true,
    local_signing:  true,
    local_fee:      false,
    servers: [
      {
        host:    's1.ripple.com',
        port:    443,
        secure:  true
      }
    ]
  });

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
    set_online_state('connected');
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
  var sample_tx = 'E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7';

  /* ---- ---- */

  Request('server_info', {
    _description: 'Returns information about the state of the server for human consumption. Results are subject to change without notice.',
    _link: 'https://ripple.com/wiki/JSON_Messages#server_info'
  });

  Request('server_state', {
    _description: 'Returns information about the state of the server for machine consumption.',
    _link: 'https://ripple.com/wiki/JSON_Messages#server_state'
  });

  Request('ping', {
    _description: 'This command is used to check connectivity for clients. Websocket clients can use this to determine turn around time and actively discover loss of connectivity to a server.',
    _link: 'https://ripple.com/wiki/JSON_Messages#ping'
  });

  /* ---- ---- */

  Request('subscribe', {
    accounts: [ ],
    streams: [ 'server', 'ledger' ],
    _description: 'Start receiving selected streams from the server.',
    _link: 'https://ripple.com/wiki/JSON_Messages#subscribe'
  });

  Request('unsubscribe', {
    accounts: [ ],
    streams: [ 'server', 'ledger' ],
    _description: 'Stop receiving selected streams from the server.',
    _link: 'https://ripple.com/wiki/JSON_Messages#unsubscribe'
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
    _link: 'https://ripple.com/wiki/JSON_Messages#ledger'
  });

  Request('ledger_entry', {
    type:          'account_root',
    account_root:  sample_address,
    ledger_hash:   'validated',
    ledger_index:  void(0),
    _description: 'Returns a ledger entry. For untrusted servers, the index option provides raw access to ledger entries and proof.',
    _link: 'https://ripple.com/wiki/JSON_Messages#ledger_entry'
  });

  Request('ledger_closed', {
    _description: 'Returns the most recent closed ledger index. If a validation list has been provided, then validations should be available.',
    _link: 'https://ripple.com/wiki/JSON_Messages#ledger_closed'
  });

  Request('ledger_current', {
    _description: 'Returns the current proposed ledger index. Proof is not possible for the current ledger. This command is primarily useful for testing.',
    _link: 'https://ripple.com/wiki/JSON_Messages#ledger_current'
  });

  /* ---- ---- */

  Request('account_info', {
    account: sample_address,
    _description: 'Returns information about the specified account.',
    _link: 'https://ripple.com/wiki/JSON_Messages#account_info'
  });

  Request('account_lines', {
    account:        sample_address,
    account_index:  void(0),
    ledger:         'current',
    _description: 'Returns information about the ripple credit lines for the specified account.',
    _link: 'https://ripple.com/wiki/JSON_Messages#account_lines'
  });

  Request('account_offers', {
    account:        sample_address,
    account_index:  void(0),
    ledger:         'current',
    _description: 'Returns the outstanding offers for a specified account.',
    _link: 'https://ripple.com/wiki/JSON_Messages#account_offers'
  });

  Request('account_tx', {
    account:           sample_address,
    ledger_index_min:  -1,
    ledger_index_max:  -1,
    binary:            false,
    count:             false,
    descending:        false,
    offset:            0,
    limit:             10,
    forward:           false,
    marker:            void(0),
    _description: 'Returns a list of transactions that applied to a specified account.',
    _link: 'https://ripple.com/wiki/JSON_Messages#account_tx'
  });

  /* ---- ---- */

  Request('transaction_entry', {
    tx_hash:       sample_tx,
    ledger_index:  348734,
    ledger_hash:   void(0),
    _description: 'Returns information about a specified transaction.',
    _link: 'https://ripple.com/wiki/JSON_Messages#transaction_entry'
  });

  Request('tx', {
    transaction: sample_tx,
    _description: 'Returns information about a specified transaction.',
    _link: 'https://ripple.com/wiki/JSON_Messages#tx'
  });

  Request('tx_history', {
    start: 10,
    _description: 'Returns the last N transactions starting from start index, in descending order, by ledger sequence number. Server sets N.',
    _link: 'https://ripple.com/wiki/JSON_Messages#tx_history'
  });

  Request('book_offers', {
    ledger_hash: void(0),
    ledger_index: void(0),
    taker: sample_address,
    taker_gets: ripple.Amount.from_json('1/EUR/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B').to_json(),
    taker_pays: ripple.Amount.from_json('1/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B').to_json(),
    _description: 'Returns the offers for an order book as one or more pages.',
    _link: 'https://ripple.com/wiki/JSON_Messages#book_offers'
  });

  Request('path_find', {
    subcommand: 'create',
    source_account: sample_address,
    destination_account: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
    destination_amount: ripple.Amount.from_json('0.001/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B').to_json(),
    _description: 'Find or modify a payment pathway between specified accounts.',
    _link: 'https://ripple.com/wiki/JSON_Messages#path_find'
  });

  Request('ripple_path_find', {
    ledger_hash : void(0),
    ledger_index : void(0),
    source_account : sample_address,
    source_currencies : [ { currency : 'USD' } ],
    destination_account : 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
    destination_amount : ripple.Amount.from_json('0.001/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B').to_json(),
    _description: 'Find a path and estimated costs.For non-interactive use, such as automated payment sending from business integrations, ripple_path_find gives you single response that you can use immediately. However, for uses that need updated paths as new ledgers close, repeated calls becomes expensive. In those cases, when possible, use the RPC path_find in place of this API.',
    _link: 'https://ripple.com/wiki/JSON_Messages#ripple_path_find'
  });

  Request('submit', {
    secret: '',
    tx_json: {
      Flags: 0,
      TransactionType: 'AccountSet',
      Account: '',
      Sequence: void(0),
      Fee: '15',
      Flags: 0
    },
    _description: 'Submits a transaction to the network.',
    _link: 'https://ripple.com/wiki/JSON_Messages#submit'
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
      $(description).text(command._description).show();
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

    if (selected_request.name !== 'submit') {
      $('#sign_button').hide();
      return;
    }

    if (!remote._connected) {
      remote.once('connected', function() {
        select_request(request);
      });
      return;
    }

    $('#sign_button').show();

    var tx_json = selected_request.message.tx_json;

    if (ripple.UInt160.is_valid(tx_json.Account)) {
      selected_request.message.id = id._c;
      remote.request_account_info(tx_json.Account, function(err, info) {
        id.reset();
        tx_json.Sequence = info.account_data.Sequence;
        set_input(selected_request);
      });
    }
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

  $(document.body).delegate('a', 'click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.open($(this).attr('href'));
  });

  var tooltip = $('#tooltip');
  var mousedown = false;

  $(window).mousedown(function() { mousedown = true; });
  $(window).mouseup(function() { mousedown = false; });

  $('#sign_button').click(function() {
    if (selected_request._signed) return;

    var self = this;
    var message = cm_request.getValue();

    try {
      message = JSON.parse(message);
    } catch(e) {
      alert('Invalid JSON');
      return;
    }

    var tx_json = message.tx_json;

    if (!ripple.UInt160.is_valid(tx_json.Account)) {
      alert('Account is invalid');
      return;
    }

    if (!message.secret) {
      alert('Transacting account must have specified secret');
      return;
    }

    $(this).addClass('depressed');

    remote.account(tx_json.Account).get_next_sequence(function(e, s) {
      id.reset();
      tx_json.Sequence = s;

      try {
        var tx = remote.transaction();
        tx.tx_json = tx_json;
        tx._secret = message.secret;
        tx.complete();
        tx.sign();
      } catch(e) {
        alert('Unable to sign transaction ' + e.message);
        $(self).removeClass('depressed');
        return;
      }

      message.tx_blob = tx.serialize().to_hex();

      delete message.secret;
      delete message.tx_json;

      selected_request.message = message;
      selected_request._signed = true;

      set_input(selected_request);

      $(self).removeClass('depressed');
    });
  });

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
