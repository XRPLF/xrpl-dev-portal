client = JsonRpcClient("https://s.altnet.rippletest.net:51234") # connect to the testnetwork

"""Create xrp check"""

# check sender seed
sender_seed = "sxxxxxxxxxxxxxxxxxxxx"

# check receiver address
receiver_addr = "rxxxxxxxxxxxxxxxxxxxxxxxxxx"

# amount of xrp to deliver
amount = 10.00

# check expiry date
expiry_date = int # from xrpl.utils import datetime_to_ripple_time()

# generate wallet from seed
sender_wallet = Wallet(seed=sender_seed, sequence=0)

# build check create transaction
check_txn = CheckCreate(account=sender_wallet.classic_address,
        destination=receiver_addr,
        send_max=xrp_to_drops(amount),
        expiration=expiry_date)

# sign transaction
stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, client)

# submit transaction and wait for result
stxn_response = send_reliable_submission(stxn, client)

# parse response for result
stxn_result = stxn_response.result

# print result and transaction hash
print(stxn_result["meta"]["TransactionResult"])
print(stxn_result["hash"])
