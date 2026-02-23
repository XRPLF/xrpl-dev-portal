# Lending Protocol Examples (Python)

This directory contains Python examples demonstrating how to create a loan broker, claw back first-loss capital, deposit and withdraw first-loss capital, create a loan, manage a loan, and repay a loan.

## Setup

Install dependencies before running any examples:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Create a Loan Broker

```sh
python3 create_loan_broker.py
```

The script should output the LoanBrokerSet transaction, loan broker ID, and loan broker pseudo-account:

```sh
Loan broker/vault owner address: rBeEX3qQzP3UL5WMwZAzdPPpzckH73YvBn
Vault ID: 2B71E8E1323BFC8F2AC27F8C217870B63921EFA0C02DF7BA8B099C7DC6A1D00F

=== Preparing LoanBrokerSet transaction ===

{
  "Account": "rBeEX3qQzP3UL5WMwZAzdPPpzckH73YvBn",
  "TransactionType": "LoanBrokerSet",
  "SigningPubKey": "",
  "VaultID": "2B71E8E1323BFC8F2AC27F8C217870B63921EFA0C02DF7BA8B099C7DC6A1D00F",
  "ManagementFeeRate": 1000
}

=== Submitting LoanBrokerSet transaction ===

Loan broker created successfully!

=== Loan Broker Information ===

LoanBroker ID: 86911896026EA9DEAEFC1A7959BC05D8B1A1EC25B9960E8C54424B7DC41F8DA8
LoanBroker Psuedo-Account Address: rPhpC2XGz7v5g2rPom7JSWJcic1cnkoBh9
```

---

## Claw Back First-loss Capital

```sh
python3 cover_clawback.py
```

The script should output the cover available, the LoanBrokerCoverDeposit transaction, cover available after the deposit, the LoanBrokerCoverClawback transaction, and the final cover available after the clawback:

```sh
Loan broker address: rBeEX3qQzP3UL5WMwZAzdPPpzckH73YvBn
MPT issuer address: rNzJg2EVwo56eAoBxz5WnTfmgoLbfaAT8d
LoanBrokerID: 041E256F124841FF81DF105C62A72676BFD746975F86786166B689F304BE96E0
MPT ID: 0037A8ED99701AFEC4BCC3A39299252CA41838059572E7F2

=== Cover Available ===

1000 TSTUSD

=== Preparing LoanBrokerCoverDeposit transaction ===

{
  "Account": "rBeEX3qQzP3UL5WMwZAzdPPpzckH73YvBn",
  "TransactionType": "LoanBrokerCoverDeposit",
  "SigningPubKey": "",
  "LoanBrokerID": "041E256F124841FF81DF105C62A72676BFD746975F86786166B689F304BE96E0",
  "Amount": {
    "mpt_issuance_id": "0037A8ED99701AFEC4BCC3A39299252CA41838059572E7F2",
    "value": "1000"
  }
}

=== Submitting LoanBrokerCoverDeposit transaction ===

Cover deposit successful!

=== Cover Available After Deposit ===

2000 TSTUSD

=== Verifying Asset Issuer ===

MPT issuer account verified: rNzJg2EVwo56eAoBxz5WnTfmgoLbfaAT8d. Proceeding to clawback.

=== Preparing LoanBrokerCoverClawback transaction ===

{
  "Account": "rNzJg2EVwo56eAoBxz5WnTfmgoLbfaAT8d",
  "TransactionType": "LoanBrokerCoverClawback",
  "SigningPubKey": "",
  "LoanBrokerID": "041E256F124841FF81DF105C62A72676BFD746975F86786166B689F304BE96E0",
  "Amount": {
    "mpt_issuance_id": "0037A8ED99701AFEC4BCC3A39299252CA41838059572E7F2",
    "value": "2000"
  }
}

=== Submitting LoanBrokerCoverClawback transaction ===

Successfully clawed back 2000 TSTUSD!

=== Final Cover Available After Clawback ===

0 TSTUSD
```

---

## Deposit and Withdraw First-loss Capital

```sh
python3 cover_deposit_and_withdraw.py
```

The script should output the LoanBrokerCoverDeposit, cover balance after the deposit, the LoanBrokerCoverWithdraw transaction, and the cover balance after the withdrawal:

```sh
Loan broker address: rBeEX3qQzP3UL5WMwZAzdPPpzckH73YvBn
LoanBrokerID: 041E256F124841FF81DF105C62A72676BFD746975F86786166B689F304BE96E0
MPT ID: 0037A8ED99701AFEC4BCC3A39299252CA41838059572E7F2

=== Preparing LoanBrokerCoverDeposit transaction ===

{
  "Account": "rBeEX3qQzP3UL5WMwZAzdPPpzckH73YvBn",
  "TransactionType": "LoanBrokerCoverDeposit",
  "SigningPubKey": "",
  "LoanBrokerID": "041E256F124841FF81DF105C62A72676BFD746975F86786166B689F304BE96E0",
  "Amount": {
    "mpt_issuance_id": "0037A8ED99701AFEC4BCC3A39299252CA41838059572E7F2",
    "value": "2000"
  }
}

=== Submitting LoanBrokerCoverDeposit transaction ===

Cover deposit successful!

=== Cover Balance ===

LoanBroker Pseudo-Account: rUrs1bkhQyh1nxE7u99H92U2Tg8Pogw1bZ
Cover balance after deposit: 2000 TSTUSD

=== Preparing LoanBrokerCoverWithdraw transaction ===

{
  "Account": "rBeEX3qQzP3UL5WMwZAzdPPpzckH73YvBn",
  "TransactionType": "LoanBrokerCoverWithdraw",
  "SigningPubKey": "",
  "LoanBrokerID": "041E256F124841FF81DF105C62A72676BFD746975F86786166B689F304BE96E0",
  "Amount": {
    "mpt_issuance_id": "0037A8ED99701AFEC4BCC3A39299252CA41838059572E7F2",
    "value": "1000"
  }
}

=== Submitting LoanBrokerCoverWithdraw transaction ===

Cover withdraw successful!

=== Updated Cover Balance ===

LoanBroker Pseudo-Account: rUrs1bkhQyh1nxE7u99H92U2Tg8Pogw1bZ
Cover balance after withdraw: 1000 TSTUSD
```

---

## Create a Loan

```sh
python3 create_loan.py
```

The script should output the LoanSet transaction, the updated LoanSet transaction with the loan broker signature, the final LoanSet transaction with the borrower signature added, and then the loan information:

```sh
Loan broker address: ra3aoaincCNBQ7uxvHDgFbtCbVw1VNQkZy
Borrower address: raXnMyDFQWVhvVuyb2oK3oCLGZhemkLqKL
LoanBrokerID: 61A1D6B0F019C5D5BD039AC3DBE2E31813471567854D07D278564E4E2463ABD2

=== Preparing LoanSet transaction ===

{
  "Account": "ra3aoaincCNBQ7uxvHDgFbtCbVw1VNQkZy",
  "TransactionType": "LoanSet",
  "Fee": "2",
  "Sequence": 3652181,
  "LastLedgerSequence": 3674792,
  "SigningPubKey": "",
  "LoanBrokerID": "61A1D6B0F019C5D5BD039AC3DBE2E31813471567854D07D278564E4E2463ABD2",
  "Counterparty": "raXnMyDFQWVhvVuyb2oK3oCLGZhemkLqKL",
  "LoanOriginationFee": "100",
  "LoanServiceFee": "10",
  "InterestRate": 500,
  "PrincipalRequested": "1000",
  "PaymentTotal": 12,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800
}

=== Adding loan broker signature ===

TxnSignature: 9756E70F33B359FAEA789D732E752401DE41CAB1A3711517B576DBFF4D89B6A01C234A379391C48B3D88CB031BD679A7EDE4F4BB67AA7297EEE25EA29FF6BD0D
SigningPubKey: ED0DC8C222C4BB86CE07165CD0486C598B8146C3150EE40AF48921983DED98FA47

Signed loan_set_tx for borrower to sign over:
{
  "Account": "ra3aoaincCNBQ7uxvHDgFbtCbVw1VNQkZy",
  "TransactionType": "LoanSet",
  "Fee": "2",
  "Sequence": 3652181,
  "LastLedgerSequence": 3674792,
  "SigningPubKey": "ED0DC8C222C4BB86CE07165CD0486C598B8146C3150EE40AF48921983DED98FA47",
  "TxnSignature": "9756E70F33B359FAEA789D732E752401DE41CAB1A3711517B576DBFF4D89B6A01C234A379391C48B3D88CB031BD679A7EDE4F4BB67AA7297EEE25EA29FF6BD0D",
  "LoanBrokerID": "61A1D6B0F019C5D5BD039AC3DBE2E31813471567854D07D278564E4E2463ABD2",
  "Counterparty": "raXnMyDFQWVhvVuyb2oK3oCLGZhemkLqKL",
  "LoanOriginationFee": "100",
  "LoanServiceFee": "10",
  "InterestRate": 500,
  "PrincipalRequested": "1000",
  "PaymentTotal": 12,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800
}

=== Adding borrower signature ===

Borrower TxnSignature: A0A515BFB131EDC7A8B74F7A66F9DA1DEE25B099373F581BDA340C95F918CEA91E3F4D2019A8DBAFEC53012038839FEA48436D61970B0834F6DDEA64B1776207
Borrower SigningPubKey: ED36B94636EC0F98BB5F6EC58039E23A8C8F1521D2EC1B32C0422A86718C9B95DC

Fully signed LoanSet transaction:
{
  "Account": "ra3aoaincCNBQ7uxvHDgFbtCbVw1VNQkZy",
  "TransactionType": "LoanSet",
  "Fee": "2",
  "Sequence": 3652181,
  "LastLedgerSequence": 3674792,
  "SigningPubKey": "ED0DC8C222C4BB86CE07165CD0486C598B8146C3150EE40AF48921983DED98FA47",
  "TxnSignature": "9756E70F33B359FAEA789D732E752401DE41CAB1A3711517B576DBFF4D89B6A01C234A379391C48B3D88CB031BD679A7EDE4F4BB67AA7297EEE25EA29FF6BD0D",
  "LoanBrokerID": "61A1D6B0F019C5D5BD039AC3DBE2E31813471567854D07D278564E4E2463ABD2",
  "Counterparty": "raXnMyDFQWVhvVuyb2oK3oCLGZhemkLqKL",
  "CounterpartySignature": {
    "SigningPubKey": "ED36B94636EC0F98BB5F6EC58039E23A8C8F1521D2EC1B32C0422A86718C9B95DC",
    "TxnSignature": "A0A515BFB131EDC7A8B74F7A66F9DA1DEE25B099373F581BDA340C95F918CEA91E3F4D2019A8DBAFEC53012038839FEA48436D61970B0834F6DDEA64B1776207"
  },
  "LoanOriginationFee": "100",
  "LoanServiceFee": "10",
  "InterestRate": 500,
  "PrincipalRequested": "1000",
  "PaymentTotal": 12,
  "PaymentInterval": 2592000,
  "GracePeriod": 604800
}

=== Submitting signed LoanSet transaction ===

Loan created successfully!

=== Loan Information ===

{
  "Borrower": "raXnMyDFQWVhvVuyb2oK3oCLGZhemkLqKL",
  "GracePeriod": 604800,
  "InterestRate": 500,
  "LoanBrokerID": "61A1D6B0F019C5D5BD039AC3DBE2E31813471567854D07D278564E4E2463ABD2",
  "LoanOriginationFee": "100",
  "LoanSequence": 4,
  "LoanServiceFee": "10",
  "NextPaymentDueDate": 826867870,
  "PaymentInterval": 2592000,
  "PaymentRemaining": 12,
  "PeriodicPayment": "83.55610375293148956",
  "PrincipalOutstanding": "1000",
  "StartDate": 824275870,
  "TotalValueOutstanding": "1003"
}
```

---

## Manage a Loan

```sh
python3 loan_manage.py
```

The script should output the initial status of the loan, the LoanManage transaction, and the updated loan status and grace period after impairment. The script will countdown the grace period before outputting another LoanManage transaction, and then the final flags on the loan.

```sh
Loan broker address: r9x3etrs2GZSF73vQ8endi9CWpKr5N2Rjn
LoanID: E86DB385401D361A33DD74C8E1B44D7F996E9BA02724BCD44127F60BE057A322

=== Loan Status ===

Total Amount Owed: 1001 TSTUSD.
Payment Due Date: 2026-03-14 02:01:51

=== Preparing LoanManage transaction to impair loan ===

{
  "Account": "r9x3etrs2GZSF73vQ8endi9CWpKr5N2Rjn",
  "TransactionType": "LoanManage",
  "Flags": 131072,
  "SigningPubKey": "",
  "LoanID": "E86DB385401D361A33DD74C8E1B44D7F996E9BA02724BCD44127F60BE057A322"
}

=== Submitting LoanManage impairment transaction ===

Loan impaired successfully!
New Payment Due Date: 2026-02-12 01:01:50
Grace Period: 60 seconds

=== Countdown until loan can be defaulted ===

Grace period expired. Loan can now be defaulted.

=== Preparing LoanManage transaction to default loan ===

{
  "Account": "r9x3etrs2GZSF73vQ8endi9CWpKr5N2Rjn",
  "TransactionType": "LoanManage",
  "Flags": 65536,
  "SigningPubKey": "",
  "LoanID": "E86DB385401D361A33DD74C8E1B44D7F996E9BA02724BCD44127F60BE057A322"
}

=== Submitting LoanManage default transaction ===

Loan defaulted successfully!

=== Checking final loan status ===

Final loan flags: ['TF_LOAN_DEFAULT', 'TF_LOAN_IMPAIR']
```

## Pay a Loan

```sh
python3 loan_pay.py
```

The script should output the amount required to totally pay off a loan, the LoanPay transaction, the amount due after the payment, the LoanDelete transaction, and then the status of the loan ledger entry:

```sh
Borrower address: raXnMyDFQWVhvVuyb2oK3oCLGZhemkLqKL
LoanID: A9CC92540995E49B39E79883A22FF10A374BF2CB32763E89AA986B613E16D5FD
MPT ID: 0037BA4C909352D28BF9580F1D536AF4F7E07649B5B6E116

=== Loan Status ===

Amount Owed: 1001 TSTUSD
Loan Service Fee: 10 TSTUSD
Total Payment Due (including fees): 1011 TSTUSD

=== Preparing LoanPay transaction ===

{
  "Account": "raXnMyDFQWVhvVuyb2oK3oCLGZhemkLqKL",
  "TransactionType": "LoanPay",
  "SigningPubKey": "",
  "LoanID": "A9CC92540995E49B39E79883A22FF10A374BF2CB32763E89AA986B613E16D5FD",
  "Amount": {
    "mpt_issuance_id": "0037BA4C909352D28BF9580F1D536AF4F7E07649B5B6E116",
    "value": "1011"
  }
}

=== Submitting LoanPay transaction ===

Loan paid successfully!

=== Loan Status After Payment ===

Outstanding Loan Balance: Loan fully paid off!

=== Preparing LoanDelete transaction ===

{
  "Account": "raXnMyDFQWVhvVuyb2oK3oCLGZhemkLqKL",
  "TransactionType": "LoanDelete",
  "SigningPubKey": "",
  "LoanID": "A9CC92540995E49B39E79883A22FF10A374BF2CB32763E89AA986B613E16D5FD"
}

=== Submitting LoanDelete transaction ===

Loan deleted successfully!

=== Verifying Loan Deletion ===

Loan has been successfully removed from the XRP Ledger!
```
