# Freezing Issued Currencies

XRP is not an issued currency. XRP is the only native asset on the XRP Ledger and is required in order to conduct transactions on the XRP Ledger. XRP is counterparty free, meaning that when someone holds XRP, they are not holding a liability, they are holding the actual currency, XRP. Due to this fact, _**<u>XRP CANNOT be frozen by any entity or individual</u>**_.

All non-XRP currencies can be represented in the XRP Ledger as issued currencies. These issued currencies (sometimes called "issuances" or "IOUs") are tracked in accounting relationships, called "trust lines," between addresses. Issued currencies are typically considered as liabilities from one perspective and assets from the other, so the balance of a trust line is negative or positive depending on which side you view it from. Any address may freely issue (non-XRP) currencies, limited only by how much other addresses are willing to hold.

In certain cases, to meet regulatory requirements, or while investigating suspicious activity, an exchange or gateway may want to quickly freeze non-XRP issued currency balances.

**Tip:** No one can freeze XRP.

There are three settings related to freezes:

* [**Individual Freeze**](#individual-freeze) - Freeze one counterparty.
* [**Global Freeze**](#global-freeze) - Freeze all counterparties.
* [**No Freeze**](#no-freeze) - Permanently give up the ability to freeze individual counterparties, as well as the ability to end a global freeze.

The freeze feature only applies to issued currencies. Because no party has a privileged place in the XRP Ledger, the freeze feature cannot prevent a counterparty from conducting transactions in XRP or funds issued by other counterparties. No one, not even Ripple, can freeze XRP.

All freeze settings can be enacted regardless of whether the balance(s) to be frozen are positive or negative. Either the currency issuer or the currency holder can freeze a trust line; however, the effect of a currency holder freezing an issuer is minimal.


## Individual Freeze

The **Individual Freeze** feature is a setting on a [trust line](trust-lines-and-issuing.html). When an issuing address enables the Individual Freeze setting, the following rules apply to the currency of that trust line:

* Payments can still occur directly between the two parties of the frozen trust line.
* The counterparty of that trust line can no longer decrease its balance on the frozen trust line, except in direct payments to the issuer. The counterparty can only send the frozen issuances directly to the issuer.
* The counterparty can still receive payments from others on the frozen trust line.
* The counterparty's offers to sell the currency issued on the frozen trust line are [considered unfunded](offers.html#lifecycle-of-an-offer).

Reminder: Trust lines do not hold XRP. XRP cannot be frozen.

A financial institution can freeze the trust line linking it to a counterparty if that counterparty shows suspicious activity or violates the financial institution's terms of use. The financial institution should also freeze the counterparty in any other systems the financial institution operates that are connected to the XRP Ledger. (Otherwise, an address might still be able to engage in undesired activity by sending payments through the financial institution.)

An individual address can freeze its trust line to a financial institution. This has no effect on transactions between the institution and other users. It does, however, prevent other addresses, including [operational addresses](issuing-and-operational-addresses.html), from sending that financial institution's issuances to the individual address. This type of individual freeze has no effect on offers.

The Individual Freeze applies to a single currency only. To freeze multiple currencies with a particular counterparty, the address must enable Individual Freeze on the trust lines for each currency individually.

An address cannot enable the Individual Freeze setting if it has enabled the [No Freeze](#no-freeze) setting.


## Global Freeze

The **Global Freeze** feature is a setting on an address. When an issuing address enables the Global Freeze feature, the following rules apply to all currencies they issue:

* All counterparties of the frozen issuing address can no longer decrease the balances in their trust lines to the frozen address, except in direct payments to the issuer. (This also affects any [operational addresses](issuing-and-operational-addresses.html).)
* Counterparties of the frozen issuing address can still send and receive payments directly to and from the issuing address.
* All offers to sell currencies issued by the frozen address are [considered unfunded](offers.html#lifecycle-of-an-offer).

Reminder: addresses cannot issue XRP. Global freezes do not apply to XRP.

It can be useful to enable Global Freeze on a financial institution's [issuing address](issuing-and-operational-addresses.html) if the secret key to an operational address is compromised, even after regaining control of a such an address. This stops the flow of funds, preventing attackers from getting away with any more money or at least making it easier to track what happened. Besides enacting a Global Freeze in the XRP Ledger, a financial institution should also suspend activities in its connectors to outside systems.

It can also be useful to enable Global Freeze if a financial institution intends to migrate to a new [issuing address](issuing-and-operational-addresses.html), or if the financial institution intends to cease doing business. This locks the funds at a specific point in time, so users cannot trade them away for other currencies.

Global Freeze applies to _all_ currencies issued and held by the address. You cannot enable Global Freeze for only one currency. If you want to have the ability to freeze some currencies and not others, you should use different addresses for each currency.

An address can always enable the Global Freeze setting. However, if the address has enabled the [No Freeze](#no-freeze) setting, it can never _disable_ Global Freeze.


## No Freeze

The **No Freeze** feature is a setting on an address that permanently gives up the ability to freeze counterparties' issued currencies. A business can use this feature to treat its issued funds as "more like physical money" in the sense that the business cannot interfere with customers trading it among themselves.

Reminder: XRP already cannot be frozen. The No Freeze feature only applies to other currencies issued in the XRP Ledger.

The NoFreeze setting has two effects:

* The issuing address can no longer enable Individual Freeze on trust lines to any counterparty.
* The issuing address can still enable Global Freeze to enact a global freeze, but the address cannot _disable_ Global Freeze.

The XRP Ledger cannot force a financial institution to honor the obligations that its issued funds represent, so giving up the ability to enable a Global Freeze cannot protect customers. However, giving up the ability to _disable_ a Global Freeze ensures that the Global Freeze feature is not used unfairly against some customers.

The No Freeze setting applies to all currencies issued to and from an address. If you want to be able to freeze some currencies but not others, you should use different addresses for each currency.

You can only enable the No Freeze setting with a transaction signed by your address's master key secret. You cannot use a [Regular Key](setregularkey.html) or a [multi-signed transaction](multi-signing.html) to enable No Freeze.


# Technical Details

## Enabling or Disabling Individual Freeze

### Using `rippled`

To enable or disable Individual Freeze on a specific trust line, send a `TrustSet` transaction. Use the [`tfSetFreeze` flag](trustset.html#trustset-flags) to enable a freeze, and the `tfClearFreeze` flag to disable it. The fields of the transaction should be as follows:

| Field                | Value  | Description |
|----------------------|--------|-------------|
| Account              | String | The XRP Ledger address to enable or disable the freeze. |
| TransactionType      | String | `TrustSet` |
| LimitAmount          | Object | Object defining the trust line to freeze. |
| LimitAmount.currency | String | Currency of the trust line (cannot be XRP) |
| LimitAmount.issuer   | String | The XRP Ledger address of the counterparty to freeze |
| LimitAmount.value    | String | The amount of currency you trust this counterparty to issue to you, as a quoted number. From the perspective of a financial institution, this is typically `"0"`. |
| Flags                | Number | To enable a freeze, use a value with the bit `0x00100000` (tfSetFreeze) enabled. To disable a freeze, use a value with the bit `0x00200000` (tfClearFreeze) enabled instead. |

Set the `Fee`, `Sequence`, and `LastLedgerSequence` parameters [in the typical way](transaction-basics.html#signing-and-submitting-transactions).

Example of submitting a TrustSet transaction to enable an individual freeze using the [WebSocket API](get-started-with-the-rippled-api.html#websocket-api):

```
{
  "id": 12,
  "command": "submit",
  "tx_json": {
    "TransactionType": "TrustSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12000",
    "Flags": 1048576,
    "LastLedgerSequence": 18103014,
    "LimitAmount": {
      "currency": "USD",
      "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
      "value": "110"
    },
    "Sequence": 340
  },
  "secret": "s████████████████████████████",
  "offline": false,
  "fee_mult_max": 1000
}
```

**Caution:** Never send your secret key to an untrusted server or over an insecure channel.


### Using RippleAPI

To enable or disable Individual Freeze on a specific trust line, prepare a *Trustline* transaction using the [prepareTrustline](rippleapi-reference.html#preparetrustline) method. The fields of the `trustline` parameter should be set as follows:

| Field        | Value  | Description |
|--------------|--------|-------------|
| currency     | String | The [currency](rippleapi-reference.html#currency) of the trust line to freeze (cannot be XRP) |
| counterparty | String | The [XRP Ledger address](rippleapi-reference.html#address) of the counterparty |
| limit        | String | The amount of currency you trust this counterparty to issue to you, as a quoted number. From the perspective of a financial institution, this is typically `"0"`. |
| frozen       | Boolean | `true` to enable Individual Freeze on this trust line. `false` to disable Individual Freeze. |

The rest of the [transaction flow](rippleapi-reference.html#transaction-flow) is the same as any other transaction.

Example JavaScript (ECMAScript 6) code to enable Individual Freeze on a trust line:

```js
{% include '_code-samples/freeze/set-individual-freeze.js' %}
```


## Enabling or Disabling Global Freeze

### Using `rippled`

To enable Global Freeze on an address, send an `AccountSet` transaction with the [asfGlobalFreeze flag value](accountset.html#accountset-flags) in the `SetFlag` field. To disable Global Freeze, put the asfGlobalFreeze flag value in the `ClearFlag` field instead.

Example of submitting an AccountSet transaction to enable Global Freeze using the [WebSocket API](get-started-with-the-rippled-api.html#websocket-api):

```
{
  "id": 12,
  "command": "submit",
  "tx_json": {
    "TransactionType": "AccountSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12000",
    "Flags": 0,
    "SetFlag": 7,
    "LastLedgerSequence": 18122753,
    "Sequence": 349
  },
  "secret": "s████████████████████████████",
  "offline": false,
  "fee_mult_max": 1000
}
```

**Caution:** Never send your secret key to an untrusted server or over an insecure channel.


### Using RippleAPI

To enable or disable Global Freeze on an address, prepare a **Settings** transaction using the [prepareSettings](rippleapi-reference.html#preparesettings) method. The `settings` parameter should be an object set as follows:

| Field        | Value  | Description |
|--------------|--------|-------------|
| globalFreeze | Boolean | `true` to enable a Global Freeze on this address. `false` to disable Global Freeze. |

The rest of the [transaction flow](rippleapi-reference.html#transaction-flow) is the same as any other transaction.

Example JavaScript (ECMAScript 6) code to enable Global Freeze on an address:

```js
{% include '_code-samples/freeze/set-global-freeze.js' %}
```



## Enabling No Freeze

### Using `rippled`

To enable No Freeze on an address, send an `AccountSet` transaction with the [asfNoFreeze flag value](accountset.html#accountset-flags) in the `SetFlag` field. You must sign this transaction using the master key. Once enabled, you cannot disable No Freeze.

Example of submitting an AccountSet transaction to enable No Freeze using the [WebSocket API](get-started-with-the-rippled-api.html#websocket-api):

WebSocket request:

```
{
  "id": 12,
  "command": "submit",
  "tx_json": {
    "TransactionType": "AccountSet",
    "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
    "Fee": "12000",
    "Flags": 0,
    "SetFlag": 6,
    "LastLedgerSequence": 18124917,
    "Sequence": 4
  },
  "secret": "s████████████████████████████",
  "offline": false,
  "fee_mult_max": 1000
}
```

**Caution:** Never send your secret key to an untrusted server or over an insecure channel.

### Using RippleAPI

To enable No Freeze on an address, prepare a **Settings** transaction using the [prepareSettings](rippleapi-reference.html#preparesettings) method. Once enabled, you cannot disable No Freeze. The `settings` parameter should be an object set as follows:

| Field    | Value   | Description |
|----------|---------|-------------|
| noFreeze | Boolean | `true`      |

You must [sign](rippleapi-reference.html#sign) this transaction using the master key. The rest of the [transaction flow](rippleapi-reference.html#transaction-flow) is the same as any other transaction.

Example JavaScript (ECMAScript 6) code to enable No Freeze on an address:

```js
{% include '_code-samples/freeze/set-no-freeze.js' %}
```


## Checking for Individual Freeze

### Using `rippled`

To see if a trust line has an Individual Freeze enabled, use the [account_lines method][] with the following parameters:

| Field    | Value   | Description |
|----------|---------|-------------|
| account  | String  | The XRP Ledger address of the issuer |
| peer     | String  | The XRP Ledger address of the counterparty |
| ledger\_index | String | Use `validated` to get the most recently validated information. |

The response contains an array of trust lines, for each currency in which the issuing address and the counterparty are linked. Look for the following fields in each trust line object:

| Field        | Value   | Description |
|--------------|---------|-------------|
| freeze       | Boolean | (May be omitted) `true` if the issuing address has frozen this trust line. If omitted, that is the same as `false`. |
| freeze\_peer | Boolean | (May be omitted) `true` if the counterparty has frozen this trust line. If omitted, that is the same as `false`. |

Example WebSocket request to check for individual freeze:

```
{
  "id": 15,
  "command": "account_lines",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger": "validated",
  "peer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
}
```

Example WebSocket response:

```
{
  "id": 15,
  "status": "success",
  "type": "response",
  "result": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "lines": [
      {
        "account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
        "balance": "10",
        "currency": "USD",
        "freeze": true,
        "limit": "110",
        "limit_peer": "0",
        "peer_authorized": true,
        "quality_in": 0,
        "quality_out": 0
      }
    ]
  }
}
```

The field `"freeze": true` indicates that rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn has enabled Individual Freeze on the USD trust line to rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW. The lack of a field `"freeze_peer": true` indicates that the counterparty has _not_ frozen the trust line.


### Using RippleAPI

To see if a trust line has an Individual Freeze enabled, use the [`getTrustlines` method](rippleapi-reference.html#gettrustlines) with the following parameters:

| Field         | Value   | Description |
|---------------|---------|-------------|
| address       | String  | The XRP Ledger address of the issuer |
| options.counterparty  | String  | The XRP Ledger address of the counterparty |

The response contains an array of trust lines, for each currency in which the issuing address and the counterparty are linked. Look for the following fields in each trust line object:

| Field                | Value   | Description |
|----------------------|---------|-------------|
| specification.frozen | Boolean | (May be omitted) `true` if the issuing address has frozen the trust line. |
| counterparty.frozen  | Boolean | (May be omitted) `true` if the counterparty has frozen the trust line. |

Example JavaScript (ECMAScript 6) code to check whether a trust line is frozen:

```js
{% include '_code-samples/freeze/check-individual-freeze.js' %}
```


## Checking for Global Freeze and No Freeze

### Using `rippled`

To see if an address has enabled Global Freeze, No Freeze, or both, use the [account_info method][] with the following parameters:

| Field    | Value   | Description |
|----------|---------|-------------|
| account  | String  | The XRP Ledger address of the issuing address |
| ledger\_index | String | Use `validated` to get the most recently validated information. |

Check the value of the `account_data.Flags` field of the response using the [bitwise-AND](https://en.wikipedia.org/wiki/Bitwise_operation#AND) operator:

* If `Flags` AND `0x00400000` ([lsfGlobalFreeze](accountroot.html#accountroot-flags)) is _nonzero_: Global Freeze is enabled.
* If `Flags` AND `0x00200000` ([lsfNoFreeze](accountroot.html#accountroot-flags)) is _nonzero_: No Freeze is enabled.

Example WebSocket request:

```
{
  "id": 1,
  "command": "account_info",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}
```

WebSocket response:

```
{
  "id": 4,
  "status": "success",
  "type": "response",
  "result": {
    "account_data": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "41320138CA9837B34E82B3B3D6FB1E581D5DE2F0A67B3D62B5B8A8C9C8D970D0",
      "Balance": "100258663",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 12582912,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 4,
      "PreviousTxnID": "41320138CA9837B34E82B3B3D6FB1E581D5DE2F0A67B3D62B5B8A8C9C8D970D0",
      "PreviousTxnLgrSeq": 18123095,
      "Sequence": 352,
      "TransferRate": 1004999999,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
      "urlgravatar": "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
    },
    "ledger_hash": "A777B05A293A73E511669B8A4A45A298FF89AD9C9394430023008DB4A6E7FDD5",
    "ledger_index": 18123249,
    "validated": true
  }
}
```

In the above example, the `Flags` value is 12582912. This indicates that has the following flags enabled: lsfGlobalFreeze, lsfDefaultRipple, as demonstrated by the following JavaScript code:

```js
var lsfGlobalFreeze = 0x00400000;
var lsfNoFreeze = 0x00200000;

var currentFlags = 12582912;

console.log(currentFlags & lsfGlobalFreeze); //4194304
//therefore, Global Freeze is enabled

console.log(currentFlags & lsfNoFreeze); //0
//therefore, No Freeze is not enabled
```

### Using RippleAPI

To see if an address has enabled Global Freeze, No Freeze, or both, use the [`getSettings` method](rippleapi-reference.html#getsettings) with the following parameters:

| Field         | Value   | Description |
|---------------|---------|-------------|
| address       | String  | The XRP Ledger address of the issuing address |

Look for the following values in the response object:

| Field         | Value   | Description |
|---------------|---------|-------------|
| noFreeze      | Boolean | (May be omitted) `true` if No Freeze is enabled. |
| globalFreeze  | Boolean | (May be omitted) `true` if Global Freeze is enabled. |

Example JavaScript (ECMAScript 6) code to check whether an address has Global Freeze or No Freeze enabled:

```js
{% include '_code-samples/freeze/check-global-freeze-no-freeze.js' %}
```

# See Also

- [GB-2014-02 New Feature: Balance Freeze](https://ripple.com/files/GB-2014-02.pdf)
- [Freeze Code Samples](https://github.com/ripple/ripple-dev-portal/tree/master/content/_code-samples/freeze)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](accountroot.html#accountroot-flags)
    - [RippleState (trust line) Flags](ripplestate.html#ripplestate-flags)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
