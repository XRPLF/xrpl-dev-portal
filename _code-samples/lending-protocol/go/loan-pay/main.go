// IMPORTANT: This example pays off an existing loan and then deletes it.

package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"os/exec"

	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/queries/ledger"
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

	// Load preconfigured accounts and LoanID
	data, err := os.ReadFile("lending-setup.json")
	if err != nil {
		panic(err)
	}
	var setup map[string]any
	if err := json.Unmarshal(data, &setup); err != nil {
		panic(err)
	}

	// You can replace these values with your own
	borrowerWallet, err := wallet.FromSecret(setup["borrower"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}
	loanID := setup["loanID2"].(string)
	mptID := setup["mptID"].(string)

	fmt.Printf("\nBorrower address: %s\n", borrowerWallet.ClassicAddress)
	fmt.Printf("LoanID: %s\n", loanID)
	fmt.Printf("MPT ID: %s\n", mptID)

	// Check initial loan status ----------------------
	fmt.Printf("\n=== Loan Status ===\n\n")
	loanStatus, err := client.GetLedgerEntry(&ledger.EntryRequest{
		Index:       loanID,
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}

	totalValueOutstanding := loanStatus.Node["TotalValueOutstanding"].(string)
	loanServiceFee := loanStatus.Node["LoanServiceFee"].(string)

	outstanding, _ := new(big.Int).SetString(totalValueOutstanding, 10)
	serviceFee, _ := new(big.Int).SetString(loanServiceFee, 10)
	totalPayment := new(big.Int).Add(outstanding, serviceFee).String()

	fmt.Printf("Amount Owed: %s TSTUSD\n", totalValueOutstanding)
	fmt.Printf("Loan Service Fee: %s TSTUSD\n", loanServiceFee)
	fmt.Printf("Total Payment Due (including fees): %s TSTUSD\n", totalPayment)

	// Prepare LoanPay transaction ----------------------
	fmt.Printf("\n=== Preparing LoanPay transaction ===\n\n")
	loanPayTx := transaction.LoanPay{
		BaseTx: transaction.BaseTx{
			Account: borrowerWallet.ClassicAddress,
		},
		LoanID: loanID,
		Amount: types.MPTCurrencyAmount{
			MPTIssuanceID: mptID,
			Value:         totalPayment,
		},
	}

	// Flatten() converts the struct to a map and adds the TransactionType field
	flatLoanPayTx := loanPayTx.Flatten()
	loanPayTxJSON, _ := json.MarshalIndent(flatLoanPayTx, "", "  ")
	fmt.Printf("%s\n", string(loanPayTxJSON))

	// Sign, submit, and wait for payment validation ----------------------
	fmt.Printf("\n=== Submitting LoanPay transaction ===\n\n")
	payResponse, err := client.SubmitTxAndWait(flatLoanPayTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &borrowerWallet,
	})
	if err != nil {
		panic(err)
	}

	if payResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to pay loan: %s\n", payResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Loan paid successfully!\n")

	// Extract updated loan info from transaction results ----------------------
	fmt.Printf("\n=== Loan Status After Payment ===\n\n")
	for _, node := range payResponse.Meta.AffectedNodes {
		if node.ModifiedNode != nil && node.ModifiedNode.LedgerEntryType == "Loan" {
			if balance, ok := node.ModifiedNode.FinalFields["TotalValueOutstanding"].(string); ok {
				fmt.Printf("Outstanding Loan Balance: %s TSTUSD\n", balance)
			} else {
				fmt.Printf("Outstanding Loan Balance: Loan fully paid off!\n")
			}
			break
		}
	}

	// Prepare LoanDelete transaction ----------------------
	// Either the loan broker or borrower can submit this transaction.
	fmt.Printf("\n=== Preparing LoanDelete transaction ===\n\n")
	loanDeleteTx := transaction.LoanDelete{
		BaseTx: transaction.BaseTx{
			Account: borrowerWallet.ClassicAddress,
		},
		LoanID: loanID,
	}

	flatLoanDeleteTx := loanDeleteTx.Flatten()
	loanDeleteTxJSON, _ := json.MarshalIndent(flatLoanDeleteTx, "", "  ")
	fmt.Printf("%s\n", string(loanDeleteTxJSON))

	// Sign, submit, and wait for deletion validation ----------------------
	fmt.Printf("\n=== Submitting LoanDelete transaction ===\n\n")
	deleteResponse, err := client.SubmitTxAndWait(flatLoanDeleteTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &borrowerWallet,
	})
	if err != nil {
		panic(err)
	}

	if deleteResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to delete loan: %s\n", deleteResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Loan deleted successfully!\n")

	// Verify loan deletion ----------------------
	fmt.Printf("\n=== Verifying Loan Deletion ===\n\n")
	_, err = client.GetLedgerEntry(&ledger.EntryRequest{
		Index:       loanID,
		LedgerIndex: common.Validated,
	})
	if err != nil {
		if err.Error() == "entryNotFound" {
			fmt.Printf("Loan has been successfully removed from the XRP Ledger!\n")
		} else {
			panic(err)
		}
	} else {
		fmt.Printf("Warning: Loan still exists in the ledger.\n")
	}
}
