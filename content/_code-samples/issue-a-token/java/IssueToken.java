// Stand-alone code sample for the "issue a token" tutorial:
// https://xrpl.org/issue-a-fungible-token.html
// License: https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE

import com.fasterxml.jackson.core.JsonProcessingException;
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
import org.xrpl.xrpl4j.model.client.accounts.AccountLinesRequestParams;
import org.xrpl.xrpl4j.model.client.accounts.TrustLine;
import org.xrpl.xrpl4j.model.client.common.LedgerIndex;
import org.xrpl.xrpl4j.model.client.common.LedgerSpecifier;
import org.xrpl.xrpl4j.model.client.fees.FeeResult;
import org.xrpl.xrpl4j.model.client.ledger.LedgerRequestParams;
import org.xrpl.xrpl4j.model.client.transactions.TransactionRequestParams;
import org.xrpl.xrpl4j.model.client.transactions.TransactionResult;
import org.xrpl.xrpl4j.model.immutables.FluentCompareTo;
import org.xrpl.xrpl4j.model.transactions.AccountSet;
import org.xrpl.xrpl4j.model.transactions.ImmutableTrustSet;
import org.xrpl.xrpl4j.model.transactions.IssuedCurrencyAmount;
import org.xrpl.xrpl4j.model.transactions.Payment;
import org.xrpl.xrpl4j.model.transactions.TrustSet;

import java.util.List;

public class IssueToken {

  public static void main(String[] args)
    throws InterruptedException, JsonRpcClientErrorException, JsonProcessingException {
    // Construct a network client ----------------------------------------------
    HttpUrl rippledUrl = HttpUrl
      .get("https://s.altnet.rippletest.net:51234/");
    XrplClient xrplClient = new XrplClient(rippledUrl);
    // Get the current network fee
    FeeResult feeResult = xrplClient.fee();


    // Create cold and hot KeyPairs -----------------------
    KeyPair coldWalletKeyPair = Seed.ed25519Seed().deriveKeyPair();
    KeyPair hotWalletKeyPair = Seed.ed25519Seed().deriveKeyPair();

    // Fund the account using the testnet Faucet -------------------------------
    FaucetClient faucetClient = FaucetClient
      .construct(HttpUrl.get("https://faucet.altnet.rippletest.net"));
    faucetClient.fundAccount(FundAccountRequest.of(coldWalletKeyPair.publicKey().deriveAddress()));
    faucetClient.fundAccount(FundAccountRequest.of(hotWalletKeyPair.publicKey().deriveAddress()));

    // If you go too soon, the funding transaction might slip back a ledger and
    // then your starting Sequence number will be off. This is mostly relevant
    // when you want to use a Testnet account right after getting a reply from
    // the faucet.
    boolean accountsFunded = false;
    while (!accountsFunded) {
      try {
        xrplClient.accountInfo(
          AccountInfoRequestParams.builder()
            .ledgerSpecifier(LedgerSpecifier.VALIDATED)
            .account(coldWalletKeyPair.publicKey().deriveAddress())
            .build()
        );

        xrplClient.accountInfo(
          AccountInfoRequestParams.builder()
            .ledgerSpecifier(LedgerSpecifier.VALIDATED)
            .account(hotWalletKeyPair.publicKey().deriveAddress())
            .build()
        );

        accountsFunded = true;
      } catch (JsonRpcClientErrorException e) {
        if (!e.getMessage().equals("Account not found.")) {
          throw e;
        }
        Thread.sleep(1000);
      }
    }

    // Configure issuer settings -----------------------------------------------
    UnsignedInteger coldWalletSequence = xrplClient.accountInfo(
      AccountInfoRequestParams.builder()
        .ledgerSpecifier(LedgerSpecifier.CURRENT)
        .account(coldWalletKeyPair.publicKey().deriveAddress())
        .build()
    ).accountData().sequence();

    AccountSet setDefaultRipple = AccountSet.builder()
      .account(coldWalletKeyPair.publicKey().deriveAddress())
      .fee(feeResult.drops().minimumFee())
      .sequence(coldWalletSequence)
      .signingPublicKey(coldWalletKeyPair.publicKey())
      .setFlag(AccountSet.AccountSetFlag.DEFAULT_RIPPLE)
      .lastLedgerSequence(computeLastLedgerSequence(xrplClient))
      .build();

    SignatureService<PrivateKey> signatureService = new BcSignatureService();
    SingleSignedTransaction<AccountSet> signedAccountSet = signatureService.sign(
      coldWalletKeyPair.privateKey(), setDefaultRipple
    );

    submitAndWaitForValidation(signedAccountSet, xrplClient);

    // Configure hot address settings ------------------------------------------
    UnsignedInteger hotWalletSequence = xrplClient.accountInfo(
      AccountInfoRequestParams.builder()
        .ledgerSpecifier(LedgerSpecifier.CURRENT)
        .account(hotWalletKeyPair.publicKey().deriveAddress())
        .build()
    ).accountData().sequence();

    AccountSet setRequireAuth = AccountSet.builder()
      .account(hotWalletKeyPair.publicKey().deriveAddress())
      .fee(feeResult.drops().minimumFee())
      .sequence(hotWalletSequence)
      .signingPublicKey(hotWalletKeyPair.publicKey())
      .setFlag(AccountSet.AccountSetFlag.REQUIRE_AUTH)
      .lastLedgerSequence(computeLastLedgerSequence(xrplClient))
      .build();

    SingleSignedTransaction<AccountSet> signedSetRequireAuth = signatureService.sign(
      hotWalletKeyPair.privateKey(), setRequireAuth
    );
    submitAndWaitForValidation(signedSetRequireAuth, xrplClient);

    // Create trust line -------------------------------------------------------
    String currencyCode = "FOO";
    ImmutableTrustSet trustSet = TrustSet.builder()
      .account(hotWalletKeyPair.publicKey().deriveAddress())
      .fee(feeResult.drops().openLedgerFee())
      .sequence(hotWalletSequence.plus(UnsignedInteger.ONE))
      .limitAmount(IssuedCurrencyAmount.builder()
        .currency(currencyCode)
        .issuer(coldWalletKeyPair.publicKey().deriveAddress())
        .value("10000000000")
        .build())
      .signingPublicKey(hotWalletKeyPair.publicKey())
      .build();

    SingleSignedTransaction<TrustSet> signedTrustSet = signatureService.sign(
      hotWalletKeyPair.privateKey(), trustSet
    );

    submitAndWaitForValidation(signedTrustSet, xrplClient);

    // Send token --------------------------------------------------------------
    Payment payment = Payment.builder()
      .account(coldWalletKeyPair.publicKey().deriveAddress())
      .fee(feeResult.drops().openLedgerFee())
      .sequence(coldWalletSequence.plus(UnsignedInteger.ONE))
      .destination(hotWalletKeyPair.publicKey().deriveAddress())
      .amount(IssuedCurrencyAmount.builder()
        .issuer(coldWalletKeyPair.publicKey().deriveAddress())
        .currency(currencyCode)
        .value("3840")
        .build())
      .signingPublicKey(coldWalletKeyPair.publicKey())
      .build();

    SingleSignedTransaction<Payment> signedPayment = signatureService.sign(
      coldWalletKeyPair.privateKey(), payment
    );

    submitAndWaitForValidation(signedPayment, xrplClient);

    // Check balances ----------------------------------------------------------
    List<TrustLine> lines = xrplClient.accountLines(
      AccountLinesRequestParams.builder()
        .account(hotWalletKeyPair.publicKey().deriveAddress())
        .ledgerSpecifier(LedgerSpecifier.VALIDATED)
        .build()
    ).lines();
    System.out.println("Hot wallet TrustLines: " + lines);
  }

  // Helper methods ------------------------------------------------------------
  private static UnsignedInteger computeLastLedgerSequence(XrplClient xrplClient)
    throws JsonRpcClientErrorException {
    // Get the latest validated ledger index
    LedgerIndex validatedLedger = xrplClient.ledger(
        LedgerRequestParams.builder()
          .ledgerSpecifier(LedgerSpecifier.VALIDATED)
          .build()
      )
      .ledgerIndex()
      .orElseThrow(() -> new RuntimeException("LedgerIndex not available."));

    // Workaround for https://github.com/XRPLF/xrpl4j/issues/84
    return UnsignedInteger.valueOf(
      validatedLedger.plus(UnsignedInteger.valueOf(4)).unsignedIntegerValue().intValue()
    );
  }

  private static void submitAndWaitForValidation(SingleSignedTransaction<?> signedTransaction, XrplClient xrplClient)
    throws InterruptedException, JsonRpcClientErrorException, JsonProcessingException {

    xrplClient.submit(signedTransaction);

    boolean transactionValidated = false;
    boolean transactionExpired = false;
    while (!transactionValidated && !transactionExpired) {
      Thread.sleep(1000);
      LedgerIndex latestValidatedLedgerIndex = xrplClient.ledger(
          LedgerRequestParams.builder().ledgerSpecifier(LedgerSpecifier.VALIDATED).build()
        )
        .ledgerIndex()
        .orElseThrow(() ->
          new RuntimeException("Ledger response did not contain a LedgerIndex.")
        );

      TransactionResult<Payment> transactionResult = xrplClient.transaction(
        TransactionRequestParams.of(signedTransaction.hash()),
        Payment.class
      );

      if (transactionResult.validated()) {
        System.out.println("Transaction was validated with result code " +
          transactionResult.metadata().get().transactionResult());
        transactionValidated = true;
      } else {

        boolean lastLedgerSequenceHasPassed = signedTransaction.signedTransaction().lastLedgerSequence()
          .map((signedTransactionLastLedgerSeq) ->
            FluentCompareTo.is(latestValidatedLedgerIndex.unsignedIntegerValue())
              .greaterThan(signedTransactionLastLedgerSeq)
          )
          .orElse(false);

        if (lastLedgerSequenceHasPassed) {
          System.out.println("LastLedgerSequence has passed. Last tx response: " +
            transactionResult);
          transactionExpired = true;
        } else {
          System.out.println("Transaction not yet validated.");
        }
      }
    }
  }
}
