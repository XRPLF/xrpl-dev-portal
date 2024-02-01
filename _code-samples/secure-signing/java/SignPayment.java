////////////////////////////////////////////////////////////////////////////
// Sign using a SingleKeySignatureService:
// This implementation of SignatureService signs Transactions using a
// supplied PrivateKey. This may be suitable for some applications, but is
// likely not secure enough for server side applications, as keys should not
// be stored in memory whenever possible.
////////////////////////////////////////////////////////////////////////////

// Create a random wallet
KeyPair randomKeyPair = Seed.ed25519Seed().deriveKeyPair();
PublicKey publicKey = randomKeyPair.publicKey();
PrivateKey privateKey = randomKeyPair.privateKey()

// Construct a SignatureService
SignatureService<PrivateKey> signatureService = new BcSignatureService();

// Construct and sign the Payment
Payment payment = Payment.builder()
  .account(publicKey.deriveAddress())
  .destination(Address.of("rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"))
  .amount(XrpCurrencyAmount.ofDrops(1000))
  .fee(XrpCurrencyAmount.ofDrops(10))
  .sequence(UnsignedInteger.valueOf(16126889))
  .signingPublicKey(publicKey)
  .build();
SingleSignedTransaction<Payment> signedPayment = signatureService.sign(privateKey, payment);
System.out.println("Signed Payment: " + signedPayment.signedTransaction());


////////////////////////////////////////////////////////////////////////////
// Sign using a DerivedKeysSignatureService:
// This implementation of SignatureService deterministically derives
// Private Keys from a secret value (likely a server secret) and a wallet
// identifier. That PrivateKey can then be used to sign transactions.
// The wallet identifier can be anything, but would likely be an existing ID
// tracked by a server side system.
//
// Though this implementation is more secure than SingleKeySignatureService
// and better suited for server-side applications, keys are still held
// in memory. For the best security, we suggest using a HSM-based
// implementation.
////////////////////////////////////////////////////////////////////////////

// Construct a DerivedKeysSignatureService with a server secret (in this case "shh")
SignatureService<PrivateKeyReference> derivedKeySignatureService = new BcDerivedKeySignatureService(
  () -> ServerSecret.of("shh".getBytes())
);

PrivateKeyReference privateKeyReference = new PrivateKeyReference() {
  @Override
  public KeyType keyType() {
    return KeyType.ED25519;
  }

  @Override
  public String keyIdentifier() {
    return "sample-keypair";
  }
};

// Get the public key and classic address for the given walletId
PublicKey publicKey = derivedKeySignatureService.derivePublicKey(privateKeyReference);
Address classicAddress = publicKey.deriveAddress();

// Construct and sign the Payment
Payment payment = Payment.builder()
  .account(classicAddress)
  .destination(Address.of("rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"))
  .amount(XrpCurrencyAmount.ofDrops(1000))
  .fee(XrpCurrencyAmount.ofDrops(10))
  .sequence(UnsignedInteger.valueOf(16126889))
  .signingPublicKey(publicKey)
  .build();

SingleSignedTransaction<Payment> signedPayment = derivedKeySignatureService.sign(privateKeyReference, payment);
System.out.println("Signed Payment: " + signedPayment.signedTransaction());
