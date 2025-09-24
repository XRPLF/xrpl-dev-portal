package main

import (
	"fmt"
	"strconv"

	"github.com/Peersyst/xrpl-go/xrpl/currency"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/transactions"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
	wstypes "github.com/Peersyst/xrpl-go/xrpl/websocket/types"
)

func main() {
client := websocket.NewClient(
    websocket.NewClientConfig().
        WithHost("wss://s.altnet.rippletest.net:51233").
        WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
)
defer client.Disconnect()

if err := client.Connect(); err != nil {
    panic(err)
}

if !client.IsConnected() {
    fmt.Println("Failed to connect to testnet")
    return
}

fmt.Println("Connected to testnet")
fmt.Println()

// Example credentials
const WalletSeed = "sEd7zwWAu7vXMCBkkzokJHEXiKw2B2s"
w, err := wallet.FromSeed(WalletSeed, "")
if err != nil {
    panic(err)
}

// Funding the wallet
fmt.Println("Funding wallet...")
if err := client.FundWallet(&w); err != nil {
    panic(err)
}

fmt.Println("Wallet funded")
fmt.Println()

xrpAmount, err := currency.XrpToDrops("1")
if err != nil {
    panic(err)
}

xrpAmountInt, err := strconv.ParseInt(xrpAmount, 10, 64)
if err != nil {
    panic(err)
}

// Prepare a payment transaction
p := &transaction.Payment{
    BaseTx: transaction.BaseTx{
        Account: types.Address(w.GetAddress()),
    },
    Destination: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    Amount:      types.XRPCurrencyAmount(xrpAmountInt),
    DeliverMax:  types.XRPCurrencyAmount(xrpAmountInt),
}

flattenedTx := p.Flatten()

if err := client.Autofill(&flattenedTx); err != nil {
    panic(err)
}

// Sign the transaction using the wallet
txBlob, _, err := w.Sign(flattenedTx)
if err != nil {
    panic(err)
}

// Submit the transaction and wait for the result
res_blob, err := client.SubmitTxBlobAndWait(txBlob, false)
if err != nil {
    panic(err)
}

// Example with SubmitTxAndWait
flattenedTx2 := p.Flatten()
res_flat, err := client.SubmitTxAndWait(flattenedTx2, &wstypes.SubmitOptions{
    Autofill: true,
    Wallet:   &w,
})
if err != nil {
    panic(err)
}
// Wait for validation -------------------------------------------------------
// SubmitTxBlobAndWait() handles this automatically, but it can take 4-7s.

// Check transaction results -------------------------------------------------
fmt.Printf("Hash: %s\n", res_blob.Hash)
fmt.Printf("Meta: %t\n", res_blob.Meta)
res, _ := client.Request(&transactions.TxRequest{
    Transaction: res_flat.Hash.String(),
})
fmt.Printf("Result: %s\n", res.Result)
}
