// Stand-alone code sample for the "issue a token" tutorial:
// https://xrpl.org/issue-a-fungible-token.html
// License: https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.primitives.UnsignedInteger;
import com.google.common.primitives.UnsignedLong;
import okhttp3.HttpUrl;
import org.xrpl.xrpl4j.client.JsonRpcClientErrorException;
import org.xrpl.xrpl4j.client.XrplClient;
import org.xrpl.xrpl4j.client.faucet.FaucetClient;
import org.xrpl.xrpl4j.client.faucet.FundAccountRequest;
import org.xrpl.xrpl4j.crypto.KeyMetadata;
import org.xrpl.xrpl4j.crypto.PrivateKey;
import org.xrpl.xrpl4j.crypto.signing.SignatureService;
import org.xrpl.xrpl4j.crypto.signing.SignedTransaction;
import org.xrpl.xrpl4j.crypto.signing.SingleKeySignatureService;
import org.xrpl.xrpl4j.model.client.accounts.AccountInfoRequestParams;
import org.xrpl.xrpl4j.model.client.accounts.AccountLinesRequestParams;
import org.xrpl.xrpl4j.model.client.accounts.TrustLine;
import org.xrpl.xrpl4j.model.client.common.LedgerIndex;
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
import org.xrpl.xrpl4j.wallet.DefaultWalletFactory;
import org.xrpl.xrpl4j.wallet.Wallet;
import org.xrpl.xrpl4j.wallet.WalletFactory;

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


    // Create cold and hot Wallets using a WalletFactory -----------------------
    WalletFactory walletFactory = DefaultWalletFactory.getInstance();
    Wallet coldWallet = walletFactory.randomWallet(true).wallet();
    Wallet hotWallet = walletFactory.randomWallet(true).wallet();

    // Fund the account using the testnet Faucet -------------------------------
    FaucetClient faucetClient = FaucetClient
      .construct(HttpUrl.get("https://faucet.altnet.rippletest.net"));
    faucetClient.fundAccount(FundAccountRequest.of(coldWallet.classicAddress()));
    faucetClient.fundAccount(FundAccountRequest.of(hotWallet.classicAddress()));

    // If you go too soon, the funding transaction might slip back a ledger and
    // then your starting Sequence number will be off. This is mostly relevant
    // when you want to use a Testnet account right after getting a reply from
    // the faucet.
    boolean accountsFunded = false;
    while (!accountsFunded) {
      try {
        xrplClient.accountInfo(
          AccountInfoRequestParams.builder()
            .ledgerIndex(LedgerIndex.VALIDATED)
            .account(coldWallet.classicAddress())
            .build()
        );

        xrplClient.accountInfo(
          AccountInfoRequestParams.builder()
            .ledgerIndex(LedgerIndex.VALIDATED)
            .account(hotWallet.classicAddress())
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
        .ledgerIndex(LedgerIndex.CURRENT)
        .account(coldWallet.classicAddress())
        .build()
    ).accountData().sequence();

    AccountSet setDefaultRipple = AccountSet.builder()
      .account(coldWallet.classicAddress())
      .fee(feeResult.drops().minimumFee())
      .sequence(coldWalletSequence)
      .signingPublicKey(coldWallet.publicKey())
      .setFlag(AccountSet.AccountSetFlag.DEFAULT_RIPPLE)
      .lastLedgerSequence(computeLastLedgerSequence(xrplClient))
      .build();

    PrivateKey coldWalletPrivateKey = PrivateKey.fromBase16EncodedPrivateKey(
      coldWallet.privateKey().get()
    );
    SignatureService coldWalletSignatureService = new SingleKeySignatureService(coldWalletPrivateKey);

    SignedTransaction<AccountSet> signedSetDefaultRipple = coldWalletSignatureService.sign(
      KeyMetadata.EMPTY,
      setDefaultRipple
    );

    submitAndWaitForValidation(signedSetDefaultRipple, xrplClient);

    // Configure hot address settings ------------------------------------------
    UnsignedInteger hotWalletSequence = xrplClient.accountInfo(
      AccountInfoRequestParams.builder()
        .ledgerIndex(LedgerIndex.CURRENT)
        .account(hotWallet.classicAddress())
        .build()
    ).accountData().sequence();

    AccountSet setRequireAuth = AccountSet.builder()
      .account(hotWallet.classicAddress())
      .fee(feeResult.drops().minimumFee())
      .sequence(hotWalletSequence)
      .signingPublicKey(hotWallet.publicKey())
      .setFlag(AccountSet.AccountSetFlag.REQUIRE_AUTH)
      .lastLedgerSequence(computeLastLedgerSequence(xrplClient))
      .build();

    PrivateKey hotWalletPrivateKey = PrivateKey.fromBase16EncodedPrivateKey(
      hotWallet.privateKey().get()
    );
    SignatureService hotWalletSignatureService = new SingleKeySignatureService(hotWalletPrivateKey);

    SignedTransaction<AccountSet> signedSetRequireAuth = hotWalletSignatureService.sign(
      KeyMetadata.EMPTY,
      setRequireAuth
    );

    submitAndWaitForValidation(signedSetRequireAuth, xrplClient);

    // Create trust line -------------------------------------------------------
    String currencyCode = "FOO";
    ImmutableTrustSet trustSet = TrustSet.builder()
      .account(hotWallet.classicAddress())
      .fee(feeResult.drops().openLedgerFee())
      .sequence(hotWalletSequence.plus(UnsignedInteger.ONE))
      .limitAmount(IssuedCurrencyAmount.builder()
        .currency(currencyCode)
        .issuer(coldWallet.classicAddress())
        .value("10000000000")
        .build())
      .signingPublicKey(hotWallet.publicKey())
      .build();

    SignedTransaction<TrustSet> signedTrustSet = hotWalletSignatureService.sign(
      KeyMetadata.EMPTY,
      trustSet
    );

    submitAndWaitForValidation(signedTrustSet, xrplClient);

    // Send token --------------------------------------------------------------
    Payment payment = Payment.builder()
      .account(coldWallet.classicAddress())
      .fee(feeResult.drops().openLedgerFee())
      .sequence(coldWalletSequence.plus(UnsignedInteger.ONE))
      .destination(hotWallet.classicAddress())
      .amount(IssuedCurrencyAmount.builder()
        .issuer(coldWallet.classicAddress())
        .currency(currencyCode)
        .value("3840")
        .build())
      .signingPublicKey(coldWallet.publicKey())
      .build();

    SignedTransaction<Payment> signedPayment = coldWalletSignatureService.sign(
      KeyMetadata.EMPTY,
      payment
    );

    submitAndWaitForValidation(signedPayment, xrplClient);

    // Check balances ----------------------------------------------------------
    List<TrustLine> lines = xrplClient.accountLines(
      AccountLinesRequestParams.builder()
        .account(hotWallet.classicAddress())
        .ledgerIndex(LedgerIndex.VALIDATED)
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
        .ledgerIndex(LedgerIndex.VALIDATED)
        .build()
    )
      .ledgerIndex()
      .orElseThrow(() -> new RuntimeException("LedgerIndex not available."));

    // Workaround for https://github.com/XRPLF/xrpl4j/issues/84
    return UnsignedInteger.valueOf(
      validatedLedger.plus(UnsignedLong.valueOf(4)).unsignedLongValue().intValue()
    );
  }

  private static void submitAndWaitForValidation(SignedTransaction<?> signedTransaction, XrplClient xrplClient)
    throws InterruptedException, JsonRpcClientErrorException, JsonProcessingException {

    xrplClient.submit(signedTransaction);

    boolean transactionValidated = false;
    boolean transactionExpired = false;
    while (!transactionValidated && !transactionExpired) {
      Thread.sleep(4 * 1000);
      LedgerIndex latestValidatedLedgerIndex = xrplClient.ledger(
        LedgerRequestParams.builder().ledgerIndex(LedgerIndex.VALIDATED).build()
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
        boolean lastLedgerSequenceHasPassed = FluentCompareTo.
          is(latestValidatedLedgerIndex.unsignedLongValue())
          .greaterThan(UnsignedLong.valueOf(
            signedTransaction.signedTransaction().lastLedgerSequence().get().intValue()
            )
          );
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
