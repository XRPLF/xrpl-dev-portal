import { Client } from 'xrpl';

export default async function getLedgerDetails() {
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
