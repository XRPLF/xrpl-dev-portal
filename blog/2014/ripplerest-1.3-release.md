---
category: 2014
date: 2014-11-04
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# ripple-rest 1.3 release

Last Friday we did a master release of ripple-rest version 1.3.0. We’ve done a few changes externally but the substantial additions in 1.3.0 have been stability and verbose error handling. If you’ve been following the commits on [github](https://github.com/ripple/ripple-rest), we’ve also vastly improved test coverage and introduced simplicity by removing the need for Postgres.

Below is a list of some of the major changes and an explanation of the decisions we made for this last release.

-   **Improved error handling:** Error handling logic has been rewritten to provide clearer feedback for all requests. Prior to 1.3.0, an error could respond with a 200-299 range HTTP status code stating that the ripple-rest server was able to respond but the request may not have been successful. This put the burden on the developers to parse through the response body to determine whether something was successful or not. In version 1.3.0, ripple-rest will only return a “success” (200-299 range) when the actual request is successful and developers can expect that the response body will match what a successful request looks like. With actual errors and errors responses, ripple-rest will now include an error\_type (a short code identifying the error), an error (a human-readable summary), and an optional message (for longer explanation of errors if needed). Details [here](https://github.com/ripple/ripple-rest/blob/develop/README.old.md#errors).

-   **DB support for SQLite on disk, and removal of Postgres support:** Version 1.3.0 now directly supports both SQLite in memory and on disk. We've removed support for Postgres based on feedback that the installation has been a huge burden for the minimal amount of data that is stored in ripple-rest. The installation with SQLite is now much leaner and configuring a new database is as simple as pointing to a flat file location in the config.json. In the future, we may revisit adding additional database connectors for clustered and high availability deployments, but we’re much more keen on the usability and simplicity of only supporting SQLite at this point.

-   **Config.json 2.0:** The previous config.json 1.0.1 was confusing and disabling things like SSL required removal of lines inside the config file while environment variables could be set to overwrite config file values. We’ve cleaned up a lot of that messiness and we’ve modified the new config.json so that all configurations are fully transparent. SSL can be disabled simply by setting “ssl\_enabled” as false and in order to switch to SQLite in memory the “db\_path” should be set to “:memory:” instead of pointing to a flat file. Lastly, as a reminder to folks who didn’t know, ripple-rest does support a multi-server configuration in the array of “rippled\_servers”. Documentation on config file can be found [here](https://github.com/ripple/ripple-rest/blob/develop/docs/server-configuration.md)

-   **/v1/wallet/new endpoint:** Easy and simple way to generate ripple wallets! No explanation needed!

-   **Removed /v1/tx/{:hash} and /v1/transaction/{:hash}:** Use \`/**v1/transactions/{:hash}\`**. This change serves to provide consistency with REST standards.

-   **Removed /v1/payments:** Use \`**/v1/accounts/{source\_address}/payments\`** to submit a payment. This change serves to provide consistency in the payment flow.

We appreciate the continued feedback from those of you who are building integrations with ripple-rest and appreciate all the support that you’ve given us so far.
