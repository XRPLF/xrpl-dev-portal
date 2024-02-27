const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateLedgerData: (callback) => {
        ipcRenderer.on('update-ledger-data', callback)
    }
})
