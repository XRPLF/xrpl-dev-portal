---
paths:
  - "_code-samples/**/*.java"
---

# XRPL Java Code Sample Conventions

Java samples currently exist only in **tutorial form**.

## Style

### Formatting
- 2-space indent
- UTF-8 source encoding (declared in `pom.xml`)

### Naming
- Class/file: `PascalCase` verb-noun (e.g., `ManageCredentials.java`); one public class per file
- Variables: `camelCase` (e.g., `issuerAddress`, `subjectFuture`)
- Constants: `UPPER_SNAKE_CASE` for `static final` (e.g., `NETWORK_URL`, `FAUCET_URL`, `EXPLORER_BASE`, `CREDENTIAL_TYPE`)
- Package: `com.example.xrpl`
- Imports: two blocks separated by a blank line — all non-`java.*` imports together (alphabetized: `com.*`, `okhttp3.*`, `org.*`, etc.), then `java.*` last. No wildcard imports.

## Structure

### Folder layout

Each code sample lives at `_code-samples/<topic>/java/` as a self-contained Maven project:

```
_code-samples/<topic>/java/
├── README.md
├── pom.xml
├── target/                                 # Maven build output; gitignored
└── src/main/
    ├── java/com/example/xrpl/
    │   └── <ClassName>.java                # Tutorial samples (one class per user action)
    └── resources/
        └── logback.xml
```

Run any sample with `mvn exec:java -Dexec.mainClass=com.example.xrpl.<ClassName>` from the language root directory.

### README

`README.md` is the entry point for a reader running the samples.

1. Title: `# <Topic> Example (Java)`
2. One-sentence description listing what the directory demonstrates
3. `## Setup` section with an `mvn install` fenced block
4. One `##` section per tutorial sample, in the order a reader should run them:
  - Heading is a human-readable phrase for the action (e.g., `## Manage Credentials`, `## Issue a Token`) — not a code identifier like `## ManageCredentials`
  - Fenced ```sh``` block with `mvn exec:java -Dexec.mainClass=com.example.xrpl.<ClassName>`
  - One-sentence summary of what the script will output
  - Fenced ```sh``` block showing actual expected console output (real addresses, tx hashes, JSON dumps, explorer links — captured from a successful sample code run)
5. `---` separator between tutorial sections

### pom.xml

Java 11, UTF-8, single xrpl4j dependency, exec plugin for `mvn exec:java`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>{topic}-samples</artifactId> <!-- e.g., credential-samples; change per directory -->
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.release>11</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <build>
    <plugins>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>exec-maven-plugin</artifactId>
        <version>3.3.0</version>
      </plugin>
    </plugins>
  </build>

  <dependencies>
    <dependency>
      <groupId>org.xrpl</groupId>
      <artifactId>xrpl4j-client</artifactId>
      <version>{latest-stable}</version>
    </dependency>
  </dependencies>
</project>
```

### logback.xml

`src/main/resources/logback.xml` quiets xrpl4j's DEBUG chatter so tutorial output stays readable:

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

## Tutorial files

**xrpl4j sync client** — `org.xrpl.xrpl4j.client.XrplClient`. Use `CompletableFuture.supplyAsync` + `allOf().join()` for parallel work (e.g., funding multiple accounts).

### Structure

1. Class-level Javadoc explaining what the sample demonstrates (and any preconditions, if applicable)
2. `package com.example.xrpl;` + imports (alphabetical within groups, `java.*` last)
3. Class declaration with `NETWORK_URL`, `FAUCET_URL`, `EXPLORER_BASE`, and tutorial-specific constants at top:
  ```java
  private static final HttpUrl NETWORK_URL = HttpUrl.get("https://s.altnet.rippletest.net:51234/");
  private static final HttpUrl FAUCET_URL = HttpUrl.get("https://faucet.altnet.rippletest.net");
  private static final String EXPLORER_BASE = "https://testnet.xrpl.org/transactions/";
  ```
4. `main()` wraps `run()` and unwraps `CompletionException` so async failures print the same clean message as sync ones:
  ```java
  public static void main(String[] args) {
    try {
      run();
    } catch (Exception e) {
      // Unwrap CompletionException so async failures print the same clean message
      // as sync failures. CompletableFuture.join() wraps exceptions in CompletionException
      Throwable cause = (e instanceof CompletionException && e.getCause() != null)
        ? e.getCause() : e;
      System.err.println("Error: " + cause.getMessage());
      System.exit(1);
    }
  }
  ```
5. `private static void run()` holds the main flow.
6. Connect to network and fund however many accounts the sample needs. Fund in parallel via `CompletableFuture.supplyAsync` + `allOf().join()` when there's more than one. Two-account example:
  ```java
  // ----- Connect to Testnet and fund accounts -----
  XrplClient xrplClient = new XrplClient(NETWORK_URL);
  System.out.println("\n=== Funding issuer and subject accounts on Testnet ===\n");

  CompletableFuture<KeyPair> issuerFuture = CompletableFuture.supplyAsync(
    () -> createAndFundWallet(xrplClient));
  CompletableFuture<KeyPair> subjectFuture = CompletableFuture.supplyAsync(
    () -> createAndFundWallet(xrplClient));
  CompletableFuture.allOf(issuerFuture, subjectFuture).join();

  KeyPair issuer = issuerFuture.join();
  KeyPair subject = subjectFuture.join();
  Address issuerAddress = issuer.publicKey().deriveAddress();
  Address subjectAddress = subject.publicKey().deriveAddress();
  System.out.println("Issuer:  " + issuerAddress);
  System.out.println("Subject: " + subjectAddress);
  ```
7. Tutorial code steps.
8. Useful helpers below a `// ===== Helper functions =====` divider, each prefixed with a one-line comment. Copy any helpers the sample uses — the signatures and bodies below are canonical; only include the ones you call:
  ```java
  // ===== Helper functions =====

  // Generates a new Ed25519 keypair, funds it from the Testnet faucet, and
  // returns the keypair once the account is visible on a validated ledger.
  private static KeyPair createAndFundWallet(XrplClient xrplClient) {
    KeyPair keyPair = Seed.ed25519Seed().deriveKeyPair();
    Address address = keyPair.publicKey().deriveAddress();
    FaucetClient faucetClient = FaucetClient.construct(FAUCET_URL);
    faucetClient.fundAccount(FundAccountRequest.of(address));

    for (int attempt = 0; attempt < 20; attempt++) {
      try {
        xrplClient.accountInfo(AccountInfoRequestParams.builder()
          .account(address)
          .ledgerSpecifier(LedgerSpecifier.VALIDATED)
          .build());
        return keyPair;
      } catch (JsonRpcClientErrorException notYetVisible) {
        try {
          Thread.sleep(1_000L);
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          throw new RuntimeException("Account polling interrupted for " + address + ". " + e.getMessage(), e);
        }
      }
    }
    throw new IllegalStateException("Faucet funding for " + address + " did not confirm in time.");
  }

  // Fetches the next transaction sequence number of an address from
  // the latest validated ledger.
  private static UnsignedInteger accountSequence(XrplClient xrplClient, Address address) {
    try {
      AccountInfoResult info = xrplClient.accountInfo(AccountInfoRequestParams.builder()
        .account(address)
        .ledgerSpecifier(LedgerSpecifier.VALIDATED)
        .build());
      return info.accountData().sequence();
    } catch (JsonRpcClientErrorException e) {
      throw new RuntimeException("Failed to fetch account sequence for " + address + ". " + e.getMessage(), e);
    }
  }

  // Fetches the current network fee and returns the recommended fee for
  // a standard (non-multisig, non-batch) transaction.
  private static XrpCurrencyAmount recommendedFee(XrplClient xrplClient) {
    try {
      return FeeUtils.computeNetworkFees(xrplClient.fee()).recommendedFee();
    } catch (JsonRpcClientErrorException e) {
      throw new RuntimeException("Failed to fetch network fee. " + e.getMessage(), e);
    }
  }

  // Computes a safe LastLedgerSequence for a new transaction. The
  // latest validated ledger index plus a small buffer (20 ledgers).
  private static UnsignedInteger lastLedgerSequence(XrplClient xrplClient) {
    try {
      UnsignedInteger validatedLedger = xrplClient.ledger(LedgerRequestParams.builder()
          .ledgerSpecifier(LedgerSpecifier.VALIDATED)
          .build())
        .ledgerIndexSafe()
        .unsignedIntegerValue();
      return validatedLedger.plus(UnsignedInteger.valueOf(20));
    } catch (JsonRpcClientErrorException e) {
      throw new RuntimeException("Failed to compute LastLedgerSequence. " + e.getMessage(), e);
    }
  }

  // Prints a transaction as a formatted JSON.
  private static void printTransactionJson(Transaction tx) {
    try {
      System.out.println(ObjectMapperFactory.create().writerWithDefaultPrettyPrinter().writeValueAsString(tx));
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize transaction JSON. " + e.getMessage(), e);
    }
  }

  // Signs and submits a transaction, then polls the network until
  // the transaction reaches a validated state.
  private static <T extends Transaction> TransactionResult<T> signSubmitAndWait(
    XrplClient xrplClient,
    KeyPair signer,
    T transaction,
    Class<T> transactionType
  ) {
    SignatureService<PrivateKey> signatureService = new BcSignatureService();

    UnsignedInteger lastLedgerSequence = transaction.lastLedgerSequence()
      .orElseThrow(() -> new IllegalArgumentException(
        "Must set LastLedgerSequence for polling expiration"));

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
          signed.hash(),
          submit.validatedLedgerIndex(),
          lastLedgerSequence,
          transaction.sequence(),
          signer.publicKey().deriveAddress()
        );
      } while (finality.finalityStatus() == FinalityStatus.NOT_FINAL);

      if (finality.finalityStatus() != FinalityStatus.VALIDATED_SUCCESS) {
        throw new IllegalStateException(
          "Transaction failed with status " + finality.finalityStatus()
            + ". Result code: " + finality.resultCode().orElse("unknown"));
      }

      // Retrieve the transaction result; isFinal() only returns finality status
      return xrplClient.transaction(
        TransactionRequestParams.of(signed.hash()), transactionType);

    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new RuntimeException("Transaction polling interrupted. " + e.getMessage(), e);
    } catch (JsonRpcClientErrorException | JsonProcessingException e) {
      throw new RuntimeException("Transaction processing failed. " + e.getMessage(), e);
    }
  }

  // Checks for a tesSUCCESS result code. If true, prints an explorer
  // link. Otherwise, throws an error.
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

### Tutorial code step guide

- Before each major step, add a section comment and print a banner. Strict format: `// ----- Title -----` on its own line, then `System.out.println("\n=== Title ===\n");` immediately after. The title text should match between the two.
- Build transactions with the builder pattern; always set `sequence`, `fee`, `lastLedgerSequence`, `signingPublicKey` from shared helpers, then print as pretty JSON:
  ```java
  // ----- Prepare CredentialCreate transaction -----
  System.out.println("\n=== Preparing CredentialCreate transaction ===\n");

  CredentialCreate createTx = CredentialCreate.builder()
    .account(issuerAddress)
    .subject(subjectAddress)
    .credentialType(CREDENTIAL_TYPE)
    .sequence(accountSequence(xrplClient, issuerAddress))
    .fee(recommendedFee(xrplClient))
    .lastLedgerSequence(lastLedgerSequence(xrplClient))
    .signingPublicKey(issuer.publicKey())
    .build();
  printTransactionJson(createTx);
  ```
- Sign, submit, and wait via the shared `signSubmitAndWait` helper, then verify success with `requireSuccess`:
  ```java
  // ----- Sign, submit, and wait for CredentialCreate validation -----
  System.out.println("\n=== Submitting CredentialCreate transaction ===\n");

  TransactionResult<CredentialCreate> createResult = signSubmitAndWait(
    xrplClient, issuer, createTx, CredentialCreate.class);

  requireSuccess(createResult);
  ```
