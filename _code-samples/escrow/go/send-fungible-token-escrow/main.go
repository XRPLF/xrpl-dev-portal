// This example demonstrates how to create escrows that hold fungible tokens.
// It covers MPTs and Trust Line Tokens, and uses conditional and timed escrows.

package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	ledgerreq "github.com/Peersyst/xrpl-go/xrpl/queries/ledger"
	xrpltime "github.com/Peersyst/xrpl-go/xrpl/time"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
	wstypes "github.com/Peersyst/xrpl-go/xrpl/websocket/types"
	"github.com/go-interledger/cryptoconditions"
)

func main() {
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://s.altnet.rippletest.net:51233").
			WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)
	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	// Fund an issuer account and an escrow creator account ----------------------
	fmt.Printf("\n=== Funding Accounts ===\n\n")

	createAndFund := func(label string) wallet.Wallet {
		fmt.Printf("Funding %s account...\n", label)
		w, err := wallet.New(crypto.ED25519())
		if err != nil {
			panic(err)
		}
		if err := client.FundWallet(&w); err != nil {
			panic(err)
		}
		// Poll until account is validated on ledger
		funded := false
		for range 20 {
			_, err := client.Request(&account.InfoRequest{
				Account:     w.GetAddress(),
				LedgerIndex: common.Validated,
			})
			if err == nil {
				funded = true
				break
			}
			time.Sleep(time.Second)
		}
		if !funded {
			panic("Issue funding account: " + w.GetAddress().String())
		}
		return w
	}

	issuer := createAndFund("Issuer")
	creator := createAndFund("Escrow Creator")
	fmt.Printf("Issuer: %s\n", issuer.ClassicAddress)
	fmt.Printf("Escrow Creator: %s\n", creator.ClassicAddress)

	// ====== Conditional MPT Escrow ======

	// Issuer creates an MPT ----------------------
	fmt.Printf("\n=== Creating MPT ===\n\n")
	maxAmount := types.XRPCurrencyAmount(1000000)
	mptCreateTx := transaction.MPTokenIssuanceCreate{
		BaseTx: transaction.BaseTx{
			Account: issuer.ClassicAddress,
			Flags:   transaction.TfMPTCanEscrow,
		},
		MaximumAmount: &maxAmount,
	}

	// Flatten() converts the struct to a map and adds the TransactionType field
	flatMptCreateTx := mptCreateTx.Flatten()
	mptCreateTxJSON, _ := json.MarshalIndent(flatMptCreateTx, "", "  ")
	fmt.Printf("%s\n", string(mptCreateTxJSON))

	// Submit, sign, and wait for validation
	fmt.Printf("\nSubmitting MPTokenIssuanceCreate transaction...\n")
	mptCreateResponse, err := client.SubmitTxAndWait(flatMptCreateTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &issuer,
	})
	if err != nil {
		panic(err)
	}
	if mptCreateResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("MPTokenIssuanceCreate failed: %s\n", mptCreateResponse.Meta.TransactionResult)
		os.Exit(1)
	}

	// Extract the MPT issuance ID from the transaction result
	mptIssuanceID := string(*mptCreateResponse.Meta.MPTIssuanceID)
	fmt.Printf("MPT created: %s\n", mptIssuanceID)

	// Escrow Creator authorizes the MPT ----------------------
	fmt.Printf("\n=== Escrow Creator Authorizing MPT ===\n\n")
	mptAuthTx := transaction.MPTokenAuthorize{
		BaseTx: transaction.BaseTx{
			Account: creator.ClassicAddress,
		},
		MPTokenIssuanceID: mptIssuanceID,
	}

	flatMptAuthTx := mptAuthTx.Flatten()
	mptAuthTxJSON, _ := json.MarshalIndent(flatMptAuthTx, "", "  ")
	fmt.Printf("%s\n", string(mptAuthTxJSON))

	fmt.Printf("\nSubmitting MPTokenAuthorize transaction...\n")
	mptAuthResponse, err := client.SubmitTxAndWait(flatMptAuthTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &creator,
	})
	if err != nil {
		panic(err)
	}
	if mptAuthResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("MPTokenAuthorize failed: %s\n", mptAuthResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Escrow Creator authorized for MPT.\n")

	// Issuer sends MPTs to escrow creator ----------------------
	fmt.Printf("\n=== Issuer Sending MPTs to Escrow Creator ===\n\n")
	mptPaymentTx := transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: issuer.ClassicAddress,
		},
		Destination: creator.ClassicAddress,
		Amount: types.MPTCurrencyAmount{
			MPTIssuanceID: mptIssuanceID,
			Value:         "5000",
		},
	}

	flatMptPaymentTx := mptPaymentTx.Flatten()
	mptPaymentTxJSON, _ := json.MarshalIndent(flatMptPaymentTx, "", "  ")
	fmt.Printf("%s\n", string(mptPaymentTxJSON))

	fmt.Printf("\nSubmitting MPT Payment transaction...\n")
	mptPaymentResponse, err := client.SubmitTxAndWait(flatMptPaymentTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &issuer,
	})
	if err != nil {
		panic(err)
	}
	if mptPaymentResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("MPT Payment failed: %s\n", mptPaymentResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Successfully sent 5000 MPTs to Escrow Creator.\n")

	// Escrow Creator creates a conditional MPT escrow ----------------------
	fmt.Printf("\n=== Creating Conditional MPT Escrow ===\n\n")

	// Generate crypto-condition
	preimage := make([]byte, 32)
	if _, err := rand.Read(preimage); err != nil {
		panic(err)
	}
	fulfillment := cryptoconditions.NewPreimageSha256(preimage)
	fulfillmentBinary, err := fulfillment.Encode()
	if err != nil {
		panic(err)
	}
	conditionBinary, err := fulfillment.Condition().Encode()
	if err != nil {
		panic(err)
	}
	fulfillmentHex := strings.ToUpper(hex.EncodeToString(fulfillmentBinary))
	conditionHex := strings.ToUpper(hex.EncodeToString(conditionBinary))
	fmt.Printf("Condition: %s\n", conditionHex)
	fmt.Printf("Fulfillment: %s\n\n", fulfillmentHex)

	// Set expiration (300 seconds from now)
	cancelAfterRippleTime := xrpltime.UnixTimeToRippleTime(time.Now().Unix()) + 300

	mptEscrowCreateTx := transaction.EscrowCreate{
		BaseTx: transaction.BaseTx{
			Account: creator.ClassicAddress,
		},
		Destination: issuer.ClassicAddress,
		Amount: types.MPTCurrencyAmount{
			MPTIssuanceID: mptIssuanceID,
			Value:         "1000",
		},
		Condition:   conditionHex,
		CancelAfter: uint32(cancelAfterRippleTime), // Fungible token escrows require a CancelAfter time
	}

	flatMptEscrowCreateTx := mptEscrowCreateTx.Flatten()
	mptEscrowCreateTxJSON, _ := json.MarshalIndent(flatMptEscrowCreateTx, "", "  ")
	fmt.Printf("%s\n", string(mptEscrowCreateTxJSON))

	fmt.Printf("\nSubmitting MPT EscrowCreate transaction...\n")
	mptEscrowResponse, err := client.SubmitTxAndWait(flatMptEscrowCreateTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &creator,
	})
	if err != nil {
		panic(err)
	}
	if mptEscrowResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("MPT EscrowCreate failed: %s\n", mptEscrowResponse.Meta.TransactionResult)
		os.Exit(1)
	}

	// Save the sequence number to identify the escrow later
	mptEscrowSeq := mptEscrowResponse.TxJSON.Sequence()
	fmt.Printf("Conditional MPT escrow created. Sequence: %d\n", mptEscrowSeq)

	// Finish the conditional MPT escrow with the fulfillment ----------------------
	fmt.Printf("\n=== Finishing Conditional MPT Escrow ===\n\n")
	mptEscrowFinishTx := transaction.EscrowFinish{
		BaseTx: transaction.BaseTx{
			Account: creator.ClassicAddress,
		},
		Owner:         creator.ClassicAddress,
		OfferSequence: mptEscrowSeq,
		Condition:     conditionHex,
		Fulfillment:   fulfillmentHex,
	}

	flatMptEscrowFinishTx := mptEscrowFinishTx.Flatten()
	mptEscrowFinishTxJSON, _ := json.MarshalIndent(flatMptEscrowFinishTx, "", "  ")
	fmt.Printf("%s\n", string(mptEscrowFinishTxJSON))

	fmt.Printf("\nSubmitting EscrowFinish transaction...\n")
	mptFinishResponse, err := client.SubmitTxAndWait(flatMptEscrowFinishTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &creator,
	})
	if err != nil {
		panic(err)
	}
	if mptFinishResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("MPT EscrowFinish failed: %s\n", mptFinishResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Conditional MPT escrow finished successfully: https://testnet.xrpl.org/transactions/%s\n", mptFinishResponse.Hash)

	// ====== Timed Trust Line Token Escrow ======

	// Enable trust line token escrows on the issuer ----------------------
	fmt.Printf("\n=== Enabling Trust Line Token Escrows on Issuer ===\n\n")
	accountSetTx := transaction.AccountSet{
		BaseTx: transaction.BaseTx{
			Account: issuer.ClassicAddress,
		},
		SetFlag: transaction.AsfAllowTrustLineLocking,
	}

	flatAccountSetTx := accountSetTx.Flatten()
	accountSetTxJSON, _ := json.MarshalIndent(flatAccountSetTx, "", "  ")
	fmt.Printf("%s\n", string(accountSetTxJSON))

	fmt.Printf("\nSubmitting AccountSet transaction...\n")
	accountSetResponse, err := client.SubmitTxAndWait(flatAccountSetTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &issuer,
	})
	if err != nil {
		panic(err)
	}
	if accountSetResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("AccountSet failed: %s\n", accountSetResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Trust line token escrows enabled by issuer.\n")

	// Escrow Creator sets up a trust line to the issuer ----------------------
	fmt.Printf("\n=== Setting Up Trust Line ===\n\n")
	currencyCode := "IOU"

	trustSetTx := transaction.TrustSet{
		BaseTx: transaction.BaseTx{
			Account: creator.ClassicAddress,
		},
		LimitAmount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Issuer:   issuer.ClassicAddress,
			Value:    "10000000",
		},
	}

	flatTrustSetTx := trustSetTx.Flatten()
	trustSetTxJSON, _ := json.MarshalIndent(flatTrustSetTx, "", "  ")
	fmt.Printf("%s\n", string(trustSetTxJSON))

	fmt.Printf("\nSubmitting TrustSet transaction...\n")
	trustResponse, err := client.SubmitTxAndWait(flatTrustSetTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &creator,
	})
	if err != nil {
		panic(err)
	}
	if trustResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("TrustSet failed: %s\n", trustResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Trust line successfully created for \"%s\" tokens.\n", currencyCode)

	// Issuer sends IOU tokens to creator ----------------------
	fmt.Printf("\n=== Issuer Sending IOU Tokens to Escrow Creator ===\n\n")
	iouPaymentTx := transaction.Payment{
		BaseTx: transaction.BaseTx{
			Account: issuer.ClassicAddress,
		},
		Destination: creator.ClassicAddress,
		Amount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Value:    "5000",
			Issuer:   issuer.ClassicAddress,
		},
	}

	flatIouPaymentTx := iouPaymentTx.Flatten()
	iouPaymentTxJSON, _ := json.MarshalIndent(flatIouPaymentTx, "", "  ")
	fmt.Printf("%s\n", string(iouPaymentTxJSON))

	fmt.Printf("\nSubmitting Trust Line Token payment transaction...\n")
	iouPayResponse, err := client.SubmitTxAndWait(flatIouPaymentTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &issuer,
	})
	if err != nil {
		panic(err)
	}
	if iouPayResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Trust Line Token payment failed: %s\n", iouPayResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Successfully sent 5000 %s tokens.\n", currencyCode)

	// Escrow Creator creates a timed trust line token escrow ----------------------
	fmt.Printf("\n=== Creating Timed Trust Line Token Escrow ===\n\n")
	delay := 10 // seconds
	now := time.Now()
	finishAfterRippleTime := xrpltime.UnixTimeToRippleTime(now.Unix()) + int64(delay)
	matureTime := now.Add(time.Duration(delay) * time.Second).Format("01/02/2006, 03:04:05 PM")
	fmt.Printf("Escrow will mature after: %s\n\n", matureTime)

	iouCancelAfterRippleTime := xrpltime.UnixTimeToRippleTime(now.Unix()) + 300

	iouEscrowCreateTx := transaction.EscrowCreate{
		BaseTx: transaction.BaseTx{
			Account: creator.ClassicAddress,
		},
		Destination: issuer.ClassicAddress,
		Amount: types.IssuedCurrencyAmount{
			Currency: currencyCode,
			Value:    "1000",
			Issuer:   issuer.ClassicAddress,
		},
		FinishAfter: uint32(finishAfterRippleTime),
		CancelAfter: uint32(iouCancelAfterRippleTime),
	}

	flatIouEscrowCreateTx := iouEscrowCreateTx.Flatten()
	iouEscrowCreateTxJSON, _ := json.MarshalIndent(flatIouEscrowCreateTx, "", "  ")
	fmt.Printf("%s\n", string(iouEscrowCreateTxJSON))

	fmt.Printf("\nSubmitting Trust Line Token EscrowCreate transaction...\n")
	iouEscrowResponse, err := client.SubmitTxAndWait(flatIouEscrowCreateTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &creator,
	})
	if err != nil {
		panic(err)
	}
	if iouEscrowResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Trust Line Token EscrowCreate failed: %s\n", iouEscrowResponse.Meta.TransactionResult)
		os.Exit(1)
	}

	// Save the sequence number to identify the escrow later
	iouEscrowSeq := iouEscrowResponse.TxJSON.Sequence()
	fmt.Printf("Trust Line Token escrow created. Sequence: %d\n", iouEscrowSeq)

	// Wait for the escrow to mature, then finish it --------------------
	fmt.Printf("\n=== Waiting For Timed Trust Line Token Escrow to Mature ===\n\n")

	// Countdown delay until escrow matures
	for i := delay; i >= 0; i-- {
		fmt.Printf("Waiting for escrow to mature... %ds remaining...\r", i)
		time.Sleep(time.Second)
	}
	fmt.Printf("Waiting for escrow to mature... done.           \n")

	// Confirm latest validated ledger close time is after the FinishAfter time
	escrowReady := false
	for !escrowReady {
		ledgerResp, err := client.GetLedger(&ledgerreq.Request{
			LedgerIndex: common.Validated,
		})
		if err != nil {
			panic(err)
		}
		ledgerCloseTime := int64(ledgerResp.Ledger.CloseTime)
		ledgerCloseLocal := time.Unix(xrpltime.RippleTimeToUnixTime(ledgerCloseTime)/1000, 0).Format("01/02/2006, 03:04:05 PM")
		fmt.Printf("Latest validated ledger closed at: %s\n", ledgerCloseLocal)
		if ledgerCloseTime > finishAfterRippleTime {
			escrowReady = true
			fmt.Printf("Escrow confirmed ready to finish.\n")
		} else {
			timeDifference := finishAfterRippleTime - ledgerCloseTime
			if timeDifference == 0 {
				timeDifference = 1
			}
			fmt.Printf("Escrow needs to wait another %ds.\n", timeDifference)
			time.Sleep(time.Duration(timeDifference) * time.Second)
		}
	}

	// Finish the timed trust line token escrow --------------------
	fmt.Printf("\n=== Finishing Timed Trust Line Token Escrow ===\n\n")
	iouEscrowFinishTx := transaction.EscrowFinish{
		BaseTx: transaction.BaseTx{
			Account: creator.ClassicAddress,
		},
		Owner:         creator.ClassicAddress,
		OfferSequence: iouEscrowSeq,
	}

	flatIouEscrowFinishTx := iouEscrowFinishTx.Flatten()
	iouEscrowFinishTxJSON, _ := json.MarshalIndent(flatIouEscrowFinishTx, "", "  ")
	fmt.Printf("%s\n", string(iouEscrowFinishTxJSON))

	fmt.Printf("\nSubmitting EscrowFinish transaction...\n")
	iouFinishResponse, err := client.SubmitTxAndWait(flatIouEscrowFinishTx, &wstypes.SubmitOptions{
		Autofill: true,
		Wallet:   &creator,
	})
	if err != nil {
		panic(err)
	}
	if iouFinishResponse.Meta.TransactionResult != "tesSUCCESS" {
		fmt.Printf("Trust Line Token EscrowFinish failed: %s\n", iouFinishResponse.Meta.TransactionResult)
		os.Exit(1)
	}
	fmt.Printf("Timed Trust Line Token escrow finished successfully: https://testnet.xrpl.org/transactions/%s\n", iouFinishResponse.Hash)
}
