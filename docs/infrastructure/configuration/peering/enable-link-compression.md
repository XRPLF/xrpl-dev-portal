---
html: enable-link-compression.html
parent: configure-peering.html
seo:
    description: Save bandwidth by compressing peer-to-peer communications.
labels:
  - Core Server
---
# Enable Link Compression

The `rippled` server can save bandwidth by compressing its [peer-to-peer communications](../../../concepts/networks-and-servers/peer-protocol.md), at a cost of greater CPU usage. If you enable link compression, the server automatically compresses communications with peer servers that also have link compression enabled.

## Steps

To enable link compression on your server, complete the following steps:

### 1. Edit your `rippled` server's config file.

```sh
$ vim /etc/opt/ripple/rippled.cfg
```

{% partial file="/docs/_snippets/conf-file-location.md" /%}

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

- [Capacity Planning](../../installation/capacity-planning.md)
- [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
