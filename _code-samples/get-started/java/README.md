# Get Started Example (Java)

This directory contains a Java example demonstrating how to connect to the XRP Ledger, create and fund a Testnet account, and look up its account info.

To follow along, see [Get Started Using Java Library](https://xrpl.org/docs/tutorials/get-started/get-started-java).

## Setup

Install dependencies before running the example:

```sh
mvn install
```

---

## Get Account Info

```sh
mvn exec:java -Dexec.mainClass=com.example.xrpl.GetAccountInfo
```

The script should output the address of a newly funded Testnet account, a link to it on the XRPL Explorer, and its `account_info` response as JSON.

```sh
Creating a new wallet and funding it with Testnet XRP...
Wallet: raWynmAz4cd6fFBx8Zua737CT3HYHHk71n
Account Testnet Explorer URL:
  https://testnet.xrpl.org/accounts/raWynmAz4cd6fFBx8Zua737CT3HYHHk71n

Getting account info...
{
  "status" : "success",
  "account_data" : {
    "LedgerEntryType" : "AccountRoot",
    "Account" : "raWynmAz4cd6fFBx8Zua737CT3HYHHk71n",
    "Balance" : "100000000",
    "Flags" : 0,
    "OwnerCount" : 0,
    "PreviousTxnID" : "1A6072ADED5C0CED0E0D864F49EFD107E63F17A303F93DA5919C75D90166C54F",
    "PreviousTxnLgrSeq" : 22224134,
    "Sequence" : 22224134,
    "index" : "6CEAC28531D19D48F973429A9CC81CB08712C9A88B19A3F64C32D093EA0F91BA"
  },
  "ledger_index" : 22224134,
  "validated" : true
}
```
