---
html: ledger-object-ids.html
parent: ledger-data-formats.html
blurb: All objects in a ledger's state tree have a unique ID.
---
# Ledger Object IDs
<a id="sha512half"></a>

Each [object in a ledger's state data](ledger-object-types.html) has a unique ID. The ID is derived by hashing important contents of the object, along with a [namespace identifier](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/LedgerFormats.h#L99). The [ledger object type](ledger-object-types.html) determines which namespace identifier to use and which contents to include in the hash. This ensures every ID is unique. To calculate the hash, `rippled` uses SHA-512 and then truncates the result to the first 256 bits. This algorithm, informally called **SHA-512Half**, provides an output that has comparable security to SHA-256, but runs faster on 64-bit processors.

Generally, a ledger object's ID is returned as the `index` field in JSON, at the same level as the object's contents. In [transaction metadata](transaction-metadata.html), the ledger object's ID in JSON is `LedgerIndex`.

**Tip:** The `index` or `LedgerIndex` field of an object in the ledger is the ledger object ID. This is not the same as a [ledger index][].

{{ include_svg("img/ledger-object-ids.svg", "Diagram: rippled uses SHA-512Half to generate IDs for ledger objects. The space key prevents IDs for different object types from colliding.") }}


## See Also

- For more information how the XRP Ledger creates and uses hashes, see [Hashes](basic-data-types.html#hashes).
- For ledger basics, see [Ledgers](ledgers.html).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
