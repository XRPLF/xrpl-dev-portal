---
seo:
    description: レジャーから認証情報を削除し、事実上失効させます。
    status: not_enabled
---
# CredentialDelete

CredentialDeleteトランザクションは、レジャーから認証情報を削除し、事実上失効させます。ユーザは[準備金要件](../../../../concepts/accounts/reserves.md)を調整するために、不要な資格情報を削除することもできます。


## CredentialDelete JSONの例

```json
{
    "TransactionType" : "CredentialDelete",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Subject": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "CredentialType": "6D795F63726564656E7469616C",
    "Fee": "10",
    "Flags": 0,
    "Sequence": 234203
}
```


## CredentialDeleteのフィールド


[共通フィールド][]に加えて、CredentialDeleteトランザクションは以下のフィールドを使用します。

| フィールド       | JSON型                | [内部の型][] | 必須？ | 説明 |
| :--------------- | :-------------------- | :----------- | :----- | ---- |
| `CredentialType` | 文字列 - 16進数       | Blob         | はい   | 削除する資格情報の種類を定義する任意のデータ。最小長は1バイトで、最大長は256バイトです。 |
| `Subject`        | 文字列 - [アドレス][] | AccountID    | いいえ | 削除する資格情報の対象者。省略された場合、`Account`(トランザクションの送信者)を資格情報の対象者として使用します。 |
| `Issuer`         | 文字列 - [アドレス][] | AccountID    | いいえ | 削除する資格情報の発行者。省略された場合、`Account`(トランザクションの送信者)を資格情報の発行者として使用します。 |

`Subject`フィールド、`Issuer`フィールド、またはその両方を指定する必要があります。

このトランザクションは、指定された対象者、発行者、および資格情報の種類を持つ[Credentialレジャーエントリ](../../ledger-data/ledger-entry-types/credential.md)を探し、トランザクションの送信者に権限がある場合にそのエントリを削除します。資格情報の保持者または発行者は、いつでもそれを削除できます。資格情報が期限切れの場合、誰でも削除できます。


## エラーケース

| エラーコード            | 説明 |
| :---------------------- | ---- |
| `temDISABLED`           | 関連するAmendmentが有効になっていません。 |
| `temINVALID_ACCOUNT_ID` | 提供された`Subject`または`Issuer`フィールドが無効です。例えば、[ACCOUNT_ZERO](../../../../concepts/accounts/addresses.md#特別なアドレス)が含まれている場合です。 |
| `tecNO_PERMISSION`      | 送信者が資格情報の発行者でも対象者でもなく、資格情報が期限切れでもありません。 |
| `tecNO_ENTRY`           | 指定された資格情報がレジャーに存在しません。 |


{% raw-partial file="/docs/_snippets/common-links.md" /%}
