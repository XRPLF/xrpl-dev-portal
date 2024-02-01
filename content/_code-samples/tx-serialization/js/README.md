# JavaScript transaction serialisation examples

Convert transactions and other XRPL data from JSON to their canonical binary format for signing or cryptographic verification. (This reference implementation is equivalent to the ones included in most client libraries.). 

For a detailed explanation, see [Serialization](https://xrpl.org/serialization.html).

On first run, you have to install the necessary node.js dependencies:

```
npm install
```

## Command-line usage:

### Simple example, use tx1.json default:

```
node index.js
```

### Verbose output, use --verbose or -v:

```
node index.js -v
```

### Raw output without formatting, use --raw or -r:

```
node index.js -r
```

### Pick JSON fixture file:

```
node index.js -f test-cases/tx3.json
```

### Feed JSON as CLI argument:

```
node index.js -j "{\"TransactionType\":\"Payment\"}"
```