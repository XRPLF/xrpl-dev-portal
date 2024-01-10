---
html: diddelete.html
parent: transaction-types.html
blurb: DIDを削除する。
labels:
  - DID
status: not_enabled
---
# DIDDelete

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/DID.cpp "ソース")

_([DID Amendment][] :not_enabled: が必要です。)_

指定した`Account`フィールドに関連付けられている[DIDレジャーエントリ](did.html)を削除します。

**注記:** このトランザクションは[共通フィールド][]のみ利用します。


## {{currentpage.name}} JSONの例

```json
{
    "TransactionType": "DIDDelete",
    "Account": "rp4pqYgrTAtdPHuZd1ZQWxrzx45jxYcZex",
    "Fee": "12",
    "Sequence": 391,
    "SigningPubKey":"0293A815C095DBA82FAC597A6BB9D338674DB93168156D84D18417AD509FFF5904",
    "TxnSignature":"3044022011E9A7EE3C7AE9D202848390522E6840F7F3ED098CD13E..."
}
```


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーの他に、{{currentpage.name}}トランザクションでは以下の[トランザクション結果コード](transaction-results.html)が発生する可能性があります：

| エラーコード          | 説明                                          |
|:--------------------|:---------------------------------------------|
| `tecNO_ENTRY`       | アカウントはDIDを保有していません。                |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
