const xrpl = require("xrpl");

/**
 * Prepares, signs and submits a payment transaction
 *
 * @param paymentData
 * @param client
 * @param wallet
 * @returns {Promise<*>}
 */
const sendXrp = async (paymentData, client, wallet) => {
    // Reference: https://xrpl.org/docs/references/protocol/transactions/types/payment
    const paymentTx = {
        "TransactionType": "Payment",
        "Account": wallet.address,
        "Amount": xrpl.xrpToDrops(paymentData.amount),
        "Destination": paymentData.destinationAddress,
        "DestinationTag": parseInt(paymentData.destinationTag)
    }

    const preparedTx = await client.autofill(paymentTx)

    const signedTx = wallet.sign(preparedTx)

    return  await client.submitAndWait(signedTx.tx_blob)
}

module.exports = { sendXrp }
