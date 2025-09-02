---
seo:
    description: PermissionedDomainレジャーエントリは、他の機能へのアクセスを制限するために使用される許可型ドメインを表します。
labels:
  - コンプライアンス
  - 許可型ドメイン
---
# PermissionedDomain
[[ソース]](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/detail/ledger_entries.macro#L451-L461 "ソース")

`PermissionedDomain`レジャーエントリは、単一の[許可型ドメイン][]インスタンスを記述します。[PermissionedDomainSetトランザクション][]を送信することで、許可型ドメインを作成できます。

_([PermissionedDomains amendment][]が必要です {% not-enabled /%})_


## {% $frontmatter.seo.title %}のJSONの例

```json
{
  "LedgerEntryType": "PermissionedDomain",
  "Fee": "10",
  "Flags": 0,
  "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "OwnerNode": "0000000000000000",
  "Sequence": 390,
  "AcceptedCredentials": [
    {
        "Credential": {
            "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "CredentialType": "6D795F63726564656E7469616C"
        }
    }
  ],
  "PreviousTxnID": "E7E3F2BBAAF48CF893896E48DC4A02BDA0C747B198D5AE18BC3D7567EE64B904",
  "PreviousTxnLgrSeq": 8734523,
  "index": "3DFA1DDEA27AF7E466DE395CCB16158E07ECA6BC4EB5580F75EBD39DE833645F"
}
```

<!-- TODO: use a real example above -->

## {% $frontmatter.seo.title %}のフィールド

[共通フィールド](../common-fields.md)に加えて、{% code-page-name /%}エントリには次のフィールドがあります。

| フィールド            | JSONの型              | [内部の型][] | 必須? | 説明  |
|:----------------------|:----------------------|:-------------|:------|:------|
| `AcceptedCredentials` | 配列                  | Array        | はい  | このドメインへのアクセスを許可する1から10個の[AcceptedCredentials](#acceptedcredentialsオブジェクト)オブジェクトのリスト。配列は発行者でソートされて保存されます。 |
| `Owner`               | 文字列 - [アドレス][] | AccountID    | はい  | このドメインの所有者のアドレス。 |
| `OwnerNode`           | 文字列               | UInt64        | はい  | 所有者ディレクトリが複数のページで構成されている場合、このエントリにリンクする所有者ディレクトリのページを示すヒント。 |
| `PreviousTxnID`       | 文字列 - [ハッシュ][]    | Hash256       | はい  | このエントリを最後に変更したトランザクションの識別ハッシュ。 |
| `PreviousTxnLgrSeq`   | 数値               | UInt32        | はい  | このオブジェクトを最後に変更したトランザクションを含む[レジャーのインデックス][Ledger Index]。 |
| `Sequence`            | 数値               | UInt32        | はい  | このエントリを作成したトランザクションの`Sequence`値。 |


### AcceptedCredentialsオブジェクト

`AcceptedCredentials`配列の各メンバーは、次のネストされたフィールドを持つ内部オブジェクトです。

| フィールド            | JSONの型            | [内部の型][] | 必須? | 説明  |
|:-----------------|:---------------------|:------------------|:----------|--------------|
| `Issuer`         | 文字列 - [アドレス][] | AccountID         | はい       | 資格情報の発行者。 |
| `CredentialType` | 文字列               | Blob              | はい       | 資格情報の種類。これは、発行者が資格情報を発行するときに設定する1から64バイトの任意の値です。 |

{% admonition type="info" name="注記" %}
通常のJSON形式では、内部オブジェクトは、内部オブジェクトの種類を定義する名前を持つ1つのフィールドを持つオブジェクトでラップされます。この場合、ラッピングフィールドは`Credential`と呼ばれます。

```json
"AcceptedCredentials": [
    {
        "Credential": {
            "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "CredentialType": "6D795F63726564656E7469616C"
        }
    },
    // ... 追加のCredential内部オブジェクト ...
]
```
{% /admonition %}


## {% $frontmatter.seo.title %}のフラグ

{% code-page-name /%}エントリには、フラグは定義されていません。


## {% $frontmatter.seo.title %}の準備金要件

{% code-page-name /%}エントリは、所有者の準備金要件に対して1つのアイテムとしてカウントされます。

{% code-page-name /%}エントリは、削除ブロッカーであり、つまり、アカウントが{% code-page-name /%}エントリを所有している場合、アカウントは削除できません。


## {% $frontmatter.seo.title %} IDのフォーマット

{% code-page-name /%}エントリのIDは、次の値を順番に連結した[SHA-512Half][]です。

1. {% code-page-name /%}の名前空間キー(`0x0082`)
2. 所有者のアカウントID
3. 作成した{% code-page-name /%}トランザクションのシーケンス番号


{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
