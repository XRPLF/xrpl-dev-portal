# deposit_authorized
[[ソース]<br>](https://github.com/ripple/rippled/blob/817d2339b8632cb2f97d3edd6f7af33aa7631744/src/ripple/rpc/handlers/DepositAuthorized.cpp "Source")

`deposit_authorized`コマンドは、あるアカウントに別のアカウントへ支払を直接送金する権限があるかどうかを示します。アカウントへの送金に承認を義務付ける方法については、[Deposit Authorization](depositauth.html)を参照してください。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
 "id": 1,
 "command": "deposit_authorized",
 "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
 "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
 "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
 "method": "deposit_authorized",
 "params": [
   {
     "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
     "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
     "ledger_index": "validated"
   }
 ]
}
```

*コマンドライン*

```bash
#Syntax: deposit_authorized <source_account> <destination_account> [<ledger>]
rippled deposit_authorized rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8 validated
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`               | 型                       | 説明             |
|:----------------------|:---------------------------|:------------------------|
| `source_account`      | 文字列 - [アドレス][]       | 発生し得る支払の送金元。 |
| `destination_account` | 文字列 - [アドレス][]       | 発生し得る支払の送金先。 |
| `ledger_hash`         | 文字列                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進数文字列。（[レジャーの指定][]を参照してください。) |
| `ledger_index`        | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください。) |


## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
 "id": 1,
 "result": {
   "deposit_authorized": true,
   "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
   "ledger_hash": "BD03A10653ED9D77DCA859B7A735BF0580088A8F287FA2C5403E0A19C58EF322",
   "ledger_index": 8,
   "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
   "validated": true
 },
 "status": "success",
 "type": "response"
}
```

*JSON-RPC*

```json
{
 "result": {
   "deposit_authorized": true,
   "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
   "ledger_hash": "BD03A10653ED9D77DCA859B7A735BF0580088A8F287FA2C5403E0A19C58EF322",
   "ledger_index": 8,
   "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
   "status": "success",
   "validated": true
 }
}
```

*コマンドライン*

```json
Loading: "/etc/rippled.cfg"
2018-Jul-30 20:07:38.771658157 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
  "result" : {
     "deposit_authorized" : true,
     "destination_account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
     "ledger_hash" : "BD03A10653ED9D77DCA859B7A735BF0580088A8F287FA2C5403E0A19C58EF322",
     "ledger_index" : 8,
     "source_account" : "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
     "status" : "success",
     "validated" : true
  }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                | 型                 | 説明                  |
|:-----------------------|:---------------------|:-----------------------------|
| `deposit_authorized`   | ブール値              | 指定の支払元アカウントから支払先アカウントへの直接送金が承認されているかどうか。`true`の場合、支払先アカウントで[Deposit Authorization](depositauth.html)を必要としていないか、または支払元アカウントが事前承認されています。 |
| `destination_account`  | 文字列 - [アドレス][] | 要求に指定されている宛先アカウント。 |
| `ledger_hash`          | 文字列               | _（省略される場合があります）_ この応答の生成に使用されたレジャーの識別用ハッシュ。 |
| `ledger_index`         | 数値                 | _（省略される場合があります）_ この応答の生成に使用されたレジャーバージョンのシーケンス番号。 |
| `ledger_current_index` | 数値                 | _（省略される場合があります）_ この応答の生成に使用された現在処理中のレジャーバージョンのシーケンス番号。 |
| `source_account`       | 文字列 - [アドレス][] | 要求に指定されている支払元アカウント。 |
| `validated`            | ブール値              | _（省略される場合があります）_ `true`の場合、検証済みレジャーバージョンからの情報が取り込まれます。 |

**注記:** `deposit_authorized`ステータスが`true`でも、指定の支払元から指定の支払先への送金が可能であるとは保証されません。たとえば、支払先アカウントに指定通貨の[トラストライン](trust-lines-and-issuing.html)がない場合や、送金に十分な流動性がない場合があります。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actMalformed` - 要求の`source_account`フィールドまたは`destination_account`フィールドに指定されている[アドレス][]のフォーマットが適切ではありません。（入力ミスが含まれていたり、長さが正しくない場合は、チェックサムは失敗します。）
* `dstActNotFound` - 要求の`destination_account`フィールドがレジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`に指定されているレジャーが存在しないか、存在しているがサーバーにはありません。
* `srcActNotFound` - 要求の`source_account`フィールドがレジャーのアカウントに対応していません。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
