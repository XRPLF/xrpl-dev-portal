package main

import (
    "fmt"

    "github.com/Peersyst/xrpl-go/pkg/crypto"
    "github.com/Peersyst/xrpl-go/xrpl/faucet"
    "github.com/Peersyst/xrpl-go/xrpl/queries/account"
    "github.com/Peersyst/xrpl-go/xrpl/queries/common"
    "github.com/Peersyst/xrpl-go/xrpl/queries/ledger"
    "github.com/Peersyst/xrpl-go/xrpl/rpc"
    "github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {
    // Define the network client with a faucet provider
    cfg, err := rpc.NewClientConfig(
        "https://s.altnet.rippletest.net:51234/",
        rpc.WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
    )
    if err != nil {
        panic(err)
    }
    client := rpc.NewClient(cfg)

    // Create a new wallet
    w, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }
    fmt.Println("New wallet created:")
    fmt.Println("Address:", w.ClassicAddress)

    // Fund the wallet with testnet XRP
    if err := client.FundWallet(&w); err != nil {
        panic(err)
    }

    // Get info from the ledger about the address we just funded
    acc_info, err := client.GetAccountInfo(&account.InfoRequest{
        Account: w.GetAddress(),
    })
    if err != nil {
        panic(err)
    }
    fmt.Println("Account Balance:", acc_info.AccountData.Balance)
    fmt.Println("Account Sequence:", acc_info.AccountData.Sequence)

    // Get info about the ledger
    ledger, err := client.GetLedger(&ledger.Request{LedgerIndex: common.Current})
    if err != nil {
        panic(err)
    }
    fmt.Println("Ledger Index:", ledger.Ledger.LedgerIndex)
}
