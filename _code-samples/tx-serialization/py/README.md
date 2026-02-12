# Python transaction serialization examples

Convert transactions and other XRPL data from JSON to their canonical binary format for signing or cryptographic verification.

## Command-line usage

### Simple example, use tx1.json default

```sh
python serialize.py
```

### Verbose output, use --verbose or -v

```sh
python serialize.py -v
```

### Pick JSON fixture file

```sh
python serialize.py -f test-cases/tx3.json
```

### Feed JSON as CLI argument

```sh
python serialize.py -j "{\"TransactionType\":\"Payment\"}"
```

### Read JSON from stdin

```sh
cat test-cases/tx1.json | python serialize.py --stdin
```
