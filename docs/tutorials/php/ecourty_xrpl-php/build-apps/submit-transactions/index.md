# Submit Transactions

Submitting transactions to the XRP Ledger using the `ecourty/xrpl-php` library is a straightforward process.  

This tutorial will guide you through the steps to create, sign, and submit a transaction to the XRP Ledger.  
All you need is a `Wallet` instance, or your own Wallet class implementing `WalletInterface`.

{% admonition type="info" name="Mandatory Transaction Fields" %}
Every transaction need to contain a `TransactionType` field, which defines the type of transaction you want to submit.  
Refer to the [Transaction Types documentation](/docs/references/protocol/transactions/types/index.md) for more information.
{% /admonition %}

```php
<?php

use XRPL\Client\XRPLClient;
use XRPL\ValueObject\Wallet;

$wallet = Wallet::generateFromSeed('...'); // Replace '...' with your seed

$transactionPayload = [
    'TransactionType' => 'Payment',
    'Account' => $wallet->getAddress(),
    'Destination' => 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
    'Amount' => '1000000',
];

$client = new XRPLClient('https://s.altnet.rippletest.net:51234');

$result = $client->submitSingleSignTransaction($transactionPayload, $wallet);
```

Every field will then be converted into its own [Internal Format](/docs/references/protocol/binary-format.md#internal-format) before being submitted to the XRP Ledger Node.
