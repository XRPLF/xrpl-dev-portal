// This code takes in a wallet address, checks the domain field, then gets the TOML info to verify the domains ownership.
// This is runnable in NODE JS for easier testing, and works the same as the code in xrp-ledger-toml-checker.js 
const WebSocket = require('ws');
const https = require('https');
const TOML = require('../vendor/iarna-toml-parse');

const TOML_PATH = "/.well-known/xrp-ledger.toml"

const ACCOUNT_FIELDS = [
    "address",
    "network",
    "desc"
]

// Test wallet addresses
const WORKS = 'rSTAYKxF2K77ZLZ8GoAwTqPGaphAqMyXV'
const NOTOML = 'rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'
const NODOMAIN = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
// validator.xrpl-labs.com (Works for the domain side)

let socket;

function makeLogEntry(text) {
    log = console.log(text + '\n')
}

function fetchFile(domain) {
    const url = "https://" + domain + TOML_PATH
    makeLogEntry('CHECKING DOMAIN: ' + url)
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            if (data != '') {
                makeLogEntry('TOML FILE: Found');
                parseXrplToml(data)
            } else {
                makeLogEntry('TOML FILE: Not found')
                makeLogEntry('ACCOUNT CAN NOT BE VERIFIED: TOML file was not found.')
                return
            }
        });
    }).on("error", (err) => {
        if (err.code == 'ENOTFOUND') {
            makeLogEntry('ACCOUNT CAN NOT BE VERIFIED: Network error while fetching TOML file.')
        }
        return
    });
}

function fetchWallet() {
    makeLogEntry('\nCHECKING DOMAIN OF ACCOUNT...')
    const url = "wss://xrplcluster.com"
    if (typeof socket !== "undefined" && socket.readyState < 2) {
        socket.close()
    }
    const data = {
        "command": "account_info",
        "account": wallet,
    }
    socket = new WebSocket(url)
    socket.addEventListener('message', (event) => {
        let data;
        try {
            data = JSON.parse(event.data)
            if (data.status === 'success') {
                if (data.result.account_data.Domain) {
                    try {
                        makeLogEntry('ACCOUNT ADDRESS: Valid')
                        decodeHex(data.result.account_data.Domain)
                    } catch {
                        makeLogEntry('error decoding domain field: ' + data.result.account_data.Domain)
                    }
                } else {
                    makeLogEntry('ACCOUNT ADDRESS: Valid')
                    makeLogEntry('DOMAIN DECODED: Domain field not found')
                    makeLogEntry('CHECKING DOMAIN: Error')
                    makeLogEntry('TOML FILE: Not found')
                    makeLogEntry('ACCOUNT CAN NOT BE VERIFIED: Account has no domain field.')
                    return
                }
            } else {
                makeLogEntry('ACCOUNT ADDRESS: Invalid')
                makeLogEntry('DOMAIN DECODED: Domain field not found')
                makeLogEntry('CHECKING DOMAIN: Error')
                makeLogEntry('TOML FILE: Not found')
                makeLogEntry('ACCOUNT CAN NOT BE VERIFIED: Account address is not valid.')
                return
            }
        } catch (e) {
            makeLogEntry(e)
            return
        }
    })
    socket.addEventListener('open', () => {
        socket.send(JSON.stringify(data))
    })
}

async function parseXrplToml(data) {
    let parsed
    makeLogEntry("Parsing TOML data...")
    try {
        parsed = TOML(data)
    } catch (e) {
        makeLogEntry('ACCOUNT CAN NOT BE VERIFIED: TOML file can not be read.')
        return
    }

    async function listEntries(list, fields) {
        makeLogEntry('\nADDRESSES:')
        let found = false;
        for (i = 0; i < list.length; i++) {
            let entry = list[i]
            for (j = 0; j < fields.length; j++) {
                let fieldname = fields[j]
                if (fieldname == 'address' && entry[fieldname] !== undefined) {
                    if (entry[fieldname] === wallet) {
                        makeLogEntry('MATCH: ' + entry[fieldname] + ' *')
                        found = true;
                    } else {
                        makeLogEntry('NO_MATCH: ' + entry[fieldname])
                    }
                }
            }
        }
        if (found) {
            makeLogEntry('ACCOUNT IS PRESENT: Account domain verified')
        } else {
            makeLogEntry('ACCOUNT IS NOT PRESENT: Account domain can not be verified')
        }
        return
    }
    if (parsed.ACCOUNTS) {
        if (!Array.isArray(parsed.ACCOUNTS)) {
            makeLogEntry("Wrong type- should be table-array")
            process.exit()
        } else {
            listEntries(parsed.ACCOUNTS, ACCOUNT_FIELDS)
        }
    }
}

function decodeHex(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    makeLogEntry('DOMAIN DECODED: ' + str)
    fetchFile(str)
}

// 'wallet' must be a global func.
let wallet;

function main() {
    makeLogEntry('\n\n--------EXAMPLE OF FAIL: WEBSITE TOML ERROR--------')
    wallet = NOTOML
    fetchWallet()

    setTimeout(function() {
        makeLogEntry('\n\n--------EXAMPLE OF FAIL: NO DOMAIN FIELD--------')
        wallet = NODOMAIN
        fetchWallet()

        setTimeout(function() {
            makeLogEntry('\n\n--------EXAMPLE OF SUCCESS--------')
            wallet = WORKS
            fetchWallet()

            setTimeout(function(){process.exit()},5000)
        }, 5000)
    }, 5000)   

}

main()
