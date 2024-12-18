---
html: accountdelete.html
parent: transaction-types.html
seo:
    description: アカウントの削除
labels:
  - アカウント
---
# AccountDelete

[[ソース]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/DeleteAccount.cpp "Source")

_[DeletableAccounts Amendment](/resources/known-amendments.md#deletableaccounts)が必要です_

AccountDeleteトランザクションは、XRP Ledgerで[アカウント](../../ledger-data/ledger-entry-types/accountroot.md)と、アカウントが所有するオブジェクトを削除し、可能であれば、アカウントの残りのXRPを指定された送金先アカウントに送信します。アカウントを削除する要件については、[アカウントの削除](../../../../concepts/accounts/deleting-accounts.md)をご覧ください。

## {% $frontmatter.seo.title %} JSONの例

```json
{
    "TransactionType": "AccountDelete",
    "Account": "rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm",
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    "DestinationTag": 13,
    "Fee": "5000000",
    "Sequence": 2470665,
    "Flags": 2147483648
}
```

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}


| フィールド       | JSONの型              | [内部の型][] | 必須?  | 説明 |
| :--------------- | :-------------------- | :----------- | :----- | ---- |
| `CredentialIDs`  | 文字列の配列          | Vector256    | いいえ | このトランザクションによる入金を承認する資格情報のセット。配列の各メンバーは、レジャー内のCredentialエントリのレジャーエントリIDでなければなりません。詳細については、[Credential ID](./payment.md#credential-ids)をご覧ください。 |
| `Destination`    | 文字列 - [アドレス][] | AccountID    | はい   | 送金元アカウントを削除した後の残りのXRPを受け取るアカウントのアドレス。レジャー内の資金供給のあるアカウントでなければならず、送金元アカウントであってはいけません。 |
| `DestinationTag` | 数値                  | UInt32       | いいえ | 削除されたアカウントの残りのXRPの受取人を識別する任意の[宛先タグ](../../../../concepts/transactions/source-and-destination-tags.md)、または受取人のその他の情報。 |


## エラーケース

すべてのトランザクションで発生する可能性のあるエラーに加えて、{% $frontmatter.seo.title %}トランザクションでは、次の[トランザクション結果コード](../transaction-results/index.md)が発生する可能性があります。

| エラーコード         | 説明 |
| :------------------- | ---- |
| `temDISABLED`        | [DeletableAccounts Amendment](/resources/known-amendments.md#deletableaccounts)が有効でない場合に発生します。 |
| `temDST_IS_SRC`      | `Destination`がトランザクションの送金元(`Account`フィールド)と一致している場合に発生します。 |
| `tecDST_TAG_NEEDED`  | `Destination`アカウントに[宛先タグ](../../../../concepts/transactions/source-and-destination-tags.md)が必要であるのに、`DestinationTag`フィールドが指定されていない場合に発生します。 |
| `tecNO_DST`          | `Destination`アカウントが、レジャーの資金供給のあるアカウントではない場合に発生します。 |
| `tecNO_PERMISSION`   | `Destination`アカウントに[Deposit Authorization](../../../../concepts/accounts/depositauth.md)が必要で、送金元が事前に承認されていない場合に発生します。 |
| `tecTOO_SOON`        | 送金元の`Sequence`番号が大きすぎる場合に発生します。トランザクションの`Sequence`番号に256を加えた値が、現行の[レジャーインデックス][]より小さい値でなければなりません。 |
| `tecHAS_OBLIGATIONS` | 削除するアカウントが、レジャーの削除できないオブジェクトに接続されている場合に発生します。([escrow](../../../../concepts/payment-types/escrow.md)など、他のアカウントによって作成されたオブジェクトが含まれます。) |
| `tefTOO_BIG`         | 送金元アカウントが、レジャーの1,000個を超えるオブジェクトにリンクされている場合に発生します。これらのオブジェクトの一部が先行して個別に削除された場合、トランザクションは再試行で成功する可能性があります。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
