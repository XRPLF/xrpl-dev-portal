const xrpl = require("xrpl");

// The rippled server and its APIs represent time as an unsigned integer.
// This number measures the number of seconds since the "Ripple Epoch" of
// January 1, 2000 (00:00 UTC). This is like the way the Unix epoch  works,
// Reference: https://xrpl.org/basic-data-types.html
const RIPPLE_EPOCH = 946684800;

const prepareAccountData = (rawAccountData, reserve) => {
    const numOwners = rawAccountData.OwnerCount || 0

    let xrpReserve = null
    if (reserve) {
        //TODO: Decimal?
        xrpReserve = reserve.reserveBaseXrp + (reserve.reserveIncrementXrp * numOwners)
    }

    return {
        classicAddress: rawAccountData.Account,
        xAddress: xrpl.classicAddressToXAddress(rawAccountData.Account, false, true),
        xrpBalance: xrpl.dropsToXrp(rawAccountData.Balance),
        xrpReserve: xrpReserve
    }
}

const prepareLedgerData = (rawLedgerData) => {
    const timestamp = RIPPLE_EPOCH + (rawLedgerData.ledger_time ?? rawLedgerData.close_time)
    const dateTime = new Date(timestamp * 1000)
    const dateTimeString = dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString()

    return {
        ledgerIndex: rawLedgerData.ledger_index,
        ledgerHash: rawLedgerData.ledger_hash,
        ledgerCloseTime: dateTimeString
    }
}

const prepareReserve = (ledger) => {
    const reserveBaseXrp = xrpl.dropsToXrp(ledger.reserve_base)
    const reserveIncrementXrp = xrpl.dropsToXrp(ledger.reserve_inc)

    return { reserveBaseXrp, reserveIncrementXrp }
}

module.exports = { prepareAccountData, prepareLedgerData, prepareReserve }
