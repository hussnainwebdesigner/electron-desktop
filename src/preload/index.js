
// import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// // Custom APIs for renderer
// const api = {
//   // Window event listeners
//   onWindowStateChange: (callback) => {
//     ipcRenderer.on('window:state-changed', (event, state) => callback(state))
//   },

//   // Dialog response listeners
//   onConfirmResponse: (callback) => {
//     ipcRenderer.on('dialog:confirm-response', (event, response) => callback(response))
//   },

//   onFileSelected: (callback) => {
//     ipcRenderer.on('dialog:file-selected', (event, filePath) => callback(filePath))
//   },

//   onFileSaved: (callback) => {
//     ipcRenderer.on('dialog:file-saved', (event, filePath) => callback(filePath))
//   },

//   // Remove listeners (cleanup)
//   removeAllListeners: (channel) => {
//     ipcRenderer.removeAllListeners(channel)
//   },

//   // Utility to remove specific listeners
//   removeListener: (channel, callback) => {
//     ipcRenderer.removeListener(channel, callback)
//   }
// }

// // Expose Electron APIs to renderer
// if (process.contextIsolated) {
//   try {
//     // Expose electronAPI from @electron-toolkit/preload
//     contextBridge.exposeInMainWorld('electron', electronAPI)

//     // Expose custom electronAPI with window controls, dialogs, AND COOKIE MANAGEMENT
//     contextBridge.exposeInMainWorld('electronAPI', {
//       // Add these to your exposed APIs

//       // ... existing APIs ...

//       // Cookie debugging
//       debugCookies: async () => {
//         return await ipcRenderer.invoke('cookie:debug');
//       },

//       // Sync token from localStorage to cookie
//       syncToken: async (token) => {
//         return await ipcRenderer.invoke('cookie:sync-token', token);
//       },

//       // Check if cookie exists
//       checkCookie: async (name) => {
//         return await ipcRenderer.invoke('cookie:get', {
//           url: 'https://pharmacy-db-software-server.vercel.app',
//           name: name
//         });
//       },

//       // Window controls
//       closeWindow: () => ipcRenderer.send('window:close'),
//       minimizeWindow: () => ipcRenderer.send('window:minimize'),
//       maximizeWindow: () => ipcRenderer.send('window:maximize'),
//       newWindow: () => ipcRenderer.send('window:new'),

//       // DevTools
//       openDevTools: () => ipcRenderer.send('devtools:open'),

//       // Cookie management - ADD THESE
//       setCookie: async (name, value) => {
//         return await ipcRenderer.invoke('cookie:set', {
//           url: 'https://pharmacy-db-software-server.vercel.app',
//           name: name,
//           value: value
//         })
//       },

//       getCookie: async (name) => {
//         return await ipcRenderer.invoke('cookie:get', {
//           url: 'https://pharmacy-db-software-server.vercel.app',
//           name: name
//         })
//       },

//       clearCookie: async (name) => {
//         return await ipcRenderer.invoke('cookie:remove', {
//           url: 'https://pharmacy-db-software-server.vercel.app',
//           name: name
//         })
//       },

//       // Dialogs
//       showAlert: () => ipcRenderer.send('dialog:alert'),
//       showConfirm: () => ipcRenderer.send('dialog:confirm'),
//       openFile: () => ipcRenderer.send('dialog:openFile'),
//       saveFile: () => ipcRenderer.send('dialog:saveFile'),
//       downloadPDF: (data) => ipcRenderer.invoke('download-pdf', data),

//       // 🖨️ PRINT APIs
//       printThermalInvoice: (printData) => ipcRenderer.invoke('print:thermal', printData),
//       getPrinters: () => ipcRenderer.invoke('print:get-printers'),

//       // Listeners for print events
//       onPrintSuccess: (callback) => {
//         ipcRenderer.on('print:success', callback);
//         return () => ipcRenderer.removeListener('print:success', callback);
//       },
//       onPrintError: (callback) => {
//         ipcRenderer.on('print:error', callback);
//         return () => ipcRenderer.removeListener('print:error', callback);
//       },

//       // Remove print listeners
//       removePrintListeners: () => {
//         ipcRenderer.removeAllListeners('print:success');
//         ipcRenderer.removeAllListeners('print:error');
//       },
//       // Event listeners
//       onWindowStateChange: (callback) => {
//         ipcRenderer.on('window:state-changed', (event, state) => callback(state))
//       },
//       onConfirmResponse: (callback) => {
//         ipcRenderer.on('dialog:confirm-response', (event, response) => callback(response))
//       },
//       onFileSelected: (callback) => {
//         ipcRenderer.on('dialog:file-selected', (event, filePath) => callback(filePath))
//       },
//       onFileSaved: (callback) => {
//         ipcRenderer.on('dialog:file-saved', (event, filePath) => callback(filePath))
//       },

//       // Cleanup methods
//       removeAllListeners: (channel) => {
//         ipcRenderer.removeAllListeners(channel)
//       }
//     })

//     // Expose additional custom API
//     contextBridge.exposeInMainWorld('api', api)

//   } catch (error) {
//     console.error('Failed to expose APIs:', error)
//   }
// } else {
//   // Fallback for when context isolation is disabled (not recommended)
//   window.electron = electronAPI
//   window.electronAPI = {
//     closeWindow: () => ipcRenderer.send('window:close'),
//     minimizeWindow: () => ipcRenderer.send('window:minimize'),
//     maximizeWindow: () => ipcRenderer.send('window:maximize'),
//     newWindow: () => ipcRenderer.send('window:new'),
//     openDevTools: () => ipcRenderer.send('devtools:open'),

//     // Cookie management
//     setCookie: async (name, value) => {
//       return await ipcRenderer.invoke('cookie:set', {
//         url: 'https://pharmacy-db-software-server.vercel.app',
//         name: name,
//         value: value
//       })
//     },
//     getCookie: async (name) => {
//       return await ipcRenderer.invoke('cookie:get', {
//         url: 'https://pharmacy-db-software-server.vercel.app',
//         name: name
//       })
//     },
//     clearCookie: async (name) => {
//       return await ipcRenderer.invoke('cookie:remove', {
//         url: 'https://pharmacy-db-software-server.vercel.app',
//         name: name
//       })
//     },

//     showAlert: () => ipcRenderer.send('dialog:alert'),
//     showConfirm: () => ipcRenderer.send('dialog:confirm'),
//     openFile: () => ipcRenderer.send('dialog:openFile'),
//     saveFile: () => ipcRenderer.send('dialog:saveFile'),
//     onWindowStateChange: (callback) => {
//       ipcRenderer.on('window:state-changed', (event, state) => callback(state))
//     },
//     onConfirmResponse: (callback) => {
//       ipcRenderer.on('dialog:confirm-response', (event, response) => callback(response))
//     },
//     onFileSelected: (callback) => {
//       ipcRenderer.on('dialog:file-selected', (event, filePath) => callback(filePath))
//     },
//     onFileSaved: (callback) => {
//       ipcRenderer.on('dialog:file-saved', (event, filePath) => callback(filePath))
//     }
//   }
//   window.api = api
// }


import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  onWindowStateChange: (callback) => {
    ipcRenderer.on('window:state-changed', (event, state) => callback(state))
  },
  onConfirmResponse: (callback) => {
    ipcRenderer.on('dialog:confirm-response', (event, response) => callback(response))
  },
  onFileSelected: (callback) => {
    ipcRenderer.on('dialog:file-selected', (event, filePath) => callback(filePath))
  },
  onFileSaved: (callback) => {
    ipcRenderer.on('dialog:file-saved', (event, filePath) => callback(filePath))
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  },
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', {
      // Window controls
      closeWindow: () => ipcRenderer.send('window:close'),
      minimizeWindow: () => ipcRenderer.send('window:minimize'),
      maximizeWindow: () => ipcRenderer.send('window:maximize'),
      newWindow: () => ipcRenderer.send('window:new'),
      openDevTools: () => ipcRenderer.send('devtools:open'),

      // Update controls
      checkForUpdates: () => ipcRenderer.send('update:check'),
      installUpdate: () => ipcRenderer.send('update:install'),
      onUpdateStatus: (callback) => {
        ipcRenderer.on('update-status', (event, data) => callback(data))
        return () => ipcRenderer.removeListener('update-status', callback)
      },

      // Cookie management
      debugCookies: async () => {
        return await ipcRenderer.invoke('cookie:debug')
      },
      syncToken: async (token) => {
        return await ipcRenderer.invoke('cookie:sync-token', token)
      },
      checkCookie: async (name) => {
        return await ipcRenderer.invoke('cookie:get', {
          url: 'https://pharmacy-db-software-server.vercel.app',
          name: name
        })
      },
      setCookie: async (name, value) => {
        return await ipcRenderer.invoke('cookie:set', {
          url: 'https://pharmacy-db-software-server.vercel.app',
          name: name,
          value: value
        })
      },
      getCookie: async (name) => {
        return await ipcRenderer.invoke('cookie:get', {
          url: 'https://pharmacy-db-software-server.vercel.app',
          name: name
        })
      },
      clearCookie: async (name) => {
        return await ipcRenderer.invoke('cookie:remove', {
          url: 'https://pharmacy-db-software-server.vercel.app',
          name: name
        })
      },

      // Dialogs
      showAlert: () => ipcRenderer.send('dialog:alert'),
      showConfirm: () => ipcRenderer.send('dialog:confirm'),
      openFile: () => ipcRenderer.send('dialog:openFile'),
      saveFile: () => ipcRenderer.send('dialog:saveFile'),
      downloadPDF: (data) => ipcRenderer.invoke('download-pdf', data),

      // Print APIs
      printThermalInvoice: (printData) => ipcRenderer.invoke('print:thermal', printData),
      getPrinters: () => ipcRenderer.invoke('print:get-printers'),
      onPrintSuccess: (callback) => {
        ipcRenderer.on('print:success', callback)
        return () => ipcRenderer.removeListener('print:success', callback)
      },
      onPrintError: (callback) => {
        ipcRenderer.on('print:error', callback)
        return () => ipcRenderer.removeListener('print:error', callback)
      },
      removePrintListeners: () => {
        ipcRenderer.removeAllListeners('print:success')
        ipcRenderer.removeAllListeners('print:error')
      },

      // Event listeners
      onWindowStateChange: (callback) => {
        ipcRenderer.on('window:state-changed', (event, state) => callback(state))
      },
      onConfirmResponse: (callback) => {
        ipcRenderer.on('dialog:confirm-response', (event, response) => callback(response))
      },
      onFileSelected: (callback) => {
        ipcRenderer.on('dialog:file-selected', (event, filePath) => callback(filePath))
      },
      onFileSaved: (callback) => {
        ipcRenderer.on('dialog:file-saved', (event, filePath) => callback(filePath))
      },
      removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel)
      }
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose APIs:', error)
  }
} else {
  window.electron = electronAPI
  window.electronAPI = {
    closeWindow: () => ipcRenderer.send('window:close'),
    minimizeWindow: () => ipcRenderer.send('window:minimize'),
    maximizeWindow: () => ipcRenderer.send('window:maximize'),
    newWindow: () => ipcRenderer.send('window:new'),
    openDevTools: () => ipcRenderer.send('devtools:open'),
    checkForUpdates: () => ipcRenderer.send('update:check'),
    installUpdate: () => ipcRenderer.send('update:install'),
    onUpdateStatus: (callback) => {
      ipcRenderer.on('update-status', (event, data) => callback(data))
      return () => ipcRenderer.removeListener('update-status', callback)
    },
    setCookie: async (name, value) => {
      return await ipcRenderer.invoke('cookie:set', {
        url: 'https://pharmacy-db-software-server.vercel.app',
        name: name,
        value: value
      })
    },
    getCookie: async (name) => {
      return await ipcRenderer.invoke('cookie:get', {
        url: 'https://pharmacy-db-software-server.vercel.app',
        name: name
      })
    },
    clearCookie: async (name) => {
      return await ipcRenderer.invoke('cookie:remove', {
        url: 'https://pharmacy-db-software-server.vercel.app',
        name: name
      })
    },
    showAlert: () => ipcRenderer.send('dialog:alert'),
    showConfirm: () => ipcRenderer.send('dialog:confirm'),
    openFile: () => ipcRenderer.send('dialog:openFile'),
    saveFile: () => ipcRenderer.send('dialog:saveFile'),
    onWindowStateChange: (callback) => {
      ipcRenderer.on('window:state-changed', (event, state) => callback(state))
    },
    onConfirmResponse: (callback) => {
      ipcRenderer.on('dialog:confirm-response', (event, response) => callback(response))
    },
    onFileSelected: (callback) => {
      ipcRenderer.on('dialog:file-selected', (event, filePath) => callback(filePath))
    },
    onFileSaved: (callback) => {
      ipcRenderer.on('dialog:file-saved', (event, filePath) => callback(filePath))
    }
  }
  window.api = api
}