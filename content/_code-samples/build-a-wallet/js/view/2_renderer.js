const ledgerIndexEl = document.getElementById('ledger-index')
const ledgerHashEl = document.getElementById('ledger-hash')
const ledgerCloseTimeEl = document.getElementById('ledger-close-time')

window.electronAPI.onUpdateLedgerData((_event, value) => {
    ledgerIndexEl.innerText = value.ledger_index
    ledgerHashEl.innerText = value.ledger_hash
    ledgerCloseTimeEl.innerText = value.ledger_time
})
