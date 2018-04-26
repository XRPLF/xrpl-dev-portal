# `rippled` Server

A `rippled` server is the core peer-to-peer server that manages the XRP Ledger. This section covers concepts that help you learn the "what" and "why" behind fundamental aspects of the `rippled` server.

* **[Server Modes](x)**

      The `rippled` server can run in several different modes depending on its configuration, including stock, validating, and stand-alone. Understand the purpose of each mode and when to use each one.
<!--{# TODO: I removed Stand-Alone Mode as a peer to this section. Stand-Alone Mode is a server mode and should be covered in this concept.  #}-->

* **[History Sharding](x)**

      Historical sharding distributes the transaction history of the XRP Ledger into segments, called shards, across servers in the XRP Ledger network. Understand the purpose of history sharding and when to use it.
<!--{# TODO: Is this History Sharding or Historical Sharding? #}-->

* **[Clustering](x)**

      If you are running multiple `rippled` servers in a single datacenter, you can configure those servers into a cluster to maximize efficiency. Understand the purpose of clustering and when to use it.
