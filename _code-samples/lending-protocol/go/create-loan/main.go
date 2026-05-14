// IMPORTANT: This example creates a loan using a preconfigured
// loan broker, borrower, and private vault.

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
)

// ptr is a helper that returns a pointer to the given value,
// used for setting optional transaction fields in Go.
func ptr[T any](v T) *T { return &v }

func main() {
	// Connect to the network ----------------------
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
	if err := json.Unmarshal(data, &setup); err != nil {
		panic(err)
	}

	// You can replace these values with your own
	loanBrokerWallet, err := wallet.FromSecret(setup["loanBroker"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}
	borrowerWallet, err := wallet.FromSecret(setup["borrower"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}
	loanBrokerID := setup["loanBrokerID"].(string)

	fmt.Printf("\nLoan broker address: %s\n", loanBrokerWallet.ClassicAddress)
	fmt.Printf("Borrower address: %s\n", borrowerWallet.ClassicAddress)
	fmt.Printf("LoanBrokerID: %s\n", loanBrokerID)

	// Prepare LoanSet transaction ----------------------
	// Account and Counterparty accounts can be swapped, but determines signing order.
	// Account signs first, Counterparty signs second.
	fmt.Printf("\n=== Preparing LoanSet transaction ===\n\n")

	counterparty := borrowerWallet.ClassicAddress
	loanSetTx := transaction.LoanSet{
		BaseTx: transaction.BaseTx{
			Account: loanBrokerWallet.ClassicAddress,
		},
		LoanBrokerID:       loanBrokerID,
		PrincipalRequested: "1000",
		Counterparty:       &counterparty,
		InterestRate:       ptr(types.InterestRate(500)),
		PaymentTotal:       ptr(types.PaymentTotal(12)),
		PaymentInterval:    ptr(types.PaymentInterval(2592000)),
		GracePeriod:        ptr(types.GracePeriod(604800)),
		LoanOriginationFee: ptr(types.XRPLNumber("100")),
		LoanServiceFee:     ptr(types.XRPLNumber("10")),
	}

	// Flatten() converts the struct to a map and adds the TransactionType field.
	// The result is cast to FlatTransaction, which is required by Autofill and signing methods.
	flatLoanSetTx := transaction.FlatTransaction(loanSetTx.Flatten())

	// Autofill the transaction
	if err := client.Autofill(&flatLoanSetTx); err != nil {
		panic(err)
	}

	loanSetTxJSON, _ := json.MarshalIndent(flatLoanSetTx, "", "  ")
	fmt.Printf("%s\n", string(loanSetTxJSON))

	// Loan broker signs first
	fmt.Printf("\n=== Adding loan broker signature ===\n\n")
	_, _, err = loanBrokerWallet.Sign(flatLoanSetTx)
	if err != nil {
		panic(err)
	}

	fmt.Printf("TxnSignature: %s\n", flatLoanSetTx["TxnSignature"])
	fmt.Printf("SigningPubKey: %s\n\n", flatLoanSetTx["SigningPubKey"])

	loanBrokerSignedJSON, _ := json.MarshalIndent(flatLoanSetTx, "", "  ")
	fmt.Printf("Signed loanSetTx for borrower to sign over:\n%s\n", string(loanBrokerSignedJSON))

	// Borrower signs second
	fmt.Printf("\n=== Adding borrower signature ===\n\n")
	fullySignedBlob, _, err := wallet.SignLoanSetByCounterparty(borrowerWallet, &flatLoanSetTx, nil)
	if err != nil {
		panic(err)
	}

	borrowerSignatures := flatLoanSetTx["CounterpartySignature"].(map[string]any)
	fmt.Printf("Borrower TxnSignature: %s\n", borrowerSignatures["TxnSignature"])
	fmt.Printf("Borrower SigningPubKey: %s\n", borrowerSignatures["SigningPubKey"])

	fullySignedJSON, _ := json.MarshalIndent(flatLoanSetTx, "", "  ")
	fmt.Printf("\nFully signed LoanSet transaction:\n%s\n", string(fullySignedJSON))

	// Submit and wait for validation ----------------------
	fmt.Printf("\n=== Submitting signed LoanSet transaction ===\n\n")

	loanSetResponse, err := client.SubmitTxBlobAndWait(fullySignedBlob, false)
	if err != nil {
		panic(err)
	}

	if loanSetResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to create loan: %s\n", loanSetResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Loan created successfully!\n")

	// Extract loan information from the transaction result
	fmt.Printf("\n=== Loan Information ===\n\n")
	for _, node := range loanSetResponse.Meta.AffectedNodes {
		if node.CreatedNode != nil && node.CreatedNode.LedgerEntryType == "Loan" {
			loanJSON, _ := json.MarshalIndent(node.CreatedNode.NewFields, "", "  ")
			fmt.Printf("%s\n", string(loanJSON))
			break
		}
	}
}
