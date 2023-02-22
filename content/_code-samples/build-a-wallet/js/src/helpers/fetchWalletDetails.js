import { Client, Wallet } from 'xrpl';

import { Encode } from 'xrpl-tagged-address-codec';

export const fetchWalletDetails = async () => {
    try {
        const client = new Client(process.env.CLIENT);
        const wallet = Wallet.fromSeed(process.env.SEED);
        // Wait for the client to connect
        console.log('Connecting...');
        await client.connect();
        console.log('Connected! Getting wallet details...');

        // Get the wallet details
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

        // Calculate the reserve
        const accountReserves =
            (ownerCount + 1) * reserve_inc_xrp + reserve_base_xrp;

        console.log('Got wallet details!');

        // Get X-Address
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
};
