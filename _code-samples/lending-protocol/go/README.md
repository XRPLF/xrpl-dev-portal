# Lending Protocol Examples (Go)

This directory contains Go examples demonstrating how to create a loan broker, claw back first-loss capital, deposit and withdraw first-loss capital, create a loan, manage a loan, and repay a loan.

## Setup

All commands should be run from this `go/` directory.

Install dependencies before running any examples:

```sh
go mod tidy
```

---

## Create a Loan Broker

```sh
go run ./create-loan-broker
```

The script should output the LoanBrokerSet transaction, loan broker ID, and loan broker pseudo-account.

```sh
Loan broker/vault owner address: rLsTX2RjNTqwiwNpMn7mny3MyrXtmbhFQV
Vault ID: A300D6F7D43E1B143683F1917EE6456B0C3E84F0F763D9A1366FCD22138A11E9

=== Preparing LoanBrokerSet transaction ===

{
  "Account": "rLsTX2RjNTqwiwNpMn7mny3MyrXtmbhFQV",
  "ManagementFeeRate": 1000,
  "TransactionType": "LoanBrokerSet",
  "VaultID": "A300D6F7D43E1B143683F1917EE6456B0C3E84F0F763D9A1366FCD22138A11E9"
}

=== Submitting LoanBrokerSet transaction ===

Loan broker created successfully!

=== Loan Broker Information ===

LoanBroker ID: E4D9C485E101FAE449C8ACEC7FD039920CC02D2443687F2593DB397CC8EA670B
LoanBroker Pseudo-Account Address: rMDsnf9CVRLRJzrL12Ex7nhstbni78y8af
```

---

## Claw Back First-loss Capital

```sh
go run ./cover-clawback
```

The script should output the cover available, the LoanBrokerCoverDeposit transaction, cover available after the deposit, the LoanBrokerCoverClawback transaction, and the final cover available after the clawback.

```sh
Loan broker address: rLsTX2RjNTqwiwNpMn7mny3MyrXtmbhFQV
MPT issuer address: rfYxCEWxA9ACyvpciPZYbKujjLEVX5CCwW
LoanBrokerID: 373BEBB8A1EF735FCD330C2B0DDF2C37FD3B1589B084C94F2CA52A904FBED08D
MPT ID: 003A9D5247DC1C9997DB5500A84C3EC748F3F61D2BC56D51

=== Cover Available ===

0 TSTUSD

=== Preparing LoanBrokerCoverDeposit transaction ===

{
  "Account": "rLsTX2RjNTqwiwNpMn7mny3MyrXtmbhFQV",
  "Amount": {
    "mpt_issuance_id": "003A9D5247DC1C9997DB5500A84C3EC748F3F61D2BC56D51",
    "value": "1000"
  },
  "LoanBrokerID": "373BEBB8A1EF735FCD330C2B0DDF2C37FD3B1589B084C94F2CA52A904FBED08D",
  "TransactionType": "LoanBrokerCoverDeposit"
}

=== Submitting LoanBrokerCoverDeposit transaction ===

Cover deposit successful!

=== Cover Available After Deposit ===

1000 TSTUSD

=== Verifying Asset Issuer ===

MPT issuer account verified: rfYxCEWxA9ACyvpciPZYbKujjLEVX5CCwW. Proceeding to clawback.

=== Preparing LoanBrokerCoverClawback transaction ===

{
  "Account": "rfYxCEWxA9ACyvpciPZYbKujjLEVX5CCwW",
  "Amount": {
    "mpt_issuance_id": "003A9D5247DC1C9997DB5500A84C3EC748F3F61D2BC56D51",
    "value": "1000"
  },
  "LoanBrokerID": "373BEBB8A1EF735FCD330C2B0DDF2C37FD3B1589B084C94F2CA52A904FBED08D",
  "TransactionType": "LoanBrokerCoverClawback"
}

=== Submitting LoanBrokerCoverClawback transaction ===

Successfully clawed back 1000 TSTUSD!

=== Final Cover Available After Clawback ===

0 TSTUSD
```

---

## Deposit and Withdraw First-loss Capital

```sh
go run ./cover-deposit-and-withdraw
```

The script should output the LoanBrokerCoverDeposit, cover balance after the deposit, the LoanBrokerCoverWithdraw transaction, and the cover balance after the withdrawal.

```sh
Loan broker address: rU9ANkvdSCs7p59Guf2XzGrrCPSMM2tDQV
LoanBrokerID: 633375BCB82DB1440189D3E0721AF92B0888304717DA1B002C8824D631E97DC3
MPT ID: 003B6A9EE92357082A44FA2EAA26385E2F85071634BC3315

=== Preparing LoanBrokerCoverDeposit transaction ===

{
  "Account": "rU9ANkvdSCs7p59Guf2XzGrrCPSMM2tDQV",
  "Amount": {
    "mpt_issuance_id": "003B6A9EE92357082A44FA2EAA26385E2F85071634BC3315",
    "value": "2000"
  },
  "LoanBrokerID": "633375BCB82DB1440189D3E0721AF92B0888304717DA1B002C8824D631E97DC3",
  "TransactionType": "LoanBrokerCoverDeposit"
}

=== Submitting LoanBrokerCoverDeposit transaction ===

Cover deposit successful!

=== Cover Balance ===

LoanBroker Pseudo-Account: rJoTTaGKQr8o475xKNZkEPRsmTbUkr6sbi
Cover balance after deposit: 2000 TSTUSD

=== Preparing LoanBrokerCoverWithdraw transaction ===

{
  "Account": "rU9ANkvdSCs7p59Guf2XzGrrCPSMM2tDQV",
  "Amount": {
    "mpt_issuance_id": "003B6A9EE92357082A44FA2EAA26385E2F85071634BC3315",
    "value": "1000"
  },
  "LoanBrokerID": "633375BCB82DB1440189D3E0721AF92B0888304717DA1B002C8824D631E97DC3",
  "TransactionType": "LoanBrokerCoverWithdraw"
}

=== Submitting LoanBrokerCoverWithdraw transaction ===

Cover withdraw successful!

=== Updated Cover Balance ===

LoanBroker Pseudo-Account: rJoTTaGKQr8o475xKNZkEPRsmTbUkr6sbi
Cover balance after withdraw: 1000 TSTUSD
```

---

## Create a Loan

```sh
go run ./create-loan
```

The script should output the LoanSet transaction, the updated LoanSet transaction with the loan broker signature, the final LoanSet transaction with the borrower signature added, and then the loan information.

---

## Manage a Loan

```sh
go run ./loan-manage
```

The script should output the initial status of the loan, the LoanManage transaction, and the updated loan status and grace period after impairment. The script will countdown the grace period before outputting another LoanManage transaction, and then the final flags on the loan.

```sh
Loan broker address: rN7eCZhKHcq5LEC2W2RrrGcUPBYwZagEPX
LoanID: 2BD3F3F587D1BD4FB247B0935FB098E2DC6E3B571F493472CED914216990EC6C

=== Loan Status ===

Total Amount Owed: 1001 TSTUSD.
Payment Due Date: 2026-03-23 01:23:40

=== Preparing LoanManage transaction to impair loan ===

{
  "Account": "rN7eCZhKHcq5LEC2W2RrrGcUPBYwZagEPX",
  "Flags": 131072,
  "LoanID": "2BD3F3F587D1BD4FB247B0935FB098E2DC6E3B571F493472CED914216990EC6C",
  "TransactionType": "LoanManage"
}

=== Submitting LoanManage impairment transaction ===

Loan impaired successfully!
New Payment Due Date: 2026-02-21 00:24:10
Grace Period: 60 seconds

=== Countdown until loan can be defaulted ===

Grace period expired. Loan can now be defaulted.

=== Preparing LoanManage transaction to default loan ===

{
  "Account": "rN7eCZhKHcq5LEC2W2RrrGcUPBYwZagEPX",
  "Flags": 65536,
  "LoanID": "2BD3F3F587D1BD4FB247B0935FB098E2DC6E3B571F493472CED914216990EC6C",
  "TransactionType": "LoanManage"
}

=== Submitting LoanManage default transaction ===

Loan defaulted successfully!

=== Checking final loan status ===

Final loan flags: [tfLoanDefault tfLoanImpair]
```

---

## Pay a Loan

```sh
go run ./loan-pay
```

The script should output the amount required to totally pay off a loan, the LoanPay transaction, the amount due after the payment, the LoanDelete transaction, and then the status of the loan ledger entry.

```sh
Borrower address: rFx8s3P5J66MAvWkp5rMj5bBF76gQUCt2
LoanID: D0455CD5F9C2FEC62FC67F31BD97134FBA877D7FE1AE7130EE0006D10661325A
MPT ID: 003B8FC2F51C1BC4E0211E6370EC4FC78BB20D5C4069F07B

=== Loan Status ===

Amount Owed: 1001 TSTUSD
Loan Service Fee: 10 TSTUSD
Total Payment Due (including fees): 1011 TSTUSD

=== Preparing LoanPay transaction ===

{
  "Account": "rFx8s3P5J66MAvWkp5rMj5bBF76gQUCt2",
  "Amount": {
    "mpt_issuance_id": "003B8FC2F51C1BC4E0211E6370EC4FC78BB20D5C4069F07B",
    "value": "1011"
  },
  "LoanID": "D0455CD5F9C2FEC62FC67F31BD97134FBA877D7FE1AE7130EE0006D10661325A",
  "TransactionType": "LoanPay"
}

=== Submitting LoanPay transaction ===

Loan paid successfully!

=== Loan Status After Payment ===

Outstanding Loan Balance: Loan fully paid off!

=== Preparing LoanDelete transaction ===

{
  "Account": "rFx8s3P5J66MAvWkp5rMj5bBF76gQUCt2",
  "LoanID": "D0455CD5F9C2FEC62FC67F31BD97134FBA877D7FE1AE7130EE0006D10661325A",
  "TransactionType": "LoanDelete"
}

=== Submitting LoanDelete transaction ===

Loan deleted successfully!

=== Verifying Loan Deletion ===

Loan has been successfully removed from the XRP Ledger!
```
