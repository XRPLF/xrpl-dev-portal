const commandlist = $("#command_list")
const request_body = $(".request-body")
const response_wrapper = $(".response-body-wrapper")
const request_button  = $('.send-request')
const conn_btn = $(".connection")
const stream_pause = $(".stream-pause")
const stream_unpause = $(".stream-unpause")

const GET = "GET"
const POST = "POST"
const PUT = "PUT"
const DELETE = "DELETE"

let STREAM_PAUSED = false

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
  const to   = "aaaaeeeeiiiioooouuuunc------"
  for (let i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
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
        commandlist.append("<li class='method'><a href='#"+req.slug+"'>"+req.name+"</a></li>");
    }
  });
}

function make_commands_clickable() {
    commandlist.children("li").click(function() {
        var cmd = slugify($(this).text().trim());

        if (!requests[cmd]) return;

        select_request(cmd, true);
        window.location.hash = cmd;

        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
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
  if (request === undefined) {
    var el = commandlist.children("li:not(.separator)").eq(0)
    request = slugify(el.text())
  } else {
    var el = commandlist.find("li a[href='#"+request+"']").parent()
  }
  $(el).siblings().removeClass('selected');
  $(el).addClass('selected');

  command = requests[request];

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

  $(".selected_command").attr('href', command.link).text(command.name)

  if (command.hasOwnProperty("body")) {
      cm_request.setValue(JSON.stringify(command.body, null, 2));
  } else {
      //No body, so wipe out the current contents.
      cm_request.setValue("")
  }
  cm_request.refresh()
};

function send_request() {
  if (typeof socket === "undefined" || socket.readyState !== 1) {
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
    const new_conn_url = $("input[name='wstool-1-connection']:checked").val()
    if (event.wasClean && event.originalTarget.url == new_conn_url) {
      console.log("socket clean:", event, "vs", new_conn_url)
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
    const new_conn_url = $("input[name='wstool-1-connection']:checked").val()
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

handle_select_server = function(event) {
  if (typeof socket !== "undefined") { socket.close(1000) }
  connect_socket()
  response_wrapper.empty()
}




$(document).ready(function() {
    //wait for the Requests to be populated by another file
    generate_table_of_contents();
    make_commands_clickable();

    if (window.location.hash) {
      var cmd   = window.location.hash.slice(1).toLowerCase();
      select_request(cmd);
    } else {
      select_request();
    }

    // TODO: permalink stuff here?
    // if (urlParams["base_url"]) {
    //   //TODO: change_base_url(urlParams["base_url"]);
    // }

    connect_socket()

    request_button.click(send_request);
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

});

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
