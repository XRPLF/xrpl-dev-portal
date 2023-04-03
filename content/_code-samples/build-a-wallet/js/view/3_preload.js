const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onEnterAccountAddress: (address) => {
        ipcRenderer.send('address-entered', address)
    },
    onUpdateLedgerData: (callback) => {
        ipcRenderer.on('update-ledger-data', callback)
    },
    onUpdateAccountData: (callback) => {
        ipcRenderer.on('update-account-data', callback)
    }
})