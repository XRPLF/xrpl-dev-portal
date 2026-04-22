package com.example.xrpl;

import com.google.common.primitives.UnsignedInteger;
import okhttp3.HttpUrl;
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
import org.xrpl.xrpl4j.model.client.Finality;
import org.xrpl.xrpl4j.model.client.FinalityStatus;
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

  private static final CredentialType CREDENTIAL_TYPE = CredentialType.ofPlainText("driver-license");

  public static void main(String[] args) {
    XrplClient xrplClient = new XrplClient(HttpUrl.get("https://s.altnet.rippletest.net:51234/"));
    FaucetClient faucetClient = FaucetClient.construct(HttpUrl.get("https://faucet.altnet.rippletest.net"));
    SignatureService<PrivateKey> signatureService = new BcSignatureService();

    System.out.println("\n=== Funding issuer and subject accounts from the Testnet faucet ===\n");
    KeyPair issuer = Seed.ed25519Seed().deriveKeyPair();
    KeyPair subject = Seed.ed25519Seed().deriveKeyPair();
    Address issuerAddress = issuer.publicKey().deriveAddress();
    Address subjectAddress = subject.publicKey().deriveAddress();
    System.out.println("Issuer address:  " + issuerAddress);
    System.out.println("Subject address: " + subjectAddress);

    CompletableFuture.allOf(
      CompletableFuture.runAsync(() -> fundAndAwaitAccount(faucetClient, xrplClient, issuerAddress)),
      CompletableFuture.runAsync(() -> fundAndAwaitAccount(faucetClient, xrplClient, subjectAddress))
    ).join();

    // --- Issue credential ---------------------------------------------------
    System.out.println("\n=== Preparing CredentialCreate transaction ===\n");
    CredentialCreate createTx = CredentialCreate.builder()
      .account(issuerAddress)
      .subject(subjectAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, issuerAddress))
      .fee(recommendedFee(xrplClient))
      .lastLedgerSequence(nextLastLedgerSequence(xrplClient))
      .signingPublicKey(issuer.publicKey())
      .build();
    printTransactionJson(createTx);

    System.out.println("\n=== Submitting CredentialCreate transaction ===\n");
    TransactionResult<CredentialCreate> createResult = signSubmitAwaitFinality(
      xrplClient, signatureService, issuer, createTx, CredentialCreate.class);
    printFinalResult("Credential issued", createResult.hash());

    // --- Subject accepts credential ----------------------------------------
    System.out.println("\n=== Preparing CredentialAccept transaction ===\n");
    CredentialAccept acceptTx = CredentialAccept.builder()
      .account(subjectAddress)
      .issuer(issuerAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, subjectAddress))
      .fee(recommendedFee(xrplClient))
      .lastLedgerSequence(nextLastLedgerSequence(xrplClient))
      .signingPublicKey(subject.publicKey())
      .build();
    printTransactionJson(acceptTx);

    System.out.println("\n=== Submitting CredentialAccept transaction ===\n");
    TransactionResult<CredentialAccept> acceptResult = signSubmitAwaitFinality(
      xrplClient, signatureService, subject, acceptTx, CredentialAccept.class);
    printFinalResult("Credential accepted", acceptResult.hash());

    // --- Subject deletes credential ----------------------------------------
    System.out.println("\n=== Preparing CredentialDelete transaction ===\n");
    CredentialDelete deleteTx = CredentialDelete.builder()
      .account(subjectAddress)
      .issuer(issuerAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, subjectAddress))
      .fee(recommendedFee(xrplClient))
      .lastLedgerSequence(nextLastLedgerSequence(xrplClient))
      .signingPublicKey(subject.publicKey())
      .build();
    printTransactionJson(deleteTx);

    System.out.println("\n=== Submitting CredentialDelete transaction ===\n");
    TransactionResult<CredentialDelete> deleteResult = signSubmitAwaitFinality(
      xrplClient, signatureService, subject, deleteTx, CredentialDelete.class);
    printFinalResult("Credential deleted", deleteResult.hash());
  }

  // Requests faucet funding for `address` and polls `account_info`
  // until the account is visible in a validated ledger.
  private static void fundAndAwaitAccount(
    FaucetClient faucetClient, XrplClient xrplClient, Address address
  ) {
    try {
      faucetClient.fundAccount(FundAccountRequest.of(address));

      for (int attempt = 0; attempt < 30; attempt++) {
        try {
          xrplClient.accountInfo(AccountInfoRequestParams.builder()
            .account(address)
            .ledgerSpecifier(LedgerSpecifier.VALIDATED)
            .build());
          System.out.println("Funded: " + address);
          return;
        } catch (Exception notYetVisible) {
          // Intentional: faucet funding takes a few seconds to confirm, so we
          // poll until account_info succeeds. Any exception here means "not yet
          // visible — retry."
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
  }

  // Fetches the next transaction `Sequence` for `address` from
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
      return null; // unreachable
    }
  }

  // Fetches the current network fee and returns the recommended fee for
  // a standard (non-multisig, non-batch) transaction.
  private static XrpCurrencyAmount recommendedFee(XrplClient xrplClient) {
    try {
      return FeeUtils.computeNetworkFees(xrplClient.fee()).recommendedFee();
    } catch (Exception e) {
      exitWithError("Failed to fetch network fee: " + e.getMessage());
      return null; // unreachable
    }
  }

  // Computes a safe `LastLedgerSequence` for a new transaction — the
  // latest validated ledger index plus a small buffer (20 ledgers).
  private static UnsignedInteger nextLastLedgerSequence(XrplClient xrplClient) {
    try {
      UnsignedInteger validated = xrplClient.ledger(LedgerRequestParams.builder()
          .ledgerSpecifier(LedgerSpecifier.VALIDATED)
          .build())
        .ledgerIndex()
        .orElseThrow(() -> new IllegalStateException("No validated ledger index available."))
        .unsignedIntegerValue();
      return validated.plus(UnsignedInteger.valueOf(20));
    } catch (Exception e) {
      exitWithError("Failed to compute next LastLedgerSequence: " + e.getMessage());
      return null; // unreachable
    }
  }

  private static void printTransactionJson(Transaction tx) {
    try {
      System.out.println(ObjectMapperFactory.create().writerWithDefaultPrettyPrinter().writeValueAsString(tx));
    } catch (Exception e) {
      exitWithError("Failed to serialize transaction JSON: " + e.getMessage());
    }
  }

  // Signs and submits a transaction, then polls XrplClient#isFinal until
  // the transaction reaches a terminal state (validated success, validated
  // failure, or expired).
  private static <T extends Transaction> TransactionResult<T> signSubmitAwaitFinality(
    XrplClient xrplClient,
    SignatureService<PrivateKey> signatureService,
    KeyPair signer,
    T transaction,
    Class<T> transactionType
  ) {
    final long pollIntervalMs = 4_000L;
    final int maxAttempts = 10;

    try {
      SingleSignedTransaction<T> signed = signatureService.sign(signer.privateKey(), transaction);
      SubmitResult<T> submit = xrplClient.submit(signed);

      if (!TransactionResultCodes.TES_SUCCESS.equals(submit.engineResult())) {
        exitWithError("Submit rejected: " + submit.engineResult() + " — " + submit.engineResultMessage());
      }

      UnsignedInteger lastLedgerSequence = transaction.lastLedgerSequence()
        .orElseThrow(() -> new IllegalArgumentException(
          "Transaction must set LastLedgerSequence for finality polling."));

      for (int attempt = 0; attempt < maxAttempts; attempt++) {
        Thread.sleep(pollIntervalMs);

        Finality finality = xrplClient.isFinal(
          signed.hash(),
          submit.validatedLedgerIndex(),
          lastLedgerSequence,
          transaction.sequence(),
          signer.publicKey().deriveAddress());

        if (finality.finalityStatus() == FinalityStatus.VALIDATED_SUCCESS) {
          return xrplClient.transaction(
            TransactionRequestParams.of(signed.hash()), transactionType);
        }

        if (finality.finalityStatus() != FinalityStatus.NOT_FINAL) {
          exitWithError("Transaction did not succeed: " + finality.finalityStatus()
            + " (" + finality.resultCode().orElse("unknown") + ")");
        }
      }
      exitWithError("Transaction did not reach finality within "
        + (maxAttempts * pollIntervalMs / 1000) + " seconds.");
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      exitWithError("Transaction polling interrupted: " + e.getMessage());
    } catch (Exception e) {
      exitWithError("Transaction failed: " + e.getMessage());
    }
    return null; // unreachable — all failure paths call exitWithError which terminates the JVM
  }

  private static void printFinalResult(String label, Hash256 hash) {
    System.out.println(label + " successfully.");
    System.out.println("Hash:     " + hash);
    System.out.println("Explorer: https://testnet.xrpl.org/transactions/" + hash);
  }

  private static void exitWithError(String message) {
    System.err.println("Error: " + message);
    System.exit(1);
  }
}
