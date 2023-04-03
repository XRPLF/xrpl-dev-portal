const xrpl = require("xrpl");
const prepareReserve = (ledger) => {
    const reserveBaseXrp = xrpl.dropsToXrp(ledger.reserve_base)
    const reserveIncrementXrp = xrpl.dropsToXrp(ledger.reserve_inc)

    return { reserveBaseXrp, reserveIncrementXrp }
}

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

module.exports = { prepareReserve, prepareAccountData }