# Lending Protocol Examples (JavaScript)

This directory contains JavaScript examples demonstrating how to create a Loan Broker, deposit and withdraw first-loss capital, create a loan, and manage a loan.

## Setup

Install dependencies before running any examples:

```sh
npm i
```

---

## Create a Loan Broker

```sh
node createLoanBroker.js
```

The script should output the LoanBrokerSet transaction, loan broker ID, and loan broker pseudo-account:

```sh
Loan broker/vault owner address: rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY
Vault ID: 33E51DD0333775E37F2CC1EB0DA788F9C663AF919DC23ED595A8D69330E5CD68

=== Preparing LoanBrokerSet transaction ===

{
  "TransactionType": "LoanBrokerSet",
  "Account": "rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY",
  "VaultID": "33E51DD0333775E37F2CC1EB0DA788F9C663AF919DC23ED595A8D69330E5CD68",
  "ManagementFeeRate": 1000
}

=== Submitting LoanBrokerSet transaction ===

Loan broker created successfully!

=== Loan Broker Information ===

LoanBroker ID: 0AA13C8A8E95D8F2D9EF1FA1B15EF4668EF779A678D1D24D099C532E126E8BBF
LoanBroker Psuedo-Account Address: rfhftuQGpqUVRcERZbY9htJshijKur7dS4
```

---

## Deposit and Withdraw First-loss Capital

```sh
node coverDepositAndWithdraw.js
```

The script should output the LoanBrokerCoverDeposit, cover balance after the deposit, the LoanBrokerCoverWithdraw transaction, and the cover balance after the withdrawal:

```sh
Loan broker address: rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY
LoanBrokerID: F133118D55342F7F78188BDC9259E8593853010878C9F6CEA0E2F56D829C6B15
MPT ID: 0031034FF84EB2E8348A34F0A8889A54F45F180E80F12341

=== Preparing LoanBrokerCoverDeposit transaction ===

{
  "TransactionType": "LoanBrokerCoverDeposit",
  "Account": "rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY",
  "LoanBrokerID": "F133118D55342F7F78188BDC9259E8593853010878C9F6CEA0E2F56D829C6B15",
  "Amount": {
    "mpt_issuance_id": "0031034FF84EB2E8348A34F0A8889A54F45F180E80F12341",
    "value": "2000"
  }
}

=== Submitting LoanBrokerCoverDeposit transaction ===

Cover deposit successful!

=== Cover Balance ===

LoanBroker Pseudo-Account: rf5FREUsutDyDAaVPPvZnNmoEETr21sPDd
Cover balance after deposit: 2000 TSTUSD

=== Preparing LoanBrokerCoverWithdraw transaction ===

{
  "TransactionType": "LoanBrokerCoverWithdraw",
  "Account": "rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY",
  "LoanBrokerID": "F133118D55342F7F78188BDC9259E8593853010878C9F6CEA0E2F56D829C6B15",
  "Amount": {
    "mpt_issuance_id": "0031034FF84EB2E8348A34F0A8889A54F45F180E80F12341",
    "value": "1000"
  }
}

=== Submitting LoanBrokerCoverWithdraw transaction ===

Cover withdraw successful!

=== Updated Cover Balance ===

LoanBroker Pseudo-Account: rf5FREUsutDyDAaVPPvZnNmoEETr21sPDd
Cover balance after withdraw: 1000 TSTUSD
```

---

## Create a Loan

```sh
node createLoan.js
```

The script should output the LoanSet transaction, the updated LoanSet transaction with the loan broker signature, the final LoanSet transaction with the borrower signature added, and then the loan information:

```sh
Loan broker address: rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY
Borrower address: r46Ef5jjnaY7CDP7g22sQgSJJPQEBSmbWA
LoanBrokerID: F133118D55342F7F78188BDC9259E8593853010878C9F6CEA0E2F56D829C6B15

=== Preparing LoanSet transaction ===

{
  "TransactionType": "LoanSet",
  "Account": "rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY",
  "Counterparty": "r46Ef5jjnaY7CDP7g22sQgSJJPQEBSmbWA",
  "LoanBrokerID": "F133118D55342F7F78188BDC9259E8593853010878C9F6CEA0E2F56D829C6B15",
  "PrincipalRequested": 1000,
  "InterestRate": 500,
  "PaymentTotal": 12,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "LoanOriginationFee": 100,
  "LoanServiceFee": 10,
  "Flags": 0,
  "Sequence": 3212122,
  "LastLedgerSequence": 3212233,
  "Fee": "2"
}

=== Adding loan broker signature ===

TxnSignature: 44348B918E780608534A9499B9990470E6A3C8E5C7DAC33BF2A5EFA0C292D17B3267D3A177A363CC832D6C6DA36E41CB64909C39CA5D55CF36D232DA49022400
SigningPubKey: ED37EF81218C3C97389A11F07C8339C2880CEAF1A8C6EB539C616D69EF5EBC688C

Signed loanSetTx for borrower to sign over:
{
  "Account": "rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY",
  "Counterparty": "r46Ef5jjnaY7CDP7g22sQgSJJPQEBSmbWA",
  "Fee": "2",
  "Flags": 0,
  "GracePeriod": 604800,
  "InterestRate": 500,
  "LastLedgerSequence": 3212233,
  "LoanBrokerID": "F133118D55342F7F78188BDC9259E8593853010878C9F6CEA0E2F56D829C6B15",
  "LoanOriginationFee": "100",
  "LoanServiceFee": "10",
  "PaymentInterval": 2592000,
  "PaymentTotal": 12,
  "PrincipalRequested": "1000",
  "Sequence": 3212122,
  "SigningPubKey": "ED37EF81218C3C97389A11F07C8339C2880CEAF1A8C6EB539C616D69EF5EBC688C",
  "TransactionType": "LoanSet",
  "TxnSignature": "44348B918E780608534A9499B9990470E6A3C8E5C7DAC33BF2A5EFA0C292D17B3267D3A177A363CC832D6C6DA36E41CB64909C39CA5D55CF36D232DA49022400"
}

=== Adding borrower signature ===

Borrower TxnSignature: 2D17F5BAED2540CD875B009A99B02649E24A5DCDFDC5BAFCB2DC41F998FE4AFBDD6BDF8BDF1C3C857ED8DD638F10BEA10295812155D9759E3ADED9D6208F150F
Borrower SigningPubKey: ED4C7C0127EFEAFD04B2CDFA1CA3A8EF5933227C610031DF2130010B73CBBBDCDA

Fully signed LoanSet transaction:
{
  "Account": "rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY",
  "Counterparty": "r46Ef5jjnaY7CDP7g22sQgSJJPQEBSmbWA",
  "CounterpartySignature": {
    "SigningPubKey": "ED4C7C0127EFEAFD04B2CDFA1CA3A8EF5933227C610031DF2130010B73CBBBDCDA",
    "TxnSignature": "2D17F5BAED2540CD875B009A99B02649E24A5DCDFDC5BAFCB2DC41F998FE4AFBDD6BDF8BDF1C3C857ED8DD638F10BEA10295812155D9759E3ADED9D6208F150F"
  },
  "Fee": "2",
  "Flags": 0,
  "GracePeriod": 604800,
  "InterestRate": 500,
  "LastLedgerSequence": 3212233,
  "LoanBrokerID": "F133118D55342F7F78188BDC9259E8593853010878C9F6CEA0E2F56D829C6B15",
  "LoanOriginationFee": "100",
  "LoanServiceFee": "10",
  "PaymentInterval": 2592000,
  "PaymentTotal": 12,
  "PrincipalRequested": "1000",
  "Sequence": 3212122,
  "SigningPubKey": "ED37EF81218C3C97389A11F07C8339C2880CEAF1A8C6EB539C616D69EF5EBC688C",
  "TransactionType": "LoanSet",
  "TxnSignature": "44348B918E780608534A9499B9990470E6A3C8E5C7DAC33BF2A5EFA0C292D17B3267D3A177A363CC832D6C6DA36E41CB64909C39CA5D55CF36D232DA49022400"
}

=== Submitting signed LoanSet transaction ===

Loan created successfully!

=== Loan Information ===

{
  "Borrower": "r46Ef5jjnaY7CDP7g22sQgSJJPQEBSmbWA",
  "GracePeriod": 604800,
  "InterestRate": 500,
  "LoanBrokerID": "F133118D55342F7F78188BDC9259E8593853010878C9F6CEA0E2F56D829C6B15",
  "LoanOriginationFee": "100",
  "LoanSequence": 3,
  "LoanServiceFee": "10",
  "NextPaymentDueDate": 825408182,
  "PaymentInterval": 2592000,
  "PaymentRemaining": 12,
  "PeriodicPayment": "83.55610375293148956",
  "PrincipalOutstanding": "1000",
  "StartDate": 822816182,
  "TotalValueOutstanding": "1003"
}
```

---

## Manage a Loan

```sh
node loanManage.js
```

The script should output the initial status of the loan, the LoanManage transaction, and the updated loan status and grace period after impairment. The script will countdown the grace period before outputting another LoanManage transaction, and then the final flags on the loan.

```sh
Loan broker address: rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY
LoanID: D28764B238CF3F7D7BF4AFD07394838EDD5F278B838F97A55BEAEC1E5152719C

=== Loan Status ===

Total Amount Owed: 1001 TSTUSD.
Payment Due Date: 2/25/2026, 11:58:20 PM

=== Preparing LoanManage transaction to impair loan ===

{
  "TransactionType": "LoanManage",
  "Account": "rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY",
  "LoanID": "D28764B238CF3F7D7BF4AFD07394838EDD5F278B838F97A55BEAEC1E5152719C",
  "Flags": 131072
}

=== Submitting LoanManage impairment transaction ===

Loan impaired successfully!
New Payment Due Date: 1/27/2026, 12:05:02 AM
Grace Period: 60 seconds

=== Countdown until loan can be defaulted ===

Grace period expired. Loan can now be defaulted.

=== Preparing LoanManage transaction to default loan ===

{
  "TransactionType": "LoanManage",
  "Account": "rKL3u76wNGdF2Th4EvCuHV5885T6h2iFTY",
  "LoanID": "D28764B238CF3F7D7BF4AFD07394838EDD5F278B838F97A55BEAEC1E5152719C",
  "Flags": 65536
}

=== Submitting LoanManage default transaction ===

Loan defaulted successfully!

=== Checking final loan status ===

Final loan flags (parsed): {"tfLoanDefault":true,"tfLoanImpair":true}
```

## Pay a Loan

```sh
node loanPay.js
```

The script should output the amount required to totally pay off a loan, the LoanPay transaction, the amount due after the payment, the LoanDelete transaction, and then the status of the loan ledger entry:

```sh
Borrower address: r46Ef5jjnaY7CDP7g22sQgSJJPQEBSmbWA
LoanID: 8AC2B4425E604E7BB1082DD2BF2CA902B5087143B7775BE0A4DA954D3F52D06E
MPT ID: 0031034FF84EB2E8348A34F0A8889A54F45F180E80F12341

=== Loan Status ===

Amount Owed: 1001 TSTUSD
Loan Service Fee: 10 TSTUSD
Total Payment Due (including fees): 1011 TSTUSD

=== Preparing LoanPay transaction ===

{
  "TransactionType": "LoanPay",
  "Account": "r46Ef5jjnaY7CDP7g22sQgSJJPQEBSmbWA",
  "LoanID": "8AC2B4425E604E7BB1082DD2BF2CA902B5087143B7775BE0A4DA954D3F52D06E",
  "Amount": {
    "mpt_issuance_id": "0031034FF84EB2E8348A34F0A8889A54F45F180E80F12341",
    "value": "1011"
  }
}

=== Submitting LoanPay transaction ===

Loan paid successfully!

=== Loan Status After Payment ===

Outstanding Loan Balance: Loan fully paid off!

=== Preparing LoanDelete transaction ===

{
  "TransactionType": "LoanDelete",
  "Account": "r46Ef5jjnaY7CDP7g22sQgSJJPQEBSmbWA",
  "LoanID": "8AC2B4425E604E7BB1082DD2BF2CA902B5087143B7775BE0A4DA954D3F52D06E"
}

=== Submitting LoanDelete transaction ===

Loan deleted successfully!

=== Verifying Loan Deletion ===

Loan has been successfully removed from the XRP Ledger!
```
