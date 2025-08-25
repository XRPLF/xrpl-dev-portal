package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/path"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"

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
    cfg, err := rpc.NewClientConfig(
        "https://s.altnet.rippletest.net:51234/",
        rpc.WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
    )
    if err != nil {
        panic(err)
    }

    client := rpc.NewClient(cfg)

    wallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    fmt.Println("Funding wallet...")
    if err := client.FundWallet(&wallet); err != nil {
        panic(err)
    }

    fmt.Println("Wallet funded")
    fmt.Println()

    fmt.Println("Getting paths...")
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
        panic(err)
    }

    fmt.Printf("Computed paths: %d\n", len(res.Alternatives))
    fmt.Println()

    if len(res.Alternatives) == 0 {
        fmt.Println("No alternatives found")
        return
    }

    fmt.Println("Submitting Payment through path: ", res.Alternatives[0].PathsComputed)
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
        panic(err)
    }

    blob, hash, err := wallet.Sign(flatP)
    if err != nil {
        panic(err)
    }

    txRes, err := client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        panic(err)
    }

    fmt.Println("Payment submitted")
    fmt.Printf("Hash: %s\n", hash)
    fmt.Printf("Validated: %t\n", txRes.Validated)
}
