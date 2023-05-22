const ledgerIndexEl = document.getElementById('ledger-index')

// Step 2 code additions - start
const ledgerHashEl = document.getElementById('ledger-hash')
const ledgerCloseTimeEl = document.getElementById('ledger-close-time')
// Step 2 code additions - end

window.electronAPI.onUpdateLedgerData((_event, value) => {
    ledgerIndexEl.innerText = value.ledger_index

    // Step 2 code additions - start
    ledgerHashEl.innerText = value.ledger_hash
    ledgerCloseTimeEl.innerText = value.ledger_time
    // Step 2 code additions - end
})
