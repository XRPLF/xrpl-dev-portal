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
	// Connect to the XRPL devnet
	fmt.Println("⏳ Connecting to devnet...")
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.devnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
	)
	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		fmt.Println("❌ Error connecting to devnet:", err)
		return
	}

	if !client.IsConnected() {
		fmt.Println("❌ Failed to connect to devnet")
		return
	}
	fmt.Println("✅ Connected to devnet")
	fmt.Println()

	// Step 1: Fund wallets
	fmt.Println("⏳ Funding wallets...")

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
	fmt.Println()

	// Step 2: Mint an NFT
	fmt.Println("⏳ Minting NFT...")

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
		fmt.Println("❌ Error minting NFT:", err)
		return
	}
	if !responseMint.Validated {
		fmt.Println("❌ NFTokenMint txn is not in a validated ledger", responseMint)
		return
	}
	fmt.Println("✅ NFT minted successfully! - 🌎 Hash: ", responseMint.Hash)
	fmt.Println()

	// Step 3: Retrieve the token ID
	fmt.Println("⏳ Retrieving NFT ID...")

	metaMap, ok := responseMint.Meta.(map[string]any)
	if !ok {
		fmt.Println("❌ Meta is not a map[string]any")
		return
	}

	nftokenID, ok := metaMap["nftoken_id"].(string)
	if !ok {
		fmt.Println("❌ nftoken_id not found or not a string")
		return
	}

	fmt.Println("🌎 nftoken_id:", nftokenID)
	fmt.Println()

	// Step 4: Burn the NFT
	fmt.Println("⏳ Burn the NFT...")

	nftBurn := transaction.NFTokenBurn{
		BaseTx: transaction.BaseTx{
			Account:         nftMinter.ClassicAddress,
			TransactionType: transaction.NFTokenAcceptOfferTx,
		},
		NFTokenID: txnTypes.NFTokenID(nftokenID),
	}

	responseBurn, err := client.SubmitTxAndWait(nftBurn.Flatten(), &types.SubmitOptions{
		Autofill: true,
		Wallet:   &nftMinter,
	})
	if err != nil {
		fmt.Println("❌ Error burning NFT:", err)
		return
	}
	if !responseBurn.Validated {
		fmt.Println("❌ NFTokenBurn transactiob is not in a validated ledger", responseBurn)
		return
	}
	fmt.Println("✅ NFT burned successfully! - 🌎 Hash: ", responseBurn.Hash)
}
