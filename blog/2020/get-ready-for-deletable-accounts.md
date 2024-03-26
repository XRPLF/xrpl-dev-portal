---
category: 2020
date: 2020-05-06
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Get Ready for Deletable Accounts

The XRP Ledger is currently [expected to enable](https://xrpl.org/blog/2020/deletableaccounts-expected.html) the deletion of on-ledger accounts for the first time, through the [DeletableAccounts Amendment](https://xrpl.org/known-amendments.html#deletableaccounts), on **2020-05-08 (UTC)**. This amendment comes with changes to some fairly fundamental details of the XRP Ledger protocol. If you use the XRP Ledger for your business, this is a good time to do a last check to make sure you're ready.

Read on for some tips on:

- Deletable accounts in general
- Handling changes to account creation
- Dealing with accounts that could be deleted
- Getting XRP back by deleting your extra accounts

<!-- BREAK -->

## Deletable accounts in general

Prior to this amendment, every [account in the XRP Ledger](https://xrpl.org/accounts.html) was permanent. That's part of why there's a 20 XRP reserve to create new accounts; they take up space in the shared ledger.

After the amendment, any account that meets [the prerequisites](https://xrpl.org/accounts.html#deletion-of-accounts) can be deleted. Only the owner of an account can delete it, though, since you have to send a transaction from the account to be deleted. After an account has been deleted, it's completely gone from the current ledger. Its transaction history continues to exist in immutable historical ledger data, so [full-history servers](https://xrpl.org/ledger-history.html#full-history) won't forget about it. It will eventually be forgotten by servers that only keep recent ledger history; to those servers, an account that has been deleted is pretty much the same as an account that never existed.

After an account has been deleted, anyone can re-create it by sending at least 20 XRP to its address to fund the account, just like with any other valid XRP Ledger address. The newly created account is initialized like any other new account: settings from before it was deleted _do not_ carry over. Just like any other address, you don't get any special powers over the account for funding it; you need the cryptographic keys associated with the address to have control over the account.


## Handling changes to account creation

The DeletableAccounts amendment changes the way new accounts' [sequence numbers](https://xrpl.org/basic-data-types.html#account-sequence) work in the XRP Ledger: instead of starting at sequence number 1, the starting sequence number matches the current ledger index when the account was created. This change protects accounts from having their old transactions replayed if the account gets deleted and then re-created.

Sequence numbers otherwise work the same. There are no changes necessary if you are continuing to use an account that was already created before deletable accounts.

Sending transactions from newly-funded accounts is mostly the same as before; the main difference with deletable accounts is that you should check the account's starting sequence number when you confirm that the account has been funded, instead of assuming the starting sequence number is 1. If you let your signing software [auto-fill](https://xrpl.org/sign.html#auto-fillable-fields) the `Sequence` number, no changes are necessary.

In cases where you must explicitly specify the sequence number, you can look it up using the [account_info method](https://xrpl.org/account_info.html) first. For a detailed walkthrough of how to do this process with an airgapped machine, see [Offline Account Setup](https://xrpl.org/offline-account-setup.html).


## Dealing with accounts that could be deleted

One change that is likely to have a mild impact on many integrations with the XRP Ledger is simply the fact that accounts are no longer permanent. Even if you have looked up an account once to confirm that it exists now, deletable accounts mean the account may not still be there later when you try to interact with it again.

For example, if someone gives you the address of an account where they want you to send a payment, your transaction may fail if the account you're sending to has been deleted. In this case, your transaction may result in a code such as [`tecNO_DST` or `tecNO_DST_INSUF_XRP`](https://xrpl.org/tec-codes.html). (If you send at least 20 XRP, your transaction will successfully fund the account instead.) You should **not automatically re-send** payments that failed with these codes, because the second transaction is very likely to fail with the same error. In this case, you should check with the intended recipient for a different address that you should use instead. The typical way to handle these errors has not changed, but there are more circumstances where they can come up.

If you try to look up the [account_info](https://xrpl.org/account_info.html) of an account that does not exist in the ledger version you've queried, the server responds with the error code `actNotFound`. This could mean the account has been deleted, or it did not exist to begin with. If you want to know if an account has ever existed, you can use the [account_tx method](https://xrpl.org/account_tx.html) on a full-history server.

One of the prerequisites for deleting an account is that it must not be linked to any objects in the ledger. You don't need to worry about not being able to finish an [Escrow](https://xrpl.org/escrow.html), and the [issuer of a non-XRP currency](https://xrpl.org/issued-currencies-overview.html) won't go away as long as anyone holds a balance of that currency.

Payment Channels are a little more complicated because channels that have been grandfathered in from before the [fixPayChanRecipientOwnerDir amendment went live on 2020-05-01](https://xrpl.org/blog/2020/two-fixes-enabled.html) don't actually block their destinations from being deleted. (All new payment channels created since then do.) If the destination of a grandfathered payment channel has been deleted, the following options are possible:

- Someone can re-create the destination account by funding it with at least 20 XRP.
- The sender of the payment channel can request to close the channel, according to the normal restrictions.
- If the channel has an immutable expiration time or is already scheduled to close, you can wait for it to close and then remove the expired channel from the ledger as normal.


## Getting XRP back by deleting your extra accounts

If you have any accounts on the XRP Ledger that you're not using, you may have up to 20 XRP locked up for the [reserve requirements](https://xrpl.org/reserves.html) for each of those accounts. (It's possible for an account to have less than 20 XRP if you've destroyed XRP to pay [transaction costs](https://xrpl.org/transaction-cost.html).) If your account meets the prerequisites, you can get most of the reserved XRP back by deleting your unused accounts.

**The cost to delete an account is 5 XRP,** which is destroyed in the process of deleting the account. This cost protects the XRP Ledger from attacks where someone excessively creates accounts and then deletes them to get their XRP reserves back. If an account currently holds less than 5 XRP, it cannot be deleted.

To delete an account, it must have _no_ [trust lines](https://xrpl.org/trust-lines-and-issuing.html), [Escrows](https://xrpl.org/escrow.html), or [Payment Channels](https://xrpl.org/payment-channels.html) in the ledger linked to it. If your account currently has any of these ledger objects, you may be able to delete the account _after_ removing some objects:

- To remove a trust line, reset it to its default state. (0 limit, 0 balance, and no non-default settings.)
- To remove an Escrow, finish it (if the escrow is ready), or cancel it (if the escrow is expired). If it is a time-based escrow, you cannot remove it until its FinishAfter time has passed.
- To remove a PaymentChannel, close the channel. If the channel has unclaimed XRP, you may have to wait for the `SettleDelay` to expire after requesting to close the channel.

If your account meets the requirements to be deleted, send an [AccountDelete transaction](https://xrpl.org/accountdelete.html) from that account. The `Destination` address in the transaction receives the deleted account's remaining XRP (after subtracting the destroyed XRP). If you are withdrawing to an account at an exchange or hosted wallet, don't forget to include your `DestinationTag` at that exchange.


## Next steps

Stay tuned for updates on whether the DeletableAccounts amendment becomes enabled as expected, as well as the status of other amendments that are currently in voting such as the Checks amendment.

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [The Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)
