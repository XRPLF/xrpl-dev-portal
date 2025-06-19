---
seo:
  description: Mint an NFT on the XRP Ledger using the ecourty/xrpl-php library. 
---

# Mint an NFT

Minting an NFT on the XRP Ledger is an easy process.  
You need to craft your transaction payload with care to avoid any errors:
- Define the flags according to the NFT type you want to mint. [Documentation reference](/docs/references/protocol/transactions/types/nftokenmint#nftokenmint-flags)
- Define the "content" or your NFT in the `URI` field, this is usually an IPFS link to the NFT metadata.
- Craft the transaction!

_Here is the [list of all the available fields on the `NFTokenMint` transaction](/docs/references/protocol/transactions/types/nftokenmint.md)_

<br />

Here is a tutorial on how to mint a simple NFT on the testnet, using a random wallet.
```php
<?php

use XRPL\Client\XRPLClient;
use XRPL\Service\Faucet;
use XRPL\ValueObject\Wallet;

$wallet = Wallet::generate();
Faucet::addFunds($wallet);

echo 'Wallet generated and funded!' . \PHP_EOL;

$client = new XRPLClient('https://s.altnet.rippletest.net:51234');

$transactionData = [
    'TransactionType' => 'NFTokenMint',
    'Account' => $wallet->getAddress(),
    'URI' => '11223344', // Can be virtually anything (Needs to be a hex-encoded)
    'Flags' => 8, // Makes the NFT transferable
    'TransferFee' => 1000, // Fee for transferring the NFT
    'NFTokenTaxon' => 0, // Allows for grouping of NFTs (e.g. by collection, use the same taxon for NFTs of the same collection)
];

$transactionResult = $client->submitSingleSignTransaction($transactionData, $wallet);

echo 'NFT minted!' . \PHP_EOL;
```

Easy, right?  
You can then retrieve the transaction hash from the `$transactionResult` object to track the transaction on the XRP Ledger.

More examples can be found in the [ecourty/xrpl-php GitHub repository](https://github.com/EdouardCourty/xrpl-php)
