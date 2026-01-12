import { Wallet, classicAddressToXAddress } from 'xrpl';

export default async function getWalletDetails({ client }) {
    const wallet = Wallet.fromSeed(process.env.SEED);

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

    // Calculate the total reserve amount
    const accountReserve = ownerCount * reserve_inc_xrp + reserve_base_xrp;

    console.log('Got wallet details!');

    return {
        account_data,
        accountReserve,
        xAddress: classicAddressToXAddress(wallet.address, false, false),
        address: wallet.address,
    };
}
