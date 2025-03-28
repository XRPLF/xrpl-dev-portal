# Verify Credential - Python sample code

Verifies that a specific credential exists on the XRPL and is valid.

Quick install & usage:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
./verify_credential.py
```

`verify_credential.py` can also be used as a commandline utility. Full usage statement:

```sh
$ ./verify_credential.py -h
usage: verify_credential.py [-h] [-b] [-n {devnet,testnet,mainnet}]
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
