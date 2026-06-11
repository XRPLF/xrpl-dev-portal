package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"

	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
	wstypes "github.com/Peersyst/xrpl-go/xrpl/websocket/types"
)

const currencyCode = "FOO"

func main() {
	// Connect to the network ----------------------
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.altnet.rippletest.net:51233"),
	)
	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	// This step checks for the necessary setup data to run the tutorial.
	// If missing, send-trust-line-token-setup will generate it.
	if _, err := os.Stat("send-trust-line-token-setup.json"); os.IsNotExist(err) {
		fmt.Printf("\n=== Tutorial setup data doesn't exist. Running setup script... ===\n\n")
		cmd := exec.Command("go", "run", "./send-trust-line-token-setup")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			panic(err)
		}
	}

	// Load preconfigured issuer, sender, and receiver accounts.
	data, err := os.ReadFile("send-trust-line-token-setup.json")
	if err != nil {
		panic(err)
	}
	var setup map[string]any
	if err := json.Unmarshal(data, &setup); err != nil {
		panic(err)
	}
	issuer, err := wallet.FromSecret(setup["issuer"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}
	sender, err := wallet.FromSecret(setup["sender"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}
	receiver, err := wallet.FromSecret(setup["receiver"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}

	fmt.Printf("Issuer address:   %s\n", issuer.ClassicAddress)
	fmt.Printf("Sender address:   %s\n", sender.ClassicAddress)
	fmt.Printf("Receiver address: %s\n", receiver.ClassicAddress)

	// Create trust line ----------------------
	// The receiver opts in to the token by creating a trust line to the issuer.
	// The LimitAmount sets the maximum amount of the token the receiver will hold.
	fmt.Printf("\n=== Creating trust line from receiver to issuer... ===\n\n")
	trustSetTx := transaction.TrustSet{
		BaseTx: transaction.BaseTx{
			Account: receiver.ClassicAddress,
		},
		LimitAmount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   issuer.ClassicAddress,
			Value:    "1000000000",
		},
	}

	flatTrustSet := trustSetTx.Flatten()
	trustSetJSON, _ := json.MarshalIndent(flatTrustSet, "", "  ")
	fmt.Printf("%s\n", string(trustSetJSON))

	trustSetResponse, err := client.SubmitTxAndWait(flatTrustSet, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &receiver,
	})
	if err != nil {
		panic(err)
	}
	if trustSetResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Error: Unable to create trust line: %s\n", trustSetResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Trust line created from receiver to issuer!\n")
	fmt.Printf("Explorer link: https://testnet.xrpl.org/transactions/%s\n", trustSetResponse.Hash.String())

	// Check initial balances ----------------------
	// getTrustLineBalance returns the trust line balance between `addr` and
	// `peer` for the given currency.
	getTrustLineBalance := func(addr, currency, peer types.Address) (string, error) {
		resp, err := client.Request(&account.LinesRequest{
			Account:     addr,
			Peer:        peer,
			LedgerIndex: common.Validated,
		})
		if err != nil {
			return "", err
		}
		lines, ok := resp.Result["lines"].([]any)
		if !ok {
			return "0", nil
		}
		for _, l := range lines {
			line, ok := l.(map[string]any)
			if !ok {
				continue
			}
			if line["currency"] == string(currency) {
				if bal, ok := line["balance"].(string); ok {
					return bal, nil
				}
			}
		}
		return "0", nil
	}

	fmt.Printf("\n=== Checking initial %s balances... ===\n\n", currencyCode)
	senderView, err := getTrustLineBalance(sender.ClassicAddress, currencyCode, issuer.ClassicAddress)
	if err != nil {
		panic(err)
	}
	receiverView, err := getTrustLineBalance(receiver.ClassicAddress, currencyCode, issuer.ClassicAddress)
	if err != nil {
		panic(err)
	}
	issuerToSender, err := getTrustLineBalance(issuer.ClassicAddress, currencyCode, sender.ClassicAddress)
	if err != nil {
		panic(err)
	}
	issuerToReceiver, err := getTrustLineBalance(issuer.ClassicAddress, currencyCode, receiver.ClassicAddress)
	if err != nil {
		panic(err)
	}
	fmt.Println("Holders' perspective:")
	fmt.Printf("  Sender's balance:   %s\n", senderView)
	fmt.Printf("  Receiver's balance: %s\n", receiverView)
	fmt.Println("Issuer's perspective:")
	fmt.Printf("  Owed to sender:   %s\n", issuerToSender)
	fmt.Printf("  Owed to receiver: %s\n", issuerToReceiver)

	// Send issued token ----------------------
	// The sender pays the receiver with the issued currency.
	const sendQuantity = "100"
	fmt.Printf("\n=== Sending %s payment... ===\n\n", currencyCode)
	paymentTx := transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: sender.ClassicAddress,
		},
		Destination: receiver.ClassicAddress,
		Amount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   issuer.ClassicAddress,
			Value:    sendQuantity,
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
		fmt.Printf("Error: Unable to send token: %s\n", paymentResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Payment successful!\n")
	fmt.Printf("Explorer link: https://testnet.xrpl.org/transactions/%s\n", paymentResponse.Hash.String())

	// Verify balances ----------------------
	// Check account balances after the payment.
	fmt.Printf("\n=== Checking final %s balances... ===\n\n", currencyCode)
	senderView, err = getTrustLineBalance(sender.ClassicAddress, currencyCode, issuer.ClassicAddress)
	if err != nil {
		panic(err)
	}
	receiverView, err = getTrustLineBalance(receiver.ClassicAddress, currencyCode, issuer.ClassicAddress)
	if err != nil {
		panic(err)
	}
	issuerToSender, err = getTrustLineBalance(issuer.ClassicAddress, currencyCode, sender.ClassicAddress)
	if err != nil {
		panic(err)
	}
	issuerToReceiver, err = getTrustLineBalance(issuer.ClassicAddress, currencyCode, receiver.ClassicAddress)
	if err != nil {
		panic(err)
	}
	fmt.Println("Holders' perspective:")
	fmt.Printf("  Sender's balance:   %s\n", senderView)
	fmt.Printf("  Receiver's balance: %s\n", receiverView)
	fmt.Println("Issuer's perspective:")
	fmt.Printf("  Owed to sender:   %s\n", issuerToSender)
	fmt.Printf("  Owed to receiver: %s\n", issuerToReceiver)
}
