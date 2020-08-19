| フィールド                                 | 値               | 説明    |
|:--------------------------------------|:--------------------|:---------------|
| `AffectedNodes`                       | 配列               | このトランザクションで作成、削除、または修正された[レジャーオブジェクト](ledger-object-types.html)のリストと、個々のオブジェクトに対する具体的な変更内容。 |
| `DeliveredAmount`                     | [通貨額][] | **廃止予定。**`delivered_amount`で置き換えられます。Partial Paymentsでない場合は省略されます。 |
| `TransactionIndex`                    | 符号なし整数    | トランザクションが記録されているレジャーでのトランザクションの位置。この配列は0から始まります。（例えば、値が`2`の場合、そのレジャーの3番目のトランザクションであったことを意味します）。 |
| `TransactionResult`                   | 文字列              | トランザクションが成功したか、どのような理由で失敗したかを示す[結果コード](transaction-results.html)。 |
| [`delivered_amount`](transaction-metadata.html#delivered_amount) | [通貨額][] | `Destination`アカウントが実際に受取った[通貨額][]。このフィールドは、トランザクションが[Partial Payments](partial-payments.html)であるかどうかにかかわらず、送金された金額を特定するために使用します。[新規: rippled 0.27.0][] |
