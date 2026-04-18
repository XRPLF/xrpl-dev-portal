# Credential Samples (Java)

Java code samples demonstrating [Credential](https://xrpl.org/credentials.html) workflows on the XRP Ledger, using [xrpl4j](https://github.com/XRPLF/xrpl4j).

| Sample | Description |
|---|---|
| `ManageCredentials.java` | Full credential lifecycle: fund two Testnet accounts, issue a credential, accept it, and delete it. |

## Requirements

- Java 11 or later
- [Maven 3.6+](https://maven.apache.org/)

## Install

From this directory, download dependencies and compile all samples:

```
mvn install
```

The first run downloads `xrpl4j` and its transitive dependencies from Maven Central (~30 seconds). Subsequent runs use the local cache at `~/.m2/repository/` and are near-instant.

## Run

Run any sample by passing its class name as the `exec.mainClass` property:

```
mvn exec:java -Dexec.mainClass=com.example.xrpl.ManageCredentials
```

## Related docs

- [Credentials](https://xrpl.org/credentials.html) — concept and transaction reference
- [Get Started Using Java](https://xrpl.org/get-started-using-java.html) — general `xrpl4j` setup
- [xrpl4j on GitHub](https://github.com/XRPLF/xrpl4j)
