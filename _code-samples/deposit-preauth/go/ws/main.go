package main

import (
	"encoding/hex"
	"fmt"
	"time"

	"github.com/Peersyst/xrpl-go/examples/clients"
	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	rippletime "github.com/Peersyst/xrpl-go/xrpl/time"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {

    fmt.Println("Setting up client...")

    client := clients.GetDevnetWebsocketClient()
    fmt.Println("Connecting to server...")
    if err := client.Connect(); err != nil {
        panic(err)
    }

    fmt.Println("Client configured!")
    fmt.Println()

    fmt.Printf("Connection: %t", client.IsConnected())
    fmt.Println()

    // Configure wallets

    // Issuer
    fmt.Println("Setting up credential issuer wallet...")
    issuer, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }

    err = client.FundWallet(&issuer)
    if err != nil {
        panic(err)
    }
    fmt.Printf("Credential issuer wallet funded: %s\n", issuer.ClassicAddress)

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
    fmt.Printf("Holder 1 wallet funded: %s\n", holderWallet1.ClassicAddress)

    // -----------------------------------------------------

    // Enabling DepositAuth on the issuer account with an AccountSet transaction
    fmt.Println("Enabling DepositAuth on the issuer account...")
    accountSetTx := &transaction.AccountSet{
        BaseTx: transaction.BaseTx{
            Account:         issuer.ClassicAddress,
            TransactionType: transaction.AccountSetTx,
        },
    }
    accountSetTx.SetAsfDepositAuth()

    clients.SubmitTxBlobAndWait(client, accountSetTx, issuer)

    // -----------------------------------------------------

    // Creating the CredentialCreate transaction
    fmt.Println("Creating the CredentialCreate transaction...")

    expiration, err := rippletime.IsoTimeToRippleTime(time.Now().Add(time.Hour * 24).Format(time.RFC3339))
    if err != nil {
        panic(err)
    }
    credentialType := types.CredentialType("6D795F63726564656E7469616C") // my_credential

    credentialCreateTx := &transaction.CredentialCreate{
        BaseTx: transaction.BaseTx{
            Account:         issuer.ClassicAddress,
            TransactionType: transaction.CredentialCreateTx,
        },
        Expiration:     uint32(expiration),
        CredentialType: credentialType,
        Subject:        types.Address(holderWallet1.ClassicAddress),
        URI:            hex.EncodeToString([]byte("https://example.com")),
    }

    clients.SubmitTxBlobAndWait(client, credentialCreateTx, issuer)

    // -----------------------------------------------------

    // Creating the CredentialAccept transaction
    fmt.Println("Creating the CredentialAccept transaction...")

    credentialAcceptTx := &transaction.CredentialAccept{
        BaseTx: transaction.BaseTx{
            Account:         holderWallet1.ClassicAddress,
            TransactionType: transaction.CredentialAcceptTx,
        },
        CredentialType: credentialType,
        Issuer:         types.Address(issuer.ClassicAddress),
    }

    clients.SubmitTxBlobAndWait(client, credentialAcceptTx, holderWallet1)

    // -----------------------------------------------------

    // Creating the DepositPreauth transaction
    fmt.Println("Creating the DepositPreauth transaction using AuthorizeCredentials...")

    depositPreauthTx := &transaction.DepositPreauth{
        BaseTx: transaction.BaseTx{
            Account:         issuer.ClassicAddress,
            TransactionType: transaction.DepositPreauthTx,
        },
        AuthorizeCredentials: []types.AuthorizeCredentialsWrapper{
            {
                Credential: types.AuthorizeCredentials{
                    Issuer:         issuer.ClassicAddress,
                    CredentialType: credentialType,
                },
            },
        },
    }

    clients.SubmitTxBlobAndWait(client, depositPreauthTx, issuer)

    // -----------------------------------------------------

    // Get the credential ID
    fmt.Println("Getting the credential ID from the holder 1 account...")

    objectsRequest := &account.ObjectsRequest{
        Account:     holderWallet1.ClassicAddress,
        Type:        account.CredentialObject,
        LedgerIndex: common.Validated,
    }

    objectsResponse, err := client.GetAccountObjects(objectsRequest)
    if err != nil {
        panic(err)
    }

    // Check if we have any credential objects
    if len(objectsResponse.AccountObjects) == 0 {
        fmt.Println("No credential objects found")
        return
    }

    // Extract the credential ID
    credentialID, ok := objectsResponse.AccountObjects[0]["index"].(string)
    if !ok {
        fmt.Println("Could not extract credential ID from response")
        return
    }

    fmt.Printf("Credential ID: %s\n", credentialID)
    fmt.Println()

    // -----------------------------------------------------

    // Sending XRP to the holder 1 account
    fmt.Println("Sending XRP to the issuer account, should succeed...")

    sendTx := &transaction.Payment{
        BaseTx: transaction.BaseTx{
            Account:         holderWallet1.ClassicAddress,
            TransactionType: transaction.PaymentTx,
        },
        Amount:        types.XRPCurrencyAmount(1000000),
        Destination:   issuer.ClassicAddress,
        CredentialIDs: types.CredentialIDs{credentialID},
    }

    clients.SubmitTxBlobAndWait(client, sendTx, holderWallet1)

    // -----------------------------------------------------

    // Unauthorize the holder 1 account
    fmt.Println("Unauthorize the holder 1 account with the DepositPreauth transaction and the UnauthorizeCredentials field...")

    unauthorizeTx := &transaction.DepositPreauth{
        BaseTx: transaction.BaseTx{
            Account:         issuer.ClassicAddress,
            TransactionType: transaction.DepositPreauthTx,
        },
        UnauthorizeCredentials: []types.AuthorizeCredentialsWrapper{
            {
                Credential: types.AuthorizeCredentials{
                    Issuer:         issuer.ClassicAddress,
                    CredentialType: credentialType,
                },
            },
        },
    }

    clients.SubmitTxBlobAndWait(client, unauthorizeTx, issuer)

    // -----------------------------------------------------

    // Sending XRP to the holder 1 account again (which should fail)
    fmt.Println("Sending XRP to the issuer account again (which should fail)...")

    sendTx2 := &transaction.Payment{
        BaseTx: transaction.BaseTx{
            Account:         holderWallet1.ClassicAddress,
            TransactionType: transaction.PaymentTx,
        },
        Amount:        types.XRPCurrencyAmount(1000000),
        Destination:   issuer.ClassicAddress,
        CredentialIDs: types.CredentialIDs{credentialID},
    }

    clients.SubmitTxBlobAndWait(client, sendTx2, holderWallet1)
}
