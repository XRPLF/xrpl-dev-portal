# SignerList
[[ソース]<br>](https://github.com/ripple/rippled/blob/6d2e3da30696bd10e3bb11a5ff6d45d2c4dae90f/src/ripple/protocol/impl/LedgerFormats.cpp#L127 "Source")

_（[MultiSign Amendment][]が必要です。）_

`SignerList`オブジェクトタイプは、個別アカウントの代わりにグループとしてトランザクション署名をすることが承認されている署名者のリストです。[SignerListSetトランザクション][]を使用して、SignerListを作成、置き換え、または削除できます。


## {{currentpage.name}}のJSONの例

```json
{
   "Flags": 0,
   "LedgerEntryType": "SignerList",
   "OwnerNode": "0000000000000000",
   "PreviousTxnID": "5904C0DC72C58A83AEFED2FFC5386356AA83FCA6A88C89D00646E51E687CDBE4",
   "PreviousTxnLgrSeq": 16061435,
   "SignerEntries": [
       {
           "SignerEntry": {
               "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
               "SignerWeight": 2
           }
       },
       {
           "SignerEntry": {
               "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
               "SignerWeight": 1
           }
       },
       {
           "SignerEntry": {
               "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
               "SignerWeight": 1
           }
       }
   ],
   "SignerListID": 0,
   "SignerQuorum": 3,
   "index": "A9C28A28B85CD533217F5C0A0C7767666B093FA58A0F2D80026FCC4CD932DDC7"
}
```

## {{currentpage.name}}のフィールド

`SignerList`オブジェクトのフィールドを次に示します。

| 名前                | JSONの型 | 内部の型 | 説明                |
|:--------------------|:----------|:--------------|:---------------------------|
| `LedgerEntryType`   | 文字列    | UInt16        | 値が`0x0053`（文字列`SignerList`にマッピング）の場合は、これがSignerListオブジェクトであることを示します。 |
| `Flags`             | 数値    | UInt32        | このSignerListに対して有効になっているブール値フラグのビットマップ。詳細は、[SignerListのフラグ](#signerlistのフラグ)を参照してください。 |
| `PreviousTxnID`     | 文字列    | Hash256       | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値    | UInt32        | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |
| `OwnerNode`         | 文字列    | UInt64        | 所有者ディレクトリーが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。 |
| `SignerEntries`     | 配列     | 配列         | この署名者リストに記載されている署名者を表すSignerEntryオブジェクトの配列。 |
| `SignerListID`      | 数値    | UInt32        | この署名者リストのID。現時点では常に`0`に設定されます。今後の[Amendment](amendments.html)によってアカウントに複数の署名者リストを使用できるようになる場合は、変更される可能性があります。 |
| `SignerQuorum`      | 数値    | UInt32        | 署名者の重みのターゲット数。署名者がこのSignerListの所有者に代わって有効な署名を生成するには、重みの合計がこの数値以上である有効な署名を提出する必要があります。 |

`SignerEntries`は、secp256k1キーまたはed25519キーを使用する資金供給のあるアドレスと資金供給のないアドレスの自由な組み合わせです。

### SignerEntryオブジェクト

`SignerEntries`フィールドの各メンバーは、リストの署名者を記述するオブジェクトです。SignerEntryのフィールドは次のとおりです。

| 名前           | JSONの型 | 内部の型 | 説明                     |
|:---------------|:----------|:--------------|:--------------------------------|
| `Account`      | 文字列    | AccountID     | 署名がマルチ署名に提供されるXRP Ledgerアドレス。レジャーの資金供給のあるアドレスである必要はありません。 |
| `SignerWeight` | 数値    | UInt16        | この署名者による署名の重み。マルチ署名は、付与された署名の重みの合計がSignerListの`SignerQuorum`値を超えている場合にのみ有効となります。 |

マルチ署名済みトランザクションを処理する際に、サーバーはトランザクション実行時にレジャーに関する`Account`値を間接参照します。アドレスが資金供給のある[AccountRootオブジェクト](accountroot.html)に対応して _いない_ 場合、そのアドレスに関連付けられているマスターシークレットによってのみ有効な署名を生成できます。アカウントがレジャーに _確かに_ 存在している場合は、アカウントの状態により異なります。アカウントにレギュラーキーが設定されている場合はレギュラーキーを使用できます。アカウントのマスターキーが無効化されていない場合に限り、アカウントのマスターキーを使用できます。マルチ署名を別のマルチ署名の一部として使用することはできません。

## {{currentpage.name}}のフラグ

_（[MultiSignReserve Amendment][]が必要です:not_enabled:.）_

SignerListオブジェクトには以下のフラグ値を指定できます。

| フラグ名        | 16進値  | 10進値 | 説明                    |
|:-----------------|:-----------|:--------------|:-------------------------------|
| lsfOneOwnerCount | 0x00010000 | 65536         | このフラグが有効な場合、SignerListは[所有者準備金](reserves.html#所有者準備金)の1アイテムとしてカウントされます。このフラグが無効な場合、このリストはN+2アイテムとしてカウントされます。このNは、リストに含まれている署名者の数です。[MultiSignReserve Amendment][]が有効になった後で署名者リストを追加または更新すると、このフラグが自動的に有効となります。 |

## SignerListと準備金

SignerListは、所有者の[必要準備金](reserves.html)の対象となります。

[MultiSignReserve Amendment][]:not_enabled:が有効ではない場合、SignerList自体が2つのオブジェクトとしてカウントされ、リストの各メンバーが1つのオブジェクトとしてカウントされます。その結果、SignerListに関連付けられている所有者準備金の合計は、1つのトラストライン（[RippleState](ripplestate.html)）またはレジャーの[Offer](offer.html)オブジェクトで必要な準備金の3～10倍になります。

[MultiSignReserve Amendment][]:not_enabled:が有効となれば、SignerListはそのメンバーの数に関わらず、1つのオブジェクトとしてカウントされます。その結果、SignerListに関連付けられている所有者準備金は、メンバーの数に関わらず5 XRPになります。

MultiSignReserve Amendmentよりも前に作成されたSignerListの必要準備金は変わりません。新しい準備金を利用するには、[SignerListSetトランザクション][]を送信してSignerListを更新してください。

## SignerList IDのフォーマット

SignerListオブジェクトのIDは、以下の値がこの順序で連結されているSHA-512Halfです。

* RippleStateスペースキー（`0x0053`）
* SignerListの所有者のAccountID
* SignerListID（現時点では常に`0`）

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
