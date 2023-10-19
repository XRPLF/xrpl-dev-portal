const ledgerIndexEl = document.getElementById('ledger-index')

// Here we define the callback function that performs the content update
// whenever 'update-ledger-index' is called by the main process
window.electronAPI.onUpdateLedgerIndex((_event, value) => {
    ledgerIndexEl.innerText = value
})
