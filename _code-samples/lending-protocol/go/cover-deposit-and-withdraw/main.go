// IMPORTANT: This example deposits and withdraws first-loss capital from a
// preconfigured LoanBroker entry.

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"

	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
	wstypes "github.com/Peersyst/xrpl-go/xrpl/websocket/types"
)

func main() {
	// Connect to the network
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.devnet.rippletest.net:51233"),
	)
	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	// Check for setup data; run lending-setup if missing
	if _, err := os.Stat("lending-setup.json"); os.IsNotExist(err) {
		fmt.Printf("\n=== Lending tutorial data doesn't exist. Running setup script... ===\n\n")
		cmd := exec.Command("go", "run", "./lending-setup")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			panic(err)
		}
	}

	// Load preconfigured accounts and LoanBrokerID
	data, err := os.ReadFile("lending-setup.json")
	if err != nil {
		panic(err)
	}
	var setup map[string]any
	json.Unmarshal(data, &setup)

	// You can replace these values with your own
	loanBrokerWallet, err := wallet.FromSecret(setup["loanBroker"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}
	loanBrokerID := setup["loanBrokerId"].(string)
	mptID := setup["mptId"].(string)

	fmt.Printf("\nLoan broker address: %s\n", loanBrokerWallet.ClassicAddress)
	fmt.Printf("LoanBrokerID: %s\n", loanBrokerID)
	fmt.Printf("MPT ID: %s\n", mptID)

	// Prepare LoanBrokerCoverDeposit transaction
	fmt.Printf("\n=== Preparing LoanBrokerCoverDeposit transaction ===\n\n")
	coverDepositTx := transaction.LoanBrokerCoverDeposit{
		BaseTx: transaction.BaseTx{
			Account: loanBrokerWallet.ClassicAddress,
		},
		LoanBrokerID: loanBrokerID,
		Amount: types.MPTCurrencyAmount{
			MPTIssuanceID: mptID,
			Value:         "2000",
		},
	}

	// Flatten() converts the struct to a map and adds the TransactionType field
	flatCoverDepositTx := coverDepositTx.Flatten()
	coverDepositTxJSON, _ := json.MarshalIndent(flatCoverDepositTx, "", "  ")
	fmt.Printf("%s\n", string(coverDepositTxJSON))

	// Sign, submit, and wait for deposit validation
	fmt.Printf("\n=== Submitting LoanBrokerCoverDeposit transaction ===\n\n")
	depositResponse, err := client.SubmitTxAndWait(flatCoverDepositTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &loanBrokerWallet,
	})
	if err != nil {
		panic(err)
	}

	if depositResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to deposit cover: %s\n", depositResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Cover deposit successful!\n")

	// Extract cover balance from the transaction result
	fmt.Printf("\n=== Cover Balance ===\n\n")
	for _, node := range depositResponse.Meta.AffectedNodes {
		if node.ModifiedNode != nil && node.ModifiedNode.LedgerEntryType == "LoanBroker" {
			// First-loss capital is stored in the LoanBroker's pseudo-account.
			fmt.Printf("LoanBroker Pseudo-Account: %s\n", node.ModifiedNode.FinalFields["Account"])
			fmt.Printf("Cover balance after deposit: %s TSTUSD\n", node.ModifiedNode.FinalFields["CoverAvailable"])
			break
		}
	}

	// Prepare LoanBrokerCoverWithdraw transaction
	fmt.Printf("\n=== Preparing LoanBrokerCoverWithdraw transaction ===\n\n")
	coverWithdrawTx := transaction.LoanBrokerCoverWithdraw{
		BaseTx: transaction.BaseTx{
			Account: loanBrokerWallet.ClassicAddress,
		},
		LoanBrokerID: loanBrokerID,
		Amount: types.MPTCurrencyAmount{
			MPTIssuanceID: mptID,
			Value:         "1000",
		},
	}

	flatCoverWithdrawTx := coverWithdrawTx.Flatten()
	coverWithdrawTxJSON, _ := json.MarshalIndent(flatCoverWithdrawTx, "", "  ")
	fmt.Printf("%s\n", string(coverWithdrawTxJSON))

	// Sign, submit, and wait for withdraw validation
	fmt.Printf("\n=== Submitting LoanBrokerCoverWithdraw transaction ===\n\n")
	withdrawResponse, err := client.SubmitTxAndWait(flatCoverWithdrawTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &loanBrokerWallet,
	})
	if err != nil {
		panic(err)
	}

	if withdrawResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to withdraw cover: %s\n", withdrawResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Cover withdraw successful!\n")

	// Extract updated cover balance from the transaction result
	fmt.Printf("\n=== Updated Cover Balance ===\n\n")
	for _, node := range withdrawResponse.Meta.AffectedNodes {
		if node.ModifiedNode != nil && node.ModifiedNode.LedgerEntryType == "LoanBroker" {
			fmt.Printf("LoanBroker Pseudo-Account: %s\n", node.ModifiedNode.FinalFields["Account"])
			fmt.Printf("Cover balance after withdraw: %s TSTUSD\n", node.ModifiedNode.FinalFields["CoverAvailable"])
			break
		}
	}
}
