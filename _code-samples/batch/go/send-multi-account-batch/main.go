/*
 * XRP Ledger Batch Transactions Tutorial
 *
 * This tutorial demonstrates how to use the Batch transaction feature (XLS-56)
 * to perform a multi-account batch transaction.
 * Concept doc: https://xrpl.org/docs/concepts/transactions/batch-transactions
 * Reference doc: https://xrpl.org/docs/references/protocol/transactions/types/batch
 */

package main

import (
	"encoding/json"
	"fmt"
	"maps"
	"os"

	binarycodec "github.com/Peersyst/xrpl-go/binary-codec"
	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/hash"
	"github.com/Peersyst/xrpl-go/xrpl/queries/transactions"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

// toBatch converts a flat Batch transaction (a map) back into a transaction.Batch
// struct, which is the form that wallet.CombineBatchSigners expects.
func toBatch(flatTx transaction.FlatTransaction) transaction.Batch {
	data, err := json.Marshal(flatTx)
	if err != nil {
		panic(err)
	}
	var batchTx transaction.Batch
	if err := json.Unmarshal(data, &batchTx); err != nil {
		panic(err)
	}
	return batchTx
}

func main() {
	// Connect to the network ----------------------
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.devnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
	)
	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	// Create and fund wallets
	fmt.Println("=== Funding new wallets from faucet... ===")
	createAndFund := func() wallet.Wallet {
		w, err := wallet.New(crypto.ED25519())
		if err != nil {
			panic(err)
		}
		if err := client.FundWallet(&w); err != nil {
			panic(err)
		}
		return w
	}
	alice := createAndFund()
	bob := createAndFund()
	charlie := createAndFund()
	thirdPartyWallet := createAndFund()

	printBalances := func() {
		for _, w := range []struct {
			label  string
			wallet wallet.Wallet
		}{
			{"Alice", alice},
			{"Bob", bob},
			{"Charlie", charlie},
			{"Third-party wallet", thirdPartyWallet},
		} {
			balance, err := client.GetXrpBalance(w.wallet.GetAddress())
			if err != nil {
				panic(err)
			}
			fmt.Printf("%s: %s, Balance: %s XRP\n", w.label, w.wallet.GetAddress(), balance)
		}
	}
	printBalances()

	// Create inner transactions ----------------------
	// REQUIRED: Inner transactions MUST have the TfInnerBatchTxn flag (0x40000000).
	// This marks them as part of a batch (requires Fee: 0 and empty SigningPubKey).

	// Transaction 1: Charlie pays Alice
	charliePayment := transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: charlie.GetAddress(),
			Flags:   types.TfInnerBatchTxn, // THIS IS REQUIRED
		},
		Destination: alice.GetAddress(),
		Amount:      types.XRPCurrencyAmount(50000000), // 50 XRP
	}

	// Transaction 2: Bob pays Alice
	bobPayment := transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: bob.GetAddress(),
			Flags:   types.TfInnerBatchTxn, // THIS IS REQUIRED
		},
		Destination: alice.GetAddress(),
		Amount:      types.XRPCurrencyAmount(50000000), // 50 XRP
	}

	// Prepare Batch transaction ----------------------
	fmt.Printf("\n=== Creating Batch transaction... ===\n")
	batchTx := transaction.Batch{
		BaseTx: transaction.BaseTx{
			Account: thirdPartyWallet.GetAddress(),
		},
		// Must include a minimum of 2 transactions and a maximum of 8 transactions.
		RawTransactions: []types.RawTransaction{
			{RawTransaction: charliePayment.Flatten()},
			{RawTransaction: bobPayment.Flatten()},
		},
	}
	// tfAllOrNothing: All inner transactions must succeed
	batchTx.SetAllOrNothingFlag()

	// Flatten() converts the struct to a map and adds the TransactionType field
	flatBatchTx := batchTx.Flatten()
	batchTxJSON, _ := json.MarshalIndent(flatBatchTx, "", "  ")
	fmt.Printf("%s\n", string(batchTxJSON))

	// Set the expected number of signers, which is 2 (Bob and Charlie) in this case, for this transaction.
	// "Autofill" will automatically add Fee: "0" and SigningPubKey: "" to inner transactions.
	if err := client.AutofillMultisigned(&flatBatchTx, 2); err != nil {
		panic(err)
	}

	// Gather batch signatures ----------------------
	// Each signer needs their own tx copy because SignMultiBatch modifies the map.
	// Charlie signs the Batch transaction
	charlieBatch := maps.Clone(flatBatchTx)
	if err := wallet.SignMultiBatch(charlie, &charlieBatch, nil); err != nil {
		panic(err)
	}

	// Bob signs the Batch transaction
	bobBatch := maps.Clone(flatBatchTx)
	if err := wallet.SignMultiBatch(bob, &bobBatch, nil); err != nil {
		panic(err)
	}

	// Combine inner transaction signatures.
	// This returns a signed transaction blob (hex string) ready for submission.
	combinedTxBlob, err := wallet.CombineBatchSigners([]transaction.Batch{
		toBatch(charlieBatch),
		toBatch(bobBatch),
	})
	if err != nil {
		panic(err)
	}

	// Submit the signed blob with the third-party's wallet
	fmt.Printf("\n=== Submitting Batch transaction... ===\n")
	// Decode the blob into a transaction map so the third-party wallet can sign it.
	combinedTx, err := binarycodec.Decode(combinedTxBlob)
	if err != nil {
		panic(err)
	}
	signedTxBlob, _, err := thirdPartyWallet.Sign(combinedTx)
	if err != nil {
		panic(err)
	}
	submitResponse, err := client.SubmitTxBlobAndWait(signedTxBlob, false)
	if err != nil {
		panic(err)
	}

	// Check Batch transaction result ----------------------
	if submitResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("\nTransaction failed with result code %s\n", submitResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("\nBatch transaction submitted successfully!\n")
	resultJSON, _ := json.MarshalIndent(submitResponse, "", "  ")
	fmt.Printf("Result:\n%s\n", string(resultJSON))
	// View the transaction on the XRPL Explorer
	fmt.Printf("\nBatch transaction URL:\nhttps://devnet.xrpl.org/transactions/%s\n", submitResponse.Hash)

	// Calculate and verify inner transaction hashes ----------------------
	fmt.Printf("\n=== Verifying inner transactions ===\n")
	rawTransactions := submitResponse.TxJSON["RawTransactions"].([]any)
	hasFailure := false

	for i, rawTx := range rawTransactions {
		innerTx := rawTx.(map[string]any)["RawTransaction"].(map[string]any)
		txHash, err := hash.SignTx(innerTx)
		if err != nil {
			panic(err)
		}
		fmt.Printf("\nTransaction %d hash: %s\n", i+1, txHash)

		txResponse, err := client.Request(&transactions.TxRequest{Transaction: txHash})
		if err != nil {
			hasFailure = true
			fmt.Printf(" - Transaction not found: %s\n", err)
			continue
		}
		var tx transactions.TxResponse
		if err := txResponse.GetResult(&tx); err != nil {
			panic(err)
		}
		fmt.Printf(" - Status: %s (Ledger %d)\n", tx.Meta.TransactionResult, tx.LedgerIndex)
		fmt.Printf(" - Transaction URL: https://devnet.xrpl.org/transactions/%s\n", txHash)
	}
	if hasFailure {
		fmt.Printf("\n--- Error: One or more inner transactions failed. ---\n")
		os.Exit(1)
	}

	// Verify balances after transaction
	fmt.Printf("\n=== Final balances ===\n")
	printBalances()
}
