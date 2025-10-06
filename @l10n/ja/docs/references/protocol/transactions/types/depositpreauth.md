---
seo:
    description: DepositPreauthトランザクションは別のアカウントに対し、このトランザクションの送信者に支払いを送金することを事前承認します。
labels:
  - セキュリティ
---
# DepositPreauth
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/DepositPreauth.cpp "Source")


DepositPreauthトランザクションは、あなたのアカウントへの支払いを送金するための事前承認を付与します。これは、あなたが[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を使用している（または使用する予定がある）場合にのみ有用です。

{% admonition type="success" name="ヒント" %}このトランザクションを使用して、Deposit Authorizationを有効にする前に事前承認できます。これは、Deposit Authorizationの義務化への円滑な移行に役立ちます。{% /admonition %}

{% amendment-disclaimer name="DepositPreauth" /%}

## {% $frontmatter.seo.title %} JSONの例

{% tabs %}

{% tab label="個別アカウントの事前承認" %}
```json
{
  "TransactionType" : "DepositPreauth",
  "Account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "Authorize" : "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "Fee" : "10",
  "Flags" : 2147483648,
  "Sequence" : 2
}
```
{% /tab %}

{% tab label="資格情報による事前承認" %}
```json
{
  "TransactionType" : "DepositPreauth",
  "Account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "AuthorizeCredentials": [{
    "Credential": {
      "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "CredentialType": "6D795F63726564656E7469616C"
    }
  }],
  "Fee" : "10",
  "Flags": 0,
  "Sequence": 230984
}
```
{% /tab %}
{% /tabs %}

{% tx-example txid="CB1BF910C93D050254C049E9003DA1A265C107E0C8DE4A7CFF55FADFD39D5656" /%}


{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド               | JSONの型              | [内部の型][] | 必須?  | 説明 |
| :----------------------- | :-------------------- | :----------- | :----- | ---- |
| `Authorize`              | 文字列 - [アドレス][] | AccountID    | いいえ | 事前承認するアカウント。 |
| `AuthorizeCredentials`   | 配列                  | Array      | いいえ | 承認する資格証明書のセット。 _([Credentials amendment][]が必要です。 {% not-enabled /%})_ |
| `Unauthorize`            | 文字列                | AccountID    | いいえ | 事前承認を取り消すアカウント。 |
| `UnauthorizeCredentials` | 配列                  | Array      | いいえ | 事前承認を取り消す資格証明書のセット。 _([Credentials amendment][]が必要です。 {% not-enabled /%})_ |

`Authorize`, `AuthorizeCredentials`, `Unauthorize`, or `UnauthorizeCredentials`の**いずれか**を提供する必要があります。

このトランザクションが成功すると、提供されたフィールドに基づいて、[DepositPreauthエントリ](../../ledger-data/ledger-entry-types/depositpreauth.md)が作成または削除されます。


### AuthorizeCredentialsオブジェクト

提供される場合、`AuthorizeCredentials`フィールドまたは`UnauthorizeCredentials`フィールドの各メンバーは、次のフィールドを持つ内部オブジェクトでなければなりません。

| フィールド       | JSONの型              | [内部の型][] | 必須? | 説明                 |
| :--------------- | :-------------------- | :----------- | :---- | :------------------- |
| `Issuer`         | 文字列 - [アドレス][] | AccountID    | はい  | 資格証明書の発行者。 |
| `CredentialType` | 文字列 - 16進数値     | Blob         | はい  | 資格証明書のタイプ。 |

## エラーケース

すべてのトランザクションで発生する可能性のあるエラータイプに加えて、DepositPreauthトランザクションは次のエラーコードを生成することがあります。

| エラーコード              | 説明 |
| :------------------------ | ---- |
| `tecDUPLICATE`            | トランザクションはすでに存在する事前承認を作成します。 |
| `tecINSUFFICIENT_RESERVE` | 送信者は[準備金要件](../../../../concepts/accounts/reserves.md)を満たしていません。(DepositPreauthエントリは承認者の所有者準備金に1つのアイテムとしてカウントされます。) |
| `tecNO_ENTRY`             | トランザクションは存在しない事前承認を取り消そうとしました。 |
| `tecNO_ISSUER`            | 指定された資格証明書発行者の1つ以上がレジャーに存在しません。 |
| `tecNO_TARGET`            | トランザクションは、レジャーの資金提供アカウントではないアカウントを承認しようとしました。 |
| `temCANNOT_PREAUTH_SELF`  | `Authorize`フィールドのアドレスはトランザクションの送信者です。自分自身を事前承認することはできません。 |
| `temDISABLED`             | 必要なAmendmentが有効になっていません。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
