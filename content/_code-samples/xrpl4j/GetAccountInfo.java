// Construct a network client
final HttpUrl rippledUrl = HttpUrl.get("https://s.altnet.rippletest.net:51234/");
XrplClient xrplClient = new XrplClient(rippledUrl);

// Create a Wallet using a WalletFactory
final WalletFactory walletFactory = DefaultWalletFactory.getInstance();
final Wallet testWallet = walletFactory.randomWallet(true).wallet();

// Get the Classic and X-Addresses from testWallet
final Address classicAddress = testWallet.classicAddress();
final XAddress xAddress = testWallet.xAddress();
System.out.println("Classic Address: " + classicAddress);
System.out.println("X-Address: " + xAddress);

// Fund the account using the testnet Faucet
final FaucetClient faucetClient = FaucetClient
  .construct(HttpUrl.get("https://faucet.altnet.rippletest.net"));
faucetClient.fundAccount(FundAccountRequest.of(classicAddress));

// Look up your Account Info
final AccountInfoRequestParams requestParams = AccountInfoRequestParams.of(classicAddress);
final AccountInfoResult accountInfoResult = xrplClient.accountInfo(requestParams);

// Print the result
System.out.println(accountInfoResult);
