---
seo:
  description: 'Build PHP-based applications on the XRP Ledger with the ecourty/xrpl-php library.'
---

# ecourty/xrpl-php
This library is a lightweight XRPL Client.

It allows you to interact with the XRP Ledger by creating, signing, and submitting transactions, as well as querying an XRP Ledger node.

### Installation

Install `xrpl-php` using Composer:

```bash
composer require ecourty/xrpl-php
```

### Get Started

To query the XRP Ledger, all you need is a Node's JSON-RPC URL (there are official public nodes):
- `https://s1.ripple.com:51234` (Mainnet)
- `https://s.altnet.rippletest.net:51234` (Testnet)
- `https://s.devnet.rippletest.net:51234` (Devnet)

<br/>

_Read more about [Public Servers](/docs/tutorials/public-servers.md)._

<br />

```php
<?php

use XRPL\Client\XRPLClient;

$client = new XRPLClient('https://s1.ripple.com:51234');

$lastLedger = $client->ledger->getLedger(); // Will return the latest ledger data
$ledger = $client->ledger->getLedger(ledgerIndex: '93676329'); // Will return the ledger data for the ledger number 93676329

// There are many other methods available!
```

<br />

Every data model available in the XRP Ledger response are **represented by objects (PHP classes)** in the `ecourty/xrpl-php` library. <br />  
For example, a `LedgerResult` object is returned when querying a ledger.
It contains:
```bash
object(XRPL\Model\Ledger\LedgerResult)#258 (6) {
  ["status"]=>
  string(7) "success"
  ["ledgerHash"]=>
  string(64) "98B73707CD08C3618F7EDA2DBD73E45D45496550C5FB033CFF8CB732E0DDE07D"
  ["ledgerIndex"]=>
  int(4245419)
  ["validated"]=>
  bool(true)
  ["ledger"]=>
  object(XRPL\Model\Ledger\Nested\Ledger)#297 (14) {
    ["accountHash"]=>
    string(64) "17FAEEE0FC3E8C979FB9B5AB874FC7409060BC37E54CEEA3A15AD96ADD8AA84A"
    ["closeFlags"]=>
    int(0)
    ["closeTime"]=>
    int(791045302)
    ["closeTimeHuman"]=>
    string(34) "2025-Jan-24 14:48:22.000000000 UTC"
    ["closeTimeResolution"]=>
    int(10)
    ["closeTimeIso"]=>
    string(20) "2025-01-24T14:48:22Z"
    ["ledgerHash"]=>
    string(64) "98B73707CD08C3618F7EDA2DBD73E45D45496550C5FB033CFF8CB732E0DDE07D"
    ["parentLedgerTime"]=>
    uninitialized(int)
    ["parentHash"]=>
    string(64) "EDC7B83D8B0642DE2B3B3EFB84E4FA5C37C2D3B4A001198BA28E98AC82E80E49"
    ["totalCoins"]=>
    string(17) "99999988942807397"
    ["transactionHash"]=>
    string(64) "3E6E32114E12E5FB7DB301F82975845A69039C3D98334DEB9EE3B51BA3EBE571"
    ["ledgerIndex"]=>
    string(7) "4245419"
    ["closed"]=>
    bool(true)
    ["transactionIds"]=>
    array(0) { # Will be filled if the parameter transactions=true is passed to ::getLedger
    }
    ["transactions"]=> # Will be filled if the parameters transactions=true and expand=true are passed to ::getLedger
    array(0) {
    }
  }
  ["queueData"]=>
  array(0) {
  }
}
```