////////////////////////////////////////////////////////////////////////////////
// Normalize Currency Codes
// Original authors: Ali (XUMM), nixer89
// Upstream version: https://github.com/nixer89/xrpl-services-frontend/blob/master/src/app/utils/normalizers.ts
////////////////////////////////////////////////////////////////////////////////
// Convert from a string from either the XRP Ledger's "standard" 3-character
// format, or several possible decodings of the "non-standard" 40-character
// hexadecimal format into a string for humans to read.
//
// This code is intended for use with Node.js.
////////////////////////////////////////////////////////////////////////////////

function normalizeCurrencyCode(currencyCode, maxLength = 20) {
    if(!currencyCode) return "";

    if(currencyCode.length === 3 && currencyCode.trim().toLowerCase() !== 'xrp') {
        // "Standard" currency code
        return currencyCode.trim()
    }

    if(currencyCode.match(/^[a-fA-F0-9]{40}$/) && !isNaN(parseInt(currencyCode, 16))) {
        // Hexadecimal currency code
        const hex = currencyCode.toString().replace(/(00)+$/g, '')
        if (hex.startsWith('01')) {
            // Old demurrage code. https://xrpl.org/demurrage.html
            return convertDemurrageToUTF8(currencyCode);
        }
        if (hex.startsWith('02')) {
            // XLS-16d NFT Metadata using XLS-15d Concise Transaction Identifier
            // https://github.com/XRPLF/XRPL-Standards/discussions/37
            const xlf15d = Buffer.from(hex, 'hex').slice(8).toString('utf-8').slice(0, maxLength).trim()
            if (xlf15d.match(/[a-zA-Z0-9]{3,}/) && xlf15d.toLowerCase() !== 'xrp') {
                return xlf15d
            }
        }
        const decodedHex = Buffer.from(hex, 'hex').toString('utf-8').slice(0, maxLength).trim()
        if (decodedHex.match(/[a-zA-Z0-9]{3,}/) && decodedHex.toLowerCase() !== 'xrp') {
            // ASCII or UTF-8 encoded alphanumeric code, 3+ characters long
            return decodedHex
        }
    }
    return "";
}

function convertDemurrageToUTF8(demurrageCode) {

    let bytes = Buffer.from(demurrageCode, "hex")
    let code = String.fromCharCode(bytes[1]) + String.fromCharCode(bytes[2]) + String.fromCharCode(bytes[3]);
    let interest_start = (bytes[4] << 24) + (bytes[5] << 16) + (bytes[6] <<  8) + (bytes[7]);
    let interest_period = bytes.readDoubleBE(8);
    const year_seconds = 31536000; // By convention, the XRP Ledger's interest/demurrage rules use a fixed number of seconds per year (31536000), which is not adjusted for leap days or leap seconds
    let interest_after_year = Math.pow(Math.E, (interest_start+year_seconds - interest_start) / interest_period)
    let interest = (interest_after_year * 100) - 100;

    return(`${code} (${interest}% pa)`)
}

console.log("Standard 3-character code (should be 'USD')")
console.log(normalizeCurrencyCode("USD"))

console.log("Currency code that decodes to XRP, case-insensitive (should be empty string)")
console.log(normalizeCurrencyCode("xRp"))

console.log("Demurrage code (should be 'XAU (-0.5% pa)')...")
console.log(normalizeCurrencyCode("0158415500000000C1F76FF6ECB0BAC600000000"))

console.log("XLS-16d code (should be 'Purple moon')")
console.log(normalizeCurrencyCode("0252000B03B6296F507572706C65206D6F6F6E00"))

console.log("Long-alphanumeric code (should be 'XWORKS')...")
console.log(normalizeCurrencyCode("58574F524B530000000000000000000000000000"))
