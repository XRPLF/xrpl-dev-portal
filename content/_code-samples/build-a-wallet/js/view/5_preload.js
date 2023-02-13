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
        console.log(paymentData)
        ipcRenderer.send('testSendXrp', paymentData)
    }
})