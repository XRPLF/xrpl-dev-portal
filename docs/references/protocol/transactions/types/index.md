---
seo:
    description: All the different types of transactions that the XRP Ledger can process.
metadata:
    indexPage: true
labels:
    - Blockchain
---
# Transaction Types

The `TransactionType` field determines what operation a transaction performs. All transactions share [common fields](../common-fields.md). 

Each transaction type includes additional fields specific to its operation. The following tables list all transaction types, grouped by feature area.

## Accounts

| Transaction | Description |
|:------------|:------------|
| [`AccountDelete`](accountdelete.md) | Delete an account and its objects. |
| [`AccountSet`](accountset.md) | Modify an account's settings. |
| [`DelegateSet`](delegateset.md) | Grant or revoke another account's permission to transact on your behalf. |
| [`DepositPreauth`](depositpreauth.md) | Preauthorize an account to send you payments. |
| [`SetRegularKey`](setregularkey.md) | Assign or remove a regular key pair for signing. |
| [`SignerListSet`](signerlistset.md) | Create, replace, or remove a multi-signing list. |
| [`TicketCreate`](ticketcreate.md) | Reserve sequence numbers as tickets. |

## Payments

| Transaction | Description |
|:------------|:------------|
| [`Payment`](payment.md) | Send funds, convert currencies, or create an account. |
| [`CheckCancel`](checkcancel.md) | Cancel an unredeemed check. |
| [`CheckCash`](checkcash.md) | Redeem a check. |
| [`CheckCreate`](checkcreate.md) | Create a check. |
| [`EscrowCancel`](escrowcancel.md) | Return expired escrow funds to the sender. |
| [`EscrowCreate`](escrowcreate.md) | Lock funds in escrow until specific conditions are met. |
| [`EscrowFinish`](escrowfinish.md) | Deliver escrowed funds to the recipient. |
| [`PaymentChannelClaim`](paymentchannelclaim.md) | Claim funds from a payment channel. |
| [`PaymentChannelCreate`](paymentchannelcreate.md) | Open a new payment channel. |
| [`PaymentChannelFund`](paymentchannelfund.md) | Add more funds to a payment channel. |

## Tokens

| Transaction | Description |
|:------------|:------------|
| [`AMMBid`](ammbid.md) | Bid on an AMM's auction slot for a discounted fee. |
| [`AMMClawback`](ammclawback.md) | Claw back issued tokens from an AMM pool. |
| [`AMMCreate`](ammcreate.md) | Create a new AMM to trade asset pairs. |
| [`AMMDelete`](ammdelete.md) | Delete an empty AMM. |
| [`AMMDeposit`](ammdeposit.md) | Deposit assets into an AMM pool in exchange for LP Tokens. |
| [`AMMVote`](ammvote.md) | Vote on an AMM trading fee. |
| [`AMMWithdraw`](ammwithdraw.md) | Return LP Tokens to an AMM in exchange for a share of the pool's assets. |
| [`Clawback`](clawback.md) | Claw back issued tokens. |
| [`LoanBrokerCoverClawback`](loanbrokercoverclawback.md) | Claw back first-loss capital from a `LoanBroker`. |
| [`LoanBrokerCoverDeposit`](loanbrokercoverdeposit.md) | Deposit first-loss capital into a `LoanBroker`. |
| [`LoanBrokerCoverWithdraw`](loanbrokercoverwithdraw.md) | Withdraw first-loss capital from a `LoanBroker`. |
| [`LoanBrokerDelete`](loanbrokerdelete.md) | Delete a `LoanBroker`. |
| [`LoanBrokerSet`](loanbrokerset.md) | Create or update a `LoanBroker`. |
| [`LoanDelete`](loandelete.md) | Delete a `Loan`. |
| [`LoanManage`](loanmanage.md) | Default, impair, or unimpair a `Loan`. |
| [`LoanPay`](loanpay.md) | Make a payment on an active `Loan`. |
| [`LoanSet`](loanset.md) | Create a `Loan` agreement between a Loan Broker and Borrower. |
| [`MPTokenAuthorize`](mptokenauthorize.md) | Authorize an account to hold or transfer an MPT. |
| [`MPTokenIssuanceCreate`](mptokenissuancecreate.md) | Define the properties of a new MPT. |
| [`MPTokenIssuanceDestroy`](mptokenissuancedestroy.md) | Delete an MPT definition. |
| [`MPTokenIssuanceSet`](mptokenissuanceset.md) | Set mutable properties of an MPT. |
| [`NFTokenAcceptOffer`](nftokenacceptoffer.md) | Accept an offer to buy or sell an NFT. |
| [`NFTokenBurn`](nftokenburn.md) | Permanently destroy an NFT. |
| [`NFTokenCancelOffer`](nftokencanceloffer.md) | Cancel one or more offers to buy or sell an NFT. |
| [`NFTokenCreateOffer`](nftokencreateoffer.md) | Create an offer to buy or sell an NFT. |
| [`NFTokenMint`](nftokenmint.md) | Mint an NFT. |
| [`NFTokenModify`](nftokenmodify.md) | Modify a dynamic NFT. |
| [`OfferCancel`](offercancel.md) | Cancel an offer in the decentralized exchange. |
| [`OfferCreate`](offercreate.md) | Create a limit order in the decentralized exchange. |
| [`PermissionedDomainDelete`](permissioneddomaindelete.md) | Delete a permissioned domain. |
| [`PermissionedDomainSet`](permissioneddomainset.md) | Create or update a permissioned domain. |
| [`TrustSet`](trustset.md) | Add or modify a trust line. |
| [`VaultClawback`](vaultclawback.md) | Claw back tokens or MPTs from a vault. |
| [`VaultCreate`](vaultcreate.md) | Create a vault. |
| [`VaultDelete`](vaultdelete.md) | Delete a vault. |
| [`VaultDeposit`](vaultdeposit.md) | Deposit assets into a vault in exchange for shares. |
| [`VaultSet`](vaultset.md) | Modify a vault. |
| [`VaultWithdraw`](vaultwithdraw.md) | Redeem vault shares for assets. |

## Decentralized Storage

| Transaction | Description |
|:------------|:------------|
| [`CredentialAccept`](credentialaccept.md) | Accept a credential issued to your account. |
| [`CredentialCreate`](credentialcreate.md) | Provisionally issue a credential. |
| [`CredentialDelete`](credentialdelete.md) | Remove a credential from the ledger. |
| [`DIDDelete`](diddelete.md) | Delete a Decentralized Identifier. |
| [`DIDSet`](didset.md) | Create or update a Decentralized Identifier. |
| [`OracleDelete`](oracledelete.md) | Delete a price oracle. |
| [`OracleSet`](oracleset.md) | Create or update a price oracle. |

## XRPL Side Chains

| Transaction | Description |
|:------------|:------------|
| [`XChainAccountCreateCommit`](xchainaccountcreatecommit.md) | Create a door account on another chain for a bridge. |
| [`XChainAddAccountCreateAttestation`](xchainaddaccountcreateattestation.md) | Attest that an `XChainAccountCreateCommit` transaction occurred on another chain. |
| [`XChainAddClaimAttestation`](xchainaddclaimattestation.md) | Attest that an `XChainCommit` transaction occurred on another chain. |
| [`XChainClaim`](xchainclaim.md) | Complete a transfer by claiming value on the destination chain. |
| [`XChainCommit`](xchaincommit.md) | Start a transfer to another chain. |
| [`XChainCreateBridge`](xchaincreatebridge.md) | Create a bridge between two chains. |
| [`XChainCreateClaimID`](xchaincreateclaimid.md) | Create a claim ID for a transfer. |
| [`XChainModifyBridge`](xchainmodifybridge.md) | Modify a bridge. |

## Other 

| Transaction | Description |
|:------------|:------------|
| [`Batch`](batch.md) | Group up to 8 atomically executed transactions. |
| [`LedgerStateFix`](ledgerstatefix.md) | Repair corruptions to the ledger's state data. |
