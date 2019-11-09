# can_delete
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/CanDelete.cpp "Source")

`can_delete`メソッドは`rippled`サーバーに対し最新のレジャーバージョンを通知します。この最新バージョンは[指示による削除が有効なオンライン削除](online-deletion.html#指示による削除)を使用するときに削除できます。指示による削除が有効ではない場合、このメソッドは何も行いません。<!-- NOTE: I'm pretty sure this is slightly wrong. --@mDuo13 -->

_`can_delete`メソッドは、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。_

### 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 2,
 "command": "can_delete",
 "can_delete": 11320417
}
```

*JSON-RPC*

```
{
   "method": "can_delete",
   "params": [
       {
           "can_delete": 11320417
       }
   ]
}
```

*コマンドライン*

```
#Syntax can_delete [<ledger_index>|<ledger_hash>|now|always|never]
rippled can_delete 11320417
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターを指定できます。

| `Field`      | 型              | 説明                               |
|:-------------|:------------------|:------------------------------------------|
| `can_delete` | 文字列 または整数 | _（省略可）_ 削除可能な最大レジャーバージョンの[レジャーインデックス][]。特殊ケース`never`を指定すると、オンライン削除が無効になります。特殊ケース`always`を指定すると、指示による削除が無効な場合と同様に、自動オンライン削除が有効になります。特殊ケース`now`を指定すると、設定されている`online_delete`値に一致するかまたはこの値を超える次の検証済みレジャーで、オンライン削除が1回実行されます。省略すると、サーバーは変更を行いません（ただし現在の`can_delete`の値で応答します）。 |

### 応答フォーマット

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`      | 型    | 説明                                         |
|:-------------|:--------|:----------------------------------------------------|
| `can_delete` | 整数 | オンライン削除ルーチンにより削除できる最大レジャーインデックス。 |

既存の`can_delete`設定を照会する場合は、パラメーターを指定せずにこのコマンドを実行します。

### 考えられるエラー

- [汎用エラータイプ][]のすべて。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `lgrNotFound` 要求の`can_delete`フィールドに指定されているレジャーが存在しないか、存在しているがサーバーにはありません。
- `notEnabled` - オンライン削除または指示による削除のいずれかがサーバーの設定で有効になっていない場合。
- `notReady` - サーバーは現在オンライン削除を実行する準備ができていません。これは通常、サーバーが起動したが、検証済みレジャーをまだ取得していないことを意味します。

## 参照項目

- [オンライン削除](online-deletion.html)
- [指示による削除の設定](configure-advisory-deletion.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
