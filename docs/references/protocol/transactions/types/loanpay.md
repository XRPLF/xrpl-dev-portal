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
  "Amount": "1000",
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
| `tfLoanFullPayment` | `0x00020000` | 131072        | Indicates that the borrower is making a full early repayment. If only one payment remains, submit a regular payment instead. |
| `tfLoanLatePayment` | `0x00040000` | 262144        | Indicates that the borrower is making a late loan payment. You must submit a late loan payment for each overdue payment period. |

These flags are mutually exclusive; only enable one at a time. All late payment periods must be repaid before you can enable other loan payment flags.


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code | Description |
|:-----------|:------------|
| `temINVALID` | The `LoanID` field is missing or set to zero. |
| `temBAD_AMOUNT` | The `Amount` field must specify a positive value. |
| `temINVALID_FLAG` | You specified an invalid flag, or you are trying to enable more than one valid flag. |
| `tecEXPIRED` | A loan payment is overdue and needs to be repayed with the `tfLoanLatePayment` flag enabled. |
| `tecINSUFFICIENT_PAYMENT` | The `Amount` is less than the amount due for the payment type. |
| `tecNO_ENTRY` | The loan specified by `LoanID` doesn't exist. |
| `tecNO_PERMISSION` | The transaction lacks the required permissions. This can occur when:<ul><li>The account submitting the transaction isn't the borrower on the loan.</li><li>The loan doesn't permit overpayments. {% amendment-disclaimer name="fixCleanup3_1_3" mode="updated" /%}</li></ul> |
| `tecTOO_SOON` | The transaction has `tfLoanLatePayment` enabled, but the loan payment isn't overdue. |
| `tecKILLED` | This can occur when:<ul><li>The loan is already fully paid.</li><li>The transaction has `tfLoanFullPayment` enabled, but only one payment remains on the loan.</li></ul> |
| `tecWRONG_ASSET` | The asset specified by `Amount` doesn't match the asset of the loan. |
| `tecFROZEN` | The borrower's account is frozen for the specified asset, or the loan broker's pseudo-account is deep-frozen and can't receive funds. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
