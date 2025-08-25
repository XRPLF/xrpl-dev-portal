package main

import (
	"encoding/json"
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
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

    w, err := wallet.New(crypto.ED25519())
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("Funding wallet...")
    if err := client.FundWallet(&w); err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("Wallet funded")
    fmt.Println()

    info, err := client.GetAccountInfo(&account.InfoRequest{
        Account: w.GetAddress(),
    })
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("Current wallet sequence:", info.AccountData.Sequence)
    fmt.Println()

    fmt.Println("Submitting TicketCreate transaction...")
    tc := &transaction.TicketCreate{
        BaseTx: transaction.BaseTx{
            Account:  w.GetAddress(),
            Sequence: info.AccountData.Sequence,
        },
        TicketCount: 10,
    }

    flatTc := tc.Flatten()

    if err := client.Autofill(&flatTc); err != nil {
        fmt.Println(err)
        return
    }

    blob, _, err := w.Sign(flatTc)
    if err != nil {
        fmt.Println(err)
        return
    }

    res, err := client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("TicketCreate transaction submitted")
    fmt.Printf("Hash: %s\n", res.Hash)
    fmt.Printf("Validated: %t\n", res.Validated)
    fmt.Println()

    objects, err := client.GetAccountObjects(&account.ObjectsRequest{
        Account: w.GetAddress(),
    })
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("Account objects:", objects.AccountObjects[0]["TicketSequence"])

    seq, err := objects.AccountObjects[0]["TicketSequence"].(json.Number).Int64()
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("Submitting AccountSet transaction...")
    as := &transaction.AccountSet{
        BaseTx: transaction.BaseTx{
            Account:        w.GetAddress(),
            Sequence:       0,
            TicketSequence: uint32(seq),
        },
    }

    flatAs := as.Flatten()

    if err := client.Autofill(&flatAs); err != nil {
        fmt.Println(err)
        return
    }

    flatAs["Sequence"] = uint32(0)

    blob, _, err = w.Sign(flatAs)
    if err != nil {
        fmt.Println(err)
        return
    }

    res, err = client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("AccountSet transaction submitted")
    fmt.Printf("Hash: %s\n", res.Hash)
    fmt.Printf("Validated: %t\n", res.Validated)
}
