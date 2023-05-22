const fetch = require('node-fetch')
const toml = require('toml');
const { convertHexToString } = require("xrpl/dist/npm/utils/stringConversion");

const lsfDisallowXRP = 0x00080000;

/*  Example lookups

    |------------------------------------|---------------|-----------|
    | Address                            | Domain        | Verified  |
    |------------------------------------|---------------|-----------|
    | rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW | mduo13.com    | YES       |
    | rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn | xrpl.org      | NO        |
    | rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe | n/a           | NO        |
    |------------------------------------|---------------|-----------|
 */

/**
 * Check a potential destination address's details, and pass them back to the "Send XRP" dialog:
 * - Is the account funded? If not, payments below the reserve base will fail
 * - Do they have DisallowXRP enabled? If so, the user should be warned they don't want XRP, but can click through.
 * - Do they have a verified Domain? If so, we want to show the user the associated domain info.
 *
 * @param accountData
 * @returns {Promise<{domain: string, verified: boolean}|{domain: string, verified: boolean}>}
 */
async function checkDestination(accountData) {
    const accountStatus = {
        "funded": null,
        "disallow_xrp": null,
        "domain_verified": null,
        "domain_str": "" // the decoded domain, regardless of verification
    }

    accountStatus["disallow_xrp"] = !!(accountData & lsfDisallowXRP);

    return verifyAccountDomain(accountData)
}

/**
 * Verify an account using a xrp-ledger.toml file.
 * https://xrpl.org/xrp-ledger-toml.html#xrp-ledgertoml-file
 *
 * @param accountData
 * @returns {Promise<{domain: string, verified: boolean}>}
 */
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

/**
 * Verifies if a given address has validated status
 *
 * @param accountAddress
 * @param client
 * @returns {Promise<{domain: string, verified: boolean}>}
 */
async function verify(accountAddress, client) {
    // Reference: https://xrpl.org/account_info.html
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
