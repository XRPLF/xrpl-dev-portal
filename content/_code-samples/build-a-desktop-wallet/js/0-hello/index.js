const { app, BrowserWindow } = require('electron')

const path = require('path')

/**
 * This is our main function, it creates our application window, preloads the code we will need to communicate
 * between the renderer Process and the main Process, loads a layout and performs the main logic
 */
const createWindow = () => {

    // Creates the application window
    const appWindow = new BrowserWindow({
        width: 1024,
        height: 768
    })

    // Loads a layout
    appWindow.loadFile(path.join(__dirname, 'view', 'template.html'))

    return appWindow
}

// Here we have to wait for the application to signal that it is ready
// to execute our code. In this case we just create a main window.
app.whenReady().then(() => {
    createWindow()
})
