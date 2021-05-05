// Construct a network client
HttpUrl rippledUrl = HttpUrl
  .get("https://s.altnet.rippletest.net:51234/");
XrplClient xrplClient = new XrplClient(rippledUrl);

// Create a Wallet using a WalletFactory
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
Wallet testWallet = walletFactory.randomWallet(true).wallet();

// Get the Classic and X-Addresses from testWallet
Address classicAddress = testWallet.classicAddress();
XAddress xAddress = testWallet.xAddress();
System.out.println("Classic Address: " + classicAddress);
System.out.println("X-Address: " + xAddress);

// Fund the account using the testnet Faucet
FaucetClient faucetClient = FaucetClient
  .construct(HttpUrl.get("https://faucet.altnet.rippletest.net"));
faucetClient.fundAccount(FundAccountRequest.of(classicAddress));

// Look up your Account Info
AccountInfoRequestParams requestParams =
  AccountInfoRequestParams.of(classicAddress);
AccountInfoResult accountInfoResult =
  xrplClient.accountInfo(requestParams);

// Print the result
System.out.println(accountInfoResult);
