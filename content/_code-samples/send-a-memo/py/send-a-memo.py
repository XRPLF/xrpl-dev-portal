from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import Payment, Memo
from xrpl.transaction import autofill_and_sign, submit_and_wait
from xrpl.wallet import generate_faucet_wallet

# This code sample validates and sends a transaction with a Memo attached
# A funded account on the testnet is provided for testing purposes
# https://xrpl.org/transaction-common-fields.html#memos-field

# Connect to a testnet node
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)

# Get account credentials from the Testnet Faucet
print("Requesting an account from the Testnet faucet...")
test_wallet = generate_faucet_wallet(client=client)
myAddr = test_wallet.address

memo_data = "Example Memo - 123 -=+"
memo_type = "Text"
memo_format = "text/plain"

memo_data = memo_data.encode('utf-8').hex()
memo_type = memo_type.encode('utf-8').hex()

# MemoFormat values: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
memo_format = memo_format.encode('utf-8').hex()

# Construct Payment transaction w/ memo field filled
payment_tx = Payment(
    account=myAddr,
    destination="rjhpRPyL5FfCxkq2LXoWxEEyuz4koPeP5",
    amount="1000000",
    memos=[
        Memo(
            memo_type=memo_type,
            memo_data=memo_data,
            memo_format=memo_format
        ),
    ],
)

# Sign the transaction
print("Submitting a payment transaction with our memo...")
payment_tx_signed = autofill_and_sign(payment_tx, client=client, wallet=test_wallet)
print(f"\n  Encoded Transaction MEMO: {payment_tx_signed.memos}")

# Send the transaction to the node
submit_tx_regular = submit_and_wait(transaction=payment_tx_signed, client=client)
submit_tx_regular = submit_tx_regular.result

tx_MemoData = bytes.fromhex(submit_tx_regular['Memos'][0]['Memo']['MemoData']).decode('utf-8')
tx_MemoFormat = bytes.fromhex(submit_tx_regular['Memos'][0]['Memo']['MemoFormat']).decode('utf-8')
tx_MemoType = bytes.fromhex(submit_tx_regular['Memos'][0]['Memo']['MemoType']).decode('utf-8')

print(f"  Decoded Transaction MEMO:")
print(f"         MemoData: {tx_MemoData}")
print(f"       MemoFormat: {tx_MemoFormat}")
print(f"         MemoType: {tx_MemoType}")


print(f"\n Payment tx w/ memo result: {submit_tx_regular['meta']['TransactionResult']}")
print(f"                   Tx Hash: {submit_tx_regular['hash']}")
