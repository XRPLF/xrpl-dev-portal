# JavaScript transaction serialisation examples

Convert transactions and other XRPL data from JSON to their canonical binary format for signing or cryptographic verification.

On first run, you have to install the necessary node.js dependencies:

```sh
npm install
```

## Command-line usage

### Simple example, use tx1.json default

```sh
node index.js
```

### Verbose output, use --verbose or -v

```sh
node index.js -v
```

### Raw output without formatting, use --raw or -r

```sh
node index.js -r
```

### Pick JSON fixture file

```sh
node index.js -f test-cases/tx3.json
```

### Feed JSON as CLI argument

```sh
node index.js -j "{\"TransactionType\":\"Payment\"}"
```
