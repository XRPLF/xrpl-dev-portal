import { Client } from 'xrpl';

const fetchLedgerData = async () => {
    try {
        const client = new Client(process.env.CLIENT);

        // Wait for the client to connect
        console.log('Connecting...');
        await client.connect();
        console.log('Connected! Getting latest ledger details...');

        // Get the latest ledger details
        const ledger = await client.request({
            command: 'ledger',
            ledger_index: 'validated',
            full: false,
            accounts: false,
            transactions: false,
            expand: false,
            owner_funds: false,
        });

        // Disconnect the client
        await client.disconnect();

        // Return the latest ledger details
        console.log('Got latest ledger details!');
        return ledger;
    } catch (error) {
        console.log('Error getting latest ledger details', error);
        return error;
    }
};

async function getAndRenderDetails() {
    const ledger = await fetchLedgerData();
    const ledgerIndex = document.querySelector('#ledger_index');
    const ledgerHash = document.querySelector('#ledger_hash');
    const closeTime = document.querySelector('#close_time');
    ledgerIndex.textContent = `Ledger Index: ${ledger.result.ledger_index}`;
    ledgerHash.textContent = `Ledger Hash: ${ledger.result.ledger_hash}`;
    closeTime.textContent = `Close Time: ${ledger.result.ledger.close_time_human}`;
}

export const fetchLatestLedgerDetails = async () => {
    window.onload = function () {
        // On page load, get the latest ledger details
        getAndRenderDetails();

        // Every 4 seconds, get the latest ledger details
        setInterval(() => {
            getAndRenderDetails();
        }, 4000);
    };
};
