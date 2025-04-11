---
seo:
    description: 支払いの事前承認に使用できる、資格発行者アカウントによる対象アカウントについての証明。
status: not_enabled
---
# Credential

`Credential`エントリは[資格情報](../../../../concepts/decentralized-storage/credentials.md)を表し、_対象(subject)_ アカウントについての _資格発行者(credential issuer)_ アカウントからの証明を含みます。この証明の意味は発行者によって定義されます。

## CredentialのJSONの例

```json
{
    "LedgerEntryType": "Credential",
    "Flags": 65536,
    "Subject": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
    "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "IssuerNode": "0000000000000000",
    "CredentialType": "6D795F63726564656E7469616C",
    "PreviousTxnID": "8089451B193AAD110ACED3D62BE79BB523658545E6EE8B7BB0BE573FED9BCBFB",
    "PreviousTxnLgrSeq": 234644,
    "SubjectNode": "0000000000000000",
    "index": "A738A1E6E8505E1FC77BBB9FEF84FF9A9C609F2739E0F9573CDD6367100A0AA9"
}
```

<!-- TODO: update to a real example -->

## Credentialのフィールド

[共通フィールド](../common-fields.md)に加えて、{% code-page-name /%}エントリには以下のフィールドがあります。

| フィールド          | JSON型                | [内部の型][] | 必須？ | 説明 |
| :------------------ | :-------------------- | :----------- | :----- | ---- |
| `CredentialType`    | 文字列 - 16進数       | Blob         | はい   | このエントリが表す資格情報の種類を定義する任意のデータ。最小長は1バイトで最大長は64バイトです。 |
| `Expiration`        | 数値                  | UInt32       | いいえ | 資格情報が期限切れとなる時間([リップルエポックからの秒数][])。 |
| `Issuer`            | 文字列 - [アドレス][] | AccountID    | はい   | この資格情報を発行したアカウント。 |
| `IssuerNode`        | 文字列                | UInt64       | はい   | ディレクトリが複数のページで構成される場合に、発行者のディレクトリのどのページがこのエントリにリンクしているかを示すヒント。 |
| `PreviousTxnID`     | 文字列 - [ハッシュ][] | Hash256      | はい   | このエントリを最後に変更したトランザクションの識別ハッシュ。 |
| `PreviousTxnLgrSeq` | 数値                  | UInt32       | はい   | このオブジェクトを最後に変更したトランザクションを含む[レジャーインデックス][Ledger Index]。 |
| `Subject`           | 文字列 - [アドレス][] | AccountID    | はい   | この資格情報の対象となるアカウント。 |
| `SubjectNode`       | 文字列                | UInt64       | はい   | ディレクトリが複数のページで構成される場合に、対象の所有者ディレクトリのどのページがこのエントリにリンクしているかを示すヒント。 |
| `URI`               | 文字列 - 16進数       | Blob         | いいえ | 資格情報に関する任意の追加データ(例：W3C形式の検証可能な資格情報を取得できるURL)。 |

## Credentialのフラグ

Credentialエントリでは、`Flags`フィールドに以下のフラグを組み合わせることができます：

| フラグ名      | 16進値       | 10進値 | 説明 |
| ------------- | ------------ | ------ | ---- |
| `lsfAccepted` | `0x00010000` | 65536  | 有効な場合、資格情報の対象者が資格情報を承認したことを示します。そうでない場合、発行者が資格情報を作成しましたが、対象者がまだ承認していないため、有効ではありません。 |

## Credentialの準備金

資格情報エントリは、対象者が資格情報を承認している場合、対象アカウントの所有者準備金の1アイテムとしてカウントされます。そうでない場合、資格情報エントリは発行者アカウントの準備金の1アイテムとしてカウントされます。

## Credential IDのフォーマット

Credentialエントリの一意のIDは、以下の値を順番に連結したもののSHA-512Halfハッシュです。

* `Credential`スペースキー(`0x0044`)
* `Subject`フィールドの値
* `Issuer`フィールドの値
* `CredentialType`フィールドの値  

{% raw-partial file="/docs/_snippets/common-links.md" /%}
