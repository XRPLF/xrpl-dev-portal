---
seo:
    description: The xrpld packages have no automatic update script; how to keep a server current safely instead.
labels:
  - Core Server
  - Security
---
# Update Automatically on Linux

`xrpld` has no automatic update script. The packages published at `packages.xrplf.org` don't include one, so there is nothing to enable. Update manually ([Red Hat](update-xrpld-manually-on-rhel.md) or [Ubuntu/Debian](update-xrpld-manually-on-ubuntu.md)), and read the release notes first.

Don't automate `xrpld` upgrades on a validator. See [Update deliberately](../configuration/best-practices/validator.md#update-deliberately) in Validator Best Practices. Operating system security patches can be automatic, but then check for a pending reboot and restart the server in a quiet window.

{% admonition type="warning" name="Caution" %}If `/etc/cron.d/update-rippled-cron` exists on your server, it came from an older `rippled` package. Remove the symlink. The script behind it updates only the `rippled` package, so it never upgrades `xrpld`.{% /admonition %}


## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Capacity Planning](../prerequisites/capacity-planning.md)
    - [Troubleshoot xrpld](../troubleshooting/index.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
