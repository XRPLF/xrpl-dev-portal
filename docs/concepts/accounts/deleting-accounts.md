---
seo:
    description: About deleting an XRP Ledger account.
labels:
  - Accounts
---
# Deleting Accounts

The owner of an account can send an [AccountDelete transaction][] to delete the account and related entries from the ledger, sending most of the account's remaining XRP balance to another account. To discourage wasteful creation and deletion of accounts, deleting an account requires burning a higher than usual amount of XRP as the [transaction cost](../transactions/transaction-cost.md).

Some types of associated ledger entries block an account from being deleted. For example, the issuer of a fungible token can't be deleted while anyone holds a nonzero balance of that token.

After an account has been deleted, it can be re-created in the ledger through the normal method of [creating accounts](index.md#creating-accounts). An account that has been deleted and re-created is no different than an account that has been created for the first time.

## Requirements

To be deleted, an account must meet the following requirements:

- The account's `Sequence` number plus 255 must be less than or equal to the current [Ledger Index][]. This is to protect against replaying old transactions.
- The account must not have any "deletion blockers" in its owner directory. Deletion blockers are generally ledger entries that represent assets, obligations, or transfers of funds. See below for a full list of deletion blockers.
- The account must own 1000 or fewer objects in the ledger.
- The transaction must pay a special [transaction cost][] equal to at least the [owner reserve](reserves.md) for one item (currently {% $env.PUBLIC_OWNER_RESERVE %}).
- If the account has issued any [NFTs](../tokens/nfts/index.md), they must all have been burned. Additionally, the account's `FirstNFTSequence` number plus `MintedNFTokens` number plus 255 must be less than or equal to the current ledger index. This is to protect against reusing `NFTokenID` values. {% amendment-disclaimer name="fixNFTokenRemint" /%}

## Deletion Blockers

The following table shows which [ledger entry types](../../references/protocol/ledger-data/ledger-entry-types/index.md) are deletion blockers. Any other types of ledger entries that an account owns are automatically deleted along with the account.

Some deletion blockers cannot be removed unilaterally. For example, if you have issued a token to someone else, you cannot delete your account as long as they hold your token. In other cases, you can remove the deletion blocker by sending a transaction that causes the entry to be removed from the ledger.

| Entry Type | Related Amendment | How to remove |
|---|---|---|
| [Bridge][Bridge entry] | {% amendment-disclaimer name="XChainBridge" compact=true /%} | Cannot be removed. |
| [Check][Check entry] | {% amendment-disclaimer name="Checks" compact=true /%} | Send a [CheckCancel transaction][] to cancel the check. |
| [Escrow][Escrow entry] | (Core protocol) | Send an [EscrowCancel transaction][] to cancel the transaction if it has expired; send [EscrowFinish transaction][] to finish it if you can satisfy the timed and/or conditional requirements of the escrow. Otherwise, you can't remove the entry. |
| [PayChannel][PayChannel entry] | (Core protocol) | Send a [PaymentChannelClaim transaction][] with the `tfClose` flag to request closing the channel; after the settle delay has passed, send another [PaymentChannelClaim transaction][] to fully close and remove the channel. |
| [PermissionedDomain][PermissionedDomain entry] | {% amendment-disclaimer name="PermissionedDomains" compact=true /%} | Send a [PermissionedDomainDelete transaction][] to delete the domain. |
| [RippleState][RippleState entry] | (Core protocol) | You can only remove the entry if the counterparty's settings are entirely default. If they are, you can remove it by getting the balance to 0 and setting your own settings to the default with a [TrustSet transaction][]. In the common case, the holder can remove the entry but the issuer cannot. |
| [MPToken][MPToken entry] | {% amendment-disclaimer name="MPTokensV1" compact=true /%} | If you are the holder of the MPT, reduce your balance to 0 (for example, using a payment), then send an [MPTokenAuthorize transaction][] with the `tfMPTUnauthorize` flag. If you are the issuer of the MPT, you can't remove the entry. |
| [MPTokenIssuance][MPTokenIssuance entry] | {% amendment-disclaimer name="MPTokensV1" compact=true /%} | Send an [MPTokenIssuanceDestroy transaction][]. You can only do this if there are no holders of the MPT. |
| [NFTokenPage][NFTokenPage entry] | {% amendment-disclaimer name="NonFungibleTokensV1_1" compact=true /%} | Send [NFTokenBurn transactions][] to burn, or [NFTokenCreateOffer transactions][] to sell or transfer, each NFT you hold. |
| [Vault][Vault entry] | {% amendment-disclaimer name="SingleAssetVault" compact=true /%} | Send a [VaultDelete transaction][] to delete the vault. You can only do this if the vault is empty. |
| [XChainOwnedClaimID][XChainOwnedClaimID entry] | {% amendment-disclaimer name="XChainBridge" compact=true /%} | Send an [XChainClaim transaction][] to complete the cross-chain transfer. |
| [XChainOwned<br>CreateAccountClaimID][XChainOwnedCreateAccountClaimID entry] | {% amendment-disclaimer name="XChainBridge" compact=true /%} | Send enough attestations ([XChainAddAccountCreateAttestation transactions][]) to create the new account. |

## Cost of Deleting

{% admonition type="danger" name="Warning" %}The [AccountDelete transaction][]'s transaction cost always applies when the transaction is included in a validated ledger, even if the transaction failed because the account does not meet the requirements to be deleted. To greatly reduce the chances of paying the high transaction cost if the account cannot be deleted, use the `fail_hard` option when submitting an AccountDelete transaction.{% /admonition %}

Unlike Bitcoin and many other cryptocurrencies, each new version of the XRP Ledger's public ledger chain contains the full state of the ledger, which increases in size with each new account. For that reason, you should not create new XRP Ledger accounts unless necessary. You can recover some of an account's {% $env.PUBLIC_BASE_RESERVE %} [reserve](reserves.md) by deleting the account, but you must still destroy at least {% $env.PUBLIC_OWNER_RESERVE %} to do so.

Institutions who send and receive value on behalf of many users can use [**Source Tags** and **Destination Tags**](../transactions/source-and-destination-tags.md) to distinguish payments from and to their customers while only using one (or a handful) of accounts in the XRP Ledger.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
