# Sponsored Fees and Reserves (JavaScript)

Shows how one account can pay the transaction fees and reserve requirements of another account, using the co-signed and pre-funded sponsorship flows from [XLS-68](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0068-sponsored-fees-and-reserves).

Quick setup:

```sh
npm install
```

## Sponsor a transaction

Creates an account for the sponsee, then covers the fee and the object reserve for a transaction the sponsee sends, with the sponsor co-signing.

```sh
node sponsorATransaction.js
```

## Sponsor a transaction with a pre-funded pool

Creates a `Sponsorship` ledger entry holding a pool of fees and owner reserves, which the sponsee then draws on without the sponsor signing each transaction.

```sh
node sponsorWithPreFundedPool.js
```

## Manage a sponsorship pool

Walks through the life cycle of a `Sponsorship` entry: creating it, spending part of it, topping it up, and deleting it to reclaim the unspent XRP.

```sh
node manageSponsorshipPool.js
```

## Transfer a reserve sponsorship

Moves the reserve obligation for an existing ledger entry from the sponsee to one sponsor, reassigns it to a second sponsor, and then returns it to the sponsee.

```sh
node transferReserveSponsorship.js
```
