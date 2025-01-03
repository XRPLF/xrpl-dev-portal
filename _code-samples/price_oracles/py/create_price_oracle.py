# neccesary imports
import datetime
from xrpl.wallet import generate_faucet_wallet
from xrpl.clients import JsonRpcClient
from xrpl.models import (
    OracleSet,
)
from xrpl.transaction import submit_and_wait, sign_and_submit
from xrpl.models.transactions.oracle_set import PriceData

from xrpl.utils import str_to_hex


print("connecting to the test network")
# Connect to XRPL test network
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("connected!!!")

# create demo wallet
oracle_creator = generate_faucet_wallet(client=client)

# define the oracle document id
# this should be stored offline as the blockchain doesn't retrieve it in requets
oracle_document_id = 1

# define the provider's name and convert to hexadecimal e.g: band, chainlink etc
provider = str_to_hex("provider")

# define the uri of the provider and convert to hexadecimal
uri = str_to_hex("sampleprovider.com")


# define the last update time of the price data being passed to the oracle as a timestamp
# max time into the future is 5 minutes and max time into the past is 4 minutes from the current time
# we'll use the current date time for this
last_update_time = int(datetime.datetime.now().timestamp())


# define the asset class and convert to hexadecimal
# Describes the type of asset, such as "currency", "commodity", or "index".
asset_class = str_to_hex("currency")


# create a price data object, that will be tracked by the oracle
pd = PriceData(
    base_asset="BTC",
    quote_asset="USD",
    asset_price=1000,
    scale=4,
)

# create an array of up to 10 Price data objects
price_data_array = [pd]


print("building transaction")
# create price oracle transaction
oracle_set = OracleSet(
    account=oracle_creator.address,
    oracle_document_id=oracle_document_id,
    provider=provider,
    uri=uri,
    last_update_time=last_update_time,
    asset_class=asset_class,
    price_data_series=price_data_array,
)


print("siging and submitting transaction, awaiting response")
# sign, submit and wait for transaction result


oracle_set_txn_response = submit_and_wait(
    transaction=oracle_set, client=client, wallet=oracle_creator
)


# print the result and transaction hash
print(oracle_set_txn_response.result["meta"]["TransactionResult"])
print(oracle_set_txn_response.result["hash"])
