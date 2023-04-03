const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
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
    onDestinationAccountChange: (callback) => {
        ipcRenderer.send('destination-account-change', callback)
    },
    onUpdateDomainVerificationData: (callback) => {
        ipcRenderer.on('update-domain-verification-data', callback)
    },

})