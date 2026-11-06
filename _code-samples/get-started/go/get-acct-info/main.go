// @chunk {"steps": ["import-tag"]}
package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	subscribe "github.com/Peersyst/xrpl-go/xrpl/queries/subscription"
	streamtypes "github.com/Peersyst/xrpl-go/xrpl/queries/subscription/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

// @chunk-end

func main() {
	// @chunk {"steps": ["connect-tag"]}
	// Define the network client with a faucet provider
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.altnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)

	// Connect to the network
	if err := client.Connect(); err != nil {
		panic(err)
	}
	fmt.Println("Connected to Testnet")
	// @chunk-end

	// @chunk {"steps": ["get-account-create-wallet-tag"]}
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
	// @chunk-end

	// To provide your own seed, replace the testWallet value with the below
	// @chunk {"steps": ["get-account-create-wallet-c-tag"]}
	// testWallet, err := wallet.FromSeed("your-seed-key", "")
	// @chunk-end

	// @chunk {"steps": ["query-xrpl-tag"]}
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
	// @chunk-end

	// @chunk {"steps": ["listen-for-events-tag"]}
	// Listen to ledger close events
	fmt.Println("\nListening for ledger close events...")
	client.OnLedgerClosed(func(ledger *streamtypes.LedgerStream) {
		fmt.Printf("Ledger #%d validated with %d transactions!\n",
			ledger.LedgerIndex, ledger.TxnCount)
	})
	if _, err := client.Subscribe(&subscribe.Request{
		Streams: []string{"ledger"},
	}); err != nil {
		panic(err)
	}
	// @chunk-end

	// @chunk {"steps": ["disconnect-tag"]}
	// Disconnect when done so the program can end.
	// Wait 10 seconds to give the ledger event listener time to receive
	// and display some ledger events.
	time.Sleep(10 * time.Second)
	if err := client.Disconnect(); err != nil {
		panic(err)
	}
	fmt.Println("\nDisconnected")
	// @chunk-end
}
