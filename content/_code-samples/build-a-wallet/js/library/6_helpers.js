const fetch = require('node-fetch')
const toml = require('toml');
const { convertHexToString } = require("xrpl/dist/npm/utils/stringConversion");

const lsfDisallowXRP = 0x00080000;

/*
    |------------------------------------|---------------|-----------|
    | Address                            | Domain        | Verified  |
    |------------------------------------|---------------|-----------|
    | rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW | mduo13.com    | YES       |
    | rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn | xrpl.org      | NO        |
    | rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe | n/a           | NO        |
    |------------------------------------|---------------|-----------|
 */

async function checkDestination(accountData) {
    const accountStatus = {
        "funded": null,
        "disallow_xrp": null,
        "domain_verified": null,
        "domain_str": "" // the decoded domain, regardless of verification
    }

    if (accountData & lsfDisallowXRP) {
        accountStatus["disallow_xrp"] = true
    } else {
        accountStatus["disallow_xrp"] = false
    }

    return verifyAccountDomain(accountData)
}

async function verifyAccountDomain(accountData) {
    const domainHex = accountData["Domain"]
    if (!domainHex) {
        return {
            domain:"",
            verified: false
        }
    }

    let verified = false
    const domain = convertHexToString(domainHex)
    const tomlUrl = `https://${domain}/.well-known/xrp-ledger.toml`
    const tomlResponse = await fetch(tomlUrl)
    const tomlData = await tomlResponse.text()
    const parsedToml = toml.parse(tomlData)
    const tomlAccounts = parsedToml["ACCOUNTS"]

    for (const tomlAccount of tomlAccounts) {
        if (tomlAccount["address"] === accountData["Account"]) {
            verified = true
        }
    }

    return {
        domain: domain,
        verified: verified
    }
}

async function verify(accountAddress, client) {
    const request = {
        "command": "account_info",
        "account": accountAddress,
        "ledger_index": "validated"
    }

    try {
        const response = await client.request(request)
        return await checkDestination(response.result.account_data)
    } catch {
        return {
            domain: 'domain',
            verified: false
        }
    }
}

module.exports = { verify }