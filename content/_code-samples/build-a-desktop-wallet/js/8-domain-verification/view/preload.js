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
    onClickSendXrp: (paymentData) => {
        ipcRenderer.send('send-xrp-action', paymentData)
    },
    onSendXrpTransactionFinish: (callback) => {
        ipcRenderer.on('send-xrp-transaction-finish', callback)
    },

    // Step 8 code additions - start
    onDestinationAccountChange: (callback) => {
        ipcRenderer.send('destination-account-change', callback)
    },
    onUpdateDomainVerificationData: (callback) => {
        ipcRenderer.on('update-domain-verification-data', callback)
    },
    // Step 8 code additions - start

})
