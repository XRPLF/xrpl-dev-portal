package main

import (
	"encoding/hex"
	"fmt"
	"strconv"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/currency"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	transactions "github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {
	w, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}

	receiverWallet, err := wallet.New(crypto.ED25519())
	if err != nil {
		panic(err)
	}

	cfg, err := rpc.NewClientConfig(
		"https://s.altnet.rippletest.net:51234/",
		rpc.WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)
	if err != nil {
		panic(err)
	}

	client := rpc.NewClient(cfg)

	// Use fresh funded accounts so shared test-account flags and balances cannot
	// interfere with the example. The new destination does not require a tag.
	fmt.Println("Funding wallets...")
	if err := client.FundWallet(&w); err != nil {
		panic(err)
	}
	if err := client.FundWallet(&receiverWallet); err != nil {
		panic(err)
	}
	fmt.Println("Wallets funded")

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

	if response.Meta.TransactionResult != "tesSUCCESS" {
		panic(fmt.Sprintf("Payment failed: %s", response.Meta.TransactionResult))
	}

	fmt.Println("Payment submitted")
	fmt.Printf("Hash: %s\n", response.Hash.String())
	fmt.Printf("Validated: %t\n", response.Validated)
}
