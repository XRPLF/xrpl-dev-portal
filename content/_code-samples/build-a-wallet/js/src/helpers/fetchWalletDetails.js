import { Client, Wallet, dropsToXrp } from 'xrpl';

import { Encode } from 'xrpl-tagged-address-codec';

const walletElement = document.querySelector('#wallet');

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

        // Render the wallet details
        walletElement.querySelector(
            '.wallet_address'
        ).textContent = `Wallet Address: ${account_data.Account}`;
        walletElement.querySelector(
            '.wallet_balance'
        ).textContent = `Wallet Balance: ${dropsToXrp(
            account_data.Balance
        )} XRP`;
        walletElement.querySelector(
            '.wallet_reserve'
        ).textContent = `Wallet Reserve: ${accountReserves} XRP`;

        // Get X-Address
        const tagged = Encode({
            account: wallet.address,
            tag: 1337,
            test: false,
        });

        // Render the X-Address
        walletElement.querySelector(
            '.wallet_xaddress'
        ).textContent = `X-Address: ${tagged}`;

        // Redirect on View More link click
        console.log(walletElement.querySelector('#view_more_button'));
        walletElement
            .querySelector('#view_more_button')
            .addEventListener('click', () => {
                window.open(
                    `https://${process.env.EXPLORER_NETWORK}.xrpl.org/accounts/${wallet.address}`,
                    '_blank'
                );
            });

        // Disconnect the client
        await client.disconnect();
    } catch (error) {
        console.log('Error getting wallet details', error);
    }
};
