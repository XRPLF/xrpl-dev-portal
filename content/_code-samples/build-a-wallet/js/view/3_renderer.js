document.addEventListener('DOMContentLoaded', openAccountAddressDialog);

function openAccountAddressDialog(){
    const accountAddressDialog = document.getElementById('account-address-dialog');
    const accountAddressInput = accountAddressDialog.querySelector('input');
    const submitButton = accountAddressDialog.querySelector('button[type="submit"]');
    const resetButton = accountAddressDialog.querySelector('button[type="reset"]');

    submitButton.addEventListener('click', () => {
        const address = accountAddressInput.value;
        window.electronAPI.onEnterAccountAddress(address)
        accountAddressDialog.close()
    });

    resetButton.addEventListener('click', () => {
        accountAddressInput.value = '';
    });

    accountAddressDialog.showModal()
}

const ledgerIndexEl = document.getElementById('ledger-index')
const ledgerHashEl = document.getElementById('ledger-hash')
const ledgerCloseTimeEl = document.getElementById('ledger-close-time')

const accountAddressClassicEl = document.getElementById('account-address-classic')
const accountAddressXEl = document.getElementById('account-address-x')
const accountBalanceEl = document.getElementById('account-balance')
const accountReserveEl = document.getElementById('account-reserve')

window.electronAPI.onUpdateLedgerData((_event, ledger) => {
    ledgerIndexEl.innerText = ledger.ledgerIndex
    ledgerHashEl.innerText = ledger.ledgerHash
    ledgerCloseTimeEl.innerText = ledger.ledgerCloseTime
})

window.electronAPI.onUpdateAccountData((_event, value) => {
    accountAddressClassicEl.innerText = value.classicAddress
    accountAddressXEl.innerText = value.xAddress
    accountBalanceEl.innerText = value.xrpBalance
    accountReserveEl.innerText = value.xrpReserve
})
