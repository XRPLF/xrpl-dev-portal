---
html: install-rippled-on-centos-rhel-with-yum.html
parent: install-rippled.html
blurb: Deprecated: CentOS and Red Hat Enterprise Linux are no longer supported.
labels:
  - Core Server
---
# Install on CentOS/Red Hat with yum

The `rippled` software no longer supports **CentOS 7** or **Red Hat Enterprise Linux 7**. Instead, Ubuntu is recommended; [build instructions are here](https://github.com/XRPLF/rippled/blob/develop/BUILD.md).

- It is extremely difficult to build a modern toolchain on an ancient system like CentOS.
- Community contributions are welcome; if you care about CentOS and can help to build a modern toolchain on it, please do so. Share your contributions on GitHub.
- You may want to upgrade to a more modern version of CentOS; for example, CentOS 8 may have fewer problems.


## See Also

- **Concepts:**
    - [The `rippled` Server](xrpl-servers.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Configure rippled](configure-rippled.html)
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
    - [Get Started with the rippled API](get-started-using-http-websocket-apis.html)
- **References:**
    - [rippled API Reference](http-websocket-apis.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
