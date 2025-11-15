# Walk Owner Directory
Iterate over an account's owner directory and display how many ledger entries are in each page. In cases of highly active accounts, this can demonstrate the extent of "fragmentation" with skipped page numbers and non-full pages.

This code sample demonstrates the low-level structure of owner directories. If you don't need to see the breakdown by pages, you can use [`account_objects`](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects) instead, since it provides a more convenient list of ledger entries attached to an account.
