document.addEventListener('DOMContentLoaded', openSeedDialog);

function openSeedDialog(){
    const seedDialog = document.getElementById('account-address-dialog');
    const accountAddressInput = seedDialog.querySelector('input');
    const submitButton = seedDialog.querySelector('button[type="submit"]');
    const resetButton = seedDialog.querySelector('button[type="reset"]');

    submitButton.addEventListener('click', () => {
        const address = accountAddressInput.value;
        window.electronAPI.onEnterAccountAddress(address)
    });

    resetButton.addEventListener('click', () => {
        seedInput.value = '';
        console.log('reset');
    });

    seedDialog.showModal()
}

const ledgerIndexEl = document.getElementById('ledger-index')
const ledgerHashEl = document.getElementById('ledger-hash')
const ledgerCloseTimeEl = document.getElementById('ledger-close-time')

const accountAddressClassicEl = document.getElementById('account-address-classic')
const accountAddressXEl = document.getElementById('account-address-x')
const accountBalanceEl = document.getElementById('account-balance')
const accountReserveEl = document.getElementById('account-reserve')

window.electronAPI.onUpdateLedgerData((_event, value) => {
    ledgerIndexEl.innerText = value.ledger_index
    ledgerHashEl.innerText = value.ledger_hash
    ledgerCloseTimeEl.innerText = value.ledger_time
})

window.electronAPI.onUpdateAccountData((_event, value) => {
    accountAddressClassicEl.innerText = value.classicAddress
    accountAddressXEl.innerText = value.xAddress
    accountBalanceEl.innerText = value.xrpBalance
    accountReserveEl.innerText = value.xrpReserve
})