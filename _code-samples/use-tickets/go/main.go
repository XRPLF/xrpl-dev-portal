package main

import (
	"encoding/json"
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	rpctypes "github.com/Peersyst/xrpl-go/xrpl/rpc/types"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {
	// Set up client and account
	cfg, err := rpc.NewClientConfig(
		"https://s.altnet.rippletest.net:51234/",
		rpc.WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
		rpc.WithMaxRetries(30),
	)
	if err != nil {
		panic(err)
	}
	client := rpc.NewClient(cfg)

	// Fund wallet
	w, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}
	fmt.Println("Funding wallet...")
	if err := client.FundWallet(&w); err != nil {
		panic(err)
	}
	fmt.Println("Wallet funded")

	// Create Tickets
	ticketCreate := &transaction.TicketCreate{
		BaseTx: transaction.BaseTx{
			Account: w.GetAddress(),
		},
		TicketCount: 10,
	}
	fmt.Println("Submitting TicketCreate transaction...")
	tcResult, err := client.SubmitTxAndWait(ticketCreate.Flatten(), &rpctypes.SubmitOptions{
		Autofill: true,
		Wallet:   &w,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("TicketCreate hash: %s, validated: %t\n", tcResult.Hash, tcResult.Validated)

	// Check Available Tickets
	objects, err := client.GetAccountObjects(&account.ObjectsRequest{
		Account: w.GetAddress(),
		Type:    account.TicketObject,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Found %d Tickets\n", len(objects.AccountObjects))

	// Choose an arbitrary Ticket to use
	useTicket, err := objects.AccountObjects[0]["TicketSequence"].(json.Number).Int64()
	if err != nil {
		panic(err)
	}
	fmt.Printf("Using Ticket Sequence: %d\n", useTicket)

	// Use a Ticket
	ticketedTx := &transaction.AccountSet{
		BaseTx: transaction.BaseTx{
			Account:        w.GetAddress(),
			Sequence:       0,
			TicketSequence: uint32(useTicket),
		},
	}
	fmt.Println("Submitting ticketed AccountSet transaction...")
	ticketedResult, err := client.SubmitTxAndWait(ticketedTx.Flatten(), &rpctypes.SubmitOptions{
		Autofill: true,
		Wallet:   &w,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Ticketed AccountSet hash: %s, validated: %t\n", ticketedResult.Hash, ticketedResult.Validated)
}
