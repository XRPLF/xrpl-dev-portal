<?php

// Use the Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Imports
use XRPL_PHP\Client\JsonRpcClient;
use XRPL_PHP\Models\Account\AccountInfoRequest;
use XRPL_PHP\Wallet\Wallet;
use function XRPL_PHP\Sugar\fundWallet;
use function XRPL_PHP\Sugar\xrpToDrops;

// Example credentials
$wallet = Wallet::fromSeed("sEd7zwWAu7vXMCBkkzokJHEXiKw2B2s");
print_r('Wallet Address: ' . $wallet->getAddress() .PHP_EOL); // rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH

// Create a client using the Testnet
$client = new JsonRpcClient("https://s.altnet.rippletest.net:51234");

// Transaction definition
$paymentTx = [
    "TransactionType" => "Payment",
    "Account" => $wallet->getAddress(),
    "Amount" => xrpToDrops('50'),
    "Destination" => "rfmMDuKPsXUgpkCvJeS132wtfXWujjHqiW",
    "DestinationTag" => 12345
];

// Autofill mandatory values like Sequence, Fee and LastLedgerSequence
$preparedTx = $client->autofill($paymentTx);
print_r("Prepared tx: " . PHP_EOL);
print_r($preparedTx);

// Sign prepared transaction
$signedTx = $wallet->sign($preparedTx);
print_r("Identifying hash: " . $signedTx['hash'] . PHP_EOL);
print_r("Signed blob: " . $signedTx['tx_blob'] . PHP_EOL);

 // Submit signed blob and wait for validation
$txResponse = $client->submitAndWait($signedTx['tx_blob']);

// Wait for validation
// submitAndWait() handles this automatically, but it can take 4-7s.

// Check transaction results
$result = $txResponse->getResult();
print_r("Transaction result:" . $result['meta']['TransactionResult'] . PHP_EOL);

print_r("You can check wallets/accounts and transactions on https://test.bithomp.com"  . PHP_EOL . PHP_EOL);
