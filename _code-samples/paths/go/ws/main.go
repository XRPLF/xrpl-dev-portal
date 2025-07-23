package main

import (
    "fmt"

    "github.com/Peersyst/xrpl-go/pkg/crypto"
    "github.com/Peersyst/xrpl-go/xrpl/faucet"
    "github.com/Peersyst/xrpl-go/xrpl/queries/path"
    "github.com/Peersyst/xrpl-go/xrpl/transaction"
    "github.com/Peersyst/xrpl-go/xrpl/transaction/types"
    "github.com/Peersyst/xrpl-go/xrpl/wallet"
    "github.com/Peersyst/xrpl-go/xrpl/websocket"

    pathtypes "github.com/Peersyst/xrpl-go/xrpl/queries/path/types"
)

const (
    DestinationAccount = types.Address("rKT4JX4cCof6LcDYRz8o3rGRu7qxzZ2Zwj")
)

var (
    DestinationAmount = types.IssuedCurrencyAmount{
        Issuer:   "rVnYNK9yuxBz4uP8zC8LEFokM2nqH3poc",
        Currency: "USD",
        Value:    "0.001",
    }
)

func main() {
    fmt.Println("⏳ Connecting to testnet...")
    client := websocket.NewClient(
        websocket.NewClientConfig().
            WithHost("wss://s.altnet.rippletest.net:51233").
            WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
    )
    defer client.Disconnect()

    if err := client.Connect(); err != nil {
        fmt.Println(err)
        return
    }

    if !client.IsConnected() {
        fmt.Println("❌ Failed to connect to testnet")
        return
    }

    fmt.Println("✅ Connected to testnet")
    fmt.Println()

    wallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("⏳ Funding wallet...")
    if err := client.FundWallet(&wallet); err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("💸 Wallet funded")
    fmt.Println()

    fmt.Println("⏳ Getting paths...")
    res, err := client.GetRipplePathFind(&path.RipplePathFindRequest{
        SourceAccount: wallet.GetAddress(),
        SourceCurrencies: []pathtypes.RipplePathFindCurrency{
            {
                Currency: "XRP",
            },
        },
        DestinationAccount: DestinationAccount,
        DestinationAmount:  DestinationAmount,
    })
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Printf("🌐 Computed paths: %d\n", len(res.Alternatives))
    fmt.Println()

    if len(res.Alternatives) == 0 {
        fmt.Println("❌ No alternatives found")
        return
    }

    fmt.Println("⏳ Submitting Payment through path: ", res.Alternatives[0].PathsComputed)
    p := &transaction.Payment{
        BaseTx: transaction.BaseTx{
            Account: wallet.GetAddress(),
        },
        Destination: DestinationAccount,
        Amount:      DestinationAmount,
        Paths:       res.Alternatives[0].PathsComputed,
    }

    flatP := p.Flatten()

    if err := client.Autofill(&flatP); err != nil {
        fmt.Println(err)
        return
    }

    blob, hash, err := wallet.Sign(flatP)
    if err != nil {
        fmt.Println(err)
        return
    }

    txRes, err := client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("✅ Payment submitted")
    fmt.Printf("🌐 Hash: %s\n", hash)
    fmt.Printf("🌐 Validated: %t\n", txRes.Validated)
}
