/*
 * Single Account Batch Transaction Example
 *
 * This example demonstrates how to use the Batch transactions feature (XLS-56)
 * to create a single-account batch transaction that sends payments
 * to multiple destinations in one atomic operation.
 * Concept doc: https://xrpl.org/docs/concepts/transactions/batch-transactions
 * Reference doc: https://xrpl.org/docs/references/protocol/transactions/types/batch
 */

package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/hash"
	"github.com/Peersyst/xrpl-go/xrpl/queries/transactions"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
	wstypes "github.com/Peersyst/xrpl-go/xrpl/websocket/types"
)

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
	sender := createAndFund()
	wallet1 := createAndFund()
	wallet2 := createAndFund()

	printBalances := func() {
		for _, w := range []struct {
			label  string
			wallet wallet.Wallet
		}{
			{"Sender", sender},
			{"Wallet1", wallet1},
			{"Wallet2", wallet2},
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

	// Transaction 1
	payment1 := transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: sender.GetAddress(),
			Flags:   types.TfInnerBatchTxn, // THIS IS REQUIRED
		},
		Destination: wallet1.GetAddress(),
		Amount:      types.XRPCurrencyAmount(2000000), // 2 XRP
	}

	// Transaction 2
	payment2 := transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: sender.GetAddress(),
			Flags:   types.TfInnerBatchTxn, // THIS IS REQUIRED
		},
		Destination: wallet2.GetAddress(),
		Amount:      types.XRPCurrencyAmount(5000000), // 5 XRP
	}

	// Prepare Batch transaction ----------------------
	fmt.Printf("\n=== Creating Batch transaction... ===\n")
	batchTx := transaction.Batch{
		BaseTx: transaction.BaseTx{
			Account: sender.GetAddress(),
		},
		// Must include a minimum of 2 transactions and a maximum of 8 transactions.
		RawTransactions: []types.RawTransaction{
			{RawTransaction: payment1.Flatten()},
			{RawTransaction: payment2.Flatten()},
		},
	}
	// tfAllOrNothing: All inner transactions must succeed
	batchTx.SetAllOrNothingFlag()

	// Flatten() converts the struct to a map and adds the TransactionType field
	flatBatchTx := batchTx.Flatten()
	batchTxJSON, _ := json.MarshalIndent(flatBatchTx, "", "  ")
	fmt.Printf("%s\n", string(batchTxJSON))

	// Submit and wait for validation ----------------------
	fmt.Printf("\n=== Submitting Batch transaction... ===\n")
	// "Autofill" will automatically add Fee: "0" and SigningPubKey: "" to inner transactions.
	submitResponse, err := client.SubmitTxAndWait(flatBatchTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &sender,
	})
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
	// View the batch transaction on the XRPL Explorer
	fmt.Printf("\nBatch transaction URL:\nhttps://devnet.xrpl.org/transactions/%s\n", submitResponse.Hash)

	// Calculate and verify inner transaction hashes ----------------------
	fmt.Printf("\n=== Verifying inner transactions... ===\n")
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
