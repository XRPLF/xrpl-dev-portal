---
html: python.html
parent: tutorials.html
top_nav_grouping: Article Types
---
# Python

You can create your own interface to try out the capabilities and support your specific business needs. These tutorials build a test harness interface to try out features of the XRP Ledger. The harness displays multiple accounts, so that you can transfer tokens from one account to the other and see the results in real time.

Typically, the example functions involve four steps.

- Connect to the XRP Ledger and instantiate your wallet.
- Make changes to the XRP Ledger using transactions.
- Get the state of accounts and tokens on the XRP Ledger using requests.
- Disconnect from the XRP Ledger.

Each lesson builds the Token Test Harness one section at a time, with complete Python code that incrementally builds a user interface and separate files that contain the business logic. After describing usage, each lesson provides a code walkthrough. You can download the source code, manipulate it in your favorite IDE, and run it to interact with the XRP Ledger.

Once familiar with the library functions, you can build sample applications in Python. We anticipate that the applications you build greatly improve upon these examples. Your feedback and contributions are most welcome.

To get started:

- Create a new folder on your local disk and install the Python library (xrpl-py) using pip.
<br/><br/>
   `pip3 install xrpl-py`

- Clone or download the [Sample modules](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/quickstart/py/).

**Note**: Without the sample modules, you won't be able to try the examples that follow.

## Tutorial Modules

- **Send Payments on the XRPL**

   - [Create Accounts and Send XRP](./modular-tutorials/send-payments/create-accounts-send-xrp/)
   - [Create TrustLine and Send Currency](./modular-tutorials/send-payments/create-trust-line-send-currency/)
   - [Create Time-based Escrows](./modular-tutorials/send-payments/create-time-based-escrows/)
   - [Create Conditional Escrows](./modular-tutorials/send-payments/create-conditional-escrows/)
   - [Send Checks](./modular-tutorials/send-payments/send-checks/)

- **Mint and Trade NFTs on the XRPL**
   - [Mint and Burn NFTs](./modular-tutorials/nfts/mint-and-burn-nfts/)
   - [Transfer NFTs](./modular-tutorials/nfts/transfer-nfts/)
   - [Broker an NFT Sale](./modular-tutorials/nfts/broker-an-nft-sale/)
   - [Assign an Authorized Minter](./modular-tutorials/nfts/assign-an-authorized-minter/)
   - [Batch Mint NFTs](./modular-tutorials/nfts/batch-mint-nfts)

- **Build Applications with Python**
   - [Get Started Using Python](./get-started/)
   - [Build a Desktop Wallet in Python](./build-a-desktop-wallet-in-python/)
 
 
