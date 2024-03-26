---
html: depositpreauth-object.html #depositpreauth.html is taken by the tx type
parent: ledger-entry-types.html
seo:
    description: 承認を必要とするアカウントへの送金ペイメントの事前承認の記録です。
labels:
  - セキュリティ
---
# DepositPreauth
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L172-L178 "Source")

`DepositPreauth`オブジェクトはアカウント間の事前承認を追跡します。[DepositPreauthトランザクション][]によりこれらのオブジェクトが作成されます。

これは、事前承認を付与したアカウントに[Deposit Authorization](../../../../concepts/accounts/depositauth.md)が不要な場合は、トランザクションの処理に影響しません。その場合、事前承認されたアカウントから、事前承認を付与したアカウントに対して、支払やその他のトランザクションを直接送信できます。事前認証は一方向であり、反対方向の支払には影響しません。

## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "LedgerEntryType" : "DepositPreauth",
  "Account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "Authorize" : "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "Flags" : 0,
  "OwnerNode" : "0000000000000000",
  "PreviousTxnID" : "3E8964D5A86B3CD6B9ECB33310D4E073D64C865A5B866200AD2B7E29F8326702",
  "PreviousTxnLgrSeq" : 7,
  "index" : "4A255038CC3ADCC1A9C91509279B59908251728D0DAADB248FFE297D0F7E068C"
}
```

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明     |
|:--------------------|:---------|:-----------|:------|:---------|
| `Account`           | 文字列    | Account    | はい  | 事前承認を付与したアカウント。（事前承認支払の宛先。） |
| `Authorize`         | 文字列    | Account    | はい  | 事前承認を受けたアカウント。（事前承認支払の送金元。） |
| `LedgerEntryType`   | 文字列    | UInt16     | はい  | 値`0x0070`が文字列`DepositPreauth`にマッピングされている場合は、これがDepositPreauthオブジェクトであることを示します。 |
| `OwnerNode`         | 文字列    | UInt64     | はい  | 送金元アドレスの所有者のディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。**注記:** このオブジェクトには、オブジェクトを含む所有者ディレクトリへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `PreviousTxnID`     | 文字列    | Hash256    | はい  | 最後にこのオブジェクトを変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値      | UInt32     | はい  | 最後にこのオブジェクトを変更したトランザクションが記録された[レジャーインデックス][]。 |


## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。

## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは、そのエントリが台帳上にある限り、事前認可を行なったアカウントの所有者準備金の1つとしてカウントされます。この準備金は事前認可の設定を取り消すことで解放されます。

## DepositPreauth IDのフォーマット

`DepositPreauth`オブジェクトのIDは、以下の値がこの順序で連結されている[SHA-512ハーフ][]です。

* DepositPreauthスペースキー（`0x0070`）
* このオブジェクトの所有者（このオブジェクトを作成した[DepositPreauthトランザクション][]の送信者、つまり事前承認を付与したユーザ）のAccountID。
* 事前承認されたアカウント（このオブジェクトを作成した[DepositPreauthトランザクション][]の`Authorized`フィールド、つまり事前承認を受けたユーザ）のAccountID。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
