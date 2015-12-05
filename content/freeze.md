Freeze Features
===============

The Ripple Consensus Ledger gives accounts the ability to freeze non-XRP balances, which can be useful to comply with regulatory requirements, or while investigating suspicious activity. There are three settings related to freezes:

* [**Individual Freeze**](#individual-freeze) - Freeze one counterparty.
* [**Global Freeze**](#global-freeze) - Freeze all counterparties.
* [**No Freeze**](#no-freeze) - Permanently give up the ability to freeze individual counterparties. Also gives up the ability to end a global freeze.

Because no party has a privileged place in the Ripple Consensus Ledger, the freeze feature cannot prevent a counterparty from conducting transactions in XRP or funds issued by other counterparties.


Individual Freeze
-----------------

The Individual Freeze feature is a setting on a trust line. When an issuing account enables the Individual Freeze setting, the counterparty of that trust line can no longer send or receive issuances on the frozen trust line, except in transactions that go directly to and from the issuing account itself. 

A gateway can freeze a counterparty if that counterparty shows suspicious activity or violates the gateway's terms of use.

If the counterparty has trust lines to the issuing account in more than one currency, the issuing account must freeze each trust line individually.

An account cannot enable the Individual Freeze setting if it has previously enabled the [No Freeze](#no-freeze) setting.


Global Freeze
-------------

The Global Freeze feature is a setting on an account. When an issuing account enables the Global Freeze feature, all counterparties can only send and receive the issuing account's funds directly to and from the issuing account itself. (This includes any [hot wallet](gateway_guide.html#hot-and-cold-wallets) accounts.)

It can be useful to enable Global Freeze on a gateway's [cold wallet](gateway_guide.html#hot-and-cold-wallets) if a hot wallet is compromised, or immediately after regaining control of a compromised issuing account. This stops the flow of funds, preventing attackers from getting away with any more money or at least making it easier to track what happened.

It can also be useful to enable Global Freeze if a gateway intends to migrate its cold wallet to a new Ripple account, or if the gateway intends to cease doing business. This locks the funds at a specific point in time, so users cannot trade them away for other currencies.

An account can always enable the Global Freeze setting. However, if the account has previously enabled the [No Freeze](#no-freeze) setting, it can never _disable_ the Global Freeze.


No Freeze
---------

The **NoFreeze** feature is a setting on an account that permanently gives up the ability to freeze counterparties. A business can use this feature to treat its issued funds as "more like physical money" in that the business cannot interfere with customers trading it among themselves. The NoFreeze setting has two effects:

* The issuing account can no longer use **tfSetFreeze** to freeze an individual counterparty.
* The issuing account can still enable **asfGlobalFreeze** to enact a global freeze, but the account cannot _disable_ **asfGlobalFreeze** to end the global freeze.

The Ripple Consensus Ledger cannot force a gateway to honor the obligations that its issued funds represent, so giving up the ability to enable a Global Freeze cannot protect customers. However, giving up the ability to _disable_ a Global Freeze ensures that the Global Freeze feature is not used unfairly against some customers.


# Technical Details #

## Enabling or Disabling Individual Freeze ##

### Using `rippled` ###

To enable or disable Individual Freeze on a specific trust line, send a `TrustSet` transaction. Use the [`tfSetFreeze` flag](transactions.html#trustset-flags) to enable a freeze, and the `tfClearFreeze` flag to disable it. The fields of the transaction should be as follows:

| Field                | Value  | Description |
|----------------------|--------|-------------|
| Account              | String | The address of your Ripple account. |
| TransactionType      | String | `TrustSet` |
| LimitAmount          | Object | Object defining the trust line to freeze. |
| LimitAmount.currency | String | Currency of the trust line |
| LimitAmount.issuer   | String | The Ripple address of the counterparty to freeze |
| LimitAmount.value    | String | The amount of currency you trust this counterparty to issue to you, as a quoted number. From the perspective of a gateway, this is typically `"0"`. |
| Flags                | Number | To enable a freeze, use a value with the bit `0x00100000` (tfSetFreeze) enabled. To disable a freeze, use a value with the bit `0x00200000` (tfClearFreeze) enabled instead. |

Set the `Fee`, `Sequence`, and `LastLedgerSequence` parameters [in the typical way](transactions.html#signing-and-sending-transactions).

Example of submitting a TrustSet transaction to enable an individual freeze:

```
TODO
```


### Using RippleAPI ###

To enable or disable Individual Freeze on a specific trust line, prepare a *Trustline* transaction using the [prepareTrustline](rippleapi.html#preparetrustline) method. The fields of the `trustline` parameter should be set as follows:

| Field        | Value  | Description |
|--------------|--------|-------------|
| currency     | String | The [currency](rippleapi.html#currency) of the trust line to freeze |
| counterparty | String | The [Ripple address](rippleapi.html#ripple-address) of the counterparty |
| limit        | String | The amount of currency you trust this counterparty to issue to you, as a quoted number. From the perspective of a gateway, this is typically `"0"`. |
| frozen       | Boolean | `true` to enable Individual Freeze on this trust line. `false` to disable Individual Freeze. |

The rest of the [transaction flow](rippleapi.html#transaction-flow) is the same as any other transaction.

Example code to enable Individual Freeze on a trust line:

```
TODO
```


## Enabling or Disabling Global Freeze ##

### Using `rippled` ###

To enable Global Freeze on an account, send an `AccountSet` transaction with the [asfGlobalFreeze flag value](transactions.html#accountset-flags) in the `SetFlag` field. To disable Global Freeze, put the asfGlobalFreeze flag value in the `ClearFlag` field instead.

Example of submitting an AccountSet transaction to enable Global Freeze:

```
TODO
```

### Using RippleAPI ###

To enable or disable Global Freeze on an account, prepare a **Settings** transaction using the [prepareSettings](rippleapi.html#preparesettings) method. The `settings` parameter should be an object set as follows:

| Field        | Value  | Description |
|--------------|--------|-------------|
| globalFreeze | Boolean | `true` to enable a Global Freeze on this account. `false` to disable Global Freeze. |

The rest of the [transaction flow](rippleapi.html#transaction-flow) is the same as any other transaction.

Example code to enable Global Freeze on an account:

```
TODO
```



## Enabling No Freeze ##

### Using `rippled` ###

To enable No Freeze on an account, send an `AccountSet` transaction with the [asfNoFreeze flag value](transactions.html#accountset-flags) in the `SetFlag` field. You must sign this transaction using the master key. Once enabled, you cannot disable No Freeze.

Example of submitting an AccountSet transaction to enable No Freeze:

```
TODO
```

### Using RippleAPI ###


To enable No Freeze on an account, prepare a **Settings** transaction using the [prepareSettings](rippleapi.html#preparesettings) method. Once enabled, you cannot disable No Freeze. The `settings` parameter should be an object set as follows:

| Field    | Value   | Description |
|----------|---------|-------------|
| noFreeze | Boolean | `true`      |

You must [sign](rippleapi.html#sign) this transaction using the master key. The rest of the [transaction flow](rippleapi.html#transaction-flow) is the same as any other transaction.

Example code to enable No Freeze on an account:

```
TODO
```


## Checking for Individual Freeze ##

### Using `rippled` ###

To see if a trust line has an Individual Freeze enabled, use the [`account_lines` method](rippled-apis.html#account-lines) with the following parameters:

| Field    | Value   | Description |
|----------|---------|-------------|
| account  | String  | The Ripple address of the issuing account |
| peer     | String  | The Ripple address of the counterparty account |
| ledger\_index | String | Use `validated` to get the most recently validated information. |

The response contains an array of trust lines, for each currency in which the issuing account and the counterparty are linked. Look for the following fields in each trust line object:

| Field        | Value   | Description |
|--------------|---------|-------------|
| freeze       | Boolean | (May be omitted) `true` if the issuing account has [frozen](freeze.html) this trust line. If omitted, that is the same as `false`. |
| freeze\_peer | (May be omitted) `true` if the counterparty has [frozen](freeze.html) this trust line. If omitted, that is the same as `false`. |


### Using RippleAPI ###

To see if a trust line has an Individual Freeze enabled, use the [`getTrustlines` method](rippleapi.html#gettrustlines) with the following parameters:

| Field         | Value   | Description |
|---------------|---------|-------------|
| address       | String  | The Ripple address of the issuing account |
| options.counterparty  | String  | The Ripple address of the counterparty account |

The response contains an array of trust lines, for each currency in which the issuing account and the counterparty are linked. Look for the following fields in each trust line object:

| Field                | Value   | Description |
|----------------------|---------|-------------|
| specification.frozen | Boolean | (May be omitted) `true` if the issuing account has frozen the trust line. |
| counterparty.frozen  | Boolean | (May be omitted) `true` if the counterparty has frozen the trust line. |


## Checking for Global Freeze and No Freeze ##

### Using `rippled` ###

To see if an account has Global Freeze and/or No Freeze enabled, use the [`account_info` method](rippled-apis.html#account-lines) with the following parameters:

| Field    | Value   | Description |
|----------|---------|-------------|
| account  | String  | The Ripple address of the issuing account |
| ledger\_index | String | Use `validated` to get the most recently validated information. |

Check the value of the `account_data.Flags` field of the response using the [bitwise-AND](https://en.wikipedia.org/wiki/Bitwise_operation#AND) operator:

* If `Flags` AND `0x00400000` ([lsfGlobalFreeze](ripple-ledger.html#accountroot-flags)) is _nonzero_: Global Freeze is enabled.
* If `Flags` AND `0x00200000` ([lsfNoFreeze](ripple-ledger.html#accountroot-flags)) is _nonzero_: No Freeze is enabled.

Example request:

```
TODO
```

Example response:

```
TODO
```

### Using RippleAPI ###

To see if an account has Global Freeze and/or No Freeze enabled, use the [`getSettings` method](rippleapi.html#getsettings) with the following parameters:

| Field         | Value   | Description |
|---------------|---------|-------------|
| address       | String  | The Ripple address of the issuing account |

Look for the following values in the response object:

| Field         | Value   | Description |
|---------------|---------|-------------|
| noFreeze      | Boolean | (May be omitted) `true` if No Freeze is enabled. |
| globalFreeze  | Boolean | (May be omitted) `true` if Global Freeze is enabled. |

Example code:

```
TODO
```

# See Also #

[Gateway Bulletin GB-2014-02 New Feature: Balance Freeze](https://ripple.com/files/GB-2014-02.pdf)
