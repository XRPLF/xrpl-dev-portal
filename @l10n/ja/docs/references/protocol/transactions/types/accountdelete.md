---
seo:
    description: アカウントの削除
labels:
  - アカウント
---
# AccountDelete

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/DeleteAccount.cpp "Source")

AccountDeleteトランザクションは、XRP Ledgerで[アカウント](../../ledger-data/ledger-entry-types/accountroot.md)と、アカウントが所有するオブジェクトを削除し、可能であれば、アカウントの残りのXRPを指定された送金先アカウントに送信します。アカウントを削除する要件については、[アカウントの削除](../../../../concepts/accounts/deleting-accounts.md)をご覧ください。

_[DeletableAccounts Amendment][]が必要です。_

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

{% tx-example txid="1AF19BF9717DA0B05A3BFC5007873E7743BA54C0311CCCCC60776AAEAC5C4635" /%}


{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド       | JSONの型              | [内部の型][] | 必須?  | 説明 |
| :--------------- | :-------------------- | :----------- | :----- | ---- |
| `CredentialIDs`  | 文字列の配列          | Vector256    | いいえ | このトランザクションによる入金を承認する資格情報のセット。配列の各メンバーは、レジャー内のCredentialエントリのレジャーエントリIDでなければなりません。詳細については、[Credential ID](./payment.md#credential-ids)をご覧ください。 |
| `Destination`    | 文字列 - [アドレス][] | AccountID    | はい   | 送金元アカウントを削除した後の残りのXRPを受け取るアカウントのアドレス。レジャー内の資金供給のあるアカウントでなければならず、送金元アカウントであってはいけません。 |
| `DestinationTag` | 数値                  | UInt32       | いいえ | 削除されたアカウントの残りのXRPの受取人を識別する任意の[宛先タグ](../../../../concepts/transactions/source-and-destination-tags.md)、または受取人のその他の情報。 |


## 特別なトランザクションコスト

レジャースパム対策として、AccountDeleteトランザクションは通常よりもはるかに高い[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)を要求します。標準の最小値である0.00001 XRPの代わりに、AccountDeleteは少なくとも所有者準備金の量、現在は{% $env.PUBLIC_OWNER_RESERVE %}をバーンする必要があります。これにより、アカウントを削除することで[準備金](../../../../concepts/accounts/reserves.md)分のXRPを完全に回収できないため、新しいアカウントの過剰な作成を抑制します。

トランザクションコストは、トランザクションが検証済みレジャーに含まれている場合は常に適用されます。アカウントを削除できない場合でも、トランザクションは失敗します。(詳細は、[エラーケース](#エラーケース)をご覧ください。)アカウントを削除できない場合の高いトランザクションコストを支払う可能性を大幅に減らすには、[トランザクションを送信](../../../http-websocket-apis/public-api-methods/transaction-methods/submit.md)する際に`fail_hard`を有効にしてください。


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
