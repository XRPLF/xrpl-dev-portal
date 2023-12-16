---
html: enable-public-signing.html
parent: configure-rippled.html
blurb: Allow others to use your server to sign transactions. (Not recommended)
labels:
  - Core Server
  - Security
---
# Enable Public Signing

By default, the signing methods for [`rippled`](../../concepts/networks-and-servers/index.md) are limited to [administrative connections](../../references/http-websocket-apis/admin-api-methods/index.md). If you want to allow signing methods to be used as public API methods (like with versions of `rippled` before v1.1.0), you can enable it with a configuration change. [New in: rippled 1.1.0](https://github.com/XRPLF/rippled/releases/tag/1.1.0 "BADGE_BLUE")

This enables the following methods to be used on "public" [JSON-RPC and WebSocket connections](../../tutorials/get-started/get-started-using-http-websocket-apis.md), if your server accepts them:

- [sign][sign method]
- [sign_for][sign_for method]
- [submit][submit method] (in "sign-and-submit" mode)

You **do not** need to enable public signing to use these methods from an admin connection.

**Caution:** Ripple does not recommend enabling public signing. Like the [wallet_propose method](../../references/http-websocket-apis/admin-api-methods/key-generation-methods/wallet_propose.md), the signing commands do not perform any actions that would require administrative-level permissions, but restricting them to admin connections protects users from irresponsibly sending or receiving secret keys over unsecured communications, or to servers they do not control.

To enable public signing, perform the following steps:

1. Edit your `rippled`'s config file.

    ```
    vim /etc/opt/ripple/rippled.cfg
    ```

    {% partial file="/_snippets/conf-file-location.md" /%}

2. Add the following stanza to your config file, and save the changes:

    ```
    [signing_support]
    true
    ```

3. Restart your `rippled` server:

    ```
    systemctl restart rippled
    ```

## See Also

- **Concepts:**
    - [Transactions](../../concepts/transactions/index.md)
    - [Cryptographic Keys](../../concepts/accounts/cryptographic-keys.md)
- **Tutorials:**
    - [Set Up Secure Signing](../../concepts/transactions/secure-signing.md)
    - [Get Started Using HTTP / WebSocket APIs](../../tutorials/get-started/get-started-using-http-websocket-apis.md)
    - [Get Started Using JavaScript](../../tutorials/get-started/get-started-using-javascript.md)
- **References:**
    - [sign method](../../references/http-websocket-apis/admin-api-methods/signing-methods/sign.md)
    - [sign_for method](../../references/http-websocket-apis/admin-api-methods/signing-methods/sign_for.md)
    - [submit method](../../references/http-websocket-apis/public-api-methods/transaction-methods/submit.md)
