---
seo:
    description: エスクローされたXRPを受取人へ送金します。
labels:
    - Escrow
---
# EscrowFinish
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Escrow.cpp "Source")

エスクロー(保留中の支払い)から受取人へXRPを送金します。

{% amendment-disclaimer name="Escrow" /%}

## {% $frontmatter.seo.title %} JSONの例

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "EscrowFinish",
    "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "OfferSequence": 7,
    "Condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
    "Fulfillment": "A0028000"
}
```

{% tx-example txid="317081AF188CDD4DBE55C418F41A90EC3B959CDB3B76105E0CBE6B7A0F56C5F7" /%}


{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド      | JSONの型     | [内部の型][] | 必須?  | 説明 |
| :-------------- | :----------- | :----------- | :----- | ---- |
| `Owner`         | 文字列       | AccountID    | はい   | エスクローに資金を供給した支払元アカウントのアドレス。 |
| `OfferSequence` | 数値         | UInt32       | はい   | 対象となるエスクローを作成した[EscrowCreateトランザクション][]のトランザクションシーケンス。 |
| `Condition`     | 文字列       | Blob         | いいえ | 以前に指定されたエスクローの[PREIMAGE-SHA-256 Crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1)に一致する16進数値。 |
| `CredentialIDs` | 文字列の配列 | Vector256    | いいえ | このトランザクションによって作成されたエスクローによる資金提供を承認する資格証明書のセット。各配列のメンバーは、レジャーの資格証明書エントリのレジャーエントリIDでなければなりません。詳細については、[Credential ID](./payment.md#credential-ids)をご覧ください。 |
| `Fulfillment`   | 文字列       | Blob         | いいえ | エスクローの`Condition`に一致する[PREIMAGE-SHA-256 crypto-condition fulfillment](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1.4)の16進数値。 |

すべてのアカウントがEscrowFinishトランザクションを送信できます。

- エスクローに`FinishAfter`時刻が設定されている場合、この時刻よりも前にはこれを実行(Finish)できません。具体的には、対応する[EscrowCreateトランザクション][]で指定されている`FinishAfter`時刻が、最後に閉鎖されたレジャーの閉鎖時刻よりも後の場合、EscrowFinishトランザクションは失敗します。
- エスクローに`Condition`が指定されている場合に、その条件に対応する`Fulfillment`を指定しないと、この支払いを実行(Finish)できません。
- 有効期限切れのエスクローは実行(Finish)できません。具体的には、対応する[EscrowCreateトランザクション][]で指定されている`CancelAfter`時刻が、最後に閉鎖されたレジャーの閉鎖時刻よりも前の場合、EscrowFinishトランザクションは失敗します。

{% admonition type="info" name="注記" %}EscrowFinishトランザクションにフルフィルメントが含まれている場合、このトランザクションを送信するための最小[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)が増加します。トランザクションにフルフィルメントが含まれていない場合、トランザクションコストは標準の10 dropです。トランザクションにフルフィルメントが含まれている場合、トランザクションコストは330 [XRP drop][XRPのdrop数]に加えて、プリイメージサイズの16バイトごとに更に10 dropです。{% /admonition %}

[本番環境以外のネットワーク](../../../../concepts/networks-and-servers/parallel-networks.md)では、Escrowの送金先アカウントを[削除](../../../../concepts/accounts/deleting-accounts.md)できる場合があります。この場合、 Escrowを終了しようとしても結果`tecNO_TARGET`で失敗しますが、Escrowオブジェクトは通常期限切れになる場合を除き、維持されます。別の支払いで送金先アカウントが再作成された場合、 Escrowは正常に終了できます。Escrowの送金先アカウントは、[fix1523 Amendment](/resources/known-amendments.md#fix1523)が有効になる前にEscrowが作成された場合にのみ削除できます。本番環境の XRP LedgerにはそのようなEscrowは存在しないため、本番環境のXRP Ledgerではこのようなエッジケースには対応できません。また、このエッジケースは、fix1523とEscrowのAmendmentを同時に有効にするテストネットワークでも不可能です。これは、[新しいジェネシスレジャーを開始](../../../../infrastructure/testing-and-auditing/start-a-new-genesis-ledger-in-stand-alone-mode.md)するときのデフォルトです。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
