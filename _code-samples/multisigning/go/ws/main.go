package main

import (
    "encoding/hex"
    "fmt"
    "maps"
    "strings"

    "github.com/Peersyst/xrpl-go/xrpl"
    "github.com/Peersyst/xrpl-go/xrpl/faucet"
    "github.com/Peersyst/xrpl-go/xrpl/ledger-entry-types"
    "github.com/Peersyst/xrpl-go/xrpl/transaction"
    "github.com/Peersyst/xrpl-go/xrpl/transaction/types"
    "github.com/Peersyst/xrpl-go/xrpl/wallet"
    "github.com/Peersyst/xrpl-go/xrpl/websocket"
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

    w1, err := wallet.FromSeed("sEdTtvLmJmrb7GaivhWoXRkvU4NDjVf", "")
    if err != nil {
        fmt.Println(err)
        return
    }

    w2, err := wallet.FromSeed("sEdSFiKMQp7RvYLgH7t7FEpwNRWv2Gr", "")
    if err != nil {
        fmt.Println(err)
        return
    }

    master, err := wallet.FromSeed("sEdTMm2yv8c8Rg8YHFHQA9TxVMFy1ze", "")
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("⏳ Funding wallets...")

    if err := client.FundWallet(&w1); err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("💸 Wallet 1 funded")

    if err := client.FundWallet(&w2); err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("💸 Wallet 2 funded")

    if err := client.FundWallet(&master); err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("💸 Master wallet funded")
    fmt.Println()
    fmt.Println("⏳ Setting up signer list...")

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

    fmt.Println("⏳ Flattening transaction...")
    flatSs := ss.Flatten()

    fmt.Println("⏳ Autofilling transaction...")
    if err := client.Autofill(&flatSs); err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("⏳ Signing transaction...")
    blob, _, err := master.Sign(flatSs)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("⏳ Submitting transaction...")
    res, err := client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("✅ SignerListSet transaction submitted!")
    fmt.Printf("🌐 Hash: %s\n", res.Hash.String())
    fmt.Println()

    fmt.Println("⏳ Setting up AccountSet multisign transaction...")

    as := &transaction.AccountSet{
        BaseTx: transaction.BaseTx{
            Account: master.GetAddress(),
        },
        Domain: types.Domain(strings.ToUpper(hex.EncodeToString([]byte("example.com")))),
    }

    flatAs := as.Flatten()

    if err := client.AutofillMultisigned(&flatAs, 2); err != nil {
        fmt.Println(err)
        return
    }

    w1As := maps.Clone(flatAs)

    blob1, _, err := w1.Multisign(w1As)
    if err != nil {
        fmt.Println(err)
        return
    }

    w2As := maps.Clone(flatAs)

    blob2, _, err := w2.Multisign(w2As)
    if err != nil {
        fmt.Println(err)
        return
    }

    blob, err = xrpl.Multisign(blob1, blob2)
    if err != nil {
        fmt.Println(err)
        return
    }

    mRes, err := client.SubmitMultisigned(blob, false)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("✅ Multisigned transaction submitted!")
    fmt.Printf("🌐 Result: %s\n", mRes.EngineResult)
}
