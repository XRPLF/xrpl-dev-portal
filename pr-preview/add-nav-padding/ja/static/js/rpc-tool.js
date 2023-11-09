jQuery(function ($) {
  const FULL_HISTORY_SERVER = "wss://s2.ripple.com"
  const reTxId = /^[0-9A-Fa-f]{64}$/
  const reLedgerSeq = /^[0-9]+$/
  let currentTarget = null
  let previousMarkers = []
  let currentMarker
  let nextMarker

  const api = new xrpl.Client(FULL_HISTORY_SERVER)


  api.on('connected', () => {
    const target = location.hash.slice(1);
    if (xrpl.isValidAddress(target) ||
        reTxId.exec(target) ||
        reLedgerSeq.exec(target)) {
      $('#target').val(target);
      fetchTarget(target);
    }
  })
  api.on('disconnected', (code) => console.warn("disconnected", code));
  api.connect();


  $('#account-entry').submit(function (e) {
    e.preventDefault()
    fetchTarget( $('#target').val() )
  })

  async function fetchTarget(target)
  {
    if (!api.isConnected()) return;

    // Reset
    $("#links").show();
    $("#result").show();
    $("#result > .group").hide();
    $("#error").hide();
    $("#progress").show();
    $(".json").html("");
    $(".account-tx-more").parent().hide();
    $(".account-tx-back").parent().hide();

    currentTarget = target;

    let locationWithoutHash = location.protocol+'//'+location.hostname+(location.port?":"+location.port:"")+location.pathname+(location.search?location.search:"");
    $("#permalink").attr("href", locationWithoutHash + "#" + target);
    $("#explorerlink").attr("href", ""); // Reset

    if (xrpl.isValidAddress(target)) { // Account ------------------------------
      let account = target;
      previousMarkers = []
      nextMarker = undefined
      currentMarker = undefined
      $("#explorerlink").attr("href", `https://livenet.xrpl.org/accounts/${account}`)

      $("#result > .group-account").show();

      $("#progress .progress-bar").css("width", "10%");

      try {
        let command = "account_info"
        let result = await api.request({command, account})
        $("#progress .progress-bar").css("width", "20%")
        console.log('account_info', result)
        format(result, $("#account_info"))

        command = "account_lines"
        result = await api.request({command, account})
        $("#progress .progress-bar").css("width", "40%")
        console.log('account_lines', result)
        format(result, $("#account_lines"))

        result = await pagedAccountTx(account);
        $("#progress .progress-bar").css("width", "60%");

        command = "account_objects"
        result = await api.request({command, account})
        $("#progress .progress-bar").css("width", "80%");
        console.log('account_objects', result);
        format(result, $("#account_objects"));

        $("#progress .progress-bar").css("width", "100%");
        $("#progress").fadeOut();

      } catch(err) {
        handleError(err)
        $("#progress .progress-bar").css("width", "100%");
        $("#progress").fadeOut();
      }



    } else if (reLedgerSeq.exec(target)) { // Ledger ---------------------------
      $("#result > .group-ledger").show();
      $("#explorerlink").attr("href", `https://livenet.xrpl.org/ledgers/${target}`)

      $("#progress .progress-bar").css("width", "10%");
      try {
        let result = await api.request({
          command: "ledger",
          ledger_index: target,
          transactions: true,
          expand: true
        })
        console.log('ledger', result.ledger);
        format(result.ledger, $("#ledger_info"));
        $("#progress .progress-bar").css("width", "100%");
        $("#progress").fadeOut();

      } catch(err) {
        handleErr(err)
        $("#progress .progress-bar").css("width", "100%");
        $("#progress").fadeOut();
      }

    } else if (reTxId.exec(target)) { // Transaction ---------------------------
      $("#result > .group-tx").show();
      $("#explorerlink").attr("href", `https://livenet.xrpl.org/transactions/${target}`)

      try {
        $("#progress .progress-bar").css("width", "10%");
        let result = await api.request({
          command: "tx",
          transaction: target,
          binary: false
        })
        $("#progress .progress-bar").css("width", "100%");
        $("#progress").fadeOut();
        console.log('tx', result);
        format(result, $("#tx_info"));

      } catch (err) {
        handleError(err);
        $("#progress .progress-bar").css("width", "100%");
        $("#progress").fadeOut();
      }

    } else { // Unknown/Invalid ------------------------------------------------
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
    $("#account_tx").text("... loading ...");
    pagedAccountTx(currentTarget, "next");
  });

  $('.account-tx-back').click(function () {
    $("#account_tx").text("... loading ...");
    pagedAccountTx(currentTarget, "prev");
  });

  $('.account-objects-expand').click(function () {
    $("#account_objects .expanded").removeClass("expanded");
    $("#account_objects").find("ul > li").addClass("expanded");
  });

  $('.account-objects-collapse').click(function () {
    $("#account_objects .expanded").removeClass("expanded");
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
        // TODO: is this "remoteError" thing still valid with xrpl.js 2.x+?
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

  async function pagedAccountTx(account, page) {
    let opts = {
      "command": "account_tx",
      "account": account,
      "ledger_index_min": -1,
      "ledger_index_max": -1,
      "binary": false,
      "limit": 20,
      "forward": false
    }

    if (page === "prev") {
      let prev_marker = previousMarkers.pop()
      if (prev_marker) {
        opts["marker"] = prev_marker
      } // omit to ask for page 1
      currentMarker = prev_marker
    } else if (page === "next") {
      opts["marker"] = nextMarker
      if (currentMarker) {
        previousMarkers.push(currentMarker)
      }
      currentMarker = opts["marker"]
    }

    let result = await api.request(opts)
    console.log('account_tx', result)
    format(result, $("#account_tx").empty())
    updateTxMarkerNav(result)

  }

  function updateTxMarkerNav(result) {
    if (currentMarker) {
      $(".account-tx-back").parent().show()
    } else {
      $(".account-tx-back").parent().hide()
    }

    if (result.marker) {
      nextMarker = result.marker
      $(".account-tx-more").parent().show()
    } else {
      $(".account-tx-more").parent().hide()
    }
  }

  String.prototype.repeat = function(times) {
    return (new Array(times + 1)).join(this);
  };

  function format(v, ct, depth) {
    depth = depth || 0;

    switch (typeof v) {
    case "object":
      let el = null
      let sub = null
      if (Array.isArray(v)) {
        ct.append("[");
        for (var i = 0; i < v.length; i++) {
          if (!sub) {
            $('<a class="toggle"></a>').appendTo(ct);
            $('<span class="ellipsis"></span>')
              .text(getEllipText(v.length)).appendTo(ct);
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
        for (var i in v) {
          if (!sub) {
            $('<a class="toggle"></a>').appendTo(ct);
            $('<span class="ellipsis"></span>')
              .text(getEllipText(v)).appendTo(ct);
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

  const TYPE_IDENTIFYING_KEYS = [
    "TransactionType",
    "LedgerEntryType"
  ]
  function getEllipText(contents) {
    var label = "...";
    if ("number" === typeof contents) {
      // Array - just list how many items
      label = "" + contents + " items";
    } else {
      // Object - list keys intelligently
      label = "";
      let i = 0
      // Look for type-identifying keys first:
      for (const key of TYPE_IDENTIFYING_KEYS) {
        if (key in contents) {
          label += contents[key]+": "
          i++
          break; // Only one type-identifying key per object
        }
      }
      // Now list other keys as space permits
      for (k in contents) {
        if (label.length >= 19) {
          break
        }
        if (TYPE_IDENTIFYING_KEYS.includes(k)) {
          // Skip type-identifying keys already printed
          continue
        }
        label += k + ", "
        i++
      }
      if (i < Object.keys(contents).length) {
        label += "..."
      } else {
        label = label.slice(0,-2) // Remove the last ", "
      }
    }
    return "\u00A0/* "+label+" */\u00A0";
  }
});
