# Verify Credential - Javascript sample code

Verifies that a specific credential exists on the XRPL and is valid.

Quick install & usage:

```sh
blob
```

`verify_credential.js` can also be used as a commandline utility. Full usage statement:

```sh
$ ./verify_credential.js -h
usage: verify_credential.js [-h] [-b] [-n {devnet,testnet,mainnet}]
                            [issuer] [subject] [credential_type]

Verify an XRPL credential

positional arguments:
  issuer                Credential issuer address as base58.
  subject               Credential subject (holder) address as base58.
  credential_type       Credential type as string

options:
  -h, --help            show this help message and exit
  -b, --binary          Use binary (hexadecimal) for credential_type
  -n, --network {devnet,testnet,mainnet}
                        Use the specified network for lookup
```
