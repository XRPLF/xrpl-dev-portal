import { Client, Wallet, classicAddressToXAddress } from 'xrpl';

export default async function getWalletDetails({ client }) {
    try {
        const wallet = Wallet.fromSeed(process.env.SEED); // Convert the seed to a wallet : https://xrpl.org/cryptographic-keys.html

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
        const accountReserves = ownerCount * reserve_inc_xrp + reserve_base_xrp;

        console.log('Got wallet details!');

        return { 
            account_data, 
            accountReserves, 
            xAddress: classicAddressToXAddress(wallet.address, false, false), // Learn more: https://xrpaddress.info/
            address: wallet.address 
        };
    } catch (error) {
        console.log('Error getting wallet details', error);
        return error;
    }
}
