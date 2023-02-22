import addXrplLogo from './src/helpers/addXrplLogo';
import { dropsToXrp } from 'xrpl';
import { fetchLatestLedgerDetails } from './src/helpers/getLatestLedgerDetails.js';
import { fetchWalletDetails } from './src/helpers/fetchWalletDetails.js';

addXrplLogo();

// Get the elements from the DOM
const sendXrpButton = document.querySelector('#send_xrp_button');
const txHistoryButton = document.querySelector('#transaction_history_button');
const walletElement = document.querySelector('#wallet');

// Add event listeners to the buttons

sendXrpButton.addEventListener('click', () => {
    window.location.pathname = '/src/send-xrp/send-xrp.html';
});

txHistoryButton.addEventListener('click', () => {
    window.location.pathname =
        '/src/transaction-history/transaction-history.html';
});

// Fetch the wallet details
fetchWalletDetails().then(({ account_data, accountReserves, tagged, address }) => {
    walletElement.querySelector(
        '.wallet_address'
    ).textContent = `Wallet Address: ${account_data.Account}`;
    walletElement.querySelector(
        '.wallet_balance'
    ).textContent = `Wallet Balance: ${dropsToXrp(
        account_data.Balance
    )} XRP`;
    walletElement.querySelector(
        '.wallet_reserve'
    ).textContent = `Wallet Reserve: ${accountReserves} XRP`;

    // Render the X-Address
    walletElement.querySelector(
        '.wallet_xaddress'
    ).textContent = `X-Address: ${tagged}`;

    // Redirect on View More link click
    walletElement
        .querySelector('#view_more_button')
        .addEventListener('click', () => {
            window.open(
                `https://${process.env.EXPLORER_NETWORK}.xrpl.org/accounts/${address}`,
                '_blank'
            );
        });
});

// Fetch the latest ledger details
fetchLatestLedgerDetails();
