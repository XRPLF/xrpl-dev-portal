---
paths:
  - "docs/references/protocol/ledger-data/ledger-entry-types/**/*.md"
---

# XRPL Ledger Entry Reference Conventions

The template below shows the full structure a ledger entry type reference page should follow. HTML comments serve two roles, distinguished by prefix:

- `<!-- TODO: ... -->` marks a slot that needs to be filled in by the author
- `<!-- RULE: ... -->` describes the convention that applies at that spot

Pull details from the `xrpld` source file that the `{% source-link /%}` path points to. If this file isn't provided, prompt the user for the most up-to-date file location on Github.

---

# <!-- TODO: Ledger entry name in PascalCase, e.g. LoanBroker -->
<!-- TODO: Replace <path-to-source> with the repo-relative path the user provides. Example format: {% source-link path="include/xrpl/protocol/detail/ledger_entries.macro#L519-L537" /%} -->
{% source-link path="<path-to-source>" /%}

<!-- TODO: 1-3 sentences: what the entry represents, which transaction (include a link) creates or modifies it. If this reference page documents a feature that isn't enabled on mainnet yet, add the {% amendment-disclaimer /%} markdoc tag in a new line. You can verify the status of amendments at https://xrpl.org/resources/known-amendments.md -->


## Example {% $frontmatter.seo.title %} JSON
<!-- RULE: A complete, realistic JSON object showing every field, including common fields. Use placeholder values unless otherwise specified by the user. Follow this format:

```json
{
  "LedgerEntryType": "LoanBroker",
  "LedgerIndex": "E123F4567890ABCDE123F4567890ABCDEF1234567890ABCDEF1234567890ABCD",
  "Flags": "0",
  "PreviousTxnID": "9A8765B4321CDE987654321CDE987654321CDE987654321CDE987654321CDE98",
  "PreviousTxnLgrSeq": 12345678,
  "Sequence": 1,
  "LoanSequence": 2,
  "OwnerNode": 2,
  "VaultNode": 1,
  "VaultID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Account": "rBROKER9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Owner": "rEXAMPLE9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865206C6F616E62726F6B65722E",
  "ManagementFeeRate": 100,
  "OwnerCount": 3,
  "DebtTotal": 50000,
  "DebtMaximum": 100000,
  "CoverAvailable": 10000,
  "CoverRateMinimum": 1000,
  "CoverRateLiquidation": 500
}
```

-->

## {% $frontmatter.seo.title %} Fields
<!-- RULE: Table of the entry's own fields (the common ledger entry fields are linked, not repeated). -->

In addition to the [common ledger entry fields][], {% code-page-name /%} entries have the following fields:

<!-- TODO: Update the fields table using the following format:

| Name                | JSON Type | Internal Type | Required? | Description |
|:--------------------|:----------|:--------------|:----------|:------------|
| `PreviousTxnID`     | String    | Hash256       | Yes       | Identifies the transaction ID that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number    | UInt32        | Yes       | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `Sequence`          | Number    | UInt32        | Yes       | The transaction sequence number that created the LoanBroker. |
| `LoanSequence`      | Number    | UInt32        | Yes       | A sequential identifier for `Loan` ledger entries, incremented each time a new loan is created by this `LoanBroker`. |
| `OwnerNode`         | Number    | UInt64        | Yes       | Identifies the page where this item is referenced in the owner's directory. |
| `VaultNode`         | Number    | UInt64        | Yes       | Identifies the page where this item is referenced in the `Vault` pseudo-account owner's directory. |
| `VaultID`           | String    | Hash256       | Yes       | The ID of the vault that provides the loaned assets. |
| `Account`           | String    | AccountID     | Yes       | The address of the `LoanBroker` pseudo-account. |
| `Owner`             | String    | AccountID     | Yes       | The account address of the vault owner. |
| `Data`              | String    | Blob          | No        | Arbitrary metadata about the vault. Limited to 256 bytes. |

-->


## {% $frontmatter.seo.title %} Flags
<!-- RULE: If the ledger entry doesn't have flags, delete all other content in this section and add this line as-is:
There are no flags defined for {% code-page-name /%} ledger entries.
-->

{% code-page-name /%} entries can have the following flags:

<!-- TODO: Update the flags table using the following format:

| Field Name           | Hex Value    | Decimal Value | Description |
|:---------------------|:-------------|:--------------|:------------|
| `lsfLoanDefault`     | `0x00010000` | `65536`       | Indicates the loan is defaulted. |
| `lsfLoanImpaired`    | `0x00020000` | `131072`      | Indicates the loan is impaired. |
| `lsfLoanOverpayment` | `0x00040000` | `262144`      | Indicates the loan supports overpayments. |

-->


## {% $frontmatter.seo.title %} Reserve
<!-- TODO: One or two sentences describing the owner reserve this entry incurs and who pays it. -->


## {% $frontmatter.seo.title %} ID Format

The ID of a {% code-page-name /%} ledger entry is the [SHA-512Half][] of the following values, concatenated in order:

<!-- TODO: Bullet list of the values concatenated to form the ID, starting with the space key. -->


## See Also

<!-- TODO: Links to related API methods and transactions. Follow this sample format:

**API Methods**:
  - [vault_info method][]

**Transactions**:
  - [VaultCreate transaction][]

-->

{% raw-partial file="/docs/_snippets/common-links.md" /%}
