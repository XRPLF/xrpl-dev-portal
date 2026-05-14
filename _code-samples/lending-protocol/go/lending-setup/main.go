// Setup script for lending protocol tutorials

package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/Peersyst/xrpl-go/pkg/crypto"
	"github.com/Peersyst/xrpl-go/xrpl/faucet"
	ledger "github.com/Peersyst/xrpl-go/xrpl/ledger-entry-types"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	requests "github.com/Peersyst/xrpl-go/xrpl/queries/transactions"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
	rpctypes "github.com/Peersyst/xrpl-go/xrpl/rpc/types"
	"github.com/Peersyst/xrpl-go/xrpl/transaction"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/wallet"
)

// ptr is a helper that returns a pointer to the given value,
// used for setting optional transaction fields in Go.
func ptr[T any](v T) *T { return &v }

func main() {
	fmt.Print("Setting up tutorial: 0/7\r")

	// Connect to devnet
	cfg, err := rpc.NewClientConfig(
		"https://s.devnet.rippletest.net:51234",
		rpc.WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
	)
	if err != nil {
		panic(err)
	}
	client := rpc.NewClient(cfg)

	submitOpts := func(w *wallet.Wallet) *rpctypes.SubmitOptions {
		return &rpctypes.SubmitOptions{Autofill: true, Wallet: w}
	}

	// Create and fund wallets concurrently
	createAndFund := func(ch chan<- wallet.Wallet) {
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

	fmt.Print("Setting up tutorial: 1/7\r")

	// Create tickets for parallel transactions
	extractTickets := func(resp *requests.TxResponse) []uint32 {
		var tickets []uint32
		for _, node := range resp.Meta.AffectedNodes {
			if node.CreatedNode != nil && node.CreatedNode.LedgerEntryType == "Ticket" {
				ticketSeq, _ := node.CreatedNode.NewFields["TicketSequence"].(json.Number).Int64()
				tickets = append(tickets, uint32(ticketSeq))
			}
		}
		return tickets
	}

	ciTicketCh := make(chan []uint32, 1)
	lbTicketCh := make(chan []uint32, 1)
	brTicketCh := make(chan []uint32, 1)
	dpTicketCh := make(chan []uint32, 1)

	go func() {
		resp, err := client.SubmitTxAndWait((&transaction.TicketCreate{
			BaseTx: transaction.BaseTx{
				Account: credIssuerWallet.GetAddress(),
			},
			TicketCount: 4,
		}).Flatten(), submitOpts(&credIssuerWallet))
		if err != nil {
			panic(err)
		}
		ciTicketCh <- extractTickets(resp)
	}()

	go func() {
		resp, err := client.SubmitTxAndWait((&transaction.TicketCreate{
			BaseTx: transaction.BaseTx{
				Account: loanBrokerWallet.GetAddress(),
			},
			TicketCount: 4,
		}).Flatten(), submitOpts(&loanBrokerWallet))
		if err != nil {
			panic(err)
		}
		lbTicketCh <- extractTickets(resp)
	}()

	go func() {
		resp, err := client.SubmitTxAndWait((&transaction.TicketCreate{
			BaseTx: transaction.BaseTx{
				Account: borrowerWallet.GetAddress(),
			},
			TicketCount: 2,
		}).Flatten(), submitOpts(&borrowerWallet))
		if err != nil {
			panic(err)
		}
		brTicketCh <- extractTickets(resp)
	}()

	go func() {
		resp, err := client.SubmitTxAndWait((&transaction.TicketCreate{
			BaseTx: transaction.BaseTx{
				Account: depositorWallet.GetAddress(),
			},
			TicketCount: 2,
		}).Flatten(), submitOpts(&depositorWallet))
		if err != nil {
			panic(err)
		}
		dpTicketCh <- extractTickets(resp)
	}()

	ciTickets := <-ciTicketCh
	lbTickets := <-lbTicketCh
	brTickets := <-brTicketCh
	dpTickets := <-dpTicketCh

	fmt.Print("Setting up tutorial: 2/7\r")

	// Issue MPT with depositor
	// Set up credentials and domain with credentialIssuer
	credentialType := hex.EncodeToString([]byte("KYC-Verified"))

	mptData := types.ParsedMPTokenMetadata{
		Ticker:        "TSTUSD",
		Name:          "Test USD MPT",
		Desc:          ptr("A sample non-yield-bearing stablecoin backed by U.S. Treasuries."),
		Icon:          "https://example.org/tstusd-icon.png",
		AssetClass:    "rwa",
		AssetSubclass: ptr("stablecoin"),
		IssuerName:    "Example Treasury Reserve Co.",
		URIs: []types.ParsedMPTokenMetadataURI{
			{
				URI:      "https://exampletreasury.com/tstusd",
				Category: "website",
				Title:    "Product Page",
			},
			{
				URI:      "https://exampletreasury.com/tstusd/reserve",
				Category: "docs",
				Title:    "Reserve Attestation",
			},
		},
		AdditionalInfo: map[string]any{
			"reserve_type":     "U.S. Treasury Bills",
			"custody_provider": "Example Custodian Bank",
			"audit_frequency":  "Monthly",
			"last_audit_date":  "2026-01-15",
			"pegged_currency":  "USD",
		},
	}
	mptMetadataHex, err := types.EncodeMPTokenMetadata(mptData)
	if err != nil {
		panic(err)
	}

	mptCh := make(chan *requests.TxResponse, 1)
	domainCh := make(chan *requests.TxResponse, 1)
	credLbCh := make(chan struct{}, 1)
	credBrCh := make(chan struct{}, 1)
	credDpCh := make(chan struct{}, 1)

	// MPT issuance
	go func() {
		resp, err := client.SubmitTxAndWait((&transaction.MPTokenIssuanceCreate{
			BaseTx: transaction.BaseTx{
				Account: depositorWallet.GetAddress(),
				Flags:   transaction.TfMPTCanTransfer | transaction.TfMPTCanClawback | transaction.TfMPTCanTrade,
			},
			MaximumAmount:   ptr(types.XRPCurrencyAmount(100000000)),
			TransferFee:     ptr(uint16(0)),
			MPTokenMetadata: &mptMetadataHex,
		}).Flatten(), submitOpts(&depositorWallet))
		if err != nil {
			panic(err)
		}
		mptCh <- resp
	}()

	// PermissionedDomainSet
	go func() {
		resp, err := client.SubmitTxAndWait((&transaction.PermissionedDomainSet{
			BaseTx: transaction.BaseTx{
				Account:        credIssuerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: ciTickets[0],
			},
			AcceptedCredentials: types.AuthorizeCredentialList{
				{
					Credential: types.Credential{
						Issuer:         credIssuerWallet.GetAddress(),
						CredentialType: types.CredentialType(credentialType),
					},
				},
			},
		}).Flatten(), submitOpts(&credIssuerWallet))
		if err != nil {
			panic(err)
		}
		domainCh <- resp
	}()

	// CredentialCreate for loan broker
	go func() {
		_, err := client.SubmitTxAndWait((&transaction.CredentialCreate{
			BaseTx: transaction.BaseTx{
				Account:        credIssuerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: ciTickets[1],
			},
			CredentialType: types.CredentialType(credentialType),
			Subject:        loanBrokerWallet.GetAddress(),
		}).Flatten(), submitOpts(&credIssuerWallet))
		if err != nil {
			panic(err)
		}
		credLbCh <- struct{}{}
	}()

	// CredentialCreate for borrower
	go func() {
		_, err := client.SubmitTxAndWait((&transaction.CredentialCreate{
			BaseTx: transaction.BaseTx{
				Account:        credIssuerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: ciTickets[2],
			},
			CredentialType: types.CredentialType(credentialType),
			Subject:        borrowerWallet.GetAddress(),
		}).Flatten(), submitOpts(&credIssuerWallet))
		if err != nil {
			panic(err)
		}
		credBrCh <- struct{}{}
	}()

	// CredentialCreate for depositor
	go func() {
		_, err := client.SubmitTxAndWait((&transaction.CredentialCreate{
			BaseTx: transaction.BaseTx{
				Account:        credIssuerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: ciTickets[3],
			},
			CredentialType: types.CredentialType(credentialType),
			Subject:        depositorWallet.GetAddress(),
		}).Flatten(), submitOpts(&credIssuerWallet))
		if err != nil {
			panic(err)
		}
		credDpCh <- struct{}{}
	}()

	mptResp := <-mptCh
	domainResp := <-domainCh
	<-credLbCh
	<-credBrCh
	<-credDpCh

	// Extract MPT issuance ID
	mptID := string(*mptResp.Meta.MPTIssuanceID)

	// Extract domain ID from transaction meta
	var domainID string
	for _, node := range domainResp.Meta.AffectedNodes {
		if node.CreatedNode != nil && node.CreatedNode.LedgerEntryType == "PermissionedDomain" {
			domainID = node.CreatedNode.LedgerIndex
			break
		}
	}

	fmt.Print("Setting up tutorial: 3/7\r")

	// Accept credentials and authorize MPT for each account
	lbCredCh := make(chan struct{}, 1)
	lbMptCh := make(chan struct{}, 1)
	brCredCh := make(chan struct{}, 1)
	brMptCh := make(chan struct{}, 1)
	depCredCh := make(chan struct{}, 1)

	// Loan broker: accept credential
	go func() {
		_, err := client.SubmitTxAndWait((&transaction.CredentialAccept{
			BaseTx: transaction.BaseTx{
				Account:        loanBrokerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: lbTickets[0],
			},
			CredentialType: types.CredentialType(credentialType),
			Issuer:         credIssuerWallet.GetAddress(),
		}).Flatten(), submitOpts(&loanBrokerWallet))
		if err != nil {
			panic(err)
		}
		lbCredCh <- struct{}{}
	}()

	// Loan broker: authorize MPT
	go func() {
		_, err := client.SubmitTxAndWait((&transaction.MPTokenAuthorize{
			BaseTx: transaction.BaseTx{
				Account:        loanBrokerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: lbTickets[1],
			},
			MPTokenIssuanceID: mptID,
		}).Flatten(), submitOpts(&loanBrokerWallet))
		if err != nil {
			panic(err)
		}
		lbMptCh <- struct{}{}
	}()

	// Borrower: accept credential
	go func() {
		_, err := client.SubmitTxAndWait((&transaction.CredentialAccept{
			BaseTx: transaction.BaseTx{
				Account:        borrowerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: brTickets[0],
			},
			CredentialType: types.CredentialType(credentialType),
			Issuer:         credIssuerWallet.GetAddress(),
		}).Flatten(), submitOpts(&borrowerWallet))
		if err != nil {
			panic(err)
		}
		brCredCh <- struct{}{}
	}()

	// Borrower: authorize MPT
	go func() {
		_, err := client.SubmitTxAndWait((&transaction.MPTokenAuthorize{
			BaseTx: transaction.BaseTx{
				Account:        borrowerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: brTickets[1],
			},
			MPTokenIssuanceID: mptID,
		}).Flatten(), submitOpts(&borrowerWallet))
		if err != nil {
			panic(err)
		}
		brMptCh <- struct{}{}
	}()

	// Depositor: accept credential only
	go func() {
		_, err := client.SubmitTxAndWait((&transaction.CredentialAccept{
			BaseTx: transaction.BaseTx{
				Account: depositorWallet.GetAddress(),
			},
			CredentialType: types.CredentialType(credentialType),
			Issuer:         credIssuerWallet.GetAddress(),
		}).Flatten(), submitOpts(&depositorWallet))
		if err != nil {
			panic(err)
		}
		depCredCh <- struct{}{}
	}()

	<-lbCredCh
	<-lbMptCh
	<-brCredCh
	<-brMptCh
	<-depCredCh

	fmt.Print("Setting up tutorial: 4/7\r")

	// Create private vault and distribute MPT to accounts concurrently
	vaultCh := make(chan *requests.TxResponse, 1)
	distLbCh := make(chan struct{}, 1)
	distBrCh := make(chan struct{}, 1)

	go func() {
		resp, err := client.SubmitTxAndWait((&transaction.VaultCreate{
			BaseTx: transaction.BaseTx{
				Account: loanBrokerWallet.GetAddress(),
				Flags:   transaction.TfVaultPrivate,
			},
			Asset:    ledger.Asset{MPTIssuanceID: mptID},
			DomainID: &domainID,
		}).Flatten(), submitOpts(&loanBrokerWallet))
		if err != nil {
			panic(err)
		}
		vaultCh <- resp
	}()

	go func() {
		_, err := client.SubmitTxAndWait((&transaction.Payment{
			BaseTx: transaction.BaseTx{
				Account:        depositorWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: dpTickets[0],
			},
			Destination: loanBrokerWallet.GetAddress(),
			Amount: types.MPTCurrencyAmount{
				MPTIssuanceID: mptID,
				Value:         "5000",
			},
		}).Flatten(), submitOpts(&depositorWallet))
		if err != nil {
			panic(err)
		}
		distLbCh <- struct{}{}
	}()

	go func() {
		_, err := client.SubmitTxAndWait((&transaction.Payment{
			BaseTx: transaction.BaseTx{
				Account:        depositorWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: dpTickets[1],
			},
			Destination: borrowerWallet.GetAddress(),
			Amount: types.MPTCurrencyAmount{
				MPTIssuanceID: mptID,
				Value:         "2500",
			},
		}).Flatten(), submitOpts(&depositorWallet))
		if err != nil {
			panic(err)
		}
		distBrCh <- struct{}{}
	}()

	vaultResp := <-vaultCh
	<-distLbCh
	<-distBrCh

	var vaultID string
	for _, node := range vaultResp.Meta.AffectedNodes {
		if node.CreatedNode != nil && node.CreatedNode.LedgerEntryType == "Vault" {
			vaultID = node.CreatedNode.LedgerIndex
			break
		}
	}

	fmt.Print("Setting up tutorial: 5/7\r")

	// Create LoanBroker and deposit MPT into vault
	lbSetCh := make(chan *requests.TxResponse, 1)
	vaultDepCh := make(chan struct{}, 1)

	go func() {
		resp, err := client.SubmitTxAndWait((&transaction.LoanBrokerSet{
			BaseTx: transaction.BaseTx{
				Account: loanBrokerWallet.GetAddress(),
			},
			VaultID: vaultID,
		}).Flatten(), submitOpts(&loanBrokerWallet))
		if err != nil {
			panic(err)
		}
		lbSetCh <- resp
	}()

	go func() {
		_, err := client.SubmitTxAndWait((&transaction.VaultDeposit{
			BaseTx: transaction.BaseTx{
				Account: depositorWallet.GetAddress(),
			},
			VaultID: types.Hash256(vaultID),
			Amount: types.MPTCurrencyAmount{
				MPTIssuanceID: mptID,
				Value:         "50000000",
			},
		}).Flatten(), submitOpts(&depositorWallet))
		if err != nil {
			panic(err)
		}
		vaultDepCh <- struct{}{}
	}()

	lbSetResp := <-lbSetCh
	<-vaultDepCh

	var loanBrokerID string
	for _, node := range lbSetResp.Meta.AffectedNodes {
		if node.CreatedNode != nil && node.CreatedNode.LedgerEntryType == "LoanBroker" {
			loanBrokerID = node.CreatedNode.LedgerIndex
			break
		}
	}

	fmt.Print("Setting up tutorial: 6/7\r")

	// Create 2 identical loans with complete repayment due in 30 days

	// Helper function to create, sign, and submit a LoanSet transaction
	createLoan := func(ticketSequence uint32) *requests.TxResponse {
		counterparty := borrowerWallet.GetAddress()
		loanSetTx := &transaction.LoanSet{
			BaseTx: transaction.BaseTx{
				Account:        loanBrokerWallet.GetAddress(),
				Sequence:       0,
				TicketSequence: ticketSequence,
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

		// Borrower signs second
		blob, _, err := wallet.SignLoanSetByCounterparty(borrowerWallet, &flatTx, nil)
		if err != nil {
			panic(err)
		}

		// Submit and wait for validation
		resp, err := client.SubmitTxBlobAndWait(blob, false)
		if err != nil {
			panic(err)
		}
		return resp
	}

	loan1Ch := make(chan *requests.TxResponse, 1)
	loan2Ch := make(chan *requests.TxResponse, 1)

	go func() { loan1Ch <- createLoan(lbTickets[2]) }()
	go func() { loan2Ch <- createLoan(lbTickets[3]) }()

	loan1Resp := <-loan1Ch
	loan2Resp := <-loan2Ch

	var loanID1, loanID2 string
	for _, node := range loan1Resp.Meta.AffectedNodes {
		if node.CreatedNode != nil && node.CreatedNode.LedgerEntryType == "Loan" {
			loanID1 = node.CreatedNode.LedgerIndex
			break
		}
	}
	for _, node := range loan2Resp.Meta.AffectedNodes {
		if node.CreatedNode != nil && node.CreatedNode.LedgerEntryType == "Loan" {
			loanID2 = node.CreatedNode.LedgerIndex
			break
		}
	}

	fmt.Print("Setting up tutorial: 7/7\r")

	// Write setup data to JSON file.
	// Using a struct to preserve field order.
	setupData := struct {
		Description      string `json:"description"`
		LoanBroker       any    `json:"loanBroker"`
		Borrower         any    `json:"borrower"`
		Depositor        any    `json:"depositor"`
		CredentialIssuer any    `json:"credentialIssuer"`
		DomainID         string `json:"domainID"`
		MptID            string `json:"mptID"`
		VaultID          string `json:"vaultID"`
		LoanBrokerID     string `json:"loanBrokerID"`
		LoanID1          string `json:"loanID1"`
		LoanID2          string `json:"loanID2"`
	}{
		Description: "This file is auto-generated by lending-setup. It stores XRPL account info for use in lending protocol tutorials.",
		LoanBroker: map[string]string{
			"address": string(loanBrokerWallet.ClassicAddress),
			"seed":    loanBrokerWallet.Seed,
		},
		Borrower: map[string]string{
			"address": string(borrowerWallet.ClassicAddress),
			"seed":    borrowerWallet.Seed,
		},
		Depositor: map[string]string{
			"address": string(depositorWallet.ClassicAddress),
			"seed":    depositorWallet.Seed,
		},
		CredentialIssuer: map[string]string{
			"address": string(credIssuerWallet.ClassicAddress),
			"seed":    credIssuerWallet.Seed,
		},
		DomainID:     domainID,
		MptID:        mptID,
		VaultID:      vaultID,
		LoanBrokerID: loanBrokerID,
		LoanID1:      loanID1,
		LoanID2:      loanID2,
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
