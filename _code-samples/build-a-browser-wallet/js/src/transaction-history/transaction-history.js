import { Client, Wallet, convertHexToString, dropsToXrp } from 'xrpl';

import renderXrplLogo from '../helpers/render-xrpl-logo';

// Optional: Render the XRPL logo
renderXrplLogo();

// Declare the variables
let marker = null;

// Get the elements from the DOM
const txHistoryElement = document.querySelector('#tx_history_data');
const sendXrpButton = document.querySelector('#send_xrp_button');
const homeButton = document.querySelector('#home_button');
const loadMore = document.querySelector('#load_more_button');

// Add event listeners to the buttons
sendXrpButton.addEventListener('click', () => {
    window.location.pathname = '/src/send-xrp/send-xrp.html';
});

homeButton.addEventListener('click', () => {
    window.location.pathname = '/index.html';
});

// Add the header to the table
const header = document.createElement('tr');
header.innerHTML = `
    <th>Account</th>
    <th>Destination</th>
    <th>Fee (XRP)</th>
    <th>Amount Delivered</th>
    <th>Transaction Type</th>
    <th>Result</th>
    <th>Link</th>
`;
txHistoryElement.appendChild(header);

// Converts the hex value to a string
function getTokenName(currencyCode) {
    if (!currencyCode) return "";
    if (currencyCode.length === 3 && currencyCode.trim().toLowerCase() !== 'xrp') {
        // "Standard" currency code
        return currencyCode.trim();
    }
    if (currencyCode.match(/^[a-fA-F0-9]{40}$/)) {
        // Hexadecimal currency code
        const text_code = convertHexToString(value).replaceAll('\u0000', '')
        if (text_code.match(/[a-zA-Z0-9]{3,}/) && text_code.trim().toLowerCase() !== 'xrp') {
            // ASCII or UTF-8 encoded alphanumeric code, 3+ characters long
            return text_code;
        }
        // Other hex format, return as-is.
        // For parsing other rare formats, see https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/_code-samples/normalize-currency-codes/js/normalize-currency-code.js
        return currencyCode;
    }
    return "";
}

function renderAmount(delivered) {
    if (delivered === 'unavailable') {
        // special case for pre-2014 partial payments
        return 'unavailable';
    } else if (typeof delivered === 'string') {
        // It's an XRP amount in drops. Convert to decimal.
        return `${dropsToXrp(delivered)} XRP`;
    } else if (typeof delivered === 'object') {
        // It's a token amount.
        return `${delivered.value} ${getTokenName(delivered.currency)}.${delivered.issuer}`;
    } else {
        // Could be undefined -- not all transactions deliver value
        return "-"
    }
}

// Fetches the transaction history from the ledger
async function fetchTxHistory() {
    try {
        loadMore.textContent = 'Loading...';
        loadMore.disabled = true;
        const wallet = Wallet.fromSeed(process.env.SEED);
        const client = new Client(process.env.CLIENT);

        // Wait for the client to connect
        await client.connect();

        // Get the transaction history
        const payload = {
            command: 'account_tx',
            account: wallet.address,
            limit: 10,
        };

        if (marker) {
            payload.marker = marker;
        }

        // Wait for the response: use the client.request() method to send the payload
        const { result } = await client.request(payload);

        const { transactions, marker: nextMarker } = result;

        // Add the transactions to the table
        const values = transactions.map((transaction) => {
            const { meta, tx } = transaction;
            return {
                Account: tx.Account,
                Destination: tx.Destination,
                Fee: tx.Fee,
                Hash: tx.hash,
                TransactionType: tx.TransactionType,
                result: meta?.TransactionResult,
                delivered: meta?.delivered_amount
            };
        });

        // If there are no more transactions, hide the load more button
        loadMore.style.display = nextMarker ? 'block' : 'none';

        // If there are no transactions, show a message
        // Create a new row: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
        // Add the row to the table: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild

        if (values.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6">No transactions found</td>`;
            txHistoryElement.appendChild(row);
        } else {
            // Otherwise, show the transactions by iterating over each transaction and adding it to the table
            values.forEach((value) => {
                const row = document.createElement('tr');
                // Add the transaction details to the row
                row.innerHTML = `
                ${value.Account ? `<td>${value.Account}</td>` : '-'}
                ${value.Destination ? `<td>${value.Destination}</td>` : '-'}
                ${value.Fee ? `<td>${dropsToXrp(value.Fee)}</td>` : '-'}
                ${renderAmount(value.delivered)}
                ${value.TransactionType ? `<td>${value.TransactionType}</td>` : '-'}
                ${value.result ? `<td>${value.result}</td>` : '-'}
                ${value.Hash ? `<td><a href="https://${process.env.EXPLORER_NETWORK}.xrpl.org/transactions/${value.Hash}" target="_blank">View</a></td>` : '-'}`;
                // Add the row to the table
                txHistoryElement.appendChild(row);
            });
        }

        // Disconnect
        await client.disconnect();

        // Enable the load more button only if there are more transactions
        loadMore.textContent = 'Load More';
        loadMore.disabled = false;

        // Return the marker
        return nextMarker ?? null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Render the transaction history
async function renderTxHistory() {
    // Fetch the transaction history
    marker = await fetchTxHistory();
    loadMore.addEventListener('click', async () => {
        const nextMarker = await fetchTxHistory();
        marker = nextMarker;
    });
}

// Call the renderTxHistory() function
renderTxHistory();
