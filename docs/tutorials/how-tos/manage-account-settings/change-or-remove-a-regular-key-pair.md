---
html: change-or-remove-a-regular-key-pair.html
parent: manage-account-settings.html
seo:
    description: Remove or update a regular key pair already authorized by your account.
labels:
  - Security
  - Accounts
---
# Change or Remove a Regular Key Pair

The XRP Ledger allows an account to authorize a secondary key pair, called a _[regular key pair](../../../concepts/accounts/cryptographic-keys.md)_, to sign future transactions.  If your [account](../../../concepts/accounts/index.md)'s regular key pair is compromised, or if you want to periodically change the regular key pair as a security measure, use a [SetRegularKey transaction][] to remove or change the regular key pair for your account.

For more information about master and regular key pairs, see [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md).


## Changing a Regular Key Pair

The steps to change your existing regular key pair are almost the same as the steps to [assign a regular key](assign-a-regular-key-pair.md) for the first time. You generate the key pair and assign it to your account as a regular key pair, overwriting the existing regular key pair. However, the main difference is that when changing the existing regular key pair, you can use the existing regular private key to replace itself; but when assigning a regular key pair to an account for the first time, you have to use the account's master private key to do it.

For more information about master and regular key pairs, see [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md).


## Removing a Regular Key Pair

If you want to remove a compromised regular key pair from your account, you don't need to generate a key pair first. Use a [SetRegularKey transaction][], omitting the `RegularKey` field. Note that the transaction fails if you don't have another way of signing for your account currently enabled (either the master key pair or a [signer list](../../../concepts/accounts/multi-signing.md)).


When removing a regular key pair to your account, the `SetRegularKey` transaction requires signing by your account's master private key (secret) or existing regular key pair. Sending your master or regular private key anywhere is dangerous, so we keep transaction signing separate from transaction submission to the network.

### Sign Your Transaction

{% partial file="/docs/_snippets/tutorial-sign-step.md" /%}


Populate the request fields with the following values:

| Request Field | Value                                                        |
|:--------------|:-------------------------------------------------------------|
| `Account`     | The address of your account.                                 |
| `secret`      | `master_key`, `master_seed`, or `master_seed_hex` (master or regular private key) for your account. |


#### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "sign",
  "tx_json": {
      "TransactionType": "SetRegularKey",
      "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8"
      },
   "secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "sign",
    "params": [
        {
        "secret" : "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
        "tx_json" : {
            "TransactionType" : "SetRegularKey",
            "Account" : "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8"
            }
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: sign secret tx_json
rippled sign snoPBrXtMeMyMHUVTgbuqAfg1SUTb '{"TransactionType": "SetRegularKey", "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"}'
```
{% /tab %}

{% /tabs %}


#### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
    "tx_json": {
      "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 2,
      "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
      "hash": "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "result": {
        "status": "success",
        "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
        "tx_json": {
            "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 2,
            "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
            "TransactionType": "SetRegularKey",
            "TxnSignature": "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
            "hash": "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
        }
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
      "tx_json" : {
         "Account" : "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 2,
         "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
         "TransactionType" : "SetRegularKey",
         "TxnSignature" : "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
         "hash" : "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
      }
   }
}
```
{% /tab %}

{% /tabs %}

The `sign` command response contains a `tx_blob` value, as shown above. The offline signing response contains a `signedTransaction` value. Both are signed binary representations (blobs) of the transaction.

Next, use the `submit` command to send the transaction blob (`tx_blob` or `signedTransaction`) to the network.


### Submit Your Transaction

Take the `signedTransaction` value from the offline signing response or the `tx_blob` value from the `sign` command response and submit it as the `tx_blob` value using the [submit method][].

#### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "submit",
    "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method":"submit",
   "params":[
      {
         "tx_blob":"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
      }
   ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: submit tx_blob
rippled submit 1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E
```
{% /tab %}

{% /tabs %}


#### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
    "tx_json": {
      "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 2,
      "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
      "hash": "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "result": {
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
        "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
        "tx_json": {
            "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 2,
            "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
            "TransactionType": "SetRegularKey",
            "TxnSignature": "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
            "hash": "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
        }
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
      "tx_json" : {
         "Account" : "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 2,
         "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
         "TransactionType" : "SetRegularKey",
         "TxnSignature" : "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
         "hash" : "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
      }
   }
}
```
{% /tab %}

{% /tabs %}

The way to verify that regular key pair removal succeeded is to confirm that you can't send a transaction using the removed regular private key.

Here's an example error response for an [AccountSet transaction][] signed using the regular private key removed by the `SetRegularKey` transaction above.


### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "error": "badSecret",
  "error_code": 41,
  "error_message": "Secret does not match account.",
  "request": {
    "command": "submit",
    "secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
    "tx_json": {
      "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
      "TransactionType": "AccountSet"
    }
  },
  "status": "error",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "result": {
        "error": "badSecret",
        "error_code": 41,
        "error_message": "Secret does not match account.",
        "request": {
            "command": "submit",
            "secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
            "tx_json": {
                "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
                "TransactionType": "AccountSet"
            }
        },
        "status": "error"
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "error" : "badSecret",
      "error_code" : 41,
      "error_message" : "Secret does not match account.",
      "request" : {
         "command" : "submit",
         "secret" : "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
         "tx_json" : {
            "Account" : "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
            "TransactionType" : "AccountSet"
         }
      },
      "status" : "error"
   }
}
```
{% /tab %}

{% /tabs %}

In some cases, you can even use the `SetRegularKey` transaction to send a [key reset transaction](../../../concepts/transactions/transaction-cost.md#key-reset-transaction) without paying the [transaction cost](../../../concepts/transactions/transaction-cost.md). The XRP Ledger's [transaction queue](../../../concepts/transactions/transaction-queue.md) prioritizes key reset transactions above other transactions even though the nominal transaction cost of a key reset transaction is zero.


- **Concepts:**
    - [Cryptographic Keys](../../../concepts/accounts/cryptographic-keys.md)
    - [Multi-Signing](../../../concepts/accounts/multi-signing.md)
    - [Transaction Cost](../../../concepts/transactions/transaction-cost.md)
- **Tutorials:**
    - [Change or Remove a Regular Key Pair](change-or-remove-a-regular-key-pair.md)
    - [Set Up Multi-Signing](set-up-multi-signing.md)
    - [List XRP as an Exchange](../../../use-cases/defi/list-xrp-as-an-exchange.md)
- **References:**
    - [wallet_propose method][]
    - [sign method][]
    - [SetRegularKey transaction][]
    - [AccountRoot object](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md) where the regular key is stored in the field `RegularKey`

{% raw-partial file="/docs/_snippets/common-links.md" /%}
