const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const WebSocket = require('ws');
const cors = require('cors');
const { autoUpdater } = require('electron-updater');
const setupAppRoutes = require('./logic/serverRoutes'); 
const { jsPDF } = require('jspdf');
const PDFDocument = require('pdfkit');

const server = express();
const PORT = 3001;

// Obtiene el directorio de usuario donde se guardarán los archivos JSON
const userDataPath = path.join(app.getPath('userData'), 'taxatio');
const baseDir = __dirname;

if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

// Función para inicializar los datos del usuario
function initializeUserData() {
    const filesToCopy = [
        { fileName: 'empresa.json', source: path.join(__dirname, 'data', 'empresa.json') },
        { fileName: 'logo.json', source: path.join(__dirname, 'data', 'logo.json') },
        { fileName: 'clientes.json', source: path.join(__dirname, 'data', 'clientes.json') },
        { fileName: 'unidadMedida.json', source: path.join(__dirname, 'data', 'unidadMedida.json') },
        { fileName: 'iva.json', source: path.join(__dirname, 'data', 'iva.json') },
        { fileName: 'monedas.json', source: path.join(__dirname, 'data', 'monedas.json') },
        { fileName: 'productos.json', source: path.join(__dirname, 'data', 'productos.json') },
        { fileName: 'cotizaciones.json', source: path.join(__dirname, 'data', 'cotizaciones.json') },
        { fileName: 'cristales.json', source: path.join(__dirname, 'data', 'cristales.json') },
        { fileName: 'metodosPago.json', source: path.join(__dirname, 'data', 'metodosPago.json') },
        { fileName: 'marcos.json', source: path.join(__dirname, 'data', 'marcos.json') },
        { fileName: 'convenios.json', source: path.join(__dirname, 'data', 'convenios.json') },
    ];

    filesToCopy.forEach(({ fileName, source }) => {
        const targetPath = path.join(userDataPath, fileName);
        if (!fs.existsSync(targetPath)) {
            fs.copyFileSync(source, targetPath);
            console.log(`Copiado ${fileName} a ${userDataPath}`);
        }
    });
}

// Middleware
server.use(cors({ origin: 'http://localhost' }));
server.use(express.static('public'));
server.use(express.json());
server.use('/logos', express.static(path.join(userDataPath, 'logos')));

setupAppRoutes(server, baseDir, userDataPath, actualizarClientesWebSocket);

// Configuración de WebSocket
const serverHttp = require('http').createServer(server);
const wss = new WebSocket.Server({ noServer: true });

serverHttp.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

function actualizarClientesWebSocket(type, array) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: type, data: array }));
        }
    });
}

// Crear ventana de la aplicación
function createWindow() {
    const win = new BrowserWindow({
        width: 1050,
        height: 700,
        minWidth: 1050,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            
        },
        autoHideMenuBar: true,
    });

    if (process.env.NODE_ENV === 'development') {
        win.setMenu(null); // Elimina el menú en modo desarrollo
    }
    
    win.loadURL(`http://localhost:${PORT}/`); // Cargar la raíz
}

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const net of interfaces[interfaceName]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '127.0.0.1'; // Fallback a localhost si no se encuentra
}

function createSplashScreen() {
    // Crear ventana para el splash screen
    const splash = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false, // Sin bordes
        alwaysOnTop: true, // Siempre encima
        transparent: true, // Fondo transparente
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    splash.loadURL(`http://localhost:3001/splash.html`);

    return splash;
}

// Evento whenReady para inicializar la app y crear la ventana
app.whenReady().then(() => {
    initializeUserData(); // Inicializa los datos del usuario

    // Crear splash screen
    const splash = createSplashScreen();

    // Iniciar el servidor HTTP
    serverHttp.listen(PORT, '127.0.0.1', () => {
        console.log(`Servidor escuchando en http://127.0.0.1:${PORT}`);

        // Crear la ventana principal después de un retraso o cuando el servidor esté listo
        setTimeout(() => {
            const mainWindow = createWindow();
            splash.close(); // Cerrar el splash screen
        }, 3000); // Tiempo de espera (3 segundos, ajustable)
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Cierra la aplicación cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Manejo de conexiones WebSocket en el servidor
wss.on('connection', (ws, request) => {
    const ip = request.socket.remoteAddress;
    if (ip !== '127.0.0.1') {
        ws.close(); // Cierra conexiones externas
        console.log(`Conexión rechazada de IP: ${ip}`);
        return;
    }

    console.log('Cliente conectado localmente');
    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});