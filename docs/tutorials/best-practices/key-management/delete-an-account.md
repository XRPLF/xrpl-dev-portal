---
seo:
  description: Delete an account, sending its remaining XRP to another account.
labels:
  - Accounts
---
# Delete an Account

This tutorial shows how to delete an [account](../../../concepts/accounts/index.md) from the XRP Ledger, including checking that it meets the [requirements for deletion](../../../concepts/accounts/deleting-accounts.md).

## Goals

By following this tutorial, you should learn how to:

- Check if an account can be deleted.
- Delete an account.


## Prerequisites

To complete this tutorial, you should:

- Have a basic understanding of the XRP Ledger.
- Have an XRP Ledger [client library](../../../references/client-libraries.md), such as **xrpl.js**, installed.
- Have an XRP Ledger Testnet account to delete. If you create a new account as part of the tutorial, you must wait about 15 minutes for it to become eligible for deletion.
- Know an address where you want to send the deleted account's remaining XRP. For this tutorial, you can use the address `rJjHYTCPpNA3qAM8ZpCDtip3a8xg7B8PFo` to return funds to the Testnet faucet.

## Steps

### 1. Install dependencies

{% tabs %}
{% tab label="JavaScript" %}
From the code sample folder, use `npm` to install dependencies:

```sh
npm i
```
{% /tab %}

{% tab label="Python" %}
From the code sample folder, set up a virtual environment and use `pip` to install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
{% /tab %}
{% /tabs %}

### 2. Connect and get accounts

To get started, import the client library and instantiate an API client. To delete an account, you need the address of an account to receive the deleted account's remaining XRP.

{% tabs %}
{% tab label="JavaScript" %}
The sample code also imports `dotenv` so that it can load environment variables from a `.env` file.
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" before="// Load the account to delete" /%}
{% /tab %}

{% tab label="Python" %}
The sample code also imports `python-dotenv` so that it can load environment variables from a `.env` file.
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" before="# Load the account to delete" /%}
{% /tab %}
{% /tabs %}

You need to instantiate a wallet instance for the account you want to delete. Since you can only delete an account that is at least ~15 minutes old, the sample code loads a seed value from a `.env` file. If you don't have an account seed defined in the `.env` file, you can get a new account from the faucet, but it won't be possible to delete it right away.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Load the account to delete" before="// Check account info" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Load the account to delete" before="# Check account info" /%}
{% /tab %}
{% /tabs %}

### 3. Check to see if the account can be deleted

Before deleting an account, you should check that it meets the requirements for deletion.

#### 3.1. Get account info

The first step to checking if an account can be deleted is to get its account info as of the latest validated ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Check account info" before="// Check if sequence number is too high" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Check account info" before="# Check if sequence number is too high" /%}
{% /tab %}
{% /tabs %}

#### 3.2. Check sequence number

Check that the account's current sequence number, in the `Sequence` field of the account data, is low enough compared with the latest validated ledger index. For the account to be deletable, its sequence number plus 255 must be lower than or equal to the ledger index.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Check if sequence number is too high" before="// Check if owner count is too high" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Check if sequence number is too high" before="# Check if owner count is too high" /%}
{% /tab %}
{% /tabs %}

#### 3.3. Check owner count

Check the `OwnerCount` field of the account data to see if the account owns too many other ledger entries. For an account to be deletable, it must own 1000 or fewer entries (of any type) in the ledger.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Check if owner count is too high" before="// Check if XRP balance is high enough" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Check if owner count is too high" before="# Check if XRP balance is high enough" /%}
{% /tab %}
{% /tabs %}

#### 3.4. Check XRP balance

Deleting an account requires a special [transaction cost][] equal to the incremental owner reserve, so an account can't be deleted if its current XRP balance is less than that. To check if an account has enough XRP, use the [server_state method][] to look up the current incremental reserve and compare with the account's XRP balance in the `Balance` field of the account data.

{% admonition type="warning" name="Caution" %}The [server_info method][] returns reserve values as decimal XRP, whereas [server_state][server_state method] returns drops of XRP. An account's `Balance` field is in drops of XRP. Be sure to compare equivalent units! (1 XRP = 1 million drops){% /admonition %}

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Check if XRP balance is high enough" before="// Check if FirstNFTSequence is too high" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Check if XRP balance is high enough" before="# Check if FirstNFTSequence is too high" /%}
{% /tab %}
{% /tabs %}

#### 3.5. Check NFT sequence number

Check the `FirstNFTokenSequence` and `MintedNFTokens` fields of the account. (If either field is absent, you can treat its value as `0` for this purpose.) For the account to be deletable, the sum of these two numbers plus 255 must be lower than or equal to the current ledger index. 

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Check if FirstNFTSequence is too high" before="// Check that all issued NFTs have been burned" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Check if FirstNFTSequence is too high" before="# Check that all issued NFTs have been burned" /%}
{% /tab %}
{% /tabs %}

#### 3.6. Check that all issued NFTs have been burned

If the account has issued any NFTs that are still present in the ledger, the account cannot be deleted. You can check to see if any exist by comparing the `MintedNFTokens` field and `BurnedNFTokens` fields of the account. (In both cases, if the field is omitted, treat its value as `0`.) If the `MintedNFTokens` value is larger, the account has issued at least one NFT that has not been burned yet.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Check that all issued NFTs have been burned" before="// Stop if any problems were found" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Check that all issued NFTs have been burned" before="# Stop if any problems were found" /%}
{% /tab %}
{% /tabs %}

#### 3.7. Stop if the account can't be deleted

If any of the previous checks failed, you can't delete the account. Resolving the problems varies by type:

- If the account sequence or NFT sequence number is too low, wait for the ledger index to advance automatically and try again later. About 15 minutes should be enough.
- If the account owns too many objects, or has issued NFTs outstanding, remove the offending objects.
- If the account does not have enough XRP, you can send XRP to it so that it can pay the deletion cost, but of course in this case the account does not have enough XRP for you to recover any by deleting it. You can also wait and try again if the network [votes to lower the reserve requirements](../../../concepts/consensus-protocol/fee-voting.md), which would also lower the cost to delete an account.

The sample code does not try to handle these problems, and quits if any problems were found:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Stop if any problems were found" before="// Check for deletion blockers" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Stop if any problems were found" before="# Check for deletion blockers" /%}
{% /tab %}
{% /tabs %}

### 4. Check for deletion blockers and remove them if possible

Some types of ledger entries can block an account from being deleted. You can check for these types of entries using the [account_objects method][] with the `"deletion_blockers_only": true` parameter.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Check for deletion blockers" before="// Delete the account" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Check for deletion blockers" before="# Delete the account" /%}
{% /tab %}
{% /tabs %}

If the account has deletion blockers, you may or may not be able to remove them by sending other transactions, depending on the ledger entry. For example, if one of the blockers is a `RippleState` entry, you may be able to remove it by reducing your balance to zero through payments or offers and using a [TrustSet transaction][] to return your settings to the default state. Since there are many possibilities, the sample code does not show how to remove deletion blockers.

### 5. Delete the account

If all the checks passed, send an [AccountDelete transaction][] to delete the account. Since this transaction type requires a much higher [transaction cost][] than normal, it's a good idea to submit the transaction with the "fail hard" setting enabled. This can save you from paying the transaction cost if the transaction was going to fail with a [`tec` result code](../../../references/protocol/transactions/transaction-results/tec-codes.md). (Fail hard stops the server from relaying the transaction to the network if the transaction provisionally fails, which catches common errors before the transaction can achieve a consensus.)

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Delete the account" before="// Check result of the AccountDelete transaction" /%}

If the transaction is successful, you can use [getBalanceChanges(...)](https://js.xrpl.org/functions/getBalanceChanges.html) to check the metadata and see how much XRP was delivered from the deleted account to the destination account.

{% code-snippet file="/_code-samples/delete-account/js/delete-account.js" language="js" from="// Check result of the AccountDelete transaction" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Delete the account" before="# Check result of the AccountDelete transaction" /%}

If the transaction is successful, you can use [get_balance_changes(...)](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.utils.html#xrpl.utils.get_balance_changes) to check the metadata and see how much XRP was delivered from the deleted account to the destination account.

{% code-snippet file="/_code-samples/delete-account/py/delete-account.py" language="py" from="# Check result of the AccountDelete transaction" /%}
{% /tab %}
{% /tabs %}

## See Also

- **Concepts:**
    - [Deleting Accounts](../../../concepts/accounts/deleting-accounts.md)
    - [Transaction Cost](../../../concepts/transactions/transaction-cost.md)
- **References:**
    - [AccountDelete transaction][]
    - [account_info method][]
    - [account_objects method][]
    - [server_state method][]


{% raw-partial file="/docs/_snippets/common-links.md" /%}
