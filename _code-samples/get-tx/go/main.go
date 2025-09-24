package main

import (
    "fmt"

    "github.com/Peersyst/xrpl-go/xrpl/queries/common"
    "github.com/Peersyst/xrpl-go/xrpl/queries/ledger"
    "github.com/Peersyst/xrpl-go/xrpl/queries/transactions"
    "github.com/Peersyst/xrpl-go/xrpl/rpc"
)

func main() {
    cfg, err := rpc.NewClientConfig(
        "https://s.altnet.rippletest.net:51234/",
    )
    if err != nil {
        panic(err)
    }

    client := rpc.NewClient(cfg)

    // Get the latest validated ledger
    led, err := client.GetLedger(&ledger.Request{
        Transactions: true,
        LedgerIndex:  common.Validated,
    })
    if err != nil {
        panic(err)
    }
    fmt.Println("Latest validated ledger:", led)

    // Get the first transaction hash from the ledger
    if len(led.Ledger.Transactions) > 0 {
        txHash := led.Ledger.Transactions[0].(string) // type assertion may be needed

        // Query the transaction details
        txResp, err := client.Request(&transactions.TxRequest{
            Transaction: txHash,
        })
        if err != nil {
            panic(err)
        }
        fmt.Println("First transaction in the ledger:")
        fmt.Println(txResp)
    }
}
