package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	transactions "github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

const (
	currencyCode = "FOO"
)

func main() {
	//
	// Configure client
	//
	fmt.Println("Setting up client...")
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.altnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)
	defer client.Disconnect()
	fmt.Println("Client configured!")
	fmt.Println()

	fmt.Println("Connecting to server...")
	if err := client.Connect(); err != nil {
		panic(err)
	}

	fmt.Println("Connection: ", client.IsConnected())
	fmt.Println()

	//
	// Configure wallets
	//
	fmt.Println("Setting up wallets...")
	coldWallet, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}
	err = client.FundWallet(&coldWallet)
	if err != nil {
		panic(err)
	}
	fmt.Println("Cold wallet funded!")

	hotWallet, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}
	err = client.FundWallet(&hotWallet)
	if err != nil {
		panic(err)
	}
	fmt.Println("Hot wallet funded!")

	customerOneWallet, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}
	err = client.FundWallet(&customerOneWallet)
	if err != nil {
		panic(err)
	}
	fmt.Println("Customer one wallet funded!")
	fmt.Println()

	fmt.Println("Wallets setup complete!")
	fmt.Println("Cold wallet:", coldWallet.ClassicAddress)
	fmt.Println("Hot wallet:", hotWallet.ClassicAddress)
	fmt.Println("Customer one wallet:", customerOneWallet.ClassicAddress)
	fmt.Println()

	//
	// Configure cold address settings
	//
	fmt.Println("Configuring cold address settings...")
	coldWalletAccountSet := &transactions.AccountSet{
		BaseTx: transactions.BaseTx{
			Account: types.Address(coldWallet.ClassicAddress),
		},
		TickSize:     types.TickSize(5),
		TransferRate: types.TransferRate(0),
		Domain:       types.Domain("6578616D706C652E636F6D"), // example.com
	}

	coldWalletAccountSet.SetAsfDefaultRipple()
	coldWalletAccountSet.SetDisallowXRP()

	coldWalletAccountSet.SetRequireDestTag()

	flattenedTx := coldWalletAccountSet.Flatten()

	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err := coldWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err := client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Cold address settings failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Cold address settings configured!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	//
	// Configure hot address settings
	//
	fmt.Println("Configuring hot address settings...")
	hotWalletAccountSet := &transactions.AccountSet{
		BaseTx: transactions.BaseTx{
			Account: types.Address(hotWallet.ClassicAddress),
		},
		Domain: types.Domain("6578616D706C652E636F6D"), // example.com
	}

	hotWalletAccountSet.SetAsfRequireAuth()
	hotWalletAccountSet.SetDisallowXRP()
	hotWalletAccountSet.SetRequireDestTag()

	flattenedTx = hotWalletAccountSet.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = hotWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Hot address settings failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Hot address settings configured!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	//
	// Create trust line from hot to cold address
	//
	fmt.Println("Creating trust line from hot to cold address...")
	hotColdTrustSet := &transactions.TrustSet{
		BaseTx: transactions.BaseTx{
			Account: types.Address(hotWallet.ClassicAddress),
		},
		LimitAmount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   types.Address(coldWallet.ClassicAddress),
			Value:    "100000000000000",
		},
	}

	flattenedTx = hotColdTrustSet.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = hotWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Hot-to-cold trust line failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Trust line from hot to cold address created!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	//
	// Create trust line from costumer one to cold address
	//
	fmt.Println("Creating trust line from customer one to cold address...")
	customerOneColdTrustSet := &transactions.TrustSet{
		BaseTx: transactions.BaseTx{
			Account: types.Address(customerOneWallet.ClassicAddress),
		},
		LimitAmount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   types.Address(coldWallet.ClassicAddress),
			Value:    "100000000000000",
		},
	}

	flattenedTx = customerOneColdTrustSet.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = customerOneWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Customer-to-cold trust line failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Trust line from customer one to cold address created!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	//
	// Send tokens from cold wallet to hot wallet
	//
	fmt.Println("Sending tokens from cold wallet to hot wallet...")
	coldToHotPayment := &transactions.Payment{
		BaseTx: transactions.BaseTx{
			Account: types.Address(coldWallet.ClassicAddress),
		},
		Amount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   types.Address(coldWallet.ClassicAddress),
			Value:    "3800",
		},
		Destination:    types.Address(hotWallet.ClassicAddress),
		DestinationTag: types.DestinationTag(1),
	}

	flattenedTx = coldToHotPayment.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = coldWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Cold-to-hot payment failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Tokens sent from cold wallet to hot wallet!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	//
	// Send tokens from hot wallet to customer one
	//
	fmt.Println("Sending tokens from cold wallet to customer one...")
	coldToCustomerOnePayment := &transactions.Payment{
		BaseTx: transactions.BaseTx{
			Account: types.Address(coldWallet.ClassicAddress),
		},
		Amount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   types.Address(coldWallet.ClassicAddress),
			Value:    "100",
		},
		Destination: types.Address(customerOneWallet.ClassicAddress),
	}

	flattenedTx = coldToCustomerOnePayment.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = coldWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Cold-to-customer payment failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Tokens sent from cold wallet to customer one!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	//
	// Freeze cold wallet
	//
	fmt.Println("Freezing cold wallet...")
	freezeColdWallet := &transactions.AccountSet{
		BaseTx: transactions.BaseTx{
			Account: types.Address(coldWallet.ClassicAddress),
		},
	}

	freezeColdWallet.SetAsfGlobalFreeze()

	flattenedTx = freezeColdWallet.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = coldWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Cold wallet freeze failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Cold wallet frozen!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	//
	// Try to send tokens from hot wallet to customer one
	//
	fmt.Println("Trying to send tokens from hot wallet to customer one...")
	hotToCustomerOnePayment := &transactions.Payment{
		BaseTx: transactions.BaseTx{
			Account: types.Address(hotWallet.ClassicAddress),
		},
		Amount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   types.Address(coldWallet.ClassicAddress),
			Value:    "100",
		},
		Destination: types.Address(customerOneWallet.ClassicAddress),
	}

	flattenedTx = hotToCustomerOnePayment.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = hotWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}
	// A validated rejection is a transaction result, not a Go error.
	if response.Meta.TransactionResult != "tecPATH_DRY" {
		panic(fmt.Sprintf("Expected frozen payment to return tecPATH_DRY, got %s", response.Meta.TransactionResult))
	}

	fmt.Println("Tokens not sent from hot wallet to customer one!")
	fmt.Printf("Result: %s\n", response.Meta.TransactionResult)
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	// //
	// // Unfreeze cold wallet
	// //
	fmt.Println("Unfreezing cold wallet...")
	unfreezeColdWallet := &transactions.AccountSet{
		BaseTx: transactions.BaseTx{
			Account: types.Address(coldWallet.ClassicAddress),
		},
	}

	unfreezeColdWallet.ClearAsfGlobalFreeze()

	flattenedTx = unfreezeColdWallet.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = coldWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Cold wallet unfreeze failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Cold wallet unfrozen!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()

	//
	// Try to send tokens from hot wallet to customer one
	//
	fmt.Println("Trying to send tokens from hot wallet to customer one...")
	hotToCustomerOnePayment = &transactions.Payment{
		BaseTx: transactions.BaseTx{
			Account: types.Address(hotWallet.ClassicAddress),
		},
		Amount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   types.Address(coldWallet.ClassicAddress),
			Value:    "100",
		},
		Destination: types.Address(customerOneWallet.ClassicAddress),
	}

	flattenedTx = hotToCustomerOnePayment.Flatten()
	err = client.Autofill(&flattenedTx)
	if err != nil {
		panic(err)
	}

	txBlob, _, err = hotWallet.Sign(flattenedTx)
	if err != nil {
		panic(err)
	}

	response, err = client.SubmitTxBlobAndWait(txBlob, false)
	if err != nil {
		panic(err)
	}

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Hot-to-customer payment failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Tokens sent from hot wallet to customer one!")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Println()
}
