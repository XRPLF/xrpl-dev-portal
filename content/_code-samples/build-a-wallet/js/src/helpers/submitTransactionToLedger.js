import { Client, Wallet } from 'xrpl';

export const submitTransactionToLedger = async ({ tx }) => {
    try {
        const client = new Client(process.env.CLIENT);
        // Wait for the client to connect
        await client.connect();

        // Create a wallet using the seed
        const wallet = await Wallet.fromSeed(process.env.SEED);
        tx.Account = wallet.address;

        // Sign and submit the transaction
        const response = await client.submit(tx, { wallet });
        console.log(response);

        // Disconnect from the client
        await client.disconnect();

        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};
