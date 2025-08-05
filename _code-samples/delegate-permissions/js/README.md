# Delegate Permissions (JavaScript) Sample Code

These code samples demonstrate how to delegate permissions to another account and how to send an a transaction as a delegate, using xrpl.js 4.3 in Node.js.

## Usage

1. Install dependencies.

    ```sh
    npm i
    ```

2. Run `delegate-permisions.js`.

    ```sh
    node delegate-permissions.js
    ```

    If it runs successfully, it should output several things including "Delegate successfully set." followed by an [account_objects API method](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects) response showing the delegate permissions.

    Take note of the **Delegator address** and **Delegate seed** from the output.

3. Run `use-delegate-permissions.js` and provide both the delegator's address and the delegate's secret key that were output in the previous step.

    If it runs successfully, it should output various things ending in the following:
    
    ```text
    Transaction successful.
    Domain is example.com
    ```
