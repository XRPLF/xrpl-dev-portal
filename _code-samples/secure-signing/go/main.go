package main

import (
    "fmt"

    "github.com/Peersyst/xrpl-go/pkg/crypto"
    "github.com/Peersyst/xrpl-go/xrpl/transaction"
    "github.com/Peersyst/xrpl-go/xrpl/transaction/types"
    "github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {
    w, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    p := &transaction.Payment{
        BaseTx: transaction.BaseTx{
            Account: types.Address(w.GetAddress()),
            Fee:    types.XRPCurrencyAmount(13),
            Sequence: 1,
            Flags:    2147483648,
            LastLedgerSequence: 7835923,
        },
        Destination: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
        Amount:      types.XRPCurrencyAmount(10000),
        DeliverMax:  types.XRPCurrencyAmount(10000), 
    }

    flattenedTx := p.Flatten()

    fmt.Println("Payment object created:", flattenedTx)

    signedTx, txHash, err := w.Sign(flattenedTx)
    if err != nil {
        panic(err)
    }

    fmt.Println("Transaction signed successfully:", signedTx)
    fmt.Println("Transaction hash:", txHash)
}
