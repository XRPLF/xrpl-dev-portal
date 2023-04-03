const ledgerIndexEl = document.getElementById('ledger-index')
const ledgerHashEl = document.getElementById('ledger-hash')
const ledgerCloseTimeEl = document.getElementById('ledger-close-time')

window.electronAPI.onUpdateLedgerData((_event, value) => {
    ledgerIndexEl.innerText = value.ledger_index
    ledgerHashEl.innerText = value.ledger_hash
    ledgerCloseTimeEl.innerText = value.ledger_time
})

const accountAddressClassicEl = document.getElementById('account-address-classic')
const accountAddressXEl = document.getElementById('account-address-x')
const accountBalanceEl = document.getElementById('account-balance')
const accountReserveEl = document.getElementById('account-reserve')

window.electronAPI.onUpdateAccountData((_event, value) => {
    accountAddressClassicEl.innerText = value.classicAddress
    accountAddressXEl.innerText = value.xAddress
    accountBalanceEl.innerText = value.xrpBalance
    accountReserveEl.innerText = value.xrpReserve
})

const txTableBodyEl = document.getElementById('tx-table').tBodies[0]

window.electronAPI.onUpdateTransactionData((_event, transactions) => {
    for (let transaction of transactions) {
        txTableBodyEl.insertAdjacentHTML( 'beforeend',
        "<tr>" +
            "<td>" + transaction.confirmed + "</td>" +
            "<td>" + transaction.type + "</td>" +
            "<td>" + transaction.from + "</td>" +
            "<td>" + transaction.to + "</td>" +
            "<td>" + transaction.value + "</td>" +
            "<td>" + transaction.hash + "</td>" +
            "</tr>"
        )
    }
})

const modalButton = document.getElementById('send-xrp-modal-button')
const modalDialog = new bootstrap.Modal(document.getElementById('send-xrp-modal'))
modalButton.addEventListener('click', () => {
    modalDialog.show()
})

const destinationAddressEl = document.getElementById('input-destination-address')
const destinationTagEl = document.getElementById('input-destination-tag')
const amountEl = document.getElementById('input-xrp-amount')
const sendXrpButtonEl = document.getElementById('send-xrp-submit-button')

sendXrpButtonEl.addEventListener('click', () => {
    modalDialog.hide()
    const destinationAddress = destinationAddressEl.value
    const destinationTag = destinationTagEl.value
    const amount = amountEl.value

    window.electronAPI.onClickSendXrp({destinationAddress, destinationTag, amount})
})

window.electronAPI.onSendXrpTransactionFinish((_event) => {
    destinationAddressEl.value = ''
    destinationTagEl.value = ''
    amountEl.value = ''
})