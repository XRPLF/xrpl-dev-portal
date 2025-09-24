package main

import (
	"fmt"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	"github.com/Peersyst/xrpl-go/xrpl/rpc/types"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	txnTypes "github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

func main() {
    cfg, err := rpc.NewClientConfig(
        "https://s.devnet.rippletest.net:51234/",
        rpc.WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
    )
    if err != nil {
        panic(err)
    }

    client := rpc.NewClient(cfg)
    fmt.Println()

    fmt.Println("Funding wallet...")

    // Create and fund the nft wallet
    nftWallet, err := wallet.New(crypto.ED25519())
    if err != nil {
        panic(err)
    }
    if err := client.FundWallet(&nftWallet); err != nil {
        panic(err)
    }
    fmt.Println("NFT wallet funded: ", nftWallet.ClassicAddress)
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
    // nftoken_id
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
