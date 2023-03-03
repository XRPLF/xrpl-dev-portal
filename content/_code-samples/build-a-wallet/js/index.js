import addXrplLogo from './src/helpers/render-xrpl-logo';
import { dropsToXrp } from 'xrpl';
import getLedgerDetails from './src/helpers/get-ledger-details.js';
import getWalletDetails from './src/helpers/get-wallet-details.js';

// Optional: Render the XRPL logo
addXrplLogo();

// Get the elements from the DOM
const sendXrpButton = document.querySelector('#send_xrp_button');
const txHistoryButton = document.querySelector('#transaction_history_button');
const walletElement = document.querySelector('#wallet');
const walletLoadingDiv = document.querySelector('#loading_wallet_details');
const ledgerLoadingDiv = document.querySelector('#loading_ledger_details');

// Add event listeners to the buttons
sendXrpButton.addEventListener('click', () => {
    window.location.pathname = '/src/send-xrp/send-xrp.html';
});

txHistoryButton.addEventListener('click', () => {
    window.location.pathname = '/src/transaction-history/transaction-history.html';
});

// Fetch the wallet details
getWalletDetails()
    .then(({ account_data, accountReserves, tagged, address }) => {
        walletElement.querySelector('.wallet_address').textContent = `Wallet Address: ${account_data.Account}`;
        walletElement.querySelector('.wallet_balance').textContent = `Wallet Balance: ${dropsToXrp(account_data.Balance)} XRP`;
        walletElement.querySelector('.wallet_reserve').textContent = `Wallet Reserve: ${accountReserves} XRP`;
        walletElement.querySelector('.wallet_xaddress').textContent = `X-Address: ${tagged}`;

        // Redirect on View More link click
        walletElement.querySelector('#view_more_button').addEventListener('click', () => {
            window.open(`https://${process.env.EXPLORER_NETWORK}.xrpl.org/accounts/${address}`, '_blank');
        });
    })
    .finally(() => {
        walletLoadingDiv.style.display = 'none';
    });

// Fetch the latest ledger details
async function getAndRenderDetails() {
    const ledger = await getLedgerDetails();
    const ledgerIndex = document.querySelector('#ledger_index');
    const ledgerHash = document.querySelector('#ledger_hash');
    const closeTime = document.querySelector('#close_time');
    ledgerIndex.textContent = `Ledger Index: ${ledger.result.ledger_index}`;
    ledgerHash.textContent = `Ledger Hash: ${ledger.result.ledger_hash}`;
    closeTime.textContent = `Close Time: ${ledger.result.ledger.close_time_human}`;
    ledgerLoadingDiv.style.display = 'none';
}

// On page load, get the latest ledger details
getAndRenderDetails();

// Every 4 seconds, get the latest ledger details
setInterval(() => {
    getAndRenderDetails();
}, 4000);
