---
seo:
    description: アカウントに対して暫定的に資格情報を発行します。
    status: not_enabled
---

# CredentialCreate

CredentialCreateトランザクションは、レジャーにCredentialを作成します。Credential(資格情報)の発行者はこのトランザクションを使用して、暫定的に資格情報を発行します。Credentialは、その対象アカウントが[CredentialAcceptトランザクション][]で承認するまで有効になりません。

## CredentialCreate JSONの例

```json
{
    "TransactionType" : "CredentialCreate",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Subject": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
    "CredentialType": "6D795F63726564656E7469616C",
    "Fee": "10",
    "Flags": 0,
    "Sequence": 234200
}
```


## CredentialCreateのフィールド

[共通フィールド][]に加えて、CredentialCreateトランザクションは以下のフィールドを使用します。

| フィールド       | JSON型                | [内部の型][] | 必須？ | 説明 |
| :--------------- | :-------------------- | :----------- | :----- | ---- |
| `Subject`        | 文字列 - [アドレス][] | AccountID    | はい   | 資格情報の対象アカウント。 |
| `CredentialType` | 文字列 - 16進数       | Blob         | はい   | このエントリが表す資格情報の種類を定義する任意のデータ。最小長は1バイトで、最大長は64バイトです。 |
| `Expiration`     | 数値                  | UInt32       | いいえ | この資格情報が期限切れとみなされる時間（[Rippleエポック以降の経過秒数][]）。 |
| `URI`            | 文字列                | Blob         | いいえ | 関連する検証可能な資格情報ドキュメントを参照できるURLなど、資格情報に関する任意の追加データ。存在する場合、最小長は1バイトで最大は256バイトです。 |

トランザクションの`Account`フィールド(送信者)は、資格情報の発行者です。発行者と対象(Subject)アカウントは同じアカウントでも構いません。

## エラーケース

すべてのトランザクションで発生する可能性のあるエラーの他に、CredentialCreateトランザクションでは以下の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード            | 説明 |
| :---------------------- | ---- |
| `tecDUPLICATE`          | 同じSubject、Issuer、およびCredentialTypeを持つCredentialがすでに存在しています。 |
| `tecEXPIRED`            | Credentialの有効期限に過去の日時が設定されています。 |
| `tecNO_TARGET`          | `Subject`フィールドで指定されたアカウントはレジャーで資金提供されているアカウントではありません。 |
| `temDISABLED`           | 関連するAmendmentが有効になっていません。 |
| `temINVALID_ACCOUNT_ID` | 提供された`Subject`フィールドが無効です。例えば、[ACCOUNT_ZERO](../../../../concepts/accounts/addresses.md#特別なアドレス)が含まれている場合です。 |


{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
