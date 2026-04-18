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
import org.xrpl.xrpl4j.model.client.fees.FeeResult;
import org.xrpl.xrpl4j.model.client.ledger.LedgerRequestParams;
import org.xrpl.xrpl4j.model.client.transactions.SubmitResult;
import org.xrpl.xrpl4j.model.client.transactions.TransactionRequestParams;
import org.xrpl.xrpl4j.model.client.transactions.TransactionResult;
import org.xrpl.xrpl4j.model.transactions.Address;
import org.xrpl.xrpl4j.model.transactions.CredentialAccept;
import org.xrpl.xrpl4j.model.transactions.CredentialCreate;
import org.xrpl.xrpl4j.model.transactions.CredentialDelete;
import org.xrpl.xrpl4j.model.transactions.CredentialType;
import org.xrpl.xrpl4j.model.transactions.Transaction;

/**
 * Demonstrates the full Credential lifecycle on the XRPL Testnet:
 * fund an issuer and a subject account, issue a credential from the issuer
 * to the subject, have the subject accept it, then delete it.
 *
 * <p>As of 2026, Credentials are enabled on Testnet and Devnet.
 */
public class ManageCredentials {

  private static final HttpUrl TESTNET_RIPPLED_URL =
    HttpUrl.get("https://s.altnet.rippletest.net:51234/");

  private static final HttpUrl TESTNET_FAUCET_URL =
    HttpUrl.get("https://apex-faucet.altnet.rippletest.net");

  private static final CredentialType CREDENTIAL_TYPE =
    CredentialType.ofPlainText("driver-license");

  private static final UnsignedInteger LAST_LEDGER_OFFSET = UnsignedInteger.valueOf(20);

  private static final long FUNDING_POLL_INTERVAL_MS = 1_000L;
  private static final int FUNDING_MAX_ATTEMPTS = 30;
  private static final long VALIDATION_POLL_INTERVAL_MS = 4_000L;

  public static void main(String[] args) throws Exception {
    XrplClient xrplClient = new XrplClient(TESTNET_RIPPLED_URL);
    FaucetClient faucetClient = FaucetClient.construct(TESTNET_FAUCET_URL);
    SignatureService<PrivateKey> signatureService = new BcSignatureService();

    // --- Create and fund wallets -----------------------------------------
    System.out.println("Creating issuer and subject wallets...");
    KeyPair issuer = Seed.ed25519Seed().deriveKeyPair();
    KeyPair subject = Seed.ed25519Seed().deriveKeyPair();
    Address issuerAddress = issuer.publicKey().deriveAddress();
    Address subjectAddress = subject.publicKey().deriveAddress();
    System.out.println("Issuer:  " + issuerAddress);
    System.out.println("Subject: " + subjectAddress);

    fundAndAwaitAccount(faucetClient, xrplClient, issuerAddress);
    fundAndAwaitAccount(faucetClient, xrplClient, subjectAddress);

    FeeResult feeResult = xrplClient.fee();

    // --- Issue credential ------------------------------------------------
    System.out.println("\nIssuing credential from issuer to subject...");
    CredentialCreate createTx = CredentialCreate.builder()
      .account(issuerAddress)
      .subject(subjectAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, issuerAddress))
      .fee(feeResult.drops().openLedgerFee())
      .lastLedgerSequence(nextLastLedgerSequence(xrplClient))
      .signingPublicKey(issuer.publicKey())
      .build();

    TransactionResult<CredentialCreate> createResult = signAndAwaitValidation(
      xrplClient, signatureService, issuer, createTx, CredentialCreate.class
    );
    System.out.println("Credential issued. Hash: " + createResult.hash());

    // --- Subject accepts credential --------------------------------------
    System.out.println("\nSubject accepting credential...");
    CredentialAccept acceptTx = CredentialAccept.builder()
      .account(subjectAddress)
      .issuer(issuerAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, subjectAddress))
      .fee(feeResult.drops().openLedgerFee())
      .lastLedgerSequence(nextLastLedgerSequence(xrplClient))
      .signingPublicKey(subject.publicKey())
      .build();

    TransactionResult<CredentialAccept> acceptResult = signAndAwaitValidation(
      xrplClient, signatureService, subject, acceptTx, CredentialAccept.class
    );
    System.out.println("Credential accepted. Hash: " + acceptResult.hash());

    // --- Subject deletes credential --------------------------------------
    System.out.println("\nSubject deleting credential...");
    CredentialDelete deleteTx = CredentialDelete.builder()
      .account(subjectAddress)
      .issuer(issuerAddress)
      .credentialType(CREDENTIAL_TYPE)
      .sequence(accountSequence(xrplClient, subjectAddress))
      .fee(feeResult.drops().openLedgerFee())
      .lastLedgerSequence(nextLastLedgerSequence(xrplClient))
      .signingPublicKey(subject.publicKey())
      .build();

    TransactionResult<CredentialDelete> deleteResult = signAndAwaitValidation(
      xrplClient, signatureService, subject, deleteTx, CredentialDelete.class
    );
    System.out.println("Credential deleted. Hash: " + deleteResult.hash());
  }

  /**
   * Requests faucet funding for {@code address} and polls {@code account_info}
   * until the account is visible in a validated ledger.
   */
  private static void fundAndAwaitAccount(
    FaucetClient faucetClient, XrplClient xrplClient, Address address
  ) throws Exception {
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
        Thread.sleep(FUNDING_POLL_INTERVAL_MS);
      }
    }
    throw new IllegalStateException("Faucet funding for " + address + " did not confirm in time.");
  }

  private static UnsignedInteger accountSequence(XrplClient xrplClient, Address address)
    throws Exception {
    AccountInfoResult info = xrplClient.accountInfo(AccountInfoRequestParams.builder()
      .account(address)
      .ledgerSpecifier(LedgerSpecifier.VALIDATED)
      .build());
    return info.accountData().sequence();
  }

  private static UnsignedInteger nextLastLedgerSequence(XrplClient xrplClient) throws Exception {
    UnsignedInteger validated = xrplClient.ledger(LedgerRequestParams.builder()
        .ledgerSpecifier(LedgerSpecifier.VALIDATED)
        .build())
      .ledgerIndex()
      .orElseThrow(() -> new IllegalStateException("No validated ledger index available."))
      .unsignedIntegerValue();
    return validated.plus(LAST_LEDGER_OFFSET);
  }

  /**
   * Signs, submits, and polls until the transaction is validated or its
   * {@code LastLedgerSequence} has passed.
   */
  private static <T extends Transaction> TransactionResult<T> signAndAwaitValidation(
    XrplClient xrplClient,
    SignatureService<PrivateKey> signatureService,
    KeyPair signer,
    T transaction,
    Class<T> transactionType
  ) throws Exception {
    SingleSignedTransaction<T> signed = signatureService.sign(signer.privateKey(), transaction);
    SubmitResult<T> submit = xrplClient.submit(signed);

    if (!"tesSUCCESS".equals(submit.engineResult())) {
      throw new IllegalStateException(
        "Submit failed: " + submit.engineResult() + " - " + submit.engineResultMessage()
      );
    }

    UnsignedInteger lastLedgerSequence = transaction.lastLedgerSequence()
      .orElseThrow(() -> new IllegalArgumentException(
        "Transaction must set LastLedgerSequence for reliable validation polling."
      ));

    while (true) {
      Thread.sleep(VALIDATION_POLL_INTERVAL_MS);

      TransactionResult<T> result = xrplClient.transaction(
        TransactionRequestParams.of(signed.hash()), transactionType
      );
      if (result.validated()) {
        return result;
      }

      UnsignedInteger latest = xrplClient.ledger(LedgerRequestParams.builder()
          .ledgerSpecifier(LedgerSpecifier.VALIDATED)
          .build())
        .ledgerIndex()
        .orElseThrow(() -> new IllegalStateException("No validated ledger index available."))
        .unsignedIntegerValue();

      if (latest.compareTo(lastLedgerSequence) > 0) {
        throw new IllegalStateException(
          "LastLedgerSequence passed before " + transactionType.getSimpleName() + " was validated."
        );
      }
    }
  }
}
