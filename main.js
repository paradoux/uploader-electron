const electron = require('electron');
var fileWatcher = require("chokidar");
const { app, webContents, BrowserWindow, ipcMain } = electron;
const fs = require('fs');

const path = require('path');
const url = require('url');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    /*     const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/../build/index.html'),
            protocol: 'file:',
            slashes: true
        }); */
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

var { dialog } = electron;

function StartWatcher(path) {
    var chokidar = require("chokidar");

    var watcher = chokidar.watch(path, {
        ignored: /[\/\\]\./,
        persistent: true,
        ignoreInitial: true
    });

    function onWatcherReady() {
        console.info('From here can you check for real changes, the initial scan has been completed.');
    }
    watcher
        .on('add', (path) => {
            console.log(path)
            var data = fs.readFileSync(path, 'utf-8', (err, data) => {
                if (err) {
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                }
            });
            mainWindow.webContents.send('fileupload', data)
        })
        .on('error', function (error) {
            console.log('Error happened', error);
        })
        .on('ready', onWatcherReady)
}

StartWatcher("C:/Users/Marti/Desktop/FHIR")

