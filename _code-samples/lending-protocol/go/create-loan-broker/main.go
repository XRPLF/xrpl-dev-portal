// IMPORTANT: This example creates a loan broker using an existing account
// that has already created a PRIVATE vault.
// If you want to create a loan broker for a PUBLIC vault, you can replace the vaultID
// and loanBroker values with your own.

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

	// Load preconfigured accounts and VaultID
	data, err := os.ReadFile("lending-setup.json")
	if err != nil {
		panic(err)
	}
	var setup map[string]any
	json.Unmarshal(data, &setup)

	// You can replace these values with your own
	loanBrokerWallet, err := wallet.FromSeed(setup["loanBroker"].(map[string]any)["seed"].(string), "")
	if err != nil {
		panic(err)
	}
	vaultID := setup["vaultId"].(string)

	fmt.Printf("\nLoan broker/vault owner address: %s\n", loanBrokerWallet.ClassicAddress)
	fmt.Printf("Vault ID: %s\n", vaultID)

	// Prepare LoanBrokerSet transaction
	fmt.Printf("\n=== Preparing LoanBrokerSet transaction ===\n\n")
	mgmtFeeRate := types.InterestRate(1000)
	loanBrokerSetTx := &transaction.LoanBrokerSet{
		BaseTx: transaction.BaseTx{
			Account:         loanBrokerWallet.GetAddress(),
			TransactionType: transaction.LoanBrokerSetTx,
		},
		VaultID:           vaultID,
		ManagementFeeRate: &mgmtFeeRate,
	}

	flatLoanBrokerSetTx := loanBrokerSetTx.Flatten()
	loanBrokerSetTxJSON, _ := json.MarshalIndent(flatLoanBrokerSetTx, "", "  ")
	fmt.Printf("%s\n", string(loanBrokerSetTxJSON))

	// Submit, sign, and wait for validation
	fmt.Printf("\n=== Submitting LoanBrokerSet transaction ===\n\n")
	loanBrokerSetResponse, err := client.SubmitTxAndWait(flatLoanBrokerSetTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &loanBrokerWallet,
	})
	if err != nil {
		panic(err)
	}

	if loanBrokerSetResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to create loan broker: %s\n", loanBrokerSetResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Loan broker created successfully!\n")

	// Extract loan broker information from the transaction result
	fmt.Printf("\n=== Loan Broker Information ===\n\n")
	for _, node := range loanBrokerSetResponse.Meta.AffectedNodes {
		if node.CreatedNode != nil && node.CreatedNode.LedgerEntryType == "LoanBroker" {
			fmt.Printf("LoanBroker ID: %s\n", node.CreatedNode.LedgerIndex)
			fmt.Printf("LoanBroker Pseudo-Account Address: %s\n", node.CreatedNode.NewFields["Account"])
			break
		}
	}
}
