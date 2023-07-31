const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
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
    onUpdateLedgerData: (callback) => {
        ipcRenderer.on('update-ledger-data', callback)
    },
    onUpdateAccountData: (callback) => {
        ipcRenderer.on('update-account-data', callback)
    },
    onUpdateTransactionData: (callback) => {
        ipcRenderer.on('update-transaction-data', callback)
    },

    // Step 7 code additions - start
    onClickSendXrp: (paymentData) => {
        ipcRenderer.send('send-xrp-action', paymentData)
    },
    onSendXrpTransactionFinish: (callback) => {
        ipcRenderer.on('send-xrp-transaction-finish', callback)
    }
    // Step 7 code additions - start
})
