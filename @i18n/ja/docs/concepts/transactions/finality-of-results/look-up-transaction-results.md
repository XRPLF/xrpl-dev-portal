---
html: look-up-transaction-results.html
parent: finality-of-results.html
seo:
    description: 以前に送信したトランザクションの結果を確認します。
labels:
  - 支払い
  - 開発
---
# トランザクションの結果の確認

XRP Ledgerを効果的に使用するには、[トランザクション](../index.md)の結果を次のように把握することが重要です。トランザクションは成功したか？トランザクションは何を遂行したか？失敗した場合は、なぜか？

XRP Ledgerは共有システムとなっていて、すべてのデータが公開された形で正確に記録され、データはそれぞれ新しい[レジャーバージョン](../../ledgers/index.md)で安全に更新されます。誰もが任意のトランザクションの結果を確認し、[トランザクションメタデータ](../../../references/protocol/transactions/metadata.md)によってその実行内容を確認できます。

このドキュメントでは、トランザクションの結果がもたらされた理由を把握する方法について、詳細に説明します。エンドユーザ向けには、トランザクションの処理内容を表示するとわかりやすいです。例えば、[XRPチャートを使用して、記録されたトランザクションについての説明を英語で参照](https://xrpcharts.ripple.com/#/transactions/)できます。

## 前提条件

これらの手順で説明されているトランザクションの結果を理解するには、以下が必要となります。

- 理解する対象となるトランザクションがわかっている。トランザクションの[識別用ハッシュ][]がわかっていれば、それによりトランザクションを検索できます。また、最近のレジャーで実行されたトランザクションまたは特定のアカウントに最後に影響を及ぼしたトランザクションを確認することもできます。
- 信頼できる情報と、トランザクションの送信日時に関する必要な履歴を提供する`rippled`サーバにアクセスできる。
  - 最近送信したトランザクションの結果を確認する場合、トランザクションの送信時に使用したサーバがネットワークと同期されていれば、そのサーバにアクセスできるだけで十分です。
  - 古いトランザクションの結果については、[全履歴を記録するサーバ](../../networks-and-servers/ledger-history.md#すべての履歴)を使用できます。

**ヒント:** この他にも、[Data API](../../../references/data-api.md)やエクスポートされた他のデータベースを使用するなど、XRP Ledgerからトランザクションのデータを照会する方法があります。ただし、これらのインターフェイスは正式なものではありません。このドキュメントでは、最も直接的で信頼できる結果を得るために、`rippled` APIを直接使用してデータを確認する方法を説明します。


## 1. トランザクションステータスの取得

トランザクションが成功したか失敗したかを確認するには、2つの問いが必要です。

1. トランザクションが検証済みレジャーに記録されたか。
2. 記録されていた場合、結果としてレジャーの状態はどのように変化したか。

検証済みレジャーにトランザクションが記録されていたかどうかを確認するには、通常、トランザクションが記録されている可能性のあるすべてのレジャーにアクセスする必要があります。最も簡単で確実な方法は、[全履歴を記録するサーバ](../../networks-and-servers/ledger-history.md#すべての履歴)でトランザクションを検索する方法です。[txメソッド][]、[account_txメソッド][]またはその他の`rippled`からのレスポンスを使用します。コンセンサスにより検証されたレジャーバージョンがこのレスポンスに使用されていることを示す`"validated": true`を検索します。

- 結果に`"validated": true`がない場合は、その結果は一時的である可能性があり、トランザクションの結果が最終的なものであるかどうかを知るには、レジャーが検証されるまで待機する必要があります。
- 結果に目的のトランザクションが含まれていない場合、または`txnNotFound`エラーが返される場合は、サーバにある利用可能な履歴に保存されているどのレジャーにもそのトランザクションはありません。ただし、このことだけでトランザクションが失敗したかどうかを判断できないことがあります。サーバに保存されていない検証済みレジャーバージョンにトランザクションが記録されている、または今後検証されるレジャーにトランザクションが記録されている場合があるためです。以下を把握することで、トランザクションが記録されるレジャーの範囲を制限することができます。
  - トランザクションが記録されている可能性のある最古のレジャー。つまり、**トランザクションを初めて送信した _後に_ 最初に検証されるレジャー**。
  - トランザクションが記録されている可能性のある最新のレジャー。つまり、トランザクションの`LastLedgerSequence`フィールドで定義されるレジャー

以下の例では、成功したトランザクションが[txメソッド][]によって返され、検証済みレジャーバージョンに記録されています。わかりやすくするために、JSONレスポンスのフィールドの順序を並べ替え、一部を省略しています。

```json
{
  "TransactionType": "AccountSet",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Sequence": 376,
  "hash": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",

  ... (省略) ...

  "meta": {
    "AffectedNodes": [
      ... (省略) ...
    ],
    "TransactionResult": "tesSUCCESS"
  },
  "ledger_index": 46447423,
  "validated": true
}
```

この例では、rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpnというアドレスを持つ[アカウント](../../accounts/index.md)が、[シーケンス番号][] 376を使用して、[AccountSetトランザクション][]を送信したことを示しています。トランザクションの[識別用ハッシュ][]は`017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567`で、その[結果](../../../references/protocol/transactions/transaction-results/index.md)は`tesSUCCESS`です。トランザクションは、検証済みのレジャーバージョン46447423に記録されたため、結果は最終的なものです。


### ケース: 検証済みレジャーに記録されていない

**トランザクションが検証済みレジャーに記録されていない場合は、共有XRP Ledgerの状態には _いかなる_ 影響も及ぼしません。** 今後レジャーに記録されるトランザクションの失敗が[_最終的_](index.md)となる場合、その失敗が将来影響を及ぼすことはありません。

トランザクションの失敗が最終的でない場合は、 _将来の_ 検証済みレジャーに記録される可能性があります。トランザクションを現在のオープンレジャーに適用して得た暫定的な結果から、トランザクションが最終レジャーに及ぼすと思われる影響を事前に確認できます。ただし、実際の結果は[さまざまな要因](index.md#未確定の結果はどのように変更できますか)によって変わる場合があります。


### ケース: 検証済みレジャーに記録されている

トランザクションが検証済みレジャーに記録 _されている_ 場合、[トランザクションメタデータ](../../../references/protocol/transactions/metadata.md)にはトランザクションの処理結果として、レジャーの状態に対して行われたすべての変更を網羅したレポートが含まれます。メタデータの`TransactionResult`フィールドには、以下のような、結果を要約した[トランザクション結果コード](../../../references/protocol/transactions/transaction-results/index.md)が含まれます。

- コード`tesSUCCESS`は、トランザクションが、おおよそ成功したことを示します。
- `tec`-クラスコードは、トランザクションが失敗したことを示します。このことがレジャーの状態に及ぼす影響は、XRP[トランザクションコスト](../transaction-cost.md)を消却し、場合によっては[有効期限切れのオファー](../../tokens/decentralized-exchange/offers.md#オファーの有効期限)の削除および[Payment Channelの閉鎖](../../payment-types/payment-channels.md#payment-channelのライフサイクル)などのブックキーピングを行うことだけです。
- どのレジャーにもその他のコードは表示されません。

結果コードは、トランザクションの結果の要約にすぎません。トランザクションの実行内容を詳しく理解するには、トランザクションの指示とトランザクションの実行前のレジャーの状態に照らして残りのメタデータを確認する必要があります。


## 2. メタデータの解釈

トランザクションメタデータは、以下に示すフィールドをはじめとして、トランザクションがレジャーに適用された方法を _正確に_ 示します。

{% partial file="/@i18n/ja/docs/_snippets/tx-metadata-field-table.md" /%} 

ほとんどのメタデータは、[`AffectedNodes`配列](../../../references/protocol/transactions/metadata.md#affectednodes)に含まれています。この配列で探す対象は、トランザクションのタイプによって異なります。ほぼすべてのトランザクションが、送金元の[AccountRootオブジェクト][]を変更してXRP[トランザクションコスト](../transaction-cost.md)を消却し、[アカウントのシーケンス番号](../../../references/protocol/data-types/basic-data-types.md#アカウントシーケンス)を増やします。

**情報:** このルールの例外として[疑似トランザクション](../../../references/protocol/transactions/pseudo-transaction-types/pseudo-transaction-types.md)があります。このトランザクションは実在するアカウントから送信されないため、AccountRootオブジェクトを変更しません。その他の例外として、AccountRootオブジェクトの`Balance`フィールドを変更せずに、AccountRootオブジェクトを変更するトランザクションがあります。[Free Key Resetトランザクション](../transaction-cost.md#key-resetトランザクション)の場合、送金元のXRP残高は変わりません。トランザクションによって消却される金額と同額のXRPをアカウントが受け取る場合（ただし、このようなことはほとんどありません）、そのアカウントの正味残高は変わりません。（XRPを受領したアカウントに関係なくトランザクションコストはメタデータの別の場所に反映されます。）

以下は、上記のステップ1からのレスポンス全文例です。レジャーに対して行われた変更を把握できるか確認してください。

```json
{
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Fee": "12",
  "Flags": 2147483648,
  "LastLedgerSequence": 46447424,
  "Sequence": 376,
  "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
  "TransactionType": "AccountSet",
  "TxnSignature": "30450221009B2910D34527F4EA1A02C375D5C38CF768386ACDE0D17CDB04C564EC819D6A2C022064F419272003AA151BB32424F42FC3DBE060C8835031A4B79B69B0275247D5F4",
  "date": 608257201,
  "hash": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",
  "inLedger": 46447423,
  "ledger_index": 46447423,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
          "FinalFields": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "AccountTxnID": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",
            "Balance": "396015164",
            "Domain": "6D64756F31332E636F6D",
            "EmailHash": "98B4375E1D753E5B91627516F6D70977",
            "Flags": 8519680,
            "MessageKey": "0000000000000000000000070000000300",
            "OwnerCount": 9,
            "Sequence": 377,
            "TransferRate": 4294967295
          },
          "PreviousFields": {
            "AccountTxnID": "E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF",
            "Balance": "396015176",
            "Sequence": 376
          },
          "PreviousTxnID": "E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF",
          "PreviousTxnLgrSeq": 46447387
        }
      }
    ],
    "TransactionIndex": 13,
    "TransactionResult": "tesSUCCESS"
  },
  "validated": true
}
```

この[no-opトランザクション](canceling-a-transaction.md)によって行われた _唯一_ の変更は[AccountRootオブジェクト][]の更新で、送金元のアカウントは以下のように表されています。

- `Sequence`値は376から377に増えます。

- このアカウントのXRPの`Balance`は、`396015176`から`396015164`（[XRPのdrop数][]）に変わります。残高から差し引かれた12dropは[トランザクションコスト](../transaction-cost.md)で、このトランザクションの`Fee`フィールドに指定されています。

- このトランザクションが、このアドレスから送信された最新のトランザクションとなったことを反映して[`AccountTxnID`](../../../references/protocol/transactions/common-fields.md#accounttxnid)が変わります。

- このアカウントに影響を及ぼした以前のトランザクションは、レジャーバージョン46447387で実行されたトランザクション`E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF`で、`PreviousTxnID`および`PreviousTxnLgrSeq`フィールドに指定されています。（このことは、アカウントのトランザクション履歴をさかのぼる際に役立つ場合があります。）

  **注記:** メタデータには明示的に示されませんが、トランザクションがレジャーオブジェクトを変更すると、必ずそのオブジェクトの`PreviousTxnID`および`PreviousTxnLgrSeq`フィールドが現在のトランザクションの情報で更新されます。同じ送金元の複数のトランザクションが1つのレジャーバージョンに含まれている場合、最初のトランザクション以降の各トランザクションは、これらすべてのトランザクションを記録するレジャーバージョンの[レジャーインデックス](../../../references/protocol/data-types/basic-data-types.md#レジャーインデックス)を値とする`PreviousTxnLgrSeq`を提供します。

rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpnのアカウントの`ModifiedNode`エントリが`AffectedNodes`配列の唯一のオブジェクトであるため、このトランザクションの結果として、このレジャーに対してその他の変更は行われませんでした。

**ヒント:** トランザクションによってXRPが送信または受信される場合、送金元の残高の変動額はトランザクションコストと合算され、`Balance`フィールドの正味金額は1回で変更されます。例えば、1XRP（1,000,000drop）を送信し、トランザクションコストで10drop消却した場合、メタデータには`Balance`が1,000,010（XRPのdrop数）減少したと示されます。

### 汎用的なブックキーピング

ほぼすべてのトランザクションにより、以下のような変更が行われます。

- **シーケンスとトランザクションコストの変更:** 送金元のシーケンス番号を増やし、トランザクションコストの支払いに使用するXRPを消却するために、[前述のとおりどのトランザクション（疑似トランザクションを除く）も、送金元の`AccountRoot`オブジェクトに変更を加えます](#2-メタデータの解釈)。
- **アカウントのスレッド化:** オブジェクトを作成する一部のトランザクションでは、目的の受取人または宛先のアカウントの[AccountRootオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md)も変更し、そのアカウントに関連する何らかの要素が変更されたことを示します。このアカウントを「タグ付け」する手法で、オブジェクトの`PreviousTxnID`および`PreviousTxnLgrSeq`フィールドのみを変更します。これにより、これらのフィールドに指定されたトランザクションの「スレッド」を追跡することで、アカウントが保持するアカウントのトランザクション履歴を効率よく検索することができます。
- **ディレクトリーの更新:** レジャーオブジェクトを作成または削除するトランザクションは、多くの場合[DirectoryNodeオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/directorynode.md)を変更して、どのオブジェクトが存在しているかを追跡します。また、トランザクションによって、アカウントの[所有者準備金](../../accounts/reserves.md#所有者準備金)に反映されるオブジェクトが追加されると、所有者の[AccountRootオブジェクト][]の`OwnerCount`が増加します。オブジェクトを削除すると、`OwnerCount`が減少します。

アカウントの`OwnerCount`を増やす例:

```json
{
  "ModifiedNode": {
    "FinalFields": {
      "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "Balance": "9999999990",
      "Flags": 0,
      "OwnerCount": 1,
      "Sequence": 2
    },
    "LedgerEntryType": "AccountRoot",
    "LedgerIndex": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
    "PreviousFields": {
      "Balance": "10000000000",
      "OwnerCount": 0,
      "Sequence": 1
    },
    "PreviousTxnID": "B24159F8552C355D35E43623F0E5AD965ADBF034D482421529E2703904E1EC09",
    "PreviousTxnLgrSeq": 16154
  }
}
```

多くのトランザクションのタイプで、[DirectoryNodeオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/directorynode.md)が作成または変更されます。これらのオブジェクトは、ブックキーピングに使用します。アカウントが所有するすべてのオブジェクト、またはすべてのオファーを追跡して、同じ為替レートで通貨を交換します。トランザクションがレジャーに新しいオブジェクトを作成した場合、トランザクションは既存のDirectoryNodeオブジェクトにエントリを追加するか、別のDirectoryNodeオブジェクトを追加してディレクトリーの別のページを表さなければならないことがあります。トランザクションがレジャーからオブジェクトを削除した場合、トランザクションは不要となった1つ以上のDirectoryNodeオブジェクトを削除しなければならないことがあります。

新しいオファーディクトリーを表すCreatedNodeの例:

```json
{
  "CreatedNode": {
    "LedgerEntryType": "DirectoryNode",
    "LedgerIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93",
    "NewFields": {
      "ExchangeRate": "4E11C37937E08000",
      "RootIndex": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93",
      "TakerPaysCurrency": "0000000000000000000000004254430000000000",
      "TakerPaysIssuer": "5E7B112523F68D2F5E879DB4EAC51C6698A69304"
    }
  }
},
```

トランザクションメタデータを処理する際に探すその他の項目は、トランザクションのタイプによって異なります。

### 支払い

[Paymentトランザクション][]はXRP間の直接トランザクション、[クロスカレンシー支払い](../../payment-types/cross-currency-payments.md)、または[（XRP以外の）トークン](../../tokens/index.md)での直接トランザクションを表します。トークンからXRPへのトランザクション、またはXRPからトークンへのトランザクションなど、XRP間の直接トランザクション以外はすべて[partial payment](../../payment-types/partial-payments.md)が可能です。

XRPの額は、`AccountRoot`オブジェクトの`Balance`フィールドで追跡されます。（XRPは[Escrowオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)および[PayChannelオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/paychannel.md)にも存在する可能性がありますが、Paymentトランザクションがそれらに影響を及ぼすことはありません。）

支払いでいくら支払われたかを確認するには、必ず[delivered_amountフィールド](../../payment-types/partial-payments.md#delivered_amountフィールド)を使用する必要があります。

支払いにLedgerEntryTypeが`AccountRoot`の`CreatedNode`が含まれている場合は、その支払いによってレジャーの[新しいアカウントへの資金供給](../../accounts/index.md#アカウントの作成)が行われたことを意味します。

#### トークンでの支払い

トークンを利用する支払いは、多少複雑です。

トークン残高の変更は、[トラストライン](../../tokens/fungible-tokens/index.md)を表す[RippleStateオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md)にすべて反映されます。一方の当事者のトラストラインで残高が増加すると、相手側当事者の残高は同じ額だけ減少すると考えられます。このことは、メタデータには、RippleStateオブジェクトの共有`Balance`に対する1回の変更としてのみ記録されます。この変更が「増加」または「減少」のどちらで記録されるかは、どちらのアカウントのアドレスが数値として大きいかによって決まります。

1回の支払いは、複数のトラストラインとオーダーブックで構成される長い[パス](../../tokens/fungible-tokens/paths.md)をたどる場合があります。間接的に当事者間を接続する複数のトラストラインの残高を変更するプロセスを[Rippling](../../tokens/fungible-tokens/rippling.md)と呼びます。トランザクションの`Amount`フィールドに指定された`issuer`に応じて、支払先アカウントに結び付けられている複数のトラストライン（`RippleState`アカウント）で支払額を分割することもできます。

**ヒント:** 変更されたオブジェクトがメタデータに表示される順序は、支払いを処理するときにこれらのオブジェクトにアクセスした順序とは必ずしも一致しません。`AffectedNodes`メンバーを並べ替えて資金がレジャーまでたどったパスを再構成すると、支払いの実行の詳細を把握しやすくなります。

クロスカレンシー支払いでは、[オファー](../../../references/protocol/ledger-data/ledger-entry-types/offer.md)の一部または全額を消費して、通貨コードとイシュアーが異なる通貨間で変更が行われます。トランザクションで`Offer`タイプの`DeletedNode`オブジェクトが示される場合は、全額が消費されたオファーを示しているか、または処理の時点で[期限切れになるか、または資金化されない](../../tokens/decentralized-exchange/offers.md#オファーのライフサイクル)ことがわかったオファーを示している可能性があります。トランザクションで`Offer`タイプの`ModifiedNode`が示される場合は、オファーの一部が消費されたことを示します。

[トラストラインの`QualityIn`および`QualityOut`設定](../../../references/protocol/transactions/types/trustset.md)は、トラストラインの一方の側におけるトークンの金額に影響を与える可能性があるため、残高の数値の変化は、送金元におけるその通貨の額と異なります。`delivered_amount`は、受取人による評価額でいくら送金されたのかを示します。

送金額と受取額が[トークンの精度](../../../references/protocol/data-types/currency-formats.md#トークンの精度)の範囲外である場合は、一方のトランザクションで0に丸められる金額が、他方から引き出される可能性があります。そのため、両当事者が、お互いの残高に10<sup>16</sup>倍の差があるときに取引をすると、丸めることによって少額のトークンが「作成」または「消却」される可能性があります。（XRPは丸められないので、XRPではこの状況は発生しません。）

[パス](../../tokens/fungible-tokens/paths.md)の長さに応じて、クロスカレンシー支払いのメタデータは _長く_ なります。例えば、[トランザクション8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B](https://xrpcharts.ripple.com/#/transactions/8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B)では、rHaaans...が発行した2.788 GCBを送金しXRPを支払いますが、2人のイシュアーのUSDを経由し、2つのアカウントにXRPを支払います。r9ZoLsJからのEURをETHと交換する資金供給されていないオファーを削除し、変更された合計17の異なるレジャーオブジェクトのブックキーピングを行います。

### オファー

[OfferCreateトランザクション][]では、成立した額や、トランザクションが`tfImmediateOrCancel`などのフラグを使用したかどうかによって、レジャーにオブジェクトが作成される場合と作成されない場合があります。トランザクションがレジャーのオーダーブックに新しいオファーを追加したどうかを確認するには、LedgerEntryTypeが`Offer`の`CreatedNode`エントリを探します。例:

```json
{
  "CreatedNode": {
    "LedgerEntryType": "Offer",
    "LedgerIndex": "F39B13FA15AD2A345A9613934AB3B5D94828D6457CCBB51E3135B6C44AE4BC83",
    "NewFields": {
      "Account": "rETSmijMPXT9fnDbLADZnecxgkoJJ6iKUA",
      "BookDirectory": "CA462483C85A90DB76D8903681442394D8A5E2D0FFAC259C5B0C59269BFDDB2E",
      "Expiration": 608427156,
      "Sequence": 1082535,
      "TakerGets": {
        "currency": "EUR",
        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
        "value": "2157.825"
      },
      "TakerPays": "7500000000"
    }
  }
}
```

タイプ`Offer`の`ModifiedNode`は、成立し、かつ一部が消費されたオファーを示します。1つのトランザクションで多数のオファーを消費できます。2種類のトークンを交換するオファーが、[オートブリッジング](../../tokens/decentralized-exchange/autobridging.md)によってXRPを交換するオファーを消費することもあります。両替取引のすべてまたは一部をオートブリッジングできます。

LedgerEntryTypeが`Offer`の`DeletedNode`は、すべて消費された成立オファー、処理の時点で[期限切れになるか、または資金化されない](../../tokens/decentralized-exchange/offers.md#オファーのライフサイクル)ことがわかったオファー、または新しいオファーを発行する過程でキャンセルされたオファーを示すことができます。キャンセルされたオファーは識別できます。これは、キャンセルされたオファーを発行した`Account`は、そのオファーを削除するトランザクションの送信元であるためです。

削除されたオファーの例:

```json
{
  "DeletedNode": {
    "FinalFields": {
      "Account": "rETSmijMPXT9fnDbLADZnecxgkoJJ6iKUA",
      "BookDirectory": "CA462483C85A90DB76D8903681442394D8A5E2D0FFAC259C5B0C595EDE3E1EE9",
      "BookNode": "0000000000000000",
      "Expiration": 608427144,
      "Flags": 0,
      "OwnerNode": "0000000000000000",
      "PreviousTxnID": "0CA50181C1C2A4D45E9745F69B33FA0D34E60D4636562B9D9CDA1D4E2EFD1823",
      "PreviousTxnLgrSeq": 46493676,
      "Sequence": 1082533,
      "TakerGets": {
        "currency": "EUR",
        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
        "value": "2157.675"
      },
      "TakerPays": "7500000000"
    },
    "LedgerEntryType": "Offer",
    "LedgerIndex": "9DC99BF87F22FB957C86EE6D48407201C87FBE623B2F1BC4B950F83752B55E27"
  }
}
```

オファーでは、両方のタイプの[DirectoryNodeオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/directorynode.md)を作成、削除、変更して、オファーの発行者と、どのオファーがどのような為替レートで利用可能になっているのかを追跡できます。一般的に、ユーザがこのブックキーピングに細かな注意を払う必要はありません。

削除するオファーがなかった場合でも、[OfferCancelトランザクション][]には、コード`tesSUCCESS`が含まれる可能性があります。トランザクションが実際にオファーを削除したことを確認するには、LedgerEntryTypeが`Offer`の`DeletedNode`を探します。削除されていなかった場合は、そのオファーは以前のトランザクションによってすでに削除された可能性があります。またはOfferCancelトランザクションで、`OfferSequence`フィールドに誤ったシーケンス番号が使用された可能性があります。

OfferCreateトランザクションが、タイプが`RippleState`の`CreatedNode`を示す場合は、取引で受け取ったトークンを保持するために、[オファーがトラストラインを作成した](../../tokens/decentralized-exchange/offers.md#オファーとトラスト)ことを示しています。

### Escrow

成功した[EscrowCreateトランザクション][]は、レジャーに[Escrowオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)を作成します。LedgerEntryTypeが`Escrow`の`CreatedNode`エントリを探します。`NewFields`には、escrowに預託されたXRPと同じ`Amount`と、指定したその他のプロパティが示されます。

成功したEscrowCreateトランザクションは、送金元から同じ額のXRPを引き出します。最終的なフィールドの`Account`がトランザクションの指示にある`Account`のアドレスと一致する、LedgerEntryTypeが`AccountRoot`の`ModifiedNode`を探します。XRPの`Balance`は、（トランザクションコストの支払いのためにXRPが消却されたのに加えて）XRPがescrowに預託されたため減少します。

成功した[EscrowFinishトランザクション][]は、受取人の`AccountRoot`を変更して（`Balance`フィールドの）XRP残高を増やし、`Escrow`オブジェクトを削除し、escrow作成者の所有者数を減らします。escrow作成者、受取人および終了者をすべて異なるアカウントにしても、同じアカウントにしてもかまわないため、結果としてLedgerEntryTypeが`AccountRoot`の`ModifiedNode`オブジェクトが _1～3個_ になる可能性があります。XRPがescrowの最初の作成者に返されることを除けば、成功した[EscrowCancelトランザクション][]は極めて類似しています。

EscrowFinishは、escrowの条件を満たす場合にのみ成功し、EscrowCancelはEscrowオブジェクトの期限が前のレジャーの閉鎖時刻よりも前である場合にのみ成功します。

Escrowトランザクションでは、関係する送金元の所有者準備金やアカウントのディレクトリーを調整するために通常の[ブックキーピング](#汎用的なブックキーピング)も行われます。

次に示すコードの抜粋では、r9UUEX...の残高が10億XRP増加し、その所有者の数が1人減少しています。これは、そのアカウントからの自分自身へのescrowが正常に終了したためです。[第三者がescrowを完了した](https://xrpcharts.ripple.com/#/transactions/C4FE7F5643E20E7C761D92A1B8C98320614DD8B8CD8A04CFD990EBC5A39DDEA2)ため`Sequence`番号は変更されません。

```json
{
 "ModifiedNode": {
    "FinalFields": {
      "Account": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",
      "Balance": "1650000199898000",
      "Flags": 1048576,
      "OwnerCount": 11,
      "Sequence": 23
    },
    "LedgerEntryType": "AccountRoot",
    "LedgerIndex": "13FDBC39E87D9B02F50940F9FDDDBFF825050B05BE7BE09C98FB05E49DD53FCA",
    "PreviousFields": {
      "Balance": "650000199898000",
      "OwnerCount": 12
    },
    "PreviousTxnID": "D853342BC27D8F548CE4D7CB688A8FECE3229177790453BA80BC79DE9AAC3316",
    "PreviousTxnLgrSeq": 41005507
  }
},
{
  "DeletedNode": {
    "FinalFields": {
      "Account": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",
      "Amount": "1000000000000000",
      "Destination": "r9UUEXn3cx2seufBkDa8F86usfjWM6HiYp",
      "FinishAfter": 589075200,
      "Flags": 0,
      "OwnerNode": "0000000000000000",
      "PreviousTxnID": "D5FB1C7D18F931A4FBFA468606220560C17ADF6DE230DA549F4BD11A81F19DFC",
      "PreviousTxnLgrSeq": 35059548
    },
    "LedgerEntryType": "Escrow",
    "LedgerIndex": "62F0ABB58C874A443F01CDCCA18B12E6DA69C254D3FB17A8B71CD8C6C68DB74D"
  }
},
```

### Payment Channel

Payment Channelの作成時に、LedgerEntryTypeが`PayChannel`の`CreatedNode`を探します。また、送金元の残高の減少を示す、LedgerEntryTypeが`AccountRoot`の`ModifiedNode`も探す必要があります。アドレスが送金元に一致することを確認するために`FinalFields`の`Account`フィールドを探し、XRP残高の変化を確認するために`Balance`フィールドの差異を確認します。

[fixPayChanRecipientOwnerDir Amendment](/resources/known-amendments.md#fixpaychanrecipientownerdir)が有効な場合は、メタデータは宛先のアカウントの[所有者ディレクトリー](../../../references/protocol/ledger-data/ledger-entry-types/directorynode.md)を変更して、新しく作成されるPayment Channelをリストで示す必要もあります。これにより、アカウントがオープンPayment Channelの受取人である場合に、そのアカウントが[削除される](../../accounts/deleting-accounts.md)ことを防ぎます。（fixPayChanRecipientOwnerDir Amendmentが有効になる前にPayment Channelが作成された場合は、アカウントを削除できます。）

Payment Channelの閉鎖を要求する方法は、Payment Channelの不変の`CancelAfter`時刻（作成時にのみ設定されます）以外にもいくつかあります。トランザクションでChannelの閉鎖をスケジュールする場合は、そのChannel用にLedgerEntryTypeが`PayChannel`の`ModifiedNode`エントリがあり、`FinalFields`の`Expiration`フィールドには閉鎖時刻が新たに追加されています。以下の例は、送金元がクレームを清算せずにChannelを閉鎖するよう要求した場合に`PayChannel`に対して行われる変更を示します。

```json
{
  "ModifiedNode": {
    "FinalFields": {
      "Account": "rNn78XpaTXpgLPGNcLwAmrcS8FifRWMWB6",
      "Amount": "1000000",
      "Balance": "0",
      "Destination": "rwWfYsWiKRhYSkLtm3Aad48MMqotjPkU1F",
      "Expiration": 608432060,
      "Flags": 0,
      "OwnerNode": "0000000000000002",
      "PublicKey": "EDEACA57575C6824FC844B1DB4BF4AF2B01F3602F6A9AD9CFB8A3E47E2FD23683B",
      "SettleDelay": 3600,
      "SourceTag": 1613739140
    },
    "LedgerEntryType": "PayChannel",
    "LedgerIndex": "DC99821FAF6345A4A6C41D5BEE402A7EA9198550F08D59512A69BFC069DC9778",
    "PreviousFields": {},
    "PreviousTxnID": "A9D6469F3CB233795B330CC8A73D08C44B4723EFEE11426FEE8E7CECC611E18E",
    "PreviousTxnLgrSeq": 41889092
  }
}
```

### TrustSetトランザクション

TrustSetトランザクションは、[`RippleState`オブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md)として表される[トラストライン](../../tokens/fungible-tokens/index.md)を作成、変更、または削除します。1つの`RippleState`オブジェクトに、関与する両当事者の設定が含まれます。これには両当事者の制限や[Ripplingの設定](../../tokens/fungible-tokens/rippling.md)などがあります。トラストラインの作成と変更によって[送金元の所有者準備金と所有者ディレクトリーの調整](#汎用的なブックキーピング)も行われます。

以下の例は、**rf1BiG...** が**rsA2Lp...** によって発行されたUSDを最大110 USDまで保持するという新しいトラストラインを示します。

```json
 {
  "CreatedNode": {
    "LedgerEntryType": "RippleState",
    "LedgerIndex": "9CA88CDEDFF9252B3DE183CE35B038F57282BC9503CDFA1923EF9A95DF0D6F7B",
    "NewFields": {
      "Balance": {
        "currency": "USD",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "0"
      },
      "Flags": 131072,
      "HighLimit": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "110"
      },
      "LowLimit": {
        "currency": "USD",
        "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
        "value": "0"
      }
    }
  }
}
```


### その他のトランザクション

その他のほとんどのトランザクションは、特定のタイプのレジャーエントリを作成し、[送金元の所有者準備金と所有者ディレクトリーの調整](#汎用的なブックキーピング)を行います。

- [AccountSetトランザクション][]は、送金元の既存の[AccountRoot object][]を変更し、指定されたとおりに設定とフラグを変更します。
- [DepositPreauthトランザクション][]は、特定の送金元の[DepositPreauthオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/depositpreauth.md)を追加または削除します。
- [SetRegularKeyトランザクション][]は、送金元の[AccountRootオブジェクト][]を変更し、指定されたとおりに`RegularKey`フィールドを変更します。
- [SignerListSetトランザクション][]は、[SignerListオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/signerlist.md)を追加、削除、または置換します。

### 疑似トランザクション

[疑似トランザクション](../../../references/protocol/transactions/pseudo-transaction-types/pseudo-transaction-types.md)にもメタデータがありますが、これらのトランザクションは通常のトランザクションのすべてのルールに従うとは限りません。これらのトランザクションは、実在のアカウントには関連付けられていないため（この`Account`の値は、[base58エンコード形式の数字の0](../../accounts/addresses.md#特別なアドレス)です）、レジャーのAccountRootオブジェクトを変更して`Sequence`シーケンス番号を増やしたり、XRPを消却したりしません。疑似トランザクションは、特別なレジャーオブジェクトに対して特定の変更のみを行います。

- [EnableAmendment疑似トランザクション][]は、[Amendmentレジャーオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/amendments.md)を変更して、有効なAmendment、過半数の支持を得ている保留中のAmendment、および保留中の期間を追跡します。
- [SetFee疑似トランザクション][]は、[FeeSettingsレジャーオブジェクト](../../../references/protocol/ledger-data/ledger-entry-types/feesettings.md)を変更して、[トランザクションコスト](../transaction-cost.md)および[必要準備金](../../accounts/reserves.md)のベースレベルを変更します。

## 関連項目

- **コンセプト:**
  - [結果のファイナリティー](index.md) - トランザクションの成功また失敗が最終的なものとなるタイミングを判断する方法。（簡単な説明: トランザクションが検証済みレジャーにある場合は、その結果とメタデータは最終的なものです。）
- **チュートリアル:**
  - [信頼できるトランザクションの送信](../reliable-transaction-submission.md)
  - [WebSocketを使用した着信ペイメントの監視](../../../tutorials/http-websocket-apis/monitor-incoming-payments-with-websocket.md)
- **リファレンス:**
  - [レジャーオブジェクトタイプのリファレンス](../../../references/protocol/ledger-data/ledger-entry-types/index.md) - レジャーオブジェクトの使用可能なすべてのタイプのフィールド
  - [トランザクションのメタデータ](../../../references/protocol/transactions/metadata.md) - メタデータフォーマットとメタデータに表示されるフィールドの概要
  - [トランザクションの結果](../../../references/protocol/transactions/transaction-results/index.md) - トランザクションのすべての結果コードを掲載した表一覧

{% raw-partial file="/docs/_snippets/common-links.md" /%}
