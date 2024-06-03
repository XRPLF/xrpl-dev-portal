---
html: authorized-trust-lines.html
parent: trust-lines-and-issuing.html
seo:
    description: Authorized trust lines is a setting to limit who can hold a token.
labels:
  - Tokens
  - Security
---
# Authorized Trust Lines

The Authorized Trust Lines feature enables issuers to create tokens that can only be held by accounts that the issuer specifically authorizes. This feature only applies to tokens, not XRP.

To use the Authorized Trust Lines feature, enable the **Require Auth** flag on your issuing account. While the setting is enabled, other accounts can only hold tokens you issue if you have authorized those accounts' trust lines to your issuing account.

You can authorize a trust line by sending a [TrustSet transaction][] from your issuing address, configuring the trust line between your account and the account to authorize. After you have authorized a trust line, you can never revoke that authorization. (You can, however, [freeze](freezes.md) that trust line if you need to.)

The transaction to authorize a trust line must be signed by the issuing address, which unfortunately means an increased risk exposure for that address.

**Caution:** You can only enable Require Auth if your account has no trust lines and no Offers in the XRP Ledger, so you must decide whether or not to use it _before_ you start issuing tokens.

## Reserves

Trust lines are ledger objects that require a reserve of 2 XRP each. To help new users get started, the reserve amounts are waived for the first 2 trust lines you create for a new account. Fund your new account with 10 XRP and create your new trust lines. If you have more than 10 XRP in your account, up to 4 XRP are reserved for your first 2 trust lines. If you remove the trust line later, the reserves are freed up for future use.

## With Stablecoin Issuing

With a stablecoin on the XRP Ledger and use Authorized Trust Lines, the process of onboarding a new customer might look something like the following:

1. The customer registers with the stablecoin issuer's systems and sends proof of their identity (also known as "Know Your Customer", or KYC, information).
2. The customer and stablecoin issuer tell each other their XRP Ledger addresses.
3. The customer sends a [TrustSet transaction][] to create a trust line to the issuer's address, with a positive limit.
4. The issuer sends a TrustSet transaction to authorize the customer's trust line.

**Tip:** The two TrustSet transactions (steps 3 and 4) can occur in either order. If the issuer authorizes the trust line first, this creates a trust line with the limit set to 0, and the customer's TrustSet transaction sets the limit on the pre-authorized trust line.

## As a Precaution

Even if you don't intend to use Authorized Trust Lines, you can enable the Require Auth setting on [operational and standby accounts](../../accounts/account-types.md), and then never have those accounts approve any trust lines. This prevents those accounts from issuing tokens by accident (for example, if a user accidentally trusts the wrong address). This is only a precaution, and does not stop the operational and standby accounts from transferring the _issuer's_ tokens, as intended.


## Technical Details

### Enabling Require Auth

The following is an example of using a locally hosted `rippled`'s [submit method][] to send an [AccountSet transaction][] that enables Require Auth using the `asfRequireAuth` flag. (This method works the same way regardless of whether the address is an issuing address, operational address, or standby address.)

Request:

```json
POST http://localhost:5005/
{
    "method": "submit",
    "params": [
        {
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 2,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

{% partial file="/docs/_snippets/secret-key-warning.md" /%}


## Checking Whether an Account Has Require Auth Enabled

To see whether an account has the Require Auth setting enabled, use the [account_info method][] to look up the account. Compare the value of the `Flags` field (in the `result.account_data` object) with the [bitwise flags defined for an AccountRoot ledger object](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md).

If the result of the `Flags` value bitwise-AND the `lsfRequireAuth` flag value (`0x00040000`) is nonzero, then the account has Require Auth enabled. If the result is zero, then the account has Require Auth disabled.

## Authorizing Trust Lines

If you are using the Authorized Trust Lines feature, others cannot hold balances you issue unless you first authorize their trust lines to you. If you issue more than one currency, you must separately authorize trust lines for each currency.

To authorize a trust line, submit a [TrustSet transaction][] from your issuing address, with the user to trust as the `issuer` of the `LimitAmount`. Leave the `value` (the amount to trust them for) as **0**, and enable the [`tfSetfAuth`](../../../references/protocol/transactions/types/trustset.md#trustset-flags) flag for the transaction.

The following is an example of using a locally hosted `rippled`'s [submit method][] to send a TrustSet transaction authorizing the customer address `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn` to hold USD issued by the address `rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW`:

Request:

```json
POST http://localhost:8088/

{
    "method": "submit",
    "params": [
        {
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "Fee": "15000",
                "TransactionType": "TrustSet",
                "LimitAmount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": 0
                },
                "Flags": 65536
            }
        }
    ]
}
```

{% partial file="/docs/_snippets/secret-key-warning.md" /%}


## Checking Whether Trust Lines Are Authorized

To see whether a trust line has been authorized, use the [account_lines method][] to look up the trust line. In the request, provide the customer's address in the `account` field and the issuer's address in the `peer` field.

In the response's `result.lines` array, find the object whose `currency` field indicates that it represents a trust line for the currency you want. If that object has a `peer_authorized` field with the value `true`, then the issuer (the address you used as the request's `peer` field) has authorized the trust line.


## See Also

- **Concepts:**
    - [Deposit Authorization](../../accounts/depositauth.md)
    - [Freezing Issued Currencies](freezes.md)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags)
    - [RippleState (trust line) Flags](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestate-flags)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
