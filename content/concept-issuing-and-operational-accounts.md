# Issuing and Operational Accounts #

For any financial institution doing business using the Ripple Consensus Ledger, we strongly recommend that the institution use multiple Ripple ledger accounts with a separation of roles. This promotes strong security and minimizes risk. We recommend the following setup:

* An **issuing account** (also known as a "cold wallet") with high value, used as rarely as possible.
* One or more **operational accounts** (also known as a "hot wallets") with low value, used frequently by automated processes.
* Optional **standby accounts** (also known as "warm wallets"), used infrequently by human operators.


## The Risk ##

If a malicious person compromises a institution's issuing account (cold wallet), that person could create an unlimited amount of new issuances and trade them in the decentralized exchange. This would make it difficult to distinguish legitimately-obtained issuances and redeem them fairly. In this case, the institution must create a new issuing account, and all users with trust lines to the old issuing account must create new trust lines to the new account. Thus, it's best to keep your issuing account as secure as possible.


## Separation of Roles ##

The issuing account is like a vault. It serves as the asset issuer, and should remain offline. The secret key that is used for this account is kept offline, accessible to only a few trusted operators. Periodically, a human operator creates and signs a transaction (preferably from an entirely offline machine) in order to refill the operational account's balance. Because the issuing account is creating the issuances, customer accounts holding those issuances must create trust lines to the issuing account.

An operational account is like a cash register. It makes payments on behalf of the institution by sending issuances created by the issuing account. The secret key for an operational account is, by necessity, stored on a server that is connected to the outside internet, usually in a configuration file on a public-facing server. Because it holds issuances created by the issuing account, each operational account must create a trust line to the issuing account. Customers do not, and should not, trust operational accounts. An institution can use one or more operational accounts, but it's easiest to configure the financial institution's software to use just a single operational account.

(Unlike a cash register, an operational account does not have to handle incoming payments from users, because the issuing account can receive and monitor payments without using its secret key. To make things simple for your users, we recommend treating incoming payments to the operational and issuing accounts as the same.)

Each operational account has a limited balance of the issuances. If an operational account is compromised, the financial institution only loses as much currency as that operational account holds. Customers do not need to change any configuration in order to receive funds from a new operational account. However, the institution must monitor operational accounts balances so that those accounts don't run out of funds during ordinary operation.


### Standby Accounts ###

Another optional step that an institution can take to balance risk and convenience is to use "standby accounts" as an intermediate step between the issuing account and operational accounts. The institution can operate additional accounts as standby accounts, whose keys not stored online, but are entrusted to different trusted users.

When an operational account is running low on funds, a trusted user can use a standby accountto refill the operational account's balance. When the standby accounts run low on funds, the institution can use the issuing account to send more currency to a standby account in a single transaction, and the standby accounts can distribute that currency among themselves if necessary. This improves security of the issuing account, allowing it to make fewer total transactions, without leaving too much money in the control of a single automated system.

As with operational accounts, standby accounts must trust the issuing account, and should not be trusted by users. All precautions that apply to operational accounts also apply to standby accounts.
