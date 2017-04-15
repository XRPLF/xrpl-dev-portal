# Escrow Tutorials

The Ripple Consensus Ledger supports held payments that can be executed only after a certain time has passed or a cryptographic condition has been fulfilled. You can use these simple features to build publicly-provable smart contracts. This article explains basic tasks relating to held payments.

- Send a time-held payment
- Send a conditionally-held payment
- Look up held payments where you are the destination
- Look up held payments where you are the sender/owner

## Availability of Held Payments

Held payments have been enabled by the ["Escrow" Amendment](concept-amendments.html#escrow) to the Ripple Consensus Protocol since 2017-03-31. A previous version of the same functionality was available on the [Ripple Test Net](https://ripple.com/build/ripple-test-net/) by the name "Suspended Payments" (SusPay) in 2016.

When testing in [stand-alone mode](concept-stand-alone-mode.html), you can force the Escrow feature to be enabled locally regardless of the amendment status. Add the following stanza to your `rippled.cfg`:

    [features]
    Escrow

You can check the status of the Escrow amendment using the [`feature` command](reference-rippled.html#feature).


## TODO

{% include 'snippets/tx-type-links.md' %}
