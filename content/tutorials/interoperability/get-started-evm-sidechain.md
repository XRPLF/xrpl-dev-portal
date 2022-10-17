---
html: get-started-evm-sidechain.html
parent: evm-sidechains.html
blurb: Get started with the EVM compatible sidechain for the XRP Ledger.
labels:
  - Development, Interoperability
status: not_enabled
---
# Get Started with the EVM Sidechain

This getting started tutorial walks you through the steps to set up your account and transfer funds using the EVM sidechain bridge. 

## 1. Create an Account Using an EVM Compatible Wallet

In order to interact with the network, you need to create an account in the EVM sidechain. To create and manage this account you can use any EVM compatible wallet such as MetaMask.

For instructions on how to install and create an account using MetaMask, then send and receive tokens, see [Connect MetaMask to XRP Ledger EVM Sidechain](connect-metamask-to-xrpl-evm-sidechain.html).

## 2. Move XRP Ledger Devnet Tokens to the EVM Sidechain

Before you can start interacting with the EVM blockchain, you need to transfer some tokens from the XRP Ledger Devnet to the EVM sidechain. 

To obtain tokens in the XRP Ledger Devnet, go to the [XRP Faucets](xrp-testnet-faucet.html) page and click *Generate Devnet credentials* to generate a new Devnet account with some test XRP in it.

![Generate XRP Ledger Devnet credentials](img/evm-sidechain-xrpl-devnet-faucet.png "Generate XRP Ledger Devnet credentials")

Note the address and secret associated with your Devnet address. You need this information to set up your preferred XRP Ledger wallet. 

## 3. Transfer Funds Using the EVM Sidechain Bridge

Once you have your accounts set up and test fund allocated, you can use the EVM Sidechain bridge to move the test XRP tokens to the EVM Sidechain. 

The EVM Sidechain bridge is a tool that allows you to transfer funds between chains in a fast and secure way.

To start using the bridge, go to [https://bridge.devnet.xrpl.org](https://bridge.devnet.xrpl.org/)

### 1. Connect Both Wallets

**Connect Xumm Wallet**

Use your Xumm wallet to interact with the XRP Ledger Devnet chain. 
Ensure that you have created an account on the public XRP Ledger Devnet as described in Step 1. 

To connect a Xumm wallet to the bridge, go to the [EVM Sidechain bridge](https://bridge.devnet.xrpl.org) and click “Connect with Xumm Wallet”. 

![Connect XUMM Wallet](img/evm-sidechain-connect-xumm-wallet.png "Connect XUMM wallet")


**Note:** Ensure that you are connected to XRP Ledger Devnet and that the application that you are connecting with is the correct one.

Follow the instructions on screen to scan the QR code using the Xumm app. The Xumm wallet app displays a confirmation page.

![Connect to XRP Ledger Devnet](img/evm-sidechain-bridge-sign-in.jpg "Connect to XRP Ledger Devnet")

**Connect MetaMask Wallet**

Use your MetaMask wallet to interact with the XRP Ledger EVM Sidechain. 
Ensure that you have created a MetaMask account and connected to the public XRP Ledger Devnet as described in [Connect MetaMask to XRP Ledger EVM Sidechain](connect-metamask-to-xrpl-evm-sidechain.html).

To connect a MetaMask wallet to the bridge, go to the [EVM Sidechain bridge](https://bridge.devnet.xrpl.org) and click “Connect with Metamask Wallet”.

![Connect MetaMask Wallet](img/evm-sidechain-connect-metamask.png "Connect MetaMask wallet")

### 2. Initiate the Transfer of Funds 

Now that both Xumm and MetaMask wallets are connected to the bridge, you can select the direction of the bridge, the amount to send, and the destination address.

- **Direction of the bridge**: This is the direction of transfer; it can be either EVM sidechain → XRP Ledger Devnet or XRP Ledger Devnet → EVM sidechain. Use the “Switch Network” button to switch the direction of transfer.
- **Amount to send**: This is the amount that you want to transfer to the other side. Note that there is a fee to use the bridge.
    - Network fees: The fees required by the network for your transactions.
    - Commission: The bridge applies a commission for every transaction completed. This is to prevent spam and distributed denial of service attacks (DDOS).
- **Destination address**: The address on the destination chain where you want to receive funds.

    ![Initiate the transaction](img/evm-sidechain-initiate-transfer.png "Initiate the transaction")

Enter the details for your transaction and click **Transfer**. Review the details of the transaction carefully before accepting the transaction in the corresponding wallet. 

![Approve the transaction](img/evm-sidechain-approve-transaction.png "Approve the transaction")

Depending on the direction of the transfer, you need to approve the transaction in the Xumm Wallet or in the Metamask.

**XRP Ledger Devnet → EVM sidechain**

For this direction you must approve the transaction in your Xumm Wallet. Before doing so, please check that the details are correct:

- Destination address has to be: `radjmEZTb4zsyNUJGV4gcVPXrFTJAuskKa`
- Memo has to be the same address that you entered in the destination field

    ![Review the transaction](img/evm-sidechain-review-transaction.jpg)

**EVM sidechain → XRP Ledger Devnet**

If this is the case, then you must approve the transaction in your Metamask. Before doing so, please check the details are correct:

- Destination address has to be: `0x8cDE56336E289c028C8f7CF5c20283fF02272182`

    ![Review the transaction in MetaMask](img/evm-sidechain-metamask-confirmation.png "Review the transaction in MetaMask")


Once you approve the transaction either in Xumm wallet or in Metamask, a loading screen displays. This process can take up to a few minutes.

![Transaction in progress](img/evm-sidechain-transfer-in-progress.png "Transaction in progress")

### 3. Receive the Funds

Following a few minutes of transaction processing time, you are redirected to the **Transaction Confirmation** screen where you can verify the details of the bridge transaction.

- **Origin transaction hash**: Hash of the transaction in the origin chain.
- **Destination transaction hash**: Hash of the transaction in the destination chain.
- **From address**: Origin address of the transfer.
- **To address**: Destination address of the transfer.
- **Receive**: The amount received in the destination address.

![Transaction confirmation](img/evm-sidechain-transaction-confirmation.png "Transaction confirmation")

Your test XRP tokens have been successfully transferred and are now available in the other chain.