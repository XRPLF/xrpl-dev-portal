---
html: can_delete.html
parent: logging-and-data-management-methods.html
seo:
    description: 指定したレジャーバージョン以前のレジャー履歴を削除可能にします。
labels:
  - データ保持
---
# can_delete
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/CanDelete.cpp "Source")

`can_delete`メソッドは[指示による削除が有効なオンライン削除](../../../../infrastructure/configuration/data-retention/online-deletion.md#指示による削除)を使用する`rippled`サーバに削除が可能のレジャーバージョンを通知します。指定したレジャーバージョン以前が削除可能になります。指示による削除が有効ではない場合、このメソッドは何も行いません。

_`can_delete`メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_

### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "id": 2,
 "command": "can_delete",
 "can_delete": 11320417
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method": "can_delete",
   "params": [
       {
           "can_delete": 11320417
       }
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: can_delete [<ledger_index>|<ledger_hash>|now|always|never]
rippled can_delete 11320417
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターを指定できます。

| `Field`      | 型              | 説明                               |
|:-------------|:------------------|:------------------------------------------|
| `can_delete` | 文字列 または整数 | _（省略可）_ 削除可能な最大レジャーバージョンの[レジャーインデックス][]。特殊ケース`never`を指定すると、オンライン削除が無効になります。特殊ケース`always`を指定すると、指示による削除が無効な場合と同様に、自動オンライン削除が有効になります。特殊ケース`now`を指定すると、設定されている`online_delete`値に一致するかまたはこの値を超える次の検証済みレジャーで、オンライン削除が1回実行されます。省略すると、サーバは変更を行いません（ただし現在の`can_delete`の値でレスポンスします）。 |

### レスポンスのフォーマット

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`      | 型    | 説明                                         |
|:-------------|:--------|:----------------------------------------------------|
| `can_delete` | 整数 | オンライン削除ルーチンにより削除できる最大レジャーインデックス。 |

既存の`can_delete`設定を照会する場合は、パラメーターを指定せずにこのコマンドを実行します。

### 考えられるエラー

- [汎用エラータイプ][]のすべて。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `lgrNotFound` リクエストの`can_delete`フィールドに指定されているレジャーが存在しないか、存在しているがサーバにはありません。
- `notEnabled` - オンライン削除または指示による削除のいずれかがサーバの設定で有効になっていない場合。
- `notReady` - サーバは現在オンライン削除を実行する準備ができていません。これは通常、サーバが起動したが、検証済みレジャーをまだ取得していないことを意味します。

## 参照項目

- [オンライン削除](../../../../infrastructure/configuration/data-retention/online-deletion.md)
- [指示による削除の設定](../../../../infrastructure/configuration/data-retention/configure-advisory-deletion.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
