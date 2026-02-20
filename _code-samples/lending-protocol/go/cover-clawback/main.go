// IMPORTANT: This example deposits and claws back first-loss capital from a
// preconfigured LoanBroker entry. The first-loss capital is an MPT
// with clawback enabled.

package main

import (
	"encoding/json"
	"fmt"
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

// mptIssuanceEntryRequest looks up an MPTIssuance ledger entry by its MPT ID.
// The library's GetLedgerEntry() method only supports lookup by ledger entry ID,
// so this custom type is used with the generic Request() method.
type mptIssuanceEntryRequest struct {
	common.BaseRequest
	MPTIssuance string                 `json:"mpt_issuance"`
	LedgerIndex common.LedgerSpecifier `json:"ledger_index,omitempty"`
}

func (*mptIssuanceEntryRequest) Method() string  { return "ledger_entry" }
func (*mptIssuanceEntryRequest) Validate() error { return nil }
func (*mptIssuanceEntryRequest) APIVersion() int { return 2 }

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
	mptIssuerWallet, err := wallet.FromSecret(setup["depositor"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}
	loanBrokerID := setup["loanBrokerId"].(string)
	mptID := setup["mptId"].(string)

	fmt.Printf("\nLoan broker address: %s\n", loanBrokerWallet.ClassicAddress)
	fmt.Printf("MPT issuer address: %s\n", mptIssuerWallet.ClassicAddress)
	fmt.Printf("LoanBrokerID: %s\n", loanBrokerID)
	fmt.Printf("MPT ID: %s\n", mptID)

	// Check cover available
	fmt.Printf("\n=== Cover Available ===\n\n")
	coverInfo, err := client.GetLedgerEntry(&ledger.EntryRequest{
		Index:       loanBrokerID,
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}

	currentCoverAvailable := "0"
	if ca, ok := coverInfo.Node["CoverAvailable"].(string); ok {
		currentCoverAvailable = ca
	}
	fmt.Printf("%s TSTUSD\n", currentCoverAvailable)

	// Prepare LoanBrokerCoverDeposit transaction
	fmt.Printf("\n=== Preparing LoanBrokerCoverDeposit transaction ===\n\n")
	coverDepositTx := transaction.LoanBrokerCoverDeposit{
		BaseTx: transaction.BaseTx{
			Account:         loanBrokerWallet.ClassicAddress,
			TransactionType: transaction.LoanBrokerCoverDepositTx,
		},
		LoanBrokerID: loanBrokerID,
		Amount: types.MPTCurrencyAmount{
			MPTIssuanceID: mptID,
			Value:         "1000",
		},
	}

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

	// Extract updated cover available after deposit
	fmt.Printf("\n=== Cover Available After Deposit ===\n\n")
	for _, node := range depositResponse.Meta.AffectedNodes {
		if node.ModifiedNode != nil && node.ModifiedNode.LedgerEntryType == "LoanBroker" {
			currentCoverAvailable = node.ModifiedNode.FinalFields["CoverAvailable"].(string)
			break
		}
	}
	fmt.Printf("%s TSTUSD\n", currentCoverAvailable)

	// Verify issuer of cover asset matches.
	// Only the issuer of the asset can submit clawback transactions.
	// The asset must also have clawback enabled.
	fmt.Printf("\n=== Verifying Asset Issuer ===\n\n")
	assetIssuerInfo, err := client.Request(&mptIssuanceEntryRequest{
		MPTIssuance: mptID,
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}

	issuer := assetIssuerInfo.Result["node"].(map[string]any)["Issuer"].(string)
	if issuer != string(mptIssuerWallet.ClassicAddress) {
		fmt.Printf("Error: %s does not match account (%s) attempting clawback!\n", issuer, mptIssuerWallet.ClassicAddress)
		os.Exit(1)
	}
	fmt.Printf("MPT issuer account verified: %s. Proceeding to clawback.\n", mptIssuerWallet.ClassicAddress)

	// Prepare LoanBrokerCoverClawback transaction
	fmt.Printf("\n=== Preparing LoanBrokerCoverClawback transaction ===\n\n")
	lbID := types.LoanBrokerID(loanBrokerID)
	coverClawbackTx := transaction.LoanBrokerCoverClawback{
		BaseTx: transaction.BaseTx{
			Account:         mptIssuerWallet.ClassicAddress,
			TransactionType: transaction.LoanBrokerCoverClawbackTx,
		},
		LoanBrokerID: &lbID,
		Amount: types.MPTCurrencyAmount{
			MPTIssuanceID: mptID,
			Value:         currentCoverAvailable,
		},
	}

	flatCoverClawbackTx := coverClawbackTx.Flatten()
	coverClawbackTxJSON, _ := json.MarshalIndent(flatCoverClawbackTx, "", "  ")
	fmt.Printf("%s\n", string(coverClawbackTxJSON))

	// Sign, submit, and wait for clawback validation
	fmt.Printf("\n=== Submitting LoanBrokerCoverClawback transaction ===\n\n")
	clawbackResponse, err := client.SubmitTxAndWait(flatCoverClawbackTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &mptIssuerWallet,
	})
	if err != nil {
		panic(err)
	}

	if clawbackResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to clawback cover: %s\n", clawbackResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Successfully clawed back %s TSTUSD!\n", currentCoverAvailable)

	// Extract final cover available
	fmt.Printf("\n=== Final Cover Available After Clawback ===\n\n")
	for _, node := range clawbackResponse.Meta.AffectedNodes {
		if node.ModifiedNode != nil && node.ModifiedNode.LedgerEntryType == "LoanBroker" {
			finalCover := "0"
			if ca, ok := node.ModifiedNode.FinalFields["CoverAvailable"].(string); ok {
				finalCover = ca
			}
			fmt.Printf("%s TSTUSD\n", finalCover)
			break
		}
	}
}
