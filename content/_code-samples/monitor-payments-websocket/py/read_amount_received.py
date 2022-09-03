import json

# Helpers to find accounts in AffectedNodes and see how much the balance changed.
def FindXRPDifference(tx, address):
	for i in tx['meta']['AffectedNodes']:
		if 'CreatedNode' and 'ModifiedNode' in list(i): 
			# If a CreatedNode and a ModifiedNode both exist, the monitores account has funded another account
			if ledger_entry['LedgerEntryType'] == 'AccountRoot' and ledger_entry['NewFields']['Account'] != address:
				new_address = ledger_entry['NewFields']['Account']
				balance_drops = int(ledger_entry['NewFields']['Balance'])
				xrp_amount = (balance_drops / 1000000)
				print("A new account", new_address, "was funded with", xrp_amount, "XRP")
				break

		elif list(i)[0] == 'ModifiedNode':
			ledger_entry = i['ModifiedNode']
			if ledger_entry['LedgerEntryType'] == 'AccountRoot' and ledger_entry['FinalFields']['Account'] == address:
				if not ledger_entry['PreviousFields']['Balance']:
					print('Balance didnt change')
				# Subtracts the previous balance from the new balance
				old_balance = int(ledger_entry['PreviousFields']['Balance'])
				new_balance = int(ledger_entry['FinalFields']['Balance'])
				diff_in_drops = (new_balance - old_balance)
				xrp_amount = (diff_in_drops / 1000000)
				if xrp_amount > 0:
					print("Received", xrp_amount, "XRP")
					break
				else:
					print("Spent", abs(xrp_amount), "XRP")
					break
		elif list(i)[0] == 'CreatedNode':
			# If there is no outgoing payment, but an account was created, the account most likely just got funded
			ledger_entry = i['CreatedNode']
			if ledger_entry['LedgerEntryType'] == 'AccountRoot' and ledger_entry['NewFields']['Account'] == address:
				balance_drops = int(ledger_entry['NewFields']['Balance'])
				xrp_amount = (balance_drops / 1000000)
				print("Received", xrp_amount, "XRP (account funded)")
				break
	else:
		print("Did not find address in affected nodes.")
	

def CountXRPReceived(tx, address):
	if tx['meta']['TransactionResult'] != 'tesSUCCESS':
		print('Transaction failed')
		return
	if tx['transaction']['TransactionType'] == 'Payment':
		if tx['transaction']['Destination'] != address:
			print('Not the destination of this payment.')
			return
		if tx['meta']['delivered_amount'] is str:
			amount_in_drops = tx['transaction']['Amount']
			xrp_amount = (amount_in_drops / 1000000)
			print('Received', xrp_amount, 'XRP')
			return
		else:
			print('Received non-XRP currency')
	elif tx['transaction']['TransactionType'] == 'PaymentChannelClaim' or 'PaymentChannelFund' or'OfferCreate' or 'CheckCash' or 'EscrowFinish':
		FindXRPDifference(tx, address)
	else:
		print('Not a currency-delivering transaction type', tx['transaction']['TransactionType'])


CountXRPReceived(tx=transaction, address='rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe')


