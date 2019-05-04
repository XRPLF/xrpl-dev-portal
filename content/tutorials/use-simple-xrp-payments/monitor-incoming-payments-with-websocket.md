# Monitor Incoming Payments with WebSocket

This tutorial shows how to monitor for incoming payments using the [WebSocket `rippled` API](rippled-api.html). Since all XRP Ledger transactions are public, anyone can monitor incoming payments to any address.

WebSocket follows a model where the client and server establish one connection, then send messages both ways through the same connection, which remains open until explicitly closed (or until the connection fails). This is in contrast to the HTTP-based API model (including JSON-RPC and RESTful APIs), where the client opens and closes a new connection for each request[¹](#footnote-1)<a id="from-footnote-1"></a>.

**Tip:** The examples in this page use JavaScript so that the examples can run natively in a web browser. If you are developing in JavaScript, you can also use the [RippleAPI library for JavaScript](https://developers.ripple.com/rippleapi-reference.html) to simplify some tasks. This tutorial shows how to monitor for transactions _without_ using RippleAPI so that you can translate the steps to other programming languages that don't have RippleAPI.

## Prerequisites

- The examples in this page use JavaScript and the WebSocket protocol, which are available in all major modern browsers. If you have some JavaScript knowledge and expertise in another programming language with a WebSocket client, you can follow along while adapting the instructions to the language of your choice.
- You need a stable internet connection and access to a `rippled` server. The embedded examples connect to Ripple's pool of public servers. If you [run your own `rippled` server](install-rippled.html), you can also connect to that server locally.

<script type="application/javascript">
// Helper stuff for this interactive tutorial

function writeToConsole(console_selector, message) {
  let write_msg = "<div class='console-entry'>" + message + "</div>"
  $(console_selector).find(".placeholder").remove()
  $(console_selector).append(write_msg)
  // TODO: JSON pretty-printing, maybe w/ multiple input args?
}

</script>

{% set n = cycler(* range(1,99)) %}

## {{n.next()}}. Connect to the XRP Ledger

The first step of monitoring for incoming payments is to connect to the XRP Ledger, specifically a `rippled` server.

The following JavaScript code connects to one of Ripple's public server clusters. It then logs a message to the console, sends a requesting using the [ping method][] and sets up a handler to log to the console again when it receives any message from the server side.

```js
const socket = new WebSocket('wss://s1.ripple.com')
socket.addEventListener('open', (event) => {
  // This callback runs when the connection is open
  console.log("Connected!")
  const command = {
    "id": "on_open_ping_1",
    "command": "ping"
  }
  socket.send(JSON.stringify(command))
})
socket.addEventListener('message', (event) => {
  console.log('Got message from server:', event.data)
})
```

The above example opens a secure connection (`wss://`) over the internet to the default port for TLS-secured connections (443) on a remote server at `s1.ripple.com`. To connect to a locally-running `rippled` server with the default configuration instead, open an _unsecured_ connection (`ws://`) on port **6006** locally, using the following first line:

```js
const socket = new WebSocket('ws://localhost:6006')
```

**Tip:** By default, connecting to a local `rippled` server gives you access to the full set of [admin methods](admin-rippled-methods.html) and admin-only data in some responses such as [server_info][server_info method], in addition to the [public methods](public-rippled-methods.html) that are available when you connect to a public servers over the internet.

Example:

<div class="interactive-block" id="interactive-connect">
  <div class="interactive-block-inner">
    <div class="breadcrumbs-wrap">
      <ul class="breadcrumb prereqs">
        <li class="breadcrumb-item disabled current bc-connect"><a href="#interactive-connect">Connect</a></li>
        <!-- TODO: breadcrumb items for each step -->
      </ul><!--/.breadcrumb.prereqs-->
    </div><!--/.breadcrumbs-wrap-->
    <button id="connect-button" class="btn btn-primary">Connect</button>
    <div>
      <strong>Connection status:</strong>
      <span id="connection-status">Not connected</span>
      <div id='loader-{{n.current}}' style="display: none;"><img class='throbber' src="assets/img/rippleThrobber.png"></div>
      <h5>Console:</h5>
      <div class="ws-console" id="monitor-console-connect"><span class="placeholder">(Log is empty)</span></div>
    </div>
  </div>
</div>
<script type="application/javascript">
const socket = new WebSocket('wss://s1.ripple.com');
socket.addEventListener('open', (event) => {
  // This callback runs when the connection is open
  writeToConsole("#monitor-console-connect", "Connected!")
  const command = {
    "id": "on_open_ping_1",
    "command": "ping"
  }
  socket.send(JSON.stringify(command))
})
socket.addEventListener('message', (event) => {
  writeToConsole("#monitor-console-connect", "Got message from server: "+JSON.stringify(event.data))
})
</script>


## {{n.next()}}. Handle Incoming Messages By Type and ID

Since WebSocket connections can have several messages going each way and there is not a strict 1:1 correlation between requests and responses, the `rippled` server provides a `type` field on every message:

- For any message that is a direct response to a request from the client side, the `type` is the string `response`. In this case, the server also provides an `id` field that matches the `id` provided in the request this is a response for. (This is important because responses may arrive out of order.)
- For follow-up messages from [subscriptions](subscribe.html), the `type` indicates the type of follow-up message it is, such as the notification of an new transaction, ledger, or validation; or a follow-up to an ongoing [pathfinding request](path_find.html). Your client only receives these messages if it subscribes to them.


## Footnotes

1. <a id="footnote-1"></a> In practice, when calling an HTTP-based API multiple times, the client and server may reuse the same connection for several requests and responses. This practice is called [HTTP persistent connection, or keep-alive](https://en.wikipedia.org/wiki/HTTP_persistent_connection). From a development standpoint, the code to use an HTTP-based API is the same regardless of whether the underlying connection is new or reused.




<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
