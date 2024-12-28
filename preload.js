const { contextBridge, ipcRenderer } = require('electron');
const { jsPDF } = require('jspdf');

contextBridge.exposeInMainWorld('electron', {
    jsPDF: jsPDF,
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    send: (channel, data) => ipcRenderer.send(channel, data),
});
