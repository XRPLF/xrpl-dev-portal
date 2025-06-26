# Create a wallet

Creating an XRP Wallet is the base operation when building applications that interact with the XRP Ledger.

If you want to import a wallet from an existing seed, refer to the [Import a Wallet](./import-a-wallet.md) tutorial.

Wallets can be generated using two different algorithms:
- ED25519
- SECP256K1

The XRPL-PHP library supports both algorithms. By default, the `ED25519` algorithm is used.

_If you're interested in discovering how the generation workflows work, refer to the [ED25519 Key Derivation](/docs/concepts/accounts/cryptographic-keys.md#ed25519-key-derivation) or [SECP256K1 Key Dreivation](/docs/concepts/accounts/cryptographic-keys.md#secp256k1-key-derivation) documentation page_.
  
<br />

```php
<?php

use XRPL\Enum\Algorithm;
use XRPL\ValueObject\Wallet;

$ed25519Wallet = Wallet::generate(Algorithm::ED25519);
$secp256k1Wallet = Wallet::generate(Algorithm::SECP256K1);

// Using Wallet::generate(); will use the ED25519 algorithm by default.
```
