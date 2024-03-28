---
date: 2014-06-26
category: 2014
labels:
    - Features
theme:
    markdown:
        editPage:
            hide: true
---
# Curves with a Twist

Ripple Labs is considering the addition of a new elliptic curve implementation to the Ripple protocol to complement the existing cryptographic system. The addition of a Schnorr-based cryptosystem will produce more optimal and secure design schemes and provides a platform for robust and sophisticated functionality while preserving existing network structure and efficiency.

Currently, the Ripple protocol uses Koblitz curves with secp256k1 parameters and [ECDSA](http://en.wikipedia.org/wiki/Elliptic_Curve_DSA) signatures as defined in the [Standards for Efficient Cryptography](http://www.secg.org/collateral/sec2_final.pdf) (SEC) by Certicom, which is the same cryptosystem that powers Bitcoin.

After months of analysis and testing, we’ve concluded that a Schnorr-based cryptosystem will greatly enhance the security, flexibility, and performance of the Ripple protocol. The system we’re currently testing is [Ed25519](http://ed25519.cr.yp.to/).

The Ed25519 cryptosystem was designed by prominent cryptographer [Daniel J. Bernstein](http://cr.yp.to/djb.html). It consists of [Curve25519](http://cr.yp.to/ecdh.html), a [Twisted Edwards curve](http://en.wikipedia.org/wiki/Twisted_Edwards_curve), in conjunction with the [Schnorr signature scheme](http://en.wikipedia.org/wiki/Schnorr_signature). Ed25519 addresses many of the ongoing security concerns surrounding commonly used cryptosystems, which Bernstein [outlines in a March blog post](http://blog.cr.yp.to/20140323-ecdsa.html), and avoids several design constraints inherent to secp256k1 ECDSA. [OpenSSH](http://www.openssh.com/) recently added support for Ed25519 [based on this reasoning](http://chneukirchen.org/blog/archive/2014/02/the-road-to-openssh-bliss-ed25519-and-the-identitypersist-patch.html).

## The elliptic curve: Curve25519

[![Curve25519 compared to secp256k1](https://cdn.ripple.com/wp-content/uploads/2014/06/curved2.png)](https://cdn.ripple.com/wp-content/uploads/2014/06/curved2.png)

_Image: secp256k1 (left) versus Curve25519 (right)_


The [open and transparent nature](http://safecurves.cr.yp.to/) of how the curve parameters for Curve25519 were set mitigates the risk of a potential backdoor.

Summary of advantages versus secp256k1:

- [Large absolute value](http://safecurves.cr.yp.to/disc.html) for the CM field discriminant (large `|D|`)—although there is no evidence of security problems with small `|D|`.

- Supports simple, fast, [complete](http://safecurves.cr.yp.to/complete.html) constant-time single-scalar multiplication using [a Montgomery ladder](http://safecurves.cr.yp.to/ladder.html).

- A random curve point can be represented in a way that’s [indistinguishable from random data](http://safecurves.cr.yp.to/ind.html).

- Faster performance (see below)

Our initial tests and analysis suggest significant performance gains with the new curve. Curve25519 halves verification time versus secp256k1 based on efficient implementations of both curves. These results were achieved with lower variance, which point to the constant time properties of Curve25519.

Also, the default signature format for Ed25519 allows batch signature verification, which promises twice the performance of DSA.

### Benchmarking

- [Raw test results](http://justmoon.github.io/curvebench/benchmark.html)
- [Benchmark source code](https://github.com/justmoon/curvebench)

In combination, the new curve implementation is expected to quadruple performance versus secp256k1 based on our preliminary benchmarking.

## The signature scheme: Schnorr

The Schnorr signature scheme also adds key benefits in comparison to ECDSA. [Adam Back](http://en.wikipedia.org/wiki/Adam_Back), the inventor of [Hashcash](http://en.wikipedia.org/wiki/Hashcash) (the proof-of-work system used in Bitcoin), [sums up the benefits of Schnorr](https://www.mail-archive.com/cypherpunks@cpunks.org/msg02419.html) as follows: "simple blinding, compact multi-sig, clearer security proofs, better security margin, less dependence on hash properties."

Summary of advantages versus ECDSA:

- Simpler to securely implement
- Composable threshold signatures without multi-party computation
    - Verification happens off-network allowing for sophisticated functionality without increasing network load or complexity
    - Conducive to highly distributed systems
- Less constraints allows for more optimal and secure design schemes

DSA schemes are difficult to manage because the schemes are easy to get wrong. An improper implementations is trivial to break, and what might seem like a minor misstep can precipitate a system-wide vulnerability—as demonstrated by [the highly publicized Playstation hack](http://nakedsecurity.sophos.com/2012/10/25/sony-ps3-hacked-for-good-master-keys-revealed/) in 2012.

Hackers were able to access full control of the PS3 employing “simple algebra” after Sony set a constant in its custom DSA implementation instead of a randomly generated number. The sensitivity of DSA signatures to human error allowed this single oversight to fully compromise the console’s encryption protections, exposing the platform and Sony’s partners to the perpetual threat of piracy.

Alternatively, Schnorr signatures are more forgiving and simpler to implement because its security is inherently [more robust based on the scheme’s dynamic hash function](http://ieeexplore.ieee.org/xpl/articleDetails.jsp?reload=true&amp;arnumber=4908440). The ephemeral public value _r_ is tightly bound to the message, which means that the security of the scheme is no longer [dependent on the collision resistance of the hash function](http://www.cs.bris.ac.uk/Publications/pub_master.jsp?id=2001023).

[![DSA process compared to Schnorr process](https://cdn.ripple.com/wp-content/uploads/2014/06/dsa-schnorr.png)](https://cdn.ripple.com/wp-content/uploads/2014/06/dsa-schnorr.png)

### Independent verification and combining

Another advantage of Schnorr is related to [threshold signatures](http://en.wikipedia.org/wiki/Threshold_cryptosystem), a useful alternative to [multi-signature schemes](https://ripple.com/wiki/Multisign) when multiple parties need to sign a message.

Multi-signature schemes require the network to verify each signature, increasing load with the number of participants. Conversely, threshold signatures are generated offline and result in a single signature regardless of total number of parties participating.

ECDSA can create threshold signatures, but requires [multi-party computation](http://en.wikipedia.org/wiki/Secure_multi-party_computation). This means that the number of participants required to generate a signature without revealing their secrets is twice the number of shares required to recover the key. In contrast, Schnorr has no such restriction. Shares of a signature can be independently verified and then composed.

Incidentally, composable threshold signatures allow the integration of sophisticated new features with fewer design constraints—especially when considering highly distributed systems—while preserving existing network structure and efficiency.

### Powering the future

Ed25519 allows more optimal designs regarding security, distribution, and, performance. The added flexibility will become increasingly relevant going forward as we supplement sophisticated functionality to the Ripple network—particularly in the area of [smart contracts](http://en.wikipedia.org/wiki/Smart_contract) and oracle systems (such as [Reality Keys](https://www.realitykeys.com/), winner of the Startup Challenge sponsored by [Ripple Labs at Bitcoin 2014 in Amsterdam](https://ripple.com/blog/ripple-labs-at-bitcoin-2014-in-amsterdam/))—where we have dedicated significant efforts behind the scenes.

We’ll provide an update of our progress in a future post.
