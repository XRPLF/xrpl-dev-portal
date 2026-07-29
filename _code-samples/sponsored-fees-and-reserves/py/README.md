# Sponsored Fees and Reserves (Python)

Shows how one account can pay the transaction fees and reserve requirements of another account, using the co-signed and pre-funded sponsorship flows from [XLS-68](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0068-sponsored-fees-and-reserves).

Sponsorship is available on Devnet only, so these scripts connect to Devnet and use a prerelease build of `xrpl-py`.

Quick setup:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Sponsor a transaction

Creates an account for the sponsee, then covers the fee and the object reserve for a transaction the sponsee sends, with the sponsor co-signing.

```sh
python sponsor_a_transaction.py
```

## Sponsor a transaction with a pre-funded pool

Creates a `Sponsorship` ledger entry holding a pool of fees and owner reserves, which the sponsee then draws on without the sponsor signing each transaction.

```sh
python sponsor_with_pre_funded_pool.py
```

## Manage a sponsorship pool

Walks through the life cycle of a `Sponsorship` entry: creating it, spending part of it, topping it up, and deleting it to reclaim the unspent XRP.

```sh
python manage_sponsorship_pool.py
```

## Transfer a reserve sponsorship

Moves the reserve obligation for an existing ledger entry from the sponsee to one sponsor, reassigns it to a second sponsor, and then returns it to the sponsee.

```sh
python transfer_reserve_sponsorship.py
```
