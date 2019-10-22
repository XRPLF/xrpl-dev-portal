# Enable Public Signing

By default, the signing methods for [`rippled`](the-rippled-server.html) are limited to [administrative connections](admin-rippled-methods.html). If you want to allow signing methods to be used as public API methods (like with versions of `rippled` before v1.1.0), you can enable it with a configuration change. [New in: rippled 1.1.0][]

This enables the following methods to be used on "public" [JSON-RPC and WebSocket connections](get-started-with-the-rippled-api.html), if your server accepts them:

- [sign][sign method]
- [sign_for][sign_for method]
- [submit][submit method] (in "sign-and-submit" mode)

You **do not** need to enable public signing to use these methods from an admin connection.

**Caution:** Ripple does not recommend enabling public signing. Like the [wallet_propose method][], the signing commands do not perform any actions that would require administrative-level permissions, but restricting them to admin connections protects users from irresponsibly sending or receiving secret keys over unsecured communications, or to servers they do not control.

To enable public signing, perform the following steps:

1. Edit your `rippled`'s config file.

        vim /etc/opt/ripple/rippled.cfg

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

2. Add the following stanza to your config file, and save the changes:

        [signing_support]
        true

3. Restart your `rippled` server:

        systemctl restart rippled

## See Also

- **Concepts:**
    - [Transaction Basics](transaction-basics.html)
    - [Cryptographic Keys](cryptographic-keys.html)
- **Tutorials:**
    - [Set Up Secure Signing](set-up-secure-signing.html)
    - [Get Started with the rippled API](get-started-with-the-rippled-api.html)
    - [Get Started with RippleAPI for JavaScript](get-started-with-rippleapi-for-javascript.html)
- **References:**
    - [sign method][]
    - [sign_for method][]
    - [submit method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
