# neccesary imports
import datetime
from xrpl.clients import JsonRpcClient
from xrpl.models import AccountObjects, AccountObjectType


print("connecting to the test network")
# Connect to XRPL test network
client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
print("connected!!!")


# define the account we are going to query
oracle_creator = "rBoSibkbwaAUEpkehYixQrXp4AqZez9WqA"

# define array for holding oracles an account has created
oracles_ = []

# build the request object
req = AccountObjects(
    account=oracle_creator,
    ledger_index="validated",
    type=AccountObjectType.ORACLE,
)

# mak the request object
response = client.request(req)

# return the result
result = response.result

# parse the result and print
if "account_objects" in result:
    oracles = result["account_objects"]
    for oracle in oracles:
        oracle_data = {}
        price_data_ = []
        oracle_data["oracle_id"] = oracle["index"]
        oracle_data["owner"] = oracle["Owner"]
        oracle_data["provider"] = oracle["Provider"]
        oracle_data["asset_class"] = oracle["AssetClass"]
        oracle_data["uri"] = oracle["URI"] if "URI" in oracle else ""
        oracle_data["last_update_time"] = (
            str(datetime.datetime.fromtimestamp(oracle["LastUpdateTime"]))
            if "LastUpdateTime" in oracle
            else ""
        )
        oracle_data["price_data_series"] = (
            oracle["PriceDataSeries"] if "PriceDataSeries" in oracle else []
        )

        # sort price data series if any
        if "PriceDataSeries" in oracle and len(oracle["PriceDataSeries"]) > 0:
            price_data_series = oracle["PriceDataSeries"]
            for price_data_serie in price_data_series:
                price_data = {}
                price_data["base_asset"] = price_data_serie["PriceData"]["BaseAsset"]

                price_data["quote_asset"] = price_data_serie["PriceData"]["QuoteAsset"]

                price_data["scale"] = (
                    price_data_serie["PriceData"]["Scale"]
                    if "Scale" in price_data_serie["PriceData"]
                    else ""
                )
                price_data["asset_price"] = (
                    price_data_serie["PriceData"]["AssetPrice"]
                    if "AssetPrice" in price_data_serie["PriceData"]
                    else ""
                )

                price_data_.append(price_data)
            oracle_data["price_data_series"] = price_data_
        oracles_.append(oracle_data)


print(oracles_)
