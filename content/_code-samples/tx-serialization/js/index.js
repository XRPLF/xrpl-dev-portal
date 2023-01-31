'use strict'

// Organize imports
const fs = require("fs")
const parseArgs = require('minimist')
const TxSerializer = require('./tx-serializer')

function main(rawJson, verbose) {
    const json = JSON.parse(rawJson)
    console.log('\x1b[33m%s\x1b[0m', '\nXRPL Transaction Serialization Example')
    console.log('\x1b[33m%s\x1b[0m', '--------------------------------------')
    console.log('\x1b[37m%s\x1b[0m', '\nSerializing the following transaction:')
    console.log(json)
    if (verbose) console.log('')

    const serializer = new TxSerializer(verbose)

    const serializedTx = serializer.serializeTx(json)
    console.log('\x1b[37m%s\x1b[0m', '\nSerialized Transaction:')
    console.log(serializedTx.toUpperCase())
}

const args = parseArgs(process.argv.slice(2), {
    alias: {
        'f': 'filename',
        'j': 'json',
        's': 'stdin',
        'v': 'verbose',
    },
    default: {
        'f': 'test-cases/tx1.json',
        'v': false
    }
})

let rawJson
if (args.json) {
    rawJson = args.json
    main(rawJson, args.verbose)
} else if (args.stdin) {
    const stdin = process.openStdin();

    let data = ""

    stdin.on('data', function(chunk) {
        data += chunk
    });

    stdin.on('end', function() {
        main(data, args.verbose)
    });
} else {
    rawJson = fs.readFileSync(args.filename, 'utf8')
    main(rawJson, args.verbose)
}