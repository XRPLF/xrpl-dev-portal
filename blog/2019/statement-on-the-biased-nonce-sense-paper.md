---
labels:
    - Security
category: 2019
date: 2019-01-14
theme:
    markdown:
        editPage:
            hide: true
---
# Statement on the “Biased Nonce Sense” Paper

In the cryptography industry, it is well known that using repeated or insufficiently random "nonces" (also called "k" values) in ECDSA digital signatures carries security risks. A new [research paper](https://eprint.iacr.org/2019/023.pdf) authored by Joachim Breitner and Nadia Heninger discloses a more serious attack than was previously known on signatures with imperfect nonces.

<!-- BREAK -->

The vulnerability comes from defects in software that signs transactions that are subsequently submitted to systems that use secp256k1 signatures -- including Bitcoin, Ethereum, XRP Ledger and dozens of other distributed ledger technologies. This vulnerability is not present in the core software that operates these blockchains / distributed ledgers.

For several years, the widely agreed upon industry recommendation has been to use deterministic nonces as described in [RFC6979](https://tools.ietf.org/html/rfc6979) when generating signatures for any of these systems. Those who use exclusively deterministic nonces (or use Ed25519 keys) are not vulnerable to this attack. Signing software contained in `rippled` and ripple-lib packages published by Ripple from August 2015 and later always use deterministic nonces.


## FAQ

- **Q: Is this an issue with the XRP Ledger?**
- **A:** No. It’s an issue with improperly made ECDSA signatures. The vulnerability comes from defects in signing software that does not properly use unbiased (random or deterministic but apparently random) nonces.

- **Q: What systems are affected?**
- **A:** At least any systems that use secp256k1 signatures and support private key reuse. This includes Bitcoin, Ethereum, XRP Ledger, and many other blockchain systems.

- **Q: What should users do?**
- **A:** It is recommended that users utilize either Ed25519 keys (which are unaffected) or software that uses deterministic nonces in its signatures. No changes to the XRP Ledger software are required. You can proactively rotate the keys associated with an XRP Ledger address by [assigning a regular key pair](https://xrpl.org/assign-a-regular-key-pair.html) and then, optionally, disabling the master key. (If you are worried your master key may be compromised, you should disable it.)

- **Q: Do I need to be worried about the security of my XRP Ledger accounts?**
- **A:** Follow this flowchart:
    ![If you have an XRP Ledger account, you have signed transactions from that account, you do not know whether your signatures all used deterministic nonces, _and_ you have not changed your key after any signatures that might have used weak nonces, you may be affected. Otherwise, you are not affected with regards to the XRP Ledger. Versions of rippled and ripple-lib from August 2015 and later always use deterministic nonces.](/blog/img/biased-nonce-sense-flowchart.png)
