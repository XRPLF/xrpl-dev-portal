const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateLedgerIndex: (callback) => {
        ipcRenderer.on('update-ledger-index', callback)
    }
})