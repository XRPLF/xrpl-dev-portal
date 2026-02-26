// IMPORTANT: This example impairs an existing loan, which has a 60 second grace period.
// After the 60 seconds pass, this example defaults the loan.

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"time"

	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/queries/ledger"
	xrpltime "github.com/Peersyst/xrpl-go/xrpl/time"
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
	loanBrokerWallet, err := wallet.FromSecret(setup["loanBroker"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}
	loanID := setup["loanID1"].(string)

	fmt.Printf("\nLoan broker address: %s\n", loanBrokerWallet.ClassicAddress)
	fmt.Printf("LoanID: %s\n", loanID)

	// Check loan status before impairment ----------------------
	fmt.Printf("\n=== Loan Status ===\n\n")
	loanStatus, err := client.GetLedgerEntry(&ledger.EntryRequest{
		Index:       loanID,
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("Total Amount Owed: %s TSTUSD.\n", loanStatus.Node["TotalValueOutstanding"])

	// Convert Ripple Epoch timestamp to local date and time
	nextPaymentDueDate := int64(loanStatus.Node["NextPaymentDueDate"].(float64))
	paymentDue := time.UnixMilli(xrpltime.RippleTimeToUnixTime(nextPaymentDueDate))
	fmt.Printf("Payment Due Date: %s\n", paymentDue.Local().Format(time.DateTime))

	// Prepare LoanManage transaction to impair the loan ----------------------
	fmt.Printf("\n=== Preparing LoanManage transaction to impair loan ===\n\n")
	loanManageImpair := transaction.LoanManage{
		BaseTx: transaction.BaseTx{
			Account: loanBrokerWallet.ClassicAddress,
		},
		LoanID: loanID,
	}
	loanManageImpair.SetLoanImpairFlag()

	// Flatten() converts the struct to a map and adds the TransactionType field
	flatLoanManageImpair := loanManageImpair.Flatten()
	loanManageImpairJSON, _ := json.MarshalIndent(flatLoanManageImpair, "", "  ")
	fmt.Printf("%s\n", string(loanManageImpairJSON))

	// Sign, submit, and wait for impairment validation ----------------------
	fmt.Printf("\n=== Submitting LoanManage impairment transaction ===\n\n")
	impairResponse, err := client.SubmitTxAndWait(flatLoanManageImpair, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &loanBrokerWallet,
	})
	if err != nil {
		panic(err)
	}

	if impairResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to impair loan: %s\n", impairResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Loan impaired successfully!\n")

	// Extract loan impairment info from transaction results ----------------------
	var loanNode map[string]any
	for _, node := range impairResponse.Meta.AffectedNodes {
		if node.ModifiedNode != nil && node.ModifiedNode.LedgerEntryType == "Loan" {
			loanNode = node.ModifiedNode.FinalFields
			break
		}
	}

	// Check grace period and next payment due date
	gracePeriod := int64(loanNode["GracePeriod"].(float64))
	nextPaymentDueDate = int64(loanNode["NextPaymentDueDate"].(float64))
	defaultTime := nextPaymentDueDate + gracePeriod
	paymentDue = time.UnixMilli(xrpltime.RippleTimeToUnixTime(nextPaymentDueDate))

	fmt.Printf("New Payment Due Date: %s\n", paymentDue.Local().Format(time.DateTime))
	fmt.Printf("Grace Period: %d seconds\n", gracePeriod)

	// Convert current time to Ripple Epoch timestamp
	currentTime := xrpltime.UnixTimeToRippleTime(time.Now().Unix())
	// Add a small buffer (5 seconds) to account for ledger close time
	secondsUntilDefault := defaultTime - currentTime + 5

	// Countdown until loan can be defaulted ----------------------
	fmt.Printf("\n=== Countdown until loan can be defaulted ===\n\n")
	for secondsUntilDefault >= 0 {
		fmt.Printf("\r%d seconds...", secondsUntilDefault)
		time.Sleep(time.Second)
		secondsUntilDefault--
	}
	fmt.Print("\rGrace period expired. Loan can now be defaulted.\n")

	// Prepare LoanManage transaction to default the loan ----------------------
	fmt.Printf("\n=== Preparing LoanManage transaction to default loan ===\n\n")
	loanManageDefault := transaction.LoanManage{
		BaseTx: transaction.BaseTx{
			Account: loanBrokerWallet.ClassicAddress,
		},
		LoanID: loanID,
	}
	loanManageDefault.SetLoanDefaultFlag()

	flatLoanManageDefault := loanManageDefault.Flatten()
	loanManageDefaultJSON, _ := json.MarshalIndent(flatLoanManageDefault, "", "  ")
	fmt.Printf("%s\n", string(loanManageDefaultJSON))

	// Sign, submit, and wait for default validation ----------------------
	fmt.Printf("\n=== Submitting LoanManage default transaction ===\n\n")
	defaultResponse, err := client.SubmitTxAndWait(flatLoanManageDefault, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &loanBrokerWallet,
	})
	if err != nil {
		panic(err)
	}

	if defaultResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to default loan: %s\n", defaultResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Loan defaulted successfully!\n")

	// Verify loan default status from transaction results ----------------------
	fmt.Printf("\n=== Checking final loan status ===\n\n")
	for _, node := range defaultResponse.Meta.AffectedNodes {
		if node.ModifiedNode != nil && node.ModifiedNode.LedgerEntryType == "Loan" {
			loanNode = node.ModifiedNode.FinalFields
			break
		}
	}
	loanFlags := uint32(loanNode["Flags"].(float64))

	// Check which loan flags are set:
	// 0x00010000 = tfLoanDefault, 0x00020000 = tfLoanImpair
	// Update to use Contain() flags utility
	activeFlags := []string{}
	if types.IsFlagEnabled(loanFlags, 0x00010000) {
		activeFlags = append(activeFlags, "tfLoanDefault")
	}
	if types.IsFlagEnabled(loanFlags, 0x00020000) {
		activeFlags = append(activeFlags, "tfLoanImpair")
	}
	fmt.Printf("Final loan flags: %v\n", activeFlags)
}
