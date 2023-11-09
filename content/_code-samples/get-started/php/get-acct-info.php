<?php

// Use the Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Imports
use XRPL_PHP\Client\JsonRpcClient;
use XRPL_PHP\Models\Account\AccountInfoRequest;
use XRPL_PHP\Wallet\Wallet;
use function XRPL_PHP\Sugar\fundWallet;

// Create a client using the Testnet
$client = new JsonRpcClient("https://s.altnet.rippletest.net:51234");

// Create a new wallet
$wallet = Wallet::generate();

// Fund (and activate) the wallet
fundWallet($client, $wallet);

$accountInfoRequest = new AccountInfoRequest(
    account: $wallet->getAddress(),
    ledgerIndex: 'validated'
 );

$accountInfoResponse = $client->syncRequest(($accountInfoRequest));

print_r($accountInfoResponse);
