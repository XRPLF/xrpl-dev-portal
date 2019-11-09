# ledger_entry
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

`ledger_entry`メソッドは、XRP Ledgerの1つのレジャーオブジェクトを生フォーマットで返します。取得可能な各種オブジェクトについては、[レジャーフォーマット][]を参照してください。

**注記:** このメソッドのコマンドラインバージョンはありません。代わりに[jsonメソッド][]を使用してコマンドラインからこのメソッドにアクセスできます。

## 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":3,
 "command":"ledger_entry",
 "type":"account_root",
 "account_root":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
 "ledger_index":"validated"
}
```

*JSON-RPC*

```
{
   "method":"ledger_entry",
   "params":[
       {
           "account_root":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "ledger_index":"validated",
           "type":"account_root"
       }
   ]
}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる >](websocket-api-tool.html#ledger_entry)

このメソッドでは各種データを取得できます。取得するアイテムのタイプを選択するには、当該のパラメーターを渡します。具体的には、以下のフィールドのいずれか1つを指定します。

1. `index` - 一意のIDを指定して任意のタイプのレジャーオブジェクトを取得します。
2. `account_root` - [AccountRootオブジェクト](accountroot.html)を取得します。これは[account_infoメソッド][]とほぼ同等です。
3. `directory` - 他のレジャーオブジェクトのリストが含まれている[DirectoryNode](directorynode.html)を取得します。
4. `offer` - 通貨取引オファーを定義する[Offerオブジェクト](offer.html)を取得します。
5. `ripple_state` - 2つのアカウント間の（XRP以外の）通貨の残高を追跡する[RippleStateオブジェクト](ripplestate.html)を取得します。
6. `check` - 受取人が現金化できる支払いである[Checkオブジェクト](check.html)を取得します。[新規: rippled 1.0.0][]
7. `escrow` - 特定の時刻または条件に一致するまでXRPを保有する[Escrowオブジェクト](escrow-object.html)を取得します。[新規: rippled 1.0.0][]
8. `payment_channel` - 非同期支払いのためにXRPを保有する[PayChannelオブジェクト](paychannel.html)を取得します。[新規: rippled 1.0.0][]
9. `deposit_preauth` - [Deposit Authorization](depositauth.html)を必要とするアカウントへの支払いの事前承認を追跡する[DepositPreauthオブジェクト](depositpreauth-object.html)を取得します。[新規: rippled 1.1.0][]

上記のアイテムを複数指定すると、サーバーはそのうちの1つのみを取得します。どのアイテムが取得されるかは未定義です。

このメソッドで認識されるすべてのパラメーターのリストを次に示します。

| `Field`                 | 型                       | 説明           |
|:------------------------|:---------------------------|:----------------------|
| `index`                 | 文字列                     | _（省略可）_ レジャーから取得する1つのオブジェクトの[オブジェクトID](ledger-object-ids.html)を指定します。 |
| `account_root`          | 文字列 - [アドレス][]       | _（省略可）_ 取得する[AccountRootオブジェクト](accountroot.html)を指定します。 |
| `check`                 | 文字列                     | _（省略可）_ レジャーから取得する[Checkオブジェクト](check.html)の[オブジェクトID](ledger-object-ids.html)を指定します。 |
| `deposit_preauth`       | オブジェクトまたは文字列           | _（省略可）_ 取得する[DepositPreAuthオブジェクト](depositpreauth-object.html)を指定します。文字列の場合はDepositPreAuthオブジェクトの[オブジェクトID](ledger-object-ids.html)（16進数）である必要があります。オブジェクトの場合は`owner`および`authorized`サブフィールドが必要です。 |
| `deposit_preauth.owner` | 文字列 - [アドレス][]       | _（`deposit_preauth`がオブジェクトとして指定されている場合に必須）_ 事前承認を提供したアカウント。 |
| `deposit_preauth.authorized` | 文字列 - [アドレス][]  | _（`deposit_preauth`がオブジェクトとして指定されている場合に必須）_ 事前承認を受けたアカウント。 |
| `directory`             | オブジェクトまたは文字列           | _（省略可）_ 取得する[DirectoryNode](directorynode.html)を指定します。文字列の場合はディレクトリーの[オブジェクトID](ledger-object-ids.html)（16進数）である必要があります。オブジェクトの場合はサブフィールドとして`dir_root`または`owner`のいずれかが必要です。また必要に応じて`sub_index`サブフィールドを指定できます。 |
| `directory.sub_index`   | 符号なし整数           | _（省略可）_ 指定されている場合は、[DirectoryNode](directorynode.html)の後のページにジャンプします。 |
| `directory.dir_root`    | 文字列                     | _（`directory`がオブジェクトとして指定されており、`directory.owner`が指定されていない場合に必須）_ 取得するディレクトリーを識別する一意のインデックス（16進数）。 |
| `directory.owner`       | 文字列                     | _（`directory`がオブジェクトとして指定されており、`directory.dir_root`が指定されていない場合に必須）_ このディレクトリーに関連付けられているアカウントの一意のアドレス。 |
| `escrow` | オブジェクトまたは文字列 | _（省略可）_ 取得する[Escrowオブジェクト](escrow-object.html)を指定します。文字列の場合はEscrowの[オブジェクトID](ledger-object-ids.html)（16進数）である必要があります。オブジェクトの場合は`owner`および`seq`サブフィールドが必要です。 |
| `escrow.owner` | 文字列 - [アドレス][] | _（`escrow`がオブジェクトとして指定されている場合に必須）_ Escrowオブジェクトの所有者（送金元）。 |
| `escrow.seq` | 符号なし整数 | _（`escrow`がオブジェクトとして指定されている場合に必須）_ Escrowオブジェクトを作成したトランザクションのシーケンス番号。 |
| `offer`                 | オブジェクトまたは文字列           | _（省略可）_ 取得する[Offer オブジェクト](offer.html)を指定します。文字列の場合はOfferの[一意のインデックス](ledgers.html#ツリーの形式)として解釈されます。オブジェクトの場合は、オファーを一意に識別するためサブフィールド`account`と`seq`が必要です。 |
| `offer.account`         | 文字列 - [アドレス][]       | _（`offer`が指定されている場合に必須）_ オファーを出したアカウント。 |
| `offer.seq`             | 符号なし整数           | _（`offer`が指定されている場合に必須）_ Offerオブジェクトを作成したトランザクションのシーケンス番号。 |
| `payment_channel` | 文字列 | _（省略可）_ 取得する[PayChannel オブジェクト](paychannel.html)の[オブジェクトID](ledger-object-ids.html)を指定します。 |
| `ripple_state`          | オブジェクト                     | _（省略可）_ 取得するRippleState（トラストライン）オブジェクトを指定するオブジェクト。取得するRippleStateエントリを一意に指定するため、`accounts`および`currency`サブフィールドが必要です。 |
| `ripple_state.accounts` | 配列                      | _（`ripple_state`が指定されている場合に必須）_ アカウントの[アドレス][]からなる長さ2の配列。この[RippleStateオブジェクト](ripplestate.html)によりリンクされる2つのアカウントを定義します。 |
| `ripple_state.currency` | 文字列                     | _（`ripple_state`が指定されている場合に必須）_ 取得する[RippleStateオブジェクト](ripplestate.html)の[通貨コード][]。 |
| `binary`                | ブール値                    | _（省略可）_ trueの場合、要求したレジャーオブジェクトの内容が16進文字列として返されます。それ以外の場合はデータがJSONフォーマットで返されます。デフォルトは`false`です。[更新: rippled 1.2.0][新規: rippled 1.2.0] |
| `ledger_hash`           | 文字列                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]を参照してください） |
| `ledger_index`          | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |

`generator`パラメーターと`ledger`パラメーターは廃止予定であり、今後予告なしに削除される可能性があります。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```{
   "id":3,
   "result":{
       "index":"4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
       "ledger_index":6889347,
       "node":{
           "Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "Balance":"27389517749",
           "Flags":0,
           "LedgerEntryType":"AccountRoot",
           "OwnerCount":18,
           "PreviousTxnID":"B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
           "PreviousTxnLgrSeq":6592159,
           "Sequence":1400,
           "index":"4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
       }
   },
   "status":"success",
   "type":"response"
}
```

*JSON-RPC*

```
200 OK
{
   "result":{
       "index":"4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05",
       "ledger_index":8696234,
       "node":{
           "Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "Balance":"13176802787",
           "Flags":0,
           "LedgerEntryType":"AccountRoot",
           "OwnerCount":17,
           "PreviousTxnID":"E5D0235A236F7CD162C1AB87A0325056AE61CFC63D92D1494AB5D826AAD0CDCA",
           "PreviousTxnLgrSeq":8554742,
           "Sequence":1406,
           "index":"4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
       },
       "status":"success",
       "validated": true
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`        | 型             | 説明                              |
|:---------------|:-----------------|:-----------------------------------------|
| `index`        | 文字列           | このledger_entryの一意の識別用キー |
| `ledger_index` | 符号なし整数 | このデータの取得元レジャーの一意のシーケンス番号 |
| `node`         | オブジェクト           | （`"binary": true`が指定されている場合は省略）[レジャーフォーマット][]に基づく、このレジャーオブジェクトのデータが含まれているオブジェクト。 |
| `node_binary`  | 文字列           | （`"binary":true`が指定されていない場合は省略）レジャーオブジェクトのバイナリデータ（16進数）。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `deprecatedFeature` - 削除されたフィールド（`generator`など）が要求に指定されていました。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。
* `malformedAddress` - 要求の[アドレス][]フィールドが誤って指定されています。
* `malformedCurrency` - 要求の[通貨コード][]フィールドが誤って指定されています。
* `malformedOwner` - 要求の`escrow.owner`サブフィールドが誤って指定されています。
* `malformedRequest` - 要求にフィールドが無効な組み合わせで指定されているか、1つ以上のフィールドの型が誤っています。
* `unknownOption` - 要求に指定されたフィールドが、予期される要求フォーマットのいずれにも一致していません。


<!-- TODO: we should add this ledger format link to rippled-api-links.md. account_objects.md is also including this as a one-off.-->
[レジャーフォーマット]: ledger-data-formats.html
{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
