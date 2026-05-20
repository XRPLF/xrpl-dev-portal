---
paths:
  - "_code-samples/**/*.java"
---

# XRPL Java Code Sample Conventions

Java samples currently exist only in tutorial form. If a setup-style script is added later, mirror the speed-first conventions from the other language rules (parallelism, minimal output, no transaction printing) and update this rule.

## Project & build

- Maven (not Gradle); each sample is a self-contained Maven project under its language folder (e.g., `_code-samples/credential/java/`)
- Standard layout: `src/main/java/com/example/xrpl/<ClassName>.java` + `src/main/resources/logback.xml`
- Java 11 (`<maven.compiler.release>11</maven.compiler.release>`); UTF-8
- Single dependency: `org.xrpl:xrpl4j-client` 6.0.0
- Plugin: `org.codehaus.mojo:exec-maven-plugin` 3.3.0
- Install: `mvn install`
- Run: `mvn exec:java -Dexec.mainClass=com.example.xrpl.<ClassName>`

## Logging

`src/main/resources/logback.xml` quiets xrpl4j wire-level chatter so tutorial output stays readable:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Quiets xrpl4j's DEBUG chatter so tutorial output stays readable.
     Raise xrpl4j to DEBUG to see wire-level transaction details. -->
<configuration>
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
    </encoder>
  </appender>
  <logger name="org.xrpl.xrpl4j" level="WARN"/>
  <root level="INFO">
    <appender-ref ref="CONSOLE"/>
  </root>
</configuration>
```

## Naming

- Class/file: `PascalCase` verb-noun (e.g., `ManageCredentials.java`); one class per sample
- Package: `com.example.xrpl`
- Imports: alphabetical within groups; no wildcard imports; `java.*` last

## Network

**Testnet, not devnet** (py/js/go samples use devnet; Java uses testnet). Declare constants near the top of the class:

```java
private static final HttpUrl NETWORK_URL = HttpUrl.get("https://s.altnet.rippletest.net:51234/");
private static final HttpUrl FAUCET_URL = HttpUrl.get("https://faucet.altnet.rippletest.net");
private static final String EXPLORER_BASE = "https://testnet.xrpl.org/transactions/";
```

## Class structure

`main()` wraps `run()` and unwraps `CompletionException` so async failures print the same clean message as sync ones:

```java
public static void main(String[] args) {
  try {
    run();
  } catch (Exception e) {
    Throwable cause = (e instanceof CompletionException && e.getCause() != null)
      ? e.getCause() : e;
    System.err.println("Error: " + cause.getMessage());
    System.exit(1);
  }
}
```

- `private static void run()` holds the main flow
- Helpers below a `// ===== Helper functions =====` divider, each prefixed with a one-line comment

## Concurrency

Use `CompletableFuture.supplyAsync` + `allOf().join()` for parallel work (e.g., funding multiple accounts):

```java
CompletableFuture<KeyPair> issuerFuture = CompletableFuture.supplyAsync(
  () -> createAndFundWallet(xrplClient));
CompletableFuture<KeyPair> subjectFuture = CompletableFuture.supplyAsync(
  () -> createAndFundWallet(xrplClient));
CompletableFuture.allOf(issuerFuture, subjectFuture).join();

KeyPair issuer = issuerFuture.join();
KeyPair subject = subjectFuture.join();
```

## Wallets

Faucet funding isn't queryable immediately — poll until the account is visible on a validated ledger:

```java
private static KeyPair createAndFundWallet(XrplClient xrplClient) {
  KeyPair keyPair = Seed.ed25519Seed().deriveKeyPair();
  Address address = keyPair.publicKey().deriveAddress();
  FaucetClient.construct(FAUCET_URL).fundAccount(FundAccountRequest.of(address));

  for (int attempt = 0; attempt < 20; attempt++) {
    try {
      xrplClient.accountInfo(AccountInfoRequestParams.builder()
        .account(address)
        .ledgerSpecifier(LedgerSpecifier.VALIDATED)
        .build());
      return keyPair;
    } catch (JsonRpcClientErrorException notYetVisible) {
      try { Thread.sleep(1_000L); }
      catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        throw new RuntimeException("Account polling interrupted for " + address + ". " + e.getMessage(), e);
      }
    }
  }
  throw new IllegalStateException("Faucet funding for " + address + " did not confirm in time.");
}
```

## Transactions

Builder pattern; always set `sequence`, `fee`, `lastLedgerSequence`, `signingPublicKey` from shared helpers:

```java
CredentialCreate createTx = CredentialCreate.builder()
  .account(issuerAddress)
  .subject(subjectAddress)
  .credentialType(CREDENTIAL_TYPE)
  .sequence(accountSequence(xrplClient, issuerAddress))
  .fee(recommendedFee(xrplClient))
  .lastLedgerSequence(lastLedgerSequence(xrplClient))
  .signingPublicKey(issuer.publicKey())
  .build();
```

Shared helpers (one per concern; each wraps `JsonRpcClientErrorException` with context):

```java
// Next transaction sequence from the validated ledger.
private static UnsignedInteger accountSequence(XrplClient client, Address address) { /* ... */ }

// Recommended fee for a standard (non-multisig, non-batch) transaction.
private static XrpCurrencyAmount recommendedFee(XrplClient client) {
  return FeeUtils.computeNetworkFees(client.fee()).recommendedFee();
}

// Validated ledger index + 20-ledger buffer.
private static UnsignedInteger lastLedgerSequence(XrplClient client) { /* ... */ }
```

## Submission & finality

Sign with `BcSignatureService`, submit, poll `isFinal` until validated, then fetch the full result (`isFinal` only returns status):

```java
private static <T extends Transaction> TransactionResult<T> signSubmitAndWait(
  XrplClient xrplClient, KeyPair signer, T transaction, Class<T> transactionType
) {
  SignatureService<PrivateKey> signatureService = new BcSignatureService();
  UnsignedInteger lastLedgerSequence = transaction.lastLedgerSequence()
    .orElseThrow(() -> new IllegalArgumentException("Must set LastLedgerSequence for polling expiration"));

  try {
    SingleSignedTransaction<T> signed = signatureService.sign(signer.privateKey(), transaction);
    SubmitResult<T> submit = xrplClient.submit(signed);

    if (!TransactionResultCodes.TES_SUCCESS.equals(submit.engineResult())) {
      throw new IllegalStateException(
        "Submission rejected. " + submit.engineResult() + " — " + submit.engineResultMessage());
    }

    Finality finality;
    do {
      Thread.sleep(1_000L);
      finality = xrplClient.isFinal(
        signed.hash(), submit.validatedLedgerIndex(), lastLedgerSequence,
        transaction.sequence(), signer.publicKey().deriveAddress());
    } while (finality.finalityStatus() == FinalityStatus.NOT_FINAL);

    if (finality.finalityStatus() != FinalityStatus.VALIDATED_SUCCESS) {
      throw new IllegalStateException("Transaction failed with status " + finality.finalityStatus()
        + ". Result code: " + finality.resultCode().orElse("unknown"));
    }

    // isFinal only returns status; fetch the full transaction body separately
    return xrplClient.transaction(TransactionRequestParams.of(signed.hash()), transactionType);
  } catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    throw new RuntimeException("Transaction polling interrupted. " + e.getMessage(), e);
  } catch (JsonRpcClientErrorException | JsonProcessingException e) {
    throw new RuntimeException("Transaction processing failed. " + e.getMessage(), e);
  }
}
```

## Output

- Section banners: `System.out.println("\n=== Section Name ===\n");`
- Section comments in code: `// ----- Section description -----` (dashes on **both** sides — Java's style; py/js/go use single-side dashes)
- Print every transaction as pretty JSON before submitting:

```java
private static void printTransactionJson(Transaction tx) {
  try {
    System.out.println(ObjectMapperFactory.create().writerWithDefaultPrettyPrinter().writeValueAsString(tx));
  } catch (JsonProcessingException e) {
    throw new RuntimeException("Failed to serialize transaction JSON. " + e.getMessage(), e);
  }
}
```

- On success, print "succeeded!" line + explorer link via `requireSuccess`:

```java
private static void requireSuccess(TransactionResult<?> result) {
  String code = result.metadata().get().transactionResult();
  String txType = result.transaction().transactionType().value();
  if (!TransactionResultCodes.TES_SUCCESS.equals(code)) {
    throw new IllegalStateException(txType + " failed with error code " + code);
  }
  System.out.println(txType + " succeeded!");
  System.out.println("Explorer: " + EXPLORER_BASE + result.hash());
}
```

## Error handling

- Wrap checked exceptions with context: `throw new RuntimeException("Failed to ... " + e.getMessage(), e)`
- On `InterruptedException`: always `Thread.currentThread().interrupt()` before rethrowing
- All failures bubble to `main()`'s catch; clean stderr message + exit 1
- Don't try/catch around individual transactions inside `run()` — let failures be visible
