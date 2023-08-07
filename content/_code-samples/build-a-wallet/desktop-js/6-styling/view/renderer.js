// Step 5 code additions - start
window.electronAPI.onOpenSeedDialog((_event) => {
    const seedDialog = document.getElementById('seed-dialog')
    const seedInput = seedDialog.querySelector('input')
    const submitButton = seedDialog.querySelector('button[type="submit"]')

    submitButton.addEventListener('click', () => {
        const seed = seedInput.value
        window.electronAPI.onEnterSeed(seed)
        seedDialog.close()
    });

    seedDialog.showModal()
})

window.electronAPI.onOpenPasswordDialog((_event) => {
    const passwordDialog = document.getElementById('password-dialog')
    const passwordInput = passwordDialog.querySelector('input')
    const submitButton = passwordDialog.querySelector('button[type="submit"]')
    const changeSeedButton = passwordDialog.querySelector('button[type="button"]')

    submitButton.addEventListener('click', () => {
        const password = passwordInput.value
        window.electronAPI.onEnterPassword(password)
        passwordDialog.close()
    });

    changeSeedButton.addEventListener('click', () => {
        passwordDialog.close()
        window.electronAPI.requestSeedChange()
    });

    passwordDialog.showModal()
});
// Step 5 code additions - end

const ledgerIndexEl = document.getElementById('ledger-index')
const ledgerHashEl = document.getElementById('ledger-hash')
const ledgerCloseTimeEl = document.getElementById('ledger-close-time')

window.electronAPI.onUpdateLedgerData((_eventledger, ledger) => {
    ledgerIndexEl.innerText = ledger.ledgerIndex
    ledgerHashEl.innerText = ledger.ledgerHash
    ledgerCloseTimeEl.innerText = ledger.ledgerCloseTime
})

const accountAddressClassicEl = document.getElementById('account-address-classic')
const accountAddressXEl = document.getElementById('account-address-x')
const accountBalanceEl = document.getElementById('account-balance')

window.electronAPI.onUpdateAccountData((_event, value) => {
    accountAddressClassicEl.innerText = value.classicAddress
    accountAddressXEl.innerText = value.xAddress
    accountBalanceEl.innerText = value.xrpBalance
})

const txTableBodyEl = document.getElementById('tx-table').tBodies[0]
window.testEl = txTableBodyEl

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
