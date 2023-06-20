const xrpl = require("xrpl");

const prepareTxData = (transactions) => {
    return transactions.map(transaction => ({
        confirmed: transaction.tx.date,
        type: transaction.tx.TransactionType,
        from: transaction.tx.Account,
        to: transaction.tx.Destination,
        value: xrpl.dropsToXrp(transaction.tx.Amount),
        hash: transaction.tx.hash
    }))
}

module.exports = { prepareTxData }
