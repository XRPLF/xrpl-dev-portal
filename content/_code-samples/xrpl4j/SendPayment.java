// Construct a network client
final HttpUrl rippledUrl = HttpUrl.get("https://s.altnet.rippletest.net:51234/");
XrplClient xrplClient = new XrplClient(rippledUrl);

// Create a Wallet using a WalletFactory
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
final Wallet testWallet = walletFactory.randomWallet(true).wallet();
System.out.println("Generated a wallet with the following public key: " + testWallet.publicKey());

// Get the Classic and X-Addresses from testWallet
final Address classicAddress = testWallet.classicAddress();
System.out.println("Classic Address: " + classicAddress);

// Fund the account using the testnet Faucet
final FaucetClient faucetClient = FaucetClient
  .construct(HttpUrl.get("https://faucet.altnet.rippletest.net"));
faucetClient.fundAccount(FundAccountRequest.of(classicAddress));
System.out.println("Funded the account using the Testnet faucet.");

// Look up your Account Info
final AccountInfoRequestParams requestParams = AccountInfoRequestParams.of(classicAddress);
final AccountInfoResult accountInfoResult = xrplClient.accountInfo(requestParams);
final UnsignedInteger sequence = accountInfoResult.accountData().sequence();

// Request current fee information from rippled
final FeeResult feeResult = xrplClient.fee();
final XrpCurrencyAmount openLedgerFee = feeResult.drops().openLedgerFee();

// Construct a Payment
Payment payment = Payment.builder()
  .account(classicAddress)
  .amount(XrpCurrencyAmount.ofXrp(BigDecimal.ONE))
  .destination(Address.of("rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"))
  .sequence(sequence)
  .fee(openLedgerFee)
  .signingPublicKey(testWallet.publicKey())
  .build();

// Print the Payment
System.out.println("Constructed Payment: " + payment);

// Construct a SignatureService to sign the Payment
PrivateKey privateKey = PrivateKey.fromBase16EncodedPrivateKey(testWallet.privateKey().get());
SignatureService signatureService = new SingleKeySignatureService(privateKey);

// Sign the Payment
final SignedTransaction<Payment> signedPayment = signatureService.sign(KeyMetadata.EMPTY, payment);

// Print the signed transaction
System.out.println("Signed Payment: " + signedPayment.signedTransaction());

// Submit the Payment
final SubmitResult<Transaction> submitResult = xrplClient.submit(signedPayment);

// Print the response
System.out.println(submitResult);
