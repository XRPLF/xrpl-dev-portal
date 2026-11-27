# Example credentials ----------------------------------------------------------
require 'xrpl-ruby'
require 'json'
test_wallet = Wallet::Wallet.from_seed('sn3nxiW7v8KXzPzAqzyHXbSSKNuN9')
puts test_wallet.classic_address # "rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH"

# Connect ----------------------------------------------------------------------
client = XRPL::Client.new(:testnet)
client.connect!

# Get credentials from the Testnet faucet --------------------------------------
# For production, instead create a Wallet instance as above.
test_wallet = XRPL.fund_wallet(client)[:wallet]
puts "Funded account: #{test_wallet.classic_address}"

# Prepare transaction ----------------------------------------------------------
# Amounts are expressed in drops of XRP, where 1 XRP = 1,000,000 drops.
payment = {
  'TransactionType' => 'Payment',
  'Account' => test_wallet.classic_address,
  'Amount' => '22000000', # 22 XRP
  'Destination' => 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe'
}
prepared = client.autofill(payment)
puts "Prepared transaction: #{prepared}"

# Sign transaction -------------------------------------------------------------
signed = test_wallet.sign(prepared)
tx_id = signed['hash']
max_ledger = prepared['LastLedgerSequence']
puts "Identifying hash: #{tx_id}"
puts "Transaction expires after ledger: #{max_ledger}"

# Submit transaction -----------------------------------------------------------
# submit_and_wait deterministically re-signs the already-autofilled transaction
# (producing the same hash) and waits until it is in a validated ledger.
tx_response = client.submit_and_wait(prepared, wallet: test_wallet, autofill: false)

# Wait for validation ----------------------------------------------------------
# submit_and_wait handles this automatically, but it can take 4-7 seconds.

# Check transaction results ----------------------------------------------------
puts JSON.pretty_generate(tx_response)
puts "Explorer link: https://testnet.xrpl.org/transactions/#{tx_id}"
metadata = tx_response.dig('result', 'meta') || {}
puts "Result code: #{metadata['TransactionResult']}" if metadata['TransactionResult']
