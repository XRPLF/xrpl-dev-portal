'use strict'

// Organize imports
const assert = require("assert")
const bigInt = require("big-integer")
const { Buffer } = require('buffer')
const Decimal = require('decimal.js')
const fs = require("fs")
const { codec } = require("ripple-address-codec")

const mask = bigInt(0x00000000ffffffff)

/**
 * Helper function that checks wether an amount object has a proper signature
 *
 * @param arg
 * @returns {boolean}
 */
const isAmountObject = function (arg) {
    const keys = Object.keys(arg).sort()
    return (
        keys.length === 3 &&
        keys[0] === 'currency' &&
        keys[1] === 'issuer' &&
        keys[2] === 'value'
    )
}

/**
 * Helper function for sorting fields in a tx object
 *
 * @param a
 * @param b
 * @returns {number}
 */
const sortFuncCanonical = function (a, b) {
    a = this.fieldSortKey(a)
    b = this.fieldSortKey(b)
    return a.typeCode - b.typeCode || a.fieldCode - b.fieldCode
}

/**
 * Main Class
 */
class TxSerializer {

    constructor(verbose = false) {
        this.verbose = verbose
        this.definitions = this._loadDefinitions()
    }

    /**
     *     Loads JSON from the definitions file and converts it to a preferred format.
     *
     *     (The definitions file should be drop-in compatible with the one from the
     *     ripple-binary-codec JavaScript package.)
     *
     * @param filename
     * @returns {{TYPES, LEDGER_ENTRY_TYPES, FIELDS: {}, TRANSACTION_RESULTS, TRANSACTION_TYPES}}
     * @private
     */
    _loadDefinitions(filename = "definitions.json") {
        const rawJson = fs.readFileSync(filename, 'utf8')
        const definitions = JSON.parse(rawJson)

        return {
            "TYPES" : definitions["TYPES"],
            "FIELDS" : definitions["FIELDS"].reduce(function(accum, tuple) {
                accum[tuple[0]] = tuple[1]

                return accum
            }, {}),
            "LEDGER_ENTRY_TYPES": definitions["LEDGER_ENTRY_TYPES"],
            "TRANSACTION_RESULTS": definitions["TRANSACTION_RESULTS"],
            "TRANSACTION_TYPES": definitions["TRANSACTION_TYPES"],
        }
    }

    _logger(message) {
        if (this.verbose) {
            console.log(message)
        }
    }

    /**
     *   Returns a base58 encoded address, f. ex. AccountId
     *
     * @param address
     * @returns {Buffer}
     * @private
     */
    _decodeAddress(address) {
        const decoded = codec.decodeChecked(address)
        if (decoded[0] === 0 && decoded.length === 21) {
            return decoded.slice(1)
        }

        throw new Error("Not an AccountID!")
    }

    /**
     *    Return a tuple sort key for a given field name
     *
     * @param fieldName
     * @returns {{one: *, two: (*|(function(Array, number=): *))}}
     */
    fieldSortKey(fieldName) {
        const fieldTypeName = this.definitions["FIELDS"][fieldName]["type"]
        const typeCode = this.definitions["TYPES"][fieldTypeName]
        const fieldCode = this.definitions["FIELDS"][fieldName].nth

        return {typeCode, fieldCode}
    }

    /**
     *     Returns the unique field ID for a given field name.
     *     This field ID consists of the type code and field code, in 1 to 3 bytes
     *     depending on whether those values are "common" (<16) or "uncommon" (>=16)
     *
     * @param fieldName
     * @returns {string}
     */
    fieldId(fieldName) {
        const fieldTypeName = this.definitions["FIELDS"][fieldName]["type"]
        const fieldCode = this.definitions["FIELDS"][fieldName].nth
        const typeCode = this.definitions["TYPES"][fieldTypeName]

        // Codes must be nonzero and fit in 1 byte
        assert.ok(0 < typeCode <= 255)
        assert.ok(0 < fieldCode <= 255)

        if (typeCode < 16 && fieldCode < 16) {
            // High 4 bits is the type_code
            // Low 4 bits is the field code
            const combinedCode = (typeCode << 4) | fieldCode

            return this.uint8ToBytes(combinedCode)
        } else if (typeCode >= 16 && fieldCode < 16) {
            // First 4 bits are zeroes
            // Next 4 bits is field code
            // Next byte is type code
            const byte1 = this.uint8ToBytes(fieldCode)
            const byte2 = this.uint8ToBytes(typeCode)

            return "" + byte1 + byte2
        } else if (typeCode < 16 && fieldCode >= 16) {
            // Both are >= 16
            // First 4 bits is type code
            // Next 4 bits are zeroes
            // Next byte is field code
            const byte1 = this.uint8ToBytes(typeCode << 4)
            const byte2 = this.uint8ToBytes(fieldCode)

            return "" + byte1 + byte2
        } else {
            // both are >= 16
            // first byte is all zeroes
            // second byte is type
            // third byte is field code
            const byte1 = this.uint8ToBytes(0)
            const byte2 = this.uint8ToBytes(typeCode)
            const byte3 = this.uint8ToBytes(fieldCode)

            return "" + byte1 + byte2 + byte3 //TODO: bytes is python function
        }
    }

    /**
     *     Helper function for length-prefixed fields including Blob types
     *     and some AccountID types.
     *
     *     Encodes arbitrary binary data with a length prefix. The length of the prefix
     *     is 1-3 bytes depending on the length of the contents:
     *
     *     Content length <= 192 bytes: prefix is 1 byte
     *     192 bytes < Content length <= 12480 bytes: prefix is 2 bytes
     *     12480 bytes < Content length <= 918744 bytes: prefix is 3 bytes
     *
     * @param content
     * @returns {string}
     */
    variableLengthEncode(content) {
        // Each byte in a hex string has a length of 2 chars
        let length = content.length / 2

        if (length <= 192) {
            //const lengthByte = new Uint8Array([length])
            const lengthByte = Buffer.from([length]).toString("hex")

            return "" + lengthByte + content
        } else if(length <= 12480) {
            length -= 193
            const byte1 = Buffer.from([(length >> 8) + 193]).toString("hex")
            const byte2 = Buffer.from([length & 0xff]).toString("hex")

            return "" + byte1 + byte2 + content
        } else if (length <= 918744) {
            length -= 12481
            const byte1 = Buffer.from([241 + (length >> 16)]).toString("hex")
            const byte2 = Buffer.from([(length >> 8) & 0xff]).toString("hex")
            const byte3 = Buffer.from([length & 0xff]).toString("hex")

            return "" + byte1 + byte2 + byte3 + content
        }

        throw new Error('VariableLength field must be <= 918744 bytes long')
    }

    /**
     *     Serialize an AccountID field type. These are length-prefixed.
     *
     *     Some fields contain nested non-length-prefixed AccountIDs directly; those
     *     call decode_address() instead of this function.
     *
     * @param address
     * @returns {string}
     */
    accountIdToBytes(address) {
        return this.variableLengthEncode(this._decodeAddress(address).toString("hex"))
    }

    /**
     *    Serializes an "Amount" type, which can be either XRP or an issued currency:
     *    - XRP: 64 bits; 0, followed by 1 ("is positive"), followed by 62 bit UInt amount
     *    - Issued Currency: 64 bits of amount, followed by 160 bit currency code and
     *    160 bit issuer AccountID.
     *
     * @param value
     * @returns {string}
     */
    amountToBytes(value) {
        let amount = Buffer.alloc(8)

        if (typeof value === 'string') {
            const number = bigInt(value)

            const intBuf = [Buffer.alloc(4), Buffer.alloc(4)]
            intBuf[0].writeUInt32BE(Number(number.shiftRight(32)), 0)
            intBuf[1].writeUInt32BE(Number(number.and(mask)), 0)

            amount = Buffer.concat(intBuf)

            amount[0] |= 0x40

            return amount.toString("hex")
        } else if (typeof value === 'object') {
            if(!isAmountObject(value)) {
                throw new Error("Amount must have currency, value, issuer only")
            }

            const number = new Decimal(value["value"])

            if (number.isZero()) {
                amount[0] |= 0x80;
            } else {
                const integerNumberString = number
                    .times("1e".concat(-(number.e - 15)))
                    .abs()
                    .toString();
                const num = bigInt(integerNumberString)
                let intBuf = [Buffer.alloc(4), Buffer.alloc(4)]
                intBuf[0].writeUInt32BE(Number(num.shiftRight(32)), 0)
                intBuf[1].writeUInt32BE(Number(num.and(mask)), 0)
                amount = Buffer.concat(intBuf)
                amount[0] |= 0x80
                if (number.gt(new Decimal(0))) {
                    amount[0] |= 0x40
                }

                const exponent = number.e - 15
                const exponentByte = 97 + exponent
                amount[0] |= exponentByte >>> 2
                amount[1] |= (exponentByte & 0x03) << 6
            }

            this._logger("Issued amount: " + amount.toString("hex").toUpperCase())

            const currencyCode = this.currencyCodeToBytes(value["currency"])

            return amount.toString("hex")
                + currencyCode.toString("hex")
                + this._decodeAddress(value["issuer"]).toString("hex")
        }
    }

    /**
     *    Serialize an array of objects from decoded JSON.
     *     Each member object must have a type wrapper and an inner object.
     *     For example:
     *     [
     *         {
     *             // wrapper object
     *             "Memo": {
     *                 // inner object
     *                 "MemoType": "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963",
     *                 "MemoData": "72656e74"
     *             }
     *         }
     *     ]
     *
     * @param array
     * @returns {string}
     */
    arrayToBytes(array) {
        let membersAsBytes = []

        for (let member of array) {
            const wrapperKey = Object.keys(member)[0]
            const innerObject = member[wrapperKey]
            membersAsBytes.push(this.fieldToBytes(wrapperKey, innerObject))
        }

        membersAsBytes.push(this.fieldId("ArrayEndMarker"))

        return membersAsBytes.join('')
    }

    /**
     *    Serializes a string of hex as binary data with a length prefix.
     *
     * @param fieldValue
     * @returns {string}
     */
    blobToBytes(fieldValue) {
       return this.variableLengthEncode(fieldValue)
    }

    /**
     *
     * @param codeString
     * @param isXrpOk
     * @returns {string}
     */
    currencyCodeToBytes(codeString, isXrpOk = false) {
        const ISO_REGEX = /^[A-Z0-9a-z?!@#$%^&*(){}[\]|]{3}$/
        const HEX_REGEX = /^[A-F0-9]{40}$/

        if(ISO_REGEX.test(codeString)) {
            if(codeString === "XRP") {
                if (isXrpOk) {
                    // Rare, but when the currency code "XRP" is serialized, it's
                    // a special-case all zeroes.
                    this._logger("Currency code(XRP): " + "00".repeat(20))
                    return "00".repeat(20)
                }

                throw new Error("issued currency can't be XRP")
            }
            const codeAscii = Buffer.from(codeString, 'ascii')
            this._logger("Currency code ASCII: " + codeAscii.toString("hex"))
            // standard currency codes: https://xrpl.org/currency-formats.html#standard-currency-codes
            // 8 bits type code (0x00)
            // 88 bits reserved (0's)
            // 24 bits ASCII
            // 16 bits version (0x00)
            // 24 bits reserved (0's)
            const prefix = Buffer.alloc(12)
            const postfix = Buffer.alloc(5)

            return Buffer.concat([prefix, codeAscii, postfix]).toString("hex")
        } else if (HEX_REGEX.test(codeString)) {
            // raw hex code
            return Buffer.from(codeString).toString("hex")
        }

        throw new Error("invalid currency code")
    }

    /**
     *    Serializes a hexadecimal string as binary and confirms that it's 128 bits
     *
     * @param contents
     * @returns {string}
     */
    hash128ToBytes(contents) {
        if (/^0+$/.exec(contents)) {
            // Edge case, an all-zero bytes input returns an empty string
            return ""
        }

        const buffer = this.hashToBytes(contents)
        if(buffer.length !== 16) {
            // 16 bytes = 128 bits
            throw new Error("Hash128 is not 128 bits long")
        }

        return buffer.toString("hex")
    }

    /**
     *    Serializes a hexadecimal string as binary and confirms that it's 160 bits
     *
     * @param contents
     * @returns {string}
     */
    hash160ToBytes(contents) {
        const buffer = this.hashToBytes(contents)
        if(buffer.length !== 20) {
            // 20 bytes = 160 bits
            throw new Error("Hash160 is not 160 bits long")
        }

        return buffer.toString("hex")
    }

    /**
     *    Serializes a hexadecimal string as binary and confirms that it's 128 bits
     *
     * @param contents
     * @returns {string}
     */
    hash256ToBytes(contents) {
        const buffer = this.hashToBytes(contents)
        if(buffer.length !== 32) {
            // 32 bytes = 256 bits
            throw new Error("Hash256 is not 256 bits long")
        }

        return buffer.toString("hex")
    }

    /**
     *     Helper function; serializes a hash value from a hexadecimal string
     *     of any length.
     *
     * @param contents
     * @returns {string}
     */
    hashToBytes(contents) {
        return Buffer.from(contents).toString("hex")
    }

    /**
     *     Serialize an object from decoded JSON.
     *     Each object must have a type wrapper and an inner object. For example:
     *
     *     {
     *         // type wrapper
     *         "SignerEntry": {
     *             // inner object
     *             "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
     *             "SignerWeight": 1
     *         }
     *     }
     *
     *     Puts the child fields (e.g. Account, SignerWeight) in canonical order
     *     and appends an object end marker.
     *
     * @param object
     * @returns {string}
     */
    objectToBytes(object) {
        const childOrder = Object.keys(object).sort(sortFuncCanonical.bind(this))

        let fieldsAsBytes = [];

        for (const fieldName of childOrder) {
            if (this.definitions["FIELDS"][fieldName]["isSerialized"]) {
                const fieldValue = object[fieldName]
                const fieldBytes = this.fieldToBytes(fieldName, fieldValue)
                this._logger(fieldName + ": " + fieldBytes.toUpperCase())
                fieldsAsBytes.push(fieldBytes)
            }
        }

        fieldsAsBytes.push(this.fieldId("ObjectEndMarker"))

        return fieldsAsBytes.join('')
    }

    /**
     *     Serialize a PathSet, which is an array of arrays,
     *     where each inner array represents one possible payment path.
     *     A path consists of "path step" objects in sequence, each with one or
     *     more of "account", "currency", and "issuer" fields, plus (ignored) "type"
     *     and "type_hex" fields which indicate which fields are present.
     *     (We re-create the type field for serialization based on which of the core
     *     3 fields are present.)
     *
     * @param pathset
     * @returns {string}
     */
    pathSetToBytes(pathset) {
        if (pathset.length === 0) {
            throw new Error("PathSet type must not be empty")
        }

        let pathsAsHexBytes = ""

        for (let [key, path] of Object.entries(pathset)) {
            const pathBytes = this.pathToBytes(path)
            this._logger("Path " + path + ": " + pathBytes.toUpperCase())
            pathsAsHexBytes += pathBytes

            if (parseInt(key) + 1 === pathset.length) {
                // Last path; add an end byte
                pathsAsHexBytes += "00"
            } else {
                // Add a path separator byte
                pathsAsHexBytes += "ff"
            }
        }

        return pathsAsHexBytes
    }

    /**
     *     Helper function for representing one member of a pathset as a bytes object
     *
     * @param path
     * @returns {string}
     */
    pathToBytes(path) {

        if (path.length === 0) {
            throw new Error("Path must not be empty")
        }

        let pathContents = []

        for (let step of path) {
            let stepData = ""
            let typeByte = 0

            if (step.hasOwnProperty("account")) {
                typeByte |= 0x01
                stepData += this._decodeAddress(step["account"]).toString("hex")
            }

            if (step.hasOwnProperty("currency")) {
                typeByte |= 0x10
                stepData +=  this.currencyCodeToBytes(step["currency"], true)
            }

            if (step.hasOwnProperty("issuer")) {
                typeByte |= 0x20
                stepData += this._decodeAddress(step["issuer"]).toString("hex")
            }

            stepData = this.uint8ToBytes(typeByte) + stepData
            pathContents.push(stepData)
        }

        return pathContents.join('')
    }

    /**
     *     TransactionType field is a special case that is written in JSON
     *     as a string name but in binary as a UInt16.
     *
     * @param txType
     * @returns {string}
     */
    txTypeToBytes(txType) {
        const typeUint = this.definitions["TRANSACTION_TYPES"][txType]

        return this.uint16ToBytes(typeUint)
    }

    uint8ToBytes(value) {
        return Buffer.from([value]).toString("hex")
    }

    uint16ToBytes(value) {
        let buffer = Buffer.alloc(2)
        buffer.writeUInt16BE(value, 0)

        return buffer.toString("hex")
    }

    uint32ToBytes(value) {
        let buffer = Buffer.alloc(4)
        buffer.writeUInt32BE(value, 0)

        return buffer.toString("hex")
    }

    // Core serialization logic -----------------------------------------------------

    /**
     *     Returns a bytes object containing the serialized version of a field
     *     including its field ID prefix.
     *
     * @param fieldName
     * @param fieldValue
     * @returns {string}
     */
    fieldToBytes(fieldName, fieldValue) {
        const fieldType = this.definitions["FIELDS"][fieldName]["type"]
        this._logger("Serializing field " + fieldName + " of type " + fieldType)

        const idPrefix = this.fieldId(fieldName)

        // Special case: convert from string to UInt16
        if (fieldName === "TransactionType") {
            const fieldBytes = this.txTypeToBytes(fieldValue)
            this._logger("ID Prefix is: " + idPrefix.toUpperCase())
            this._logger(fieldName + ' : ' + fieldBytes.toUpperCase())

            return idPrefix + fieldBytes
        }

        const dispatch = {
            "AccountID": this.accountIdToBytes.bind(this),
            "Amount": this.amountToBytes.bind(this),
            "Blob": this.blobToBytes.bind(this),
            "Hash128": this.hash128ToBytes.bind(this),
            "Hash160": this.hash160ToBytes.bind(this),
            "Hash256": this.hash256ToBytes.bind(this),
            "PathSet": this.pathSetToBytes.bind(this),
            "STArray": this.arrayToBytes.bind(this),
            "STObject": this.objectToBytes.bind(this),
            "UInt8" : this.uint8ToBytes.bind(this),
            "UInt16": this.uint16ToBytes.bind(this),
            "UInt32": this.uint32ToBytes.bind(this),
        }

        const fieldBytes = dispatch[fieldType](fieldValue)

        if (fieldBytes.length === 0) {
            this._logger('Unset field: ' + fieldName)

            return ''
        }

        this._logger("ID Prefix is: " + idPrefix.toUpperCase())
        this._logger(fieldName + ': ' + fieldBytes.toUpperCase())

        return idPrefix.toString("hex") + fieldBytes
    }

    /**
     * Takes a transaction as decoded JSON and returns a bytes object representing
     *     the transaction in binary format.
     *
     *     The input format should omit transaction metadata and the transaction
     *     should be formatted with the transaction instructions at the top level.
     *     ("hash" can be included, but will be ignored)
     *
     *     If for_signing=True, then only signing fields are serialized, so you can use
     *     the output to sign the transaction.
     *
     *     SigningPubKey and TxnSignature are optional, but the transaction can't
     *     be submitted without them.
     *
     *     For example:
     *
     *     {
     *       "TransactionType" : "Payment",
     *       "Account" : "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
     *       "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
     *       "Amount" : {
     *          "currency" : "USD",
     *          "value" : "1",
     *          "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
     *       },
     *       "Fee": "12",
     *       "Flags": 2147483648,
     *       "Sequence": 2
     *     }
     *
     * @param tx
     * @param forSigning
     * @returns {string}
     */
    serializeTx(tx, forSigning = false)
    {
        const fieldOrder = Object.keys(tx).sort(sortFuncCanonical.bind(this))

        let fieldsAsBytes = []

        for (const fieldName of fieldOrder) {
            if (this.definitions["FIELDS"][fieldName]["isSerialized"]) {
                if (forSigning && !this.definitions["FIELDS"][fieldName]["isSigningField"]) {
                    // Skip non-signing fields in forSigning mode.
                    continue
                }

                const fieldValue = tx[fieldName]
                const fieldBytes = this.fieldToBytes(fieldName, fieldValue)
                fieldsAsBytes.push(fieldBytes)
            }
        }

        return fieldsAsBytes.join('')
    }
}

module.exports = TxSerializer