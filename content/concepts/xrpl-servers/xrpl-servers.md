---
html: xrpl-servers.html
parent: concepts.html
blurb: rippled is the core peer-to-peer server that manages the XRP Ledger.
template: pagetype-category.html.jinja
---
# XRP Ledger Servers

There are two main types of server software that power the XRP Ledger:

- The core server, `rippled`, runs the the peer-to-peer network which processes transactions and reaches a consensus on their outcome.
- The API server, [Clio](the-clio-server.html), provides a powerful interface for fetching or querying data from the ledger.

Anyone can run instances of one or both of these types of servers based on their needs.

In addition to the main servers, there is a light-weight server type, [_witness server_](witness-server.html), that witnesses and signs transactions between a locking chain and an issuing chain, thus enabling cross-chain transactions between the XRP Ledger and another chain. For more information on these transactions, see the [Locking and Issuing Chains](locking-and-issuing-chains.html) and [witness server](witness-server.html) documentation.

## Reasons to Run Your Own Server

For lighter use cases and individual servers, you can often rely on free [public servers][]. However, the more serious your use of the XRP Ledger becomes, the more important it becomes to have your own infrastructure.

There are lots of reasons you might want to run your own servers, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it. Of course, you must practice good network security to protect your server from malicious hackers.

You need to trust the server you use. If you connect to a malicious server, there are many ways that it can take advantage of you or cause you to lose money. For example:

* A malicious server could report that you were paid when no such payment was made.
* It could selectively show or hide payment paths and currency exchange offers to guarantee its own profit while not providing you the best deal.
* If you sent it your address's secret key, it could make arbitrary transactions on your behalf, and even transfer or destroy all the money your address holds.

Additionally, running your own server gives you [admin access](get-started-using-http-websocket-apis.html#admin-access), which allows you to run important admin-only and load-intensive commands. If you use a shared server, you have to worry about other users of the same server competing with you for the server's computing power. Many of the commands in the WebSocket API can put a lot of strain on the server, so the server has the option to scale back its responses when it needs to. If you share a server with others, you may not always get the best results possible.

Finally, if you run a validating server, you can use a stock server as a proxy to the public network while keeping your validating server on a private network only accessible to the outside world through the stock server. This makes it more difficult to compromise the integrity of your validating server.

## Server Features and Topics

<!-- provided by the auto-generated table of children -->

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
