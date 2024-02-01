const { contextBridge, ipcRenderer } = require('electron');

// Expose functionality from main process (aka. "backend") to be used by the renderer process(aka. "backend")
contextBridge.exposeInMainWorld('electronAPI', {
    // By calling "onUpdateLedgerIndex" in the frontend process we can now attach a callback function to
    // by making onUpdateLedgerIndex available at the window level.
    // The subscribed function gets triggered whenever the backend process triggers the event 'update-ledger-index'
    onUpdateLedgerIndex: (callback) => {
        ipcRenderer.on('update-ledger-index', callback)
    }
})
