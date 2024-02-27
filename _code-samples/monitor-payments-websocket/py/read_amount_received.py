import json

# Helpers to find accounts in AffectedNodes and see how much the balance changed.
def FindXRPDifference(tx, address):
	# Define empty list to put the Node change type in.
	affected_nodes = []
	# Loop over the AffectedNodes to build a list of affected nodes
	for i in tx['meta']['AffectedNodes']:
		i = list(i)[0]
		affected_nodes.append(i)
	else:
		for i in tx['meta']['AffectedNodes']:
			if 'CreatedNode' in affected_nodes and 'ModifiedNode' in affected_nodes: 
				# If a CreatedNode and a ModifiedNode both exist, the monitored account has funded another account
				# If both exist, CreatedNode always comes after AffectedNode, so we can gather it by getting the second entry in the list by using [1]
				ledger_entry = tx['meta']['AffectedNodes'][1]['CreatedNode']
				if ledger_entry['LedgerEntryType'] == 'AccountRoot' and ledger_entry['NewFields']['Account'] != address:
					new_address = ledger_entry['NewFields']['Account']
					balance_drops = int(ledger_entry['NewFields']['Balance'])
					xrp_amount = (balance_drops / 1000000)
					print(f"A new account {new_address} was funded with {xrp_amount} XRP")
					return
			elif affected_nodes == ['ModifiedNode']:
				ledger_entry = i['ModifiedNode']
				if ledger_entry['LedgerEntryType'] == 'AccountRoot' and ledger_entry['FinalFields']['Account'] == address:
					if not ledger_entry['PreviousFields']['Balance']:
						print("Balance didn't change")
					# Subtracts the previous balance from the new balance
					old_balance = int(ledger_entry['PreviousFields']['Balance'])
					new_balance = int(ledger_entry['FinalFields']['Balance'])
					diff_in_drops = (new_balance - old_balance)
					xrp_amount = (diff_in_drops / 1000000)
					if xrp_amount > 0:
						print(f"Received {xrp_amount} XRP")
						return
					else:
						print("Spent", abs(xrp_amount), "XRP")
						return

			elif affected_nodes == ['CreatedNode']:
				# If there is no outgoing payment, but an account was created, the account most likely just got funded
				ledger_entry = i['CreatedNode']
				if ledger_entry['LedgerEntryType'] == 'AccountRoot' and ledger_entry['NewFields']['Account'] == address:
					balance_drops = int(ledger_entry['NewFields']['Balance'])
					xrp_amount = (balance_drops / 1000000)
					print(f"Received {xrp_amount} XRP (account funded)")
					return
		else:
			print("Did not find address in affected nodes.")
	
# Check how much XRP was received, if any
def CountXRPReceived(tx, address):
	if tx['meta']['TransactionResult'] != 'tesSUCCESS':
		print("Transaction failed")
		return
	if tx['transaction']['TransactionType'] == 'Payment':
		if tx['transaction']['Destination'] != address:
			print("Not the destination of this payment.")
			return
		if tx['meta']['delivered_amount'] is int or str:
			amount_in_drops = int(tx['transaction']['Amount'])
			xrp_amount = (amount_in_drops / 1000000)
			print(f"Received {xrp_amount} XRP")
			return
		else:
			print("Received non-XRP currency")
	elif tx['transaction']['TransactionType'] == 'PaymentChannelClaim' or 'PaymentChannelFund' or'OfferCreate' or 'CheckCash' or 'EscrowFinish':
		FindXRPDifference(tx, address)
	else:
		print("Not a currency-delivering transaction type", tx['transaction']['TransactionType'])

CountXRPReceived(tx=transaction, address='rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe')


