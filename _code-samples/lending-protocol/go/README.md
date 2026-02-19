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

---

## Deposit and Withdraw First-loss Capital

```sh
go run ./cover-deposit-and-withdraw
```

The script should output the LoanBrokerCoverDeposit, cover balance after the deposit, the LoanBrokerCoverWithdraw transaction, and the cover balance after the withdrawal.

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

---

## Pay a Loan

```sh
go run ./loan-pay
```

The script should output the amount required to totally pay off a loan, the LoanPay transaction, the amount due after the payment, the LoanDelete transaction, and then the status of the loan ledger entry.
