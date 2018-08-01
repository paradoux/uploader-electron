const electron = require('electron');
var fileWatcher = require("chokidar");
const { app, webContents, BrowserWindow, ipcMain } = electron;
const fs = require('fs');

const path = require('path');
const url = require('url');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 700 });

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
            var data = fs.readFileSync(path, 'utf-8', (err, data) => {
                if (err) {
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                }
            });

            (fs.statSync(path).size <= 2000000) ? mainWindow.webContents.send('fileupload', data) : console.error('Sorry, this file is too big to be uploaded')

        })
        .on('error', function (error) {
            console.log('Error happened', error);
        })
        .on('ready', onWatcherReady)
}

StartWatcher("C:/Users/Marti/Desktop/FHIR")

