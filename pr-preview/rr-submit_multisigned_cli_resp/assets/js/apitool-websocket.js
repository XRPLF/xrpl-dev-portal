const commandlist = $("#command_list")
const request_body = $(".request-body")
const response_wrapper = $(".response-body-wrapper")
const request_button  = $('.send-request')
const conn_btn = $(".connection")
const stream_pause = $(".stream-pause")
const stream_unpause = $(".stream-unpause")
const trash_button = $(".wipe-responses")
const permalink_button = $(".permalink")
const curl_button = $(".curl")

let STREAM_PAUSED = false

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/,:;"
  const to   = "aaaaeeeeiiiioooouuuunc-----"
  for (let i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 _-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

//Build requests
const requests = { };
const requestlist = [];
function Request(name, obj) {
    if (obj === undefined) {
        requestlist.push({slug: null,name: name});//separator
        return null;
    }

    obj.name = name;
    obj.slug = slugify(name);
    requests[obj.slug] = obj;
    requestlist.push(obj);

    return obj;
};

function generate_table_of_contents() {
  $.each(requestlist, function(i, req) {
    if (req.slug === null) {
        commandlist.append("<li class='separator'>"+req.name+"</li>");
    } else {
        let status_label = ""
        if (req.status == "not_enabled") {
          status_label = '<span class="status not_enabled" title="This feature is not currently enabled on the production XRP Ledger."><i class="fa fa-flask"></i></span> '
        }
        commandlist.append("<li class='method'><a href='#"+req.slug+"'>"+status_label+req.name+"</a></li>");
    }
  });
}

function make_commands_clickable() {
  commandlist.children("li").click(function() {
    var cmd = slugify($(this).text().trim());

    if (!requests[cmd]) return;

    select_request(cmd);
    window.location.hash = cmd;

    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });
}

const cm_request = CodeMirror(request_body.get(0), {
  mode: 'javascript',
  json: true,
  smartIndent: false,
  gutters: ["CodeMirror-lint-markers"],
  lint: CodeMirror.lint.json
})

function select_request(request) {
  let el
  if (request === undefined) {
    el = commandlist.children("li:not(.separator)").eq(0)
    request = slugify(el.text())
  } else {
    el = commandlist.find("li a[href='#"+request+"']").parent()
  }
  $(el).siblings().removeClass('active')
  $(el).addClass('active')

  const command = requests[request];
  if (command === undefined) {
    console.warning("Unknown request identifier from # anchor.")
    return false
  }

  if (command.description) {
    $(".api-method-description-wrapper .blurb").html(command.description)
    $(".api-method-description-wrapper .blurb").show()
  } else {
    $(".api-method-description-wrapper .blurb").hide()
  }
  if (command.link) {
    $(".api-method-description-wrapper .api-readmore").attr("href", command.link)
    $(".api-method-description-wrapper .api-readmore").show()
  } else {
    $(".api-method-description-wrapper .api-readmore").hide()
  }
  if (command.ws_only) {
    $(".curl").hide()
  } else {
    $(".curl").show()
  }

  $(".selected_command").attr('href', command.link).text(command.name)

  if (command.hasOwnProperty("body")) {
      cm_request.setValue(JSON.stringify(command.body, null, 2));
  } else {
      //No body, so wipe out the current contents.
      cm_request.setValue("")
  }
  cm_request.refresh()
  return true
};

function send_request() {
  if (typeof socket === "undefined" || socket.readyState !== WebSocket.OPEN) {
    alert("Can't send request: Must be connected first!")
    return
  }

  const req_body = cm_request.getValue()
  try {
    JSON.parse(req_body) // we only need the text version, but test JSON syntax
  } catch(e) {
    alert("Invalid request JSON")
    return
  }

  $(".send-loader").show()
  socket.send(req_body)
}

let socket;
function connect_socket() {
  if (typeof socket !== "undefined" && socket.readyState < 2) {
    socket.close()
  }
  $(".connect-loader").show()
  const selected_server_el = $("input[name='wstool-1-connection']:checked")
  const conn_url = selected_server_el.val()
  socket = new WebSocket(conn_url)

  socket.addEventListener('open', (event) => {
    conn_btn.text(selected_server_el.data("shortname") + " (Connected)")
    conn_btn.removeClass("btn-outline-secondary")
    conn_btn.removeClass("btn-danger")
    conn_btn.addClass("btn-success")
    $(".connect-loader").hide()
  })
  socket.addEventListener('close', (event) => {
    const new_conn_url = get_current_server()
    if (event.wasClean && event.originalTarget.url == new_conn_url) {
      conn_btn.text(selected_server_el.data("shortname") + " (Not Connected)")
      conn_btn.removeClass("btn-success")
      conn_btn.removeClass("btn-danger")
      conn_btn.addClass("btn-outline-secondary")
      $(".connect-loader").hide()
    } else {
      console.debug("socket close event discarded (new socket status already provided):", event)
    }
  })
  socket.addEventListener('error', (event) => {
    const new_conn_url = get_current_server()
    if (event.originalTarget.url == new_conn_url) {
      console.error("socket error:", event)
      conn_btn.text(selected_server_el.data("shortname") + " (Failed to Connect)")
      conn_btn.removeClass("btn-outline-secondary")
      conn_btn.removeClass("btn-success")
      conn_btn.addClass("btn-danger")
      $(".connect-loader").hide()
    } else {
      console.debug("socket error event discarded (new socket status already provided):", event)
    }
  })
  socket.addEventListener('message', (event) => {
    let data;
    try {
      data = JSON.parse(event.data)
    } catch {
      alert("Couldn't parse response from server.")
      return
    }

    if (data.type === "response") {
      $(".send-loader").hide()
    }
    if (data.type === "response" || !STREAM_PAUSED) {
      const el = $("<div class='response-metadata'><span class='timestamp'>"+(new Date()).toISOString()+"</span><div class='response-json'></div></div>")
      response_wrapper.prepend(el)
      const new_cm = CodeMirror($(el).find(".response-json")[0], {
        value: JSON.stringify(data, null, 2),
        mode: 'javascript',
        json: true,
        smartIndent: false,
        gutters: ["CodeMirror-lint-markers"], // not used, but provided for consistent sizing
        readOnly: true
      })
      new_cm.setSize(null, "auto")
    }
    // If subscription messages are paused, throw out incoming subscription messages

    // Trim response entries to the suggested number
    let keep_last
    try {
      keep_last = parseInt($(".keep-last").val(), 10)
      if (keep_last < 0) {keep_last = 0}
    } catch(e) {
      console.warn("Keep last value invalid:", e)
      return
    }
    while ($(".response-metadata").length > keep_last) {
      $(".response-metadata").eq(-1).remove()
    }
  })
}

const handle_select_server = function(event) {
  if (typeof socket !== "undefined") { socket.close(1000) }
  connect_socket()
  response_wrapper.empty()
}

function get_compressed_body() {
  let compressed_body;
  try {
    const body_json = JSON.parse(cm_request.getValue())
    compressed_body = JSON.stringify(body_json, null, null)
  } catch(e) {
    // Probably invalid JSON. We'll make a permalink anyway, but we can't
    // compress all the whitespace because we don't know what's escaped. We can
    // assume that newlines are irrelevant because the rippled APIs don't accept
    // newlines in strings anywhere
    compressed_body = cm_request.getValue().replace("\n","").trim()
  }

  return compressed_body
}

function get_current_server() {
  return $("input[name='wstool-1-connection']:checked").val()
}

const update_permalink = function(event) {
  const start_href = window.location.origin + window.location.pathname
  const encoded_body = encodeURIComponent(get_compressed_body())
  const encoded_server = encodeURIComponent(get_current_server())

  let permalink = start_href + "?server=" + encoded_server + "&req=" + encoded_body
  // Future Feature: set the hash if the command matches a known method
  $("#permalink-box-1").text(permalink)
}

const update_curl = function(event) {
  let body
  try {
    // change WS to JSON-RPC syntax
    params = JSON.parse(cm_request.getValue())
    delete params.id
    const method = params.command
    delete params.command
    const body_json = {"method":method, "params":[params]}
    body = JSON.stringify(body_json, null, null)
  } catch(e) {
    alert("Can't provide curl format of invalid JSON syntax")
    return
  }

  const server = $("input[name='wstool-1-connection']:checked").data("jsonrpcurl")

  const curl_syntax = "curl -H 'Content-Type: application/json' -d '"+body+"' "+server
  $("#curl-box-1").text(curl_syntax)
}

function server_from_params(params) {
  const server = params.get("server")
  if (server) {
    const server_checkbox = $("input[value='"+server+"']")
    if (server_checkbox.length === 1) {
      server_checkbox.prop("checked", true)
      // relies on connect_socket() being run shortly thereafter
    }
  }
}

function req_from_params(params) {
  let req_body = params.get("req")
  let cmd_name = ""
  if (req_body) {
    try {
      req_body_json = JSON.parse(req_body)
      req_body = JSON.stringify(req_body_json, null, 2)
      cmd_name = req_body_json.command
    } catch(e) {
      console.warn("Loaded request body is invalid JSON:", e)
    }

    $(".selected_command").text(cmd_name)
    if (requests.hasOwnProperty(slugify(cmd_name))) {
      const req = requests[slugify(cmd_name)]
      $(".selected_command").attr('href', req.link)
      $(".api-method-description-wrapper .blurb").html(req.description)
      $(".api-method-description-wrapper .api-readmore").attr("href", req.link)
      $(".api-method-description-wrapper .api-readmore").show()
    } else {
      console.debug("Unknown command:", cmd_name)
      $(".selected_command").attr('href', "")
      $(".api-method-description-wrapper .blurb").empty()
      $(".api-method-description-wrapper .api-readmore").hide()
    }
    cm_request.setValue(req_body)
  }
}

$(document).ready(function() {
    //wait for the Requests to be populated by another file
    generate_table_of_contents()
    make_commands_clickable()

    const search_params = new URLSearchParams(window.location.search)

    if (window.location.hash) {
      var cmd   = window.location.hash.slice(1).toLowerCase();
      if (!select_request(cmd)) {
        // Didn't find a definition for the request from the hash. Use the
        // default instead.
        select_request()
      }
    } else if (search_params.has("req")) {
      req_from_params(search_params)
    } else {
      select_request()
    }

    if (search_params.has("server")) {
      server_from_params(search_params)
    }

    connect_socket()

    request_button.click(send_request)

    $("input[name='wstool-1-connection']").click(handle_select_server)
    stream_pause.click((event) => {
      STREAM_PAUSED = true
      stream_pause.hide()
      stream_unpause.show()
    })
    stream_unpause.click((event) => {
      STREAM_PAUSED = false
      stream_pause.show()
      stream_unpause.hide()
    })

    trash_button.click((event) => {
      response_wrapper.empty()
    })
    permalink_button.click(update_permalink)
    curl_button.click(update_curl)

});
