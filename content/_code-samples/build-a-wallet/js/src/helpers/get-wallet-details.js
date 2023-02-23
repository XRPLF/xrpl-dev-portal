import { Client, Wallet } from 'xrpl';

import { Encode } from 'xrpl-tagged-address-codec';

export default async function getWalletDetails() {
    try {
        const client = new Client(process.env.CLIENT); // Get the client from the environment variables
        const wallet = Wallet.fromSeed(process.env.SEED); // Convert the seed to a wallet : https://xrpl.org/cryptographic-keys.html

        // Wait for the client to connect
        console.log('Connecting...');
        await client.connect();
        console.log('Connected! Getting wallet details...');

        // Get the wallet details: https://xrpl.org/account_info.html
        const {
            result: { account_data },
        } = await client.request({
            command: 'account_info',
            account: wallet.address,
            ledger_index: 'validated',
        });

        const ownerCount = account_data.OwnerCount || 0;

        // Get the reserve base and increment
        const {
            result: {
                info: {
                    validated_ledger: { reserve_base_xrp, reserve_inc_xrp },
                },
            },
        } = await client.request({
            command: 'server_info',
        });

        // Calculate the reserves by multiplying the owner count by the increment and adding the base reserve to it.
        const accountReserves = (ownerCount + 1) * reserve_inc_xrp + reserve_base_xrp;

        console.log('Got wallet details!');

        // Get X-Address : https://xrpl.org/x-addresses.html
        const tagged = Encode({
            account: wallet.address,
            tag: 1337,
            test: false,
        });

        // Disconnect the client
        await client.disconnect();
        return { account_data, accountReserves, tagged, address: wallet.address };
    } catch (error) {
        console.log('Error getting wallet details', error);
    }
}
