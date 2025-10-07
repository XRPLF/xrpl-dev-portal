const { app, BrowserWindow } = require('electron')

const path = require('path')

/**
 * Main function: create application window, preload the code to communicate
 * between the renderer Process and the main Process, load a layout,
 * and perform the main logic.
 */
const createWindow = () => {
    // Create the application window
    const appWindow = new BrowserWindow({
        width: 1024,
        height: 768
    })

    // Load a layout
    appWindow.loadFile(path.join(__dirname, 'view', 'template.html'))
    return appWindow
}

// Here we have to wait for the application to signal that it is ready
// to execute our code. In this case we just create a main window.
app.whenReady().then(() => {
    createWindow()
})
