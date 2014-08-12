# gatewayd #

Gatewayd (pronounced "gateway-dee"), provides a framework you can extend to build a gateway on the Ripple Network. The system includes a core database that manages accounting for deposits and withdrawals of assets, linking the network with your holdings in the outside world. Gatewayd provides a standard interface for issuing any currency on the Ripple network and exchange, with the goal of completely abstracting interaction with Ripple.

Interact with the gatewayd by building custom integrations with banking and payment systems around the world, and by using the built-in APIs for designing beautiful gateway mobile apps and user interfaces. A HTTP/JSON server, Javascript library, and commandline interface are provided as interfaces to the gatewayd software.

Gatewayd's features include: 

  - user registration 
  - deposits and withdrawals
  - issuing currency
  - robust Ripple payment sending 
  - incoming Ripple payment monitoring
  - gateway administration

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
    - [Debian](http://www.postgresql.org/download/linux/debian/)
    - [Red Hat, Fedora, CentOS](http://www.postgresql.org/download/linux/redhat/)
    - [SuSE](http://www.postgresql.org/download/linux/suse/)
    - [Arch Linux](https://wiki.archlinux.org/index.php/Postgres)

3. [Ripple REST API](https://github.com/ripple/ripple-rest.git)
  - The Ripple REST API provides a simplified HTTP/JSON interface to all the Ripple protocol network operations, such as payments and other transactions.

4. [git](http://git-scm.com/) is required for installation and updating. It is not used during general operation.

## Installation

- Comprehensive [installation script](https://github.com/ripple/gatewayd/blob/master/doc/install.md) for Ubuntu

## Configuration ##

Before you can run gatewayd, you need to set up the appropriate accounts that will be used to store and send funds in the Ripple network. You also need to define which currencies your gateway issues. Beyond that, there are some options you can set if they fit your needs.

The defaults for all of gatewayd's settings are found in the file `config/config.js`. You can override any of those settings with your own values by editing them in the file `config/config.json`, or by using the API methods for setting the configuration. (The API methods result in editing the `config/config.json` file anyway.) You don't need to edit the `config/config.js` file, since that only contains the defaults, and gets overridden in a software update.

### Hot Wallet, Cold Wallet, Trust ###

When a gateway issues balances of non-XRP currencies on the Ripple Network, those balances become liabilities in the real world that must be covered when people redeem those balances as external withdrawals. Additionally, actual XRP balances are digital assets that can be stolen or lost. Gatewayd uses the concept of a "hot wallet" and a "cold wallet" to minimize the risk of losses for both categories. (In practice, there is no difference between the term "wallet" and "account" on Ripple.)

The cold wallet is like your vault. It issues all your funds, and holds the bulk of your XRP assets. The secret key that is used for this wallet is kept offline, accessible to a few trusted operators. Every now and then, the cold wallet is used to refill the stores in the hot wallet.

The hot wallet is like your cash register. It holds a small amount of funds at a time, and customers deal with it directly. The secret key for this wallet is, by necessity, stored on a server that is connected to the outside internet. The hot wallet can be replaced without affecting the balances already issued by the cold wallet and held by users.

All issuances of non-XRP currency and assets come from the cold wallet; it effectively 'creates' the currency on the Ripple Network to mirror the deposits received via external transactions. Consequently, Ripple accounts (customers as well as the hot wallet) must trust the cold wallet account in order to hold currency issued by that gateway. (Trusting a gateway means that you believe its issuances are worth something.) Customers do not need to trust the hot wallet, and should not. 

Although you could send the issuances directly to customers from the account issuing them, that exposes you to risk: if the account issuing the currency is compromised, potentially unlimited issuances could be made on your behalf. Using a hot/cold wallet distinction decreases the chances that your issuing account will be compromised, because you can keep it safely offline while day-to-day business is happening. The hot wallet, which is exposed to the most risk, can only lose as much money as it holds.

### Setting Up Wallets for gatewayd

The actual process of configuring gatewayd with the appropriate accounts is easy. First, generate a set of account keys for a cold wallet. You can use the official Ripple client to do so:

[Ripple Client](https://ripple.com/client/#/register) *Note:* The key generation process happens on your local machine, and is never sent to Ripple or anyone else. You can even go offline while you generate the key (as long as you've fully loaded the page first).

Save the secret key somewhere that it will be completely safe. Never send it unencrypted to an untrusted entity such as your web host. 

Now, set the address of the cold wallet in gatewayd using the commandline:

    bin/gateway set_cold_wallet rsnCCioK33L19UwywUPoHK3ucTcQR2fpfm

Next, generate a new key pair for the hot wallet account.
    
    bin/gateway generate_wallet

Set the address _and_ the secret key for the hot wallet in gatewayd using the commandline:

    bin/gateway set_hot_wallet rhfyVnzjPvvtdnZNSiNufRCZhHpc9yh1rA ssmgxde6ozSViVkuWvsC6HJxpLvH4
    
(*Tip:* Ripple addresses always start with `r`; Ripple secrets always start with `s`.)

Define which currencies your gateway will support. (This does not include XRP, which is necessary for every Ripple account and gateway.) You can do this with the commandline as well. Run the `add_currency` command with the 3-letter ISO 4217 currency codes for whichever currencies you want to support:

    bin/gateway add_currency USD
    bin/gateway add_currency XAU

Fund both accounts. This requires some outside source of XRP to send a payment to the address of each one. For now, we recommend at least 50 XRP. (Because it requires outside intervention, you cannot do this step with gatewayd.)

At this point, you need to create trustlines between the hot and cold wallet accounts. You can also do this with the gatewayd commandline. Run the `set_trust` command, with reasonable maximum quantities that you want your hot wallet to hold at a time, for each currency you support.

    bin/gateway set_trust USD 1000
    bin/gateway set_trust XAU 2
    
(*Aside:* Keep in mind the very different values for currencies. In this example, the two troy ounces of gold (XAU 2) are, at the time of writing, worth approximately $2600 USD.) Fortunately, gatewayd supports very large and small numbers.)

The last step before you can start your gateway is to set the last payment hash. This indicates a cutoff point in time, where the gateway should monitor Ripple for payments that are newer and try to process them, but ignore payments that are older. <span class='draft-comment'>(Any advice on what payment hash to use?</span>



## Updating

The update process for gatewayd may change in the future, but for now, updating to a new version follows this process:

<span class='draft-comment'>(Need to confirm that this is the correct commandline syntax for all of these)</span>

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

# Gatewayd Usage #

## Running gatewayd

After installation, start the gateway processes by running the command:

    bin/gateway start

## Gatewayd Architecture

A gateway acts as a link between Ripple's shared global Ledger and value outside of the network, such as traditional banking balances, other virtual currencies, or more. Thus, gatewayd sits between the `rippled` server (which participates in the network that defines the Ripple global ledger) and some source of information about external activities. Gatewayd's main job is to monitor each side for transactions and translate them into the appropriate actions on the other side.

In short, you can 

Gatewayd is implemented as a [Node.js](http://nodejs.org/) web application that keeps track of transactions that are entering and leaving the Ripple Network, and exposes a RESTful API for configuring and controlling its behavior. It persists transactions to a [Postgres database](http://www.postgresql.org/). This application has 6 main processes that comprise its operation:

| Process | Purpose |
|---------|---------|
| server  | Provides the RESTful API for controlling gatewayd and querying about its status; also serves a ripple.txt file to identify the gateway. |
| ripple-rest | Provides a [Ripple-REST](?p=ripple-rest) service that communicates with a `rippled` server. |
| incoming | Monitors the Ripple Network for incoming Ripple payments |
| withdrawals | Converts records of incoming Ripple payments into pending withdrawal records |
| outgoing | Sends pending Ripple payments out to the network to issue balances |
| deposits | Converts records of external deposits into pending Ripple payments |

In essence, the `server` and `ripple-rest` processes are infrastructure, while the other four processes form two thirds of a complete two-way link between an outside network and the Ripple Network. The missing piece: integrations with the outside network. Naturally, these vary depending on the gateway and how it accepts outside payment. In other words: that part, you must build for yourself.

Fortunately, all the pieces are here already. When you receive information about an external transaction, you can use gatewayd's API to record it as a deposit in your system. You can use gatewayd's API to look for new withdrawals, so that you can process them; and when you're done, just call gatewayd's API again to clear them. You can perform these calls manually (not recommended), you can write software that depends on gatewayd's API to do them, or you can skip the API and write to the Postgres database directly (also not recommended). If you like, you can even write the processes as additional Node.js services and incorporate them into gatewayd, to be run alongside the build-in processes.

Conceptually, gatewayd processes two flows in opposite directions:

* Outside world -> External Transaction Inbox -> Ripple Transaction Outbox -> Ripple
* Ripple -> Ripple Transaction Inbox -> External Transaction Outbox -> Outside world

However, the implementation combines the inboxes and outboxes for like objects into a single database table each, so one database table contains external transactions that are ingoing alongside ones that are outgoing; and another database table contains Ripple transactions in both states.

That means that the overall process looks like this:

![Ripple Gateway Process Diagram](img/gatewayd_overview.svg)

<span class='draft-comment'>(Probably need to revise this diagram somewhat.)</span>

## Process Flow of a Gateway Deposit

### Process 1: Recording Deposits ###

A banking API integration or manual human gateway operator receives the deposit of an asset and records the deposit in the ripple gateway data store. This process is designed to be implemented externally, and example implementations are provided by the command line interface and the http/json express.js server.

API calls: [Create Deposit](#create-deposit)

### Process 2: Deposit Business Logic ###
    
A newly recorded deposit is handed to the business logic, which performs some function, ultimately en-queuing a corresponding ripple payment. This process is designed to be modified and customized.

    node processes/deposits.js

API calls: [List Deposits](#list-deposits), <span class='draft-comment'>[Enqueue Payment](#enqueue-payment) (missing??)</span>

###  Process 3: Send Outgoing Ripple Payments ###

A payment record resulting from the deposit business logic process is sent to the Ripple REST server, ultimately propagating to the network. This process is standard and should not be modified.

    node processes/outgoing.js

API calls: <span class='draft-comment'>[Send Payment](#send-payment) (also missing??)</span>

## Process Flow of a Gateway Withdrawal

### Process 1: Record inbound Ripple payments ###

Poll the Ripple REST server for new payment notifications to the gateway, and record the incoming payments in the ripple gateway data store. This process is standard and should not be modified.

    node processes/incoming.js

API calls: [List Incoming Payments](#list-incoming-payments) <span class='draft-comment'>(aka get_payment_notification??)</span>, <span class='draft-comment'>record_payment(??)</span>

### Process 2: Withdrawal Business Logic ###

A newly recorded incoming ripple payment is handed to the business logic, which performs some function, ultimately en-queuing a corresponding asset withdrawal record. This process is designed to be modified and customized.

    node processes/withdrawals.js

API calls: enqueue_withdrawal

### Process 3: Clear Withdrawals ###

A banking API integration or manual human gateway operator reads the queue of pending withdrawals from the gateway data store, redeems the corresponding asset, and finally clears the withdrawal from the queue by updating the gateway data store. This process is designed to be implemented externally, and example implementations are provided by the command line interface and the http/json express.js server.

API calls: list_withdrawals, clear_withdrawal

Alternatively one can provide a WITHDRAWALS_CALLBACK_URL in the configuration, and then start the withdrawal_callbacks process to receive POST notifications whenever a new withdrawal comes in the gateway from the Ripple network. This process is currently not starte by default.


## Command Line Interface ##

```
bin/gateway [options] [command]
```

The available *options* are as follows:

```
-h, --help     output usage information
```
  
The available commands are as follows:
  
| Command Syntax | Description |
|----------------|-------------|
| `register_user <username> <password> <ripple_address> ` | create a user with a ripple address |
| `list_users` | list registered users |
| `record_deposit <amount> <currency> <external_account_id>` | record a deposit in the deposit processing queue |
| `list_deposits` | list deposits in the deposit processing queue |
| `list_outgoing_payments` | list the outgoing ripple payments. |
| `list_incoming_payments` | list unprocesses incoming ripple payments |
| `list_withdrawals` | get pending withdrawals to external accounts |
| `clear_withdrawal <external_transaction_id>` | clear pending withdrawal to external account |
| `generate_wallet` | generate a random ripple wallet |
| `set_hot_wallet <address> <secret>` | set the gateway hot wallet |
| `get_hot_wallet` | get the address of the gateway hot wallet |
| `get_hot_wallet_secret` | get the secret of the gateway hot wallet |
| `fund_hot_wallet <amount> <currency>` | issue funds from cold wallet to hot wallet |
| `set_cold_wallet <account>` | set the gateway hot wallet |
| `get_cold_wallet` | get the gateway cold wallet |
| `refund_cold_wallet <amount> <currency>` | send back funds from the hot wallet to cold wallet |
| `set_trust <amount> <currency>` | set level of trust from hot to cold wallet |
| `get_trust_lines` | get the trust lines from hot wallet to cold wallet |
| `list_currencies` | List all currencies supported by the gateway |
| `add_currency <currency>` | add support for a currency |
| `remove_currency <currency>` | remove support for a currency |
| `set_domain <domain>` | set the domain name of the gateway |
| `get_domain` | get the domain name of the gateway |
| `set_postgres_url <url>` | set the url of the postgres database |
| `get_postgres_url` | get the url of the postgres database |
| `set_ripple_rest_url <url>` | set the url of the Ripple-REST api |
| `get_ripple_rest_url` | get the url of the Ripple-REST api |
| `set_key` | set the admin api key |
| `get_key` | get the admin api key |
| `set_last_payment_hash <hash>` | set the last encountered payment hash for incoming processing. |
| `get_last_payment_hash` | get the last encountered payment hash for incoming processing. |
    

# Gatewayd API #

`gatewayd : v3.20.0`

## Available API Routes ##

* [`POST /v1/registrations`](#register-user)
* [`POST /v1/users/{:id}/activate`](#activate-user)
* [`POST /v1/users/{:id}`](#deactivate-user)
* [`POST /v1/deposits/`](#create-deposit)
* [`GET /v1/deposits`](#list-deposits)
* [`GET /v1/payments/outgoing`](#list-outgoing-payments)
* [`GET /v1/payments/failed`](#list-failed-payments)
* [`POST /v1/payments/failed/{:id}/retry`](#retrying-a-failed-payment)
* [`GET /v1/payments/incoming`](#listing-incoming-payments)
* [`GET /v1/withdrawals`](#listing-withdrawals)
* [`POST /v1/withdrawals/{:id}/clear`](#clearing-a-withdrawal)
* [`GET /v1/cleared`](#listing-cleared-external-transactions)
* [`GET /v1/balances`](#listing-hot-wallet-balances)
* [`GET /v1/liabilities`](#listing-cold-wallet-liabilities)

## User-Auth API Routes

* [`POST /v1/register`](#registering-a-user)
* [`POST /v1/users/login`](#logging-in-a-user)
* [`GET /v1/users/{:id}`](#showing-a-user)
* [`GET /v1/users/{:id}/external_accounts`](#listing-user-external-accounts)
* [`GET /v1/users/{:id}/external_transactions`](#listing-user-external-transactions)
* [`GET /v1/users/{:id}/ripple_addresses`](#listing-user-ripple-addresses)
* [`GET /v1/users/{:id}/ripple_transactions`](#listing-user-ripple-transactions)

## Admin Configuration API Routes

* [`POST /v1/wallets/hot/fund`](#funding-the-hot-wallet)
* [`POST /v1/config/database`](#setting-the-database-url)
* [`GET /v1/config/database`](#showing-the-database-url)
* [`POST /v1/config/ripple/rest`](#setting-the-ripple-rest-url)
* [`GET /v1/config/ripple/rest`](#showing-the-ripple-rest-url)
* [`POST /v1/config/wallets/cold`](#setting-the-cold-wallet)
* [`GET /v1/config/wallets/cold`](#showing-the-cold-wallet)
* [`POST /v1/config/wallets/generate`](#generating-a-ripple-wallet)
* [`POST /v1/config/wallets/hot`](#setting-the-hot-wallet)
* [`GET /v1/config/wallets/hot`](#showing-the-hot-wallet)
* [`POST /v1/trust`](#setting-trust-from-hot-wallet-to-cold-wallet)
* [`GET /v1/trust`](#listing-trust-from-hot-wallet-to-cold-wallet)
* [`POST /v1/wallets/hot/fund`](#funding-the-hot-wallet)
* [`POST /v1/config/last_payment_hash`](#setting-the-last-payment-hash)
* [`GET /v1/config/last_payment_hash`](#showing-the-last-payment-hash)
* [`POST /v1/config/domin`](#setting-the-domain)
* [`GET /v1/config/domain`](#showing-the-domain)
* [`POST /v1/config/key`](#setting-the-api-key)
* [`GET /v1/config/key`](#showing-the-api-key)
* [`POST /v1/currencies`](#setting-currencies)
* [`GET /v1/currencies`](#listing-currencies)
* [`POST /v1/wallets/cold/refund`](#sending-funds-from-hot-wallet-to-cold-wallet)
* [`POST /v1/start`](#starting-worker-processes)
* [`POST /v1/processes`](#listing-current-processes)

# API Method Reference #

## Managing Users ##

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
//callback: function f(err, user) to run on callback
gateway.api.registerUser(options, callback);
```
</div>

Register a user with the gatewayd. A username, password, and ripple address are required. Upon
registration several records are created in the gatewayd database, including a user record,
a "independent" ripple address record with the address provided, a "hosted" ripple address
record for making withdrawals, and a "default" external account for recording deposits and
withdrawals.

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
//callback: function f(err, user) to run on callback
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
//callback: function f(err, user) to run on callback
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

### Log In User ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/public/login_user.js "Source")

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

<span class='draft-comment'>Seemingly no commandline for this; also, not exactly applicable for JS?</span>

Verifies that a user has the correct username and password combination. Used
for the web application and requires user credentials in place of an API key.

Naturally, since this includes sensitive credentials, do not run this command 
over an unsecure connection.

Response Body:
<span class='draft-comment'>No example yet -- should be a user object</span>

### Retrieve User ###
[[Source]<br>](https://github.com/ripple/gatewayd/blob/master/lib/http/controllers/resources/users_controller.js#L38 "Source")

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
//callback: function f(err, user) to run on callback
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
//callback: function f(err, accounts) to run on callback
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

<div class='multicode'>
*REST*

```
GET /v1/users/{:id}/external_transactions
```

*Javascript*

```
//id: Integer user ID of user to find transactions of
//callback: function f(err, transactions) to run on callback
gateway.data.externalTransactions.forUser(id, callback);
```
</div>

<span class='draft-comment'>Apparently no commandline for this one?</span>

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

<div class='multicode'>
*REST*

```
/v1/users/{:id}/ripple_addresses
```

*Javascript*

```
//id = Integer ID of user to retrieve Ripple addresses of
//callback: function f(err, addresses) to run on callback
gateway.data.rippleAddresses.readAll({ user_id: id }, callback);
```
</div>

<span class='draft-comment'>No commandline for this one?</span>

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

<div class='multicode'>
*REST*

```
GET /v1/users/{:id}/ripple_transactions
```

*Javascript*

```
//id: Integer user ID of the user to retrieve transactions of
//callback: function f(err, transactions) to run on callback
gateway.data.rippleTransactions.forUser(id, callback);
```
</div>

<span class='draft-comment'>No commandline for this one either?</span>

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

## Managing Transactions ##

### List Outgoing Payments ###
__`GET /v1/payments/outgoing`__

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
__`GET /v1/payments/failed`__

Outgoing payments are often rejected from Ripple, such as when there is
insufficient trust from the recipient account to the gateway account, or
when the gateway's hot wallet account has insufficient funds to process the
payment. In the case that a payment will never make it into the Ripple
ledger the outgoing payment is marked as "failed". This method lists the
history of such payments.

<span class='draft-comment'>Does this array just grow indefinitely? Is there a
way to limit the amount of data in the response, to expire old failures, or 
anything to that effect? If not, it seems it'll be necessary eventually.</span>

Request Body:

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
__`POST /v1/payments/failed/{:id}/retry`__

A payment that failed due to insufficient funds or lack of trust lines
may be successfully retried once funds are increased or an appropriate
line of trust is established. After taking the appropriate action in Ripple, 
use this method to retrying a payment. This method simply changes the 
payment's state from "failed" to "outgoing", effectively enqueueing the 
transaction to be re-submitted to Ripple.

Request Body:
<span class='draft-comment'>(Apparently ignored?)</span>

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
__`GET /v1/payments/incoming`__

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
    
### Set Last Payment Hash ###
__`POST /v1/config/last_payment_hash`__

Gatewayd polls the Ripple Network for notifications of inbound and outbound
payments beginning with the last known transaction hash. 

This method manually sets that hash. Gatewayd will skip any payments older 
than the transaction identified by the given hash. 

Request Body:

```
{
    "payment_hash": "4394DB1CDB591CFE697C50EAB974E7BDD6826F18B8660DACC50A88EEC98E0CD8"
}
```

Response Body:

```
{
    "LAST_PAYMENT_HASH": "4394DB1CDB591CFE697C50EAB974E7BDD6826F18B8660DACC50A88EEC98E0CD8"
}
```

### Retrieve Last Payment Hash ###
__`GET /v1/config/last_payment_hash`__

Gatewayd polls the ripple network for notifications of inbound and outbound
payments beginning with the last known transaction hash. 

This method returns the transaction hash currently being used.

Response Body:

```
    {
      "LAST_PAYMENT_HASH": "12AE1B1843D886D7D6783DA02AB5F43C32579212853CF3CEFD6DBDF29F03BC80"
    }
```

### Create Deposit ###
__`POST /v1/deposits`__

This method is the entry point to creating Ripple balances. When you receive 
an asset outside the Ripple Network from a user, you can call this method to 
create a "deposit" record in gatewayd's database tracking it. By default, the 
deposit record is marked as "queued", which means that gatewayd's deposit 
process will automatically apply fees and then enqueue an outgoing Ripple 
payment to the user's Ripple address.

Request Body:

```
    {
      "external_account_id": 307,
      "currency": "BTC"
      "amount": "10.7"
    }
```

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
__`GET /v1/deposits`__

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
__`GET /v1/withdrawals`__

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
__`POST /v1/withdrawals/{:id}/clear`__

A pending withdrawal record indicates to the gateway operator that a
user wishes to withdraw a given asset. Once the operator processes the 
withdrawal by sending the asset to the user, mark the withdrawal as "cleared" 
by calling this method.

Request Body:

<span class='draft-comment'>example needed</span>

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
__`GET /v1/cleared`__

This method retrieves the list of all external transactions that are no longer 
considered pending. This includes all deposits that have been issued as a 
balance with a Ripple payment, and all withdrawals that have been cleared.

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

## Managing Wallets ##

### List Hot Wallet Balances ###
__`GET /v1/balances`__

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
__`GET /v1/liabilities`__

Every asset that the gateway holds and for which it issues currency is
a liability of the gateway. This method lists total liabilities for each type of
currency and the other Ripple account holding that currency on the network.

    RESPONSE:
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


### Fund the Hot Wallet ###
__`POST /v1/wallets/hot/fund`__

Issue funds from the cold wallet to the hot wallet, specifying the amount, currency, and
the cold wallet secret key.

### Set Cold Wallet ###
__`POST /v1/config/wallets/cold`__

Set the gateway cold wallet, from which funds are issued.

### Retrieve Cold Wallet ###
__`GET /v1/config/wallets/cold`__

Show the gatewayd cold wallet, from which funds are issued.

### Generate Ripple Wallet ###
__`POST /v1/config/wallets/generate`__

Generate a random ripple address and secret key pair, which
represents an unfunded ripple account.

### Set Hot Wallet ###
__`POST /v1/config/wallets/cold`__

The hot wallet holds and sends funds to customers automatically. This method 
sets the Ripple account to use as the hot wallet.

Request Body:

```
{
    "address": "rscJF4TWS2jBe43MvUomTtCcyrbtTRMSNr",
    "secret": "ssuBBapjuJ2hE5wto254aNWERa8VV"
}
```

*Caution:* This method request contains account secrets! Be especially careful not to transmit this data over insecure channels.

Response Body:

<span class='draft-comment'>(Example needed)</span>

### Retrieve Hot Wallet ###
__`GET /v1/config/wallets/hot`__

Show the gatewayd hot wallet, which is used to automatically send
funds, and which maintains trust to and balances of the cold wallet.

Response Body:

<span class='draft-comment'>(Example needed)</span>

### Set Trust from Hot Wallet to Cold Wallet ###
__`POST /v1/trust`__

This method sets a line of trust from the gateway hot wallet to the gateway 
cold wallet. The line of trust represents the total amount of one type of 
currency that gatewayd's hot wallet can hold and automatically send out without 
the gateway operator manually adding more funds to the hot wallet.

Request Body:

```
{
    "currency": "USD",
    "amount": 1000
}
```

Response Body:

<span class='draft-comment'>(Example needed)</span>

### Show Trust from Hot Wallet to Cold Wallet ###
__`GET /v1/trust`__

List lines of trust from the gateway hot wallet to the gateway cold
wallet. The line of trust represents the total amount of each asset
that gatewayd can hold and automatically send out without a manual
refunding by a gateway operator.

Response Body:

```
    {
      "lines": [
        {
          "account": "rDNP5C7Vjt2mLushCmUPwm6dvwNzNiuND6",
          "balance": "8776.3012",
          "currency": "SWD",
          "limit": "10000",
          "limit_peer": "0",
          "quality_in": 0,
          "quality_out": 0
        }
      ]
    }
```

### Sending Funds From Hot Wallet To Cold Wallet ###
__`POST /v1/wallets/cold/refund`__

This method returns funds from the hot wallet back to the cold wallet. This is 
an important step in phasing out a hot wallet, especially if its security may 
be compromised.

Request Body:

```
{
    "currency": "USD",
    "amount": 1000
}
```

Response Body:

<span class='draft-comment'>(Example needed)</span>

## Configuring gatewayd ##

### Set Database URL ###
__`POST /v1/config/database`__

This method tells gatewayd which Postgres database to use. 

Request Body:

```
{
      "database_url": "postgres://postgres:password@localhost:5432/ripple_gateway"
}
```

*Caution:* This method contains sensitive database credentials. Do not use it on unsafe channels!

### Retrieve Database URL ###
__`GET /v1/config/database`__

This method shows the URL that gatewayd uses to access the Postgres database.

Response Body:

```
{
    "DATABASE_URL": "postgres://postgres:password@localhost:5432/ripple_gateway"
}
```

*Caution:* This method contains sensitive database credentials. Do not use it on unsafe channels!

### Set Ripple-REST URL ###
__`POST /v1/config/ripple/rest`__

This method tells gatewayd what Ripple-REST server to use in order to access 
the Ripple Network.

Request Body: <span class='draft-comment'>(Mock example, need confirmation)</span>

```
{
    "url": "https://localhost:5990"
}
```

Response Body:

<span class='draft-comment'>(Example needed)</span>

### Retrieve Ripple-REST URL ###
__`GET /v1/config/ripple/rest`__

This method shows the URL that gatewayd is configured to use for accessing Ripple-REST.

Response Body:

```
    {
      "RIPPLE_REST_API": "http://localhost:5990/"
    }
```

### Set Gateway Domain ###
__`POST /v1/config/domain`__

This method sets the domain that gatewayd uses to identify itself. This domain
is included in the gateway's ripple.txt.

Request Body:

```
    {
      "domain": "stevenzeiler.com"
    }
```

Response Body:

```
    {
      "DOMAIN": "stevenzeiler.com"
    }
```

### Retrieve Domain ###
__`GET /v1/config/domain`__

Show the domain of the gateway, which is shown in the gateway's ripple.txt.

Response Body:

```
    {
      "DOMAIN": "stroopgate.com"
    }
```

### Set API Key ###
__`POST /v1/config/key`__

This method reset's the gateway's API key; it generates, saves, and returns a 
new key.

Request Body:

```
{
  "key": "1234578dddd"
}
```

Response Body:

```
{
  "KEY": "1234578dddd"
}
```

### Retrieve API Key ###
__`GET /v1/config/key`__

This method shows the gateway API key currently in use.

Response Body:

```
{
  "KEY": "ebdb883d5723a71c59fb8ecefbb65476a6923f2a69b49b53cffe212c817cab92"
}
```

### List Supported Currencies ###
__`GET /v1/currencies`__

This method lists currencies officially supported by the gateway. These currencies are also listed
in the gateway's `ripple.txt` manifest file.

Response Body:

```
{
  "CURRENCIES": {
    "SWD": 0
  }
}
```

### Add Supported Currency ###
__`POST /v1/currencies`__

This method adds a currency to the gateway's list of supported currencies, which is shown in the 
gateway's `ripple.txt` manifest file.

Request Body:

```
{
  "currency": "XAG"
}
```

Response Body:

```
{
  "CURRENCIES": {
    "USD": 0,
    "XAG": 0,
    "XAU": 0
  }
}
```

### Remove Supported Currency ###
__`DELETE /v1/currencies/{:currency}`__

This method removes a currency (defined by the URL) from the list of supported currencies.

Response Body:

```
{
    "CURRENCIES": {
        "USD": 0,
        "XAU": 0
    }
}
```

## Managing Gateway Processes ##

### Start Worker Processes ###
__`POST /v1/start`__

Start one or more gateway processes, including but not limited to "deposits", "outgoing",
"incoming", "withdrawals", "callbacks", etc.

### List Current Processes ###
__`GET /v1/processes`__

List information about the currently-running gateway daemon processes.

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

