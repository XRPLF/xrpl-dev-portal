package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	"github.com/Peersyst/xrpl-go/xrpl/rpc/types"
	transactions "github.com/Peersyst/xrpl-go/xrpl/transaction"
	txnTypes "github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {
	// Configure the client
	cfg, err := rpc.NewClientConfig(
		"https://s.devnet.rippletest.net:51234/",
		rpc.WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
	)
	if err != nil {
		panic(err)
	}
	client := rpc.NewClient(cfg)

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
			Account: txnTypes.Address(delegatorWallet.ClassicAddress),
		},
		Authorize: txnTypes.Address(delegateeWallet.ClassicAddress),
		Permissions: []txnTypes.Permission{
			{
				Permission: txnTypes.PermissionValue{
					PermissionValue: "Payment",
				},
			},
		},
	}

	// Submit DelegateSet transaction
	response, err := client.SubmitTxAndWait(delegateSetTx.Flatten(), &types.SubmitOptions{
		Autofill: true,
		Wallet:   &delegatorWallet,
	})
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
			Account:  txnTypes.Address(delegatorWallet.ClassicAddress),
			Delegate: txnTypes.Address(delegateeWallet.ClassicAddress),
		},
		Destination: txnTypes.Address(delegateeWallet.ClassicAddress),
		Amount:      txnTypes.XRPCurrencyAmount(1000000), // 1 XRP
	}

	// Submit delegated payment
	response2, err := client.SubmitTxAndWait(delegatedPaymentTx.Flatten(), &types.SubmitOptions{
		Autofill: true,
		Wallet:   &delegateeWallet,
	})
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
