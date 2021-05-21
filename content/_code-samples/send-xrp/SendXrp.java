// Example Credentials --------------------------------------------------------
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
Wallet testWallet = walletFactory
  .fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9", true)
  .wallet();

// Get the Classic address from testWallet
Address classicAddress = testWallet.classicAddress();
System.out.println(classicAddress); // "rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH"

// Connect --------------------------------------------------------------------
HttpUrl rippledUrl = HttpUrl.get("https://s.altnet.rippletest.net:51234/");
XrplClient xrplClient = new XrplClient(rippledUrl);

// Prepare transaction --------------------------------------------------------
// Look up your Account Info
AccountInfoRequestParams requestParams = AccountInfoRequestParams.builder()
  .ledgerIndex(LedgerIndex.VALIDATED)
  .account(classicAddress)
  .build();
AccountInfoResult accountInfoResult = xrplClient.accountInfo(requestParams);
UnsignedInteger sequence = accountInfoResult.accountData().sequence();

// Request current fee information from rippled
FeeResult feeResult = xrplClient.fee();
XrpCurrencyAmount openLedgerFee = feeResult.drops().openLedgerFee();

// Get the latest validated ledger index
LedgerIndex validatedLedger = xrplClient.ledger(
    LedgerRequestParams.builder()
      .ledgerIndex(LedgerIndex.VALIDATED)
      .build()
  )
  .ledgerIndex()
  .orElseThrow(() -> new RuntimeException("LedgerIndex not available."));

// Workaround for https://github.com/XRPLF/xrpl4j/issues/84
UnsignedInteger lastLedgerSequence = UnsignedInteger.valueOf(
  validatedLedger.plus(UnsignedLong.valueOf(4)).unsignedLongValue().intValue()
);

// Construct a Payment
Payment payment = Payment.builder()
  .account(classicAddress)
  .amount(XrpCurrencyAmount.ofXrp(BigDecimal.ONE))
  .destination(Address.of("rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"))
  .sequence(sequence)
  .fee(openLedgerFee)
  .signingPublicKey(testWallet.publicKey())
  .lastLedgerSequence(lastLedgerSequence)
  .build();
System.out.println("Constructed Payment: " + payment);

// Sign transaction -----------------------------------------------------------
// Construct a SignatureService to sign the Payment
PrivateKey privateKey = PrivateKey.fromBase16EncodedPrivateKey(
  testWallet.privateKey().get()
);
SignatureService signatureService = new SingleKeySignatureService(privateKey);

// Sign the Payment
SignedTransaction<Payment> signedPayment = signatureService.sign(
  KeyMetadata.EMPTY,
  payment
);
System.out.println("Signed Payment: " + signedPayment.signedTransaction());

// Submit transaction ---------------------------------------------------------
SubmitResult<Transaction> prelimResult = xrplClient.submit(signedPayment);
System.out.println(prelimResult);

// Wait for validation --------------------------------------------------------
boolean transactionValidated = false;
boolean transactionExpired = false;
while (!transactionValidated && !transactionExpired) {
  Thread.sleep(4 * 1000);
  LedgerIndex latestValidatedLedgerIndex = xrplClient.ledger(
      LedgerRequestParams.builder().ledgerIndex(LedgerIndex.VALIDATED).build()
    )
    .ledgerIndex()
    .orElseThrow(() ->
      new RuntimeException("Ledger response did not contain a LedgerIndex.")
    );

  TransactionResult<Payment> transactionResult = xrplClient.transaction(
    TransactionRequestParams.of(signedPayment.hash()),
    Payment.class
  );

  if (transactionResult.validated()) {
    System.out.println("Payment was validated with result code " +
      transactionResult.metadata().get().transactionResult());
    transactionValidated = true;
  } else {
    boolean lastLedgerSequenceHasPassed = FluentCompareTo.
      is(latestValidatedLedgerIndex.unsignedLongValue())
      .greaterThan(UnsignedLong.valueOf(lastLedgerSequence.intValue()));
    if (lastLedgerSequenceHasPassed) {
      System.out.println("LastLedgerSequence has passed. Last tx response: "
        transactionResult);
    );
      transactionExpired = true;
    } else {
      System.out.println("Payment not yet validated.");
    }
  }
}

// Check transaction results --------------------------------------------------
System.out.println(transactionResult);
System.out.println("Explorer link: https://testnet.xrpl.org/transactions/" +
    signedPayment.hash());
transactionResult.metadata().ifPresent(metadata -> {
  System.out.println("Result code: " + metadata.transactionResult());

  metadata.deliveredAmount().ifPresent(deliveredAmount ->
    System.out.println("XRP Delivered: " +
      ((XrpCurrencyAmount) deliveredAmount).toXrp())
  );
});
