const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateLedgerData: (callback) => {
        ipcRenderer.on('update-ledger-data', callback)
    },
    onEnterAccountAddress: (address) => {
        ipcRenderer.send('address-entered', address)
    },
    onUpdateAccountData: (callback) => {
        ipcRenderer.on('update-account-data', callback)
    },

    // Step 4 code additions - start
    onUpdateTransactionData: (callback) => {
        ipcRenderer.on('update-transaction-data', callback)
    }
    // Step 4 code additions - end
})
