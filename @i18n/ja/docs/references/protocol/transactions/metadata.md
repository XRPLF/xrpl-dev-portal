---
html: transaction-metadata.html
parent: transaction-formats.html
seo:
    description: トランザクションのメタデータは、トランザクションが成功したかどうかに関係なく、トランザクションの結果を詳細に記述します。
labels:
  - ブロックチェーン
---
# トランザクションのメタデータ

トランザクションのメタデータは、トランザクションの処理後にトランザクションに追加されるひとまとまりのデータです。レジャーに記録されるトランザクションは、トランザクションが成功するかどうかにかかわらず、メタデータを保持しています。トランザクションのメタデータには、トランザクションの結果の詳細が含まれます。

**警告:** トランザクションのメタデータに示された変更が最終的なものになるのは、トランザクションが検証済みバージョンのレジャーに記録された場合のみです。

以下に、トランザクションのメタデータに含まれる可能性があるフィールドをいくつか示します。

{% partial file="/@i18n/ja/docs/_snippets/tx-metadata-field-table.md" /%} 

## メタデータの例

次のJSONオブジェクトは、[複雑なクロスカレンシー支払い](https://livenet.xrpl.org/transactions/8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B)のメタデータを示しています。

{% code-snippet file="/_api-examples/metadata/cross-currency-payment.json" language="json" /%}

## AffectedNodes

`AffectedNodes`配列には、このトランザクションが何らかの変更を加えた[レジャーエントリ](../ledger-data/ledger-entry-types/index.md)の完全なリストが格納されます。この配列の各項目は、何が起こったかを示すトップレベルのフィールドを1つ持つオブジェクトです。

- `CreatedNode`: トランザクションが新しいレジャーエントリを作成したことを示します。
- `DeletedNode`: トランザクションが新しいレジャーエントリを削除したことを示します。
- `ModifiedNode`: トランザクションが既存のレジャーエントリを更新したことを示します。

これらの各フィールドの値は、レジャーエントリに行われた変更を記述するJSONオブジェクトです。

### CreatedNodeのフィールド

`CreatedNode`オブジェクトは次のフィールドを含みます。

| フィールド          | 値                  | 説明                                  |
|:------------------|:--------------------|:-------------------------------------|
| `LedgerEntryType` | 文字列               | 作成された[レジャーエントリの種類](../ledger-data/ledger-entry-types/index.md)。 |
| `LedgerIndex`     | 文字列 - [ハッシュ][] | レジャーの[状態ツリー](../../../concepts/ledgers/index.md)内のこの[レジャーエントリのID](../ledger-data/common-fields.md)。**注意:** 名前が非常に似ていますがこれは[レジャーインデックス](../data-types/basic-data-types.md#レジャーインデックス)とは**異なります**。 |
| `NewFields`       | オブジェクト          | 新しく作成されたレジャー エントリの内容を示すフィールド。どのフィールドが存在するかは、作成されたレジャーエントリの種類によって異なります。 |

### DeletedNodeのフィールド

`DeletedNode`オブジェクトは次のフィールドを含みます。

| フィールド          | 値                  | 説明                                  |
|:------------------|:--------------------|:-------------------------------------|
| `LedgerEntryType` | 文字列               | 削除された[レジャーエントリの種類](../ledger-data/ledger-entry-types/index.md)。 |
| `LedgerIndex`     | 文字列 - [ハッシュ][] | レジャーの[状態ツリー](../../../concepts/ledgers/index.md)内のこの[レジャーエントリのID](../ledger-data/common-fields.md)。**注意:** 名前が非常に似ていますがこれは[レジャーインデックス](../data-types/basic-data-types.md#レジャーインデックス)とは**異なります** |
| `FinalFields`     | オブジェクト          | 削除されたレジャーエントリの最後の内容を示すフィールド。どのフィールドが存在するかは、削除されたレジャーエントリの種類によって異なります。 |

### ModifiedNodeのフィールド

`ModifiedNode`オブジェクトは次のフィールドを含みます。

| フィールド            | 値                         | 説明                        |
|:--------------------|:---------------------------|:---------------------------|
| `LedgerEntryType`   | 文字列                      | 更新された[レジャーエントリの種類](../ledger-data/ledger-entry-types/index.md)。 |
| `LedgerIndex`       | 文字列 - [ハッシュ][]         | レジャーの[状態ツリー](../../../concepts/ledgers/index.md)内のこの[レジャーエントリのID](../ledger-data/common-fields.md)。**注意:** 名前が非常に似ていますがこれは[レジャーインデックス](../data-types/basic-data-types.md#レジャーインデックス)とは**異なります**。 |
| `FinalFields`       | オブジェクト                  | このトランザクションからの変更を適用した後のレジャーエントリの内容を示すフィールド。どのフィールドが存在するかは、作成されたレジャーエントリの種類によって異なります。ほとんどのタイプのレジャーエントリには`PreviousTxnID`フィールドと`PreviousTxnLgrSeq`フィールドがありますが、これは省略されます。 |
| `PreviousFields`    | オブジェクト                  | このトランザクションの結果として変更されたオブジェクトのすべてのフィールドの以前の値。トランザクションがオブジェクトにフィールドを追加しただけの場合、このフィールドは空のオブジェクトです。 |
| `PreviousTxnID`     | 文字列 - [ハッシュ][]         | _(省略可能)_ このレジャーエントリを変更する前のトランザクションの[識別用ハッシュ][]。`PreviousTxnID`フィールドを持たないレジャーエントリの種類では省略されます。 |
| `PreviousTxnLgrSeq` | 数値 - [レジャーインデックス][] | _(省略可能)_ このレジャーエントリを変更する前のトランザクションを含むレジャーバージョンの[レジャーインデックス][]。`PreviousTxnLgrSeq`フィールドを持たないレジャーエントリの種類では省略されます。 |

**注記:** 変更されたレジャーエントリに`PreviousTxnID`フィールドと`PreviousTxnLgrSeq`フィールドがある場合、トランザクションは常にトランザクションの識別ハッシュとトランザクションを含むレジャーバージョンのインデックスでそれらを更新しますが、これらのフィールドの新しい値は`ModifiedNode`オブジェクトの`FinalFields`にはリストされず、以前の値はネストされた`PreviousFields`オブジェクトではなく `ModifiedNode` オブジェクトのトップレベルにリストされます。

## NFTのフィールド

NFTを含むトランザクション（`tx` と `account_tx`）はメタデータに以下のフィールドを含むことができます。これらの値はリクエスト時にサーバによって追加され、ハッシュ化されたバイナリメタデータには格納されません。

| フィールド            | 値                        | 説明                        |
|:--------------------|:--------------------------|:---------------------------|
| `nftoken_id`        | 文字列                     | トランザクションの結果、レジャー上で変更された`NFToken`の`NFTokenID`を示します。トランザクションが`NFTokenMint`または`NFTokenAcceptOffer`の場合のみ表示されます。[NFTokenID](../data-types/nftoken.md#nftokenid)をご覧ください。 |
| `nftoken_ids`       | 配列                       | トランザクションの結果、レジャー上で変更された`NFToken`のすべての`NFTokenID`を表示します。トランザクションが `NFTokenCancelOffer`の場合のみ表示されます。 |
| `offer_id`          | 文字列                      | `NFTokenCreateOffer`トランザクションからのレスポンスに、新しい`NFTokenOffer`の`OfferID`を表示します。 |

## delivered_amount

[Paymentトランザクション][]によって`Destination`に実際送金された金額を表します。トランザクションが成功すると、**[Partial Payments](../../../concepts/payment-types/partial-payments.md)であった場合を除いて、** 宛先は当該の金額を受取ります（Partial Paymentsの場合、`Amount`を上限とする正の金額が受取られます）。`Amount`フィールドを信頼するかどうかを選択するのではなく、メタデータの`delivered_amount`フィールドを使用して、宛先に実際に到達する金額を確認してください。

トランザクションのメタデータの`delivered_amount`フィールドは、成功したすべてのPaymentトランザクションが保持しており、フォーマットは通常の通貨額と同様です。ただし、送金額は、以下の両方の条件に該当するトランザクションについては使用できません。

* Partial Paymentsである
* 2014-01-20よりも前の検証済みレジャーに含まれている

両方の条件に該当する場合、`delivered_amount`には、実際の金額ではなく文字列値`unavailable`が記述されます。この場合、トランザクションのメタデータにあるAffectedNodesを読み取ることが、実際に送金された金額を割り出せる唯一の手段になります。

**注記:** `delivered_amount`フィールドはリクエストに対してオンデマンドで生成され、トランザクションメタデータのバイナリフォーマットには含まれず、トランザクションメタデータの[ハッシュ](../data-types/basic-data-types.md#ハッシュ)を計算する際にも使用されません。一方、`DeliveredAmount`フィールドは2014-01-20以降のpartial paymentトランザクションのバイナリフォーマットに _含まれます_ 。

関連項目: [Partial Payments](../../../concepts/payment-types/partial-payments.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
