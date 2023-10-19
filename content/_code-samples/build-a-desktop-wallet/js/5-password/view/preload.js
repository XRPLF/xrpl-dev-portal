const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Step 5 code additions - start
    onOpenSeedDialog: (callback) => {
        ipcRenderer.on('open-seed-dialog', callback)
    },
    onEnterSeed: (seed) => {
        ipcRenderer.send('seed-entered', seed)
    },
    onOpenPasswordDialog: (callback) => {
        ipcRenderer.on('open-password-dialog', callback)
    },
    onEnterPassword: (password) => {
        ipcRenderer.send('password-entered', password)
    },
    requestSeedChange: () => {
        ipcRenderer.send('request-seed-change')
    },
    // Step 5 code additions - end

    onUpdateLedgerData: (callback) => {
        ipcRenderer.on('update-ledger-data', callback)
    },
    onUpdateAccountData: (callback) => {
        ipcRenderer.on('update-account-data', callback)
    },
    onUpdateTransactionData: (callback) => {
        ipcRenderer.on('update-transaction-data', callback)
    }
})
