package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/queries/version"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
	wstypes "github.com/Peersyst/xrpl-go/xrpl/websocket/types"
)

// mptokenFilter targets an MPToken ledger entry by issuance ID and holder.
type mptokenFilter struct {
	MPTIssuanceID string `json:"mpt_issuance_id"`
	Account       string `json:"account"`
}

// ledgerEntryMPTRequest is a minimal ledger_entry request that looks up an
// MPToken entry directly. The xrpl-go SDK doesn't ship a typed wrapper for
// this lookup, so this implements the websocket Request interface inline.
type ledgerEntryMPTRequest struct {
	common.BaseRequest
	LedgerIndex common.LedgerSpecifier `json:"ledger_index,omitempty"`
	MPToken     mptokenFilter          `json:"mptoken"`
}

func (*ledgerEntryMPTRequest) Method() string  { return "ledger_entry" }
func (*ledgerEntryMPTRequest) Validate() error { return nil }
func (*ledgerEntryMPTRequest) APIVersion() int { return version.RippledAPIV2 }

func main() {
	// Connect to the network ----------------------
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.altnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)
	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	// Load setup data ----------------------
	// Check for setup data; run send-mpt-setup if missing
	if _, err := os.Stat("send-mpt-setup.json"); os.IsNotExist(err) {
		fmt.Printf("\n=== Setup data doesn't exist. Running setup script... ===\n\n")
		cmd := exec.Command("go", "run", "./send-mpt-setup")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			panic(err)
		}
	}

	// Load preconfigured sender wallet and MPT issuance ID.
	data, err := os.ReadFile("send-mpt-setup.json")
	if err != nil {
		panic(err)
	}
	var setup map[string]any
	if err := json.Unmarshal(data, &setup); err != nil {
		panic(err)
	}

	senderSeed := setup["sender"].(map[string]any)["seed"].(string)
	sender, err := wallet.FromSecret(senderSeed)
	if err != nil {
		panic(err)
	}
	mptIssuanceID := setup["mptIssuanceID"].(string)

	fmt.Printf("Sender address:   %s\n", sender.ClassicAddress)
	fmt.Printf("MPT issuance ID:  %s\n", mptIssuanceID)

	// Fund a fresh receiver wallet from the faucet.
	fmt.Printf("\nCreating and funding receiver wallet...\n")
	receiver, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}
	if err := client.FundWallet(&receiver); err != nil {
		panic(err)
	}
	fmt.Printf("Receiver address: %s\n", receiver.ClassicAddress)

	// Authorize receiver to hold the MPT ----------------------
	fmt.Printf("\n=== Authorizing receiver to hold the MPT... ===\n\n")
	authorizeTx := transaction.MPTokenAuthorize{
		BaseTx: transaction.BaseTx{
			Account: receiver.ClassicAddress,
		},
		MPTokenIssuanceID: mptIssuanceID,
	}

	flatAuthorize := authorizeTx.Flatten()
	authorizeJSON, _ := json.MarshalIndent(flatAuthorize, "", "  ")
	fmt.Printf("%s\n", string(authorizeJSON))

	authorizeResponse, err := client.SubmitTxAndWait(flatAuthorize, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &receiver,
	})
	if err != nil {
		panic(err)
	}
	if authorizeResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: MPTokenAuthorize failed: %s\n", authorizeResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Receiver authorized to hold the MPT!\n")
	fmt.Printf("Explorer link: https://testnet.xrpl.org/transactions/%s\n", authorizeResponse.Hash.String())

	// Check initial balances ----------------------
	// getMPTBalance returns the MPTAmount for the given MPT issuance held by
	// address. It looks up the holder's MPToken ledger entry directly via ledger_entry.
	// Returns "0" if the entry doesn't exist or has no MPTAmount.
	getMPTBalance := func(address types.Address, mptIssuanceID string) (string, error) {
		resp, err := client.Request(&ledgerEntryMPTRequest{
			LedgerIndex: common.Validated,
			MPToken: mptokenFilter{
				MPTIssuanceID: mptIssuanceID,
				Account:       string(address),
			},
		})
		if err != nil {
			if err.Error() == "entryNotFound" {
				return "0", nil
			}
			return "", err
		}

		node, ok := resp.Result["node"].(map[string]any)
		if !ok {
			return "0", nil
		}
		if amt, ok := node["MPTAmount"].(string); ok {
			return amt, nil
		}
		return "0", nil
	}

	fmt.Printf("\n=== Checking initial MPT balances for issuance %s... ===\n\n", mptIssuanceID)
	senderBalanceBefore, err := getMPTBalance(sender.ClassicAddress, mptIssuanceID)
	if err != nil {
		panic(err)
	}
	receiverBalanceBefore, err := getMPTBalance(receiver.ClassicAddress, mptIssuanceID)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Sender balance:   %s\n", senderBalanceBefore)
	fmt.Printf("Receiver balance: %s\n", receiverBalanceBefore)

	// Send MPT from sender to receiver ----------------------
	fmt.Printf("\n=== Sending MPT payment... ===\n\n")
	paymentTx := transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: sender.ClassicAddress,
		},
		Destination: receiver.ClassicAddress,
		Amount: &types.MPTCurrencyAmount{
			MPTIssuanceID: mptIssuanceID,
			Value:         "100",
		},
	}
	flatPayment := paymentTx.Flatten()
	paymentJSON, _ := json.MarshalIndent(flatPayment, "", "  ")
	fmt.Printf("%s\n", string(paymentJSON))

	paymentResponse, err := client.SubmitTxAndWait(flatPayment, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &sender,
	})
	if err != nil {
		panic(err)
	}
	if paymentResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Payment failed: %s\n", paymentResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Payment successful!\n")
	fmt.Printf("Explorer link: https://testnet.xrpl.org/transactions/%s\n", paymentResponse.Hash.String())

	// Verify balances ----------------------
	fmt.Printf("\n=== Checking final MPT balances for issuance %s... ===\n\n", mptIssuanceID)
	senderBalanceAfter, err := getMPTBalance(sender.ClassicAddress, mptIssuanceID)
	if err != nil {
		panic(err)
	}
	receiverBalanceAfter, err := getMPTBalance(receiver.ClassicAddress, mptIssuanceID)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Sender balance:   %s\n", senderBalanceAfter)
	fmt.Printf("Receiver balance: %s\n", receiverBalanceAfter)
}
