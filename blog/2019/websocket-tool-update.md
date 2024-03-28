---
labels:
    - Features
category: 2019
date: 2019-06-24
theme:
    markdown:
        editPage:
            hide: true
---
# WebSocket Tool Update

As part of [the recent site relaunch](/blog/2019/welcome-to-xrpl-org), the XRP Ledger Dev Portal has an updated version of the [WebSocket API Tool](/resources/dev-tools/websocket-api-tool). This tool lets you communicate directly with `rippled` servers, which power the XRP Ledger network. Among several of the improvements in this new version of the tool is that you can choose which servers to connect to, including the public servers Ripple runs, servers in the XRP Test Net, or your own server running locally on your own computer.

<!-- BREAK -->

## Revisiting an Oldie

The original WebSocket tool was built before 2014, and things were different at the time. For one thing, web technology was different: The latest HTTP version was 1.1, Chrome and Firefox each had about 30 fewer version numbers under their belts, and Microsoft's Internet Explorer had yet to yield to its successor, Edge. The cryptocurrency space was still in its infancy: Ripple ("Ripple Labs" at the time) had fewer than 50 employees, and XRP prices were hovering somewhere in the neighborhood of USD $0.005—half a cent—at the time.  Many other popular coins and networks, such as Ethereum, had not even launched yet.

The landscape has changed a lot in the past five years. The JavaScript ecosystem has matured dramatically, as has [the language itself](https://en.wikipedia.org/wiki/ECMAScript) and the technologies it interfaces with, including HTML and CSS. Still, the WebSocket tool continues to be one of the most popular pages on the site, because it provides a quick and easy way to ask the XRP Ledger for authoritative answers. As part of refreshing the XRP Ledger Dev Portal, it was time to revisit the WebSocket tool to bring it up to date with modern standards, so it could be more efficient, more extensible, and leverage more shared technology.

## New Features

A big motivator for updating the tool was to introduce new functionality: things that were tough to add with the tool's existing structure. The refresh provided an opportunity to add several new, long-desired features: a server selector, permalinking to tool status, curl syntax button, error highlighting, and better message history management.

### Server Selector

![Server Selector button showing an active connection to the Test Net](/blog/img/wstool-server-selector.png)

The WebSocket tool originally had the problem of connecting only to a hardcoded pool of servers run by Ripple, and sometimes, if you lost connection, it would not update to show that you had disconnected. The new tool adds a button to select where to connect, and shows you the status of your connection. The refreshed tool provides options to connect to Ripple's general-purpose public XRP Ledger servers, full-history public servers, Test Net servers, or to your own server running locally. This list can also change to provide more options in the future.


### Permalinking

![Permalink button](/blog/img/wstool-permalink-button.png)

The new Permalink button, represented by a button with a chain-link icon, provides a link you can use to share the current state of your inputs—the request body and the chosen server. Like other web tools such as JSFiddle or CodePen, this provides a way to prepare a set of inputs and share it with others. This might come in handy in a bunch of different ways. Link people the inputs to reproduce a weird bug. Show others [how to look up the latest Amendments status directly in the ledger](https://xrpl.org/websocket-api-tool.html?server=wss%3A%2F%2Fs1.ripple.com%2F&req=%7B%22id%22%3A%22hello_from_the_blog%22%2C%22command%22%3A%22ledger_entry%22%2C%22index%22%3A%227DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4%22%2C%22ledger_index%22%3A%22validated%22%7D). Have your offline signing tool provide links to submit pre-signed transaction blobs. Be creative!


### curl Syntax Button

![curl syntax button](/blog/img/wstool-curl-syntax-button.png)

Maybe you're more comfortable using the command line, or you're trying to figure out how to replicate a given thing using JSON-RPC. The new curl syntax button, represented by a `>_` icon, loads a popup with the current inputs of the request box translated into a JSON-RPC call you can make with [the `curl` utility](https://curl.haxx.se/). Copy-paste this into your command line or your bash scripts and see it go!

**Note:** The [`path_find`](/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/path_find/) command isn't available over JSON-RPC, so the button is hidden when that command is selected. Some other commands may not work without modification on JSON-RPC; for example, the [`subscribe`](/docs/references/http-websocket-apis/public-api-methods/subscription-methods/subscribe/) and [`unsubscribe`](/docs/references/http-websocket-apis/public-api-methods/subscription-methods/unsubscribe/) commands require an admin-only `url` callback field in JSON-RPC.


### Error Highlighting

![Red mark and tooltip indicating where a JSON syntax error occurs](/blog/img/wstool-error-highlighting.png)

Some of the easiest mistakes to make when using the WebSocket are simple syntax errors: things like a missed comma, a mismatched quotation mark or an extra curly-brace. The new tool goes further than simply telling you there's a syntax error: it highlights the lines where errors occurred by placing red circled X marks on them. Hover your cursor over the error to get a description of the error and what the parser expected to see there.


### Message History Management

![Keep last setting, pause subscription button, and clear history button](/blog/img/wstool-message-history-management.png)

Previously, the WebSocket tool had one box for direct responses to commands, and another area that held all other messages (such as subscriptions). The interface now displays messages of all types in one stream, keeping a history of your previous calls until you close the page, choose a different server, or choose to clear history with the new "Clear History" button (represented by a trash can icon). That way, you can try changing one detail of your request and see the two side-by-side. It also better represents the nature of a WebSocket connection.

The amount of history the tool keeps at a time isn't unlimited, which is another change from the previous version. By default, any time the tool receives a new message, it deletes any messages older than the most recent 50, though you can set this to be any amount you like. If you leave the tab open so that it continues receiving messages for a long time, the amount that accumulates can really slow down your browser. This new setting gives you the control over if and when that happens.

Unlike the old tool, the refreshed WebSocket tool also does not automatically subscribe you to any message streams like ledger-closing events, so you won't get inundated with messages unless you've used a command to subscribe to them. If you do, messages still can pile up quickly, so the tool carries over the ability to pause notification-type messages while still showing direct responses to the commands you run. To save space, this pause/resume button has been changed to use familiar "pause/play" icons.



## Under the Hood

Some of the code for the WebSocket tool remains the same: no need to fix things that are working perfectly well even today. Other parts were restructured or thrown out entirely as part of the process. Here's a high-level view of the big changes:

- **No ripple-lib** - One of the biggest changes in the new WebSocket tool is to bypass the ripple-lib library in favor of a direct WebSocket connection. There's nothing wrong with ripple-lib, but the WebSocket tool was using a tiny chunk of its functionality and was stuck on an ancient version from before the "RippleAPI" interface of modern versions. Going through ripple-lib also introduced some tiny differences that you wouldn't see if you were to use the WebSocket interface natively from any other programming language. For example, the tool ignored your ID values and supplied its own, purely numerical, IDs. The new tool replaces 352 KB of ripple-lib code with 3.4 KB of code for opening and managing WebSocket connections—literally a 99% reduction in size! The new code sends requests and responses with minimal preprocessing, so you don't have to guess what's part of the server and what's a result of passing things through ripple-lib. (As a result, it uses the exact ID you've provided for each message, or none if you omit the ID.) The only processing the new tool does on request and response messages is to run the JSON through your browser's built-in parser so it can add line breaks and indentation for readability.

- **Bootstrap Styles** - The [Bootstrap](https://getbootstrap.com/) framework is ubiquitous in today's web, and for good reason. It provides styles, scripts, and shortcuts for making websites that look great on a range of devices and screen sizes. The XRP Ledger Dev Portal already uses Bootstrap for the rest of the site, but the old WebSocket Tool had a lot of redundant older styles for things like buttons. These styles led to minor inconsistencies in color and behavior in different parts of the site. The refreshed version uses Bootstrap classes for all the form interfaces, which made it easier to add new buttons and fields for the new features. The refreshed version also drops 5 KB of CSS from the tool page and removes some unused information from the HTML markup of the page itself.

- **Separate Methods File** - The refreshed tool splits the definitions of the methods in the sidebar into [their own source file](https://github.com/ripple/ripple-dev-portal/blob/master/assets/js/apitool-methods-ws.js), which makes it just a little easier to add, remove, or update example methods because you don't have to dig through the rest of the tool's code and worry about breaking it with a new method. The list has already been updated to match the examples in the documentation, which brings a host of useful updates to the tool, whose old examples included some deprecated fields and not-recommended syntax.


## Moving Forward

The new WebSocket tool is just a small tool in the XRP Ledger toolbox. This refresh makes it just a little bit faster, cleaner, and more powerful than before. It's our hope that this contributes to the further growth of the XRP Ledger, by helping more people get started interacting with the technology. This tool is for the community, so we encourage community contributions — whether it's more public servers to add to the default list, more and better examples, or just creative use of the existing features, the power is yours. Use it responsibly.
