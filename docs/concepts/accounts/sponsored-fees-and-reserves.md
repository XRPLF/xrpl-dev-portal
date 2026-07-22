---
seo:
    description: Sponsors can pay transaction fees and reserve requirements on behalf of other accounts on the XRP Ledger.
labels:
  - Fees
  - Accounts
  - Sponsorship
status: not_enabled
---
# Sponsored Fees and Reserves

The Sponsored Fees and Reserves feature allows an account to pay transaction fees and reserve requirements on behalf of another account. The account that pays is called the _Sponsor_, and the account that benefits is called the _Sponsee_. Sponsees maintain full control over their keys and accounts.

{% admonition type="info" name="Note" %}
Sponsorship does not transfer XRP to the sponsee's wallet. The sponsor can cover transaction fees, and for reserve sponsorship, the ledger tracks which account is responsible for the reserve. This is not an "onramp" for the sponsee; it is a mechanism for the sponsor to cover costs on the sponsee's behalf.
{% /admonition %}

Without sponsorship, accounts must self-fund both transaction fees and reserves before they can transact on the XRP Ledger. Sponsorship provides a mechanism for entities with established XRP balances to subsidize these costs while maintaining strong on-chain accountability.

Sponsorship enables several important use cases, including:

- **Token distribution**: Issuers can distribute tokens without requiring recipients to hold XRP first.
- **Enterprise onboarding**: Businesses can onboard customers seamlessly without blockchain friction.

{% admonition type="success" name="Tip" %}
Similar features on other chains are often called "sponsored transactions", "meta-transactions", or "relays".
{% /admonition %}

{% amendment-disclaimer name="Sponsor" /%}

## How Sponsorship Works

XRP Ledger accounts can be sponsored in one of two ways: **co-signing** or **pre-funding**.
Co-signing requires sponsors to sign each transaction, allowing them to pay the transaction cost and the reserve for any accounts or objects created in the transaction. Pre-funding lets sponsors allocate funds in advance to cover fees and reserves so they do not need to sign every sponsored transaction.

For example, consider Spencer (sponsor) who wants to cover costs for Alice (sponsee):

- **Co-signing**: Alice constructs her transaction, including Spencer's account and the sponsorship type. Both parties then sign the same transaction. This gives Spencer fine-grained control over every sponsored transaction.

- **Pre-funding**: Spencer submits a [SponsorshipSet transaction][] to allocate funds for Alice. This can cover both transaction fees and reserves for new objects, such as trust lines, escrows, or payment channels. From then on, Alice can submit transactions that reference Spencer as her sponsor without needing his signature each time. Spencer's involvement ends after the initial setup.

### Enabling Sponsorship and Covering Costs

For a transaction to be sponsored, at least one of the following flags must be enabled:

- `spfSponsorFee`: This flag indicates that the sponsor pays the transaction fee.
- `spfSponsorReserve`: This flag indicates that the sponsor covers the reserve for objects created in a transaction, such as trust lines, escrows, or payment channels. No XRP is transferred to the sponsee; the sponsor's XRP stays in their own account, and the ledger simply tracks which account is responsible for holding the reserve.

If a transaction has **both** flags enabled, the sponsor pays for the fee and any reserves for objects created in the transaction. Additionally, a single transaction cannot have different sponsors for the fee and the reserve; both must come from the same sponsor.

{% admonition type="info" name="Note" %}
[Pseudo-transactions](../../references/protocol/transactions/pseudo-transaction-types/index.md) don't support either sponsorship flag as they simply don't have fees or reserves at all.

All other transaction types can use the `spfSponsorFee` flag, but only certain transactions are permitted to use `spfSponsorReserve`. See [Common Fields](../../references/protocol/transactions/common-fields.md#sponsorflags-field) for the list of allowed transactions.
{% /admonition %}

Sponsoring a new account is a special case. Because the account doesn't exist yet, its reserve can't be sponsored through `spfSponsorReserve`. Instead, the account's creator sponsors the reserve directly by enabling the `tfSponsorCreatedAccount` flag on a [Payment transaction][] when creating the account.

### Reserve Calculation

Sponsorship modifies the reserve formula, shifting the burden from the sponsee to the sponsor.

The standard reserve calculation is:

```txt
acctReserve + objReserve × acct.OwnerCount
```

With sponsorship, the calculation becomes:

```txt
(acct.Sponsor ? 0 : acctReserve) +
objReserve × (acct.OwnerCount + acct.SponsoringOwnerCount - acct.SponsoredOwnerCount) +
acctReserve × acct.SponsoringAccountCount
```

- If the account has a `Sponsor` field, meaning its account reserve is sponsored, the base account reserve requirement is 0 for that account, and the sponsor covers it instead.
- `SponsoringOwnerCount` tracks objects this account sponsors.
- `SponsoredOwnerCount` tracks objects owned by this account that are sponsored by others.
- `SponsoringAccountCount` tracks accounts this account sponsors.

### Security Considerations

Sponsorship includes safeguards to protect both parties from misuse:

- **Co-signed flow**: Both parties must consent to each transaction by providing their signatures. The sponsor signs the entire transaction, including the sponsee's `Account` and `Sequence` fields, which prevents signature replay attacks. The sponsor also approves the `Fee` value and any fields that affect reserve requirements, such as `Destination`.

- **Pre-funded flow**: The sponsor consents once when submitting a `SponsorshipSet` transaction. The sponsee cannot modify the terms or exceed the limits the sponsor set. The sponsor can limit usage with `FeeAmount`, `MaxFee`, and `RemainingOwnerCount`, or require their signature for specific transactions using the `lsfSponsorshipRequireSignForFee` or `lsfSponsorshipRequireSignForReserve` flags.

The sponsee cannot unilaterally change the sponsorship type, and the sponsor's funds cannot be used beyond the agreed terms. Only the sponsee can transfer a sponsorship to a new sponsor, and the new sponsor must co-sign the transaction to consent. Either party can exit a sponsorship relationship at any time by submitting a [SponsorshipTransfer transaction][].

## Managing Sponsorships

Over time, sponsors may want to recoup their reserves, and sponsees may want to change sponsors or take on the reserve burden themselves. The [SponsorshipTransfer transaction][] supports three operations:

- **Create sponsorship**: Only the sponsee can create a new sponsorship. The new sponsor provides their signature via the standard signing flow.
- **Reassign sponsorship**: Only the sponsee can transfer an existing sponsorship to a new sponsor. The old sponsor is not directly involved.
- **End sponsorship**: Either the sponsor or sponsee can end a sponsorship at any time. The reserve burden returns to the object owner.

{% admonition type="warning" name="Caution" %}
When ending account sponsorship, the sponsee must have enough XRP to cover the account reserve. If they do not, and the sponsor needs to exit the sponsorship relationship quickly, the sponsor can send XRP to the sponsee with the `Payment` transaction. However, the sponsor will **not** get their reserve back.

These steps can be executed atomically via a [Batch transaction](../transactions/batch-transactions.md), to ensure that the sponsee cannot use the funds for something else before the transfer is validated.
{% /admonition %}

### Recouping Object Reserves

A sponsor who wants to recoup the reserve held for a sponsee's object, such as an escrow or trust line, can use the [SponsorshipTransfer transaction][] to end the sponsorship, transferring the reserve burden back to the sponsee. The sponsor cannot move the sponsorship to a different sponsor; only the sponsee can reassign it.

### Recouping Account Reserves

A sponsor who wants to recoup the reserve held for a sponsee's account has two options:

- **If the sponsee is done using their account**: The sponsee can submit an [AccountDelete transaction][]. The destination, where leftover XRP goes, must be the sponsor's account. This ensures the sponsor gets their reserve back.

  {% admonition type="info" name="Note" %}
  Sponsored objects owned by the sponsee, such as trust lines, escrows, checks, payment channels, and MPTokens, are [deletion blockers](./deleting-accounts.md#deletion-blockers) and must be removed before the account can be deleted.
  {% /admonition %}

- **If the sponsee wants to keep their account**: The sponsor can use the [SponsorshipTransfer transaction][] to end the sponsorship, returning the reserve burden to the sponsee. As with objects, only the sponsee can reassign the sponsorship to a different sponsor.

### Deleting a Sponsor's Account

A sponsor's account cannot be deleted if it is sponsoring any existing accounts or objects. To unblock deletion, the sponsor can use a [SponsorshipTransfer transaction][] to end each sponsorship, returning the reserve burden to the sponsee, or ask each sponsee to reassign the sponsorship to another sponsor or delete the objects.

## See Also

- **Concepts**
  - [Transaction Cost](../transactions/transaction-cost.md)
  - [Reserves](./reserves.md)
  - [Transaction Queue](../transactions/transaction-queue.md)

- **References:**
    - [AccountRoot entry]
    - [Sponsorship ledger entry][]
    - [SponsorshipSet transaction][]
    - [SponsorshipTransfer transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
