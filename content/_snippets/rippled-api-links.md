<!--{# Links within the dev portal #}-->
[Address]: basic-data-types.html#addresses
[アドレス]: basic-data-types.html#アドレス
[admin command]: admin-rippled-methods.html
[base58]: base58-encodings.html
[common fields]: transaction-common-fields.html
[Currency Amount]: basic-data-types.html#specifying-currency-amounts
[通貨額]: basic-data-types.html#通貨額の指定
[通貨額の指定]: basic-data-types.html#通貨額の指定
[Currency Code]: currency-formats.html#currency-codes
[通貨コード]: currency-formats.html#通貨コード
[drops of XRP]: basic-data-types.html#specifying-currency-amounts
[fee levels]: transaction-cost.html#fee-levels
[XRPのdrop数]: basic-data-types.html#通貨額の指定
[Hash]: basic-data-types.html#hashes
[ハッシュ]: basic-data-types.html#ハッシュ
[identifying hash]: transaction-basics.html#identifying-transactions
[Internal Type]: serialization.html
[内部の型]: serialization.html
[Ledger Index]: basic-data-types.html#ledger-index
[ledger index]: basic-data-types.html#ledger-index
[レジャーインデックス]: basic-data-types.html#レジャーインデックス
[ledger format]: ledger-data-formats.html
[Marker]: markers-and-pagination.html
[マーカー]: markers-and-pagination.html
[node public key]: peer-protocol.html#node-key-pair
[node key pair]: peer-protocol.html#node-key-pair
[peer reservation]: peer-protocol.html#fixed-peers-and-peer-reservations
[peer reservations]: peer-protocol.html#fixed-peers-and-peer-reservations
[result code]: transaction-results.html
[seconds since the Ripple Epoch]: basic-data-types.html#specifying-time
[Rippleエポック以降の経過秒数]: basic-data-types.html#時間の指定
[Sequence Number]: basic-data-types.html#account-sequence
[シーケンス番号]: basic-data-types.html#アカウントシーケンス
[SHA-512Half]: basic-data-types.html#hashes
[SHA-512ハーフ]: basic-data-types.html#ハッシュ
[Specifying Currency Amounts]: basic-data-types.html#specifying-currency-amounts
[Specifying Ledgers]: basic-data-types.html#specifying-ledgers
[レジャーの指定]: basic-data-types.html#レジャーの指定
[Specifying Time]: basic-data-types.html#specifying-time
[時間の指定]: basic-data-types.html#時間の指定
[standard format]: response-formatting.html
[標準フォーマット]: response-formatting.html
[Transaction Cost]: transaction-cost.html
[transaction cost]: transaction-cost.html
[トランザクションコスト]: transaction-cost.html
[universal error types]: error-formatting.html#universal-errors
[汎用エラータイプ]: error-formatting.html#汎用エラー
[XRP, in drops]: basic-data-types.html#specifying-currency-amounts
[XRP、drop単位]: basic-data-types.html#通貨額の指定

<!-- API object types -->
[AccountRoot object]: accountroot.html

<!--{# Links to external sites #}-->
[crypto-condition]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-04
[crypto-conditions]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-04
[Crypto-Conditions Specification]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-04
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
  "peer_reservations_add",
  "peer_reservations_del",
  "peer_reservations_list",
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
{% if target.lang == "ja" %}
[{{method}}メソッド]: {{method|lower}}.html
{% endif %}
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
  "fixMasterKeyAsRegularKey",
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
