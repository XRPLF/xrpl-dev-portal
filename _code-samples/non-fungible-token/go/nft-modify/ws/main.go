package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	txnTypes "github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
	"github.com/Peersyst/xrpl-go/xrpl/websocket/types"
)

func main() {
    fmt.Println("Connecting to devnet...")
    client := websocket.NewClient(
        websocket.NewClientConfig().
            WithHost("wss://s.devnet.rippletest.net:51233").
            WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
    )

    defer client.Disconnect()

    if err := client.Connect(); err != nil {
        panic(err)
    }

    if !client.IsConnected() {
        fmt.Println("Failed to connect to devnet")
        return
    }

    fmt.Println("Connected to devnet")
    fmt.Println()

    // Create and fund the nft wallet
    fmt.Println("Funding wallet...")
    nftWallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }
    if err := client.FundWallet(&nftWallet); err != nil {
        panic(err)
    }
    fmt.Println("NFT wallet funded!")
    fmt.Println()

    // Mint NFT
    nftMint := transaction.NFTokenMint{
        BaseTx: transaction.BaseTx{
            Account:         nftWallet.ClassicAddress,
            TransactionType: transaction.NFTokenMintTx,
        },
        NFTokenTaxon: 0,
        URI:          txnTypes.NFTokenURI("68747470733A2F2F676F6F676C652E636F6D"), // https://google.com
    }
    nftMint.SetMutableFlag()
    nftMint.SetTransferableFlag()

    responseMint, err := client.SubmitTxAndWait(nftMint.Flatten(), &types.SubmitOptions{
        Autofill: true,
        Wallet:   &nftWallet,
    })
    if err != nil {
        panic(err)
    }
    if !responseMint.Validated {
        fmt.Println("NFTokenMint txn is not in a validated ledger", responseMint)
        return
    }
    fmt.Println("NFT minted successfully! - Hash: ", responseMint.Hash)
    fmt.Println()

    metaMap, ok := responseMint.Meta.(map[string]any)
    if !ok {
        fmt.Println("Meta is not a map[string]any")
        return
    }

    nftokenID, ok := metaMap["nftoken_id"].(string)
    if !ok {
        fmt.Println("nftoken_id not found or not a string")
        return
    }

    fmt.Println("nftoken_id:", nftokenID)
    fmt.Println()

    // Update NFT
    nftModify := transaction.NFTokenModify{
        BaseTx: transaction.BaseTx{
            Account:         nftWallet.ClassicAddress,
            TransactionType: transaction.NFTokenModifyTx,
        },
        URI:       "68747470733A2F2F7961686F6F2E636F6D", // https://yahoo.com
        NFTokenID: txnTypes.NFTokenID(nftokenID),
    }

    responseModify, err := client.SubmitTxAndWait(nftModify.Flatten(), &types.SubmitOptions{
        Autofill: true,
        Wallet:   &nftWallet,
    })
    if err != nil {
        panic(err)
    }
    if !responseModify.Validated {
        fmt.Println("NFTokenModify txn is not in a validated ledger", responseModify)
        return
    }
    fmt.Println("NFT URI modified successfully! - Hash: ", responseModify.Hash)
}
