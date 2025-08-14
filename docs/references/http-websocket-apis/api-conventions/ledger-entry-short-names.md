# Short Names of Ledger Entries

Some API methods, specifically the [account_objects method][] and [ledger_data method][], allow filtering the ledger entries they return based on the type of ledger entry. The type field you specify can use either the canonical name of the [ledger entry](../../protocol/ledger-data/ledger-entry-types/index.md) or a short name, as in the following table.

The "Ownable" column indicates whether the ledger entry type can appear in owner directories. Ledger entries that are not ownable cannot appear in `account_objects` responses and cannot be used as a `type` filter in that method.

| Canonical Name       | Short Name            | Ownable | Related Amendment |
| -------------------- | --------------------- | ------- |---|
| `AccountRoot`        | `account`             | No      | |
| `Amendments`         | `amendments`          | No      | |
| `AMM`                | `amm`                 | No      | {% amendment-disclaimer name="AMM" compact=true /%} |
| `Bridge`             | `bridge`              | Yes     | {% amendment-disclaimer name="XChainBridge" compact=true /%} |
| `Check`              | `check`               | Yes     | {% amendment-disclaimer name="Checks" compact=true /%} |
| `Credential`         | `credential`          | Yes     | {% amendment-disclaimer name="Credentials" compact=true /%} |
| `Delegate`           | `delegate`            | Yes     | {% amendment-disclaimer name="PermissionDelegation" compact=true /%} |
| `DepositPreauth`     | `deposit_preauth`     | Yes     | {% amendment-disclaimer name="DepositPreauth" compact=true /%} |
| `DID`                | `did`                 | Yes     | {% amendment-disclaimer name="DID" compact=true /%} |
| `DirectoryNode`      | `directory`           | No      | |
| `Escrow`             | `escrow`              | Yes     | |
| `FeeSettings`        | `fee`                 | No      | |
| `LedgerHashes`       | `hashes`              | No      | |
| `MPToken`            | `mptoken`             | Yes     | {% amendment-disclaimer name="MPTokensV1" compact=true /%} |
| `MPTokenIssuance`    | `mpt_issuance`        | Yes     | {% amendment-disclaimer name="MPTokensV1" compact=true /%} |
| `NegativeUNL`        | `nunl`                | No      | {% amendment-disclaimer name="NegativeUNL" compact=true /%} |
| `NFTokenOffer`       | `nft_offer`           | Yes     | {% amendment-disclaimer name="NonFungibleTokensV1_1" compact=true /%} |
| `NFTokenPage`        | `nft_page`            | Yes     | {% amendment-disclaimer name="NonFungibleTokensV1_1" compact=true /%} |
| `Offer`              | `offer`               | Yes     | |
| `Oracle`             | `oracle`              | Yes     | {% amendment-disclaimer name="PriceOracle" compact=true /%} |
| `PayChannel`         | `payment_channel`     | Yes     | |
| `PermissionedDomain` | `permissioned_domain` | Yes     | {% amendment-disclaimer name="PermissionedDomains" compact=true /%} |
| `RippleState`        | `state`               | Yes     | |
| `SignerList`         | `signer_list`         | Yes     | |
| `Ticket`             | `ticket`              | Yes     | {% amendment-disclaimer name="TicketBatch" compact=true /%} |
| `XChainOwnedClaimID` | `xchain_owned_claim_id` | Yes   | {% amendment-disclaimer name="XChainBridge" compact=true /%} |
| `XChainOwnedCreate`<wbr>`AccountClaimID` | `xchain_owned_`<wbr>`create_account_claim_id` | Yes | {% amendment-disclaimer name="XChainBridge" compact=true /%} |

<!-- Author's note: used <wbr> (word break opportunity) so that the long xchain names don't cause the table to scroll horizontally. -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}
