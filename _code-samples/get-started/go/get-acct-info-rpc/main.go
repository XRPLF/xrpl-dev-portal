package main

import (
	"encoding/json"
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {
	// @chunk {"steps": ["connect-rpc-tag"]}
	// Define the JSON-RPC network client with a faucet provider
	cfg, err := rpc.NewClientConfig(
		"https://s.altnet.rippletest.net:51234/",
		rpc.WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)
	if err != nil {
		panic(err)
	}
	client := rpc.NewClient(cfg)
	fmt.Println("Using Testnet JSON-RPC")
	// @chunk-end

	// Create a wallet and fund it with the Testnet faucet:
	fmt.Println("\nCreating a new wallet and funding it with Testnet XRP...")
	testWallet, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}
	if err := client.FundWallet(&testWallet); err != nil {
		panic(err)
	}
	fmt.Println("Wallet:", testWallet.ClassicAddress)
	fmt.Println("Account Testnet Explorer URL:")
	fmt.Printf("  https://testnet.xrpl.org/accounts/%s\n", testWallet.ClassicAddress)

	// Get info from the ledger about the address we just funded
	fmt.Println("\nGetting account info...")
	accountInfo, err := client.GetAccountInfo(&account.InfoRequest{
		Account:     testWallet.GetAddress(),
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}
	accountInfoJSON, err := json.MarshalIndent(accountInfo, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(accountInfoJSON))
}
