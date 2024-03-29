---
date: 2018-09-10
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# ripple-lib version 1.0.0

We are pleased to announce the release of **[ripple-lib version 1.0.0](https://github.com/ripple/ripple-lib/releases/tag/1.0.0)**!

ripple-lib is a high-level JavaScript interface to the XRP Ledger. This version features a range of changes and improvements that make the library more capable and flexible. It includes new methods for accessing `rippled` APIs, including subscriptions.

When using this version with `rippled` for online functionality, we recommend using `rippled` version 1.0.1 or later.

Below is a summary of the changes since ripple-lib version 0.22.0 (the previous non-beta version).


## Release Notes

### New Features

* [Add `request()`, `hasNextPage()`, and `requestNextPage()` for accessing `rippled` APIs](https://github.com/ripple/ripple-lib/blob/09541dae86bc859bf5928ac65b2645dfaaf7f8b1/docs/index.md#rippled-apis).
* Add `prepareTransaction()` for preparing raw `txJSON`.
* XRP amounts can be specified in drops. Also, `xrpToDrops()` and `dropsToXrp()` are available to make conversions.
* `getTransaction()` responses can include a new `channelChanges` property that describes the details of a payment channel.

### Data Validation and Errors

* [Amounts in drops and XRP are checked for validity](https://github.com/ripple/ripple-lib/blob/develop/HISTORY.md#100-beta1-2018-05-24).
* [A maximum fee is now imposed](https://github.com/ripple/ripple-lib/blob/develop/HISTORY.md#100-beta2-2018-06-08). Exceeding it causes a `ValidationError` to be thrown.
* Errors are improved and more data validation was added.
* Bug fix: `getPaths` now filters paths correctly and works correctly when the destination currency is XRP.


### Breaking Changes

The following changes were introduced in 1.0.0.

* `getTransaction()` and `getTransactions()`
    * The `specification.destination.amount` field has been removed from the parsed transaction response.
    * To determine the amount that a transaction delivered, use `outcome.deliveredAmount`.
    * If you require the provisional requested `Amount` from the original transaction:
        * Use `getTransaction()`'s `includeRawTransaction` option, or
        * Use `getTransactions()`'s `includeRawTransactions` option, or
        * Use the `rippled` APIs directly with `request()`. For example, call the API methods `tx`, `account_tx`, etc.
* `getLedger()` response object
    * The `rawTransactions` field has been removed (for consistency with `getTransaction()` and `getTransactions()`).
    * Instead, within each transaction, use the new `rawTransaction` JSON string.
    * The `metaData` field has been renamed to `meta` for consistency with `rippled`'s `tx` method.
    * `ledger_index` has been added to each raw transaction.


## Learn, ask questions, and discuss

[ripple-lib Documentation](https://developers.ripple.com/rippleapi-reference.html) is available in the XRP Ledger Dev Portal.

Other resources:

* [Full Release History](https://github.com/ripple/ripple-lib/blob/develop/HISTORY.md)
* [GitHub Issues](https://github.com/ripple/ripple-lib/issues)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)

## Other Information

### Bug Bounties and Responsible Disclosures

We welcome reviews of the codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

### Acknowledgements

On behalf of the XRP Community, we would like the thank those who have contributed to the development of the ripple-lib open source code, whether they did so by writing code, using the library, reporting issues, discovering bugs or offering suggestions for improvements.

### Contributors

The following is the list of people who made code contributions, large and small, to ripple-lib prior to the release of 1.0.0:

Abraham Tom, Adrian Hope-Bailie, Alan Cohen, Alex Choi, amougel, Andreas Brekken, Andrey Fedorov, Arthur Britto, Ben Sharafian, Bo Chen, Brad Chase, Brandon Wilson, Brian Clifton, Cheng Wei, Chris Clark, Chris Yuen, cryptcoin-junkey, Daniel Davis, Dan Quirk, Daren Tuzi, darkmemo, David Schwartz, Edward Hennis, Elliot Lee, Evan Schwartz, Ewald Moitzi, Filip Andersson, Franziska Hinkelmann, Fred K. Schott, FrRichard, Geert Weening, Hovhannes Kuloghlyan, Ivan Tivonenko, jatchili, Jed McCaleb, Jks Liu, Justin Lynn, lid, Liucw, Luke Burns, Madeline Shortt, Manish Jethani, Matthew Fettig, Mehul Kar, Michael Elsdörfer, Moe Adham, Mo Morsi, Nicholas Dudfield, Nicolás López Jullian, Niraj Pant, professorhantzen, Reed Rosenbluth, ripplerm, Rome Reginelli, Ryan Young, sentientwaffle, Stefan Thomas, Steven Zeiler, Vahe Hovhannisyan, Vinnie Falco, Waldir Pimenta, wltsmrz and Yeechan Lu.

We look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
