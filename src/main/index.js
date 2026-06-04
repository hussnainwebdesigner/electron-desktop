

// import { app, shell, BrowserWindow, ipcMain, dialog, session } from 'electron'
// import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';
// import { join } from 'path'
// import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import billIcon from '../../resources/invoice.png?asset'

// function createWindow() {
//   // Create the browser window without default frame
//   const mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     frame: false,
//     show: true,
//     ...(process.platform === 'win32' || process.platform === 'darwin' || process.platform === 'linux'
//       ? { icon: billIcon } : {}),
//     webPreferences: {
//       preload: join(__dirname, '../preload/index.js'),
//       sandbox: false,
//       webSecurity: true, // Only for development
//       contextIsolation: true,
//       nodeIntegration: false
//     }
//   })

//   mainWindow.on('ready-to-show', () => {
//     mainWindow.show()
//   })

//   mainWindow.webContents.setWindowOpenHandler((details) => {
//     shell.openExternal(details.url)
//     return { action: 'deny' }
//   })

//   // HMR for renderer base on electron-vite cli.
//   if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
//     mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
//     mainWindow.webContents.openDevTools()
//   } else {
//     mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
//     // mainWindow.webContents.openDevTools()
//   }

//   return mainWindow
// }


// // Setup IPC handlers
// function setupIpcHandlers() {
//   // Window control handlers
//   ipcMain.on('window:close', () => {
//     const window = BrowserWindow.getFocusedWindow()
//     if (window) window.close()
//   })

//   ipcMain.on('window:minimize', () => {
//     const window = BrowserWindow.getFocusedWindow()
//     if (window) window.minimize()
//   })

//   ipcMain.on('window:maximize', (event) => {
//     const window = BrowserWindow.fromWebContents(event.sender)
//     if (window) {
//       if (window.isMaximized()) {
//         window.unmaximize()
//         event.sender.send('window:state-changed', { isMaximized: false })
//       } else {
//         window.maximize()
//         event.sender.send('window:state-changed', { isMaximized: true })
//       }
//     }
//   })

//   ipcMain.on('window:new', () => {
//     createWindow()
//   })

//   ipcMain.on('devtools:open', (event) => {
//     const window = BrowserWindow.fromWebContents(event.sender)
//     if (window) window.webContents.openDevTools()
//   })

//   // Dialog handlers (your existing code)
//   ipcMain.on('dialog:alert', async (event) => {
//     const window = BrowserWindow.fromWebContents(event.sender)
//     if (window) {
//       await dialog.showMessageBox(window, {
//         type: 'info',
//         title: 'Alert',
//         message: 'This is an alert message!',
//         buttons: ['OK']
//       })
//     }
//   })

//   ipcMain.on('dialog:confirm', async (event) => {
//     const window = BrowserWindow.fromWebContents(event.sender)
//     if (window) {
//       const result = await dialog.showMessageBox(window, {
//         type: 'question',
//         title: 'Confirm',
//         message: 'Do you want to proceed?',
//         buttons: ['Yes', 'No']
//       })
//       event.sender.send('dialog:confirm-response', result.response === 0)
//     }
//   })

//   ipcMain.on('dialog:openFile', async (event) => {
//     const window = BrowserWindow.fromWebContents(event.sender)
//     if (window) {
//       const result = await dialog.showOpenDialog(window, {
//         properties: ['openFile'],
//         filters: [{ name: 'All Files', extensions: ['*'] }]
//       })
//       if (!result.canceled && result.filePaths.length > 0) {
//         event.sender.send('dialog:file-selected', result.filePaths[0])
//       }
//     }
//   })

//   ipcMain.on('dialog:saveFile', async (event) => {
//     const window = BrowserWindow.fromWebContents(event.sender)
//     if (window) {
//       const result = await dialog.showSaveDialog(window, {
//         title: 'Save File',
//         defaultPath: 'untitled.txt',
//         filters: [
//           { name: 'Text Files', extensions: ['txt'] },
//           { name: 'All Files', extensions: ['*'] }
//         ]
//       })
//       if (!result.canceled && result.filePath) {
//         event.sender.send('dialog:file-saved', result.filePath)
//       }
//     }
//   })
//   ipcMain.handle('download-pdf', async (_, data) => {
//     const win = BrowserWindow.getFocusedWindow();

//     const filePath = dialog.showSaveDialogSync(win, {
//       defaultPath: data.fileName
//     });

//     if (!filePath) return;

//     const response = await fetch(
//       `${API_URL}${data.url}`,
//       {
//         headers: {
//           Authorization: `Bearer ${data.token}`
//         }
//       }
//     );

//     const buffer = Buffer.from(await response.arrayBuffer());

//     fs.writeFileSync(filePath, buffer);

//     shell.showItemInFolder(filePath);

//     return true;
//   });
//   // Add this to your setupIpcHandlers function
//   function setupIpcHandlers() {
//     // ... existing handlers ...

//     // Cookie debugging endpoint
//     ipcMain.handle('cookie:debug', async (event) => {
//       try {
//         const window = BrowserWindow.fromWebContents(event.sender);
//         const cookies = await window.webContents.session.cookies.get({});
//         console.log('All cookies:', cookies);
//         return cookies;
//       } catch (error) {
//         console.error('Cookie debug error:', error);
//         return [];
//       }
//     });

//     // Force token sync from localStorage to cookie
//     ipcMain.handle('cookie:sync-token', async (event, token) => {
//       try {
//         const window = BrowserWindow.fromWebContents(event.sender);

//         // Clear existing token
//         await window.webContents.session.cookies.remove('https://pharmacy-db-software-server.vercel.app', 'token');

//         // Set new token if provided
//         if (token) {
//           await window.webContents.session.cookies.set({
//             url: 'https://pharmacy-db-software-server.vercel.app',
//             name: 'token',
//             value: token,
//             httpOnly: true,
//             secure: false,
//             sameSite: 'lax',
//             path: '/'
//           });
//         }

//         return { success: true };
//       } catch (error) {
//         console.error('Token sync error:', error);
//         return { success: false, error: error.message };
//       }
//     });
//   }
//   // Add cookie management IPC handlers
//   ipcMain.handle('cookie:set', async (event, { url, name, value }) => {
//     try {
//       const window = BrowserWindow.fromWebContents(event.sender)
//       await window.webContents.session.cookies.set({
//         url: url,
//         name: name,
//         value: value,
//         httpOnly: false,
//         secure: false,
//         sameSite: 'no_restriction'
//       })
//       return { success: true }
//     } catch (error) {
//       console.error('Error setting cookie:', error)
//       return { success: false, error: error.message }
//     }
//   })

//   ipcMain.handle('cookie:get', async (event, { url, name }) => {
//     try {
//       const window = BrowserWindow.fromWebContents(event.sender)
//       const cookies = await window.webContents.session.cookies.get({ url: url })
//       const cookie = cookies.find(c => c.name === name)
//       return cookie ? cookie.value : null
//     } catch (error) {
//       console.error('Error getting cookie:', error)
//       return null
//     }
//   })

//   ipcMain.handle('cookie:remove', async (event, { url, name }) => {
//     try {
//       const window = BrowserWindow.fromWebContents(event.sender)
//       await window.webContents.session.cookies.remove(url, name)
//       return { success: true }
//     } catch (error) {
//       console.error('Error removing cookie:', error)
//       return { success: false, error: error.message }
//     }
//   })

//   ipcMain.on('ping', () => console.log('pong'))
// }

// // 🖨️ THERMAL PRINT HANDLER - FIXED
// ipcMain.handle('print:thermal', async (event, printData) => {
//   const win = BrowserWindow.fromWebContents(event.sender);

//   try {
//     const { html, printerName, copies = 1, silent = false } = printData;

//     // Create a hidden window for printing
//     const printWindow = new BrowserWindow({
//       show: false,
//       parent: win, // Set parent window
//       modal: false,
//       webPreferences: {
//         nodeIntegration: false,
//         contextIsolation: true,
//         sandbox: true
//       }
//     });

//     // Load the HTML content
//     await printWindow.loadURL(`data:text/html,${encodeURIComponent(html)}`);

//     // Wait for the content to load and then print
//     return new Promise((resolve, reject) => {
//       printWindow.webContents.on('did-finish-load', () => {
//         const printOptions = {
//           silent: silent,
//           copies: copies,
//           pageSize: 'A4',
//           margins: {
//             marginType: 'none'
//           }
//         };

//         // If printer name is specified, add it to options
//         if (printerName && printerName !== 'Default Printer' && printerName !== 'default') {
//           printOptions.deviceName = printerName;
//         }

//         // Execute print
//         printWindow.webContents.print(printOptions, (success, errorType) => {
//           if (!success) {
//             console.error('Print failed:', errorType);
//             event.sender.send('print:error', errorType || 'Print failed');
//             reject(new Error(errorType || 'Print failed'));
//           } else {
//             event.sender.send('print:success');
//             resolve({ success: true });
//           }

//           // Close the hidden window after printing with a small delay
//           setTimeout(() => {
//             if (!printWindow.isDestroyed()) {
//               printWindow.destroy();
//             }
//           }, 1000);
//         });
//       });

//       // Handle load errors
//       printWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
//         console.error('Failed to load print content:', errorDescription);
//         event.sender.send('print:error', errorDescription);
//         if (!printWindow.isDestroyed()) {
//           printWindow.destroy();
//         }
//         reject(new Error(errorDescription));
//       });
//     });
//   } catch (error) {
//     console.error('Failed to setup print:', error);
//     event.sender.send('print:error', error.message);
//     return { success: false, error: error.message };
//   }
// });

// // Add handler to get available printers
// ipcMain.handle('print:get-printers', async (event) => {
//   const win = BrowserWindow.fromWebContents(event.sender);

//   try {
//     const printers = await win.webContents.getPrintersAsync();
//     const printerNames = printers.map(printer => printer.name);
//     console.log('Available printers:', printerNames);
//     return printerNames;
//   } catch (error) {
//     console.error('Failed to get printers:', error);
//     return [];
//   }
// });

// ipcMain.on('ping', () => console.log('pong'))

// // App initialization
// app.whenReady().then(async () => {
//   electronApp.setAppUserModelId('com.electron')

//   // Configure default session for cookies
//   const defaultSession = session.defaultSession

//   // Allow cookies for localhost
//   defaultSession.cookies.on('changed', (event, cookie, cause, removed) => {
//     console.log('Cookie changed:', cookie.name, cause, removed)
//   })

//   // Clear existing cookies
//   try {
//     await defaultSession.cookies.remove('https://pharmacy-db-software-server.vercel.app', 'token')
//     console.log('Cookies cleared')
//   } catch (error) {
//     console.error('Error clearing cookies:', error)
//   }

//   app.on('browser-window-created', (_, window) => {
//     optimizer.watchWindowShortcuts(window)
//   })

//   setupIpcHandlers()
//   createWindow()

//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
import { app, shell, BrowserWindow, ipcMain, dialog, session } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import billIcon from '../../resources/invoice.png?asset'
import fs from 'fs'

// Configure autoUpdater logging
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')


// Track update status
let updateAvailable = false
let downloadedUpdate = false

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    show: true,
    ...(process.platform === 'win32' || process.platform === 'darwin' || process.platform === 'linux'
      ? { icon: billIcon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    
    // Check for updates after window is ready
    if (!is.dev) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// Setup auto-updater events
function setupAutoUpdater() {
  // Auto-updater events
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...')
    sendUpdateStatus('checking', { message: 'Checking for updates...' })
  })

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info)
    updateAvailable = true
    sendUpdateStatus('available', {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes
    })
  })

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available:', info)
    sendUpdateStatus('not-available', { message: 'You are using the latest version' })
  })

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err)
    sendUpdateStatus('error', { message: err.message })
  })

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond}`
    logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`
    logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`
    log.info(logMessage)
    
    sendUpdateStatus('downloading', {
      percent: progressObj.percent,
      bytesPerSecond: progressObj.bytesPerSecond,
      transferred: progressObj.transferred,
      total: progressObj.total
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info)
    downloadedUpdate = true
    sendUpdateStatus('downloaded', {
      version: info.version,
      releaseNotes: info.releaseNotes
    })
  })
}

// Send update status to renderer
function sendUpdateStatus(status, data) {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach(window => {
    if (!window.isDestroyed()) {
      window.webContents.send('update-status', { status, ...data })
    }
  })
}

// Setup IPC handlers
function setupIpcHandlers() {
  // Window control handlers
  ipcMain.on('window:close', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) window.close()
  })

  ipcMain.on('window:minimize', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) window.minimize()
  })

  ipcMain.on('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
        event.sender.send('window:state-changed', { isMaximized: false })
      } else {
        window.maximize()
        event.sender.send('window:state-changed', { isMaximized: true })
      }
    }
  })

  ipcMain.on('window:new', () => {
    createWindow()
  })

  ipcMain.on('devtools:open', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) window.webContents.openDevTools()
  })

  // Update control handlers
  ipcMain.on('update:check', () => {
    if (!is.dev) {
      autoUpdater.checkForUpdates()
    }
  })

  ipcMain.on('update:install', () => {
    if (downloadedUpdate) {
      // Install update and restart app
      setImmediate(() => {
        autoUpdater.quitAndInstall()
      })
    }
  })

  // Dialog handlers
  ipcMain.on('dialog:alert', async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      await dialog.showMessageBox(window, {
        type: 'info',
        title: 'Alert',
        message: 'This is an alert message!',
        buttons: ['OK']
      })
    }
  })

  ipcMain.on('dialog:confirm', async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      const result = await dialog.showMessageBox(window, {
        type: 'question',
        title: 'Confirm',
        message: 'Do you want to proceed?',
        buttons: ['Yes', 'No']
      })
      event.sender.send('dialog:confirm-response', result.response === 0)
    }
  })

  ipcMain.on('dialog:openFile', async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      const result = await dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [{ name: 'All Files', extensions: ['*'] }]
      })
      if (!result.canceled && result.filePaths.length > 0) {
        event.sender.send('dialog:file-selected', result.filePaths[0])
      }
    }
  })

  ipcMain.on('dialog:saveFile', async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      const result = await dialog.showSaveDialog(window, {
        title: 'Save File',
        defaultPath: 'untitled.txt',
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })
      if (!result.canceled && result.filePath) {
        event.sender.send('dialog:file-saved', result.filePath)
      }
    }
  })

  ipcMain.handle('download-pdf', async (_, data) => {
    const win = BrowserWindow.getFocusedWindow();
    const filePath = dialog.showSaveDialogSync(win, {
      defaultPath: data.fileName
    });
    if (!filePath) return;
    const response = await fetch(`${API_URL}${data.url}`, {
      headers: { Authorization: `Bearer ${data.token}` }
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    shell.showItemInFolder(filePath);
    return true;
  });

  // Cookie debugging endpoint
  ipcMain.handle('cookie:debug', async (event) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender);
      const cookies = await window.webContents.session.cookies.get({});
      console.log('All cookies:', cookies);
      return cookies;
    } catch (error) {
      console.error('Cookie debug error:', error);
      return [];
    }
  });

  ipcMain.handle('cookie:sync-token', async (event, token) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender);
      await window.webContents.session.cookies.remove('https://pharmacy-db-software-server.vercel.app', 'token');
      if (token) {
        await window.webContents.session.cookies.set({
          url: 'https://pharmacy-db-software-server.vercel.app',
          name: 'token',
          value: token,
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/'
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Token sync error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('cookie:set', async (event, { url, name, value }) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      await window.webContents.session.cookies.set({
        url: url,
        name: name,
        value: value,
        httpOnly: false,
        secure: false,
        sameSite: 'no_restriction'
      })
      return { success: true }
    } catch (error) {
      console.error('Error setting cookie:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('cookie:get', async (event, { url, name }) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      const cookies = await window.webContents.session.cookies.get({ url: url })
      const cookie = cookies.find(c => c.name === name)
      return cookie ? cookie.value : null
    } catch (error) {
      console.error('Error getting cookie:', error)
      return null
    }
  })

  ipcMain.handle('cookie:remove', async (event, { url, name }) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender)
      await window.webContents.session.cookies.remove(url, name)
      return { success: true }
    } catch (error) {
      console.error('Error removing cookie:', error)
      return { success: false, error: error.message }
    }
  })

  // Thermal print handler
  ipcMain.handle('print:thermal', async (event, printData) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    try {
      const { html, printerName, copies = 1, silent = false } = printData;
      const printWindow = new BrowserWindow({
        show: false,
        parent: win,
        modal: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true
        }
      });
      await printWindow.loadURL(`data:text/html,${encodeURIComponent(html)}`);
      return new Promise((resolve, reject) => {
        printWindow.webContents.on('did-finish-load', () => {
          const printOptions = {
            silent: silent,
            copies: copies,
            pageSize: 'A4',
            margins: { marginType: 'none' }
          };
          if (printerName && printerName !== 'Default Printer' && printerName !== 'default') {
            printOptions.deviceName = printerName;
          }
          printWindow.webContents.print(printOptions, (success, errorType) => {
            if (!success) {
              console.error('Print failed:', errorType);
              event.sender.send('print:error', errorType || 'Print failed');
              reject(new Error(errorType || 'Print failed'));
            } else {
              event.sender.send('print:success');
              resolve({ success: true });
            }
            setTimeout(() => {
              if (!printWindow.isDestroyed()) {
                printWindow.destroy();
              }
            }, 1000);
          });
        });
        printWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
          console.error('Failed to load print content:', errorDescription);
          event.sender.send('print:error', errorDescription);
          if (!printWindow.isDestroyed()) {
            printWindow.destroy();
          }
          reject(new Error(errorDescription));
        });
      });
    } catch (error) {
      console.error('Failed to setup print:', error);
      event.sender.send('print:error', error.message);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('print:get-printers', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    try {
      const printers = await win.webContents.getPrintersAsync();
      const printerNames = printers.map(printer => printer.name);
      console.log('Available printers:', printerNames);
      return printerNames;
    } catch (error) {
      console.error('Failed to get printers:', error);
      return [];
    }
  });
}

// App initialization
app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')
  
  const defaultSession = session.defaultSession
  defaultSession.cookies.on('changed', (event, cookie, cause, removed) => {
    console.log('Cookie changed:', cookie.name, cause, removed)
  })

  try {
    await defaultSession.cookies.remove('https://pharmacy-db-software-server.vercel.app', 'token')
    console.log('Cookies cleared')
  } catch (error) {
    console.error('Error clearing cookies:', error)
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setupIpcHandlers()
  setupAutoUpdater()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})