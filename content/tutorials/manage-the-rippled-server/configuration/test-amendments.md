---
html: test-amendments.html
parent: configure-rippled.html
blurb: You can test proposed amendments before they're enabled on the network.
labels:
  - Blockchain
---
# Test Amendments


You can test how `rippled` behaves before proposed amendments are fully enabled on the production network. Since other members of the consensus network won't have the feature enabled, run your server in stand-alone mode.

**Caution:** This is intended for development purposes only.

To forcibly enable a feature, add a `[features]` stanza with amendment short names to your `rippled.cfg` file. Each amendment needs its own line.

<!-- MULTICODE_BLOCK_START -->
_Example_

```
[features]
MultiSign
TrustSetAuth
```

<!-- MULTICODE_BLOCK_END -->