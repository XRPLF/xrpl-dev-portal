# Delegate Permissions (JavaScript) Sample Code

These code samples demonstrate how to delegate permissions to another account and how to send an a transaction as a delegate, using xrpl.js 4.3 in Node.js.

## Usage

1. First, install dependencies.

    ```sh
    npm i
    ```

2. Go to the [XRP Faucet](https://xrpl.org/resources/dev-tools/xrp-faucets) and generate a **Devnet** account to be your delegate account.

3. Edit `delegate-permisions.js` and change the following line to use the address you got from the faucet:

    ```js
        const delegate_address = "r9GAKojMTyexqvy8DXFWYq63Mod5k5wnkT"
    ```

4. Run `delegate-permissions.js`.

    ```sh
    node delegate-permissions.js
    ```

    If it runs successfully, it should output several things including "Delegate successfully set." followed by an [account_objects API method](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects) response showing the delegate permissions.

    Take note of the `account` address in this output. That's the address of the delegating account.

5. Run `use-delegate-permissions.js` and provide both the delegating account's address (from the previous step's output) and the delegate's secret key (from the devnet faucet earlier).

    If it runs successfully, it should output various things ending in the following:
    
    ```text
    Transaction successful.
    Domain is example.com
    ```
