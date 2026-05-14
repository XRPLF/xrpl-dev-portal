# Delete Account (JavaScript)

JavaScript sample code showing how to delete an account from the XRP Ledger.

## Setup

```sh
npm i
```

## Usage

If you run the script by default, it gets an account from the faucet and outputs the details to the console. Example:

```sh
$ node delete-account.js 
Got new account from faucet:
    Address: rsuTU7xBF1u8jxKMw5UHvbKkLmvix7zQoe
    Seed: sEdTpxrbDhe6M4YeHanSbCySFCZYrCk
  
Edit the .env file to add this seed, then wait until the account can be deleted.
Account is too new to be deleted.
    Account sequence + 255: 15226794
    Validated ledger index: 15226538
    (Sequence + 255 must be less than or equal to the ledger index)
Estimate: 15 minutes until account can be deleted
OK: Account owner count (0) is low enough.
OK: Account balance (100000000 drops) is high enough.
A total of 1 problem(s) prevent the account from being deleted.
```

Edit the `.env` file to add the seed of the account to delete. For example:

```ini
# Replace the seed with the seed of the account to delete.
ACCOUNT_SEED=sEdTpxrbDhe6M4YeHanSbCySFCZYrCk
# Change to secp256k1 if you generated the seed with that algorithm
ACCOUNT_ALGORITHM=ed25519
```

Then run the script again:

```sh
node delete-account.js
```
