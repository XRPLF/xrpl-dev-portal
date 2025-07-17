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
	// Initialize the RPC client configuration
	cfg, err := rpc.NewClientConfig(
		"https://s.devnet.rippletest.net:51234/",
		rpc.WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
	)
	if err != nil {
		panic(err)
	}

	// Create the RPC client
	client := rpc.NewClient(cfg)

	// Step 1: Fund wallet
	fmt.Println("⏳ Funding wallet...")

	// Create and fund the NFT minter wallet
	nftMinter, err := wallet.New(crypto.ED25519())
	if err != nil {
		fmt.Println("❌ Error creating NFT minter wallet:", err)
		return
	}
	if err := client.FundWallet(&nftMinter); err != nil {
		fmt.Println("❌ Error funding NFT minter wallet:", err)
		return
	}
	fmt.Println("💸 NFT minter wallet funded!")

	// Step 2: Mint two NFTs
	fmt.Println("⏳ Minting first NFT...")

	nftMint := transaction.NFTokenMint{
		BaseTx: transaction.BaseTx{
			Account:         nftMinter.ClassicAddress,
			TransactionType: transaction.NFTokenMintTx,
		},
		NFTokenTaxon: 0,
		URI:          txnTypes.NFTokenURI("68747470733A2F2F676F6F676C652E636F6D"), // https://google.com
	}
	nftMint.SetTransferableFlag()

	responseMint, err := client.SubmitTxAndWait(nftMint.Flatten(), &types.SubmitOptions{
		Autofill: true,
		Wallet:   &nftMinter,
	})
	if err != nil {
		fmt.Println("❌ Error minting first NFT:", err)
		return
	}
	if !responseMint.Validated {
		fmt.Println("❌ First NFTokenMint transaction is not in a validated ledger", responseMint)
		return
	}
	fmt.Println("✅ First NFT minted successfully! - 🌎 Hash: ", responseMint.Hash)
	fmt.Println()

	// Step 3: Retrieve the NFT token ID
	fmt.Println("⏳ Retrieving NFT ID...")

	metaMap, ok := responseMint.Meta.(map[string]any)
	if !ok {
		fmt.Println("❌ Meta is not a map[string]any")
		return
	}

	nftokenID1, ok := metaMap["nftoken_id"].(string)
	if !ok {
		fmt.Println("❌ nftoken_id not found or not a string")
		return
	}

	fmt.Println("🌎 nftoken_id:", nftokenID1)
	fmt.Println()

	// ------

	fmt.Println("⏳ Minting second NFT...")

	nftMint2 := transaction.NFTokenMint{
		BaseTx: transaction.BaseTx{
			Account:         nftMinter.ClassicAddress,
			TransactionType: transaction.NFTokenMintTx,
		},
		NFTokenTaxon: 0,
		URI:          txnTypes.NFTokenURI("68747470733A2F2F676F6F676C652E636F6D"), // https://google.com
	}
	nftMint2.SetTransferableFlag()

	responseMint2, err := client.SubmitTxAndWait(nftMint2.Flatten(), &types.SubmitOptions{
		Autofill: true,
		Wallet:   &nftMinter,
	})
	if err != nil {
		fmt.Println("❌ Error minting second NFT:", err)
		return
	}
	if !responseMint.Validated {
		fmt.Println("❌ Second NFTokenMint transaction is not in a validated ledger", responseMint)
		return
	}
	fmt.Println("✅ Second NFT minted successfully! - 🌎 Hash: ", responseMint.Hash)
	fmt.Println()

	// Step 3: Retrieve the second NFT token ID
	fmt.Println("⏳ Retrieving second NFT ID...")

	metaMap2, ok := responseMint2.Meta.(map[string]any)
	if !ok {
		fmt.Println("❌ Meta is not a map[string]any")
		return
	}

	nftokenID2, ok := metaMap2["nftoken_id"].(string)
	if !ok {
		fmt.Println("❌ nftoken_id not found or not a string")
		return
	}

	fmt.Println("🌎 nftoken_id:", nftokenID2)
	fmt.Println()

	// Step 4: Cancel the NFT offers
	fmt.Println("⏳ Canceling NFT offers...")

	nftCancel := transaction.NFTokenCancelOffer{
		BaseTx: transaction.BaseTx{
			Account:         nftMinter.ClassicAddress,
			TransactionType: transaction.NFTokenAcceptOfferTx,
		},
		NFTokenOffers: []txnTypes.NFTokenID{
			txnTypes.NFTokenID(nftokenID1),
			txnTypes.NFTokenID(nftokenID2),
		},
	}

	response, err := client.SubmitTxAndWait(nftCancel.Flatten(), &types.SubmitOptions{
		Autofill: true,
		Wallet:   &nftMinter,
	})
	if err != nil {
		fmt.Println("❌ Error canceling NFT offers:", err)
		return
	}
	if !response.Validated {
		fmt.Println("❌ NFTokenCancelOffer transaction is not in a validated ledger", response)
		return
	}
	fmt.Println("✅ NFT offers canceled successfully! - 🌎 Hash: ", response.Hash)
}
