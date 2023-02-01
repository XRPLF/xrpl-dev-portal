'use strict'

// Organize imports
const fs = require("fs")
const parseArgs = require('minimist')
const TxSerializer = require('./tx-serializer')

function main(rawJson, verbose) {
    const json = JSON.parse(rawJson)
    _pretty('\nXRPL Transaction Serialization Example', '\x1b[33m%s\x1b[0m')
    _pretty('--------------------------------------', '\x1b[33m%s\x1b[0m')
    _pretty('\nSerializing the following transaction:', '\x1b[37m%s\x1b[0m')
    _pretty(json)
    if (verbose) _pretty('')

    const serializer = new TxSerializer(verbose)

    const serializedTx = serializer.serializeTx(json)
    _pretty('\nSerialized Transaction:', '\x1b[37m%s\x1b[0m')
    console.log(serializedTx.toUpperCase())
}

const args = parseArgs(process.argv.slice(2), {
    alias: {
        'f': 'filename',
        'j': 'json',
        'r': 'raw',
        's': 'stdin',
        'v': 'verbose',
    },
    default: {
        'f': 'test-cases/tx1.json',
        'r': false,
        'v': false
    }
})

function _pretty(message, color) {
    if (!args.raw) {
        console.log(color, message)
    }
}

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