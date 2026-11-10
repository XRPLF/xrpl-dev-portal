// @chunk {"steps": ["import-tag"]}
package com.example.xrpl;

import okhttp3.HttpUrl;
import org.xrpl.xrpl4j.client.JsonRpcClientErrorException;
import org.xrpl.xrpl4j.client.XrplClient;
import org.xrpl.xrpl4j.client.faucet.FaucetClient;
import org.xrpl.xrpl4j.client.faucet.FundAccountRequest;
import org.xrpl.xrpl4j.crypto.keys.KeyPair;
import org.xrpl.xrpl4j.crypto.keys.Seed;
import org.xrpl.xrpl4j.model.client.accounts.AccountInfoRequestParams;
import org.xrpl.xrpl4j.model.client.accounts.AccountInfoResult;
import org.xrpl.xrpl4j.model.client.common.LedgerSpecifier;
import org.xrpl.xrpl4j.model.jackson.ObjectMapperFactory;
import org.xrpl.xrpl4j.model.transactions.Address;
// @chunk-end

/**
 * Connects to the XRP Ledger Testnet, creates and funds a new account, and
 * looks up its account info.
 */
public class GetAccountInfo {

  public static void main(String[] args) {
    try {
      run();
    } catch (Exception e) {
      System.err.println("Error: " + e.getMessage());
      System.exit(1);
    }
  }

  private static void run() throws Exception {
    // @chunk {"steps": ["connect-tag", "connect-mainnet-tag"]}
    // Define the network client
    XrplClient xrplClient = new XrplClient(HttpUrl.get("https://s.altnet.rippletest.net:51234/"));
    // @chunk-end

    // @chunk {"steps": ["get-account-create-wallet-tag"]}
    // Create a wallet and fund it with the Testnet faucet:
    System.out.println("Creating a new wallet and funding it with Testnet XRP...");
    KeyPair keyPair = Seed.ed25519Seed().deriveKeyPair();
    Address address = keyPair.publicKey().deriveAddress();
    FaucetClient faucetClient = FaucetClient.construct(HttpUrl.get("https://faucet.altnet.rippletest.net"));
    faucetClient.fundAccount(FundAccountRequest.of(address));
    waitForFunding(xrplClient, address);
    System.out.println("Wallet: " + address);
    System.out.println("Account Testnet Explorer URL:");
    System.out.println("  https://testnet.xrpl.org/accounts/" + address);
    // @chunk-end

    // To provide your own seed, replace the keyPair value with the below
    // @chunk {"steps": ["get-account-create-wallet-c-tag"]}
    // KeyPair keyPair = Seed.fromBase58EncodedSecret(Base58EncodedSecret.of("your-seed-key")).deriveKeyPair();
    // @chunk-end

    // @chunk {"steps": ["query-xrpl-tag"]}
    // Get info from the ledger about the address we just funded
    System.out.println("\nGetting account info...");
    AccountInfoResult accountInfo = xrplClient.accountInfo(AccountInfoRequestParams.builder()
      .account(address)
      .ledgerSpecifier(LedgerSpecifier.VALIDATED)
      .build());
    System.out.println(ObjectMapperFactory.create().writerWithDefaultPrettyPrinter().writeValueAsString(accountInfo));
    // @chunk-end
  }

  // ===== Helper functions =====

  // Waits until the newly funded account appears in a validated ledger.
  private static void waitForFunding(XrplClient xrplClient, Address address) throws InterruptedException {
    for (int attempt = 0; attempt < 20; attempt++) {
      try {
        xrplClient.accountInfo(AccountInfoRequestParams.builder()
          .account(address)
          .ledgerSpecifier(LedgerSpecifier.VALIDATED)
          .build());
        return;
      } catch (JsonRpcClientErrorException notYetVisible) {
        Thread.sleep(1_000L);
      }
    }
    throw new IllegalStateException("Faucet funding for " + address + " did not confirm in time.");
  }
}
