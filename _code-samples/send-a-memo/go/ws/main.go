package main

import (
	"encoding/hex"
	"fmt"
	"strconv"

	"github.com/Peersyst/xrpl-go/xrpl/currency"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	transactions "github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {
    w, err := wallet.FromSeed("sEdSMVV4dJ1JbdBxmakRR4Puu3XVZz2", "")
    if err != nil {
        panic(err)
    }

    receiverWallet, err := wallet.FromSeed("sEd7d8Ci9nevdLCeUMctF3uGXp9WQqJ", "")
    if err != nil {
        panic(err)
    }

    client := websocket.NewClient(
        websocket.NewClientConfig().
            WithHost("wss://s.altnet.rippletest.net:51233").
            WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
    )
    defer client.Disconnect()

    fmt.Println("Connecting to server...")
    if err := client.Connect(); err != nil {
        panic(err)
    }

    fmt.Println("Connected to server")
    fmt.Println()

    balance, err := client.GetXrpBalance(w.GetAddress())

    if err != nil || balance == "0" {
        fmt.Println("Funding wallet...")
        err = client.FundWallet(&w)
        if err != nil {
            panic(err)
        }
        fmt.Println("Wallet funded")
    }

    balance, _ = client.GetXrpBalance(w.GetAddress())

    fmt.Printf("Balance: %s\n", balance)

    amount, err := currency.XrpToDrops("1")
    if err != nil {
        panic(err)
    }

    amountUint, err := strconv.ParseUint(amount, 10, 64)
    if err != nil {
        panic(err)
    }

    fmt.Println("Sending payment...")
    payment := transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account: types.Address(w.GetAddress()),
            Memos: []types.MemoWrapper{
                {
                    Memo: types.Memo{
                        MemoData:   hex.EncodeToString([]byte("Hello, World!")),
                        MemoFormat: hex.EncodeToString([]byte("plain")),
                        MemoType:   hex.EncodeToString([]byte("message")),
                    },
                },
                {
                    Memo: types.Memo{
                        MemoData:   hex.EncodeToString([]byte("Hello, World 2!")),
                        MemoFormat: hex.EncodeToString([]byte("text/plain")),
                        MemoType:   hex.EncodeToString([]byte("message2")),
                    },
                },
            },
        },
        Destination: types.Address(receiverWallet.GetAddress()),
        Amount:      types.XRPCurrencyAmount(amountUint),
    }

    flatTx := payment.Flatten()

    err = client.Autofill(&flatTx)
    if err != nil {
        panic(err)
    }

    txBlob, _, err := w.Sign(flatTx)
    if err != nil {
        panic(err)
    }

    response, err := client.SubmitTxBlobAndWait(txBlob, true)
    if err != nil {
        panic(err)
    }

    fmt.Println("Payment submitted")
    fmt.Printf("Hash: %s\n", response.Hash.String())
    fmt.Printf("Validated: %t\n", response.Validated)
}
