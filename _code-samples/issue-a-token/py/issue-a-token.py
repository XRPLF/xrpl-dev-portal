# Stand-alone code sample for the "issue a token" tutorial:
# https://xrpl.org/issue-a-fungible-token.html
# License: https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE

# Connect ----------------------------------------------------------------------
import xrpl
testnet_url = "https://s.altnet.rippletest.net:51234"
client = xrpl.clients.JsonRpcClient(testnet_url)


# Get credentials from the Testnet Faucet --------------------------------------
# For production, instead create a Wallet instance
faucet_url = "https://faucet.altnet.rippletest.net/accounts"
print("Getting 2 new accounts from the Testnet faucet...")
from xrpl.wallet import generate_faucet_wallet
cold_wallet = generate_faucet_wallet(client, debug=True)
hot_wallet = generate_faucet_wallet(client, debug=True)


# Configure issuer (cold address) settings -------------------------------------
cold_settings_tx = xrpl.models.transactions.AccountSet(
    account=cold_wallet.address,
    transfer_rate=0,
    tick_size=5,
    domain=bytes.hex("example.com".encode("ASCII")),
    set_flag=xrpl.models.transactions.AccountSetAsfFlag.ASF_DEFAULT_RIPPLE,
)

print("Sending cold address AccountSet transaction...")
response = xrpl.transaction.submit_and_wait(cold_settings_tx, client, cold_wallet)
print(response)


# Configure hot address settings -----------------------------------------------
hot_settings_tx = xrpl.models.transactions.AccountSet(
    account=hot_wallet.address,
    set_flag=xrpl.models.transactions.AccountSetAsfFlag.ASF_REQUIRE_AUTH,
)

print("Sending hot address AccountSet transaction...")
response = xrpl.transaction.submit_and_wait(hot_settings_tx, client, hot_wallet)
print(response)


# Create trust line from hot to cold address -----------------------------------
currency_code = "FOO"
trust_set_tx = xrpl.models.transactions.TrustSet(
    account=hot_wallet.address,
    limit_amount=xrpl.models.amounts.issued_currency_amount.IssuedCurrencyAmount(
        currency=currency_code,
        issuer=cold_wallet.address,
        value="10000000000", # Large limit, arbitrarily chosen
    )
)

print("Creating trust line from hot address to issuer...")
response = xrpl.transaction.submit_and_wait(trust_set_tx, client, hot_wallet)
print(response)


# Send token -------------------------------------------------------------------
issue_quantity = "3840"
send_token_tx = xrpl.models.transactions.Payment(
    account=cold_wallet.address,
    destination=hot_wallet.address,
    amount=xrpl.models.amounts.issued_currency_amount.IssuedCurrencyAmount(
        currency=currency_code,
        issuer=cold_wallet.address,
        value=issue_quantity
    )
)

print(f"Sending {issue_quantity} {currency_code} to {hot_wallet.address}...")
response = xrpl.transaction.submit_and_wait(send_token_tx, client, cold_wallet)
print(response)


# Check balances ---------------------------------------------------------------
print("Getting hot address balances...")
response = client.request(xrpl.models.requests.AccountLines(
    account=hot_wallet.address,
    ledger_index="validated",
))
print(response)

print("Getting cold address balances...")
response = client.request(xrpl.models.requests.GatewayBalances(
    account=cold_wallet.address,
    ledger_index="validated",
    hotwallet=[hot_wallet.address]
))
print(response)
