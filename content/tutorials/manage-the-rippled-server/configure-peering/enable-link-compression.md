---
html: enable-link-compression.html
parent: configure-peering.html
blurb: Save bandwidth by compressing peer-to-peer communications.
---
# Enable Link Compression

The `rippled` server can save bandwidth by compressing its [peer-to-peer communications](peer-protocol.html), at a cost of greater CPU usage. If you enable link compression, the server automatically compresses communications with peer servers that also have link compression enabled. [New in: rippled 1.6.0][]

## Steps

To enable link compression on your server, complete the following steps:

### 1. Edit your `rippled` server's config file.

```sh
$ vim /etc/opt/ripple/rippled.cfg
```

{% include '_snippets/conf-file-location.md' %}<!--_ -->

### 2. In the config file, add or uncomment the `[compression]` stanza.

To enable compression:

```text
[compression]
true
```

Use `false` to disable compression (the default).

### 3. Restart the `rippled` server

```sh
$ sudo systemctl restart rippled.service
```

After the restart, your server automatically uses link compression with other peers that also have link compression enabled.

## See Also

- [Capacity Planning](capacity-planning.html)
- [Peer Protocol](peer-protocol.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
