# Python key derivation examples

Generates key from a given input in Ed25519 and Secp256k1 format. On first run, you
have to install the necessary Python dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Command-line usage

### Key Derivation (Secp256k1)

```sh
python key_derivation.py
```

### Ed25519 Key Derivation

```sh
python ed25519.py
```

### RFC1751 Key Derivation

```sh
python RFC1751.py
```
