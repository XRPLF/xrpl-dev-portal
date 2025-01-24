# Import a wallet

Importing an existing wallet is a common operation when building applications that interact with the XRP Ledger.

All you need is your wallet seed. It should look like this:
- **ED25519**: `sEdSgVhT1uGZErffGfLHX61ZkjAtPg2` (31 long)
- **SECP256K1**: `ssPjp8iEJug1fFzksyMTQcJKe944V` (29 long)

Then, simply import your wallet using either the `Wallet::generateFromSeed` facade method, or the `WalletGenerator::generateFromSeed` method.

```php
<?php

use XRPL\Service\Wallet\WalletGenerator;
use XRPL\ValueObject\Wallet;

$seed = 'sEdSgVhT1uGZErffGfLHX61ZkjAtPg2';

// 1. Using the Wallet class
$importedWallet = Wallet::generateFromSeed($seed);

// 2. Using the WalletGenerator class
$importedWallet = WalletGenerator::generateFromSeed($seed);
```
