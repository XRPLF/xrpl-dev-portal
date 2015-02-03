# About Gatewayd #

Gatewayd (pronounced "gateway-dee"), provides a framework you can extend to build a gateway on the Ripple Network. The system includes a core database that manages accounting for deposits and withdrawals of assets, linking the network with your holdings in the outside world. Gatewayd provides a standard interface for issuing any currency on the Ripple network and exchange, with the goal of completely abstracting interaction with Ripple.

Interact with the gatewayd by building custom integrations with banking and payment systems around the world, and by using the built-in APIs for designing beautiful gateway mobile apps and user interfaces. Gatewayd includes a REST API, Javascript library, and commandline interface; developers can also interact with Gatewayd by directly modifying the database records it monitors.

<div class="alert alert-danger">

**Gatewayd is currently unsupported.** Gatewayd is undergoing a major restructuring. Use the current, in-development version at your own risk. For continuing support of previous versions of Gatewayd, contact [developers@ripple.com](mailto:developers@ripple.com). For new enterprise-class integrations, we recommend that you use [Ripple-REST](ripple-rest.html) instead at this time.

</div>

Gatewayd's features include: 

  - deposits and withdrawals
  - issuing currency
  - robust Ripple payment sending
  - incoming Ripple payment monitoring
  - gateway administration
  - support for custom plugins


## Dependencies

1. [Node.js](http://nodejs.org/)
  - The express web module is used to serve HTTP/JSON endpoints
  - A Basic Auth strategy is used for authentication of users, admin.
  - Several NPM modules must be globally installed: db-migrate, pg, forever, and mocha

2. [Postgres](http://www.postgresql.org/)
  - The easiest way to get started with Postgres is by launching a [free database hosted by Heroku](https://postgres.heroku.com/databases)
  - For local development on Mac the simplest installation is via the [Postgres App](http://postgresapp.com/) by Heroku.
  - On Linux, you can generally install Postgres from your distro's package manager. See instructions for:
    - [Ubuntu](https://help.ubuntu.com/community/PostgreSQL)
    - [Debian](https://wiki.debian.org/PostgreSql)
    - [Red Hat, Fedora, CentOS](http://www.postgresql.org/download/linux/redhat/)
    - [SuSE](http://www.postgresql.org/download/linux/suse/)
    - [Arch Linux](https://wiki.archlinux.org/index.php/Postgres)

3. [Ripple REST API](https://github.com/ripple/ripple-rest.git)
  - The Ripple REST API provides a simplified HTTP/JSON interface to all the Ripple protocol network operations, such as payments and other transactions.

4. [git](http://git-scm.com/) is required for installation and updating. It is not used during general operation.



## Gatewayd Architecture ##

A gateway acts as a link between Ripple's shared global Ledger and value outside of the network, such as traditional banking balances, other virtual currencies, or more. Thus, gatewayd sits between the `rippled` server (which participates in the network that defines the Ripple global ledger) and some source of information about external activities. Gatewayd's main job is to monitor each side for transactions and translate them into the appropriate actions on the other side.

Gatewayd has effectively 4 queues: an inbox and outbox for transactions going from the outside world into the Ripple Network; and a corresponding inbox and outbox for transactions going the opposite direction. It has 2 software services for sending and receiving Ripple transactions, and 2 more services for converting between Ripple transactions and external transactions. In order to have a fully functional gateway, you must add custom code for sending and receiving transactions in the outside world. Naturally, these vary depending on how your gateway accepts outside payment.

You can visualize Gatewayd's architecture according to the following diagram:

[![Gatewayd Architecture](img/gatewayd_architecture.png)](img/gatewayd_architecture.png)

### External Connector ###

The external connector is a piece of custom code that ties Gatewayd to the outside system that is specific to you, the gateway operator. It might connect to your unique in-house banking system, or it might just be a script that monitors your PayPal account. As far as Gatewayd is concerned, it does not matter.

The external connector has three tasks: submitting external deposits to gatewayd, monitoring gatewayd for outgoing withdrawals, and clearing outgoing withdrawals when finished. You can build a connector that handles those functions in a few different ways. Feel free to choose whichever suits your needs best:

* You can build a process plugin in Javascript that runs as part of gatewayd. The [gatewayd Github organization](https://github.com/gatewayd/) maintains a list of existing plugins, including ones for existing payment networks.
* You can build your own service that consumes [Gatewayd's REST API](#gatewayd-api). In that case, you'll use the [Record Deposit](#record-deposit), [List Pending Withdrawals](#list-pending-withdrawals), and [Clear Pending Withdrawal](#clear-pending-withdrawal) API methods.
* You can access Gatewayd's database directly. This may be convenient if your existing software already manages SQL databases. You should have a good understanding of Gatewayd's [Data Models](#data-models) if you do this.

### Gatewayd Services ###

Gatewayd is implemented as a [Node.js](http://nodejs.org/) web application that keeps track of transactions that are entering and leaving the Ripple Network, and exposes a RESTful API for configuring and controlling its behavior. It persists transactions to a [Postgres database](http://www.postgresql.org/). This application has 6 main processes that comprise its operation:

| Process | Purpose |
|---------|---------|
| server  | Provides the RESTful API for controlling gatewayd and querying about its status; also serves a ripple.txt file to identify the gateway. |
| ripple-rest | The [Ripple-REST](ripple-rest.html) service that communicates with a `rippled` server. |
| incoming | Monitors the Ripple Network for incoming Ripple payments |
| withdrawals | Converts records of incoming Ripple payments into pending withdrawal records |
| outgoing | Sends pending Ripple payments out to the network to issue balances |
| deposits | Converts records of external deposits into pending Ripple payments |

You can get a list of services and their status by running the following command:

    pm2 list

[Plugins](https://github.com/gatewayd/) may provide additional services that also appear in this list.

### Data Models ###

[[Source]<br>](https://github.com/ripple/gatewayd/tree/master/lib/data/models "Source")

One of the key aspects of Gatewayd is that it keeps records of all the transactions that go in and out of the gateway, which get persisted to the database. Gatewayd is intentionally designed so that you can manually view and modify the database records if you want to. The important data models are defined as in the following diagram:

[![Data Models chart](img/gatewayd-datamodel_current.png)](img/gatewayd-datamodel_current.png)

In short, the key data models are: External Account, Ripple Address, User, External Transaction, and Ripple Transaction. It's important to note that incoming and outgoing transactions of the same type (Ripple or External) are persisted to a single, shared database table.

All tables have the following common fields:

| Field | Type | Description |
| ----- | -----| ----------- |
| `id` | Integer (auto-increment) | A unique identifier for each row |
| `uid`| String (unique) | A unique string identifier, which can be arbitrarily set. |
| `data` | String | Any arbitrary data. If the contents of this field can be parsed as JSON, then it is represented as JSON in Gatewayd; otherwise, it is treated as a string. |

#### User, Ripple Address, and External Account Models ####

A user is a fundamental unit of identity for your gateway's customers; these persist to the *User* table. Each user is linked to any number of External Accounts as well as any number of Ripple Addresses, which are persisted to their own tables. 

__*Note:*__ The User model is expected to change dramatically in future versions of of Gatewayd. The current model should be considered DEPRECATED.

In addition to the common fields, the User model has the following:

| Field | Type | Description |
| ----- | -----| ----------- |
| `active` | Boolean | Whether or not this user is marked as activated. (This status is not currently enforced in any way.) |
| `admin` | Boolean | Unused. |
| `external_id` | String | Arbitrary value used to identify this user in an external system |
| `federation_name` | String | Federation name for the user. |
| `federation_tag` | String | Federation tag for the user. |
| `kyc_id` | Integer | Reference to entry in KYC table with info about this customer |
| `password_hash` | String | Hashed version of this user's password (Optional) |
| `salt` | String | Cryptographic salt used when hashing this user's password. |

The [Register User](#register-user) API method creates new users, along with their corresponding external account and Ripple account records.

#### External Transaction Model ####

The External Transactions table holds both incoming deposits and outgoing withdrawals. In addition to the common fields, it has the following:

| Field | Type | Description |
| ----- | -----| ----------- |
| `deposit` | boolean | Defines which type of transaction this is (*true* means deposit, *false* means withdrawal). 
| `amount` | Decimal | The size of the external payment |
| `currency` | String | The currency of the external payment 
| `status` | String (Enum) | What state the transaction is in, such as pending or completed. 
| `ripple_transaction_id` | Integer | Reference to a corresponding Ripple transaction. |

The [Record Deposit API method](#record-deposit) creates new deposit records; the [withdrawals process](#gatewayd-services) automatically creates new withdrawal records when it finds unprocessed incoming Ripple payments.

#### Ripple Transaction Model ####

The Ripple Transactions table holds incoming and outgoing Ripple payments. The direction of the payment is determined by which of the `to_address_id` and `from_address_id` fields references a Gateway wallet (hot or cold). In addition to the common fields, it has the following:

| Field | Type | Description |
| ----- | -----| ----------- |
| `to_address_id` | Integer | Reference to the Ripple address receiving the payment |
| `from_address_id` | Ineger | Reference to the Ripple address sending the payment |
| `to_amount` | Decimal | Amount of money the recipient got |
| `to_currency` | String | What currency the recipient got |
| `to_issuer` | String | The Ripple Account that issued the currency received on the Ripple Network. (In the case of outgoing payments, this would be the cold wallet | 
| `from_amount` | Decimal | Amount of money the sender spent |
| `from_currency`| String | What currency the sender used |
| `from_issuer` | String | The Ripple Account that issued the currency sent on the Ripple Network. (This may be different than the currency received if there were other parties in the middle of the transaction.) | 
| `transaction_state` | String (Enum) | What state a transaction is in, such as pending or completed. 
| `transaction_hash` | String | The unique identifier of the transaction in the Ripple Network. |
| `external_transaction_id` | Integer | Reference to a corresponding external transaction. |

The [incoming process](#gatewayd-services) automatically creates records for new Ripple transactions by polling the Ripple-REST server; the [deposits process](#gatewayd-services) automatically creates new outgoing Ripple payments when it finds unprocessed external deposits.

#### Future Models ####

__*Note:*__ As development on Gatewayd continues, the data model is expected to change. In particular, we expect to create a "Gateway Transaction" object to link External and Ripple transactions, and a "Policy" object that links a Gateway Transaction to the business logic of executing it (for example, setting custom fees for different types of actions or different customers). 

## Authentication ##

Gatewayd has a powerful API, so it's important to keep it secure from unauthorized access: customers should not access Gatewayd directly. We expect that you will access Gatewayd's REST API through an application server that also provides a customer-facing interface. This could be an existing mobile app or website, or it could be entirely new. If you're building a new one, you could even build it as a process plugin that uses the same Node.js server as Gatewayd. You might also access the API from a simple HTTP client for testing and development purposes. You might not even use the API at all. 

Depending on your situation, there are some configuration variables you can set:

* The `HTTP_SERVER` option (on by default) defines whether or not Gatewayd runs a REST API. If you don't use the REST API at all, you can turn it off entirely to reduce your risk profile.
* The `HOST` option defines the interface where Gatewayd's REST API should listen for connections. This can be the hostname or IP address of the server if you are connecting externally, or "localhost" or "127.0.0.1" to listen only to connections on the same machine (either by a local proxy or directly for development).
* The `SSL` option (on by default) defines whether or not the REST API communicates over an encrypted transport, e.g. HTTPS instead of simple HTTP. We recommend *always* using SSL, unless you are only listening on localhost. 
 * Gatewayd comes with a self-signed certificate for SSL pre-configured. This is adequate for development use. 
 * For production use, you should set the `SSL_KEY_PATH` and `SSL_CERTIFICATE_PATH` settings to point at a certificate purchased from a trusted [CA](http://en.wikipedia.org/wiki/Certificate_authority).
* The `BASIC_AUTH` option (on by default) defines whether or not the REST API requires a password to connect. We recommend *always* using this. 
 * The `KEY` option (not defined by default) sets the API key used for Basic Auth. You can authenticate by sending the API key as either the username or password. ([Previous versions](https://github.com/ripple/gatewayd/commit/e8a0767aab80b0605f7334b8e1a6b1578e67cea9) required the username to be "admin@<em>yourdomain.com</em>", based Gatewayd's `DOMAIN` setting, and the API key is the password.
 * You can generate a new `KEY` value with the [Set API Key](#set-api-key) method. (Use the commandline version if it's your first time.)

__*Exception:*__ Gatewayd's HTTP server also serves a `ripple.txt` response that imitates a text file, but is actually dynamically generated based on its current configuration. This route is intended to be public, and is not protected even when `BASIC_AUTH` is enabled. However, it is disabled if the `HTTP_SERVER` option is disabled.

Gatewayd implements authentication using the [Passport Node.js Module](http://passportjs.org/), so if you are familiar with Passport, you can easily customize the authentication scheme for Gatewayd to fit your needs.
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/passport_auth.js "Source")

### Production ###

In a production environment, you will probably send requests to Gatewayd through a proxy server like [Nginx](http://nginx.com/), which could run on the same machine as Gatewayd. If the proxy is not on the same machine, you might need to configure Nginx and Gatewayd to share the same SSL cert. Alternatively, you could terminate SSL at Nginx or a load balancer and use HTTP over your internal network for the remaining hops, but we recommend [encrypting everything as a "defense-in-depth" strategy](http://arstechnica.com/information-technology/2013/11/googlers-say-f-you-to-nsa-company-encrypts-internal-network/).

### Deprecated User-Auth Routes ###

The User-Auth routes are deprecated and may be removed without further notice. These routes are available only if the `USER_AUTH` config option is enabled. In this case, the name and password associated with a user account are used for Basic-Auth on the User-Auth Routes instead of using the API key.

## Hot Wallet, Cold Wallet, Trust ##

When a gateway issues balances of non-XRP currencies on the Ripple Network, those balances become liabilities in the real world that must be covered when people redeem those balances as external withdrawals. Additionally, actual XRP balances are digital assets that can be stolen or lost. Gatewayd uses the concept of a "hot wallet" and a "cold wallet" to minimize the risk of losses for both categories. (In practice, there is no difference between the term "wallet" and "account" on Ripple.)

The cold wallet is like your vault. It issues all your funds, and holds the bulk of your XRP assets. The secret key that is used for this wallet is kept offline, accessible to a few trusted operators. Every now and then, the cold wallet is used to refill the stores in the hot wallet.

The hot wallet is like your cash register. It holds a small amount of funds at a time, and customers deal with it directly. The secret key for this wallet is, by necessity, stored on a server that is connected to the outside internet. (Specifically, it is stored in Gatewayd's config file.) The hot wallet can be replaced without affecting the balances already issued by the cold wallet and held by users.

All issuances of non-XRP currency and assets come from the cold wallet; it effectively 'creates' the currency on the Ripple Network to mirror the deposits received via external transactions. Consequently, Ripple accounts (customers as well as the hot wallet) must trust the cold wallet account in order to hold currency issued by that gateway. (Trusting a gateway means that you believe its issuances are worth something.) Customers do not need to trust the hot wallet, and should not. 

Although you could send the issuances directly to customers from the account issuing them, that exposes you to risk: if the account issuing the currency is compromised, potentially unlimited issuances could be made on your behalf. Using a hot/cold wallet distinction decreases the chances that your issuing account will be compromised, because you can keep it safely offline while day-to-day business is happening. The hot wallet, which is exposed to the most risk, can only lose as much money as it holds.




# Gatewayd Usage #

## Installation

- Comprehensive [installation script](https://github.com/ripple/gatewayd/blob/master/doc/install.md) for Ubuntu

## Updating ##

The update process for gatewayd may change in the future, but for now, updating to a new version follows this process:

1. Use git to pull the `master` branch [from Github](https://github.com/ripple/gatewayd.git). (This assumes you created it by using `git clone` on the repository first.)<br/>
    `git pull`
2. Install any new npm modules needed by the new version<br/>
    `sudo npm install --global`
3. Disable the current gateway processes. (This starts downtime)<br/>
    `pm2 kill`
4. Apply schema changes to the database, if the new version includes any.<br/>
    `grunt migrate`
5. Restart the gatewayd processes. (This ends downtime)<br/>
    `bin/gateway start`


## Configuration ##

Before you can run gatewayd, you need to set up the appropriate accounts that will be used to store and send funds in the Ripple network. You also need to define which currencies your gateway issues. Beyond that, there are some options you can set if they fit your needs.

The defaults for all of gatewayd's settings are found in the file `config/config.js`. You can override any of those settings with your own values by editing them in the file `config/config.json`, or by using the API methods for setting the configuration. (The API methods result in editing the `config/config.json` file anyway.) Don't edit the `config/config.js` file, since that only contains the defaults, and gets overridden in a software update.

### Setting Up Wallets for gatewayd ###

The actual process of configuring gatewayd with the appropriate accounts is easy. First, generate an account key pair for a cold wallet. You can use the official Ripple client to do so:

[Ripple Client](https://ripple.com/client/#/register) 

__*Note:*__ The key generation process in the Ripple Client happens on your local machine, and is never sent to Ripple or anyone else. You can even go offline while you generate the key (as long as you've fully loaded the page first).

Save the secret key somewhere that it will be completely safe. Never send it unencrypted to an untrusted entity such as your web host. 

Now, set the address of the cold wallet in gatewayd using the commandline:

    bin/gateway set_cold_wallet rsnCCioK33L19UwywUPoHK3ucTcQR2fpfm

Next, generate a new key pair for the hot wallet account.
    
    bin/gateway generate_wallet

Set the address _and_ the secret key for the hot wallet in gatewayd using the commandline:

    bin/gateway set_hot_wallet rhfyVnzjPvvtdnZNSiNufRCZhHpc9yh1rA ssmgxde6ozSViVkuWvsC6HJxpLvH4
    
(__*Tip:*__ Ripple addresses always start with `r`; Ripple secrets always start with `s`.)

Define which currencies your gateway will support. (This does not include XRP, which is necessary for every Ripple account and gateway.) You can do this with the commandline as well. Run the `add_currency` command with the 3-letter ISO 4217 currency codes for whichever currencies you want to support:

    bin/gateway add_currency USD
    bin/gateway add_currency XAU

Fund both accounts. This requires some outside source of XRP to send a payment to the address of each one. For now, we recommend at least 50 XRP. (Because it requires outside intervention, you cannot do this step with gatewayd.)

At this point, you need to create trustlines between the hot and cold wallet accounts. You can also do this with the gatewayd commandline. Run the `set_trust` command, with reasonable maximum quantities that you want your hot wallet to hold at a time, for each currency you support.

    bin/gateway set_trust USD 1000
    bin/gateway set_trust XAU 2
    
__*Aside:*__ Keep in mind the very different values for currencies. In this example, the two troy ounces of gold (XAU 2) are, at the time of writing, worth approximately $2600 USD.) Fortunately, gatewayd supports very large and small numbers.

The last step before you can start your gateway is to set the last payment hash. This indicates a cutoff point in time, where the gateway should monitor Ripple for payments that are newer and try to process them, but ignore payments that are older. To get a good starting value, look up the transaction history for the cold wallet and choose the most recent transaction. 

## Running gatewayd ##

After installation, start the gateway processes by running the command:

    bin/gateway start


## Command Line Interface ##

In addition to the REST interface, many pieces of Gatewayd can be controlled directly through the commandline. This is done by running the `gateway` script (`bin/gateway` from the project's top level directory) with the relevant commands.

You can get usage information for the commandline as follows:

    bin/gateway -h


# Gatewayd API Reference #

`gatewayd : v3.25.0`

The API serves several purposes: it provides an easy way to customize settings without having to edit the config files directly; it provides access to status and historical information about all transactions made in the gateway; and it provides one avenue for building an [external connector](#external-connector). 

#### External Transactions ####

* [Record Deposit - `POST /v1/deposits/`](#record-deposit)
* [List Queued Deposits - `GET /v1/deposits`](#list-queued-deposits)
* [List Pending Withdrawals - `GET /v1/withdrawals`](#list-pending-withdrawals)
* [Clear Pending Withdrawal - `POST /v1/withdrawals/{:id}/clear`](#clear-pending-withdrawal)
* [List Cleared External Transactions - `GET /v1/cleared`](#list-cleared-external-transactions)

#### User Management ####

* [Register User - `POST /v1/registrations`](#register-user)
* [Activate User - `POST /v1/users/{:id}/activate`](#activate-user)
* [Deactivate User - `POST /v1/users/{:id}`](#deactivate-user)

#### Ripple Transactions ####

* [List Outgoing Payments - `GET /v1/payments/outgoing`](#list-outgoing-payments)
* [List Failed Payments - `GET /v1/payments/failed`](#list-failed-payments)
* [Retry Failed Payments - `POST /v1/payments/failed/{:id}/retry`](#retry-failed-payment)
* [List Incoming Payments - `GET /v1/payments/incoming`](#list-incoming-payments)

#### Ripple Management ####

* [Generate Ripple Wallet - `POST /v1/config/wallets/generate`](#generate-ripple-wallet)
* [List Hot Wallet Balances - `GET /v1/balances`](#list-hot-wallet-balances)
* [List Cold Wallet Liabilities - `GET /v1/liabilities`](#list-cold-wallet-liabilities)
* [Fund Hot Wallet - `POST /v1/wallets/hot/fund`](#fund-hot-wallet)
* [Return Funds from Hot Wallet to Cold Wallet - `POST /v1/wallets/cold/refund`](#return-funds-from-hot-wallet-to-cold-wallet)
* [Set Trust from Hot Wallet to Cold Wallet - `POST /v1/trust`](#set-trust-from-hot-wallet-to-cold-wallet)
* [Show Trust from Hot Wallet to Cold Wallet - `GET /v1/trust`](#show-trust-from-hot-wallet-to-cold-wallet)

#### Gatewayd Configuration ####

* [Set Database URL - `POST /v1/config/database`](#set-database-url)
* [Retrieve Database URL - `GET /v1/config/database`](#retrieve-database-url)
* [Set Ripple-REST URL - `POST /v1/config/ripple/rest`](#set-ripple-rest-url)
* [Retrieve Ripple-REST URL - `GET /v1/config/ripple/rest`](#retrieve-ripple-rest-url)
* [Set Cold Wallet - `POST /v1/config/wallets/cold`](#set-cold-wallet)
* [Retrieve Cold Wallet - `GET /v1/config/wallets/cold`](#retrieve-cold-wallet)
* [Set Hot Wallet - `POST /v1/config/wallets/hot`](#set-hot-wallet)
* [Retrieve Hot Wallet - `GET /v1/config/wallets/hot`](#retrieve-hot-wallet)
* [Set Last Payment Hash - `POST /v1/config/last_payment_hash`](#set-last-payment-hash)
* [Retrieve Last Payment Hash - `GET /v1/config/last_payment_hash`](#retrieve-last-payment-hash)
* [Set Gateway Domain - `POST /v1/config/domain`](#set-gateway-domain)
* [Retrieve Domain - `GET /v1/config/domain`](#retrieve-domain)
* [Set API Key - `POST /v1/config/key`](#set-api-key)
* [Retrieve API Key - `GET /v1/config/key`](#retrieve-api-key)
* [Add Supported Currency - `POST /v1/currencies`](#add-supported-currency)
* [List Supported Currencies - `GET /v1/currencies`](#list-supported-currencies)
* [Remove Supported Currency - `DELETE /v1/currencies/{:currency}`](#remove-supported-currency)

#### Gatewayd Processes ####

* [Start Worker Processes - `POST /v1/start`](#start-worker-processes)
* [List Current Processes - `POST /v1/processes`](#list-current-processes)

#### User-Auth API Routes #####

All these routes are **DEPRECATED**. Authentication for these routes works differently. See [Deprecated User-Auth Routes](#deprecated-user-auth-routes) for details.

* [`POST /v1/users/login`](#log-in-user)
* [`GET /v1/users/{:id}`](#retrieve-user)
* [`GET /v1/users/{:id}/external_accounts`](#list-user-external-accounts)
* [`GET /v1/users/{:id}/external_transactions`](#list-user-external-transactions)
* [`GET /v1/users/{:id}/ripple_addresses`](#list-user-ripple-addresses)
* [`GET /v1/users/{:id}/ripple_transactions`](#list-user-ripple-transactions)

## External Transactions ##

### Record Deposit ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/record_deposit.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/deposits
{
  "external_account_id": 307,
  "currency": "BTC"
  "amount": "10.7"
  "data": "(This field is optional.)"
}
```

*Commandline*

```
# Syntax: record_deposit <amount> <currency> <external_account_id>
$ bin/gateway record_deposit 95.29 USD 13
```

*Javascript*

```
//options: object with the following fields:
//      - external_account_id: unique ID of the depositor's external account record
//      - amount: numeric deposit amount
//      - currency: currency string (e.g. "USD")
//      - data: Arbitrary data in JSON/string format
//callback: function(err, deposit) to run on callback
gateway.api.recordDeposit(options, callback);
```
</div>

This method is the entry point to creating Ripple balances. When you receive 
an asset outside the Ripple Network from a user, you can call this method to 
create a "deposit" record in gatewayd's database tracking it. By default, the 
deposit record is marked as "queued", which means that gatewayd's deposit 
process will automatically apply fees and then enqueue an outgoing Ripple 
payment to the user's Ripple address.

The most important field is the `external_account_id`, which references the 
external account record for the user making this deposit. This value is returned
by the [Register User](#register-user) method when a user is created.

Response Body:

```
{
  "deposit": {
    "data": null,
    "external_account_id": 307,
    "currency": "BTC",
    "amount": "10.7",
    "deposit": true,
    "status": "queued",
    "updatedAt": "2014-06-12T00:46:02.080Z",
    "createdAt": "2014-06-12T00:46:02.080Z",
    "id": 1,
    "ripple_transaction_id": null,
    "uid": null
  }
}
```

### List Queued Deposits ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_queued_deposits.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/deposits
```

*Commandline*

```
# Syntax: list_queued_deposits
$ bin/gateway list_queued_deposits
```

*Javascript*

```
//callback: function(err, deposits) to run on callback
gateway.api.listQueuedDeposits(callback);
```
</div>

This method retrieves a list of all deposits that are currently queued. These 
deposits represent incoming assets that have not yet been processed and sent 
out as balances on the Ripple network.

Response Body:

```
{
  "deposits": [
    {
      "data": null,
      "id": 1,
      "amount": "10.7",
      "currency": "BTC",
      "deposit": true,
      "external_account_id": 307,
      "status": "queued",
      "ripple_transaction_id": null,
      "createdAt": "2014-06-12T00:46:02.080Z",
      "updatedAt": "2014-06-12T00:46:02.080Z",
      "uid": null
    },
    {
      "data": null,
      "id": 2,
      "amount": "281.2",
      "currency": "XAG",
      "deposit": true,
      "external_account_id": 307,
      "status": "queued",
      "ripple_transaction_id": null,
      "createdAt": "2014-06-12T00:47:24.754Z",
      "updatedAt": "2014-06-12T00:47:24.754Z",
      "uid": null
    }
  ]
}
```

### List Pending Withdrawals ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_queued_withdrawals.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/withdrawals
```

*Commandline*

```
# Syntax: list_queued_withdrawals
$ bin/gateway list_queued_withdrawals
```

*Javascript*

```
//callback: function(err, withdrawals) to run on callback
gateway.api.listQueuedWithdrawals(callback);
```
</div>

To retrieve assets from the gateway, a user sends funds back to the gateway's 
Ripple account. After the incoming payment has been received and processed 
(fees subtracted), it is placed in the pending withdrawals queue, which is a 
list of external transaction withdrawal records with a state of "pending". If 
the gateway administrator has registered a withdrawal callback url, the 
withdrawal callbacks process will read withdrawals from this list and
POST their data to the callback url provided.

This method retrieves the list of pending withdrawals.

Response Body:

```
    {
      "withdrawals": [
        {
          "data": null,
          "id": 79,
          "amount": "1001",
          "currency": "SWD",
          "deposit": false,
          "external_account_id": 6,
          "status": "queued",
          "ripple_transaction_id": 80,
          "createdAt": "2014-05-30T19:23:48.390Z",
          "updatedAt": "2014-05-30T19:23:48.390Z",
          "uid": null
        },
        {
          "data": null,
          "id": 84,
          "amount": "8.5",
          "currency": "SWD",
          "deposit": false,
          "external_account_id": 6,
          "status": "queued",
          "ripple_transaction_id": 85,
          "createdAt": "2014-06-11T00:23:56.992Z",
          "updatedAt": "2014-06-11T00:23:56.992Z",
          "uid": null
        }
      ]
    }
```

### Clear Pending Withdrawal ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/clear_withdrawal.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/withdrawals/{:id}/clear
{}
```

*Commandline*

```
# Syntax: clear_withdrawal <external_transaction_id>
$ bin/gateway clear_withdrawal 9
```

*Javascript*

```
//id: Unique integer ID of withdrawal to clear
//callback: function(err, withdrawal) to run on callback
gateway.api.clearWithdrawal(id, callback);
```
</div>

A pending withdrawal record indicates to the gateway operator that a
user wishes to withdraw a given asset. Once the operator processes the 
withdrawal by sending the asset to the user, mark the withdrawal as "cleared" 
by calling this method.

Response Body:

```
    {
      "withdrawal": {
        "data": null,
        "id": 84,
        "amount": "8.5",
        "currency": "SWD",
        "deposit": false,
        "external_account_id": 6,
        "status": "cleared",
        "ripple_transaction_id": 85,
        "createdAt": "2014-06-11T00:23:56.992Z",
        "updatedAt": "2014-06-12T20:01:29.663Z",
        "uid": null
      }
    }
```

### List Cleared External Transactions ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_cleared.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/cleared
```

*Commandline*

```
# Syntax: list_cleared
$ bin/gateway list_cleared
```

*Javascript*

```
//callback: function(err, transactions) to run on callback
gateway.api.listCleared(callback);
```
</div>

This method retrieves the list of all external transactions that are no longer 
considered pending. This includes all deposits that have been issued as a 
balance with a Ripple payment, and all withdrawals that have been cleared.

__*Note:*__ There is an apparent bug with this method, where both deposits and withdrawals are returned in the "deposits" field. (See [Issue #240](https://github.com/ripple/gatewayd/issues/240) for details and status.)

Response Body:

```
{
  "deposits": [
    {
      "data": null,
      "id": 3,
      "amount": "4.95",
      "currency": "SWD",
      "deposit": false,
      "external_account_id": 1,
      "status": "cleared",
      "ripple_transaction_id": 3,
      "createdAt": "2014-05-13T23:10:20.803Z",
      "updatedAt": "2014-05-13T23:11:26.323Z",
      "uid": null
    },
    {
      "data": null,
      "id": 5,
      "amount": "2.9699999999999998",
      "currency": "SWD",
      "deposit": false,
      "external_account_id": 1,
      "status": "cleared",
      "ripple_transaction_id": 5,
      "createdAt": "2014-05-14T19:45:05.244Z",
      "updatedAt": "2014-05-14T21:19:54.231Z",
      "uid": null
    }
  ]
}
```

## User Management ##

### Register User ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/register_user.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/registrations
{
  "name": "steven@ripple.com",
  "password": "s0m3supe&$3cretp@s$w0r*",
  "ripple_address": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk"
}
```

*Commandline*

```
#Syntax: register_user <username> <password> <ripple_address> 
$ bin/gateway register_user steven@ripple.com s0m3supe&$3cretp@s$w0r* r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk 
```

*Javascript*
```
//options: object with "name", "password", and "address" fields
//callback: function(err, user) to run on callback
gateway.api.registerUser(options, callback);
```
</div>

Register a user with the gatewayd. A username, password, and ripple address 
are required. Upon registration several records are created in the gatewayd 
database, including a user record, a "independent" ripple address record with 
the address provided, a "hosted" ripple address record for making withdrawals, 
and a "default" external account for recording deposits and withdrawals.

Use the `user.external_account.id` field of the response to link a future 
deposit to this user.

Response Body:
```
    {
      "user": {
        "name": "steven@ripple.com",
        "salt": "63a5f6fc48addb712ec8940ff591d742f57f0c4f7058d2040714bd260c4d93e0",
        "password_hash": "86e3b615a72b6f6c56f36dc6657d3133c747a59e8da8e6304c20f3229098f21e",
        "active": false,
        "updatedAt": "2014-06-12T00:43:17.572Z",
        "createdAt": "2014-06-12T00:43:17.572Z",
        "id": 508,
        "federation_tag": null,
        "admin": null,
        "federation_name": null,
        "bank_account_id": null,
        "kyc_id": null,
        "external_id": null,
        "data": null,
        "uid": null,
        "ripple_address": {
          "data": null,
          "user_id": 508,
          "address": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
          "managed": false,
          "type": "independent",
          "updatedAt": "2014-06-12T00:43:17.613Z",
          "createdAt": "2014-06-12T00:43:17.613Z",
          "id": 647,
          "tag": null,
          "secret": null,
          "previous_transaction_hash": null,
          "uid": null
        },
        "external_account": {
          "data": null,
          "name": "default",
          "user_id": 508,
          "updatedAt": "2014-06-12T00:43:17.620Z",
          "createdAt": "2014-06-12T00:43:17.620Z",
          "id": 307,
          "uid": null
        },
        "hosted_address": {
          "data": null,
          "user_id": 508,
          "address": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
          "managed": true,
          "type": "hosted",
          "tag": 307,
          "updatedAt": "2014-06-12T00:43:17.627Z",
          "createdAt": "2014-06-12T00:43:17.627Z",
          "id": 648,
          "secret": null,
          "previous_transaction_hash": null,
          "uid": null
        }
      }
    }
```

### Activate User ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/activate_user.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/users/{:id}/activate
{}
```

*Commandline*

```
# Syntax: activate_user <id>
$ bin/gateway activate_user 508
```

*Javascript*

```
//id: integer account ID
//callback: function(err, user) to run on callback
gateway.api.activateUser(id, callback)
```

</div>

By default a user is marked as "inactive", although no action is taken to 
enforce this status. To mark a user as active, run this command with the user's
ID.

Response Body:

```
{
  "user": {
    "id": 508,
    "name": "steven@ripple.com",
    "salt": "63a5f6fc48addb712ec8940ff591d742f57f0c4f7058d2040714bd260c4d93e0",
    "federation_tag": null,
    "admin": null,
    "federation_name": null,
    "password_hash": "86e3b615a72b6f6c56f36dc6657d3133c747a59e8da8e6304c20f3229098f21e",
    "bank_account_id": null,
    "kyc_id": null,
    "createdAt": "2014-06-12T07:43:17.572Z",
    "updatedAt": "2014-06-12T00:44:05.786Z",
    "external_id": null,
    "data": null,
    "uid": null,
    "active": true
  }
}
```

### Deactivate User ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/deactivate_user.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/users/{:id}/deactivate
{}
```

*Commandline*

```
# Syntax: deactivate user <id>
$ bin/gateway deactivate_user 508
```

*Javascript*

```
//id: integer account ID
//callback: function(err, user) to run on callback
gateway.api.deactivateUser(id, callback);
```
</div>


To mark a user an "inactive", run this command with the user's ID. This flag is
purely for informational purposes and is not enforced in any way.

Response Body:

```
{
  "user": {
    "id": 508,
    "name": "steven@ripple.com",
    "salt": "63a5f6fc48addb712ec8940ff591d742f57f0c4f7058d2040714bd260c4d93e0",
    "federation_tag": null,
    "admin": null,
    "federation_name": null,
    "password_hash": "86e3b615a72b6f6c56f36dc6657d3133c747a59e8da8e6304c20f3229098f21e",
    "bank_account_id": null,
    "kyc_id": null,
    "createdAt": "2014-06-12T14:43:17.572Z",
    "updatedAt": "2014-06-12T00:44:52.919Z",
    "external_id": null,
    "data": null,
    "uid": null,
    "active": false
  }
}
```

## Ripple Transactions ##

### List Outgoing Payments ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_outgoing_payments.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/payments/outgoing
```

*Commandline*

```
# Syntax: 
$ bin/gateway list_outgoing_payments
```

*Javascript*

```
//callback: function(err, payments) to run on callback
gateway.api.listOutgoingPayments(callback);
```
</div>

Ripple transaction records that are marked as "outgoing" are picked up
and sent to the Ripple network. This method returns a list of the
queued "outgoing" payments. All deposit records are eventually placed in the
outgoing payments queue after fees are subtracted.

Response Body:

```
{
  "payments": [
    {
      "data": null,
      "id": 1,
      "to_address_id": 647,
      "from_address_id": 623,
      "transaction_state": null,
      "transaction_hash": null,
      "to_amount": "10.593",
      "to_currency": "BTC",
      "to_issuer": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "from_amount": "10.593",
      "from_currency": "BTC",
      "from_issuer": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "createdAt": "2014-06-12T00:48:02.302Z",
      "updatedAt": "2014-06-12T00:48:02.302Z",
      "uid": null,
      "client_resource_id": "false",
      "state": "outgoing",
      "external_transaction_id": 1
    },
    {
      "data": null,
      "id": 2,
      "to_address_id": 647,
      "from_address_id": 623,
      "transaction_state": null,
      "transaction_hash": null,
      "to_amount": "278.388",
      "to_currency": "XAG",
      "to_issuer": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "from_amount": "278.388",
      "from_currency": "XAG",
      "from_issuer": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "createdAt": "2014-06-12T00:48:02.324Z",
      "updatedAt": "2014-06-12T00:48:02.324Z",
      "uid": null,
      "client_resource_id": "false",
      "state": "outgoing",
      "external_transaction_id": 2
    }
  ]
}
```

### List Failed Payments ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_failed_payments.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/payments/failed
```

*Commandline*

```
# Syntax: list_failed_payments
$ bin/gateway list_failed_payments
```

*Javascript*

```
//callback: function(err, payments) to run on callback
gateway.api.listFailedPayments(callback);
```
</div>

Outgoing payments are often rejected from Ripple, such as when there is
insufficient trust from the recipient account to the gateway account, or
when the gateway's hot wallet account has insufficient funds to process the
payment. In the case that a payment will never make it into the Ripple
ledger the outgoing payment is marked as "failed". This method lists the
history of such payments.

__*Note:*__ Currently, a payment is removed from this list if you [retry](#retry-failed-payment) it. In the future, this behavior may change so that old failures remain until manually deleted, and retrying creates a separate transaction, in order to preserve historical data on transaction failure for analysis. (See [Issue #239](https://github.com/ripple/gatewayd/issues/239) for status.)

If you want to remove a failed payment without retrying it, you can delete the corresponding record from the database.

Response Body:

```
{
  "payments": [
    {
      "data": null,
      "id": 2,
      "to_address_id": 647,
      "from_address_id": 623,
      "transaction_state": null,
      "transaction_hash": null,
      "to_amount": "278.388",
      "to_currency": "XAG",
      "to_issuer": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "from_amount": "278.388",
      "from_currency": "XAG",
      "from_issuer": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "createdAt": "2014-07-28T02:48:02.324Z",
      "updatedAt": "2014-06-13T00:38:03.086Z",
      "uid": null,
      "client_resource_id": "false",
      "state": "failed",
      "external_transaction_id": 2
    },
    {
      "data": null,
      "id": 3,
      "to_address_id": 25,
      "from_address_id": 623,
      "transaction_state": null,
      "transaction_hash": null,
      "to_amount": "9899999999.01",
      "to_currency": "XAG",
      "to_issuer": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "from_amount": "9899999999.01",
      "from_currency": "XAG",
      "from_issuer": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "createdAt": "2014-06-16T12:37:39.985Z",
      "updatedAt": "2014-06-13T00:38:04.184Z",
      "uid": null,
      "client_resource_id": "false",
      "state": "failed",
      "external_transaction_id": 3
    }
  ]
}
```

### Retry Failed Payment ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/retry_failed_payment.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/payments/failed/{:id}/retry
{}
```

*Commandline*

```
# Syntax: retry_failed_payment <ripple_transaction_id>
$ bin/gateway retry_failed_payment 6
```

*Javascript*

```
//ripple_transaction_id: Integer ID of transaction to retry
//callback: function(err, payment) to run on callback
gateway.api.retryFailedPayment(ripple_transaction_id, callback);
```
</div>

A payment that failed due to insufficient funds or lack of trust lines
may be successfully retried once funds are increased or an appropriate
line of trust is established. After taking the appropriate action in Ripple, 
use this method to retrying a payment. This method simply changes the 
payment's state from "failed" to "outgoing", effectively enqueueing the 
transaction to be re-submitted to Ripple.

__*Note:*__ In the future, this behavior may change to preserve the old, failed transaction for historical purposes and create a new, separate transaction to be submitted to Ripple. See [Issue #239](https://github.com/ripple/gatewayd/issues/239) for details.

Response Body:

```
    {
      "payment": {
        "data": null,
        "id": 6,
        "to_address_id": 1,
        "from_address_id": 2,
        "transaction_state": null,
        "transaction_hash": null,
        "to_amount": "100",
        "to_currency": "XAG",
        "to_issuer": "1",
        "from_amount": "100",
        "from_currency": "XAG",
        "from_issuer": "1",
        "createdAt": "2014-06-13T07:46:07.190Z",
        "updatedAt": "2014-06-13T02:33:26.772Z",
        "uid": null,
        "client_resource_id": "false",
        "state": "outgoing",
        "external_transaction_id": null
      }
    }
```

### List Incoming Payments ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_incoming_payments.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/payments/incoming
```

*Commandline*

```
# Syntax: list_incoming_payments
$ bin/gateway list_incoming_payments
```

*Javascript*

```
//callback: function(err, payments) to run on callback
gateway.api.listIncomingPayments(callback);
```
</div>

Gatewayd monitors the gateway's Ripple account for inbound payments made to the
gateway, and records the payments in the Ripple Transactions database table. Newly recorded incoming Ripple transactions are always marked as "incoming" until the gatewayd "withdrawals" process picks them up and, after applying fees, enqueues a withdrawal record in the external transactions table.

This method shows an array of incoming payments that have not yet been 
processed into withdrawals.

Response Body:

```
    {
      "incoming_payments": [
        {
          "data": null,
          "id": 90,
          "to_address_id": 0,
          "from_address_id": 13,
          "transaction_state": "tesSUCCESS",
          "transaction_hash": "12AE1B1843D886D7D6783DA02AB5F43C32579212853CF3CEFD6DBDF29F03BC80",
          "to_amount": "5.12",
          "to_currency": "SWD",
          "to_issuer": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6",
          "from_amount": "5.12",
          "from_currency": "SWD",
          "from_issuer": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6",
          "createdAt": "2014-06-12T19:59:52.642Z",
          "updatedAt": "2014-06-12T19:59:52.642Z",
          "uid": null,
          "client_resource_id": "false",
          "state": "incoming",
          "external_transaction_id": null
        }
      ]
    }
```

## Ripple Management ##

### Generate Ripple Wallet ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/generate_wallet.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/config/wallets/generate
{}
```

*Commandline*

```
# Syntax: generate_wallet
$ bin/gateway generate_wallet
```

*Javascript*

```
//options: object with 
//callback: function(err, ) to run on callback
gateway.api.generateWallet(callback);
```
</div>

Generate a random Ripple address and secret key. Together, these represent an 
unfunded Ripple account. After it receives enough XRP to meet the account 
reserve, the account is included in the Ripple Ledger.

Response Body:

```
{
    "wallet": {
        "address": "rscJF4TWS2jBe43MvUomTtCcyrbtTRMSNr",
        "secret": "ssuBBapjuJ2hE5wto254aNWERa8VV"
    }
}
```

### List Hot Wallet Balances ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_balance.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/balances
```

*Javascript*

```
//callback: function(err, balances) to run on callback
balance.getAccountBalance(null, callback);
```
</div>

__*Note:*__ There is no commandline version for this method yet.

This method lists the funds that are held by the hot wallet, ready to be 
distributed to clients. 

Response Body:

```
{
  "success": true,
  "balances": [
    {
      "value": "29.999358",
      "currency": "XRP",
      "counterparty": ""
    },
    {
      "value": "8776.3012",
      "currency": "SWD",
      "counterparty": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6"
    },
    {
      "value": "0",
      "currency": "USD",
      "counterparty": "rNoc7mZg54TkSd1mENAtEi65c9afYMBuTu"
    }
  ]
}
```

### List Cold Wallet Liabilities ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_liabilities.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/liabilities
```

*Javascript*

```
//callback: function(err, balance) to run on callback
balance.getLiabilities(callback);
```
</div>

__*Note:*__ There is no commandline version for this method yet.

Every asset that the gateway holds and for which it issues currency is
a liability of the gateway. This method lists total liabilities for each type 
of currency and the other Ripple account holding that currency on the network.

Response Body:

```
{
  "success": true,
  "balances": [
    {
      "value": "29.999985",
      "currency": "XRP",
      "counterparty": ""
    },
    {
      "value": "-8776.3012",
      "currency": "SWD",
      "counterparty": "rEmFrbcZvNR9i2fkBkLxDzB4X85aB4qwyZ"
    },
    {
      "value": "-63.1843",
      "currency": "SWD",
      "counterparty": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk"
    },
    {
      "value": "0",
      "currency": "SWD",
      "counterparty": "rNoc7mZg54TkSd1mENAtEi65c9afYMBuTu"
    },
    {
      "value": "0",
      "currency": "SWD",
      "counterparty": "rwNJY1jnzXHCyfKRyCyVyt8UcSZfAo7z68"
    },
    {
      "value": "0",
      "currency": "SWD",
      "counterparty": "raj7HbHuG4da8bm5eNA8dAD19t8Kj8G4NR"
    }
  ]
}
```

### Fund Hot Wallet ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/fund_hot_wallet.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/wallets/hot/fund
{
    "amount": 500.35,
    "currency": "USD",
    "secret": "snYYdj7vo4ouWZboLfNhTd4YaUJ4r"
}
```

*Commandline*

```
# Syntax: fund_hot_wallet <amount> <currency> <cold_wallet_secret>
$ bin/gateway 500.35 USD snYYdj7vo4ouWZboLfNhTd4YaUJ4r
```

*Javascript*

```
//options: object with the following fields:
//      - amount: numeric amount to send
//      - currency: string currency
//      - secret: string cold wallet secret
//callback: function(err, hot_wallet) to run on callback
gateway.api.fundHotWallet(options, callback);
```
</div>

Issue funds from the cold wallet to the hot wallet, specifying the amount, 
currency, and the *cold wallet* secret key. 



### Return Funds from Hot Wallet to Cold Wallet ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/refund_cold_wallet.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/wallets/cold/refund
{
    "currency": "USD",
    "amount": 324.765
}
```

*Commandline*

```
# Syntax: 
$ bin/gateway 
```

*Javascript*

```
//currency: String definition of currency to return, e.g. "USD"
//amount: Numeric amount to send back to the cold wallet
//callback: function(err, transaction) to run on callback
gateway.api.refundColdWallet(currency, amount, callback);
```
</div>

This method returns funds from the hot wallet back to the cold wallet. This is 
an important step in phasing out a hot wallet, especially if its security may 
be compromised.



### Set Trust from Hot Wallet to Cold Wallet ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/set_trust_line.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/trust
{
    "currency": "USD",
    "amount": 1000
}
```

*Commandline*

```
# Syntax: set_trust <currency> <amount>
$ bin/gateway USD 1000
```

*Javascript*

```
//currency: string currency definition, e.g. "USD"
//amount: numeric amount of trust to extent, e.g. 1000
//callback: function(err, lines) to run on callback
gateway.api.setTrustLine(currency, amount, callback);
```
</div>

This method sets a line of trust from the gateway hot wallet to the gateway 
cold wallet. The line of trust represents the total amount of one type of 
currency that gatewayd's hot wallet can hold and automatically send out without 
the gateway operator manually adding more funds to the hot wallet.


Response Body:

```
{
    "lines": [
        {
          "account": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD",
          "balance": "324.765",
          "currency": "USD",
          "limit": "1000",
          "limit_peer": "0",
          "quality_in": 0,
          "quality_out": 0
        },
        {
          "account": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD",
          "balance": "0.0139",
          "currency": "XAU",
          "limit": "2",
          "limit_peer": "0",
          "quality_in": 0,
          "quality_out": 0
        }
      ]
}
```

### Show Trust from Hot Wallet to Cold Wallet ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_trust_lines.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/trust
```

*Commandline*

```
# Syntax: get_trust_lines
$ bin/gateway get_trust_lines
```

*Javascript*

```
//callback: function(err, lines) to run on callback
gateway.api.getTrustLines(callback);
```
</div>

List lines of trust from the gateway hot wallet to the gateway cold
wallet. The line of trust represents the total amount of each asset
that gatewayd can hold and automatically send out without a manual
refunding by a gateway operator.


Response Body:

```
{
    "lines": [
        {
          "account": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD",
          "balance": "324.765",
          "currency": "USD",
          "limit": "1000",
          "limit_peer": "0",
          "quality_in": 0,
          "quality_out": 0
        },
        {
          "account": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD",
          "balance": "0.0139",
          "currency": "XAU",
          "limit": "2",
          "limit_peer": "0",
          "quality_in": 0,
          "quality_out": 0
        }
      ]
}
```

## Gatewayd Configuration ##

### Set Database URL ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/set_database_url.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/config/database
{
      "database_url": "postgres://postgres:password@localhost:5432/ripple_gateway"
}
```

*Commandline*

```
# Syntax: set_postgres_url <url>
$ bin/gateway set_postgres_url postgres://postgres:password@localhost:5432/ripple_gateway
```

*Javascript*

```
//database_url: string database URL to set
gateway.config.set('DATABASE_URL', database_url);
//callback: function() to call on completion
gateway.config.save(callback);
```
</div>

This method tells gatewayd which Postgres database to use. 

__*Caution:*__ This method contains sensitive database credentials. Do not use it on unsafe channels!

Response Body:

```
{
    "DATABASE_URL": "postgres://postgres:password@localhost:5432/ripple_gateway"
}
```

### Retrieve Database URL ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_database_url.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/config/database
```

*Commandline*

```
# Syntax: get_postgres_url
$ bin/gateway get_postgres_url
```

*Javascript*

```
gateway.config.get('DATABASE_URL')
```
</div>

This method shows the URL that gatewayd uses to access the Postgres database.

Response Body:

```
{
    "DATABASE_URL": "postgres://postgres:password@localhost:5432/ripple_gateway"
}
```

__*Caution:*__ This method contains sensitive database credentials. Do not use it on unsafe channels!

### Set Ripple-REST URL ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/set_ripple_rest_url.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/config/ripple/rest
{
    "url": "http://localhost:5990/"
}
```

*Commandline*

```
# Syntax: set_ripple_rest_url <url>
$ bin/gateway http://localhost:5990/
```

*Javascript*

```
//ripple_rest_url: string URL of Ripple-REST instance to use
//callback: function(err, url) to call on completion
gateway.api.setRippleRestUrl(ripple_rest_url, callback);
```
</div>

This method tells gatewayd what Ripple-REST server to use in order to access 
the Ripple Network.

Response Body:

```
{
    "RIPPLE_REST_API": "https://localhost:5990"
}
```

### Retrieve Ripple-REST URL ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_ripple_rest_url.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/config/ripple/rest
```

*Commandline*

```
# Syntax: get_ripple_rest_url
$ bin/gateway get_ripple_rest_url
```

*Javascript*

```
gateway.config.get('RIPPLE_REST_API');
```
</div>

This method shows the URL that gatewayd is configured to use for accessing Ripple-REST.

Response Body:

```
{
  "RIPPLE_REST_API": "http://localhost:5990/"
}
```

### Set Cold Wallet ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/set_cold_wallet.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/config/wallets/cold
{
    "address": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
}
```

*Commandline*

```
# Syntax: set_cold_wallet <address>
$ bin/gateway set_cold_wallet rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD
```

*Javascript*

```
gateway.config.set('COLD_WALLET', "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD");
```
</div>

Set the gateway cold wallet, from which funds are issued. 

__*Note:*__ If the cold wallet is already set, the REST version returns 304 Not Modified.

Response Body:

```
{
    "COLD_WALLET": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
}
```

### Retrieve Cold Wallet ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_cold_wallet.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/config/wallets/cold
```

*Commandline*

```
# Syntax: get_cold_wallet
$ bin/gateway get_cold_wallet
```

*Javascript*

```
// May return null if cold wallet has not been set
gateway.config.get('COLD_WALLET');
```
</div>

Show the gatewayd cold wallet, from which funds are issued.

Response Body:

```
{
    "COLD_WALLET": {
        "address": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
    }
}
```

### Set Hot Wallet ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/set_hot_wallet.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/config/wallets/cold
{
    "address": "rscJF4TWS2jBe43MvUomTtCcyrbtTRMSNr",
    "secret": "ssuBBapjuJ2hE5wto254aNWERa8VV"
}
```

*Commandline*

```
# Syntax: set_hot_wallet <address> <secret>
$ bin/gateway set_hot_wallet rscJF4TWS2jBe43MvUomTtCcyrbtTRMSNr ssuBBapjuJ2hE5wto254aNWERa8VV
```

*Javascript*

```
//address: String address of account to use
//secret: String secret of account to use
//callback: function(err, wallet) to run on callback
gateway.api.setHotWallet(address, secret, callback);
```
</div>

The hot wallet holds and sends funds to customers automatically. This method 
sets the Ripple account to use as the hot wallet. If the *address* and *secret* fields are omitted from the REST or commandline versions, then a new wallet address and secret are generated on the fly. (You still need to fund the hot wallet with at least the account reserve in XRP before you can use it.)

__*Caution:*__ This method request contains account secrets! Be especially careful not to transmit this data over insecure channels.

Response Body:

```
{
    "address": "rscJF4TWS2jBe43MvUomTtCcyrbtTRMSNr",
    "secret": "ssuBBapjuJ2hE5wto254aNWERa8VV"
}
```

### Retrieve Hot Wallet ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_hot_wallet.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/config/wallets/hot
```

*Commandline*

```
# Syntax: get_hot_wallet
$ bin/gateway get_hot_wallet
```

*Javascript*

```
//may return null if hot wallet isn't set
gateway.config.get('HOT_WALLET');
```
</div>

Show the gatewayd hot wallet, which is used to automatically send
funds, and which maintains trust to and balances of the cold wallet.

Response Body:

```
{
    "address": "rscJF4TWS2jBe43MvUomTtCcyrbtTRMSNr"
}
```

### Set Last Payment Hash ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/set_last_payment_hash.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/config/last_payment_hash
{
    "payment_hash": "4394DB1CDB591CFE697C50EAB974E7BDD6826F18B8660DACC50A88EEC98E0CD8"
}
```

*Commandline*

```
# Syntax: set_last_payment_hash <hash>
$ bin/gateway set_last_payment_hash 4394DB1CDB591CFE697C50EAB974E7BDD6826F18B8660DACC50A88EEC98E0CD8
```

*Javascript*

```
//options: object with field hash: string of last payment hash to use
//callback: function(err) to run on callback
gateway.api.setLastPaymentHash(options, callback);
```
</div>

Gatewayd polls the Ripple Network for notifications of inbound payments to the 
cold wallet beginning with the last known transaction hash. 

This method manually sets that hash. Gatewayd will skip any payments older 
than the transaction identified by the given hash. Generally you do this one time, during setup, choosing the latest transaction in the cold wallet's history at that time, and never set it manually again.

Response Body:

```
{
    "LAST_PAYMENT_HASH": "4394DB1CDB591CFE697C50EAB974E7BDD6826F18B8660DACC50A88EEC98E0CD8"
}
```

### Retrieve Last Payment Hash ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_last_payment_hash.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/config/last_payment_hash
```

*Commandline*

```
# Syntax: get_last_payment_hash
$ bin/gateway get_last_payment_hash
```

*Javascript*

```
gateway.config.get('LAST_PAYMENT_HASH');
```
</div>

Gatewayd polls the Ripple Network for notifications of inbound payments to the 
cold wallet beginning with the last known transaction hash. 

This method returns the transaction hash currently being used.

Response Body:

```
    {
      "LAST_PAYMENT_HASH": "12AE1B1843D886D7D6783DA02AB5F43C32579212853CF3CEFD6DBDF29F03BC80"
    }
```

### Set Gateway Domain ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/set_domain.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/config/domain
{
    "domain": "stevenzeiler.com"
}
```

*Commandline*

```
# Syntax: set_domain <DOMAIN>
$ bin/gateway set_domain stevenzeiler.com
```

*Javascript*

```
//domain: string domain to set
gateway.config.set('DOMAIN', domain);
//callback: function() to call on completion
gateway.config.save(callback);
```
</div>

This method sets the domain that gatewayd uses to identify itself. This domain
is included in the gateway's ripple.txt.

Response Body:

```
{
  "DOMAIN": "stevenzeiler.com"
}
```

### Retrieve Domain ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_domain.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/config/domain
```

*Commandline*

```
# Syntax: get_domain
$ bin/gateway get_domain
```

*Javascript*

```
gateway.config.get('DOMAIN');
```
</div>

Show the domain of the gateway, which is shown in the gateway's `ripple.txt`.

Response Body:

```
{
  "DOMAIN": "stevenzeiler.com"
}
```

### Set API Key ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/set_key.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/config/key
{
  "key": "1234578dddd"
}
```

*Commandline*

```
# Syntax: set_key
$ bin/gateway set_key
```

*Javascript*

```
//key: string API key to set. Optionally, generate a key randomly:
//          key = crypto.randomBytes(32).toString('hex')
gateway.config.set('KEY', key);
//callback: function() to call on completion
gateway.config.save(callback);
```
</div>

This method reset's the gateway's API key, which is used for authenticating to the REST API. (See [Authentication](#authentication) for more details.)

The REST version accepts a key parameter, which it sets as the API key. The commandline version generates and returns a new key randomly. (__*Note:*__ This behavior may be changed to be more uniform. See [Issue #245](https://github.com/ripple/gatewayd/issues/245) for more details.)


Response Body:

```
{
  "KEY": "1234578dddd"
}
```

### Retrieve API Key ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/get_key.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/config/key
```

*Commandline*

```
# Syntax: get_key
$ bin/gateway get_key
```

*Javascript*

```
gateway.config.get('KEY');
```
</div>

This method shows the gateway API key currently in use.

Response Body:

```
{
  "KEY": "ebdb883d5723a71c59fb8ecefbb65476a6923f2a69b49b53cffe212c817cab92"
}
```

### Add Supported Currency ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/add_currency.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/currencies
{
    "currency": "XAG"
}
```

*Commandline*

```
# Syntax: add_currency <currency>
$ bin/gateway add_currency XAG
```

*Javascript*

```
//currency: string currency to add, for example "USD"
//callback: function(err, currencies) to run on callback
gateway.api.addCurrency(currency, callback);
```
</div>

This method adds a currency to the gateway's list of supported currencies,
which is shown in the gateway's `ripple.txt` manifest file.

Response Body:

```
{
  "currencies": {
    "USD": 0,
    "XAU": 0
  }
}
```

### List Supported Currencies ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_currencies.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/currencies
```

*Commandline*

```
# Syntax: list_currencies
$ bin/gateway list_currencies
```

*Javascript*

```
gateway.config.get('CURRENCIES');
```
</div>

This method lists currencies officially supported by the gateway. These 
currencies are also listed in the gateway's `ripple.txt` manifest file.

Response Body:

```
{
  "CURRENCIES": {
    "USD": 0,
    "XAU": 0
  }
}
```

__*Note:*__ The amounts for each currency do not currently mean anything. If you [add supported currencies](#add-supported-currency) using the REST API, they will always be set to 0. You can manually set the values by editing the `config/config.json` file, but there is no meaningful effect.

### Remove Supported Currency ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/remove_currency.js "Source")

<div class='multicode'>
*REST*

```
DELETE /v1/currencies/{:currency}
```

*Commandline*

```
# Syntax: remove_currency <currency>
$ bin/gateway remove_currency XAG
```

*Javascript*

```
//currency: string currency to remove, for example "USD"
//callback: function(err, currencies) to run on callback
gateway.api.removeCurrency(currency, callback);
```
</div>

This method removes a currency (usually defined by its 3-letter code) from the list of supported currencies.

Response Body:

```
{
    "currencies": {
        "USD": 0,
        "XAU": 0
    }
}
```

## Gatewayd Processes ##

### Start Worker Processes ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/start_gateway.js "Source")

<div class='multicode'>
*REST*

```
POST /v1/start
{
    "processes": ["outgoing","incoming"]
}
```

*Commandline*

```
# Syntax: 
$ bin/gateway start
```

*Javascript*

```
//processes: Array of strings representing the processes to start
gateway.api.startGateway(processes);
```
</div>

Start one or more gateway processes, including but not limited to "deposits", 
"outgoing", "incoming", "withdrawals", "callbacks", etc. (See [Gatewayd Services](#gatewayd-services) for more details.)



### List Current Processes ###

[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_processes.js "Source")

<div class='multicode'>
*REST*

```
GET /v1/processes
```

*Commandline*

```
# Syntax: list_processes
$ bin/gateway list_processes
```

*Javascript*

```
//options: object with the following field:
//      - json: boolean, if true return in JSON format
//callback: function(err, ) to run on callback
gateway.api.listProcesses(options, callback);
```
</div>

List information about the currently-running gateway daemon processes. (See [Gatewayd Processes](#gatewayd-processes) for more details.)

Response Body:

```
[ { pid: 26269,
    name: 'ripplerest',
    pm2_env: 
     { name: 'ripplerest',
       exec_mode: 'cluster_mode',
       exec_interpreter: 'node',
       env: [Object],
       pm_exec_path: '/home/ubuntu/ripple-rest/server.js',
       pm_out_log_path: '/home/ubuntu/.pm2/logs/ripplerest-out-0.log',
       pm_err_log_path: '/home/ubuntu/.pm2/logs/ripplerest-err-0.log',
       pm_pid_path: '/home/ubuntu/.pm2/pids/ripplerest.pid',
       LESSOPEN: '| /usr/bin/lesspipe %s',
       MAIL: '/var/mail/ubuntu',
       SSH_CLIENT: '208.90.215.186 61957 22',
       USER: 'ubuntu',
       DATABASE_URL: 'postgres://postgres:password@localhost:5432/ripple_gateway',
       SHLVL: '1',
       HOME: '/home/ubuntu',
       OLDPWD: '/home/ubuntu/gatewayd',
       SSH_TTY: '/dev/pts/0',
       LOGNAME: 'ubuntu',
       _: '/usr/bin/pm2',
       TERM: 'xterm-256color',
       PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games',
       LANG: 'en_US.UTF-8',
       LS_COLORS: 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:',
       SHELL: '/bin/bash',
       NODE_PATH: '/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript',
       LESSCLOSE: '/usr/bin/lesspipe %s %s',
       PWD: '/home/ubuntu/ripple-rest',
       SSH_CONNECTION: '208.90.215.186 61957 10.151.118.93 22',
       pm_cwd: '/home/ubuntu/ripple-rest',
       pm_id: 0,
       restart_time: 0,
       unstable_restarts: 0,
       created_at: 1402602962147,
       pm_uptime: 1402602962147,
       status: 'online' },
    pm_id: 0,
    monit: { memory: 142966784, cpu: 4 } },
  { pid: 27633,
    name: 'deposits',
    pm2_env: 
     { name: 'deposits',
       cron_restart: '0 * * * *',
       exec_mode: 'cluster_mode',
       exec_interpreter: 'node',
       env: [Object],
       pm_exec_path: '/home/ubuntu/gatewayd/processes/deposits.js',
       pm_out_log_path: '/home/ubuntu/.pm2/logs/deposits-out-1.log',
       pm_err_log_path: '/home/ubuntu/.pm2/logs/deposits-err-1.log',
       pm_pid_path: '/home/ubuntu/.pm2/pids/deposits.pid',
       LESSOPEN: '| /usr/bin/lesspipe %s',
       MAIL: '/var/mail/ubuntu',
       SSH_CLIENT: '208.90.215.186 61957 22',
       USER: 'ubuntu',
       DATABASE_URL: 'postgres://postgres:password@localhost:5432/ripple_gateway',
       SHLVL: '1',
       HOME: '/home/ubuntu',
       OLDPWD: '/home/ubuntu/ripple-rest',
       SSH_TTY: '/dev/pts/0',
       LOGNAME: 'ubuntu',
       _: 'bin/gateway',
       TERM: 'xterm-256color',
       PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games',
       LANG: 'en_US.UTF-8',
       LS_COLORS: 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:',
       SHELL: '/bin/bash',
       NODE_PATH: '/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript',
       LESSCLOSE: '/usr/bin/lesspipe %s %s',
       PWD: '/home/ubuntu/gatewayd',
       SSH_CONNECTION: '208.90.215.186 61957 10.151.118.93 22',
       pm_cwd: '/home/ubuntu/gatewayd',
       pm_id: 1,
       restart_time: 1,
       unstable_restarts: 0,
       created_at: 1402602983124,
       pm_uptime: 1402603201351,
       status: 'online' },
    pm_id: 1,
    monit: { memory: 78327808, cpu: 0 } },
  { pid: 27628,
    name: 'outgoing',
    pm2_env: 
     { name: 'outgoing',
       cron_restart: '0 * * * *',
       exec_mode: 'cluster_mode',
       exec_interpreter: 'node',
       env: [Object],
       pm_exec_path: '/home/ubuntu/gatewayd/processes/outgoing.js',
       pm_out_log_path: '/home/ubuntu/.pm2/logs/outgoing-out-2.log',
       pm_err_log_path: '/home/ubuntu/.pm2/logs/outgoing-err-2.log',
       pm_pid_path: '/home/ubuntu/.pm2/pids/outgoing.pid',
       LESSOPEN: '| /usr/bin/lesspipe %s',
       MAIL: '/var/mail/ubuntu',
       SSH_CLIENT: '208.90.215.186 61957 22',
       USER: 'ubuntu',
       DATABASE_URL: 'postgres://postgres:password@localhost:5432/ripple_gateway',
       SHLVL: '1',
       HOME: '/home/ubuntu',
       OLDPWD: '/home/ubuntu/ripple-rest',
       SSH_TTY: '/dev/pts/0',
       LOGNAME: 'ubuntu',
       _: 'bin/gateway',
       TERM: 'xterm-256color',
       PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games',
       LANG: 'en_US.UTF-8',
       LS_COLORS: 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:',
       SHELL: '/bin/bash',
       NODE_PATH: '/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript',
       LESSCLOSE: '/usr/bin/lesspipe %s %s',
       PWD: '/home/ubuntu/gatewayd',
       SSH_CONNECTION: '208.90.215.186 61957 10.151.118.93 22',
       pm_cwd: '/home/ubuntu/gatewayd',
       pm_id: 2,
       restart_time: 1,
       unstable_restarts: 0,
       created_at: 1402602985180,
       pm_uptime: 1402603200575,
       status: 'online' },
    pm_id: 2,
    monit: { memory: 79495168, cpu: 1 } },
  { pid: 27621,
    name: 'incoming',
    pm2_env: 
     { name: 'incoming',
       cron_restart: '0 * * * *',
       exec_mode: 'cluster_mode',
       exec_interpreter: 'node',
       env: [Object],
       pm_exec_path: '/home/ubuntu/gatewayd/processes/incoming.js',
       pm_out_log_path: '/home/ubuntu/.pm2/logs/incoming-out-3.log',
       pm_err_log_path: '/home/ubuntu/.pm2/logs/incoming-err-3.log',
       pm_pid_path: '/home/ubuntu/.pm2/pids/incoming.pid',
       LESSOPEN: '| /usr/bin/lesspipe %s',
       MAIL: '/var/mail/ubuntu',
       SSH_CLIENT: '208.90.215.186 61957 22',
       USER: 'ubuntu',
       DATABASE_URL: 'postgres://postgres:password@localhost:5432/ripple_gateway',
       SHLVL: '1',
       HOME: '/home/ubuntu',
       OLDPWD: '/home/ubuntu/ripple-rest',
       SSH_TTY: '/dev/pts/0',
       LOGNAME: 'ubuntu',
       _: 'bin/gateway',
       TERM: 'xterm-256color',
       PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games',
       LANG: 'en_US.UTF-8',
       LS_COLORS: 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:',
       SHELL: '/bin/bash',
       NODE_PATH: '/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript',
       LESSCLOSE: '/usr/bin/lesspipe %s %s',
       PWD: '/home/ubuntu/gatewayd',
       SSH_CONNECTION: '208.90.215.186 61957 10.151.118.93 22',
       pm_cwd: '/home/ubuntu/gatewayd',
       pm_id: 3,
       restart_time: 1,
       unstable_restarts: 0,
       created_at: 1402602985949,
       pm_uptime: 1402603200180,
       status: 'online' },
    pm_id: 3,
    monit: { memory: 79024128, cpu: 0 } },
  { pid: 29812,
    name: 'server',
    pm2_env: 
     { name: 'server',
       cron_restart: '0 * * * *',
       exec_mode: 'cluster_mode',
       exec_interpreter: 'node',
       env: [Object],
       pm_exec_path: '/home/ubuntu/gatewayd/processes/server.js',
       pm_out_log_path: '/home/ubuntu/.pm2/logs/server-out-4.log',
       pm_err_log_path: '/home/ubuntu/.pm2/logs/server-err-4.log',
       pm_pid_path: '/home/ubuntu/.pm2/pids/server.pid',
       LESSOPEN: '| /usr/bin/lesspipe %s',
       MAIL: '/var/mail/ubuntu',
       SSH_CLIENT: '208.90.215.186 61957 22',
       USER: 'ubuntu',
       DATABASE_URL: 'postgres://postgres:password@localhost:5432/ripple_gateway',
       SHLVL: '1',
       HOME: '/home/ubuntu',
       OLDPWD: '/home/ubuntu/ripple-rest',
       SSH_TTY: '/dev/pts/0',
       LOGNAME: 'ubuntu',
       _: 'bin/gateway',
       TERM: 'xterm-256color',
       PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games',
       LANG: 'en_US.UTF-8',
       LS_COLORS: 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:',
       SHELL: '/bin/bash',
       NODE_PATH: '/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript',
       LESSCLOSE: '/usr/bin/lesspipe %s %s',
       PWD: '/home/ubuntu/gatewayd',
       SSH_CONNECTION: '208.90.215.186 61957 10.151.118.93 22',
       pm_cwd: '/home/ubuntu/gatewayd',
       pm_id: 4,
       restart_time: 2,
       unstable_restarts: 0,
       created_at: 1402602986623,
       pm_uptime: 1402603773423,
       status: 'online' },
    pm_id: 4,
    monit: { memory: 78049280, cpu: 0 } },
  { pid: 0,
    name: 'withdrawals',
    pm2_env: 
     { name: 'withdrawals',
       cron_restart: '0 * * * *',
       exec_mode: 'cluster_mode',
       exec_interpreter: 'node',
       env: [Object],
       pm_exec_path: '/home/ubuntu/gatewayd/processes/withdrawals.js',
       pm_out_log_path: '/home/ubuntu/.pm2/logs/withdrawals-out-5.log',
       pm_err_log_path: '/home/ubuntu/.pm2/logs/withdrawals-err-5.log',
       pm_pid_path: '/home/ubuntu/.pm2/pids/withdrawals.pid',
       LESSOPEN: '| /usr/bin/lesspipe %s',
       MAIL: '/var/mail/ubuntu',
       SSH_CLIENT: '208.90.215.186 61957 22',
       USER: 'ubuntu',
       DATABASE_URL: 'postgres://postgres:password@localhost:5432/ripple_gateway',
       SHLVL: '1',
       HOME: '/home/ubuntu',
       OLDPWD: '/home/ubuntu/ripple-rest',
       SSH_TTY: '/dev/pts/0',
       LOGNAME: 'ubuntu',
       _: 'bin/gateway',
       TERM: 'xterm-256color',
       PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games',
       LANG: 'en_US.UTF-8',
       LS_COLORS: 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lz=01;31:*.xz=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.axv=01;35:*.anx=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.axa=00;36:*.oga=00;36:*.spx=00;36:*.xspf=00;36:',
       SHELL: '/bin/bash',
       NODE_PATH: '/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript',
       LESSCLOSE: '/usr/bin/lesspipe %s %s',
       PWD: '/home/ubuntu/gatewayd',
       SSH_CONNECTION: '208.90.215.186 61957 10.151.118.93 22',
       pm_cwd: '/home/ubuntu/gatewayd',
       pm_id: 5,
       restart_time: 0,
       unstable_restarts: 0,
       created_at: 1402602987366,
       pm_uptime: 1402602987366,
       status: 'stopped' },
    pm_id: 5,
    monit: { memory: 0, cpu: 0 } } ]
```


## User-Auth Methods ##

### Log In User ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/public/login_user.js "Source")

__*Caution:*__ This method is deprecated, and may be removed without further notice.

<div class='multicode'>
*REST*

```
POST /v1/users/login
{
    "name": "steven@ripple.com",
    "password": "s0m3supe&$3cretp@s$w0r*"
}
```
</div>

__*Note:*__ This method intentionally lacks commandline and Javascript versions.

Verifies that a user has the correct username and password combination. Used
for the web application and requires user credentials in place of an API key.

Naturally, since this includes sensitive credentials, do not run this command 
over an unsecure connection.



### Retrieve User ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/resources/users_controller.js#L38 "Source")

__*Caution:*__ This method is deprecated, and may be removed without further notice.

<div class='multicode'>
*REST*

```
GET /v1/users/{:id}
```

*Commandline*

```
// no commandline equivalent?
```

*Javascript*
```
//requires User data model
//user_id: Integer user ID
//callback: function(err, user) to run on callback
User.find({ where: { id: user_id }}).complete(callback);
```
</div>

To retrieve a user's base account information, pass the user's ID to this 
method.

Response Body:

```
{
  "success": true,
  "users": {
    "id": 8,
    "name": "steven@ripple.com",
    "salt": "1366f14307850818afddd1509f329fdc1a73fb93919d92d5b44c91f07560c999",
    "federation_tag": null,
    "admin": null,
    "federation_name": null,
    "password_hash": "dd1d5a0ba63c63a117ff811f14040fa87dcbfedd7e37b5df506bfc4e8014c8e5",
    "bank_account_id": null,
    "kyc_id": null,
    "createdAt": "2014-06-10T22:37:19.647Z",
    "updatedAt": "2014-06-10T22:37:19.647Z",
    "external_id": null,
    "data": null,
    "uid": null,
    "active": false
  }
}
```

### List User External Accounts ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/api/list_user_external_accounts.js "Source")

__*Caution:*__ This method is deprecated, and may be removed without further notice.

<div class='multicode'>
*REST*

```
GET /v1/users/{:id}/external_accounts
```

*Commandline*

```
# Syntax: list_user_external_accounts <id>
bin/gateway list_user_external_accounts 508
```

*Javascript*
```
//id: integer ID of account to get external accounts from
//callback: function(err, accounts) to run on callback
gateway.api.listUserExternalAccounts(id, callback);
```
</div>

To list all external (non-Ripple) account records for a user, pass the user's 
ID to this method.
  
Response Body:

```
{
  "external_accounts": [
    {
      "data": null,
      "id": 8,
      "name": "default",
      "user_id": 8,
      "createdAt": "2014-06-10T22:37:19.835Z",
      "updatedAt": "2014-06-10T22:37:19.835Z",
      "uid": null
    }
  ]
}
```

### List User External Transactions ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/users/index.js#L24 "Source")

__*Caution:*__ This method is deprecated, and may be removed without further notice.

<div class='multicode'>
*REST*

```
GET /v1/users/{:id}/external_transactions
```

*Javascript*

```
//id: Integer user ID of user to find transactions of
//callback: function(err, transactions) to run on callback
gateway.data.externalTransactions.forUser(id, callback);
```
</div>

__*Note:*__ This method intentionally lacks a commandline version.

List all external (non-Ripple) transaction records for a given user. These 
records are the user's deposits into the gateway and withdrawals from it.

Response Body:

```
{
  "externalTransactions": [
    {
      "id": 80,
      "currency": "SWD",
      "amount": "1",
      "deposit": true,
      "ripple_transaction_id": 81,
      "external_account_id": 8,
      "status": "processed"
    },
    {
      "id": 81,
      "currency": "SWD",
      "amount": "1.5999",
      "deposit": true,
      "ripple_transaction_id": 82,
      "external_account_id": 8,
      "status": "processed"
    }
  ]
}
```

### List User Ripple Addresses ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/users/index.js#L36 "Source")

__*Caution:*__ This method is deprecated, and may be removed without further notice.

<div class='multicode'>
*REST*

```
/v1/users/{:id}/ripple_addresses
```

*Javascript*

```
//id = Integer ID of user to retrieve Ripple addresses of
//callback: function(err, addresses) to run on callback
gateway.data.rippleAddresses.readAll({ user_id: id }, callback);
```
</div>

__*Note:*__ This method intentionally lacks a commandline version.

To list all ripple addresses for a given user, pass the user's ID to this 
method. Most users will have at least one independent address and one hosted 
address.

Response Body:

```
{
  "rippleAddresses": [
    {
      "data": null,
      "id": 16,
      "managed": false,
      "address": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "type": "independent",
      "user_id": 8,
      "tag": null,
      "secret": null,
      "previous_transaction_hash": null,
      "createdAt": "2014-06-10T22:37:19.825Z",
      "updatedAt": "2014-06-10T22:37:19.825Z",
      "uid": null
    },
    {
      "data": null,
      "id": 17,
      "managed": true,
      "address": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6",
      "type": "hosted",
      "user_id": 8,
      "tag": 8,
      "secret": null,
      "previous_transaction_hash": null,
      "createdAt": "2014-06-10T22:37:19.844Z",
      "updatedAt": "2014-06-10T22:37:19.844Z",
      "uid": null
    }
  ]
}
```

### List User Ripple Transactions ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/users/index.js#L46 "Source")

__*Caution:*__ This method is deprecated, and may be removed without further notice.

<div class='multicode'>
*REST*

```
GET /v1/users/{:id}/ripple_transactions
```

*Javascript*

```
//id: Integer user ID of the user to retrieve transactions of
//callback: function(err, transactions) to run on callback
gateway.data.rippleTransactions.forUser(id, callback);
```
</div>

__*Note:*__ This method intentionally lacks a commandline version.

To list all Ripple transactions for a given user, pass the user's ID to this
method. The response includes an array of transactions made to or from any of 
the users's Ripple addresses.

Response Body:

```
{
  "rippleTransactions": [
    {
      "address": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "tag": null,
      "ripple_address_id": 16,
      "id": 81,
      "to_address_id": 16,
      "from_address_id": 1,
      "transaction_state": "tesSUCCESS",
      "transaction_hash": "F0737576A4E7D064BF00145FAD6E6BAD19115C7739A3C8CDB6D1FD38888C8364",
      "to_amount": "1",
      "to_currency": "SWD",
      "to_issuer": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6",
      "from_amount": "1",
      "from_currency": "SWD",
      "from_issuer": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6",
      "createdAt": "2014-06-10T22:41:14.258Z",
      "updatedAt": "2014-06-10T22:41:16.717Z",
      "uid": "505a336f-4ff9-473d-862b-164b3ad63b73",
      "data": null,
      "client_resource_id": "false",
      "state": "succeeded",
      "external_transaction_id": 80
    },
    {
      "address": "r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk",
      "tag": null,
      "ripple_address_id": 16,
      "id": 82,
      "to_address_id": 16,
      "from_address_id": 1,
      "transaction_state": "tesSUCCESS",
      "transaction_hash": "7DEEF3BBAEEA3FEECF7819D3FAA53C580ED4A790A98DD2E761E8D747EAFB1969",
      "to_amount": "1.5999",
      "to_currency": "SWD",
      "to_issuer": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6",
      "from_amount": "1.5999",
      "from_currency": "SWD",
      "from_issuer": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6",
      "createdAt": "2014-06-10T22:43:57.090Z",
      "updatedAt": "2014-06-10T22:43:59.364Z",
      "uid": "5205d9b4-f1c2-4273-b656-78e908e94210",
      "data": null,
      "client_resource_id": "false",
      "state": "succeeded",
      "external_transaction_id": 81
    }
  ]
}
```

