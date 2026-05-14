package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {
    fmt.Println("Connecting to testnet...")
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

    w1, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    w2, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    regularKeyWallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    fmt.Println("Funding wallets...")
    if err := client.FundWallet(&w1); err != nil {
        panic(err)
    }

    fmt.Println("Wallet 1 funded")

    if err := client.FundWallet(&w2); err != nil {
        panic(err)
    }

    fmt.Println("Wallet 2 funded")

    if err := client.FundWallet(&regularKeyWallet); err != nil {
        panic(err)
    }

    fmt.Println("Regular key wallet funded")
    fmt.Println()

    fmt.Println("Setting regular key...")
    rk := &transaction.SetRegularKey{
        BaseTx: transaction.BaseTx{
            Account: w1.GetAddress(),
        },
        RegularKey: regularKeyWallet.GetAddress(),
    }

    flatRk := rk.Flatten()

    err = client.Autofill(&flatRk)
    if err != nil {
        panic(err)
    }

    blob, _, err := w1.Sign(flatRk)
    if err != nil {
        panic(err)
    }

    res, err := client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        panic(err)
    }

    fmt.Println("SetRegularKey transaction submitted")
    fmt.Printf("Hash: %s\n", res.Hash)
    fmt.Printf("Validated: %t\n", res.Validated)
    fmt.Println()

    fmt.Println("Checking if regular key is set...")
    p := &transaction.Payment{
        BaseTx: transaction.BaseTx{
            Account: w1.GetAddress(),
        },
        Destination: w2.GetAddress(),
        Amount:      types.XRPCurrencyAmount(10000),
    }

    flatP := p.Flatten()

    err = client.Autofill(&flatP)
    if err != nil {
        panic(err)
    }

    blob, _, err = regularKeyWallet.Sign(flatP)
    if err != nil {
        panic(err)
    }

    res, err = client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        panic(err)
    }

    fmt.Println("Payment transaction submitted")
    fmt.Printf("Hash: %s\n", res.Hash)
    fmt.Printf("Validated: %t\n", res.Validated)
}
