---
seo:
  description: あるアカウントに別のアカウントへ支払を直接送金する権限があるかどうかを示します。
labels:
  - アカウント
  - セキュリティ
---

# deposit_authorized

[[ソース]](https://github.com/XRPLF/rippled/blob/817d2339b8632cb2f97d3edd6f7af33aa7631744/src/ripple/rpc/handlers/DepositAuthorized.cpp "Source")

`deposit_authorized`コマンドは、あるアカウントに別のアカウントへ支払を直接送金する権限があるかどうかを示します。アカウントへの送金に承認を義務付ける方法については、[Deposit Authorization](../../../../concepts/accounts/depositauth.md)をご覧ください。

## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}

```json
{
  "id": 1,
  "command": "deposit_authorized",
  "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "credentials": [
    "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
    "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
  ],
  "ledger_index": "validated"
}
```

{% /tab %}

{% tab label="JSON-RPC" %}

```json
{
  "method": "deposit_authorized",
  "params": [
    {
      "source_account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
      "destination_account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
      "credentials": [
        "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
        "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
      ],
      "ledger_index": "validated"
    }
  ]
}
```

{% /tab %}

{% tab label="コマンドライン" %}

```bash
#Syntax: deposit_authorized <source_account> <destination_account> [<ledger>]
rippled deposit_authorized rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8 validated
```

{% /tab %}
{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| フィールド            | 型                       | 必須?  | 説明                                                                                                                                                                                   |
| :-------------------- | :----------------------- | :----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source_account`      | 文字列 - [アドレス][]    | はい   | 発生し得る支払いの送金元。                                                                                                                                                             |
| `destination_account` | 文字列 - [アドレス][]    | はい   | 発生し得る支払いの送金先。                                                                                                                                                             |
| `ledger_hash`         | [ハッシュ][]             | いいえ | 使用するレジャーバージョンの32バイトの16進文字列。([レジャーの指定][]をご覧ください)                                                                                                   |
| `ledger_index`        | [レジャーインデックス][] | いいえ | 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。([レジャーの指定][]をご覧ください)                                             |
| `credentials`         | 配列                     | いいえ | 送金元が送金先に送金できるかどうかを確認する際に考慮する資格情報のセット。配列の各メンバは、レジャーの[Credentialエントリ][]の一意のIDでなければなりません。空の配列は許可されません。 |

{% admonition type="info" name="注記" %}
送金元が送金先に送金できるかどうかを確認する際に、送金先が事前承認した資格情報のセットと完全に一致しない資格情報のセットを提供した場合、送金は承認されません。この動作はトランザクション処理の動作と一致しています。
{% /admonition %}

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}

```json
{
  "id": 1,
  "result": {
    "credentials": [
      "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
      "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
    ],
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

{% /tab %}

{% tab label="JSON-RPC" %}

```json
{
  "result": {
    "credentials": [
      "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
      "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
    ],
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

{% /tab %}

{% tab label="コマンドライン" %}

```json
Loading: "/etc/rippled.cfg"
2018-Jul-30 20:07:38.771658157 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "credentials": [
        "A182EFBD154C9E80195082F86C1C8952FC0760A654B886F61BB0A59803B4387B",
        "383D269D6C7417D0A8716B09F5DB329FB17B45A5EFDBAFB82FF04BC420DCF7D5"
      ],
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

{% /tab %}
{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| フィールド             | 型                              | 必須? | 説明                                                                                                                                                                                                                                                          |
| :--------------------- | :------------------------------ | :---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `credentials`          | [ハッシュ][]の配列              | No    | リクエストに指定されている資格情報のセット。                                                                                                                                                                                                                  |
| `deposit_authorized`   | 真偽値                          | Yes   | 指定の支払元アカウントが指定の支払先アカウントへの直接送金を承認されているかどうか。`true`の場合、支払先アカウントで[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を必要としていないか、または支払元アカウントが事前承認されています。 |
| `destination_account`  | 文字列 - [アドレス][]           | Yes   | リクエストに指定されている宛先アカウント。                                                                                                                                                                                                                    |
| `ledger_hash`          | 文字列                          | No    | このレスポンスの生成に使用されたレジャーの識別用ハッシュ。                                                                                                                                                                                                    |
| `ledger_index`         | 数値 - [レジャーインデックス][] | No    | このレスポンスの生成に使用されたレジャーバージョンのレジャーインデックス。                                                                                                                                                                                    |
| `ledger_current_index` | 数値 - [レジャーインデックス][] | No    | このレスポンスの生成に使用された現在処理中のレジャーバージョンのレジャーインデックス。                                                                                                                                                                        |
| `source_account`       | 文字列 - [アドレス][]           | Yes   | リクエストに指定されている支払元アカウント。                                                                                                                                                                                                                  |
| `validated`            | 真偽値                          | No    | 検証済みレジャーバージョンからの情報が取り込まれます。                                                                                                                                                                                                        |

{% admonition type="info" name="注記" %}
`deposit_authorized`ステータスが`true`でも、指定の支払元から指定の支払先への送金が可能であるとは保証されません。たとえば、支払先アカウントに指定通貨の[トラストライン](../../../../concepts/tokens/fungible-tokens/index.md)がない場合や、送金に十分な流動性がない場合があります。
{% /admonition %}

## 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `actMalformed` - リクエストの`source_account`フィールドまたは`destination_account`フィールドに指定されている[アドレス][]のフォーマットが適切ではありません。（入力ミスが含まれていたり、長さが正しくない場合は、チェックサムは失敗します。）
- `badCredentials` - 提供された資格情報の少なくとも1つが存在しない、期限切れである、または受け入れられていません。
- `dstActNotFound` - リクエストの`destination_account`フィールドがレジャーのアカウントに対応していません。
- `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
- `srcActNotFound` - リクエストの`source_account`フィールドがレジャーのアカウントに対応していません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
