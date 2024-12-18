---
seo:
    description: アカウントに仮発行された資格情報を承認します。
---
# CredentialAccept

CredentialAcceptトランザクションは資格情報を承認し、その資格情報を有効にします。資格情報の対象者のみがこの操作を実行できます。

## CredentialAccept JSONの例

```json
{
    "TransactionType" : "CredentialAccept",
    "Account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
    "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "CredentialType": "6D795F63726564656E7469616C",
    "Fee": "10",
    "Flags": 0,
    "Sequence": 234203
}
```


## CredentialAcceptのフィールド

[共通フィールド][]に加えて、CredentialAcceptトランザクションは以下のフィールドを使用します。

| フィールド       | JSONの型              | [内部の型][]      | 必須？ | 説明 |
| :--------------- | :-------------------- | :---------------- | :----- | ---- |
| `Issuer`         | 文字列 - [アドレス][] | AccountID         | はい   | 資格情報を作成した発行者のアドレス。 |
| `CredentialType` | 文字列                | Blob              | はい   | 資格情報の種類を定義する任意のデータ。最小サイズは1バイト、最大は64バイトです。 |

`Account`フィールド(このトランザクションの送信者)は、資格情報の対象者でなければなりません。

`Account`、`Issuer`、`CredentialType`の組み合わせは、レジャー上に存在し、まだ承認されていない`Credential`レジャーエントリと一致する必要があります。一致しない場合、トランザクションは失敗します。


## エラーケース

| エラーコード            | 説明 |
| :---------------------- | ---- |
| `tecDUPLICATE`          | 指定された資格情報は既に承認されています。 |
| `tecEXPIRED`            | 指定された資格情報の有効期限が過去の時点になっています。(この場合、トランザクションは期限切れの資格情報をレジャーから削除します。) |
| `tecNO_ENTRY`           | トランザクションの`Account`、`Issuer`、`CredentialType`フィールドで一意に識別される資格情報がレジャー上に存在しません。 |
| `temDISABLED`           | 関連するAmendmentが有効になっていません。 |
| `temINVALID_ACCOUNT_ID` | 提供された`Issuer`フィールドが無効です。例えば、[ACCOUNT_ZERO](../../../../concepts/accounts/addresses.md#特別なアドレス)が含まれている場合など。 |


{% raw-partial file="/docs/_snippets/common-links.md" /%}
