// Setup script for lending protocol tutorials

package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"time"

	binarycodec "github.com/Peersyst/xrpl-go/binary-codec"
	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	rpctypes "github.com/Peersyst/xrpl-go/xrpl/rpc/types"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

// ptr returns a pointer to the given value.
func ptr[T any](v T) *T { return &v }

// metaToMap converts any value to a generic map via JSON round-tripping.
func metaToMap(v any) map[string]any {
	b, _ := json.Marshal(v)
	var m map[string]any
	json.Unmarshal(b, &m)
	return m
}

// findCreatedNode finds the first CreatedNode with the given LedgerEntryType in AffectedNodes.
func findCreatedNode(meta map[string]any, ledgerEntryType string) map[string]any {
	for _, node := range meta["AffectedNodes"].([]any) {
		nodeMap := node.(map[string]any)
		if created, ok := nodeMap["CreatedNode"].(map[string]any); ok {
			if created["LedgerEntryType"] == ledgerEntryType {
				return created
			}
		}
	}
	return nil
}

// submitAndWait submits a transaction with autofill enabled and returns the meta.
func submitAndWait(client *rpc.Client, flatTx transaction.FlatTransaction, w *wallet.Wallet) (any, map[string]any) {
	resp, err := client.SubmitTxAndWait(flatTx, &rpctypes.SubmitOptions{
		Autofill: true,
		Wallet:   w,
	})
	if err != nil {
		panic(err)
	}
	return resp, metaToMap(resp.Meta)
}

// submitRawAndWait manually autofills, signs, and submits a raw FlatTransaction.
// Use this for transaction types whose fields are not fully supported by the
// library's Autofill (e.g., VaultCreate/VaultDeposit with MPT Asset fields).
func submitRawAndWait(client *rpc.Client, flatTx transaction.FlatTransaction, w *wallet.Wallet) (any, map[string]any) {
	// Manually autofill: Fee, Sequence, LastLedgerSequence
	acctInfo, err := client.Request(&account.InfoRequest{
		Account:     w.GetAddress(),
		LedgerIndex: common.Current,
	})
	if err != nil {
		panic(err)
	}
	acctMap := metaToMap(acctInfo)
	acctResult := acctMap["result"].(map[string]any)
	acctData := acctResult["account_data"].(map[string]any)
	seq := uint32(acctData["Sequence"].(float64))
	ledgerIdx := uint32(acctResult["ledger_index"].(float64))

	flatTx["Fee"] = "1"
	flatTx["Sequence"] = seq
	flatTx["LastLedgerSequence"] = ledgerIdx + 32

	// Sign and encode
	blob, _, err := w.Sign(flatTx)
	if err != nil {
		panic(err)
	}

	// Submit and wait for validation
	resp, err := client.SubmitTxBlobAndWait(blob, false)
	if err != nil {
		panic(err)
	}
	return resp, metaToMap(resp.Meta)
}

func main() {
	fmt.Print("Setting up tutorial: 0/6\r")

	// Connect to devnet
	cfg, err := rpc.NewClientConfig(
		"https://s.devnet.rippletest.net:51234",
		rpc.WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
	)
	if err != nil {
		panic(err)
	}
	client := rpc.NewClient(cfg)

	// Create and fund wallets concurrently
	createAndFund := func(ch chan<- wallet.Wallet) {
		w, err := wallet.New(crypto.ED25519())
		if err != nil {
			panic(err)
		}
		if err := client.FundWallet(&w); err != nil {
			panic(err)
		}
		// Poll until funded on-ledger (FundWallet returns before validation)
		for range 20 {
			_, err := client.Request(&account.InfoRequest{
				Account:     w.GetAddress(),
				LedgerIndex: common.Validated,
			})
			if err == nil {
				break
			}
			time.Sleep(time.Second)
		}
		ch <- w
	}

	lbWalletCh := make(chan wallet.Wallet, 1)
	brWalletCh := make(chan wallet.Wallet, 1)
	depWalletCh := make(chan wallet.Wallet, 1)
	credWalletCh := make(chan wallet.Wallet, 1)

	go createAndFund(lbWalletCh)
	go createAndFund(brWalletCh)
	go createAndFund(depWalletCh)
	go createAndFund(credWalletCh)

	loanBrokerWallet := <-lbWalletCh
	borrowerWallet := <-brWalletCh
	depositorWallet := <-depWalletCh
	credIssuerWallet := <-credWalletCh

	fmt.Printf("Loan Broker:  %s\n", loanBrokerWallet.ClassicAddress)
	fmt.Printf("Borrower:     %s\n", borrowerWallet.ClassicAddress)
	fmt.Printf("Depositor:    %s\n", depositorWallet.ClassicAddress)
	fmt.Printf("Cred Issuer:  %s\n", credIssuerWallet.ClassicAddress)

	fmt.Print("Setting up tutorial: 1/6\r")

	// Issue MPT with depositor
	// Create tickets for later use with loanBroker
	// Set up credentials and domain with credentialIssuer
	credentialType := hex.EncodeToString([]byte("KYC-Verified"))

	mptData := types.ParsedMPTokenMetadata{
		Ticker:     "TSTUSD",
		Name:       "Test USD MPT",
		Desc:       ptr("A sample non-yield-bearing stablecoin backed by U.S. Treasuries."),
		Icon:       "https://example.org/tstusd-icon.png",
		AssetClass: "rwa",
		IssuerName: "Example Treasury Reserve Co.",
	}
	mptMetadataHex, err := types.EncodeMPTokenMetadata(mptData)
	if err != nil {
		panic(err)
	}

	// Submit ticket create, MPT issuance, and credentials batch concurrently
	type txResult struct {
		resp any
		meta map[string]any
	}

	ticketCh := make(chan txResult, 1)
	mptCh := make(chan txResult, 1)
	credCh := make(chan txResult, 1)

	// Ticket create
	go func() {
		ticketTx := (&transaction.TicketCreate{
			BaseTx: transaction.BaseTx{
				Account:         loanBrokerWallet.GetAddress(),
				TransactionType: transaction.TicketCreateTx,
			},
			TicketCount: 2,
		}).Flatten()
		resp, meta := submitAndWait(client, ticketTx, &loanBrokerWallet)
		ticketCh <- txResult{resp, meta}
	}()

	// MPT issuance
	go func() {
		mptTx := (&transaction.MPTokenIssuanceCreate{
			BaseTx: transaction.BaseTx{
				Account:         depositorWallet.GetAddress(),
				TransactionType: transaction.MPTokenIssuanceCreateTx,
				Flags:           0x00000020 | 0x00000040 | 0x00000010, // tfMPTCanTransfer | tfMPTCanClawback | tfMPTCanTrade
			},
			MaximumAmount:   ptr(types.XRPCurrencyAmount(100000000)),
			TransferFee:     ptr(uint16(0)),
			MPTokenMetadata: &mptMetadataHex,
		}).Flatten()
		resp, meta := submitAndWait(client, mptTx, &depositorWallet)
		mptCh <- txResult{resp, meta}
	}()

	// Credentials batch
	go func() {
		credBatch := &transaction.Batch{
			BaseTx: transaction.BaseTx{
				Account:         credIssuerWallet.GetAddress(),
				TransactionType: transaction.BatchTx,
			},
			RawTransactions: []types.RawTransaction{
				{RawTransaction: (&transaction.CredentialCreate{
					BaseTx: transaction.BaseTx{
						Account: credIssuerWallet.GetAddress(),
						Flags:   types.TfInnerBatchTxn,
					},
					CredentialType: types.CredentialType(credentialType),
					Subject:        loanBrokerWallet.GetAddress(),
				}).Flatten()},
				{RawTransaction: (&transaction.CredentialCreate{
					BaseTx: transaction.BaseTx{
						Account: credIssuerWallet.GetAddress(),
						Flags:   types.TfInnerBatchTxn,
					},
					CredentialType: types.CredentialType(credentialType),
					Subject:        borrowerWallet.GetAddress(),
				}).Flatten()},
				{RawTransaction: (&transaction.CredentialCreate{
					BaseTx: transaction.BaseTx{
						Account: credIssuerWallet.GetAddress(),
						Flags:   types.TfInnerBatchTxn,
					},
					CredentialType: types.CredentialType(credentialType),
					Subject:        depositorWallet.GetAddress(),
				}).Flatten()},
				{RawTransaction: (&transaction.PermissionedDomainSet{
					BaseTx: transaction.BaseTx{
						Account: credIssuerWallet.GetAddress(),
						Flags:   types.TfInnerBatchTxn,
					},
					AcceptedCredentials: types.AuthorizeCredentialList{
						{
							Credential: types.Credential{
								Issuer:         credIssuerWallet.GetAddress(),
								CredentialType: types.CredentialType(credentialType),
							},
						},
					},
				}).Flatten()},
			},
		}
		credBatch.SetAllOrNothingFlag()

		resp, meta := submitAndWait(client, credBatch.Flatten(), &credIssuerWallet)
		credCh <- txResult{resp, meta}
	}()

	ticketResult := <-ticketCh
	mptResult := <-mptCh
	<-credCh

	// Extract ticket sequence numbers
	var tickets []int
	affectedNodes := ticketResult.meta["AffectedNodes"].([]any)
	for _, node := range affectedNodes {
		nodeMap := node.(map[string]any)
		if created, ok := nodeMap["CreatedNode"].(map[string]any); ok {
			if created["LedgerEntryType"] == "Ticket" {
				newFields := created["NewFields"].(map[string]any)
				ticketSeq := int(newFields["TicketSequence"].(float64))
				tickets = append(tickets, ticketSeq)
			}
		}
	}

	// Extract MPT issuance ID
	mptID := mptResult.meta["mpt_issuance_id"].(string)

	// Get domain ID
	credIssuerObjects, err := client.Request(&account.ObjectsRequest{
		Account:     credIssuerWallet.GetAddress(),
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}

	objMap := metaToMap(credIssuerObjects)
	resultMap := objMap["result"].(map[string]any)
	accountObjects := resultMap["account_objects"].([]any)
	var domainID string
	for _, obj := range accountObjects {
		objData := obj.(map[string]any)
		if objData["LedgerEntryType"] == "PermissionedDomain" {
			domainID = objData["index"].(string)
			break
		}
	}

	fmt.Print("Setting up tutorial: 2/6\r")

	// Accept credentials and authorize MPT for each account
	lbCredCh := make(chan struct{}, 1)
	brCredCh := make(chan struct{}, 1)
	depCredCh := make(chan struct{}, 1)

	// Loan broker: accept credential + authorize MPT
	go func() {
		lbBatch := &transaction.Batch{
			BaseTx: transaction.BaseTx{
				Account:         loanBrokerWallet.GetAddress(),
				TransactionType: transaction.BatchTx,
			},
			RawTransactions: []types.RawTransaction{
				{RawTransaction: (&transaction.CredentialAccept{
					BaseTx: transaction.BaseTx{
						Account: loanBrokerWallet.GetAddress(),
						Flags:   types.TfInnerBatchTxn,
					},
					CredentialType: types.CredentialType(credentialType),
					Issuer:         credIssuerWallet.GetAddress(),
				}).Flatten()},
				{RawTransaction: (&transaction.MPTokenAuthorize{
					BaseTx: transaction.BaseTx{
						Account: loanBrokerWallet.GetAddress(),
						Flags:   types.TfInnerBatchTxn,
					},
					MPTokenIssuanceID: mptID,
				}).Flatten()},
			},
		}
		lbBatch.SetAllOrNothingFlag()
		submitAndWait(client, lbBatch.Flatten(), &loanBrokerWallet)
		lbCredCh <- struct{}{}
	}()

	// Borrower: accept credential + authorize MPT
	go func() {
		brBatch := &transaction.Batch{
			BaseTx: transaction.BaseTx{
				Account:         borrowerWallet.GetAddress(),
				TransactionType: transaction.BatchTx,
			},
			RawTransactions: []types.RawTransaction{
				{RawTransaction: (&transaction.CredentialAccept{
					BaseTx: transaction.BaseTx{
						Account: borrowerWallet.GetAddress(),
						Flags:   types.TfInnerBatchTxn,
					},
					CredentialType: types.CredentialType(credentialType),
					Issuer:         credIssuerWallet.GetAddress(),
				}).Flatten()},
				{RawTransaction: (&transaction.MPTokenAuthorize{
					BaseTx: transaction.BaseTx{
						Account: borrowerWallet.GetAddress(),
						Flags:   types.TfInnerBatchTxn,
					},
					MPTokenIssuanceID: mptID,
				}).Flatten()},
			},
		}
		brBatch.SetAllOrNothingFlag()
		submitAndWait(client, brBatch.Flatten(), &borrowerWallet)
		brCredCh <- struct{}{}
	}()

	// Depositor: accept credential only
	go func() {
		credAcceptTx := (&transaction.CredentialAccept{
			BaseTx: transaction.BaseTx{
				Account:         depositorWallet.GetAddress(),
				TransactionType: transaction.CredentialAcceptTx,
			},
			CredentialType: types.CredentialType(credentialType),
			Issuer:         credIssuerWallet.GetAddress(),
		}).Flatten()
		submitAndWait(client, credAcceptTx, &depositorWallet)
		depCredCh <- struct{}{}
	}()

	<-lbCredCh
	<-brCredCh
	<-depCredCh

	fmt.Print("Setting up tutorial: 3/6\r")

	// Create private vault and distribute MPT to accounts concurrently.
	// VaultCreate is not yet available as a Go struct, so we use a raw FlatTransaction.
	vaultCh := make(chan txResult, 1)
	distCh := make(chan struct{}, 1)

	go func() {
		vaultCreateTx := transaction.FlatTransaction{
			"TransactionType": "VaultCreate",
			"Account":         loanBrokerWallet.GetAddress().String(),
			"Asset":           map[string]any{"mpt_issuance_id": mptID},
			"Flags":           uint32(0x00000001), // tfVaultPrivate
			"DomainID":        domainID,
		}
		resp, meta := submitRawAndWait(client, vaultCreateTx, &loanBrokerWallet)
		vaultCh <- txResult{resp, meta}
	}()

	go func() {
		mptAmount := func(value string) map[string]any {
			return map[string]any{
				"mpt_issuance_id": mptID,
				"value":           value,
			}
		}
		distBatch := &transaction.Batch{
			BaseTx: transaction.BaseTx{
				Account:         depositorWallet.GetAddress(),
				TransactionType: transaction.BatchTx,
			},
			RawTransactions: []types.RawTransaction{
				{RawTransaction: transaction.FlatTransaction{
					"TransactionType": "Payment",
					"Account":         depositorWallet.GetAddress().String(),
					"Destination":     loanBrokerWallet.GetAddress().String(),
					"Amount":          mptAmount("5000"),
					"Flags":           types.TfInnerBatchTxn,
				}},
				{RawTransaction: transaction.FlatTransaction{
					"TransactionType": "Payment",
					"Account":         depositorWallet.GetAddress().String(),
					"Destination":     borrowerWallet.GetAddress().String(),
					"Amount":          mptAmount("2500"),
					"Flags":           types.TfInnerBatchTxn,
				}},
			},
		}
		distBatch.SetAllOrNothingFlag()
		submitAndWait(client, distBatch.Flatten(), &depositorWallet)
		distCh <- struct{}{}
	}()

	vaultResult := <-vaultCh
	<-distCh

	vaultNode := findCreatedNode(vaultResult.meta, "Vault")
	vaultID := vaultNode["LedgerIndex"].(string)

	fmt.Print("Setting up tutorial: 4/6\r")

	// Create LoanBroker and deposit MPT into vault
	lbSetCh := make(chan txResult, 1)
	vaultDepCh := make(chan struct{}, 1)

	go func() {
		lbSetTx := (&transaction.LoanBrokerSet{
			BaseTx: transaction.BaseTx{
				Account:         loanBrokerWallet.GetAddress(),
				TransactionType: transaction.LoanBrokerSetTx,
			},
			VaultID: vaultID,
		}).Flatten()
		resp, meta := submitAndWait(client, lbSetTx, &loanBrokerWallet)
		lbSetCh <- txResult{resp, meta}
	}()

	go func() {
		// VaultDeposit is not yet available as a Go struct, so we use a raw FlatTransaction.
		vaultDepositTx := transaction.FlatTransaction{
			"TransactionType": "VaultDeposit",
			"Account":         depositorWallet.GetAddress().String(),
			"VaultID":         vaultID,
			"Amount": map[string]any{
				"mpt_issuance_id": mptID,
				"value":           "50000000",
			},
		}
		submitRawAndWait(client, vaultDepositTx, &depositorWallet)
		vaultDepCh <- struct{}{}
	}()

	lbSetResult := <-lbSetCh
	<-vaultDepCh

	loanBrokerNode := findCreatedNode(lbSetResult.meta, "LoanBroker")
	loanBrokerID := loanBrokerNode["LedgerIndex"].(string)

	fmt.Print("Setting up tutorial: 5/6\r")

	// Create 2 identical loans with complete repayment due in 30 days

	// Helper function to create, sign, and submit a LoanSet transaction
	createLoan := func(ticketSequence int) map[string]any {
		counterparty := borrowerWallet.GetAddress()
		loanSetTx := &transaction.LoanSet{
			BaseTx: transaction.BaseTx{
				Account:         loanBrokerWallet.GetAddress(),
				TransactionType: transaction.LoanSetTx,
				Sequence:        0,
				TicketSequence:  uint32(ticketSequence),
			},
			LoanBrokerID:       loanBrokerID,
			PrincipalRequested: "1000",
			Counterparty:       &counterparty,
			InterestRate:       ptr(types.InterestRate(500)),
			PaymentTotal:       ptr(types.PaymentTotal(1)),
			PaymentInterval:    ptr(types.PaymentInterval(2592000)),
			LoanOriginationFee: ptr(types.XRPLNumber("100")),
			LoanServiceFee:     ptr(types.XRPLNumber("10")),
		}

		flatTx := transaction.FlatTransaction(loanSetTx.Flatten())
		if err := client.Autofill(&flatTx); err != nil {
			panic(err)
		}

		// Loan broker signs first
		_, _, err := loanBrokerWallet.Sign(flatTx)
		if err != nil {
			panic(err)
		}
		lbPubKey := flatTx["SigningPubKey"].(string)
		lbSig := flatTx["TxnSignature"].(string)

		// Borrower signs second
		_, _, err = borrowerWallet.Sign(flatTx)
		if err != nil {
			panic(err)
		}
		borrowerPubKey := flatTx["SigningPubKey"].(string)
		borrowerSig := flatTx["TxnSignature"].(string)

		// Restore loan broker's signature, add counterparty signature
		flatTx["SigningPubKey"] = lbPubKey
		flatTx["TxnSignature"] = lbSig
		flatTx["CounterpartySignature"] = map[string]any{
			"SigningPubKey": borrowerPubKey,
			"TxnSignature":  borrowerSig,
		}

		// Encode and submit
		blob, err := binarycodec.Encode(flatTx)
		if err != nil {
			panic(err)
		}
		resp, err := client.SubmitTxBlobAndWait(blob, false)
		if err != nil {
			panic(err)
		}
		return metaToMap(resp.Meta)
	}

	loan1Ch := make(chan map[string]any, 1)
	loan2Ch := make(chan map[string]any, 1)

	go func() { loan1Ch <- createLoan(tickets[0]) }()
	go func() { loan2Ch <- createLoan(tickets[1]) }()

	loan1Meta := <-loan1Ch
	loan2Meta := <-loan2Ch

	loan1Node := findCreatedNode(loan1Meta, "Loan")
	loanID1 := loan1Node["LedgerIndex"].(string)

	loan2Node := findCreatedNode(loan2Meta, "Loan")
	loanID2 := loan2Node["LedgerIndex"].(string)

	fmt.Print("Setting up tutorial: 6/6\r")

	// Write setup data to JSON file
	setupData := map[string]any{
		"description": "This file is auto-generated by lending-setup. It stores XRPL account info for use in lending protocol tutorials.",
		"loanBroker": map[string]any{
			"address": loanBrokerWallet.ClassicAddress,
			"seed":    loanBrokerWallet.Seed,
		},
		"borrower": map[string]any{
			"address": borrowerWallet.ClassicAddress,
			"seed":    borrowerWallet.Seed,
		},
		"depositor": map[string]any{
			"address": depositorWallet.ClassicAddress,
			"seed":    depositorWallet.Seed,
		},
		"credentialIssuer": map[string]any{
			"address": credIssuerWallet.ClassicAddress,
			"seed":    credIssuerWallet.Seed,
		},
		"domainID":     domainID,
		"mptID":        mptID,
		"vaultID":      vaultID,
		"loanBrokerID": loanBrokerID,
		"loanID1":      loanID1,
		"loanID2":      loanID2,
	}

	jsonData, err := json.MarshalIndent(setupData, "", "  ")
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("lending-setup.json", jsonData, 0644); err != nil {
		panic(err)
	}

	fmt.Println("Setting up tutorial: Complete!")
}
