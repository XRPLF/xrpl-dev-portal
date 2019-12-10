# Offline Account Setup Tutorial

A highly secure [signing configuration](set-up-secure-signing.html) involves keeping an XRP Ledger [account](accounts.html)'s [cryptographic keys](cryptographic-keys.html) securely on an offline, air-gapped machine. After setting up this kind of configuration, you can sign a variety of transactions, transfer only the signed transactions to an online computer, and submit them to the XRP Ledger network without ever exposing your secret key to malicious actors online.

**Caution:** Proper operational security is necessary to protect your offline machine. For example, the offline machine must be physically located where untrusted people cannot get access to it, and trusted operators must be careful not to transfer compromised software onto the machine. (For example, do not use a USB drive that was previously attached to a network-connected computer.)

## Prerequisites

To use offline signing, you must have the following

- You must have one computer to use as an offline machine. This machine must be set up with a [supported operating system](system-requirements.html). See your operating system's support for offline setup instructions. (For example, [Red Hat Enterprise Linux DVD ISO installation instructions](https://access.redhat.com/solutions/7227).) Be sure that the software and physical media you use are not infected with malware.
    - The offline machine needs secure persistent storage (for example, an encrypted disk drive) and a way to [sign transactions](set-up-secure-signing.html) such as [`rippled` running in stand-alone mode](rippled-server-modes.html) or [ripple-lib](rippleapi-reference.html).
- You must have a separate computer to use as an online machine. This machine does not need to run `rippled` but it must be able to connect to the XRP Ledger network and receive accurate information about the state of the shared ledger. For example, you can use a [WebSocket connection to a public server](get-started-with-the-rippled-api.html).
- You must have a secure way to transfer signed transaction binary data from the offline machine to the online machine.
    - One way to do this is with a QR code generator on the offline machine, and a QR code scanner on the online machine.
    - Another way is to copy files from the offline machine to an online machine using physical media. If you use this method, be sure not to use physical media that could infect your offline machine with malicious software. (For example, do not reuse the same USB drive on both online and offline machines.)
    - You _could_ manually type the data onto the online machine, but doing so would be tedious and error-prone.

## Steps

{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Generate cryptographic keys

On the **offline machine**, generate a pair of [cryptographic keys](cryptographic-keys.html) to be used with your account. Be sure to generate the keys with a securely random procedure, not from a simple passphrase or some other source that does not have enough entropy. For example, you can use the [wallet_propose method][] of `rippled`:

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

Take note of the following values:

- **`account_id`**. This is the address associated with the key pair, which will become your **[account](accounts.html) address** in the XRP Ledger after you fund it with XRP (later in this process). It is safe to share your `account_id` publicly.
- **`master_seed`**. This is the secret seed value for the keypair, which you'll use to sign transactions from the account. For best security, encrypt this value before writing it to disk on the offline machine. As an encryption key, use a secure passphrase that human operators can memorize or write down somewhere physically secure, such as a [diceware passphrase](http://world.std.com/~reinhold/diceware.html) created with properly weighted dice. You may also want to use a physical security key as a second factor. The extent of the precautions to take at this stage is up to you.
- **`key_type`**. This is the cryptographic algorithm used for this key pair. You need to know what type of key pair you have in order to sign valid transactions. The default is `secp256k1`.

**Do not** share the `master_key`, `master_seed`, or `master_seed_hex` values anywhere. Any of these can be used to reconstruct the private key associated with this address.



### {{n.next()}}. Fund the new address

From an online machine, send enough XRP to the **account address** you noted in step 1. For more information, see [Creating Accounts](accounts.html#creating-accounts).

**Tip:** For testing purposes, you can use the [Testnet Faucet](xrp-testnet-faucet.html) to get a new account with Test XRP, then use that account to fund the address you generated offline.



### {{n.next()}}. Confirm account details

When the transaction from the previous step is validated by consensus, your account has been created. From the online machine, you can confirm the status of the account with the [account_info method][]. Make sure the response contains `"validated": true` to confirm that this result is final.

Take note of the sequence number of the account, in the `Sequence` field of the result's `account_data`. You need to know the sequence number to sign transactions from the account in future steps.

If the [DeletableAccounts amendment](known-amendments.html#deletableaccounts) :not_enabled: is enabled, the `Sequence` number of a newly-funded account matches the [ledger index][] when it was funded. Otherwise, a newly funded account's `Sequence` number is always 1.



### {{n.next()}}. Enter the sequence number on the offline machine.

Save the account's starting sequence number on the offline machine as its current sequence number. Whenever you sign a new transaction using the offline machine, you will use the current sequence number, then increase the current sequence number by 1.

You can prepare several transactions in advance this way, then transfer the signed transactions to the online machine all at once and submit them. As long as each transaction is validly formed and pays a sufficient [transaction cost](transaction-cost.html), the XRP Ledger network should eventually include those transactions in validated ledgers, keeping the account's sequence number in the shared XRP Ledger in sync with the "current" sequence number you are tracking on the offline machine.

### {{n.next()}}. Sign initial setup transactions, if any.

On the offline machine, prepare and sign any transacitons you want to send to configure your account. ***TODO: examples***


### {{n.next()}}. (online) Submit setup transactions.

***TODO***


### {{n.next()}}. (online) confirm success/validation of online transactions, note final sequence number

***TODO***


### {{n.next()}}. (offline) confirm that offline sequence number tracking matches up, adjust if necessary

***TODO***


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
