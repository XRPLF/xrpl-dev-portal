---
seo:
    description: ダイナミックNFTを変更します。
labels:
  - 非代替性トークン, トークン, NFT
title:
  - NFTokenModify
---
# NFTokenModify
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/NFTokenModify.cpp "ソース")

`NFTokenModify`は、NFTの`URI`フィールドを別のURIに変更し、NFTのサポートデータを更新するために使用されます。NFTは、`tfMutable`フラグが設定された状態でミントされている必要があります。[ダイナミックNFT](../../../../concepts/tokens/nfts/dynamic-nfts.md)をご覧ください。

## {% $frontmatter.seo.title %} JSONの例


```json
{
  "TransactionType": "NFTokenModify",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Owner": "rogue5HnPRSszD9CWGSUz8UGHMVwSSKF6",
  "Fee": "10",
  "Sequence": 33,
  "NFTokenID": "0008C350C182B4F213B82CCFA4C6F59AD76F0AFCFBDF04D5A048C0A300000007",
  "URI": "697066733A2F2F62616679626569636D6E73347A736F6C686C6976346C746D6E356B697062776373637134616C70736D6C6179696970666B73746B736D3472746B652F5665742E706E67"
}
```

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド        | JSONの型 | [内部の型][] | 説明               |
|:------------------|:---------|:-------------|:-------------------|
| `TransactionType` | 文字列   | UINT16       | `NFTokenModify`    |
| `Account`         | 文字列   | AccountID    | NFTの発行者または許可されたアカウントの一意のアドレス。 |
| `Owner`           | 文字列   | AccountID    | _(任意)_ NFTの所有者のアドレス。`Account`と`Owner`が同じアドレスの場合、このフィールドは省略します。 |
| `NFTokenID`       | 文字列   | UInt256      | NFTを識別する一意のID。 |
| `URI`             | 文字列   | Blob         | _(任意)_ 最大256バイトの任意のデータ。JSONでは、16進数の文字列としてエンコードされます。[`xrpl.convertStringToHex`](https://js.xrpl.org/modules.html#convertStringToHex)ユーティリティメソッドを使用してURIを16進数に変換できます。これは、NFTに関連するデータまたはメタデータを指すURIです。URIはHTTPまたはHTTPS URL、IPFS URI、マグネットリンク、[RFC 2379 "data" URL](https://datatracker.ietf.org/doc/html/rfc2397)としてエンコードされた即値データ、または発行者固有のエンコードをデコードできます。URIは検証されません。URIを指定しない場合、既存のURIは削除されます。 |

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード       | 説明       |
|:-------------------|:-----------|
| `tecNO_PERMISSION` | `tfMutable`フラグが有効になっていないため、`URI`フィールドを更新できません。また、`Account`フィールドがNFTの発行者または許可された発行者でない場合、このエラーを受け取ることがあります。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
