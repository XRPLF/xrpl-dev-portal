# rippled Server Modes

The `rippled` server software can run in several modes depending on its configuration, including:

* Stock server - follows the network with a local copy of the ledger.
* Validating server, or _validator_ for short - participates in consensus (and does everything a stock server does, too).
* `rippled` server in stand-alone mode - for testing. Does not communicate to other `rippled` servers.

You can also run the `rippled` executable as a client application for accessing [`rippled` APIs](rippled-api.html) locally. (Two instances of the same binary can run side-by-side in this case; one as a server, and the other running briefly as a client and then terminating.)

For information on the commands to run rippled in each of these modes, see the [Commandline Reference](commandline-usage.html).


## Reasons to Run a Stock Server

There are lots of reasons you might want to run your own `rippled` server, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it. Of course, you must practice good network security to protect your server from malicious hackers.

You need to trust the `rippled` you use. If you connect to a malicious server, there are many ways that it can take advantage of you or cause you to lose money. For example:

* A malicious server could report that you were paid when no such payment was made.
* It could selectively show or hide payment paths and currency exchange offers to guarantee its own profit while not providing you the best deal.
* If you sent it your address's secret key, it could make arbitrary transactions on your behalf, and even transfer or destroy all the money your address holds.

Additionally, running your own server gives you admin control over it, which allows you to run important admin-only and load-intensive commands. If you use a shared server, you have to worry about other users of the same server competing with you for the server's computing power. Many of the commands in the WebSocket API can put a lot of strain on the server, so `rippled` has the option to scale back its responses when it needs to. If you share a server with others, you may not always get the best results possible.

Finally, if you run a validating server, you can use a stock server as a proxy to the public network while keeping your validating server on a private subnet only accessible to the outside world through the stock server. This makes it more difficult to compromise the integrity of your validating server.

### Public Hubs

A public hub is a stock server with lots of [peer protocol connections](peer-protocol.html) to other servers. You can help the XRP Ledger network maintain efficient connectivity by running a stock server as a public hub. Successful public hubs embody the following traits:

- Good bandwidth.

- Connections with a lot of reliable peers.

- Ability to relay messages reliably.



## Reasons to Run a Validator

The robustness of the XRP Ledger depends on an interconnected web of validators who each trust a few other validators _not to collude_. The more operators with different interests there are who run validators, the more certain each member of the network can be that it continues to run impartially. If you or your organization relies on the XRP Ledger, it is in your interest to contribute to the consensus process.

Not all `rippled` servers need to be validators: trusting more servers from the same operator does not offer better protection against collusion. An organization might run validators in multiple regions for redundancy in case of natural disasters and other emergencies.

If your organization runs a validating server, you may also run one or more stock servers, to balance the computing load of API access, or as a proxy between your validation server and the outside network.

For more information about running a validator, see [Run `rippled` as a Validator](run-rippled-as-a-validator.html).



## Reasons to Run a `rippled` Server in Stand-Alone Mode

You can run `rippled` in stand-alone mode without a consensus of trusted servers. In stand-alone mode, `rippled` does not communicate with any other servers in the XRP Ledger peer-to-peer network, but you can do most of the same actions on your local server only. Stand-alone provides a method for testing `rippled` behavior without being tied to the live network. For example, you can [test the effects of Amendments](amendments.html#testing-amendments) before those Amendments have gone into effect across the decentralized network.

When you run `rippled` in stand-alone mode, you have to tell it what ledger version to start from:

* Create a [new genesis ledger](start-a-new-genesis-ledger-in-stand-alone-mode.html) from scratch.
* [Load an existing ledger version](load-a-saved-ledger-in-stand-alone-mode.html) from disk.

**Caution:** In stand-alone mode, you must [manually advance the ledger](advance-the-ledger-in-stand-alone-mode.html).


## See Also

- **References:**
    - [Commandline Usage Reference](commandline-usage.html) - Detailed information on command-line options for all `rippled` server modes.
    - [ledger_accept method][] - Manually advance the ledger in stand-alone mode.
    - [feature method][] - Check [amendments](amendments.html) currently known and enabled.
- **Tutorials:**
    - [Configure `rippled`](configure-rippled.html)
        - [Run `rippled` as a Validator](run-rippled-as-a-validator.html)
    - [Use rippled in Stand-Alone Mode](use-stand-alone-mode.html):
        - [Start a New Genesis Ledger in Stand-Alone Mode](start-a-new-genesis-ledger-in-stand-alone-mode.html)
        - [Load a Saved Ledger in Stand-Alone Mode](load-a-saved-ledger-in-stand-alone-mode.html)
        - [Advance the Ledger in Stand-Alone Mode](advance-the-ledger-in-stand-alone-mode.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
