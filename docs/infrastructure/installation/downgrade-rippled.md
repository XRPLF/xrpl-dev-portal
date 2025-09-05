---
html: downgrade-rippled.html
parent: install-rippled.html
seo:
    description: Downgrade rippled on Linux.
labels:
  - Core Server

---
# Downgrade rippled on Ubuntu or Debian

This page describes how to downgrade to a specific release of `rippled` on Ubuntu Linux. 

These instructions assume you have already [installed `rippled` on a supported version of Ubuntu using Ripple's `deb` package](install-rippled-on-ubuntu.md). 


To downgrade rippled to a version of your choice, complete the following steps:

1. Check what version of `rippled` you're running at the moment.

    ```
    sudo rippled --version
    ```

2. Before downgrading the `rippled` package, stop the service first.

    ```
    sudo systemctl stop rippled
    ```

3. Downgrade `rippled` to a version of your choice, e.g 2.5.0-1 for rippled 2.5.0 .

    ```
    sudo apt install rippled=2.5.0-1
    ```

4. Check if `rippled` is running:

    ```
    sudo systemctl status rippled
    ```

5. Confirm `rippled` is downgraded successfully:

    ```
    sudo rippled --version
    ```

## See Also

- **Concepts:**
    - [The `rippled` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Troubleshoot rippled](../troubleshooting/index.md)
- **References:**
    - [rippled API Reference](../../references/http-websocket-apis/index.md)
        - [`rippled` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
