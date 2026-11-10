<?php
// @chunk {"steps": ["import-tag"]}
// Use the Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Imports
use Hardcastle\XRPL_PHP\Client\Faucet;
use Hardcastle\XRPL_PHP\Client\JsonRpcClient;
use Hardcastle\XRPL_PHP\Models\Account\AccountInfoRequest;
use Hardcastle\XRPL_PHP\Wallet\Wallet;
// @chunk-end

// @chunk {"steps": ["connect-tag", "connect-mainnet-tag"]}
// Define the network client
$client = new JsonRpcClient("https://s.altnet.rippletest.net:51234");
// @chunk-end

// @chunk {"steps": ["get-account-create-wallet-tag"]}
// Create a wallet and fund it with the Testnet faucet:
echo "Creating a new wallet and funding it with Testnet XRP...\n";
$wallet = Wallet::generate();
$faucet = new Faucet($client);
$faucet->fundWallet($wallet);
echo "Wallet: " . $wallet->getAddress() . "\n";
echo "Account Testnet Explorer URL:\n";
echo "  https://testnet.xrpl.org/accounts/" . $wallet->getAddress() . "\n";
// @chunk-end

// To provide your own seed, replace the $wallet value with the below
// @chunk {"steps": ["get-account-create-wallet-c-tag"]}
// $wallet = Wallet::fromSeed("your-seed-key");
// @chunk-end

// @chunk {"steps": ["query-xrpl-tag"]}
// Get info from the ledger about the address we just funded
echo "\nGetting account info...\n";
$accountInfoRequest = new AccountInfoRequest(
    account: $wallet->getAddress(),
    ledgerIndex: 'validated'
);
$accountInfoResponse = $client->syncRequest($accountInfoRequest);
echo json_encode($accountInfoResponse->getResult(), JSON_PRETTY_PRINT) . "\n";
// @chunk-end
