<!-- TODO: update all the local links with their new locations -->

[Currency Amount]: reference-rippled-api-conventions.html#specifying-currency-amounts
[XRP, in drops]: reference-rippled-api-conventions.html#specifying-currency-amounts
[drops of XRP]: reference-rippled-api-conventions.html#specifying-currency-amounts

[Currency Code]: reference-rippled-api-conventions.html#currency-codes
[Address]: reference-rippled-api-conventions.html#addresses
[Hash]: reference-rippled-api-conventions.html#hashes
[Sequence Number]: reference-rippled-api-conventions.html#account-sequence
[Ledger Index]: reference-rippled-api-conventions.html#ledger-index
[universal error types]: reference-rippled-api-conventions.html#universal-errors
[Specifying Time]: reference-rippled-api-conventions.html#time
[base58]: https://en.wikipedia.org/wiki/Base58
[RFC-1751]: https://tools.ietf.org/html/rfc1751
[hexadecimal]: https://en.wikipedia.org/wiki/Hexadecimal
[admin command]: reference-rippled-intro.html#admin-connections
[standard format]: reference-rippled-intro.html#response-formatting
[seconds since the Ripple Epoch]: reference-rippled-api-conventions.html#time
[result code]: reference-transaction-results.html
[Specifying Ledgers]: reference-rippled-api-conventions.html#specifying-ledgers
[Marker]: reference-rippled-api-conventions.html#markers-and-pagination

[Interledger Protocol]: https://interledger.org/
[crypto-condition]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-03
[crypto-conditions]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-03

{% set api_methods = [
  "account_channels",
  "account_currencies",
  "account_info",
  "account_lines",
  "account_objects",
  "account_offers",
  "account_tx",
  "book_offers",
  "can_delete",
  "channel_authorize",
  "channel_verify",
  "connect",
  "consensus_info",
  "feature",
  "fee",
  "fetch_info",
  "gateway_balances",
  "get_counts",
  "json",
  "ledger",
  "ledger_accept",
  "ledger_cleaner",
  "ledger_closed",
  "ledger_current",
  "ledger_data",
  "ledger_entry",
  "ledger_request",
  "log_level",
  "logrotate",
  "noripple_check",
  "path_find",
  "peers",
  "ping",
  "print",
  "random",
  "ripple_path_find",
  "server_info",
  "server_state",
  "sign",
  "sign_for",
  "stop",
  "submit",
  "submit_multisigned",
  "subscribe",
  "transaction_entry",
  "tx",
  "tx_history",
  "unsubscribe",
  "validation_create",
  "validation_seed",
  "validator_list_sites",
  "validators",
  "wallet_propose"
] %}

{% for method in api_methods %}
[{{method}} method]: {{method|lower}}.html
[{{method}} command]: {{method|lower}}.html
{% endfor %}
