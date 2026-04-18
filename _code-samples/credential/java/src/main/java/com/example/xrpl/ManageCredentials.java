package com.example.xrpl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.xrpl.xrpl4j.model.client.fees.FeeResult;
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

/**
 * This code sample demonstrates the Credential lifecycle on the XRPL.
 * It funds two accounts, issues a credential from one to the other,
 * accepts the credential, and then deletes it.
 */
public class ManageCredentials {

  private static final HttpUrl TESTNET_RIPPLED_URL =
    HttpUrl.get("https://s.altnet.rippletest.net:51234/");

  private static final HttpUrl TESTNET_FAUCET_URL =
    HttpUrl.get("https://faucet.altnet.rippletest.net");

  private static final String EXPLORER_BASE_URL = "https://testnet.xrpl.org/transactions/";

  private static final CredentialType CREDENTIAL_TYPE =
    CredentialType.ofPlainText("driver-license");

  private static final UnsignedInteger LAST_LEDGER_OFFSET = UnsignedInteger.valueOf(20);

  private static final long FUNDING_POLL_INTERVAL_MS = 1_000L;
  private static final int FUNDING_MAX_ATTEMPTS = 30;
  private static final long VALIDATION_POLL_INTERVAL_MS = 4_000L;
  private static final int VALIDATION_MAX_ATTEMPTS = 10;

  private static final ObjectMapper JSON_MAPPER = ObjectMapperFactory.create();

  public static void main(String[] args)
    throws JsonRpcClientErrorException, JsonProcessingException, InterruptedException {

    XrplClient xrplClient = new XrplClient(TESTNET_RIPPLED_URL);
    FaucetClient faucetClient = FaucetClient.construct(TESTNET_FAUCET_URL);
    SignatureService<PrivateKey> signatureService = new BcSignatureService();

    System.out.println("\n=== Funding issuer and subject accounts from the Testnet faucet ===\n");
    KeyPair issuer = Seed.ed25519Seed().deriveKeyPair();
    KeyPair subject = Seed.ed25519Seed().deriveKeyPair();
    Address issuerAddress = issuer.publicKey().deriveAddress();
    Address subjectAddress = subject.publicKey().deriveAddress();
    System.out.println("Issuer address:  " + issuerAddress);
    System.out.println("Subject address: " + subjectAddress);

    fundAndAwaitAccount(faucetClient, xrplClient, issuerAddress);
    fundAndAwaitAccount(faucetClient, xrplClient, subjectAddress);

    // Fee is fetched once and reused across transactions in this short-lived
    // sample. FeeUtils picks a reasonable fee based on current ledger load.
    FeeResult feeResult = xrplClient.fee();

    // --- Issue credential ---------------------------------------------------
    System.out.println("\n=== Preparing CredentialCreate transaction ===\n");
    CredentialCreate createTx = CredentialCreate.builder()
      .account(issuerAddress)
      .subject(subjectAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, issuerAddress))
      .fee(FeeUtils.computeNetworkFees(feeResult).recommendedFee())
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
      .fee(FeeUtils.computeNetworkFees(feeResult).recommendedFee())
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
      .fee(FeeUtils.computeNetworkFees(feeResult).recommendedFee())
      .lastLedgerSequence(nextLastLedgerSequence(xrplClient))
      .signingPublicKey(subject.publicKey())
      .build();
    printTransactionJson(deleteTx);

    System.out.println("\n=== Submitting CredentialDelete transaction ===\n");
    TransactionResult<CredentialDelete> deleteResult = signSubmitAwaitFinality(
      xrplClient, signatureService, subject, deleteTx, CredentialDelete.class);
    printFinalResult("Credential deleted", deleteResult.hash());
  }

  /**
   * Requests faucet funding for {@code address} and polls {@code account_info}
   * until the account is visible in a validated ledger.
   */
  private static void fundAndAwaitAccount(
    FaucetClient faucetClient, XrplClient xrplClient, Address address
  ) throws InterruptedException {
    faucetClient.fundAccount(FundAccountRequest.of(address));

    for (int attempt = 0; attempt < FUNDING_MAX_ATTEMPTS; attempt++) {
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
        Thread.sleep(FUNDING_POLL_INTERVAL_MS);
      }
    }
    exitWithError("Faucet funding for " + address + " did not confirm in time.");
  }

  /**
   * Fetches the next transaction {@code Sequence} for {@code address} from
   * the latest validated ledger.
   */
  private static UnsignedInteger accountSequence(XrplClient xrplClient, Address address)
    throws JsonRpcClientErrorException, JsonProcessingException {
    AccountInfoResult info = xrplClient.accountInfo(AccountInfoRequestParams.builder()
      .account(address)
      .ledgerSpecifier(LedgerSpecifier.VALIDATED)
      .build());
    return info.accountData().sequence();
  }

  /**
   * Computes a safe {@code LastLedgerSequence} for a new transaction — the
   * latest validated ledger index plus {@link #LAST_LEDGER_OFFSET}.
   */
  private static UnsignedInteger nextLastLedgerSequence(XrplClient xrplClient)
    throws JsonRpcClientErrorException, JsonProcessingException {
    UnsignedInteger validated = xrplClient.ledger(LedgerRequestParams.builder()
        .ledgerSpecifier(LedgerSpecifier.VALIDATED)
        .build())
      .ledgerIndex()
      .orElseThrow(() -> new IllegalStateException("No validated ledger index available."))
      .unsignedIntegerValue();
    return validated.plus(LAST_LEDGER_OFFSET);
  }

  /**
   * Signs and submits a transaction, then polls {@link XrplClient#isFinal} until
   * the transaction reaches a terminal state (validated success, validated
   * failure, or expired).
   */
  private static <T extends Transaction> TransactionResult<T> signSubmitAwaitFinality(
    XrplClient xrplClient,
    SignatureService<PrivateKey> signatureService,
    KeyPair signer,
    T transaction,
    Class<T> transactionType
  ) throws JsonRpcClientErrorException, JsonProcessingException, InterruptedException {
    SingleSignedTransaction<T> signed = signatureService.sign(signer.privateKey(), transaction);
    SubmitResult<T> submit = xrplClient.submit(signed);

    if (!TransactionResultCodes.TES_SUCCESS.equals(submit.engineResult())) {
      exitWithError("Submit rejected: " + submit.engineResult() + " — " + submit.engineResultMessage());
    }

    UnsignedInteger lastLedgerSequence = transaction.lastLedgerSequence()
      .orElseThrow(() -> new IllegalArgumentException(
        "Transaction must set LastLedgerSequence for finality polling."));

    for (int attempt = 0; attempt < VALIDATION_MAX_ATTEMPTS; attempt++) {
      Thread.sleep(VALIDATION_POLL_INTERVAL_MS);

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
      + (VALIDATION_MAX_ATTEMPTS * VALIDATION_POLL_INTERVAL_MS / 1000) + " seconds.");
    return null; // unreachable — exitWithError terminates the process
  }

  private static void printTransactionJson(Transaction tx) throws JsonProcessingException {
    System.out.println(JSON_MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(tx));
  }

  private static void printFinalResult(String label, Hash256 hash) {
    System.out.println(label + " successfully.");
    System.out.println("Hash:     " + hash);
    System.out.println("Explorer: " + EXPLORER_BASE_URL + hash);
  }

  private static void exitWithError(String message) {
    System.err.println("Error: " + message);
    System.exit(1);
  }
}
