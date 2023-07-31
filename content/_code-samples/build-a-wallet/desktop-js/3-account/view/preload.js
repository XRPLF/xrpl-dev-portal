const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateLedgerData: (callback) => {
        ipcRenderer.on('update-ledger-data', callback)
    },

    // Step 3 code additions - start
    onEnterAccountAddress: (address) => {
        ipcRenderer.send('address-entered', address)
    },
    onUpdateAccountData: (callback) => {
        ipcRenderer.on('update-account-data', callback)
    }
    //Step 3 code additions - end
})
