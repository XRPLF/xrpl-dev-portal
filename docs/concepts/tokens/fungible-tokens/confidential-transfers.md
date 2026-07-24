---
seo:
  description: Confidential transfers keep MPT balances and transaction amounts private while maintaining public auditability of the total token supply.
labels:
  - Multi-Purpose Tokens, MPTs, Tokens
  - Confidential Transfers
status: not_enabled
---
# Confidential Transfers

Confidential Transfers on the XRP Ledger allow Multi-Purpose Token (MPT) holders to keep their balances and transfer amounts private using [EC-ElGamal encryption](https://en.wikipedia.org/wiki/ElGamal_encryption) and [Zero-Knowledge Proofs (ZKPs)](https://en.wikipedia.org/wiki/Zero-knowledge_proof). Individual balances and transfer amounts remain shielded from the public ledger while maintaining compliance mechanisms for issuers and regulators to verify total supply and meet regulatory obligations. This addresses the need for institutional-grade privacy in financial applications while preserving auditability.

Public and confidential balances can coexist for the same token, meaning the same MPT can have some balances held publicly and others held privately. Token holders can convert their public balance to confidential form and back as needed.

{% admonition type="info" name="Note" %}
Confidential transfers are only available for direct payments between accounts. They do not work with other transaction types, such as those involving the XRPL DEX, escrows, or checks.
{% /admonition %}

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Key Features of Confidential Transfers

The Confidential Transfers feature is built on three core design principles: issuer second account model, a multi-ciphertext architecture for privacy and compliance, and the split-balance model for reliable transfers.

### Issuer Second Account Model

Issuers introduce confidential tokens into circulation via a dedicated **second account** instead of their primary issuer account. The issuer's primary account cannot hold confidential balances because its balance doesn't count toward tokens in circulation.

To issue confidential tokens, issuers fund their second account with a public balance, then use the second account to convert the public balance to confidential form using the [ConfidentialMPTConvert transaction][].

The flow to issue confidential tokens is as follows:

1. The Issuer creates an MPT issuance.
2. The Issuer creates a dedicated _second account_.
3. The Issuer sends a public MPT amount to the dedicated _second account_.
4. The dedicated _second account_ converts the public balance to a confidential balance.

Because the XRP Ledger treats the second account as a regular _holder_, its balance counts towards tokens in circulation, which allows validators to enforce [supply caps](./multi-purpose-tokens.md#supply-cap) without needing to decrypt confidential balances.

In summary, this approach enables confidential distribution, where the issuer converts tokens once on the second account and distributes them directly to users, rather than requiring each holder to individually convert their balances from public to private.

### Multi-Ciphertext Architecture

A single confidential balance is represented by multiple parallel ciphertexts, each serving a distinct purpose:

- **Holder encryption:** The holder's balance is encrypted under their own public key, granting exclusive spending authority.

- **Issuer encryption:** The holder's balance is also encrypted under the issuer's public key, creating an encrypted mirror for supply verification and compliance without granting spending capability.

- **Optional auditor encryption:** If configured, the holder's balance is additionally encrypted under an auditor's public key, enabling independent verification and [on-chain selective disclosure](#on-chain-selective-disclosure).

Public keys must be generated off-chain using EC-ElGamal over secp256k1 encryption.

{% admonition type="info" name="Note" %}
This encryption method is not considered quantum-safe. In the future, the XRP Ledger may migrate to post-quantum friendly schemes, such as those based on lattice cryptography. The specific migration path and timeline for achieving quantum resistance remains an open area of research.
{% /admonition %}

#### Key Registration

To participate in confidential transfers, holders must first convert their public balance to confidential form using the [ConfidentialMPTConvert transaction][]. This initial conversion serves as the opt-in mechanism and registers the holder's ElGamal public key on the ledger, enabling them to receive and [manage confidential balances](#managing-confidential-balances).

Issuers and auditors register their keys when [enabling confidential transfers](#privacy-controls) on an MPT issuance.

{% admonition type="danger" name="Caution" %}
**If a holder loses their private key, their confidential funds are permanently lost.**
Issuer and auditor keys also cannot be changed or cleared once registered.
{% /admonition %}

#### Zero-Knowledge Proofs

The XRP Ledger relies on a set of ZKPs to validate confidential transactions without revealing balances or transfer amounts. The following proof types are used:

- **Schnorr Proof of Knowledge:** Proves ownership of the private key associated with an ElGamal public key. Required when a holder first registers their encryption key.

- **Compact sigma proofs:** Cryptographic proofs, also called _AND-composed compact sigma proofs_, that bundle multiple zero-knowledge statements into a single fixed-size proof verified in one pass. Each confidential transaction type uses its own dedicated compact sigma proof to verify that encrypted values are consistent and correctly linked.

- **Range proofs (Bulletproofs):** Prove that confidential amounts and post-transfer balances are non-negative and within a valid range, preventing overspending.

Validators can verify confidential transactions by checking these cryptographic proofs without ever learning the underlying amounts. For example, when a holder sends tokens confidentially, the transaction includes encrypted values and proofs that mathematically demonstrate:
- The sender has sufficient balance.
- The amount is non-negative.
- All encrypted copies of the transfer amount are consistent across the sender, receiver, issuer, and optional auditor.

Validators can only check the mathematical correctness of these proofs to ensure the transaction is valid, but cannot see the actual amounts involved.

### Split-Balance Model

To prevent the _stale proof_ problem, where an incoming transfer could invalidate a proof that a holder just created for an outgoing transfer, each account's confidential balance is divided into two parts:

- **Spending Balance:** A stable balance used to generate proofs for outgoing transactions.
- **Inbox Balance:** Receives all incoming confidential transfers.

When a holder receives a confidential transfer, the amount goes into their inbox. Before it can be spent, the holder must merge it into their spending balance using the [ConfidentialMPTMergeInbox transaction][]. If a merge is not explicitly performed, incoming funds accumulate in the inbox, remaining safe but unspendable until consolidated into the spending balance.

After a merge, the inbox is reset to a deterministic "encrypted zero" value. This zero value is a valid ElGamal ciphertext that represents zero, but is indistinguishable from other ciphertexts to observers without the private key.

#### Version Counter

Each time your spending balance changes, a **version counter** increments by 1 and is bound to newly generated proofs to prevent [replay attacks](https://en.wikipedia.org/wiki/Replay_attack). This ensures that old proofs cannot be reused maliciously.

## Privacy Properties

Confidential transfers keep transaction amounts and balances private while certain information remains publicly visible on the ledger:

{% tabs %}

{% tab label="Private" %}

- Transaction amounts are encrypted.
- Account balances are encrypted and only visible to the holder, issuer, and any configured auditors. Validators and network observers see only encrypted ciphertexts and cryptographic proofs, never the underlying amounts.
- Distribution of confidential supply across holders. The ledger does not publicly reveal which specific accounts hold how much of the confidential supply.

{% /tab %}

{% tab label="Public" %}

- Sender and receiver addresses.
- The type of transaction being submitted.
- Total token supply. The ledger publicly tracks two plaintext values: `OutstandingAmount` (total tokens in circulation) and `ConfidentialOutstandingAmount` (how much of that total is held confidentially). Validators use these values to enforce supply caps without decrypting any balances.
- Conversion amounts when converting between public and confidential forms.

{% /tab %}

{% /tabs %}

Note that in low-volume scenarios, publicly visible elements can reveal patterns. For example, if an account converts 1,000,000 tokens to confidential form and later converts 800,000 tokens back to public form, observers know that 200,000 tokens remain in confidential form. However, they cannot determine whether those tokens were transferred to other accounts or are still held by the original account, because encrypted balances for zero are indistinguishable from non-zero balances.

It's important to keep in mind that privacy is stronger when more participants make confidential transactions.

## Auditability and Compliance

The XRP Ledger supports two approaches for auditing hidden balances, on-chain selective disclosure and issuer-mediated auditing, along with a specialized clawback compliance mechanism.

### On-Chain Selective Disclosure

Issuers can configure an auditor when creating an MPT issuance by registering the auditor's ElGamal public key. This encrypts each holder's confidential balance under the auditor's public key, allowing the auditor to independently decrypt and verify balances off-chain without requiring cooperation from the issuer or holder. For example, a regulator designated as an auditor can use their own private key to decrypt a holder's confidential balance from the ledger, providing independent verification.

### Issuer-Mediated Auditing

As an alternative, issuers can provide auditing access by sharing their own ElGamal private key with auditors. Since the issuer maintains an encrypted mirror of all holder balances, the issuer's key provides read-only access to all confidential balances and transaction amounts. For example, when a regulator requests access to a user's transaction history, the issuer can provide the regulator with their ElGamal private key. The regulator can then use this key to decrypt the relevant confidential balances and transaction amounts directly from the ledger.

This approach is operationally simpler but requires the auditor to trust that the issuer is providing complete and accurate information, and it grants the auditor the same decryption capabilities as the issuer.

### Confidential Clawback

While issuers retain the same [compliance controls](./multi-purpose-tokens.md#compliance-controls) they have with public transactions, clawback operations work differently for confidential balances.

The [ConfidentialMPTClawback transaction][] allows issuers to claw back a holder's **entire** confidential balance. Off-chain, the issuer decrypts their mirror copy of the holder's balance and generates a cryptographic proof validating the plaintext amount. The issuer then submits the transaction with the plaintext amount and proof.

{% admonition type="danger" name="Caution" %}
The clawback proof can become stale if a holder's confidential balance changes between proof generation and validation. To ensure proof correctness and state consistency so the transaction doesn't fail on-ledger, issuers should follow the recommended flow for confidential clawbacks:

1. [Lock](./deep-freeze.md#how-does-mpt-freezelock-behavior-differ-from-iou) the MPT issuance for the holder by sending an [MPTokenIssuanceSet transaction](../../../references/protocol/transactions/types/mptokenissuanceset.md) with the `tfMPTLock` flag enabled.
2. Submit the ConfidentialMPTClawback transaction.

{% /admonition %}

Validators verify the proof provides cryptographic certainty that the plaintext amount matches the encrypted balance. If valid, both the holder's spending and inbox balances are set to encrypted zero, the version counter is reset to 0, and the clawed back tokens are removed from circulation.

## Privacy Controls

Issuers can enable confidential features by setting the **Can Hold Confidential Balance** flag on an MPT issuance. This can be done either during the initial [MPTokenIssuanceCreate transaction](../../../references/protocol/transactions/types/mptokenissuancecreate.md) or later using an [MPTokenIssuanceSet transaction](../../../references/protocol/transactions/types/mptokenissuanceset.md).

By default, the privacy setting is mutable, so it can be toggled on and off as long as no confidential balances exist. Once confidential balances exist, the flag can no longer be disabled.

When enabling confidential transfers, the issuer must also register their ElGamal public key, and if required, an auditor's public key. The MPT issuance must have a transfer fee of **0**, since transfer fees cannot be applied to encrypted amounts. If the issuance has a non-zero transfer fee, the issuer must remove it before enabling confidential transfers.

{% admonition type="warning" name="Caution" %}
If the issuer enables the **Cannot Enable Can Hold Confidential Balance** flag at any time, the privacy setting becomes permanent and cannot be changed, even if no confidential balances exist.
{% /admonition %}

## Managing Confidential Balances

Token holders can manage confidential balances through four operations:

- **Convert to confidential:** The [ConfidentialMPTConvert transaction][] converts public tokens to confidential form. The conversion amount is visible in plaintext, and the holder's public key is registered during their first conversion.

- **Send confidentially:** The [ConfidentialMPTSend transaction][] transfers confidential tokens between holders. The transfer amount remains encrypted and hidden from public view, with ZKPs ensuring transaction validity. This transaction supports the same authorization requirements as standard MPT payments, including [Deposit Authorization](../../accounts/depositauth.md) and [Credential](../../decentralized-storage/credentials.md) requirements.

- **Merge incoming transfers:** The [ConfidentialMPTMergeInbox transaction][] consolidates received tokens into the Spending Balance, making them available to send. This operation increments a version counter to prevent replay attacks.

- **Convert back to public:** The [ConfidentialMPTConvertBack transaction][] converts confidential tokens back to public form, making the amount visible on the ledger again.

## See Also

- **Concepts:**
  - [Multi-Purpose Tokens](./multi-purpose-tokens.md)
- **References:**
  - [ConfidentialMPTConvert transaction][]
  - [ConfidentialMPTConvertBack transaction][]
  - [ConfidentialMPTSend transaction][]
  - [ConfidentialMPTMergeInbox transaction][]
  - [ConfidentialMPTClawback transaction][]
  - [MPTokenIssuance entry][]
  - [MPToken entry][]
  - [MPTokenIssuanceCreate transaction][]
  - [MPTokenIssuanceSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
