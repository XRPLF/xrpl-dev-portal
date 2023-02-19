import './index.css';

import addXrplLogo from './src/helpers/addXrplLogo';
import { fetchLatestLedgerDetails } from './src/helpers/getLatestLedgerDetails.js';
import { fetchWalletDetails } from './src/helpers/fetchWalletDetails.js';

addXrplLogo();

// Get the elements from the DOM
const sendXrpButton = document.querySelector('#send_xrp_button');
const txHistoryButton = document.querySelector('#transaction_history_button');

// Add event listeners to the buttons

sendXrpButton.addEventListener('click', () => {
    window.location.pathname = '/src/send-xrp/send-xrp.html';
});

txHistoryButton.addEventListener('click', () => {
    window.location.pathname =
        '/src/transaction-history/transaction-history.html';
});

// Fetch the wallet details
fetchWalletDetails();

// Fetch the latest ledger details
fetchLatestLedgerDetails();
