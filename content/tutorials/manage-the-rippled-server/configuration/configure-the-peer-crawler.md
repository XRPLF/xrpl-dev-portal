# Configure the Peer Crawler

By default, `rippled` servers provide statistics publicly to anyone who asks using the [peer crawler API](peer-crawler.html), to make it easier to track the health and topology of the XRP Ledger's peer-to-peer network. You can configure your server to provide more or less information, or to reject peer crawler requests entirely. [New in: rippled 1.2.0][]

This document contains steps for two options:

- [Change the Information Reported by the Peer Crawler](#change-the-information-reported-by-the-peer-crawler)
- [Disabling the Peer Crawler](#disabling-the-peer-crawler)

## Change the Information Reported by the Peer Crawler

***TODO: figure out how the config relates to validators opting out in v1.2.1***

To configure how much information your server provides in response to peer crawler requests, complete the following steps:

1. Edit your `rippled`'s config file.

        vim /etc/opt/ripple/rippled.cfg

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

2. Add or update the `[crawl]` stanza in your config file, and save the changes:

        [crawl]
        overlay = 1
        server = 1
        counts = 0
        unl = 1

    The settings in this example represent the default values. A setting with a value of `1` means to share that type of information. A value of `0` means not to share that information. The information shared by each option is as follows (the types of data described for each option are a sample, not an exhaustive list):

    - **`overlay`** - Information about the peer servers your server is connected to, including:
        - Their IP addresses, if they're not [private peers](peer-protocol.html#private-peers).
        - The public keys they use for peer-to-peer communications.
        - How long your server has been connected to them.
        - The [ledger versions](ledger-history.html) they have available.
    - **`server`** - Information about your server, including:
        - What `rippled` version you are running.
        - The [ledger versions](ledger-history.html) your server has available.
        - The amount of load your server is experiencing.
    - **`counts`** - Information about your server's memory usage, including:
        - How large the ledger and transaction databases are
        - How many objects of various types are cached in memory. Types of objects include ledgers (`Ledger`), transactions (`STTx`), validation messages (`STValidation`), and more.
        - The cache hit rate for the in-application caches.
    - **`unl`** - Information about your server's trusted validators, including:
        - The URL of the [validator list site(s)](consensus-protections.html#validator-overlap-requirements) your server uses to find validators to trust
        - When the validator list your server is using is scheduled to expire.

    The names of the config fields match the names of the fields they control in the [peer crawler response](peer-crawler.html#response-format).

3. After saving the changes to the config file, restart your `rippled` server to apply the updated configuration:

        systemctl restart rippled


## Disabling the Peer Crawler

To disable the peer crawler API on your server, so it does not respond to peer crawler requests at all, complete the following steps:

1. Edit your `rippled`'s config file.

        vim /etc/opt/ripple/rippled.cfg

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

2. Add or update the `[crawl]` stanza in your config file, and save the changes:

        [crawl]
        0

    Remove or comment out all other contents of the crawl stanza.

3. After saving the changes to the config file, restart your `rippled` server to apply the updated configuration:

        systemctl restart rippled



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
