package main

import (
    "fmt"

    "github.com/Peersyst/xrpl-go/pkg/crypto"
    "github.com/Peersyst/xrpl-go/xrpl/faucet"
    transactions "github.com/Peersyst/xrpl-go/xrpl/transaction"
    "github.com/Peersyst/xrpl-go/xrpl/transaction/types"
    "github.com/Peersyst/xrpl-go/xrpl/wallet"
    "github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {
    // Connect to testnet
    client := websocket.NewClient(
        websocket.NewClientConfig().
            WithHost("wss://s.devnet.rippletest.net:51233").
            WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
    )
    defer client.Disconnect()

    if err := client.Connect(); err != nil {
        fmt.Println(err)
        return
    }

    // Create and fund wallets
    delegatorWallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        fmt.Println(err)
        return
    }

    delegateeWallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("⏳ Funding wallets...")
    if err := client.FundWallet(&delegatorWallet); err != nil {
        fmt.Println(err)
        return
    }
    if err := client.FundWallet(&delegateeWallet); err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("💸 Wallets funded")

    // Check initial balances
    delegatorBalance, err := client.GetXrpBalance(delegatorWallet.ClassicAddress)
    if err != nil {
        delegatorBalance = "0"
    }
    delegateeBalance, err := client.GetXrpBalance(delegateeWallet.ClassicAddress)
    if err != nil {
        delegateeBalance = "0"
    }

    fmt.Printf("💳 Delegator initial balance: %s XRP\n", delegatorBalance)
    fmt.Printf("💳 Delegatee initial balance: %s XRP\n", delegateeBalance)
    fmt.Println()

    // Create DelegateSet transaction
    delegateSetTx := &transactions.DelegateSet{
        BaseTx: transactions.BaseTx{
            Account: types.Address(delegatorWallet.ClassicAddress),
        },
        Authorize: types.Address(delegateeWallet.ClassicAddress),
        Permissions: []types.Permission{
            {
                Permission: types.PermissionValue{
                    PermissionValue: "Payment",
                },
            },
        },
    }

    // Submit DelegateSet transaction
    flattenedTx := delegateSetTx.Flatten()
    if err := client.Autofill(&flattenedTx); err != nil {
        fmt.Println(err)
        return
    }

    txBlob, _, err := delegatorWallet.Sign(flattenedTx)
    if err != nil {
        fmt.Println(err)
        return
    }

    response, err := client.SubmitTxBlobAndWait(txBlob, false)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("✅ DelegateSet transaction submitted")
    fmt.Printf("🌐 Hash: %s\n", response.Hash)
    fmt.Printf("🌐 Validated: %t\n", response.Validated)
    fmt.Println()

    // Create delegated payment transaction
    delegatedPaymentTx := &transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account:  types.Address(delegatorWallet.ClassicAddress),
            Delegate: types.Address(delegateeWallet.ClassicAddress),
        },
        Destination: types.Address(delegateeWallet.ClassicAddress),
        Amount:      types.XRPCurrencyAmount(1000000), // 1 XRP
    }

    // Submit delegated payment
    flatDelegatedPayment := delegatedPaymentTx.Flatten()
    if err := client.Autofill(&flatDelegatedPayment); err != nil {
        fmt.Println(err)
        return
    }

    txBlob2, _, err := delegateeWallet.Sign(flatDelegatedPayment)
    if err != nil {
        fmt.Println(err)
        return
    }

    response2, err := client.SubmitTxBlobAndWait(txBlob2, false)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("✅ Delegated payment submitted")
    fmt.Printf("🌐 Hash: %s\n", response2.Hash)
    fmt.Printf("🌐 Validated: %t\n", response2.Validated)
    fmt.Println()

    // Check final balances
    finalDelegatorBalance, err := client.GetXrpBalance(delegatorWallet.ClassicAddress)
    if err != nil {
        finalDelegatorBalance = "0"
    }
    finalDelegateeBalance, err := client.GetXrpBalance(delegateeWallet.ClassicAddress)
    if err != nil {
        finalDelegateeBalance = "0"
    }

    fmt.Printf("💳 Delegator final balance: %s XRP\n", finalDelegatorBalance)
    fmt.Printf("💳 Delegatee final balance: %s XRP\n", finalDelegateeBalance)
}
