import '../../index.css';

import { Client, Wallet, convertHexToString, dropsToXrp } from 'xrpl';

import addXrplLogo from '../helpers/addXrplLogo';

addXrplLogo();

var values = [];

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
    <th>Fee (XRP)</th>
    <th>Amount</th>
    <th>Transaction Type</th>
    <th>Result</th>
    <th>Link</th>
`;
txHistoryElement.appendChild(header);

// Converts the hex value to a string
const getTokenName = (value) =>
    value.length === 40
        ? convertHexToString(value).replaceAll('\u0000', '')
        : value;

// Fetches the transaction history from the ledger
const fetchTxHistory = async (marker) => {
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

        const { result } = await client.request(payload);

        const { transactions, marker: nextMarker } = result;
        // Add the transactions to the table
        values = [
            ...values,
            ...transactions.map((transaction) => {
                const { meta, tx } = transaction;
                return {
                    Account: tx.Account,
                    Fee: tx.Fee,
                    Amount: tx.Amount,
                    Hash: tx.hash,
                    TransactionType: tx.TransactionType,
                    result: meta?.TransactionResult,
                };
            }),
        ];

        // If there are no transactions, show a message
        if (values.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="6">No transactions found</td>
            `;
            txHistoryElement.appendChild(row);
        } else {
            // Otherwise, show the transactions
            values.forEach((value) => {
                // Create a new row
                const row = document.createElement('tr');

                // Add the transaction details to the row
                row.innerHTML = `
                <td>${value.Account}</td>
               ${value.Fee ? `<td>${dropsToXrp(value.Fee)}</td>` : '-'}
               ${
                   value.Amount
                       ? `<td>${
                             typeof value.Amount === 'object'
                                 ? `${value.Amount.value} ${getTokenName(
                                       value.Amount.currency
                                   )}`
                                 : `${dropsToXrp(value.Amount)} XRP`
                         }</td>`
                       : '-'
               }
                <td>${value.TransactionType}</td>
                <td>${value.result}</td>
                <td><a href="https://${
                    process.env.EXPLORER_NETWORK
                }.xrpl.org/transactions/${
                    value.Hash
                }" target="_blank">View</a></td>
            `;
                // Add the row to the table
                txHistoryElement.appendChild(row);
            });
        }

        // Disconnect
        await client.disconnect();

        // Enable the load more button
        loadMore.textContent = 'Load More';
        loadMore.disabled = false;

        // Return the marker
        return nextMarker;
    } catch (error) {
        console.log(error);
    }
};

const renderTxHistory = async () => {
    // Fetch the transaction history
    const marker = await fetchTxHistory();

    // If there are no more transactions, hide the load more button
    if (!marker) {
        loadMore.style.display = 'none';
    } else {
        // Otherwise, show the load more button
        loadMore.style.display = 'block';
        loadMore.addEventListener('click', async () => {
            const nextMarker = await fetchTxHistory(marker);
            if (!nextMarker) {
                loadMore.style.display = 'none';
            }
        });
    }
};

renderTxHistory();
