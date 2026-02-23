# Lending Protocol Examples (JavaScript)

This directory contains JavaScript examples demonstrating how to create a loan broker, claw back first-loss capital, deposit and withdraw first-loss capital, create a loan, manage a loan, and repay a loan.

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

## Claw Back First-loss Capital

```sh
node coverClawback.js
```

The script should output the cover available, the LoanBrokerCoverDeposit transaction, cover available after the deposit, the LoanBrokerCoverClawback transaction, and the final cover available after the clawback:

```sh
Loan broker address: r9tQSk5rQdjjVGn1brt8K5XNYFvNSLv3xU
MPT issuer address: rJ7DiJdcThwLD5rZjC7D1neXmvLFAGk9t3
LoanBrokerID: 655C32ADFCA0712F3CB32CA034C29FE3DE9DE876A86141F0902FB1E05DA0E442
MPT ID: 00349F41BFA01892C83AC779E4BBB80C8CE3B92D401E4B6E

=== Cover Available ===

0 TSTUSD

=== Preparing LoanBrokerCoverDeposit transaction ===

{
  "TransactionType": "LoanBrokerCoverDeposit",
  "Account": "r9tQSk5rQdjjVGn1brt8K5XNYFvNSLv3xU",
  "LoanBrokerID": "655C32ADFCA0712F3CB32CA034C29FE3DE9DE876A86141F0902FB1E05DA0E442",
  "Amount": {
    "mpt_issuance_id": "00349F41BFA01892C83AC779E4BBB80C8CE3B92D401E4B6E",
    "value": "1000"
  }
}

=== Submitting LoanBrokerCoverDeposit transaction ===

Cover deposit successful!

=== Cover Available After Deposit ===

1000 TSTUSD

=== Verifying Asset Issuer ===

MPT issuer account verified: rJ7DiJdcThwLD5rZjC7D1neXmvLFAGk9t3. Proceeding to clawback.

=== Preparing LoanBrokerCoverClawback transaction ===

{
  "TransactionType": "LoanBrokerCoverClawback",
  "Account": "rJ7DiJdcThwLD5rZjC7D1neXmvLFAGk9t3",
  "LoanBrokerID": "655C32ADFCA0712F3CB32CA034C29FE3DE9DE876A86141F0902FB1E05DA0E442",
  "Amount": {
    "mpt_issuance_id": "00349F41BFA01892C83AC779E4BBB80C8CE3B92D401E4B6E",
    "value": "1000"
  }
}

=== Submitting LoanBrokerCoverClawback transaction ===

Successfully clawed back 1000 TSTUSD!

=== Final Cover Available After Clawback ===

0 TSTUSD
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
Loan broker address: rn6CD8i3Yc3UGagSosZfegG7hpXxwgVAgz
Borrower address: rN2PMxegkEMZHin78o7wSs1JeYjxAvAfvt
LoanBrokerID: 3CDEA7CEB9F2ECDD76CD41A864F4E3B5DB9C91AEDBD0906EE466FDD21CCF49B5

=== Preparing LoanSet transaction ===

{
  "TransactionType": "LoanSet",
  "Account": "rn6CD8i3Yc3UGagSosZfegG7hpXxwgVAgz",
  "Counterparty": "rN2PMxegkEMZHin78o7wSs1JeYjxAvAfvt",
  "LoanBrokerID": "3CDEA7CEB9F2ECDD76CD41A864F4E3B5DB9C91AEDBD0906EE466FDD21CCF49B5",
  "PrincipalRequested": "1000",
  "InterestRate": 500,
  "PaymentTotal": 12,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "LoanOriginationFee": "100",
  "LoanServiceFee": "10",
  "Flags": 0,
  "Sequence": 3670743,
  "LastLedgerSequence": 3673248,
  "Fee": "2"
}

=== Adding loan broker signature ===

TxnSignature: F8B2F2AB960191991FC48120A48A089B479018A6469466E43E6F974E1345B32688D59D381E6BC18B6CA383235B708FE4FB44527C51E5B29BCDCC4A08C340A00A
SigningPubKey: EDDABC72936FF734FA56D6C60C064D48C5DA9911C8B7C26C4AEAC06534B5D7C530

Signed loanSetTx for borrower to sign over:
{
  "TransactionType": "LoanSet",
  "Flags": 0,
  "Sequence": 3670743,
  "LastLedgerSequence": 3673248,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "PaymentTotal": 12,
  "InterestRate": 500,
  "LoanBrokerID": "3CDEA7CEB9F2ECDD76CD41A864F4E3B5DB9C91AEDBD0906EE466FDD21CCF49B5",
  "Fee": "2",
  "SigningPubKey": "EDDABC72936FF734FA56D6C60C064D48C5DA9911C8B7C26C4AEAC06534B5D7C530",
  "TxnSignature": "F8B2F2AB960191991FC48120A48A089B479018A6469466E43E6F974E1345B32688D59D381E6BC18B6CA383235B708FE4FB44527C51E5B29BCDCC4A08C340A00A",
  "Account": "rn6CD8i3Yc3UGagSosZfegG7hpXxwgVAgz",
  "Counterparty": "rN2PMxegkEMZHin78o7wSs1JeYjxAvAfvt",
  "LoanOriginationFee": "100",
  "LoanServiceFee": "10",
  "PrincipalRequested": "1000"
}

=== Adding borrower signature ===

Borrower TxnSignature: 52E16B88F5640F637A05E59AB2BE0DBFE4FBE7F1D7580C2A39D4981F6066A7C42047A401B953CDAB4993954A85D73DE35F69317EE8279D23ECB4958AA10C0800
Borrower SigningPubKey: EDE624A07899AEF826DF2A3E2A325F69BC1F169D23F08091E9042644D6B06D3D62

Fully signed LoanSet transaction:
{
  "TransactionType": "LoanSet",
  "Flags": 0,
  "Sequence": 3670743,
  "LastLedgerSequence": 3673248,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800,
  "PaymentTotal": 12,
  "InterestRate": 500,
  "LoanBrokerID": "3CDEA7CEB9F2ECDD76CD41A864F4E3B5DB9C91AEDBD0906EE466FDD21CCF49B5",
  "Fee": "2",
  "SigningPubKey": "EDDABC72936FF734FA56D6C60C064D48C5DA9911C8B7C26C4AEAC06534B5D7C530",
  "TxnSignature": "F8B2F2AB960191991FC48120A48A089B479018A6469466E43E6F974E1345B32688D59D381E6BC18B6CA383235B708FE4FB44527C51E5B29BCDCC4A08C340A00A",
  "Account": "rn6CD8i3Yc3UGagSosZfegG7hpXxwgVAgz",
  "Counterparty": "rN2PMxegkEMZHin78o7wSs1JeYjxAvAfvt",
  "LoanOriginationFee": "100",
  "LoanServiceFee": "10",
  "PrincipalRequested": "1000",
  "CounterpartySignature": {
    "SigningPubKey": "EDE624A07899AEF826DF2A3E2A325F69BC1F169D23F08091E9042644D6B06D3D62",
    "TxnSignature": "52E16B88F5640F637A05E59AB2BE0DBFE4FBE7F1D7580C2A39D4981F6066A7C42047A401B953CDAB4993954A85D73DE35F69317EE8279D23ECB4958AA10C0800"
  }
}

=== Submitting signed LoanSet transaction ===

Loan created successfully!

=== Loan Information ===

{
  "Borrower": "rN2PMxegkEMZHin78o7wSs1JeYjxAvAfvt",
  "GracePeriod": 604800,
  "InterestRate": 500,
  "LoanBrokerID": "3CDEA7CEB9F2ECDD76CD41A864F4E3B5DB9C91AEDBD0906EE466FDD21CCF49B5",
  "LoanOriginationFee": "100",
  "LoanSequence": 6,
  "LoanServiceFee": "10",
  "NextPaymentDueDate": 826862960,
  "PaymentInterval": 2592000,
  "PaymentRemaining": 12,
  "PeriodicPayment": "83.55610375293148956",
  "PrincipalOutstanding": "1000",
  "StartDate": 824270960,
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
