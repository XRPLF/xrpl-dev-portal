# Disable Master Key Pair

This page describes how to disable the [master key pair](cryptographic-keys.html) that is mathematically associated with an [account](accounts.html)'s address. You may wish to do this if you believe your account's master key pair has been compromised, or if you want to make [multi-signing](multi-signing.html) the _only_ way to submit transactions from your account.

**Warning:** Disabling the master key pair removes one method of [authorizing transactions](transaction-basics.html#authorizing-transactions). You should be sure you can use one of the other ways of authorizing transactions, such as with a regular key or by multi-signing, before you disable the master key pair. (For example, if you [assigned a regular key pair](assign-a-regular-key-pair.html), make sure that you can successfully submit transactions with that regular key.) Because the XRP Ledger is a decentralized system, no one can restore access to your account if you cannot use the remaining ways of authorizing transactions.

**Only the master key pair can be used to disable itself.** However, you can _re-enable_ the master key pair using any other method of authorizing transactions.

## Prerequisites

To disable the master key pair for an account, you must meet the following prerequisites:

- You must have an XRP Ledger [account](accounts.html) and you must be able to sign and submit transactions from that account using the master key pair. See also: [Set Up Secure Signing](set-up-secure-signing.html).
    - In most cases, you use your account's master seed value for signing these transactions. Most commonly, this value is represented as a [base58][] value starting with "s", such as `sn3nxiW7v8KXzPzAqzyHXbSSKNuN9`.
- Your account must have at least one method of authorizing transactions other than the master key pair. In other words, you must do one or both of the following:
    - [Assign a Regular Key Pair](assign-a-regular-key-pair.html).
    - [Set Up Multi-Signing](set-up-multi-signing.html).

## Steps

{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Construct Transaction JSON

Prepare an [AccountSet transaction][] from your account with the field `"SetValue": 4`. This is the value for the account-set-flag Disable Master (asfDisableMaster). The only other required fields for this transaction are the required [common fields](transaction-common-fields.html). For example, if you leave off the [auto-fillable fields](transaction-common-fields.html#auto-fillable-fields), the following transaction instructions are enough:

```json
{
  "TransactionType": "AccountSet",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "SetFlag": 4
}
```

It is strongly recommended to also provide the `LastLedgerSequence` field so that you can [reliably get the outcome of the transaction in a predictable amount of time](reliable-transaction-submission.html).

### {{n.next()}}. Sign Transaction

You must use the master key pair to sign the transaction.

TODO

### {{n.next()}}. Submit Transaction

TODO

### {{n.next()}}. Wait for validation

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

### {{n.next()}}. Confirm Account Flags

Confirm that your account's master key is disabled using the [account_info method][]. Be sure to specify `"ledger_index": "validated"` to get results from the latest validated ledger version.

In the response's `account_data` object, compare the `Flags` field with the lsfDisableMaster flag value (`0x00100000` in hex, or `1048576` in decimal) using bitwise-AND. This operation has only two possible outcomes:

- A nonzero result, equal to the lsfDisableMaster value, indicates **the master key has been successfully disabled**.
- A zero result indicates the account's master key is not disabled.

If the result does not match your expectations, check whether the transaction you sent in the previous steps has executed successfully. It should be the most recent entry in the account's transaction history ([account_tx method][]) and it should have the result code `tesSUCCESS`. If you see any other [result code](transaction-results.html), the transaction was not executed successfully. Depending on the cause of the error, you may want to restart these steps from the beginning.
