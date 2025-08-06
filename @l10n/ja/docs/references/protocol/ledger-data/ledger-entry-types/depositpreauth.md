---
html: depositpreauth-object.html
parent: ledger-entry-types.html
seo:
    description: 承認を必要とするアカウントへの送金ペイメントの事前承認の記録です。
labels:
  - セキュリティ
---
# DepositPreauth
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L172-L178 "Source")

`DepositPreauth`エントリは、1つのアカウントからの事前承認を追跡します。常に[DepositPreauthトランザクション][]を送信することで事前承認を作成できますが、[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を使用していない限り、効果はありません。

事前承認は、特定のアカウントからの送金を許可します。そのアカウントは、[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を使用していない限り、あなたに直接送金できません。事前承認は一方向であり、反対方向の支払いには影響しません。

特定の _アカウント_ または _資格情報のセット_ を事前承認することができます。資格情報のセットの場合、レジャー上で一致する資格情報のセットを持つアカウントであれば、あなたに送金することができます。 _(資格情報による事前承認には[Credentials amendment][]が必要です。{% not-enabled /%})_

## {% $frontmatter.seo.title %}のJSONの例

{% tabs %}

{% tab label="個別アカウントの事前承認" %}
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
{% /tab %}

{% tab label="資格情報による事前承認" %}
```json
{
  "LedgerEntryType": "DepositPreauth",
  "Account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "AuthorizeCredentials": [{
    "Credential": {
      "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "CredentialType": "6D795F63726564656E7469616C"
    }
  }],
  "Flags": 0,
  "OwnerNode": "0000000000000000",
  "PreviousTxnID": "FD2A4E9E317C7FEF112D22ADEB9E2C6DC3C2AB6E2AD96A50B76EBB9DEB39EA77",
  "PreviousTxnLgrSeq": 7,
  "index": "F2B8550ADF60FD268157262C1C54E1D1014BDEA361CE848B6F48556348327E5F"
}
```
{% /tab %}
{% /tabs %}

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド][]に加えて、{% $frontmatter.seo.title %}エントリは以下のフィールドを使用します。

| フィールド             | JSONの型              | [内部の型][] | 必須?  | 説明 |
| :--------------------- | :-------------------- | :----------- | :----- | ---- |
| `Account`              | 文字列                | Account      | はい   | 事前承認を付与したアカウント。(事前承認支払の宛先) |
| `Authorize`            | 文字列                | Account      | いいえ | 事前承認を受けたアカウント。(事前承認支払の送金元) |
| `AuthorizeCredentials` | 配列                  | Array        | いいえ | 事前承認を受けた資格情報のセット。(これらの資格情報を持つアカウントは事前承認されます。)この配列の長さは最小1、最大8です。 |
| `LedgerEntryType`      | 文字列                | UInt16       | はい   | 値`0x0070`が文字列`DepositPreauth`にマッピングされている場合は、これがDepositPreauthオブジェクトであることを示します。 |
| `OwnerNode`            | 文字列                | UInt64       | はい   | 送金元アドレスの所有者のディレクトリが複数ページで構成されている場合に、このオブジェクトにリンクしているページを示すヒントです。**注記:** このオブジェクトには、オブジェクトを含む所有者ディレクトリへの直接リンクは含まれていません。これは、その値を`Account`から取得できるためです。 |
| `PreviousTxnID`        | 文字列 - [ハッシュ][] | UInt256      | はい   | このオブジェクトを最後に変更したトランザクションの識別用ハッシュ。 |
| `PreviousTxnLgrSeq`    | 数値                  | UInt32       | はい   | このオブジェクトを最後に変更したトランザクションが記録された[レジャーインデックス][]。 |

各エントリには、`Authorize`フィールドまたは`AuthorizeCredentials`フィールドのいずれかが必要ですが、両方を持つことはできません。

### Authorized Credentialオブジェクト

エントリに`AuthorizeCredentials`フィールドがある場合、その配列の各メンバは、以下の形式で1つの資格情報を識別する内部オブジェクトです。

| フィールド       | JSONの型              | [内部の型][] | 必須? | 説明               |
| :--------------- | :-------------------- | :----------- | :---- | :----------------- |
| `Issuer`         | 文字列 - [アドレス][] | AccountID    | はい  | 資格情報の発行者。 |
| `CredentialType` | 文字列 - 16進数       | Blob         | はい  | 資格情報の種類。   |

アカウントは、指定されたすべての資格情報を保持している必要があります。

## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリに定義されているフラグはありません。

## {% $frontmatter.seo.title %}の準備金

{% code-page-name /%}エントリは、そのエントリが台帳上にある限り、事前認可を行なったアカウントの所有者準備金の1つとしてカウントされます。この準備金は事前認可の設定を取り消すことで解放されます。

## DepositPreauth IDのフォーマット

`DepositPreauth`エントリのIDは、承認するアカウントが1つの場合と、資格情報のセットが1つの場合で、以下の2つのフォーマットがあります。

### 個別アカウントの事前承認

この場合、IDは以下の値の[SHA-512Half][]です。

* DepositPreauthスペースキー(`0x0070`)
* このオブジェクトの所有者(このオブジェクトを作成した[DepositPreauthトランザクション][]の送信者、つまり事前承認を付与したユーザ)のAccountID
* `Authorize`フィールドのAccountID

### 資格情報による事前承認
_([Credentials amendment][]が必要です。 {% not-enabled /%})_

この場合、IDは以下の値の[SHA-512Half][]です。

* 資格情報による事前承認のスペースキー (`0x0050`)
* このオブジェクトの所有者(このオブジェクトを作成した[DepositPreauthトランザクション][]の送信者、つまり事前承認を付与したユーザ)のAccountID
* `AuthorizeCredentials`フィールドの内容

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
