# Issuing and Operational Addresses #

For any financial institution doing business using the Ripple Consensus Ledger, we strongly recommend that the institution use multiple Ripple ledger addresses with a separation of roles. This promotes strong security and minimizes risk. We recommend the following setup:

* An **issuing address** (also known as a "cold wallet") with high value, used as rarely as possible.
* One or more **operational addresses** (also known as a "hot wallets") with low value, used frequently by automated processes.
* Optional **standby addresses** (also known as "warm wallets"), used infrequently by human operators.

## The Risk ##

If a malicious person learns the secret key behind a institution's issuing address (cold wallet), that person could create an unlimited amount of new issuances and trade them in the decentralized exchange. This would make it difficult to distinguish legitimately-obtained issuances and redeem them fairly. In this case, the institution must create a new issuing address, and all users with trust lines to the old issuing address must create new trust lines to the new address. Thus, it's best to keep the secret key to your issuing address as secure as possible.


## Separation of Roles ##

The issuing address is like a vault. The secret keys used for this address should be kept offline, accessible to only a few trusted operators. The issuing address is responsible for creating issuances (any non-XRP currencies) in the Ripple Consensus Ledger. Customer addresses and operational addresses must create accounting relationships to the issuing address in order to hold those issuances.

Periodically, a human operator creates and signs a transaction from the issuing address in order to refill the balance of the operational address(es). Ideally, the secret key used to sign these transactions should never be accessible from any internet-connected computer.

An operational address is like a cash register. It makes payments on behalf of the institution by sending issuances created by the issuing address. The secret key for an operational address is, by necessity, stored on a server that is connected to the outside internet, usually in a configuration file. (The secret key can be stored encrypted, but the server must decrypt it in order to sign transactions.)

Customers do not, and should not, create accounting relationships (trust lines) to an operational address. An institution can use one or more operational addresses, but it's easiest to configure the financial institution's software to use just a single operational address.

(Unlike a cash register, an operational address does not have to handle incoming payments from users, because the issuing address can receive and monitor payments without using its secret key. To make things simple for customers, we recommend treating incoming payments to the operational and issuing addresses as the same.)

Each operational address has a limited balance of issuances. If an operational address's secret key is compromised, the financial institution only loses as much currency as that operational address holds. Customers do not need to change any configuration in order to receive funds from a new operational address.

The drawback to this separation of roles, aside from the initial setup, is that the institution must monitor operational the balances of operational addresses so that those addresses don't run out of funds during ordinary operation.


### Standby Addresses ###

Another optional step that an institution can take to balance risk and convenience is to use "standby addresses" as an intermediate step between the issuing address and operational addresses. The institution can fund additional Ripple addresses as standby addresses, whose keys are not stored online, but are entrusted to different trusted users.

When an operational address is running low on funds, a trusted user can use a standby address to refill the operational address's balance. When the standby addresses run low on funds, the institution can use the issuing address to send more currency to a standby address in a single transaction, and the standby addresses can distribute that currency among themselves if necessary. This improves security of the issuing address, allowing it to make fewer total transactions, without leaving too much money in the control of a single automated system.

As with operational addresses, standby addresses must trust the issuing address, and should not be trusted by users. All precautions that apply to operational addresses also apply to standby addresses.
