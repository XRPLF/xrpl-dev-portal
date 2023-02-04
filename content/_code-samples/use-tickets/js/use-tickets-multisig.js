if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
}
  // List which Tickets are outstanding against one’s own account and use Tickets to collect signatures for multisign transactions
// https://xrpl.org/use-tickets.html
// https://xrpl.org/signerlistset.html#signerlistset
// https://xrpl.org/multi-signing.html#multi-signing

async function main() {
  // Connect to a testnet node
  console.log("Connecting to Testnet...")
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()
  
    // Get account credentials from the Testnet Faucet
    console.log("Requesting account credentials from the Testnet faucet, this may take awhile...")
    const { wallet: main_wallet } = await client.fundWallet()

    // Signer keys don't need to be funded on the ledger, it only needs to be cryptographically valid
    // Thus, we could generate keys and set them as signers without the need to fund their accounts
    // But we'll still fund them for testing purposes...
    const { wallet: wallet_1 } = await client.fundWallet()
    const { wallet: wallet_2 } = await client.fundWallet()
    const { wallet: wallet_3 } = await client.fundWallet()

    console.log(" Main Account: ", main_wallet.address)
    console.log("         Seed: ", main_wallet.seed)

    console.log("\n Signer 1: ", wallet_1.address)
    console.log(" Signer 2: ", wallet_2.address)
    console.log(" Signer 3: ", wallet_3.address)

    // Send SignerListSet transaction
    // Since each signer is given a signer weight of 1 and there are 3 signers, the maximum quorom would be 3
    // SignerQuorom is a target number for the signer weights
    // A multisig from this list is valid only if the sum weights of the signatures provided is greater than or equal to the SignerQuorom
    const signerLiSetSignerList_tx = {
        TransactionType: "SignerListSet",
        Account: main_wallet.classicAddress,
        SignerEntries: [
          {
            SignerEntry: {
              Account: wallet_1.classicAddress,
              SignerWeight: 1,
            },
          },
          {
            SignerEntry: {
              Account: wallet_2.classicAddress,
              SignerWeight: 1,
            },
          },
          {
            SignerEntry: {
              Account: wallet_3.classicAddress,
              SignerWeight: 1,
            },
          }
        ],
        SignerQuorum: 2,
      }

    const signerLiSetSignerList_tx_prepared = await client.autofill(signerLiSetSignerList_tx)
    const SetSignerList_tx_signed = main_wallet.sign(signerLiSetSignerList_tx_prepared)
    console.log(`\n SignerListSet Tx hash: ${SetSignerList_tx_signed.hash}`)
  
    const setsignerlist_submit = await client.submitAndWait(SetSignerList_tx_signed.tx_blob)
    console.log(`\t Submit result: ${setsignerlist_submit.result.meta.TransactionResult}`)
    
    const CreateTicket_tx = await client.autofill({
      TransactionType: "TicketCreate",
      Account: main_wallet.address,
      TicketCount: 3
    })
  
    const CreateTicket_tx_signed = main_wallet.sign(CreateTicket_tx)
    console.log("\n CreateTicket Tx hash:", CreateTicket_tx_signed.hash)
  
    const ticket_submit = await client.submitAndWait(CreateTicket_tx_signed.tx_blob)
    console.log("        Submit result:", ticket_submit.result.meta.TransactionResult)
    
    const ticket_response = await client.request({
        command: "account_objects",
        account: main_wallet.address,
        ledger_index: "validated",
        type: "ticket"
    })

    console.log(`\n- Tickets issued by ${main_wallet.address}:\n`)
    for (let i = 0; i < ticket_response.result.account_objects.length; i++) {
        console.log(`Ticket ${i+1}: ${ticket_response.result.account_objects[i].TicketSequence}`)
    }

    // We'll use this ticket on our tx
    const ticket_1 = ticket_response.result.account_objects[0].TicketSequence
    
    console.log(`\n Ticket sequence ${ticket_1} will be used for our multi-sig transaction`)
    
    const Payment_tx = {    
        "TransactionType": "AccountSet",
        "Account": main_wallet.address,
        "TicketSequence": ticket_1,
        "LastLedgerSequence": null,
        "Sequence": 0
    }

    const Payment_tx_prepared = await client.autofill(Payment_tx, signersCount=3)
    
    // Each signer will sign the prepared tx (AccountSet_tx) and their signatures will be combines into 1 multi-sig transaction
    const { tx_blob: Payment_tx_signed_1 } = wallet_1.sign(Payment_tx_prepared, multisign=true)
    const { tx_blob: Payment_tx_signed_2 } = wallet_2.sign(Payment_tx_prepared, multisign=true)
    const { tx_blob: Payment_tx_signed_3 } = wallet_3.sign(Payment_tx_prepared, multisign=true)
  
    console.log("\n All signers have signed the transaction with their corresponding keys")

    // Combine 3 of the signers' signatures to form a multi-sig transaction
    const multisignedTx = xrpl.multisign([Payment_tx_signed_1, Payment_tx_signed_2, Payment_tx_signed_3])

    const multisig_submit = await client.submitAndWait(multisignedTx)
    console.log("\n Multi-sig Submit result:", multisig_submit.result.meta.TransactionResult)
    console.log("\n Multi-sig Tx Binary:", multisignedTx)

    client.disconnect()

    // End main()
  }
  
  main()
