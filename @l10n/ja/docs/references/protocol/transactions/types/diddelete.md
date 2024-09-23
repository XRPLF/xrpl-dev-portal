---
html: diddelete.html
parent: transaction-types.html
seo:
    description: DIDを削除する。
labels:
  - DID
status: not_enabled
---
# DIDDelete

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/DID.cpp "ソース")

_([DID Amendment][] {% not-enabled /%} が必要です。)_

指定した`Account`フィールドに関連付けられている[DIDレジャーエントリ](../../ledger-data/ledger-entry-types/did.md)を削除します。

**注記:** このトランザクションは[共通フィールド][]のみ利用します。


## {% $frontmatter.seo.title %} JSONの例

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

すべてのトランザクションで発生する可能性のあるエラーの他に、{% $frontmatter.seo.title %}トランザクションでは以下の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります：

| エラーコード          | 説明                                          |
|:--------------------|:---------------------------------------------|
| `tecNO_ENTRY`       | アカウントはDIDを保有していません。                |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
