# Create, Query, and Delete a Price Oracle (Python)

## Install dependencies

Set up a virtual environment and install dependencies:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

Create a Price Oracle. This generates and funds a new Testnet account using the faucet, then creates an Oracle object owned by that account:

```sh
python3 create_price_oracle.py
```

Note the account address that this script prints.

Query the Price Oracle(s) owned by an account. Edit `oracle_owner` in `query_price_oracle.py` to the address printed above, then run:

```sh
python3 query_price_oracle.py
```

Delete a Price Oracle. Provide the seed of the account that owns it, either via the `ORACLE_OWNER_SEED` environment variable or when prompted:

```sh
ORACLE_OWNER_SEED=s... python3 delete_price_oracle.py
```
