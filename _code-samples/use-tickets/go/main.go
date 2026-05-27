package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {
	// Set up client and account
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.altnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewTestnetFaucetProvider()).
			WithMaxRetries(30),
	)
	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	// Fund wallet
	w, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}
	fmt.Println("Getting a wallet from the faucet...")
	if err := client.FundWallet(&w); err != nil {
		panic(err)
	}
	fmt.Printf("Wallet address: %s\n", w.GetAddress())
	fmt.Println()

	// Create Tickets
	ticketCreate := &transaction.TicketCreate{
		BaseTx: transaction.BaseTx{
			Account: w.GetAddress(),
		},
		TicketCount: 10,
	}
	flatTc := ticketCreate.Flatten()
	if err := client.Autofill(&flatTc); err != nil {
		panic(err)
	}
	blob, _, err := w.Sign(flatTc)
	if err != nil {
		panic(err)
	}
	fmt.Println("Submitting TicketCreate transaction...")
	tcResult, err := client.SubmitTxBlobAndWait(blob, false)
	if err != nil {
		panic(err)
	}
	fmt.Printf("TicketCreate hash: %s, validated: %t\n", tcResult.Hash, tcResult.Validated)
	fmt.Println()

	// Check Available Tickets
	fmt.Println("Checking available tickets...")
	objects, err := client.GetAccountObjects(&account.ObjectsRequest{
		Account: w.GetAddress(),
		Type:    account.TicketObject,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Found %d Tickets\n", len(objects.AccountObjects))

	// Choose an arbitrary Ticket to use
	useTicket := uint32(objects.AccountObjects[0]["TicketSequence"].(float64))
	fmt.Printf("Using Ticket Sequence: %d\n", useTicket)
	fmt.Println()

	// Use a Ticket
	ticketedTx := &transaction.AccountSet{
		BaseTx: transaction.BaseTx{
			Account:        w.GetAddress(),
			Sequence:       0,
			TicketSequence: useTicket,
		},
	}
	flatAs := ticketedTx.Flatten()
	if err := client.Autofill(&flatAs); err != nil {
		panic(err)
	}
	blob, _, err = w.Sign(flatAs)
	if err != nil {
		panic(err)
	}
	fmt.Println("Submitting ticketed AccountSet transaction...")
	ticketedResult, err := client.SubmitTxBlobAndWait(blob, false)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Ticketed AccountSet hash: %s, validated: %t\n", ticketedResult.Hash, ticketedResult.Validated)
	fmt.Println()

	// Recheck Available Tickets
	fmt.Println("Rechecking available tickets...")
	objectsAfter, err := client.GetAccountObjects(&account.ObjectsRequest{
		Account: w.GetAddress(),
		Type:    account.TicketObject,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Found %d Tickets\n", len(objectsAfter.AccountObjects))
}
