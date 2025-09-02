---
seo:
  description: Send a payment on the XRP Ledger using the ecourty/xrpl-php library.
---

# Send a Payment

Payment are the most executed transactions on the XRP Ledger!  
All you need is a funded Wallet and a destination address.

<br />

```php
<?php

use XRPL\Client\XRPLClient;
use XRPL\ValueObject\Wallet;

$wallet = Wallet::generate();
Faucet::addFunds($wallet);

$client = new XRPLClient('https://s.altnet.rippletest.net:51234'); // Public Testnet Ripple Node

$transactionData = [
    'TransactionType' => 'Payment',
    'Account' => $wallet->getAddress(),
    'Destination' => $receiverWallet->getAddress(),
    'Amount' => XRPConverter::xrpToDrops(25), // 25 XRP
];

$client->submitSingleSignTransaction($transactionData, $originWallet);
```

You can then retrieve the transaction hash from the `$transactionResult` object to track the transaction on the XRP Ledger.

More examples can be found in the [ecourty/xrpl-php GitHub repository](https://github.com/EdouardCourty/xrpl-php)
