---
seo:
    description: A blackholed account is an XRP Ledger account that can never send transactions again because its signing authority has been permanently removed.
labels:
  - Accounts
---
# Blackholed Accounts

A blackholed account is an account whose signing authority has been permanently and verifiably removed. Once an account is blackholed, no one can ever send transactions from it again.

## Why Blackhole an Account

Blackholing an account is an extreme measure that most account owners will never need to consider. Use cases include:
- **Proving a fixed token supply.** By blackholing an issuing account, the owner proves to users and token holders that the account can no longer mint additional tokens, change transfer fees, or freeze balances.
- **Decommissioning an account that can't be deleted.** If an account has [deletion blockers](deleting-accounts.md#deletion-blockers), it cannot be deleted. Blackholing permanently removes the account's signing authority, preventing further activity. Unlike deletion, the account remains on the ledger and its reserves stay locked.

## Requirements

To be considered blackholed, an account must meet all of the following conditions:
- The master key is disabled.
- The regular key is set to a known [blackhole address](addresses.md#special-addresses).
- The account has no [signer list](multi-signing.md).
- The account has no [delegates](permission-delegation.md). {% amendment-disclaimer name="PermissionDelegation" /%}

## Checking Whether an Account Is Blackholed

There is no cryptographic certificate of blackholing. You can only verify that an account meets the conditions above.

To check, call the [account_info method][] and confirm all of the following:
1. The `lsfDisableMaster` flag is set.
2. The `RegularKey` field is set to a known [blackhole address](addresses.md#special-addresses) (either `rrrrrrrrrrrrrrrrrrrrrhoLvTp` for ACCOUNT_ZERO or `rrrrrrrrrrrrrrrrrrrrBZbvji` for ACCOUNT_ONE).
3. No [SignerList entry][] exists for the account, confirmed by calling the [account_objects method][].
4. No [Delegate ledger entry][] exists for the account, confirmed by calling the [account_objects method][].

ACCOUNT_ZERO and ACCOUNT_ONE are considered known blackhole addresses because they are derived from the integers 0 and 1 instead of a private key. This makes it effectively impossible for anyone to produce a matching private key.

If the regular key is set to an arbitrary address rather than a known blackhole address, there is no way to verify that no one holds the corresponding private key.

{% admonition type="info" name="Note" %}
A blackholed account's transaction history will continue to show activity from other accounts using its tokens or completing transactions involving it. The blackholed account itself is not sending these transactions.
{% /admonition %}

## Risks and Limitations

Blackholing is irreversible. Before blackholing an account, be aware of the following:
- Any XRP held by the account is permanently lost and cannot be retrieved.
- The account cannot send any transactions after blackholing. Any misconfigured settings (such as transfer fees, freeze authority, or rippling) are permanently locked in.
- Existing ledger entries created before blackholing (such as open offers, escrows, payment channels, or checks) can still complete, meaning additional tokens could be issued or XRP could leave the account after blackholing.

## See Also

- **Concepts:**
  - [Deleting Accounts](deleting-accounts.md)
  - [Cryptographic Keys](cryptographic-keys.md)
  - [Multi-Signing](multi-signing.md)
  - [Special Addresses](addresses.md#special-addresses)
- **Tutorials:**
  - [Disable Master Key Pair](../../tutorials/best-practices/key-management/disable-master-key-pair.md)
  - [Assign a Regular Key Pair](../../tutorials/best-practices/key-management/assign-a-regular-key-pair.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}