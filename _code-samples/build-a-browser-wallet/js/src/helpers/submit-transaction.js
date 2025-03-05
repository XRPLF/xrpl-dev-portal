import { Wallet } from 'xrpl';

export default async function submitTransaction({ client, tx }) {
    try {
        // Create a wallet using the seed
        const wallet = Wallet.fromSeed(process.env.SEED);
        tx.Account = wallet.address;

        // Sign and submit the transaction
        const response = await client.submit(tx, { wallet });
        console.log(response);

        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}
