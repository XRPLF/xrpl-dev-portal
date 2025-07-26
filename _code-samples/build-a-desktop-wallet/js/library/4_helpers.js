const xrpl = require("xrpl");

const prepareTxData = (transactions) => {
    return transactions.map(transaction => {
        let tx_value = "-"
        if (transaction.meta !== undefined && transaction.meta.delivered_amount !== undefined) {
            tx_value = getDisplayableAmount(transaction.meta.delivered_amount)
        }

        return {
            confirmed: transaction.close_time_iso,
            type: transaction.tx_json.TransactionType,
            from: transaction.tx_json.Account,
            to: transaction.tx_json.Destination ?? "-",
            value: tx_value,
            hash: transaction.hash
        }
    })
}

const getDisplayableAmount = (rawAmount) => {
    if (rawAmount === 'unavailable') {
        // Special case for pre-2014 partial payments.
        return rawAmount
    } else if (typeof rawAmount === 'string') {
        // It's an XRP amount in drops. Convert to decimal.
        return xrpl.dropsToXrp(rawAmount) + ' XRP'
    } else {
        //It's a token (IOU) amount.
        return rawAmount.value + ' ' + rawAmount.currency
    }
}

module.exports = { prepareTxData }
