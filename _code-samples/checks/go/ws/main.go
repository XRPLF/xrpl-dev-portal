package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/ledger-entry-types"
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

    w, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    receiverWallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    fmt.Println("Setting up wallets...")
    if err := client.FundWallet(&w); err != nil {
        panic(err)
    }
    fmt.Println("Sender wallet funded!")

    if err := client.FundWallet(&receiverWallet); err != nil {
        panic(err)
    }

    fmt.Println("Receiver wallet funded!")
    fmt.Println()

    fmt.Println("Wallets setup complete!")
    fmt.Println("Sender wallet:", w.ClassicAddress)
    fmt.Println("Receiver wallet:", receiverWallet.ClassicAddress)
    fmt.Println()

    fmt.Println("Creating check...")
    cc := &transaction.CheckCreate{
        BaseTx: transaction.BaseTx{
            Account: w.GetAddress(),
        },
        Destination: receiverWallet.GetAddress(),
        SendMax:     types.XRPCurrencyAmount(1000000),
        InvoiceID:   "46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291",
    }

    flatCc := cc.Flatten()

    if err := client.Autofill(&flatCc); err != nil {
        panic(err)
    }
    

    blob, _, err := w.Sign(flatCc)
    if err != nil {
        panic(err)
    }

    res, err := client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        panic(err)
    }

    if !res.Validated {
        fmt.Println("Check creation failed!")
        fmt.Println("Try again!")
        fmt.Println()
        return
    }

    fmt.Println("Check created!")
    fmt.Printf("Hash: %s\n", res.Hash.String())
    fmt.Println()

    meta, ok := res.Meta.(map[string]interface{})
    if !ok {
        fmt.Println("Meta is not of type TxObjMeta")
        return
    }

    var checkID string

    affectedNodes := meta["AffectedNodes"].([]interface{})

    for _, node := range affectedNodes {
        affectedNode, ok := node.(map[string]interface{})
        if !ok {
            fmt.Println("Node is not of type map[string]interface{}")
            return
        }

        createdNode, ok := affectedNode["CreatedNode"].(map[string]interface{})
        if !ok {
            continue
        }

        if createdNode["LedgerEntryType"] == string(ledger.CheckEntry) {

            checkID = createdNode["LedgerIndex"].(string)
        }
    }

    if checkID == "" {
        fmt.Println("Check not found")
        return
    }

    fmt.Println("Cashing out check...")
    checkCash := &transaction.CheckCash{
        BaseTx: transaction.BaseTx{
            Account: receiverWallet.GetAddress(),
        },
        CheckID: types.Hash256(checkID),
        Amount:  types.XRPCurrencyAmount(1000000),
    }

    flatCheckCash := checkCash.Flatten()

    if err := client.Autofill(&flatCheckCash); err != nil {
        panic(err)
    }

    blob, _, err = receiverWallet.Sign(flatCheckCash)
    if err != nil {
        panic(err)
    }

    res, err = client.SubmitTxBlobAndWait(blob, false)
    if err != nil {
        panic(err)
    }

    fmt.Println("Check cashed out!")
    fmt.Printf("Hash: %s\n", res.Hash.String())
    fmt.Println()
}
