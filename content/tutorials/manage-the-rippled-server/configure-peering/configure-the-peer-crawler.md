# Configure the Peer Crawler

By default, [`rippled` servers](the-rippled-server.html) provide statistics publicly to anyone who asks using the [peer crawler API](peer-crawler.html), to make it easier to track the health and topology of [the XRP Ledger's peer-to-peer network](consensus-network.html). You can configure your server to provide more or less information, or to reject peer crawler requests entirely. [New in: rippled 1.2.0][]

This document contains steps for two options:

- [Change the Information Reported by the Peer Crawler](#change-the-information-reported-by-the-peer-crawler)
- [Disable the Peer Crawler](#disable-the-peer-crawler)

## Change the Information Reported by the Peer Crawler

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

    The fields in this stanza control which fields the server returns in the [peer crawler response](peer-crawler.html#response-format). The names of the config fields match the fields of the API response. A setting with a value of `1` means to include the field in the response. A value of `0` means to omit that field from the response. This example shows the default values for each setting.

3. After saving the changes to the config file, restart your `rippled` server to apply the updated configuration:

        systemctl restart rippled


## Disable the Peer Crawler

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


## See Also

- **Concepts:**
    - [Peer Protocol](peer-protocol.html)
- **Tutorials:**
    - [Manage the rippled Server](manage-the-rippled-server.html)
- **References:**
    - [server_info method][]
    - [peers method][]
    - [Peer Crawler](peer-crawler.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
