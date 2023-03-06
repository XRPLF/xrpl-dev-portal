const xrpl = require("xrpl");
const sendXrp = async (paymentData, client, wallet) => {
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