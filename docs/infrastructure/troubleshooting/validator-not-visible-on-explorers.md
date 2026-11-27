---
seo:
    description: Diagnose a validator that is proposing correctly but shows as unknown, unverified, or stale on explorers.
labels:
  - Core Server
  - Blockchain
---
# Validator Not Visible on Explorers

Your `xrpld` (formerly `rippled`) validator reports `proposing` with full agreement, but an explorer or validator registry shows it as unknown, returns a 404 for its key, marks it unverified, or shows an old domain or version. This page separates the cases, because they have different causes and only some of them are yours to fix.

## Visibility is not participation

Validation messages are ephemeral. Every figure an explorer shows about your validator is that observer's reconstruction from the validations and manifests it happened to receive. An explorer that hasn't seen your manifest can't show your domain, and one that missed some of your validations shows a lower agreement than you achieved. None of that changes whether your validator participated in consensus.

So check your own server first, then check what the network holds, and only then look at the explorer.

## Step 1: Confirm the validator is working

On the validator, over an admin connection:

1. [server_info method][]: `server_state` is `proposing` and `pubkey_validator` is your validator's public key.
2. [validator_info method][]: note `master_key`, `ephemeral_key`, `seq`, and `domain`. `seq` must match the token currently in `xrpld.cfg`, and `domain` must be present if you attested one.
3. [validators method][]: your trusted list is loaded and not expired.

If any of these are wrong, the problem is local. See [Validator](../configuration/server-modes/validator.md).

## Step 2: Ask a public server what it knows

From any machine, query a public server for your manifest with the [manifest method][], using your validator's master public key:

```sh
curl -s -X POST https://s1.ripple.com:51234/ \
  -H 'Content-Type: application/json' \
  -d '{"method":"manifest","params":[{"public_key":"YOUR_MASTER_PUBLIC_KEY"}]}'
```

Replace `YOUR_MASTER_PUBLIC_KEY` with your validator's master public key (an `nH...` value, for example `nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE`). Any WebSocket or JSON-RPC client works the same way. Compare the response with your own `validator_info`:

| Public server returns | Meaning | Whose problem |
|:----------------------|:--------|:--------------|
| `details` with the same `seq` and `domain` as your validator | The network has your current manifest. An explorer that still disagrees hasn't indexed it. | The explorer's. Report it to them with both outputs. |
| `details` with an older `seq`, or a missing `domain` after you ran `set_domain` | The public server holds a previous manifest. Your newest token hasn't propagated, or you didn't install the new token that `set_domain` produced. | Yours, or propagation. See below. |
| `details` whose `ephemeral_key` equals `master_key`, with no `seq` or `domain` | The public server has never received a manifest for this key. It echoes the key you asked about as both keys; that is the no-manifest signature. | Propagation. See below. |

Try two or three public servers, for example `s1.ripple.com` and `s2.ripple.com`. They receive manifests independently, and disagreement between them is itself diagnostic.

## Step 3: Tell the failures apart

### The explorer shows unverified, but knows the key

The explorer has your manifest but couldn't confirm your domain. This is a [domain verification](../configuration/server-modes/validator.md#6-provide-domain-verification) problem, and the cause is almost always one of these:

- You ran `validator-keys set_domain` but didn't install the **new token** it produced. The manifest on the network has no domain claim. Fix: install the new `[validator_token]`, restart, and update your key-file backup.
- The `xrp-ledger.toml` file isn't reachable at `https://<domain>/.well-known/xrp-ledger.toml` with a valid certificate and the `Access-Control-Allow-Origin: *` header.
- The domain in the file, the attested domain, and the serving domain don't match exactly.
- The `[[VALIDATORS]]` table uses single brackets, its `public_key` is the ephemeral key instead of the master key, or its `attestation` is missing or not the exact string `set_domain` printed.

The [Domain Verifier](/resources/dev-tools/domain-verifier) on this site checks the file side of this for you.

### The explorer returns 404 or unknown

Two different failures look like this, and Step 2 tells them apart.

- **The explorer never received your manifest.** Domain verification can't even start until it does. If public servers don't have your manifest either, read the next section.
- **The explorer has your record but can't serve it.** Some explorers show any error from their own back end as "not found", and a back end can lose the link between your master key and your validations. If public servers have your manifest, query the explorer's API for your key instead of loading its web page. A complete record, or an intermittent server error, means the fault is in the explorer. Report it with the API output and your Step 2 results. One known case is in the open-source validator history service that several explorers read from (ripple/validator-history-service [#503](https://github.com/ripple/validator-history-service/issues/503), open as of October 2026).

### The explorer shows an old ephemeral key, version, or domain after a change

Explorers derive different fields from different messages, so these are two separate problems.

- **An old domain or ephemeral key** is the same class as unknown. Those come from the manifest, and your newer manifest hasn't reached the observer. A validator that shows a current version and a stale domain has a manifest propagation problem, not a domain problem.
- **An old version** is the explorer's problem. Your validations carry the server version once per flag ledger (every 256 ledgers, about 15 minutes) and reach explorers reliably. A version that is still stale an hour after an upgrade means the explorer is reading it from somewhere else. Report it.

## Manifests from untrusted validators may not propagate

Validators that aren't on a published UNL are the ones that go missing from explorers, and the reason has changed with versions (XRPLF/rippled [#7926](https://github.com/XRPLF/rippled/issues/7926) tracks it):

- After the July 2026 manifest flood, the 3.2.1 hotfix relayed only manifests from trusted validators or updates to keys a server already knew. An untrusted validator's manifest stopped at the first server that heard it. The [disclosure report](../../../blog/2026/vulnerabilitydisclosurereport-bug-jul2026.md) later said the 3.2.1 limits on untrusted manifests were too tight.
- From 3.3.0 every accepted manifest is relayed again. What remains is the receiver's cache: each server holds a bounded number of manifests from untrusted validators (`max_untrusted_count` in `[overlay]`, default 300, range 50 to 1000, described as transitional). When the cache is full, a manifest for a new unlisted key is rejected, and a rejected manifest isn't relayed. Updates for keys already in the cache always pass. Untrusted manifests aren't persisted, so every restart empties the cache and the order of arrival starts again.
- Servers still on 3.2.1 relay only manifests from trusted validators or for keys they already know. The fixBatchV1_2 amendment that came with 3.4.1 is enabled on Mainnet, so any older release is amendment blocked.

The effect on current versions is that a healthy, proposing, non-UNL validator can be invisible to some observers, or visible with a stale manifest, until its manifest finds a path through servers with cache room. Operators have lost days to keys, domain, and firewall troubleshooting on validators that had nothing wrong with them.

What helps:

- Confirm with Step 2 that the problem is propagation and not your setup. If your own server and a public server agree, stop changing things.
- Report it to the explorer with your public key and the outputs from Steps 1 and 2. Explorer operators have adapted on their side (one explorer now matches validators on both the master and the ephemeral key, another reads the version from validations, and the shared validator history service stopped overwriting the master key in ripple/validator-history-service #513, merged on October 2, 2026, although #503 is still open), and those fixes are what has restored affected records.
- Report the observation on the issue above as well. Primary evidence helps the maintainers.
- More direct peers may help, but it isn't a fix. A server that accepts your manifest relays it to all its peers, and a server whose untrusted cache is full rejects it, so how many servers hold it depends on cache room along the way. Validators with full peer sets have still stayed invisible for weeks.


## What does not help

- Restarting repeatedly. A restart re-announces your manifest to your peers, which is harmless, but it doesn't clear the caps on other servers, and every restart of a trusted validator is visible.
- Generating new tokens to "refresh" the manifest. Each new token increments the sequence and creates one more manifest that has to propagate. Do it only when you have a reason, such as a domain change.
- Editing `validators.txt`. Your own trusted list has nothing to do with whether others see you.
- Raising `max_untrusted_count` on your own server. It changes what your server holds, not what other servers relay, and the example configuration warns that peers on the default discard the larger manifest messages a server set above it sends. Both counts are described as transitional.

## See also

- [Validator](../configuration/server-modes/validator.md)
- [Validator Best Practices](../configuration/best-practices/validator.md)
- [xrp-ledger.toml](../../references/xrp-ledger-toml.md)
- [manifest method][]
- [validator_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
