# レジャーエントリの短縮名

一部のAPIメソッド、特に[account_objectsメソッド][]と[ledger_dataメソッド][]では、返されるレジャーエントリをレジャーエントリのタイプでフィルタリングできます。指定するtypeフィールドには、[レジャーエントリ](../../protocol/ledger-data/ledger-entry-types/index.md)の正式名称と短縮名のどちらも使用できます。対応は次の表のとおりです。

「所有可能」列は、そのレジャーエントリタイプが所有者ディレクトリに含まれ得るかどうかを示します。所有可能でないレジャーエントリは`account_objects`のレスポンスに含まれることはなく、そのメソッドの`type`フィルタとして使用することもできません。

| 正式名称             | 短縮名                | 所有可能 | 関連するAmendment |
| -------------------- | --------------------- | ------- |---|
| `AccountRoot`        | `account`             | いいえ  | |
| `Amendments`         | `amendments`          | いいえ  | |
| `AMM`                | `amm`                 | いいえ  | {% amendment-disclaimer name="AMM" compact=true /%} |
| `Bridge`             | `bridge`              | はい    | {% amendment-disclaimer name="XChainBridge" compact=true /%} |
| `Check`              | `check`               | はい    | {% amendment-disclaimer name="Checks" compact=true /%} |
| `Credential`         | `credential`          | はい    | {% amendment-disclaimer name="Credentials" compact=true /%} |
| `Delegate`           | `delegate`            | はい    | {% amendment-disclaimer name="PermissionDelegationV1_1" compact=true /%} |
| `DepositPreauth`     | `deposit_preauth`     | はい    | {% amendment-disclaimer name="DepositPreauth" compact=true /%} |
| `DID`                | `did`                 | はい    | {% amendment-disclaimer name="DID" compact=true /%} |
| `DirectoryNode`      | `directory`           | いいえ  | |
| `Escrow`             | `escrow`              | はい    | |
| `FeeSettings`        | `fee`                 | いいえ  | |
| `LedgerHashes`       | `hashes`              | いいえ  | |
| `MPToken`            | `mptoken`             | はい    | {% amendment-disclaimer name="MPTokensV1" compact=true /%} |
| `MPTokenIssuance`    | `mpt_issuance`        | はい    | {% amendment-disclaimer name="MPTokensV1" compact=true /%} |
| `NegativeUNL`        | `nunl`                | いいえ  | {% amendment-disclaimer name="NegativeUNL" compact=true /%} |
| `NFTokenOffer`       | `nft_offer`           | はい    | {% amendment-disclaimer name="NonFungibleTokensV1_1" compact=true /%} |
| `NFTokenPage`        | `nft_page`            | はい    | {% amendment-disclaimer name="NonFungibleTokensV1_1" compact=true /%} |
| `Offer`              | `offer`               | はい    | |
| `Oracle`             | `oracle`              | はい    | {% amendment-disclaimer name="PriceOracle" compact=true /%} |
| `PayChannel`         | `payment_channel`     | はい    | |
| `PermissionedDomain` | `permissioned_domain` | はい    | {% amendment-disclaimer name="PermissionedDomains" compact=true /%} |
| `RippleState`        | `state`               | はい    | |
| `SignerList`         | `signer_list`         | はい    | |
| `Sponsorship`        | `sponsorship`         | はい    | {% amendment-disclaimer name="Sponsor" compact=true /%} |
| `Ticket`             | `ticket`              | はい    | {% amendment-disclaimer name="TicketBatch" compact=true /%} |
| `XChainOwnedClaimID` | `xchain_owned_claim_id` | はい  | {% amendment-disclaimer name="XChainBridge" compact=true /%} |
| `XChainOwnedCreate`<wbr>`AccountClaimID` | `xchain_owned_`<wbr>`create_account_claim_id` | はい | {% amendment-disclaimer name="XChainBridge" compact=true /%} |

<!-- 著者注: 長いxchain系の名前で表が横スクロールしないように<wbr>（改行可能位置）を使用しています。 -->

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
