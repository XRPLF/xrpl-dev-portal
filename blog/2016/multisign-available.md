---
date: 2016-06-27
labels:
    - Amendments
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# Multi-Signing Now Available #

As [predicted previously](https://developers.ripple.com/blog/2016/multisign-reminder.html), multi-signing became available on the Ripple Consensus Ledger this afternoon in Pacific time ([2016-06-27T11:34:41Z](https://xrpcharts.ripple.com/#/transactions/168F8B15F643395E59B9977FC99D6310E8708111C85659A9BAF8B9222EEAC5A7), to be exact).

Multi-signing provides more flexibility for sending transactions from your Ripple address. You can use multi-signing alongside a master key pair or regular key pair, or you can disable your other keys and use multi-signing exclusively. You can set and update a list of up to 8 signers, with customizable weights and quorum enabling many different use cases. The members of your signer list can be any Ripple addresses, whether they're funded addresses in the ledger or not.

Institutional users, in particular, can use the greater security of requiring multiple keys stored in different places to protect high-value addresses and large XRP holdings. Makers and experimenters should find lots of potential applications relating to internet-of-things and smart contracts. Here are just a few ideas of ways you might set up multi-signing for an address:

- **N-factor Auth:** Store 2 or more keys on different devices, and require all the devices to sign each transaction.
- **M-of-N:** Give keys to multiple people, and require a majority of signers to sign each transaction.
- **Delegate a backup plan:** Designate a team of people who can send transactions for you by working together, in case you're unavailable. Keep using single signatures for normal business.
- **Primary and Approvals:** Use the weights in your signer list to require a specific signer along with at least one other.

The Ripple Consensus Ledger's multi-signing feature also allows signers to independently rotate their keys, for even greater security. Here's a brief look at how:

1. Include the signer's address in your SignerList.
2. Fund the signer's address in the ledger.
3. Assign a [Regular Key Pair](https://ripple.com/build/transactions/#setregularkey) to the signer's address and disable its master key. (Funded addresses can only sign using their master key pair if it's not disabled.)
4. Have that signer use its regular key pair to contribute to your multi-signatures.


## Further Reading ##

- [Multi-Signing Summary](https://ripple.com/build/transactions/#multi-signing)
- [How to Multi-Sign](https://ripple.com/build/how-to-multi-sign/)
- [MultiSign Amendment](https://ripple.com/build/amendments/#multisign)


## Other resources: ##

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* The Ripple Dev Blog: <https://developers.ripple.com/blog/>
* Ripple Technical Services: [support@ripple.com](mailto:support@ripple.com)
* XRP Chat: <http://www.xrpchat.com/>
