---
seo:
  description: Fund a test wallet on the XRP Ledger using the ecourty/xrpl-php library.
---

# Fund a test wallet

Funding a test wallet is a simple process.  
You can use the XRPL PHP library to generate a new wallet and request funds from the XRP Testnet Faucet.

```php
<?php

use XRPL\Enum\Network;
use XRPL\Service\Faucet;
use XRPL\ValueObject\Wallet;

$wallet = Wallet::generate(); // Or Wallet::generateFromSeed('...');
Faucet::addFunds($wallet); // Will add 100 XRP to the Account associated to this wallet

// By default, the Faucet class will fund the wallet on the testnet.
// If you want to fund the wallet on the devnet, you can pass a second argument to the ::addFunds method:
Faucet::addFunds($wallet, Network::DEVNET);

// The Wallet::fundWallet facade method can also be used
$wallet = Wallet::generate();
$wallet->addFunds();
```

{% admonition type="warning" name="Rate limiting" %}
Sending too many requests will trigger the Faucet's rate limit.  
Re-import an already funded wallet instead of creating a new random one every time you run your test scripts.
{% /admonition %}

The funded wallets can then be used to submit transactions to the XRP Ledger.
