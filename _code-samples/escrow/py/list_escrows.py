from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountObjects, Ledger
from xrpl.utils import ripple_time_to_datetime, drops_to_xrp

address = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
client = JsonRpcClient("https://xrplcluster.com/")

# Look up the official close time of the validated ledger ----------------------
validated_ledger = client.request(Ledger(ledger_index="validated"))
close_time = validated_ledger.result["ledger"]["close_time"]
print("Latest validated ledger closed at", 
    ripple_time_to_datetime(close_time)
)
ledger_hash = validated_ledger.result["ledger"]["ledger_hash"]

# Look up objects filtered to escrows, handling pagination ---------------------
escrows = []
marker = None
while True:
    try:
        response = client.request(AccountObjects(
            account=address,
            ledger_hash=ledger_hash, # Caution: if you use a shortcut such as
                                     # ledger_index="validated", the ledger may
                                     # change during iteration, leading to
                                     # inconsistent results.
            type="escrow",
            marker=marker
        ))
    except Exception as e:
        print(f"Error: account_objects failed: {e}")
        exit(1)

    # Concatenate escrows from this page to the full list
    escrows += response.result["account_objects"]

    # If there's a marker, loop and fetch the next page of results
    if "marker" in response.result.keys():
        marker=marker
    else:
        break

# Define helper function for displaying amounts --------------------------------
def display_amount(amount):
    if type(amount) == str:
        # amount is drops of XRP
        decimal_xrp = drops_to_xrp(amount)
        return f"{decimal_xrp} XRP"
    elif "mpt_issuance_id" in amount.keys():
        # amount is an MPT.
        # More info may be available, but that would require looking it up.
        return f"{amount['value']} units of MPT {amount['mpt_issuance_id']}"
    elif "issuer" in amount.keys():
        # amount is a trust line token.
        # Currency may be 3 chars or hex. For guidelines parsing hex codes,
        # see "Normalize Currency Codes" code sample.
        return f"{amount['value']} {amount['currency']} issued by {amount['issuer']}"
    
    print(f"Unexpected type of amount: {amount}")
    exit(1)

# Summarize results ------------------------------------------------------------
print(f"Found {len(escrows)} escrow(s).")

for escrow in escrows:
    if escrow['Account'] == address:
        print(f"Outgoing escrow to {escrow['Destination']}")
    elif escrow['Destination'] == address:
        print(f"Incoming escrow from {escrow['Account']}")
    else:
        print("Neither incoming nor outgoing? This is unexpected.")
    
    if "Condition" in escrow.keys():
        print(f"  Condition: {escrow['Condition']}")
    
    if "FinishAfter" in escrow.keys():
        mature_time_display = ripple_time_to_datetime(escrow['FinishAfter'])
        if escrow["FinishAfter"] < close_time:
            print("  Matured at", mature_time_display)
        else:
            print("  Will mature at", mature_time_display)

    if "CancelAfter" in escrow.keys():
        cancel_time_display = ripple_time_to_datetime(escrow['CancelAfter'])
        if escrow["CancelAfter"] < close_time:
            print("  EXPIRED AT", cancel_time_display)
        else:
            print("  Expires at", cancel_time_display)
