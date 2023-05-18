// Create a KeyPair
KeyPair randomKeyPair = Seed.ed25519Seed().deriveKeyPair();

// Get the Classic address from testWallet
Address classicAddress = randomKeyPair.publicKey().deriveAddress();

// Connect --------------------------------------------------------------------
HttpUrl rippledUrl = HttpUrl.get("https://s.altnet.rippletest.net:51234/");
XrplClient xrplClient = new XrplClient(rippledUrl);

// Prepare transaction --------------------------------------------------------
// Look up your Account Info
AccountInfoRequestParams requestParams = AccountInfoRequestParams.builder()
  .account(classicAddress)
  .ledgerSpecifier(LedgerSpecifier.VALIDATED)
.build();
AccountInfoResult accountInfoResult = xrplClient.accountInfo(requestParams);
UnsignedInteger sequence = accountInfoResult.accountData().sequence();

// Request current fee information from rippled
FeeResult feeResult = xrplClient.fee();
XrpCurrencyAmount openLedgerFee = feeResult.drops().openLedgerFee();

// Get the latest validated ledger index
LedgerIndex validatedLedger = xrplClient.ledger(
  LedgerRequestParams.builder()
  .ledgerSpecifier(LedgerSpecifier.VALIDATED)
  .build()
)
  .ledgerIndex()
  .orElseThrow(() -> new RuntimeException("LedgerIndex not available."));

// LastLedgerSequence is the current ledger index + 4
UnsignedInteger lastLedgerSequence = validatedLedger.plus(UnsignedInteger.valueOf(4)).unsignedIntegerValue();

// Construct a Payment
Payment payment = Payment.builder()
  .account(classicAddress)
  .amount(XrpCurrencyAmount.ofXrp(BigDecimal.ONE))
  .destination(Address.of("rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"))
  .sequence(sequence)
  .fee(openLedgerFee)
  .signingPublicKey(randomKeyPair.publicKey())
  .lastLedgerSequence(lastLedgerSequence)
  .build();
System.out.println("Constructed Payment: " + payment);

// Sign transaction -----------------------------------------------------------
// Construct a SignatureService to sign the Payment
SignatureService<PrivateKey> signatureService = new BcSignatureService();

// Sign the Payment
SingleSignedTransaction<Payment> signedPayment = signatureService.sign(randomKeyPair.privateKey(), payment);
System.out.println("Signed Payment: " + signedPayment.signedTransaction());

// Submit transaction ---------------------------------------------------------
SubmitResult<Payment> paymentSubmitResult = xrplClient.submit(signedPayment);
System.out.println(paymentSubmitResult);

// Wait for validation --------------------------------------------------------
TransactionResult<Payment> transactionResult = null;

boolean transactionValidated = false;
boolean transactionExpired = false;
while (!transactionValidated && !transactionExpired) {
  Thread.sleep(4 * 1000);

  LedgerIndex latestValidatedLedgerIndex = xrplClient.ledger(
    LedgerRequestParams.builder()
    .ledgerSpecifier(LedgerSpecifier.VALIDATED)
    .build()
  )
    .ledgerIndex()
    .orElseThrow(() -> new RuntimeException("Ledger response did not contain a LedgerIndex."));

  transactionResult = xrplClient.transaction(TransactionRequestParams.of(signedPayment.hash()), Payment.class);

  if (transactionResult.validated()) {
    System.out.println("Payment was validated with result code " + transactionResult.metadata().get().transactionResult());
    transactionValidated = true;
  } else {
    boolean lastLedgerSequenceHasPassed = FluentCompareTo.is(latestValidatedLedgerIndex.unsignedIntegerValue())
      .greaterThan(UnsignedInteger.valueOf(lastLedgerSequence.intValue()));
    if (lastLedgerSequenceHasPassed) {
      System.out.println("LastLedgerSequence has passed. Last tx response: " + transactionResult);
      transactionExpired = true;
    } else {
      System.out.println("Payment not yet validated.");
    }
}

// Check transaction results --------------------------------------------------
System.out.println(transactionResult);
System.out.println("Explorer link: https://testnet.xrpl.org/transactions/" + signedPayment.hash());
transactionResult.metadata().ifPresent(metadata -> {
  System.out.println("Result code: " + metadata.transactionResult());
  metadata.deliveredAmount().ifPresent(deliveredAmount ->
    System.out.println("XRP Delivered: " + ((XrpCurrencyAmount) deliveredAmount).toXrp()));
  }
);
