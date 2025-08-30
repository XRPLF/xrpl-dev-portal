package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/currency"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	transactions "github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

const (
    currencyCode = "USDA"
)

type SubmittableTransaction interface {
    TxType() transactions.TxType
    Flatten() transactions.FlatTransaction // Ensures all transactions can be flattened
}

func main() {
    client := getRpcClient()

    // Configure wallets

    // Issuer
    fmt.Println("Setting up issuer wallet...")
    issuer, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    err = client.FundWallet(&issuer)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Issuer wallet funded: %s\n", issuer.ClassicAddress)

    // -----------------------------------------------------

    // Holder 1
    fmt.Println("Setting up holder 1 wallet...")
    holderWallet1, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    err = client.FundWallet(&holderWallet1)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Holder wallet 1 funded: %s\n", holderWallet1.ClassicAddress)

    // -----------------------------------------------------

    // Holder 2
    fmt.Println("Setting up holder 2 wallet...")
    holderWallet2, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    err = client.FundWallet(&holderWallet2)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Holder wallet 2 funded: %s\n", holderWallet2.ClassicAddress)
    fmt.Println()

    fmt.Println("Wallets setup complete!")
    fmt.Println()

    // -----------------------------------------------------

    // Configuring Issuing account
    fmt.Println("Configuring issuer address settings...")
    accountSet := &transactions.AccountSet{
        BaseTx: transactions.BaseTx{
            Account: types.Address(issuer.ClassicAddress),
        },
        Domain: types.Domain("697373756572"), // issuer
    }

    accountSet.SetAsfDefaultRipple()
    submitAndWait(client, accountSet, issuer)

    // -----------------------------------------------------

    // Trustline from the holder 1 to the issuer
    fmt.Println("Setting up trustline from holder 1 to the issuer...")
    trustSet := &transactions.TrustSet{
        BaseTx: transactions.BaseTx{
            Account: types.Address(holderWallet1.ClassicAddress),
        },
        LimitAmount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "1000000000",
        }}
    trustSet.SetSetNoRippleFlag()
    submitAndWait(client, trustSet, holderWallet1)

    // -----------------------------------------------------

    // Trustline from the holder 2 to the issuer
    fmt.Println("Setting up trustline from holder 2 to the issuer...")
    trustSet = &transactions.TrustSet{
        BaseTx: transactions.BaseTx{
            Account: types.Address(holderWallet2.ClassicAddress),
        },
        LimitAmount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "1000000000",
        },
    }
    trustSet.SetSetNoRippleFlag()
    submitAndWait(client, trustSet, holderWallet2)

    // -----------------------------------------------------

    // Minting to Holder 1
    fmt.Println("Minting to Holder 1...")
    payment := &transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account: types.Address(issuer.ClassicAddress),
        },
        Destination: types.Address(holderWallet1.ClassicAddress),
        Amount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "50000",
        },
    }
    submitAndWait(client, payment, issuer)

    // -----------------------------------------------------

    // Minting to Holder 2
    fmt.Println("Minting to Holder 2...")
    payment = &transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account: types.Address(issuer.ClassicAddress),
        },
        Destination: types.Address(holderWallet2.ClassicAddress),
        Amount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "40000",
        },
    }
    submitAndWait(client, payment, issuer)

    // -----------------------------------------------------

    // Sending payment from Holder 1 to Holder 2
    fmt.Println("Sending payment from Holder 1 to Holder 2...")
    payment = &transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account: types.Address(holderWallet1.ClassicAddress),
        },
        Destination: types.Address(holderWallet2.ClassicAddress),
        Amount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "20",
        },
    }
    submitAndWait(client, payment, holderWallet1)

    // -----------------------------------------------------

    // Freezing and Deep Freezing holder1
    fmt.Println("Freezing and Deep Freezing holder 1 trustline...")
    trustSet = &transactions.TrustSet{
        BaseTx: transactions.BaseTx{
            Account: types.Address(issuer.ClassicAddress),
        },
        LimitAmount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(holderWallet1.ClassicAddress),
            Value:    "0",
        },
    }
    trustSet.SetSetFreezeFlag()
    trustSet.SetSetDeepFreezeFlag()

    submitAndWait(client, trustSet, issuer)

    // ------------------- SHOULD FAIL ------------------

    // Sending payment from Holder 1 to Holder 2 (which should fail), Holder 1 can't decrease its balance
    fmt.Println("Sending payment from Holder 1 to Holder 2 (which should fail). Holder 1 can't decrease its balance...")
    payment = &transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account: types.Address(holderWallet1.ClassicAddress),
        },
        Destination: types.Address(holderWallet2.ClassicAddress),
        Amount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "10",
        },
    }
    submitAndWait(client, payment, holderWallet1)

    // ------------------- SHOULD FAIL ------------------

    // Sending payment from Holder 2 to Holder 1 (which should fail), Holder 1 can't increase its balance
    fmt.Println("Sending payment from Holder 2 to Holder 1 (which should fail). Holder 1 can't increase its balance...")
    payment = &transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account: types.Address(holderWallet2.ClassicAddress),
        },
        Destination: types.Address(holderWallet1.ClassicAddress),
        Amount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "10",
        },
    }
    submitAndWait(client, payment, holderWallet2)

    // ------------------- SHOULD FAIL ------------------

    // Creating OfferCreate transaction (which should fail), Holder 1 can't create an offer
    fmt.Println("Creating OfferCreate transaction (which should fail). Holder 1 can't create an offer...")
    offerCreate := &transactions.OfferCreate{
        BaseTx: transactions.BaseTx{
            Account: types.Address(holderWallet1.ClassicAddress),
        },
        TakerPays: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "10",
        },
        TakerGets: types.XRPCurrencyAmount(10),
    }
    submitAndWait(client, offerCreate, holderWallet1)

    // -----------------------------------------------------

    // Unfreezing and Deep Unfreezing holder 1
    fmt.Println("Unfreezing and Deep Unfreezing holder 1 trustline...")
    trustSet = &transactions.TrustSet{
        BaseTx: transactions.BaseTx{
            Account: types.Address(issuer.ClassicAddress),
        },
        LimitAmount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(holderWallet1.ClassicAddress),
            Value:    "0",
        },
    }
    trustSet.SetClearFreezeFlag()
    trustSet.SetClearDeepFreezeFlag()
    submitAndWait(client, trustSet, issuer)

    // -----------------------------------------------------

    // Sending payment from Holder 1 to Holder 2 (which should succeed), Holder 1 can decrease its balance
    fmt.Println("Sending payment from Holder 1 to Holder 2 (which should succeed). Holder 1 can decrease its balance...")
    payment = &transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account: types.Address(holderWallet1.ClassicAddress),
        },
        Destination: types.Address(holderWallet2.ClassicAddress),
        Amount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "10",
        },
    }
    submitAndWait(client, payment, holderWallet1)

    // -----------------------------------------------------

    // Sending payment from Holder 2 to Holder 1 (which should succeed), Holder 1 can increase its balance
    fmt.Println("Sending payment from Holder 2 to Holder 1 (which should succeed). Holder 1 can increase its balance...")
    payment = &transactions.Payment{
        BaseTx: transactions.BaseTx{
            Account: types.Address(holderWallet2.ClassicAddress),
        },
        Destination: types.Address(holderWallet1.ClassicAddress),
        Amount: types.IssuedCurrencyAmount{
            Currency: currency.ConvertStringToHex(currencyCode),
            Issuer:   types.Address(issuer.ClassicAddress),
            Value:    "10",
        },
    }
    submitAndWait(client, payment, holderWallet2)
}

// getRpcClient returns a new rpc client
func getRpcClient() *rpc.Client {
    cfg, err := rpc.NewClientConfig(
        // DeepFreeze only available on Devnet as of February 2025, change to testnet/mainnet once the amendment passes.
        "https://s.devnet.rippletest.net:51234",
        rpc.WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
    )
    if err != nil {
        panic(err)
    }

    return rpc.NewClient(cfg)
}

// submitAndWait submits a transaction and waits for it to be included in a validated ledger
func submitAndWait(client *rpc.Client, txn SubmittableTransaction, wallet wallet.Wallet) {
    fmt.Printf("Submitting %s transaction...\n", txn.TxType())

    flattenedTx := txn.Flatten()

    err := client.Autofill(&flattenedTx)
    if err != nil {
        panic(err)
    }

    txBlob, _, err := wallet.Sign(flattenedTx)
    if err != nil {
        panic(err)
    }

    response, err := client.SubmitTxBlobAndWait(txBlob, false)
    if err != nil {
        panic(err)
    }

    fmt.Printf("%s transaction submitted\n", txn.TxType())
    fmt.Printf("Hash: %s\n", response.Hash.String())
    fmt.Println()
}
