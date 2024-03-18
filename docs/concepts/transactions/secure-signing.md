---
html: secure-signing.html
parent: transactions.html
seo:
    description: Set up an environment where you can submit transactions securely.
labels:
  - Security
  - Development
---
# Secure Signing

To submit [transactions](index.md) to the XRP Ledger, you need a way to digitally sign them without compromising the security of your [secret keys](../accounts/cryptographic-keys.md). (If others gain access to your secret keys, they have as much control over your accounts as you do, and can steal or destroy all your money.) This page summarizes how to set up such an environment so you can sign transactions securely.

**Tip:** If you are not submitting transactions to the network, you can safely use a trustworthy public server, such as the ones run by Ripple, to monitor for incoming transactions or read other network activity. All transactions, balances, and data in the XRP Ledger are public.

There are several configurations with varying levels of security that may be acceptable for your situation. Choose one of the following that best fits your needs:

- [Run `rippled` locally](#run-rippled-locally), or [in the same LAN](#run-rippled-on-the-same-lan).
- [Use a client library](#use-a-client-library-with-local-signing) that can do local signing.
- [Use a dedicated signing device](#use-a-dedicated-signing-device) that supports XRP Ledger signatures.
- [Use a secure VPN to connect to a remote `rippled` machine](#use-a-secure-vpn-with-a-remote-rippled-server) you trust.

<!-- Source for all diagrams in this article: https://drive.google.com/drive/u/0/folders/1MFkzxtMYpS8tzdm-TjWbLSVgU0zAG9Vh -->

## Insecure Configurations

[{% inline-svg file="/docs/img/insecure-signing-options.svg" /%}](/docs/img/insecure-signing-options.svg "Diagram of insecure configurations")

Any configuration in which outside sources may gain access to your secret key is dangerous, and is likely to result in a malicious user stealing all your XRP (and anything else your XRP Ledger address has). Examples of such configurations include ones where you use the [sign method][] of someone else's `rippled` server over the internet, or you send your secret key in plain text over the internet to your own server.

You should maintain the secrecy of your secret keys at all times, which includes things like not emailing them to yourself, not typing them visibly in public, and saving them encrypted—never in plain text—when you are not using them. The balance between security and convenience depends in part on the value of your addresses' holdings, so you may want to use multiple addresses with different security configurations for different purposes.

<!-- Note: I'd link "issuing and operational addresses" for an explanation of hot/cold wallet security, but it's particularly gateway/issued-currency centric, which is not appropriate for this context. -->


## Run rippled Locally

[{% inline-svg file="/docs/img/secure-signing-local-rippled.svg" /%}](/docs/img/secure-signing-local-rippled.svg "Diagram of using a local rippled server for signing")

In this configuration, you run `rippled` on the machine that generates the transactions.  Since the secret key never leaves your machine, no one without access to your machine can get access to the secret key. You should, of course, follow industry-standard practices for securing your machine. To use this configuration:

1. [Install `rippled`](../../infrastructure/installation/index.md).

    Be sure that your local machine meets the minimum [system requirements for `rippled`](../../infrastructure/installation/system-requirements.md).

2. When you need to sign transactions, connect to your server on `localhost` or `127.0.0.1`. Use the [sign method][] (for single signatures) or [sign_for method][] (for multi-signatures).

    The [example config file](https://github.com/XRPLF/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/cfg/rippled-example.cfg#L1050-L1073) listens for connections on the local loopback network (127.0.0.1), with JSON-RPC (HTTP) on port 5005 and WebSocket (WS) on port 6006, and treats all connected clients as admin.

    **Caution:** Using the [commandline API](../../references/http-websocket-apis/api-conventions/request-formatting.md#commandline-format) for signatures is less secure than [using the Websocket or JSON-RPC APIs](../../tutorials/http-websocket-apis/build-apps/get-started.md) through non-commandline clients. When using the commandline syntax, your secret key may be visible to other users in the system's process listing, and your shell history may save the key in plain text.

3. Maintain the server to keep it running, updated, and in sync with the network while you're using it.

    **Note:** You _can_ turn off your `rippled` server when you're not sending transactions, but it can take up to 15 minutes to sync with the network when you start it up again.


## Run rippled on the same LAN

[{% inline-svg file="/docs/img/secure-signing-lan-rippled.svg" /%}](/docs/img/secure-signing-lan-rippled.svg "Diagram of using a rippled server over LAN for signing")

In this configuration, you run a `rippled` server on a dedicated machine in the same private local area network (LAN) as the machine that generates the transactions to be signed. This configuration lets you assemble transaction instructions on one or more machines with very modest system specs, while using a single dedicated machine for running `rippled`. This may appeal to you if you run your own datacenter or server room.

To use this configuration, set the `rippled` server to accept `wss` and `https` connections within your LAN. You can use a self-signed certificate if you use [certificate pinning](https://en.wikipedia.org/wiki/Transport_Layer_Security#Certificate_pinning), or you can use a certificate signed by an in-house or well-known Certificate Authority. Some certificate authorities, such as [Let's Encrypt](https://letsencrypt.org/) issue certificates automatically for free.

<!--{# TODO: link api-over-lan.html with the detailed instructions when those are ready #}-->

As always, follow industry-standard practices for securing your machines, such as using a firewall, anti-virus, appropriate user permissions, and so on.


## Use a Client Library with Local Signing

[{% inline-svg file="/docs/img/secure-signing-client-library.svg" /%}](/docs/img/secure-signing-client-library.svg "Diagram of using a client library with local signing")

This configuration uses a client library with built-in signing, in the programming language you use. For a list of libraries that can perform local signing, see [Client Libraries](../../references/client-libraries.md).


### Security Best Practices for Signing Libraries

To optimize the security of your signing library:

* Make sure the signing library you use has properly and securely implemented its signing algorithm(s). For example, if the library uses the default ECDSA algorithm, it should also use deterministic nonces as described in [RFC-6979](https://tools.ietf.org/html/rfc6979).

    All of the published libraries listed above follow industry best practices.


* Keep your client library updated to the latest stable version.

* For enhanced security, you can load your secret keys from a management tool such as [Vault](https://www.vaultproject.io/).


### Local Signing Example

Here are examples of how to sign transaction instructions locally using the following languages and libraries:

* **JavaScript** / **TypeScript** - [`xrpl.js`](https://github.com/XRPLF/xrpl.js)

* **Python** - [`xrpl-py`](https://github.com/XRPLF/xrpl-py)

* **Java** - [`xrpl4j`](https://github.com/XRPLF/xrpl4j)

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/secure-signing/js/signPayment.js" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/secure-signing/py/sign-payment.py" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/secure-signing/java/SignPayment.java" language="java" /%}
{% /tab %}

{% /tabs %}


## Use a Dedicated Signing Device

[{% inline-svg file="/docs/img/secure-signing-dedicated-hardware.svg" /%}](/docs/img/secure-signing-dedicated-hardware.svg "Diagram of using dedicated signing hardware")

Some companies sell dedicated signing devices, such as the [Ledger Nano S](https://www.ledger.com/products/ledger-nano-s), which are capable of signing XRP Ledger transactions using a secret key that never leaves the device. Some devices may not support all types of transactions.

Setting up this configuration depends on the specific device. You may need to run a "manager" application on your machine to interact with the signing device. See the manufacturer's instructions for how to set up and use such a device.


## Use a Secure VPN with a Remote rippled Server

[{% inline-svg file="/docs/img/secure-signing-over-vpn.svg" /%}](/docs/img/secure-signing-over-vpn.svg "Diagram of connecting securely to a remote rippled over VPN")

This configuration uses a `rippled` server hosted remotely, such as in a colocation facility or a distant datacenter, but connects to it securely using an encrypted VPN.

To use this configuration, follow the steps for [running `rippled` on a private LAN](#run-rippled-on-the-same-lan), but use a VPN to connect to the LAN of the remote `rippled` server. Instructions for setting up the VPN are specific to your environment and are not described in this guide.


## See Also

- **Concepts:**
    - [Cryptographic Keys](../accounts/cryptographic-keys.md)
    - [Multi-Signing](../accounts/multi-signing.md)
- **Tutorials:**
    - [Install rippled](../../infrastructure/installation/index.md)
    - [Assign a Regular Key Pair](../../tutorials/how-tos/manage-account-settings/assign-a-regular-key-pair.md)
    - [Reliable Transaction Submission](reliable-transaction-submission.md)
    - [Enable Public Signing](../../infrastructure/configuration/enable-public-signing.md)
- **References:**
    - [sign method][]
    - [submit method][]
    - [xrpl.js Reference](https://js.xrpl.org/)
    - [`xrpl-py` Reference](https://xrpl-py.readthedocs.io/en/latest/index.html)
    - [`xrpl4j` Reference](https://javadoc.io/doc/org.xrpl/)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
