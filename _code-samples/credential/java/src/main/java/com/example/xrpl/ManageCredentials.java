package com.example.xrpl;

import com.google.common.primitives.UnsignedInteger;
import okhttp3.HttpUrl;
import org.xrpl.xrpl4j.client.JsonRpcClientErrorException;
import org.xrpl.xrpl4j.client.XrplClient;
import org.xrpl.xrpl4j.client.faucet.FaucetClient;
import org.xrpl.xrpl4j.client.faucet.FundAccountRequest;
import org.xrpl.xrpl4j.crypto.keys.KeyPair;
import org.xrpl.xrpl4j.crypto.keys.PrivateKey;
import org.xrpl.xrpl4j.crypto.keys.Seed;
import org.xrpl.xrpl4j.crypto.signing.SignatureService;
import org.xrpl.xrpl4j.crypto.signing.SingleSignedTransaction;
import org.xrpl.xrpl4j.crypto.signing.bc.BcSignatureService;
import org.xrpl.xrpl4j.model.client.accounts.AccountInfoRequestParams;
import org.xrpl.xrpl4j.model.client.accounts.AccountInfoResult;
import org.xrpl.xrpl4j.model.client.common.LedgerSpecifier;
import org.xrpl.xrpl4j.model.client.fees.FeeUtils;
import org.xrpl.xrpl4j.model.client.ledger.LedgerRequestParams;
import org.xrpl.xrpl4j.model.client.transactions.SubmitResult;
import org.xrpl.xrpl4j.model.client.transactions.TransactionRequestParams;
import org.xrpl.xrpl4j.model.client.transactions.TransactionResult;
import org.xrpl.xrpl4j.model.jackson.ObjectMapperFactory;
import org.xrpl.xrpl4j.model.transactions.Address;
import org.xrpl.xrpl4j.model.transactions.CredentialAccept;
import org.xrpl.xrpl4j.model.transactions.CredentialCreate;
import org.xrpl.xrpl4j.model.transactions.CredentialDelete;
import org.xrpl.xrpl4j.model.transactions.CredentialType;
import org.xrpl.xrpl4j.model.transactions.Hash256;
import org.xrpl.xrpl4j.model.transactions.Transaction;
import org.xrpl.xrpl4j.model.transactions.TransactionResultCodes;
import org.xrpl.xrpl4j.model.transactions.XrpCurrencyAmount;

import java.util.concurrent.CompletableFuture;

/**
 * This code sample demonstrates the Credential lifecycle on the XRPL.
 * It issues a credential to a subject, accepts the credential, and then deletes it.
 */
public class ManageCredentials {

  private static final HttpUrl NETWORK_URL = HttpUrl.get("https://s.altnet.rippletest.net:51234/");
  private static final HttpUrl FAUCET_URL = HttpUrl.get("https://faucet.altnet.rippletest.net");
  private static final String EXPLORER_BASE = "https://testnet.xrpl.org/transactions/";

  private static final CredentialType CREDENTIAL_TYPE = CredentialType.ofPlainText("kyc-trader");

  public static void main(String[] args) {
    // ----- Connect to the testnet network and fund accounts -----
    XrplClient xrplClient = new XrplClient(NETWORK_URL);

    System.out.println("\n=== Funding issuer and subject accounts from the Testnet faucet ===\n");
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

    // ----- Issue credential -----
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

    System.out.println("\n=== Submitting CredentialCreate transaction ===\n");
    TransactionResult<CredentialCreate> createResult = signSubmitAndWait(
      xrplClient, issuer, createTx, CredentialCreate.class);
    printFinalResult("Credential issued", createResult.hash());

    // ----- Subject accepts credential -----
    System.out.println("\n=== Preparing CredentialAccept transaction ===\n");
    CredentialAccept acceptTx = CredentialAccept.builder()
      .account(subjectAddress)
      .issuer(issuerAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, subjectAddress))
      .fee(recommendedFee(xrplClient))
      .lastLedgerSequence(lastLedgerSequence(xrplClient))
      .signingPublicKey(subject.publicKey())
      .build();
    printTransactionJson(acceptTx);

    System.out.println("\n=== Submitting CredentialAccept transaction ===\n");
    TransactionResult<CredentialAccept> acceptResult = signSubmitAndWait(
      xrplClient, subject, acceptTx, CredentialAccept.class);
    printFinalResult("Credential accepted", acceptResult.hash());

    // ----- Subject deletes credential -----
    System.out.println("\n=== Preparing CredentialDelete transaction ===\n");
    CredentialDelete deleteTx = CredentialDelete.builder()
      .account(subjectAddress)
      .issuer(issuerAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, subjectAddress))
      .fee(recommendedFee(xrplClient))
      .lastLedgerSequence(lastLedgerSequence(xrplClient))
      .signingPublicKey(subject.publicKey())
      .build();
    printTransactionJson(deleteTx);

    System.out.println("\n=== Submitting CredentialDelete transaction ===\n");
    TransactionResult<CredentialDelete> deleteResult = signSubmitAndWait(
      xrplClient, subject, deleteTx, CredentialDelete.class);
    printFinalResult("Credential deleted", deleteResult.hash());
  }

  // ===== Helper functions =====

  // Generates a new Ed25519 keypair, funds it from the Testnet faucet, and
  // returns the keypair once the account is visible on a validated ledger.
  private static KeyPair createAndFundWallet(XrplClient xrplClient) {
    KeyPair keyPair = Seed.ed25519Seed().deriveKeyPair();
    Address address = keyPair.publicKey().deriveAddress();
    FaucetClient faucetClient = FaucetClient.construct(FAUCET_URL);
    try {
      faucetClient.fundAccount(FundAccountRequest.of(address));

      for (int attempt = 0; attempt < 20; attempt++) {
        try {
          xrplClient.accountInfo(AccountInfoRequestParams.builder()
            .account(address)
            .ledgerSpecifier(LedgerSpecifier.VALIDATED)
            .build());
          return keyPair;
        } catch (Exception notYetVisible) {
          Thread.sleep(1_000L);
        }
      }
      exitWithError("Faucet funding for " + address + " did not confirm in time.");
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      exitWithError("Funding interrupted for " + address + ": " + e.getMessage());
    } catch (Exception e) {
      exitWithError("Failed to fund account " + address + ": " + e.getMessage());
    }
    return null; // unreachable; required by the compiler
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
    } catch (Exception e) {
      exitWithError("Failed to fetch account sequence for " + address + ": " + e.getMessage());
      return null; // unreachable; required by the compiler
    }
  }

  // Fetches the current network fee and returns the recommended fee for
  // a standard (non-multisig, non-batch) transaction.
  private static XrpCurrencyAmount recommendedFee(XrplClient xrplClient) {
    try {
      return FeeUtils.computeNetworkFees(xrplClient.fee()).recommendedFee();
    } catch (Exception e) {
      exitWithError("Failed to fetch network fee: " + e.getMessage());
      return null; // unreachable; required by the compiler
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
    } catch (Exception e) {
      exitWithError("Failed to compute next LastLedgerSequence: " + e.getMessage());
      return null; // unreachable; required by the compiler
    }
  }

  // Prints a transaction as a formatted JSON.
  private static void printTransactionJson(Transaction tx) {
    try {
      System.out.println(ObjectMapperFactory.create().writerWithDefaultPrettyPrinter().writeValueAsString(tx));
    } catch (Exception e) {
      exitWithError("Failed to serialize transaction JSON: " + e.getMessage());
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

    try {
      UnsignedInteger lastLedgerSequence = transaction.lastLedgerSequence()
        .orElseThrow(() -> new IllegalArgumentException(
          "must set LastLedgerSequence for polling expiration"));

      SingleSignedTransaction<T> signed = signatureService.sign(signer.privateKey(), transaction);
      SubmitResult<T> submit = xrplClient.submit(signed);

      if (!TransactionResultCodes.TES_SUCCESS.equals(submit.engineResult())) {
        exitWithError("Submit rejected: " + submit.engineResult() + " — " + submit.engineResultMessage());
      }

      while (true) {
        Thread.sleep(1_000L);

        // Poll network for validated status using tx hash
        try {
          TransactionResult<T> result = xrplClient.transaction(
            TransactionRequestParams.of(signed.hash()), transactionType);
          if (result.validated()) {
            return result;
          }
        } catch (JsonRpcClientErrorException e) {
          // Transaction not found; swallow error and continue
        }

        // Check if transaction expired before polling again
        UnsignedInteger currentLedger = xrplClient.ledger(LedgerRequestParams.builder()
            .ledgerSpecifier(LedgerSpecifier.VALIDATED)
            .build())
          .ledgerIndexSafe()
          .unsignedIntegerValue();
        if (currentLedger.compareTo(lastLedgerSequence) > 0) {
          exitWithError("Transaction expired: current ledger index " + currentLedger
            + " passed LastLedgerSequence " + lastLedgerSequence + ".");
        }
      }
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      exitWithError("Transaction polling interrupted: " + e.getMessage());
    } catch (Exception e) {
      exitWithError("Transaction failed: " + e.getMessage());
    }
    return null; // unreachable; required by the compiler
  }

  private static void printFinalResult(String label, Hash256 hash) {
    System.out.println(label + " successfully.");
    System.out.println("Hash:     " + hash);
    System.out.println("Explorer: " + EXPLORER_BASE + hash);
  }

  private static void exitWithError(String message) {
    System.err.println("Error: " + message);
    System.exit(1);
  }
}
