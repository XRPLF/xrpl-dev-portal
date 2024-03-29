---
date: 2017-03-16
category: 2017
labels:
    - Security
theme:
    markdown:
        editPage:
            hide: true
---
# Gateway Bulletin: Setting Trust Line Quality with SendMax

When you build an automated system to send payments into the Ripple Consensus Ledger (RCL) for your customers, you must make sure that it constructs payments carefully. Malicious actors are constantly trying to find flaws in a system implementation that pays them more money than it should.

Once such flaw was [revealed](https://forum.ripple.com/viewtopic.php?f=1&t=18210) _(dead link)_ recently, related to setting [trust line quality](https://web.archive.org/web/20150422102043/https://wiki.ripple.com/Trust_line_quality), which affects gateways that use a `SendMax` value greater than the amount they deliver. This setup could result in a destination account receiving slightly higher (typically less than 1% higher) than the expected amount from the gateway's account.

Note: This system implementation flaw does not affect XRP balances.

## Action Recommended

The [recommended setup](https://xrpl.org/become-an-xrp-ledger-gateway.html#sending-payments-to-customers) is to use either of the following rules:

* Setting the `SendMax` value equal to the Amount * (1 + transfer rate); or
* Setting the `SendMax` value as low as possible and only leaving space for slippage to buffer the transaction from failing

A malicious user can make trust line quality changes in the ledger between when you prepare a transaction and when it is validated in the ledger. To ensure that these changes cannot cause a transaction to cost you more than you expected, it is vital to set the `SendMax` no higher than the maximum amount you are willing to send.

To reduce the chance of sending a transaction that fails, add the following checks to any transaction that delivers issued currency on a trust line:

* Does the trust line exist?
* Is the trust line’s limit sufficient?
* Are optional incoming balances on this trust line valued at the appropriate ratio?
* Did the user freeze the trust line?

## Learn, Ask Questions, and Discuss

To experiment with the Ripple Consensus Ledger technology without using real money, try out the [Ripple Test Net](https://xrpl.org/xrp-testnet-faucet.html).

### Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* The Ripple Dev Blog: <https://developers.ripple.com/blog/>
* Ripple Technical Services: <support@ripple.com>
* XRP Chat: <http://www.xrpchat.com>
