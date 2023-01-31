import { Client, Payment } from 'xrpl';

/**
 * When implementing Reliable Transaction Submission, there are many potential solutions, each with different trade-offs.
 * The main decision points are:
 * 1) Transaction preparation:
 *    - The autofill function as a part of the submitAndWait should be able to correctly populate
 *      values for the fields Sequence, LastLedgerSequence and Fee.
 * 2) Transaction status retrieval. Options include:
 *    - Poll for transaction status:
 *      - On a regular interval (e.g. Every 3-5 seconds), or
 *      - When a new validated ledger is detected
 *      + (To accommodate an edge case in transaction retrieval,
 *         check the sending account's Sequence number to confirm that it has the expected value;
 *         alternatively, wait until a few additional ledgers have been validated before deciding that a
 *         transaction has definitively not been included in a validated ledger)
 *    - Listen for transaction status: scan all validated transactions to see if our transactions are among them
 * 3) What do we do when a transaction fails? It is possible to implement retry logic, but caution is advised.
 *  Note that there are a few ways for a transaction to fail:
 *    A) `tec`: The transaction was included in a ledger but only claimed the transaction fee
 *    B) `tesSUCCESS` but unexpected result: The transaction was successful but did not have the expected result.
 *        This generally does not occur for XRP-to-XRP payments
 *    C) The transaction was not, and never will be, included in a validated ledger [3C].
 *
 * References:
 * - https://xrpl.org/reliable-transaction-submission.html
 * - https://xrpl.org/send-xrp.html
 * - https://xrpl.org/look-up-transaction-results.html
 * - https://xrpl.org/monitor-incoming-payments-with-websocket.html.
 *
 * For the implementation in this example, we have made the following decisions:
 * 1) We allow the autofill function as a part of submitAndWait to fill up the account sequence,
 *    LastLedgerSequence and Fee. Payments are defined upfront, and idempotency is not needed.
 *    If the script is run a second time, duplicate payments will result.
 * 2) We will rely on the xrpl.js submitAndWait function to get us the transaction submission result after the wait time.
 * 3) Transactions will not be automatically retried. Transactions are limited to XRP-to-XRP payments
 *     and cannot "succeed" in an unexpected way.
 */

const client = new Client("wss://s.altnet.rippletest.net:51233");

void sendReliableTx();

async function sendReliableTx(): Promise<void> {
  await client.connect();

  // creating wallets as prerequisite
  const { wallet: wallet1 } = await client.fundWallet();
  const { wallet: wallet2 } = await client.fundWallet();

  console.log("Balances of wallets before Payment tx");

  console.log(`Balance of ${wallet1.classicAddress} is ${await client.getXrpBalance(wallet1.classicAddress)}XRP`);
  console.log(`Balance of ${wallet2.classicAddress} is ${await client.getXrpBalance(wallet2.classicAddress)}XRP`);

  // create a Payment tx and submit and wait for tx to be validated
  const payment: Payment = {
    TransactionType: "Payment",
    Account: wallet1.classicAddress,
    Amount: "1000",
    Destination: wallet2.classicAddress,
  };

  console.log("Submitting a Payment transaction...")
  const paymentResponse = await client.submitAndWait(payment, {
    wallet: wallet1,
  });
  console.log("\nTransaction was submitted.\n");
  const txResponse = await client.request({
    command: "tx",
    transaction: paymentResponse.result.hash,
  });
  // With the following reponse we are able to see that the tx was indeed validated.
  console.log("Validated:", txResponse.result.validated);

  console.log("Balances of wallets after Payment tx:");
  console.log(`Balance of ${wallet1.classicAddress} is ${await client.getXrpBalance(wallet1.classicAddress)}XRP`);
  console.log(`Balance of ${wallet2.classicAddress} is ${await client.getXrpBalance(wallet2.classicAddress)}XRP`);

  await client.disconnect();
}
