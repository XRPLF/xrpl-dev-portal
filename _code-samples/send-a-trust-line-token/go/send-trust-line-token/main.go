package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"os/exec"

	ledger "github.com/Peersyst/xrpl-go/xrpl/ledger-entry-types"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	accounttypes "github.com/Peersyst/xrpl-go/xrpl/queries/account/types"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
	wstypes "github.com/Peersyst/xrpl-go/xrpl/websocket/types"
)

// decimal parses a token value string into a big.Float. Token values can have
// up to 16 significant digits, so avoid float64 for comparisons.
func decimal(value string) *big.Float {
	f, ok := new(big.Float).SetString(value)
	if !ok {
		panic("invalid decimal value: " + value)
	}
	return f
}

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

	// Load the preconfigured sender account.
	data, err := os.ReadFile("send-trust-line-token-setup.json")
	if err != nil {
		panic(err)
	}
	var setup map[string]any
	if err := json.Unmarshal(data, &setup); err != nil {
		panic(err)
	}
	sender, err := wallet.FromSecret(setup["sender"].(map[string]any)["seed"].(string))
	if err != nil {
		panic(err)
	}

	// The token to send and who to send it to. TST is a test token on Testnet,
	// and the receiver is a well-known account that already holds a TST trust
	// line. You can replace these values with your own.
	const (
		issuerAddress   = "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
		currencyCode    = "TST"
		receiverAddress = "rG6ZCtKCURU58DP2iiff4qziApBGSuvPqE"
		sendQuantity    = "2"

		// The highest transfer fee this command is willing to pay, as a percentage
		// of the amount sent. Protects against approving a large fee by accident.
		maxTransferFeePercent = 10

		// TransferRate is in billionths; this value (or unset) means no fee.
		noTransferFee = 1000000000
	)

	fmt.Printf("Issuer address:   %s\n", issuerAddress)
	fmt.Printf("Sender address:   %s\n", sender.ClassicAddress)
	fmt.Printf("Receiver address: %s\n", receiverAddress)

	// getTrustLine returns the trust line between `addr` and `peer` for the
	// given currency, or nil if no such trust line exists.
	getTrustLine := func(addr, peer types.Address, currency string) *accounttypes.TrustLine {
		req := &account.LinesRequest{
			Account:     addr,
			Peer:        peer,
			LedgerIndex: common.Validated,
		}
		for {
			resp, err := client.GetAccountLines(req)
			if err != nil {
				panic(err)
			}
			for _, line := range resp.Lines {
				if line.Currency == currency {
					return &line
				}
			}
			if resp.Marker == nil {
				return nil
			}
			req.Marker = resp.Marker
		}
	}

	// Check sender balance ----------------------
	// Confirm the sender holds enough of the token to make the payment, including
	// the issuer's transfer fee, which the sender pays on top of the amount sent.
	fmt.Printf("\n=== Checking sender's %s balance... ===\n\n", currencyCode)
	issuerInfo, err := client.GetAccountInfo(&account.InfoRequest{
		Account:     issuerAddress,
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}
	issuerFlags := issuerInfo.AccountData.Flags

	// If the issuer charges a transfer fee, the sender pays more than the
	// receiver gets. Work out the SendMax needed and refuse unreasonable fees.
	// TransferRate is a multiplier in billionths, e.g. 1005000000 = 1.005 = 0.5% fee.
	transferRate := issuerInfo.AccountData.TransferRate
	if transferRate == 0 {
		transferRate = noTransferFee
	}
	transferFeePercent := float64(transferRate-noTransferFee) / 10000000
	if transferFeePercent > maxTransferFeePercent {
		fmt.Printf("Error: Transfer fee of %g%% exceeds the %d%% limit.\n", transferFeePercent, maxTransferFeePercent)
		os.Exit(1)
	}
	sendMax := ""
	if transferFeePercent > 0 {
		rate := new(big.Float).Quo(decimal(fmt.Sprint(transferRate)), decimal(fmt.Sprint(noTransferFee)))
		sendMax = new(big.Float).Mul(decimal(sendQuantity), rate).Text('g', 16)
		fmt.Printf("✓ Transfer fee is %g%%; sender will pay up to %s %s\n", transferFeePercent, sendMax, currencyCode)
	} else {
		fmt.Println("✓ No transfer fee")
	}
	needed := sendQuantity
	if sendMax != "" {
		needed = sendMax
	}

	senderLine := getTrustLine(sender.ClassicAddress, issuerAddress, currencyCode)
	if senderLine == nil {
		fmt.Printf("Error: Sender has no %s trust line with the issuer.\n", currencyCode)
		os.Exit(1)
	}
	fmt.Printf("Sender's balance: %s\n", senderLine.Balance)
	if decimal(senderLine.Balance).Cmp(decimal(needed)) < 0 {
		fmt.Printf("Error: Sender's balance is less than the %s %s to send.\n", needed, currencyCode)
		os.Exit(1)
	}

	// Check receiver ----------------------
	// Confirm the receiver can accept the payment before sending it.
	fmt.Printf("\n=== Checking receiver can receive %s... ===\n\n", currencyCode)
	receiverLine := getTrustLine(receiverAddress, issuerAddress, currencyCode)

	// 1. The receiver must have a trust line to the issuer for this currency.
	if receiverLine == nil {
		fmt.Printf("Error: Receiver has no %s trust line with the issuer.\n", currencyCode)
		os.Exit(1)
	}
	fmt.Println("✓ Receiver has a trust line to the issuer")

	// 2. The issuer must allow rippling on at least one of the two trust lines, since
	//    a payment between holders moves through the issuer. Default Ripple on the
	//    issuer is the usual way to allow this, but check the lines themselves.
	if senderLine.NoRipplePeer && receiverLine.NoRipplePeer {
		fmt.Println("Error: The issuer has disabled rippling on both the sender and receiver trust lines.")
		os.Exit(1)
	}
	defaultRipple := issuerFlags&ledger.LsfDefaultRipple != 0
	fmt.Printf("✓ Rippling is allowed (issuer Default Ripple: %t)\n", defaultRipple)

	// 3. The receiver's limit must cover their current balance plus the payment.
	newBalance := new(big.Float).Add(decimal(receiverLine.Balance), decimal(sendQuantity))
	if newBalance.Cmp(decimal(receiverLine.Limit)) > 0 {
		fmt.Printf("Error: Payment would exceed the receiver's limit of %s %s.\n", receiverLine.Limit, currencyCode)
		os.Exit(1)
	}
	fmt.Println("✓ Receiver's limit covers the payment")

	// 4. If the issuer requires authorization, the receiver's line must be authorized.
	requireAuth := issuerFlags&ledger.LsfRequireAuth != 0
	if requireAuth && !receiverLine.PeerAuthorized {
		fmt.Println("Error: The issuer requires authorization and has not authorized the receiver.")
		os.Exit(1)
	}
	fmt.Printf("✓ Authorization OK (issuer Require Auth: %t)\n", requireAuth)

	fmt.Println("\nBalances before payment:")
	fmt.Printf("  Sender:   %s %s\n", senderLine.Balance, currencyCode)
	fmt.Printf("  Receiver: %s %s\n", receiverLine.Balance, currencyCode)

	// Send payment ----------------------
	// The sender pays the receiver with the token. Amount is what the receiver
	// gets; SendMax (if set) is the most the sender is willing to spend.
	fmt.Printf("\n=== Sending %s %s to receiver... ===\n\n", sendQuantity, currencyCode)
	paymentTx := transaction.Payment{
		BaseTx:      transaction.BaseTx{Account: sender.ClassicAddress},
		Destination: receiverAddress,
		Amount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   issuerAddress,
			Value:    sendQuantity,
		},
	}
	if sendMax != "" {
		paymentTx.SendMax = types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   issuerAddress,
			Value:    sendMax,
		}
	}

	// Flatten() converts the struct to a map and adds the TransactionType field
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
	fmt.Println("Payment successful!")
	fmt.Printf("Explorer link: https://testnet.xrpl.org/transactions/%s\n", paymentResponse.Hash)

	// Verify balances ----------------------
	// Check both balances again to confirm the transfer.
	fmt.Printf("\n=== Checking final %s balances... ===\n\n", currencyCode)

	// The metadata's delivered_amount is the amount the receiver actually got.
	// Always read this field rather than the transaction's Amount, because a
	// partial payment can succeed while delivering less than Amount.
	deliveredAmount := paymentResponse.Meta.DeliveredAmount.(map[string]any)
	fmt.Printf("  Delivered amount: %s %s\n", deliveredAmount["value"], deliveredAmount["currency"])

	senderLineAfter := getTrustLine(sender.ClassicAddress, issuerAddress, currencyCode)
	receiverLineAfter := getTrustLine(receiverAddress, issuerAddress, currencyCode)
	fmt.Printf("  Sender:   %s %s\n", senderLineAfter.Balance, currencyCode)
	fmt.Printf("  Receiver: %s %s\n", receiverLineAfter.Balance, currencyCode)
}
