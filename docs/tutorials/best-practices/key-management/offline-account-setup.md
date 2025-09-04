---
html: offline-account-setup.html
parent: manage-account-settings.html
seo:
    description: Set up an XRP Ledger account using an air-gapped, offline machine to store its cryptographic keys.
labels:
  - Accounts
  - Security
---
# Offline Account Setup Tutorial

A highly secure [signing configuration](../../../concepts/transactions/secure-signing.md) involves keeping an XRP Ledger [account](../../../concepts/accounts/index.md)'s [cryptographic keys](../../../concepts/accounts/cryptographic-keys.md) securely on an offline, air-gapped machine. After setting up this configuration, you can sign a variety of transactions, transfer only the signed transactions to an online computer, and submit them to the XRP Ledger network without ever exposing your secret key to malicious actors online.

{% admonition type="warning" name="Caution" %}Proper operational security is necessary to protect your offline machine. For example, the offline machine must be physically located where untrusted people cannot get access to it, and trusted operators must be careful not to transfer compromised software onto the machine. (For example, do not use a USB drive that was previously attached to a network-connected computer.){% /admonition %}

## Prerequisites

To use offline signing, you must meet the following prerequisites:

- You must have one computer to use as an offline machine. This machine must be set up with a [supported operating system](../../../infrastructure/installation/system-requirements.md). See your operating system's support for offline setup instructions. (For example, [Red Hat Enterprise Linux DVD ISO installation instructions](https://access.redhat.com/solutions/7227).) Be sure that the software and physical media you use are not infected with malware.
- You must have a separate computer to use as an online machine. This machine does not need to run `rippled` but it must be able to connect to the XRP Ledger network and receive information about the state of the shared ledger. For example, you can use a [WebSocket connection to a public server](../../http-websocket-apis/build-apps/get-started.md).
- You must have a secure way to transfer signed transaction binary data from the offline machine to the online machine.
    - One way to do this is with a QR code generator on the offline machine, and a QR code scanner on the online machine. (In this case, your "online machine" could be a handheld device such as a smartphone.)
    - Another way is to copy files from the offline machine to an online machine using physical media. If you use this method, be sure not to use physical media that could infect your offline machine with malicious software. (For example, do not reuse the same USB drive on both online and offline machines.)
    - You _could_ manually type the data onto the online machine, but doing so would be tedious and error-prone.


## Steps

### 1. Set up offline machine

The offline machine needs secure persistent storage (for example, an encrypted disk drive) and a way to [sign transactions](../../../concepts/transactions/secure-signing.md). For an offline machine, you typically use physical media to transfer any necessary software after downloading it from an online machine. You must be sure that the online machine, the physical media, and the software itself are not infected with malware.

Software options for signing on the XRP Ledger include:

- [Install `rippled`](../../../infrastructure/installation/index.md) from a package (`.deb` or `.rpm` depending on which Linux distribution you use) file, then [run it in stand-alone mode](../../../concepts/networks-and-servers/rippled-server-modes.md).
- Install [xrpl.js](https://github.com/XRPLF/xrpl.js/) (or another [client library](../../../references/client-libraries.md)) and its dependencies offline. The Yarn package manager, for example, has [recommended instructions for offline usage](https://yarnpkg.com/blog/2016/11/24/offline-mirror/).
- See also: [Set Up Secure Signing](../../../concepts/transactions/secure-signing.md)

You may want to set up custom software to help construct transaction instructions on the offline machine. For example, your software may track what [sequence number][] to use next, or contain preset templates for certain types of transactions you expect to send.


### 2. Generate cryptographic keys

On the **offline machine**, generate a pair of [cryptographic keys](../../../concepts/accounts/cryptographic-keys.md) to be used with your account. Be sure to generate the keys with a securely random procedure, not from a short passphrase or some other source that does not have enough entropy. For example, you can use the [wallet_propose method][] of `rippled`:

{% tabs %}

{% tab label="rippled Commandline" %}
```sh
$ ./rippled wallet_propose
Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-09 22:58:24.110862955 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "account_id" : "r4MRc4BArFPXmiDjmLdrufyFManSYhfKE6",
      "key_type" : "secp256k1",
      "master_key" : "JANE GIBE LIST TEND NU RUDE JIG PA FLOG DEFT SAME NASH",
      "master_seed" : "shYHSiJod8CLPTj1SNJ2PdUFj4pFk",
      "master_seed_hex" : "8465FDB80B2E2620A7D58274C26291A0",
      "public_key" : "aBQLW8imt7VChRJU1NMVCB7fE3jSL3VNEgLDKf88ygAhnfuZh3oo",
      "public_key_hex" : "03396074ED4B8155ACF9A8DC3665EFA53B5CFA0A1E91C3879303D37721EB222644",
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

Take note of the following values:

- **`account_id`**. This is the address associated with the key pair, which becomes your **[account](../../../concepts/accounts/index.md) address** in the XRP Ledger after you fund it with XRP (later in this process). It is safe to share your `account_id` publicly.
- **`master_seed`**. This is the secret seed value for the key pair, which you'll use to sign transactions from the account. For best security, encrypt this value before writing it to disk on the offline machine. As an encryption key, use a secure passphrase that human operators can memorize or write down somewhere physically secure, such as a [diceware passphrase](https://theworld.com/~reinhold/diceware.html) created with properly weighted dice. You may also want to use a physical security key as a second factor. The extent of the precautions to take at this stage is up to you.
- **`key_type`**. This is the cryptographic algorithm used for this key pair. You need to know what type of key pair you have. The default in `rippled` is `secp256k1`, but some client libraries use `Ed25519` by default.

**Do not** share the `master_key`, `master_seed`, or `master_seed_hex` values anywhere. Any of these can be used to reconstruct the private key associated with this address.

<!-- SPELLING_IGNORE: diceware -->



### 3. Fund the new address

From an online machine, send enough XRP to the **account address** you noted in step 1. For more information, see [Creating Accounts](../../../concepts/accounts/index.md#creating-accounts).

{% admonition type="success" name="Tip" %}For testing purposes, you can use the [Testnet Faucet](/resources/dev-tools/xrp-faucets) to get a new account with Test XRP, then use that account to fund the address you generated offline.{% /admonition %}



### 4. Confirm account details

When the transaction from the previous step is validated by consensus, your account has been created. From the online machine, you can confirm the status of the account with the [account_info method][]. Make sure the response contains `"validated": true` to confirm that this result is final.

Take note of the sequence number of the account, in the `Sequence` field of the result's `account_data`. You need to know the sequence number to sign transactions from the account in future steps.

The `Sequence` number of a newly-funded account matches the [ledger index][] when it was funded. Before the [DeletableAccounts amendment](/resources/known-amendments.md#deletableaccounts), a newly funded account's `Sequence` number was always 1.

{% tabs %}

{% tab label="rippled Commandline" %}
```sh
$ ./rippled account_info rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn

Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-11 01:06:21.728637950 HTTPClient:NFO Connecting to 127.0.0.1:5005
{
   "result" : {
      "account_data" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Balance" : "5000000000000",
         "Flags" : 0,
         "LedgerEntryType" : "AccountRoot",
         "OwnerCount" : 0,
         "PreviousTxnID" : "00C5B713B11DA775C6F932D38CE162C16FA88B7269BAFC6FDF4C6ADB74419670",
         "PreviousTxnLgrSeq" : 3,
         "Sequence" : 1,
         "index" : "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
      },
      "ledger_current_index" : 4,
      "status" : "success",
      "validated" : false
   }
}
```
{% /tab %}

{% /tabs %}

### 5. Enter the sequence number on the offline machine.

Save the account's starting sequence number on the offline machine. Whenever you prepare a transaction using the offline machine, use the saved sequence number, then increase the sequence number by 1 and save the new value.

You can prepare several transactions in advance this way, then transfer the signed transactions to the online machine all at once and submit them. As long as each transaction is validly formed and pays a high enough [transaction cost](../../../concepts/transactions/transaction-cost.md), the XRP Ledger network should eventually include those transactions in validated ledgers, keeping the account's sequence number in the shared XRP Ledger in sync with the "current" sequence number you are tracking on the offline machine. (Most transactions get a final, validated result within 15 seconds or less after being submitted to the network.)

Optionally, save the current ledger index to the offline machine. You can use this value to choose an appropriate `LastLedgerSequence` value for upcoming transactions.



### 6. Sign initial setup transactions, if any.

On the offline machine, prepare and sign transactions for configuring your account. The details depend on how you intend to use your account. Some examples of things you might want to do include:

- [Assign a regular key pair](assign-a-regular-key-pair.md) that you can rotate regularly.
- [Require destination tags](require-destination-tags.md) so that users can't send you payments without tagging the reason they sent it or the customer it's intended for.
- [Set Up Multi-Signing](set-up-multi-signing.md) for a higher bar of account security.
- [Enable DepositAuth](../../../concepts/accounts/depositauth.md) so you can only receive payments you've explicitly accepted or from parties you've pre-approved.
- [Require Auth](../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md#enabling-require-auth) so that users can't open [trust lines](../../../concepts/tokens/fungible-tokens/index.md) to you without your permission. If you don't plan to use the XRP Ledger's decentralized exchange or [token](../../../concepts/tokens/index.md) features, you may want to do this as a precaution.
- [Token Issuers](../../../use-cases/tokenization/stablecoin-issuer.md) may have additional setup, such as:
    - Set a Transfer Fee for users transferring your tokens.
    - Disallow XRP payments if you plan to use this address for tokens only.

At this stage, you are only signing the transactions, not submitting them. For each transaction, you must provide all fields, including fields that are normally auto-fillable such as the `Fee` ([transaction cost](../../../concepts/transactions/transaction-cost.md)) and `Sequence` ([sequence number][]). If you prepare multiple transactions at the same time, you must use sequentially increasing `Sequence` numbers in the order you want the transactions to execute.

Example (enable Require Auth):

{% tabs %}

{% tab label="rippled Commandline" %}
```sh
$ rippled sign sn3nxiW7v8KXzPzAqzyHXbSSKNuN9 '{"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Fee": "12", "Sequence": 1, "TransactionType": "AccountSet", "SetFlag": 2}' offline

Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-11 00:18:31.865955978 HTTPClient:NFO Connecting to 127.0.0.1:5005
{
   "result" : {
      "deprecated" : "This command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000000120210000000268400000000000000C7321039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A174473045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD4381144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "12",
         "Flags" : 2147483648,
         "Sequence" : 1,
         "SetFlag" : 2,
         "SigningPubKey" : "039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A1",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "3045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD43",
         "hash" : "F81C34E7F05423DC1C973CB5008CA41AE984DE142EAA3975A749FABF0D08FA63"
      }
   }
}
```
{% /tab %}

{% /tabs %}

To ensure _all_ transactions have a final outcome within a limited amount of time, provide a [`LastLedgerSequence`](../../../concepts/transactions/reliable-transaction-submission.md#lastledgersequence) field. This value should be based on the current ledger index (which you must look up from an online machine) and the amount of time you want the transaction to remain valid. Be sure to set a large enough `LastLedgerSequence` value to allow for time spent switching from the online machine to the offline machine and back. For example, a value 256 higher than the current ledger index means that the transaction is valid for about 15 minutes. For more information, see [Finality of Results](../../../concepts/transactions/finality-of-results/index.md) and [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).


### 7. Copy transactions to online machine.

After you have signed the transactions, the next step is to get the signed transaction data to your online machine. See [Prerequisites](#prerequisites) for some examples of how to do this.



### 8. Submit setup transactions.

The next step is to submit the transactions. Most transactions should have a final outcome in the next validated ledger after submission (about 4 seconds later), or possibly the ledger after that if they get queued (less than 10 seconds). For detailed steps to track the final outcome of a transaction, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).

Example of transaction submission:

{% tabs %}

{% tab label="rippled Commandline" %}
```sh
$ rippled submit 1200032280000000240000000120210000000268400000000000000C7321039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A174473045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD4381144B4E9C06F24296074F7BC48F92A97916C6DC5EA9

Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-11 01:14:25.988839227 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "deprecated" : "Signing support in the 'submit' command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000000120210000000268400000000000000C7321039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A174473045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD4381144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "12",
         "Flags" : 2147483648,
         "Sequence" : 1,
         "SetFlag" : 2,
         "SigningPubKey" : "039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A1",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "3045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD43",
         "hash" : "F81C34E7F05423DC1C973CB5008CA41AE984DE142EAA3975A749FABF0D08FA63"
      }
   }
}
```
{% /tab %}

{% /tabs %}

{% admonition type="success" name="Tip" %}If you are submitting more than 10 transactions at a time, you may have more success if you submit them in groups of 10 or less at a time, because the [transaction queue](../../../concepts/transactions/transaction-queue.md) is limited to 10 transactions from the same sender at a time. After each group of 10 transactions, wait for all the transactions to leave the queue before submitting the next group.{% /admonition %}

Retry submitting any transactions that failed with a [non-final outcome](../../../concepts/transactions/finality-of-results/index.md). There is no chance of the same transaction being processed more than once.

### 9. Confirm the final status of the transactions.

For each transaction you submitted, note the transaction's [final outcome](../../../concepts/transactions/finality-of-results/index.md), for example using the [tx method][]. For example:

{% tabs %}

{% tab label="rippled Commandline" %}
```sh
$ ./rippled tx F81C34E7F05423DC1C973CB5008CA41AE984DE142EAA3975A749FABF0D08FA63

Loading: "/etc/opt/ripple/rippled.cfg"
2019-Dec-11 01:38:30.124771464 HTTPClient:NFO Connecting to 127.0.0.1:5005
{
   "result" : {
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee" : "12",
      "Flags" : 2147483648,
      "Sequence" : 1,
      "SetFlag" : 2,
      "SigningPubKey" : "039543A0D3004CDA0904A09FB3710251C652D69EA338589279BC849D47A7B019A1",
      "TransactionType" : "AccountSet",
      "TxnSignature" : "3045022100D5C92D7705036CD7EBB601C8DFCD90927FA591A62AF832C489E9C898EC8E2FA0022052F1819340EB73E9749B8930A6935727362B8E141D1B2E246B49F912223FFD43",
      "date" : 629343510,
      "hash" : "F81C34E7F05423DC1C973CB5008CA41AE984DE142EAA3975A749FABF0D08FA63",
      "inLedger" : 4,
      "ledger_index" : 4,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                     "Balance" : "4999999999988",
                     "Flags" : 262144,
                     "OwnerCount" : 0,
                     "Sequence" : 2
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
                  "PreviousFields" : {
                     "Balance" : "5000000000000",
                     "Flags" : 0,
                     "Sequence" : 1
                  },
                  "PreviousTxnID" : "00C5B713B11DA775C6F932D38CE162C16FA88B7269BAFC6FDF4C6ADB74419670",
                  "PreviousTxnLgrSeq" : 3
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}

You may also find it useful to check the [account_info][account_info method] of the sending account after all transactions have processed. Note the account's current sequence number (`Sequence` field) and, optionally, XRP balance.

For any transactions that failed, you should decide what to do:

- If the transaction failed with a `tefMAX_LEDGER` code, you may need to specify a higher [transaction cost](../../../concepts/transactions/transaction-cost.md) to get the transaction processed. (This likely indicates that the XRP Ledger network is under load.) You may decide to replace the transaction with a new version that pays a higher cost and has a higher `LastLedgerSequence` parameter (if any).
- If the transaction failed with any [`tem`-class code](../../../references/protocol/transactions/transaction-results/tem-codes.md), you probably made a typo or another error in constructing the transaction. Double-check the transaction so that you can replace it with a validly-formed one.
- If the transaction failed with a [`tec`-class code](../../../references/protocol/transactions/transaction-results/tec-codes.md), you should address it on a case-by-case basis depending on the exact reason it failed.

For any transactions you decide to adjust or replace, note the details for when you return to the offline machine.



### 10. Reconcile offline machine status.

Return to the offline machine and apply any necessary changes to your custom server's saved settings, such as:

- Updating the account's current `Sequence` number. If all transactions were included in validated ledgers (successfully or with `tec` codes), then the offline machine's saved sequence number should already be correct. Otherwise, you may need to change the saved sequence number to match the `Sequence` value you noted in the previous step.
- Updating the current ledger index so that you can use appropriate `LastLedgerSequence` values in any new transactions. (You should always do this shortly before constructing any new transactions.)
- _(Optional)_ Updating your actual amount of XRP available, if you are tracking it in the offline machine.

Then adjust and sign any replacement transactions for transactions that failed in the previous step. Repeat the previous steps for constructing transactions on the offline machine, transferring them, and submitting them from the online machine.



## See Also

- **Concepts:**
    - [Accounts](../../../concepts/accounts/index.md)
    - [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md)
- **Tutorials:**
    - [Set Up Secure Signing](../../../concepts/transactions/secure-signing.md)
    - [Assign a Regular Key Pair](assign-a-regular-key-pair.md)
    - [Set Up Multi-Signing](set-up-multi-signing.md)
- **References:**
    - [Basic Data Types: Account Sequence](../../../references/protocol/data-types/basic-data-types.md#account-sequence)
    - [account_info method][]
    - [sign method][]
    - [submit method][]
    - [tx method][]
    - [AccountSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
