<!--{# Links within the dev portal #}-->
[Address]: basic-data-types.html#addresses
[admin command]: admin-rippled-methods.html
[base58]: base58-encodings.html
[common fields]: transaction-common-fields.html
[Currency Amount]: basic-data-types.html#specifying-currency-amounts
[Currency Code]: currency-formats.html#currency-codes
[drops of XRP]: basic-data-types.html#specifying-currency-amounts
[Hash]: basic-data-types.html#hashes
[identifying hash]: transaction-basics.html#identifying-transactions
[Internal Type]: serialization.html
[Ledger Index]: basic-data-types.html#ledger-index
[Marker]: markers-and-pagination.html
[result code]: transaction-results.html
[seconds since the Ripple Epoch]: basic-data-types.html#specifying-time
[Sequence Number]: basic-data-types.html#account-sequence
[SHA-512Half]: basic-data-types.html#hashes
[Specifying Currency Amounts]: basic-data-types.html#specifying-currency-amounts
[Specifying Ledgers]: basic-data-types.html#specifying-ledgers
[Specifying Time]: basic-data-types.html#specifying-time
[standard format]: response-formatting.html
[Transaction Cost]: transaction-cost.html
[transaction cost]: transaction-cost.html
[universal error types]: error-formatting.html#universal-errors
[XRP, in drops]: basic-data-types.html#specifying-currency-amounts

<!-- API object types -->
[AccountRoot object]: accountroot.html

<!--{# Links to external sites #}-->
[crypto-condition]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-03
[crypto-conditions]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-03
[hexadecimal]: https://en.wikipedia.org/wiki/Hexadecimal
[Interledger Protocol]: https://interledger.org/
[RFC-1751]: https://tools.ietf.org/html/rfc1751
[ripple-lib]: https://github.com/ripple/ripple-lib

<!--{# rippled API methods #}-->
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
  "crawl_shards",
  "deposit_authorized",
  "download_shard",
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

<!--{# Amendment links #}-->
{% set amendment_names = [
  "Checks",
  "CryptoConditions",
  "CryptoConditionsSuite",
  "DepositAuth",
  "DepositPreauth",
  "EnforceInvariants",
  "Escrow",
  "FeeEscalation",
  "fix1201",
  "fix1368",
  "fix1373",
  "fix1512",
  "fix1513",
  "fix1515",
  "fix1523",
  "fix1528",
  "fix1543",
  "fix1571",
  "fix1578",
  "fix1623",
  "fixTakerDryOfferRemoval",
  "Flow",
  "FlowCross",
  "FlowV2",
  "MultiSign",
  "MultiSignReserve",
  "OwnerPaysFee",
  "PayChan",
  "SHAMapV2",
  "SortedDirectories",
  "SusPay",
  "Tickets",
  "TickSize",
  "TrustSetAuth"
] %}

{% for amd in amendment_names %}
[{{amd}} amendment]: known-amendments.html#{{amd|lower}}
{% endfor %}
