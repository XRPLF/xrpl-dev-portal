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
    fmt.Println("⏳ Setting up client...")
    client := websocket.NewClient(
        websocket.NewClientConfig().
            WithHost("wss://s.altnet.rippletest.net").
            WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
    )
    fmt.Println("✅ Client configured!")
    fmt.Println()

    fmt.Println("Connecting to server...")
    if err := client.Connect(); err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("Connection: ", client.IsConnected())

    //
    // Configure wallets
    //
    fmt.Println("⏳ Setting up wallets...")
    coldWallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        fmt.Printf("❌ Error creating cold wallet: %s\n", err)
        return
    }
    err = client.FundWallet(&coldWallet)
    if err != nil {
        fmt.Printf("❌ Error funding cold wallet: %s\n", err)
        return
    }
    fmt.Println("💸 Cold wallet funded!")

    hotWallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        fmt.Printf("❌ Error creating hot wallet: %s\n", err)
        return
    }
    err = client.FundWallet(&hotWallet)
    if err != nil {
        fmt.Printf("❌ Error funding hot wallet: %s\n", err)
        return
    }
    fmt.Println("💸 Hot wallet funded!")
    fmt.Println()

    fmt.Println("✅ Wallets setup complete!")
    fmt.Println("💳 Cold wallet:", coldWallet.ClassicAddress)
    fmt.Println("💳 Hot wallet:", hotWallet.ClassicAddress)
    fmt.Println()

    //
    // Configure cold address settings
    //
    fmt.Println("⏳ Configuring cold address settings...")
    coldWalletAccountSet := &transactions.AccountSet{
        BaseTx: transactions.BaseTx{
            Account: types.Address(coldWallet.ClassicAddress),
        },
        TickSize:     types.TickSize(5),
        TransferRate: types.TransferRate(0),
        Domain:       types.Domain("6578616D706C652E636F6D"), // example.com
    }

    coldWalletAccountSet.SetAsfAllowTrustLineClawback()
    coldWalletAccountSet.SetDisallowXRP()

    coldWalletAccountSet.SetRequireDestTag()

    flattenedTx := coldWalletAccountSet.Flatten()

    err = client.Autofill(&flattenedTx)
    if err != nil {
        fmt.Printf("❌ Error autofilling transaction: %s\n", err)
        return
    }

    txBlob, _, err := coldWallet.Sign(flattenedTx)
    if err != nil {
        fmt.Printf("❌ Error signing transaction: %s\n", err)
        return
    }

    response, err := client.SubmitTxBlobAndWait(txBlob, false)
    if err != nil {
        fmt.Printf("❌ Error submitting transaction: %s\n", err)
        return
    }

    if !response.Validated {
        fmt.Println("❌ Cold wallet unfreezing failed!")
        fmt.Println("Try again!")
        fmt.Println()
        return
    }

    fmt.Println("✅ Cold address settings configured!")
    fmt.Printf("🌐 Hash: %s\n", response.Hash.String())
    fmt.Println()

    //
    // Create trust line from hot to cold address
    //
    fmt.Println("⏳ Creating trust line from hot to cold address...")
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
        fmt.Printf("❌ Error autofilling transaction: %s\n", err)
        return
    }

    txBlob, _, err = hotWallet.Sign(flattenedTx)
    if err != nil {
        fmt.Printf("❌ Error signing transaction: %s\n", err)
        return
    }

    response, err = client.SubmitTxBlobAndWait(txBlob, false)
    if err != nil {
        fmt.Printf("❌ Error submitting transaction: %s\n", err)
        return
    }

    if !response.Validated {
        fmt.Println("❌ Trust line from hot to cold address creation failed!")
        fmt.Println("Try again!")
        fmt.Println()
        return
    }

    fmt.Println("✅ Trust line from hot to cold address created!")
    fmt.Printf("🌐 Hash: %s\n", response.Hash.String())
    fmt.Println()

    //
    // Send tokens from cold wallet to hot wallet
    //
    fmt.Println("⏳ Sending tokens from cold wallet to hot wallet...")
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
        fmt.Printf("❌ Error autofilling transaction: %s\n", err)
        return
    }

    txBlob, _, err = coldWallet.Sign(flattenedTx)
    if err != nil {
        fmt.Printf("❌ Error signing transaction: %s\n", err)
        return
    }

    response, err = client.SubmitTxBlobAndWait(txBlob, false)
    if err != nil {
        fmt.Printf("❌ Error submitting transaction: %s\n", err)
        return
    }

    if !response.Validated {
        fmt.Println("❌ Tokens not sent from cold wallet to hot wallet!")
        fmt.Println("Try again!")
        fmt.Println()
        return
    }

    fmt.Println("✅ Tokens sent from cold wallet to hot wallet!")
    fmt.Printf("🌐 Hash: %s\n", response.Hash.String())
    fmt.Println()

    //
    // Claw back tokens from customer one
    //
    fmt.Println("⏳ Clawing back tokens from hot wallet...")

    coldWalletClawback := &transactions.Clawback{
        BaseTx: transactions.BaseTx{
            Account: types.Address(coldWallet.ClassicAddress),
        },
        Amount: types.IssuedCurrencyAmount{
            Currency: currencyCode,
            Issuer:   types.Address(hotWallet.ClassicAddress),
            Value:    "50",
        },
    }

    flattenedTx = coldWalletClawback.Flatten()
    err = client.Autofill(&flattenedTx)
    if err != nil {
        fmt.Printf("❌ Error autofilling transaction: %s\n", err)
        return
    }

    txBlob, _, err = coldWallet.Sign(flattenedTx)
    if err != nil {
        fmt.Printf("❌ Error signing transaction: %s\n", err)
        return
    }

    response, err = client.SubmitTxBlobAndWait(txBlob, false)
    if err != nil {
        fmt.Printf("❌ Error submitting transaction: %s\n", err)
        return
    }

    if !response.Validated {
        fmt.Println("❌ Tokens not clawed back from customer one!")
        fmt.Println("Try again!")
        return
    }

    fmt.Println("✅ Tokens clawed back from customer one!")
    fmt.Printf("🌐 Hash: %s\n", response.Hash.String())
    fmt.Println()
}
