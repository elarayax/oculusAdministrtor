const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const WebSocket = require('ws');
const cors = require('cors');
const setupAppRoutes = require('./logic/serverRoutes'); 
const { autoUpdater } = require('electron-updater');

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
        { fileName: 'ventas.json', source: path.join(__dirname, 'data', 'ventas.json') },
        { fileName: 'vendedores.json', source: path.join(__dirname, 'data', 'vendedores.json') },
        { fileName: 'imprimir.txt', source: path.join(__dirname, 'data', 'imprimir.txt') },
        { fileName: 'tipoLentes.json', source: path.join(__dirname, 'data', 'tipoLentes.json') },
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

let mainWindow;

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
    mainWindow = new BrowserWindow({
        width: 1050,
        height: 700,
        minWidth: 1050,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.setMenu(null); // Elimina el menú en modo desarrollo
    }

    mainWindow.loadURL(`http://localhost:${PORT}/`); // Cargar la raíz

    mainWindow.on('closed', () => {
        mainWindow = null; // Limpiar referencia cuando la ventana se cierre
    });

    return mainWindow; // Retornar la ventana creada
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

    checkForUpdates();

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
            mainWindow = createWindow();
            splash.close(); // Cerrar el splash screen
            setupAppRoutes(server, baseDir, userDataPath, actualizarClientesWebSocket, mainWindow);
            checkForUpdates();
        }, 5000); // Tiempo de espera (3 segundos, ajustable)
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

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.setFeedURL({
    provider: 'github',
    repo: 'oculusAdministrtor',
    owner: 'elarayax',
});

function checkForUpdates() {
    // Inicia la búsqueda de actualizaciones
    autoUpdater.checkForUpdatesAndNotify();
}

// Evento de notificación de actualización disponible
autoUpdater.on('update-available', (info) => {
    console.log('Actualización disponible:', info);
    splash.webContents.send('update-status', 'Actualización disponible');
});

// Evento de notificación de actualización descargada
autoUpdater.on('update-downloaded', (info) => {
    console.log('Actualización descargada:', info);
    splash.webContents.send('update-status', 'Actualización descargada. Reinicie para aplicar.');
    autoUpdater.quitAndInstall();
    setTimeout(() => {
        splash.close(); // Cierra el splash después de unos segundos
        const mainWindow = createWindow(); // Abre la ventana principal
    }, 5000); // Espera 5 segundos antes de cerrar el splash
});

// Evento cuando no hay actualizaciones disponibles
autoUpdater.on('update-not-available', () => {
    console.log('No hay actualizaciones disponibles');
    splash.webContents.send('update-status', 'No hay actualizaciones disponibles');
});

// Manejo de errores
autoUpdater.on('error', (err) => {
    console.error('Error en la actualización:', err);
    splash.webContents.send('update-status', 'Error al comprobar actualizaciones');
});