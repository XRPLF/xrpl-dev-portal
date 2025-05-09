# Verify Credential - Javascript sample code

Verifies that a specific credential exists on the XRPL and is valid.

Quick install & usage:

```sh
npm install
```

`verify_credential.js` can also be used as a commandline utility. Full usage statement:

```sh
$ ./verify_credential.js -h

Usage: verify-credential [options] [issuer] [subject] [credential_type]

Verify an XRPL credential

Arguments:
  issuer                                            Credential issuer address as base58 (default:
                                                    "rEzikzbnH6FQJ2cCr4Bqmf6c3jyWLzkonS")
  subject                                           Credential subject (holder) address as base58 (default:
                                                    "rsYhHbanGpnYe3M6bsaMeJT5jnLTfDEzoA")
  credential_type                                   Credential type as string. (default: "my_credential")

Options:
  -b, --binary                                      Use binary (hexadecimal) for credential_type
  -n, --network <network> {devnet,testnet,mainnet}  Use the specified network for lookup (default: "devnet")
  -q, --quiet                                       Don't print log messages
  -h, --help                                        display help for command
```
