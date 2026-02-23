---
seo:
    description: A Loan ledger entry represents the terms of a loan between a borrower and loan issuer.
labels:
  - Decentralized Finance
  - Lending Protocol
status: not_enabled
---

# Loan
[[Source]](https://github.com/XRPLF/rippled/blob/release-3.1/include/xrpl/protocol/detail/ledger_entries.macro#L543-L623 "Source")

A `Loan` ledger entry defines the state of an on-chain loan agreement between a _Loan Broker_ and a _Borrower_. It contains all the details of the loan, such as fees and interest rates. You can create a `Loan` ledger entry with the [LoanSet transaction][].

The `Loan` ledger entry is tracked in two [Owner Directories](./directorynode.md):
1. The owner directory of the _Borrower_ on the loan.
2. The owner directory of the `LoanBroker` pseudo-account.

{% amendment-disclaimer name="LendingProtocol" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "LedgerEntryType": "Loan",
  "LedgerIndex": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Flags": "0",
  "PreviousTxnID": "9A8765B4321CDE987654321CDE987654321CDE987654321CDE987654321CDE98",
  "PreviousTxnLgrSeq": 12345678,
  "LoanSequence": 1,
  "OwnerNode": 2,
  "LoanBrokerNode": 1,
  "LoanBrokerID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Borrower": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "LoanOriginationFee": 100,
  "LoanServiceFee": 10,
  "LatePaymentFee": 5,
  "ClosePaymentFee": 20,
  "OverpaymentFee": 5,
  "InterestRate": 500,
  "LateInterestRate": 1000,
  "CloseInterestRate": 200,
  "OverpaymentInterestRate": 5,
  "StartDate": 1234567890,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "PreviousPaymentDueDate": 1234587890,
  "NextPaymentDueDate": 1234597890,
  "PaymentRemaining": 12,
  "PrincipalOutstanding": 10000,
  "TotalValueOutstanding": 12000,
  "ManagementFeeOutstanding": 2000,
  "PeriodicPayment": 1000
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common ledger entry fields][], {% code-page-name /%} entries have the following fields:

| Name                  | JSON Type | Internal Type | Required? | Description |
| :-------------------- | :-------- | :------------ | :-------- | :-----------|
| `PreviousTxnID`       | String    | Hash256       | Yes       | Identifies the transaction ID that most recently modified this object. |
| `PreviousTxnLgrSeq`   | Number    | UInt32        | Yes       | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `LoanSequence`        | Number    | UInt32        | Yes       | The sequence number of the loan. |
| `OwnerNode`           | Number    | UInt64        | Yes       | Identifies the page where this item is referenced in the owner's directory. |
| `LoanBrokerNode`      | Number    | UInt64        | Yes       | Identifies the page where this item is referenced in the `LoanBroker` owner directory. |
| `LoanBrokerID`        | String    | Hash256       | Yes       | The ID of the _Loan Broker_ associated with this loan. |
| `Borrower`            | String    | AccountID     | Yes       | The account address of the _Borrower_. |
| `LoanOriginationFee`  | String    | Number        | Yes       | The amount paid to the _Loan Broker_, taken from the principal loan at creation. |
| `LoanServiceFee`      | String    | Number        | Yes       | The amount paid to the _Loan Broker_ with each loan payment. |
| `LatePaymentFee`      | String    | Number        | Yes       | The amount paid to the _Loan Broker_ for each late payment. |
| `ClosePaymentFee`     | String    | Number        | Yes       | The amount paid to the _Loan Broker_ when a full early payment is made. |
| `OverpaymentFee`      | Number    | UInt32        | Yes       | The fee charged on overpayments, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `InterestRate`        | Number    | UInt32        | Yes       | The annualized interest rate of the loan, in 1/10th basis points. |
| `LateInterestRate`    | Number    | UInt32        | Yes       | The premium added to the interest rate for late payments, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `CloseInterestRate`   | Number    | UInt32        | Yes       | The interest rate charged for repaying the loan early, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `OverpaymentInterestRate` | Number | UInt32       | Yes       | The interest rate charged on overpayments, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `StartDate`           | Number    | UInt32        | Yes       | The timestamp of when the loan started, in [seconds since the Ripple Epoch][]. |
| `PaymentInterval`     | Number    | UInt32        | Yes       | The number of seconds between loan payments. |
| `GracePeriod`         | Number    | UInt32        | Yes       | The number of seconds after a loan payment is due before the loan defaults. |
| `PreviousPaymentDueDate` | Number    | UInt32        | Yes       | The timestamp of when the previous payment was made, in [seconds since the Ripple Epoch][]. |
| `NextPaymentDueDate`  | Number    | UInt32        | Yes       | The timestamp of when the next payment is due, in [seconds since the Ripple Epoch][]. |
| `PaymentRemaining`    | Number    | UInt32        | Yes       | The number of payments remaining on the loan. |
| `PrincipalOutstanding` | String   | Number        | Yes       | The principal amount still owed on the loan. |
| `TotalValueOutstanding` | String  | Number        | Yes       | The total amount owed on the loan, including remaining principal and fees. |
| `ManagementFeeOutstanding` | String | Number      | Yes       | The remaining management fee owed to the loan broker. |
| `PeriodicPayment`     | String    | Number        | Yes       | The amount due for each payment interval. |
| `LoanScale`           | Number    | Int32         | No        | The scale factor that ensures all computed amounts are rounded to the same number of decimal places. It is based on the total loan value at creation time. |

{% admonition type="info" name="Note" %}
When the loan broker discovers that the borrower can't make an upcoming payment, they can impair the loan to register a "paper loss" with the vault. The impairment mechanism moves up the `NextPaymentDueDate` to the time the loan is impaired, allowing the loan to default quicker. However, if the borrower makes a payment in the subsequent `GracePeriod`, the impairment status is removed.
{% /admonition %}


## {% $frontmatter.seo.title %} Flags

{% code-page-name /%}  entries can have the following flags:

| Field Name           | Hex Value    | Decimal Value | Description |
|:---------------------|:-------------|:--------------|:------------|
| `lsfLoanDefault`     | `0x00010000` | `65536`       | Indicates the loan is defaulted. |
| `lsfLoanImpaired`    | `0x00020000` | `131072`      | Indicates the loan is impaired. |
| `lsfLoanOverpayment` | `0x00040000` | `262144`      | Indicates the loan supports overpayments. |


## {% $frontmatter.seo.title %} Reserve

`Loan` entries incur one owner reserve from the borrower.


## {% $frontmatter.seo.title %} ID Format

The ID of a `Loan` ledger entry is the [SHA-512Half][] of the following values, concatenated in order:

- The `Loan` space key `0x004C`.
- The `LoanBrokerID` of the associated `LoanBroker` ledger entry.
- The `LoanSequence` number of the `LoanBroker` ledger entry.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
