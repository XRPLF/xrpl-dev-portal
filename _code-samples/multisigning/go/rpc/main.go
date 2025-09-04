package main

import (
	"encoding/hex"
	"fmt"
	"maps"
	"strings"

	"github.com/Peersyst/xrpl-go/xrpl"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/ledger-entry-types"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
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

    w1, err := wallet.FromSeed("sEdTtvLmJmrb7GaivhWoXRkvU4NDjVf", "")
    if err != nil {
        panic(err)
    }

    w2, err := wallet.FromSeed("sEdSFiKMQp7RvYLgH7t7FEpwNRWv2Gr", "")
    if err != nil {
        panic(err)
    }

    master, err := wallet.FromSeed("sEdTMm2yv8c8Rg8YHFHQA9TxVMFy1ze", "")
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

    if err := client.FundWallet(&master); err != nil {
        panic(err)
    }
    fmt.Println("Master wallet funded")
    fmt.Println()
    fmt.Println("Setting up signer list...")

    ss := &transaction.SignerListSet{
        BaseTx: transaction.BaseTx{
            Account: master.GetAddress(),
        },
        SignerQuorum: uint32(2),
        SignerEntries: []ledger.SignerEntryWrapper{
            {
                SignerEntry: ledger.SignerEntry{
                    Account:      w1.GetAddress(),
                    SignerWeight: 1,
                },
            },
            {
                SignerEntry: ledger.SignerEntry{
                    Account:      w2.GetAddress(),
                    SignerWeight: 1,
                },
            },
            {
                SignerEntry: ledger.SignerEntry{
                    Account:      "XVYRdEocC28DRx94ZFGP3qNJ1D5Ln7ecXFMd3vREB5Pesju",
                    SignerWeight: 1,
                },
            },
        },
    }

    flatSs := ss.Flatten()

    if err := client.Autofill(&flatSs); err != nil {
        panic(err)
    }

    blob, _, err := master.Sign(flatSs)
    if err != nil {
        panic(err)
    }

    res, err := client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        panic(err)
    }

    fmt.Println("SignerListSet transaction submitted!")
    fmt.Printf("Hash: %s\n", res.Hash.String())
    fmt.Println()

    fmt.Println("Setting up AccountSet multisign transaction...")

    as := &transaction.AccountSet{
        BaseTx: transaction.BaseTx{
            Account: master.GetAddress(),
        },
        Domain: types.Domain(strings.ToUpper(hex.EncodeToString([]byte("example.com")))),
    }

    flatAs := as.Flatten()

    if err := client.AutofillMultisigned(&flatAs, 2); err != nil {
        panic(err)
    }

    w1As := maps.Clone(flatAs)

    blob1, _, err := w1.Multisign(w1As)
    if err != nil {
        panic(err)
    }

    w2As := maps.Clone(flatAs)

    blob2, _, err := w2.Multisign(w2As)
    if err != nil {
        panic(err)
    }

    blob, err = xrpl.Multisign(blob1, blob2)
    if err != nil {
        panic(err)
    }

    mRes, err := client.SubmitMultisigned(blob, false)
    if err != nil {
        panic(err)
    }

    fmt.Println("Multisigned transaction submitted!")
    fmt.Printf("Result: %s\n", mRes.EngineResult)
}
