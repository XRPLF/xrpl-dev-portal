---
paths:
  - "_code-samples/**/*.java"
---

# XRPL Java Code Sample Conventions

Java samples currently exist only in tutorial form. If a setup-style script is added later, mirror the speed-first conventions from the other language rules (parallelism, minimal output, no transaction printing) and update this rule.

---

## Project & build

- Maven (not Gradle); each sample is a self-contained Maven project under its language folder (e.g., `_code-samples/credential/java/`)
- Standard layout: `src/main/java/com/example/xrpl/<ClassName>.java` + `src/main/resources/logback.xml`
- `pom.xml` at the language root; Java 11 (`<maven.compiler.release>11</maven.compiler.release>`); UTF-8
- Single dependency: `org.xrpl:xrpl4j-client` 6.0.0
- Plugin: `org.codehaus.mojo:exec-maven-plugin` 3.3.0
- Install: `mvn install`
- Run: `mvn exec:java -Dexec.mainClass=com.example.xrpl.<ClassName>`

## Logging

- `src/main/resources/logback.xml` sets `org.xrpl.xrpl4j` to `WARN` (root `INFO`) to quiet wire-level chatter
- Include an XML comment explaining how to raise to `DEBUG` for transaction-level inspection

## Naming

- Class/file: `PascalCase` verb-noun (e.g., `ManageCredentials.java`); one class per sample
- Package: `com.example.xrpl`
- Imports: alphabetical within groups; no wildcard imports; `java.*` last

## Network

- **Testnet, not devnet** (py/js/go samples use devnet; Java uses testnet)
- JSON-RPC: `https://s.altnet.rippletest.net:51234/`
- Faucet: `https://faucet.altnet.rippletest.net`
- Explorer base: `https://testnet.xrpl.org/transactions/`
- Declared as `private static final HttpUrl` constants near the top of the class

## Class structure

- Class-level Javadoc summarizing what the sample demonstrates
- `public static void main(String[] args)` wraps `run()` in a try/catch:
  - Unwrap `CompletionException` so async failures print the same clean message as sync failures
  - Print `"Error: " + cause.getMessage()` to `System.err`, then `System.exit(1)`
- `private static void run()` holds the main flow
- Helpers below a `// ===== Helper functions =====` divider, each prefixed with a one-line comment explaining the helper

## Concurrency

- Use `CompletableFuture.supplyAsync(() -> ...)` + `CompletableFuture.allOf(...).join()` for parallel work (e.g., funding multiple accounts in parallel)

## Wallets

- Create: `Seed.ed25519Seed().deriveKeyPair()`
- Fund: `FaucetClient.construct(FAUCET_URL).fundAccount(FundAccountRequest.of(address))`
- Poll `xrplClient.accountInfo(... LedgerSpecifier.VALIDATED ...)` up to 20 attempts at 1s each before using the wallet — faucet funding isn't queryable immediately
- On `InterruptedException`: always `Thread.currentThread().interrupt()` before rethrowing as `RuntimeException`

## Transactions

- Builder pattern: `CredentialCreate.builder().account(addr).subject(...).build()`
- Always set: `sequence`, `fee`, `lastLedgerSequence`, `signingPublicKey`
- Use shared helpers (one per concern):
  - `accountSequence(client, address)` — fetches sequence from the validated ledger
  - `recommendedFee(client)` — wraps `FeeUtils.computeNetworkFees(client.fee()).recommendedFee()`
  - `lastLedgerSequence(client)` — validated ledger index + 20 buffer
- Sign with `BcSignatureService` (Bouncy Castle): `new BcSignatureService().sign(signer.privateKey(), tx)`

## Submission & finality

1. Reject early if `submit.engineResult()` ≠ `tesSUCCESS`
2. Poll `xrplClient.isFinal(...)` every 1 second until `finalityStatus()` is `VALIDATED_SUCCESS`
3. Fetch the full result via `xrplClient.transaction(...)` — `isFinal` only returns status, not the transaction body

## Output

- Section comments in code: `// ----- Section description -----` (dashes on **both** sides — Java's style; py/js/go use single-side dashes)
- Section banners: `System.out.println("\n=== Section Name ===\n");`
- Print every transaction as pretty JSON before submitting via `ObjectMapperFactory.create().writerWithDefaultPrettyPrinter().writeValueAsString(tx)`
- On success: print `<TxType> succeeded!` and `Explorer: <EXPLORER_BASE><result.hash()>` so the reader can inspect on-ledger

## Error handling

- Wrap checked exceptions with context: `throw new RuntimeException("Failed to fetch account sequence for " + address + ". " + e.getMessage(), e)`
- All failures bubble to `main()`'s catch; clean stderr message + exit 1
- Don't try/catch around individual transactions inside `run()` — let failures be visible
- Helper `requireSuccess(result)` throws `IllegalStateException` on non-`tesSUCCESS` codes; called after each submission
