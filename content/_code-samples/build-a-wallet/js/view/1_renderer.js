const ledgerIndexEl = document.getElementById('ledger-index')

window.electronAPI.onUpdateLedgerIndex((_event, value) => {
    ledgerIndexEl.innerText = value
})