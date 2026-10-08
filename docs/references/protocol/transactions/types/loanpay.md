---
seo:
    description: Make a payment on an active loan.
labels:
    - Transactions
    - Lending Protocol
requiredAmendment: LendingProtocol
txIcon: send
status: not_enabled
---
# LoanPay
{% source-link path="src/libxrpl/tx/transactors/lending/LoanPay.cpp" /%}

Makes a payment on an active loan. Only the borrower on the loan can make payments, and payments must meet the minimum amount required for that period.

{% amendment-disclaimer name="LendingProtocol" /%}

A loan payment has four types, depending on the amount and timing of the payment:

- **Regular Payment**: A payment made on time, where the payment size and schedule are calculated with a standard [amortization formula](https://en.wikipedia.org/wiki/Amortization_calculator).
- **Late Payment**: A payment made after the `NextPaymentDueDate` in the `Loan` ledger entry. Late payments include a `LatePaymentFee` and `LateInterestRate`.
- **Early Full Payment**: A payment that covers the outstanding principal of the loan. A `CloseInterestRate` is charged on the outstanding principal.
- **Overpayment**: A payment that exceeds the required minimum payment amount.

To see how loan payment transactions are calculated, see [LoanPay Implementation Reference](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0066-lending-protocol#a-3-loanpay-implementation-reference).


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanPay",
  "Account": "rBORROWER9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LoanID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Amount": 1000,
  "Sequence": 10,
  "LastLedgerSequence": 7108701
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name      | JSON Type           | Internal Type | Required? | Description |
|:--------------- |:--------------------|:--------------|:----------|:------------|
| `LoanID`        | String              | Hash256       | Yes       | The ID of the `Loan` ledger entry to repay. |
| `Amount`        | [Currency Amount][] | Amount        | Yes       | The amount to pay toward the loan. |


## {% $frontmatter.seo.title %} Flags

Transactions of the {% code-page-name /%} type support additional values in the [flags field], as follows:

| Flag Name           | Hex Value    | Decimal Value | Description |
|:--------------------|:-------------|:--------------|:------------|
| `tfLoanOverpayment` | `0x00010000` | 65536         | Indicates that the remaining payment amount should be treated as an overpayment. |
| `tfLoanFullPayment` | `0x00020000` | 131072        | Indicates that the borrower is making a full early repayment. |
| `tfLoanLatePayment` | `0x00040000` | 262144        | Indicates that the borrower is making a late loan payment. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code | Description |
|:-----------|:------------|
| `temINVALID` | The `LoanID` field is missing or set to zero. |
| `temBAD_AMOUNT` | The `Amount` field must specify a positive value. |
| `tecNO_ENTRY` | The loan specified by `LoanID` doesn't exist. |
| `tecNO_PERMISSION` | The transaction lacks the required permissions. This can occur when:<ul><li>The account submitting the transaction isn't the borrower on the loan.</li><li>The loan doesn't permit overpayments. {% amendment-disclaimer name="fixCleanup3_1_3" mode="updated" /%}</li></ul> |
| `tecTOO_SOON` | The loan hasn't started yet. |
| `tecKILLED` | The loan is already fully paid. |
| `tecWRONG_ASSET` | The asset specified by `Amount` doesn't match the asset of the loan. |
| `tecFROZEN` | The trust line token is frozen globally or frozen for the borrower; the vault's pseudo-account or the loan broker's pseudo-account is deep-frozen and can't receive funds. |
| `tecLOCKED` | The MPT asset is locked globally, for the borrower, for the vault's pseudo-account, or for the `LoanBroker` pseudo-account. |
| `tecEXPIRED` | The loan payment is late, and the `tfLoanLatePayment` flag isn't enabled. A payment made at exactly `NextPaymentDueDate` is considered on time. {% amendment-disclaimer name="fixCleanup3_4_0" mode="updated" /%} |
| `tecINSUFFICIENT_PAYMENT` | The `Amount` is less than the minimum amount required for the [loan payment type](../../../../concepts/tokens/lending-protocol.md#loan-payment-processing). |
| `tecINSUFFICIENT_FUNDS` | The borrower doesn't hold the full `Amount`, even if the payment needs less than that. If the asset is XRP, this could be because of the [reserve requirement](../../../../concepts/accounts/reserves.md). |
| `tecNO_AUTH` | The asset requires authorization, and the borrower isn't authorized to hold it. For MPTs, an issuer can revoke authorization after the loan is originated. |
| `tecNO_LINE` | The asset is a trust line token whose issuer requires authorization, and the borrower doesn't have a trust line for it. This can happen if a trust line is [deleted](../../../../concepts/tokens/fungible-tokens/trust-line-tokens#reserves-and-deletion) before making a repayment. |
| `tecPRECISION_LOSS` | The payment's effect on the vault is too small to register after rounding to the vault's precision, so the vault's `AssetsAvailable` or `AssetsTotal` wouldn't change. |
| `temINVALID_FLAG` | The transaction enables more than one of `tfLoanOverpayment`, `tfLoanFullPayment`, and `tfLoanLatePayment`. Only one can be enabled at a time. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
