////////////////////////////////////////////////////////////////////////////
// Sign using a SingleKeySignatureService:
// This implementation of SignatureService simply holds a PrivateKey in
// memory and signs Transactions using that PrivateKey. This may be
// suitable for some applications, but is likely not secure enough for
// server side applications, as keys must be stored and kept in memory.
////////////////////////////////////////////////////////////////////////////

// Create a random wallet
WalletFactory walletFactory = DefaultWalletFactory.getInstance();
Wallet wallet = walletFactory.randomWallet(true).wallet();

// Construct a SingleKeySignatureService from the Wallet private key
PrivateKey privateKey = PrivateKey.fromBase16EncodedPrivateKey(
  wallet.privateKey().get()
);
SingleKeySignatureService signatureService =
  new SingleKeySignatureService(privateKey);

// Construct and sign the Payment
Payment payment = Payment.builder()
  .account(wallet.classicAddress())
  .destination(Address.of("rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"))
  .amount(XrpCurrencyAmount.ofDrops(1000))
  .fee(XrpCurrencyAmount.ofDrops(10))
  .sequence(UnsignedInteger.valueOf(16126889))
  .signingPublicKey(signatureService.getPublicKey(KeyMetadata.EMPTY))
  .build();
SignedTransaction<Payment> signedPayment = signatureService.sign(
  KeyMetadata.EMPTY,
  payment
);
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

// Construct a DerivedKeysSignatureService with a server secret
// (in this case "shh")
DerivedKeysSignatureService signatureService =
  new DerivedKeysSignatureService("shh"::getBytes, VersionType.ED25519);

// Choose a walletId. This can be anything as long as it is unique to your system.
String walletId = "sample-wallet";
KeyMetadata keyMetadata = KeyMetadata.builder()
  .platformIdentifier("jks")
  .keyringIdentifier("n/a")
  .keyIdentifier(walletId)
  .keyVersion("1")
  .keyPassword("password")
  .build();

// Get the public key and classic address for the given walletId
PublicKey publicKey = signatureService.getPublicKey(keyMetadata);
Address classicAddress = DefaultKeyPairService.getInstance()
  .deriveAddress(publicKey.value());

// Construct and sign the Payment
Payment payment = Payment.builder()
  .account(classicAddress)
  .destination(Address.of("rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"))
  .amount(XrpCurrencyAmount.ofDrops(1000))
  .fee(XrpCurrencyAmount.ofDrops(10))
  .sequence(UnsignedInteger.valueOf(16126889))
  .signingPublicKey(publicKey.base16Encoded())
  .build();

SignedTransaction<Payment> signedPayment = signatureService
  .sign(keyMetadata, payment);
System.out.println("Signed Payment: " + signedPayment.signedTransaction());
