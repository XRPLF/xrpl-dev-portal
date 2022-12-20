// This code takes in a wallet address, checks the domain field, then gets the TOML info to verify the domains ownership.
// This is runnable in NODE JS for easier testing, and works the same as the code in xrp-ledger-toml-checker.js
const WebSocket = require('ws');
const https = require('https');
const TOML = require('../vendor/iarna-toml-parse');

const TOML_PATH = "/.well-known/xrp-ledger.toml"
const TIPS = 'Check if the file is actually hosted at the URL above, check your server\'s HTTPS settings and certificate, and make sure your server provides the required CORS header.\n'
const TIPS_1 = 'Make sure you are entering a valid XRP address.\n'
const TIPS_2 = 'Make sure the wallet address has the domain field.\n'

const ACCOUNT_FIELDS = [
    "address",
    "network",
    "desc"
]

// set 'wallet' to any of these test wallets
const works2 = 'rSTAYKxF2K77ZLZ8GoAwTqPGaphAqMyXV'
const works = 'r4MPhp7NeayAohgEd8FWSUV6eR2nLGwDX3'
const no_toml2 = 'rV64miFA53xbWS3x9A6nRnzxMqLHN1t2h'
const no_toml = 'rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz'
const no_domain = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
const wallet = no_toml
let socket;


function fetch_file_1(domain) {
    // NODE AJAX equivalent
    const url = "https://" + domain + TOML_PATH
    console.log('Checking ' + url + '\n')

    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            if (data != '') {
                console.log('TOML Found\n');
                parse_xrpl_toml_1(data, domain)
            } else {
                console.log(TIPS)
                process.exit()
            }
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        process.exit()
    });
}

function fetch_wallet_1() {
    console.log('Checking domain of wallet...\n')

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
                        decode_hex_1(data.result.account_data.Domain)
                    } catch {
                        console.log('error decoding domain field: ' + data.result.account_data.Domain)
                    }
                } else {
                    console.log(TIPS_2)
                    process.exit()
                }
            } else {
                console.log(TIPS_1)
            }
        } catch (e) {
            console.log(e)
            process.exit()
        }
    })
    socket.addEventListener('open', () => {
        socket.send(JSON.stringify(data))
    })
}

async function parse_xrpl_toml_1(data, domain) {
    let parsed
    console.log("Parsing TOML data...\n")
    try {
        parsed = TOML(data)
    } catch (e) {
        console.log('TOML ERROR: Wallet can not be verified\n')
        process.exit()
    }
    if (parsed.hasOwnProperty("METADATA")) {
        console.log("Metadata section: ")
        if (Array.isArray(parsed.METADATA)) {
            console.log("Wrong type - should be table\n")
        } else {
            console.log("Found \n")
            if (parsed.METADATA.modified) {
                console.log("Modified date: ")
                try {
                    console.log(parsed.METADATA.modified.toISOString() + '\n')
                } catch (e) {
                    console.log("INVALID\n")
                }
            }
        }
    }

    async function list_entries_1(list, fields) {
        let found = false;
        for (i = 0; i < list.length; i++) {
            let entry = list[i]
            for (j = 0; j < fields.length; j++) {
                let fieldname = fields[j]
                if (fieldname == 'address' && entry[fieldname] !== undefined) {
                    if (entry[fieldname] === wallet) {
                        console.log('MATCH: ' + entry[fieldname] + ' *\n')
                        found = true;
                    } else {
                        console.log('NO_MATCH: ' + entry[fieldname] + '\n')
                    }
                }
            }
        }
        if (found) {
            console.log('WALLET DOMAIN VERIFIED\n')
        } else {
            console.log('WALLET NOT VERIFIED. WALLET NOT PRESENT IN TOML FILE\n')
        }
        process.exit()
    }
    if (parsed.ACCOUNTS) {
        if (!Array.isArray(parsed.ACCOUNTS)) {
            console.log("Wrong type- should be table-array")
            process.exit()
        } else {
            list_entries_1(parsed.ACCOUNTS, ACCOUNT_FIELDS)
        }
    }
}

function decode_hex_1(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    console.log('Domain decoded: ' + str + '\n')
    fetch_file_1(str)
}



// RUNS CODE. Edit 'wallet' CONST at top of file to change wallet.
fetch_wallet_1()