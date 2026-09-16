---
seo:
    description: Create a new loan agreement between a loan broker and borrower.
labels:
    - Transactions
    - Lending Protocol
requiredAmendment: LendingProtocol
txIcon: modify
status: not_enabled
---
# LoanSet
{% source-link path="src/libxrpl/tx/transactors/lending/LoanSet.cpp" /%}

Creates a new `Loan` ledger entry, representing a loan agreement between a _Loan Broker_ and _Borrower_.

The `LoanSet` transaction is a mutual agreement between the _Loan Broker_ and _Borrower_, and must be signed by both parties. The following multi-signature flow can be initiated by either party:

1. The borrower or loan broker creates the transaction with the preagreed terms of the loan. They sign the transaction and set the `SigningPubKey`, `TxnSignature`, `Signers`, `Account`, `Fee`, `Sequence`, and `Counterparty` fields.
2. The counterparty verifies the loan terms and signature before signing and submitting the transaction.

{% admonition type="info" name="Note" %}
Loans created after the [LendingProtocolV1_1 amendment][] is enabled can only be originated against a closed-ended vault during its _Investment_ phase, and only if the loan's final scheduled payment is at least 60 seconds before the vault enters its _Redemption_ phase. This means the maximum term of new loans shrinks as the vault approaches its `RedemptionDate`.
{% /admonition %}

{% amendment-disclaimer name="LendingProtocol" /%}
{% amendment-disclaimer name="LendingProtocolV1_1" mode="updated" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanSet",
  "Account": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "Data": "546869732069732061726269747261727920646174612061626F757420746865206C6F616E2E",
  "Counterparty": "rCOUNTER9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "LoanOriginationFee": 100,
  "LoanServiceFee": 10,
  "LatePaymentFee": 5,
  "ClosePaymentFee": 20,
  "OverpaymentFee": 5,
  "InterestRate": 500,
  "LateInterestRate": 1000,
  "CloseInterestRate": 200,
  "OverpaymentInterestRate": 5,
  "PrincipalRequested": 10000,
  "PaymentTotal": 12,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "SigningPubKey": "03C040CAC1E164B0E385D31E41447FE6B8960E0D202811CFDA08B55BA29E08C6B0",
  "TxnSignature": "30440220549D359F792E155D20B5E8B3423F0F844CCF7C86986EB85BE482908A55A7157D02207B464FFE57E75D9693BAC445540CF078E9E0B6452C917DE4D66F27918D32A170",
  "hash": "831EEFF19C980FC348E984625FE41AEB27301B0B072D4239A980E78B86B2515C"
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name                | JSON Type | Internal Type | Required? | Description |
|:--------------------------|:----------|:--------------|:----------|:------------|
| `LoanBrokerID`            | String    | Hash256       | Yes       | The ID of the `LoanBroker` ledger entry. |
| `Data`                    | String    | Blob          | No        | Arbitrary metadata in hex format (max 256 bytes). |
| `Counterparty`            | String    | AccountID     | No        | The address of the counterparty of the loan. |
| `LoanOriginationFee`      | String    | Number        | No        | The amount paid to the `LoanBroker` owner when the loan is created. |
| `LoanServiceFee`          | String    | Number        | No        | The amount paid to the `LoanBroker` owner with each loan payment. |
| `LatePaymentFee`          | String    | Number        | No        | The amount paid to the `LoanBroker` owner for late payments. |
| `ClosePaymentFee`         | String    | Number        | No        | The amount paid to the `LoanBroker` owner for early full repayment. |
| `OverpaymentFee`          | Number    | UInt32        | No        | A fee charged on overpayments, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `InterestRate`            | Number    | UInt32        | No        | The annualized interest rate of the loan, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `LateInterestRate`        | Number    | UInt32        | No        | A premium added to the interest rate for late payments, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `CloseInterestRate`       | Number    | UInt32        | No        | A fee charged for repaying the loan early, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `OverpaymentInterestRate` | Number    | UInt32        | No        | The interest rate charged on overpayments, in units of 1/10th basis points. Valid values are 0 to 100000 (inclusive), representing 0% to 100%. |
| `PrincipalRequested`      | String    | Number        | Yes       | The principal loan amount requested by the borrower. |
| `PaymentTotal`            | Number    | UInt32        | No        | The total number of payments to be made against the loan. |
| `PaymentInterval`         | Number    | UInt32        | No        | The number of seconds between loan payments. |
| `GracePeriod`             | Number    | UInt32        | No        | The number of seconds after the loan's payment due date when it can be defaulted. |
| `SigningPubKey`           | String    | Blob          | Yes       | The public key used to verify the validity of the first signer's signature. |
| `TxnSignature`            | String    | Blob          | Yes       | The hex encoding of the digital signature for the first signing. |
| `hash`                    | String    | Hash256       | Yes       | The unique identifying hash of the partially-signed transaction. |

### CounterpartySignature Fields

An inner object that contains the signatures of the counterparty of the transaction. The object contains the following fields:

| Field Name      | JSON Type | Internal Type | Required? | Description |
|:----------------|:----------|:--------------|:----------|:------------|
| `SigningPubKey` | String    | STBlob        | No        | The public key used to verify the validity of the signature. |
| `TxnSignature`     | String    | STBlob        | No        | The signature over all signing fields. Must be generated using role-specific hash prefixes {% amendment-disclaimer name="fixCleanup3_4_0" mode="updated" /%}. Standard transaction signatures are rejected. |
| `Signers`       | List      | STArray       | No        | An array of transaction signatures from the counterparty. Each signature must be generated using role-specific hash prefixes {% amendment-disclaimer name="fixCleanup3_4_0" mode="updated" /%}. Standard transaction signatures are rejected. |

The final transaction must include either:
- Both the `SigningPubKey` and `TxnSignature` fields.
- The `Signers` field.

{% admonition type="info" name="Note" %}
This field isn't included in the `LoanSet` JSON the first party signs, instead it's added by the counterparty when they sign.
{% /admonition %}


## {% $frontmatter.seo.title %} Flags

Transactions of the {% code-page-name /%} type support additional values in the [`flags` field], as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|:----------|:----------|:--------------|:------------|
| `tfLoanOverpayment` | `0x00010000` | 65536 | Indicates that the loan supports overpayments. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code                | Description                        |
|:--------------------------|:-----------------------------------|
| `tecEXPIRED`              | The vault is closed-ended and has entered its _Redemption_ phase. {% amendment-disclaimer name="LendingProtocolV1_1" /%} |
| `tecINSUFFICIENT_FUNDS`   | <li>The `Vault` associated with the `LoanBroker` doesn't have enough assets to fund the loan.</li><li>The `LoanBroker` ledger entry doesn't have enough first-loss capital to meet the minimum coverage requirement for the new total debt.</li> |
| `tecINSUFFICIENT_RESERVE` | The borrower's account doesn't have enough XRP to meet the reserve requirements. |
| `tecKILLED`               | The `GracePeriod`, `PaymentInterval`, or `PaymentTotal` (individually or combined) exceeds the latest time the protocol can represent. |
| `tecLIMIT_EXCEEDED`       | <li>The requested loan would cause the `LoanBroker` ledger entry to exceed its maximum allowed debt.</li><li>The vault's `AssetsTotal` already meets or exceeds its `AssetsMaximum`. Doesn't apply to cash-basis vaults.</li><li>The loan's interest would push the vault's `AssetsTotal` past its `AssetsMaximum`. Doesn't apply to cash-basis vaults.</li> |
| `tecNO_ENTRY`             | The `LoanBroker` doesn't exist. |
| `tecNO_PERMISSION`        | <li>Neither the transaction sender's `Account` or the `Counterparty` field owns the associated `LoanBroker` ledger entry.</li><li>The vault is closed-ended and the loan's final scheduled payment is less than 60 seconds before the vault's `RedemptionDate`. {% amendment-disclaimer name="LendingProtocolV1_1" mode="updated" /%}</li> |
| `tecPRECISION_LOSS`       | <li>`PrincipalRequested` or one of the fee amounts is more precise than the vault's asset can hold.</li><li>The amount fits the asset, but is more precise than the loan's `LoanScale`.</li> |
| `tecTOO_SOON`             | The vault is closed-ended and still in its _Subscription_ phase. {% amendment-disclaimer name="LendingProtocolV1_1" /%} |
| `temBAD_SIGNATURE`        | The `SigningPubKey` inside the `CounterpartySignature` isn't a valid public key. |
| `temBAD_SIGNER`           | <li>The transaction _isn't_ part of a `Batch` transaction and is missing a `CounterpartySignature`.</li><li>`Counterparty` is omitted and `LoanBrokerID` doesn't match an existing `LoanBroker` entry.</li> |
| `temINVALID`              | <li>`Data` is present but empty, or longer than 256 bytes.</li><li>A numeric field is outside its valid range. For example, the `GracePeriod` can't be longer than the `PaymentInterval` or less than `60` seconds.</li><li>`LoanBrokerID` is zero.</li> |
| `temINVALID_FLAG`         | <li>`Flags` contains a value other than `tfLoanOverpayment`.</li><li>The transaction requests reserve sponsorship, which {% code-page-name /%} doesn't support. {% amendment-disclaimer name="Sponsor" mode="updated" /%}</li> |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
