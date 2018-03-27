jQuery(function ($) {
  var reTxId = /^[0-9A-Fa-f]{64}$/,
      reLedgerSeq = /^[0-9]+$/;

  var txOffset = 0,
      txCount = 0,
      currentTarget = null;

  var remote = ripple.Remote.from_config({
    "trace" : true,
    "websocket_ip" : "s2.ripple.com",
    "websocket_port" : 443,
    "websocket_ssl" : true
  });
  remote.connect();

  remote.once('connected', function () {
    var target = location.hash.slice(1);
    if (ripple.UInt160.from_json(target).is_valid() ||
        reTxId.exec(target) ||
        reLedgerSeq.exec(target)) {
      $('#target').val(target);
      fetchTarget(target);
    }
  });

  $('#account-entry').submit(function (e) {
    e.preventDefault();

    var target = $('#target').val();

    fetchTarget(target);
  });

  function fetchTarget(target)
  {
    if (!remote.state === "online") return;

    // Reset
    $("#links").show();
    $("#result").show();
    $("#result > .group").hide();
    $("#error").hide();
    $("#progress").show();
    $(".json").html("");
    $("#datalink").parent().removeClass("disabled");
    $(".account-tx-more").parent().hide();
    $(".account-tx-back").parent().hide();
    txOffset = 0;

    currentTarget = target;

    var locationWithoutHash = location.protocol+'//'+location.hostname+(location.port?":"+location.port:"")+location.pathname+(location.search?location.search:"");
    $("#permalink").attr("href", locationWithoutHash + "#" + target);
    $("#graphlink").attr("href", "https://www.ripplecharts.com/#/graph/" + target);

    if (ripple.UInt160.from_json(target).is_valid()) {
      // Account
      var account = target;

      $("#result > .group-account").show();

      $("#progress .bar").css("width", "10%");
      $("#datalink").attr("href", null).parent().addClass("disabled");

      async.waterfall([
        function (callback) {
          remote.request_account_info({account:account})
            .on('success', function (result) {
              $("#progress .bar").css("width", "20%");
              console.log('account_info', result);
              format(result, $("#account_info"));
              callback();
            })
            .on('error', callback)
            .request();
        },
        function (callback) {
          remote.request_account_lines({account:account})
            .on('success', function (result) {
              $("#progress .bar").css("width", "40%");
              console.log('account_lines', result);
              format(result, $("#account_lines"));
              callback();
            })
            .on('error', callback)
            .request();
        },
        function (callback) {
          requestTx(account, function (err) {
            if (err) return callback(err);
            $("#progress .bar").css("width", "60%");
            callback();
          });
        },
        function (callback) {
          remote.request_account_offers({account:account})
            .on('success', function (result) {
              $("#progress .bar").css("width", "80%");
              console.log('account_offers', result);
              format(result, $("#account_offers"));
              callback();
            })
            .on('error', callback)
            .request();
        }
      ], function (err) {
        if (err) handleError(err);
        $("#progress .bar").css("width", "100%");
        $("#progress").fadeOut();
      });
    } else if (reLedgerSeq.exec(target)) {
      $("#result > .group-ledger").show();

      // Ledger
      $("#progress .bar").css("width", "10%");
      remote.request_ledger(undefined, { transactions: true, expand: true })
        .ledger_index(+target)
        .on('success', function (result) {
          $("#progress .bar").css("width", "100%");
          $("#progress").fadeOut();
          console.log('ledger', result.ledger);
          format(result.ledger, $("#ledger_info"));
        })
        .on('error', function (err) {
          console.log(err);
          handleError(err);
          $("#progress .bar").css("width", "100%");
          $("#progress").fadeOut();
        })
        .request();
    } else if (reTxId.exec(target)) {
      $("#result > .group-tx").show();

      $("#datalink").attr("href", "https://ripple.com/client/#/tx/?id=" + target);

      // Transaction
      $("#progress .bar").css("width", "10%");
      remote.requestTransaction({"hash": target, "binary": false})
        .on('success', function (result) {
          $("#progress .bar").css("width", "100%");
          $("#progress").fadeOut();
          console.log('tx', result);
          format(result, $("#tx_info"));
        })
        .on('error', function (err) {
          handleError(err);
          $("#progress .bar").css("width", "100%");
          $("#progress").fadeOut();
        })
        .request();
    } else {
      // Unknown/Invalid
      $("#links").hide();
      $("#progress").hide();
      handleError("Input is not a valid address or transaction hash");
    }
  }

  $('.tx-expand').click(function () {
    $("#tx_info .expanded").removeClass("expanded");
    $("#tx_info").find("ul > li").addClass("expanded");
  });

  $('.tx-collapse').click(function () {
    $("#tx_info .expanded").removeClass("expanded");
  });

  $('.account-lines-expand').click(function () {
    $("#account_lines .expanded").removeClass("expanded");
    $("#account_lines").find("ul > li").addClass("expanded");
  });

  $('.account-lines-collapse').click(function () {
    $("#account_lines .expanded").removeClass("expanded");
  });

  $('.account-tx-expand-tx').click(function () {
    $("#account_tx .expanded").removeClass("expanded");
    $("#account_tx").find("> ul > li").addClass("expanded").find("> ul > li").addClass("expanded").find("> ul > li span.name:contains(tx)").parent().addClass("expanded");
  });

  $('.account-tx-expand').click(function () {
    $("#account_tx .expanded").removeClass("expanded");
    $("#account_tx").find("ul > li").addClass("expanded");
  });

  $('.account-tx-collapse').click(function () {
    $("#account_tx .expanded").removeClass("expanded");
  });

  $('.account-tx-more').click(function () {
    $(".account-tx-back").parent().show();
    txOffset += 20;
    $("#account_tx").text("... loading ...");
    requestTx(currentTarget, function (err) {});
    updateTxOffsetNav();
  });

  $('.account-tx-back').click(function () {
    txOffset -= 20;
    $("#account_tx").text("... loading ...");
    requestTx(currentTarget, function (err) {});
    updateTxOffsetNav();
  });

  $('.account-offers-expand').click(function () {
    $("#account_offers .expanded").removeClass("expanded");
    $("#account_offers").find("ul > li").addClass("expanded");
  });

  $('.account-offers-collapse').click(function () {
    $("#account_offers .expanded").removeClass("expanded");
  });

  $('.ledger-expand-tx').click(function () {
    $("#ledger_info .expanded").removeClass("expanded");
    $("#ledger_info").find("> ul > li").addClass("expanded").find("> ul > li").addClass("expanded").find("> ul > li span.name:contains(tx)").parent().addClass("expanded");
  });

  $('.ledger-expand').click(function () {
    $("#ledger_info .expanded").removeClass("expanded");
    $("#ledger_info").find("ul > li").addClass("expanded");
  });

  $('.ledger-collapse').click(function () {
    $("#ledger_info .expanded").removeClass("expanded");
  });

  $('pre.json').delegate(".toggle", "click", function (evt) {
    console.log(this);
    $(this).parent().toggleClass("expanded");
  });

  function handleError(err) {
    console.error(err);
    if ("string" === typeof err) {
      $("#error").show().text(err);
    } else if ("object" === typeof err) {
      if (err.error === "remoteError" &&
          "object" === typeof err.remote)
      {
        err = err.remote;
      }

      if (err.error_message) {
        $("#error").show().text(err.error_message);
      } else if (err.error) {
        $("#error").show().text(err.error);
      } else {
        $("#error").show().text(err.toString());
      }
    }
  }

  function requestTx(account, callback) {
    remote.request_account_tx({
      'account': account,
      'ledger_index_min': -1,
      'descending': true,
      'limit': 20,
      'offset' : txOffset,
      'count': true,
      'binary': false
    })
      .on('success', function (result) {
        txCount = result.count;
        console.log('account_tx', result);
        format(result, $("#account_tx").empty());
        callback();
        updateTxOffsetNav();
      })
      .on('error', callback)
      .request();
  }

  function updateTxOffsetNav()
  {
    $(".account-tx-back").parent().hide();
    $(".account-tx-more").parent().hide();

    if (txOffset > 0)
      $(".account-tx-back").parent().show();

    if (txCount > (txOffset + 20))
      $(".account-tx-more").parent().show();
  }

  String.prototype.repeat = function(times) {
    return (new Array(times + 1)).join(this);
  };

  function format(v, ct, depth) {
    depth = depth || 0;

    switch (typeof v) {
    case "object":
      var el, sub = null, count;
      if (Array.isArray(v)) {
        ct.append("[");
        count = v.length;
        for (var i = 0; i < count; i++) {
          if (!sub) {
            $('<a class="toggle"></a>').appendTo(ct);
            $('<span class="ellipsis"></span>')
              .text(getEllipText(count)).appendTo(ct);
            el = $("<ul></ul>");
          } else sub.append(",");
          sub = $("<li></li>").addClass("type-" + typeof v[i]);
          sub.append("\u00A0".repeat(2 + depth*2));
          format(v[i], sub, depth + 1);
          sub.appendTo(el);
        }
        if (el) {
          el.appendTo(ct);
          $('<span class="indentafter"></span>').text("\u00A0".repeat(depth*2)).appendTo(ct);
        }
        ct.append("]");
      } else {
        ct.append("{");
        count = Object.keys(v).length;
        for (var i in v) {
          if (!sub) {
            $('<a class="toggle"></a>').appendTo(ct);
            $('<span class="ellipsis"></span>')
              .text(getEllipText(Object.keys(v))).appendTo(ct);
            el = $("<ul></ul>");
          } else sub.append(",");
          sub = $("<li></li>").addClass("type-" + typeof v[i]);
          sub.append("\u00A0".repeat(2 + depth*2));
          $("<span></span>").addClass('name').text(i).appendTo(sub);
          $("<span></span>").addClass('sep').text(" : ").appendTo(sub);
          format(v[i], sub, depth + 1);
          sub.appendTo(el);
        }
        if (el) {
          el.appendTo(ct);
          $('<span class="indentafter"></span>').text("\u00A0".repeat(depth*2)).appendTo(ct);
        }
        ct.append("}");
      }
      break;
    case "string":
      $("<span></span>").addClass('val').text('"'+v+'"').appendTo(ct);
      break;
    case "number":
      $("<span></span>").addClass('val').text(""+v).appendTo(ct);
      break;
    case "boolean":
      $("<span></span>").addClass('val').text(v ? "true" : "false").appendTo(ct);
      break;
    }
  }
  function getEllipText(count) {
    var label = "...";
    if (Array.isArray(count)) {
      label = "";
      while (label.length < 15) {
        if (!count.length) break;
        if (label.length) label += ", ";
        label += count.shift();
      }
      if (count.length) label += ", ...";
    } else if ("number" === typeof count) {
      label = "" + count + " items";
    }
    return "\u00A0/* "+label+" */\u00A0";
  }
});
