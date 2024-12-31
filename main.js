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

function formatFecha(fecha) {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
}

server.post('/generar-pdf', (req, res) => {
    const cotizacion = req.body;
    const fechaRealizacion = formatFecha(new Date());

    console.log(cotizacion);

    if (!cotizacion) {
        return res.status(400).json({ error: 'Datos de cotización no recibidos correctamente' });
    }

    const doc = new PDFDocument();
    const filePath = dialog.showSaveDialogSync({
        title: 'Guardar Cotización',
        defaultPath: app.getPath('documents') + `/cotizacion-${cotizacion.cliente.nombre}-${fechaRealizacion}.pdf`,
        filters: [{ name: 'Archivos PDF', extensions: ['pdf'] }]
    });

    if (!filePath) {
        return res.status(400).json({ error: 'Guardado cancelado' });
    }

    doc.pipe(fs.createWriteStream(filePath));

    const logoPath = path.join(app.getPath('userData'), 'taxatio', cotizacion.rutaLogo);

    // Logo y encabezado
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 20, { width: 50 });
    } else {
        console.error(`Logo no encontrado en la ruta: ${logoPath}`);
        doc.fontSize(12).fillColor('red').text('Logo no disponible', 50, 20);
    }

    //const empresaStartX = 120; // Posición inicial en X
    //let empresaStartY = 50;   // Posición inicial en Y

    // Datos básicos de la empresa
    const empresaDatos = [
        `Nombre: ${cotizacion.empresa.nombre}`,
        `Rut: ${cotizacion.empresa.rut}`,
        `Dirección: ${cotizacion.empresa.direccion}`,
        `Teléfono: ${cotizacion.empresa.telefono}`,
        `Correo: ${cotizacion.empresa.correo}`,
    ];

    // Agregar campos personalizados si existen
    const camposPersonalizados = cotizacion.empresa.camposPersonalizados || [];
    camposPersonalizados.forEach(campo => {
        empresaDatos.push(`${campo.nombre}: ${campo.valor}`); // Asumiendo que cada campo tiene un nombre y un valor
    });

    // Imprimir datos de la empresa en forma de lista vertical a la derecha del logo
    const maxColumns = 3; // Número máximo de columnas
    let columnWidth = 150; // Ancho de cada columna

    // Calcular el número máximo de filas basadas en la cantidad de datos
    const maxRows = Math.ceil(empresaDatos.length / maxColumns);

    let empresaStartX = 120; // Posición inicial en X
    let empresaStartY = 50;  // Posición inicial en Y

    // Establecer el espaciamiento entre filas
    const rowHeight = 25;

    doc.fontSize(10);

    // Ajustar la posición de los datos en filas y columnas, asegurando que no se solapen
    empresaDatos.forEach((dato, index) => {
        const column = index % maxColumns; // Determinar columna
        const row = Math.floor(index / maxColumns); // Determinar fila
        const x = empresaStartX + column * columnWidth; // Separación entre columnas
        const y = empresaStartY + row * rowHeight; // Separación entre filas

        // Dividir el dato en "etiqueta" y "valor"
        const [etiqueta, valor] = dato.split(': ');

        // Etiqueta en negrita
        doc.font('Helvetica-Bold').text(`${etiqueta}:`, x, y, { align: 'left' });

        // Valor en fuente normal
        doc.font('Helvetica').text(valor, x + 50, y, { align: 'left' }); // Ajusta la posición X si es necesario
    });

    // Ajustar la posición Y después de los datos de la empresa
    empresaStartY += maxRows * rowHeight + 10;
    doc.moveDown();

    // Información del cliente (alineada con "Cliente:")
    doc.fontSize(10).fillColor('black').text('Cliente:', 50, (doc.y + 30));

    const clienteDatos = [
        `Nombre: ${cotizacion.cliente.nombre}`,
        `RUT: ${cotizacion.cliente.rut}`,
        `Teléfono: ${cotizacion.cliente.telefono}`,
        `Correo: ${cotizacion.cliente.correo}`,
        `Dirección: ${cotizacion.cliente.direccion}`,
    ];

    // Definir el ancho de las columnas
    columnWidth = 190;
    
    const clienteStartX = 50;
    const clienteStartY = doc.y + 10; // Posición inicial en Y

    doc.fontSize(10);

    clienteDatos.forEach((dato, index) => {
        const column = index % 3; // Determinar columna
        const row = Math.floor(index / 3); // Determinar fila
        const x = clienteStartX + column * columnWidth; // Separación entre columnas
        const y = clienteStartY + row * 30; // Separación entre filas
        
        // Dividir el dato en "etiqueta" y "valor"
        const [etiqueta, valor] = dato.split(': '); // Asumiendo que la etiqueta y valor están separados por ": "
        
        // Etiqueta en negrita
        doc.font('Helvetica-Bold').text(`${etiqueta}:`, x, y, { align: 'left' });
        
        // Valor en fuente normal
        doc.font('Helvetica').text(valor, x + 50, y, { align: 'left' }); // Ajusta la posición X si es necesario
    });

    doc.moveDown();

    if (cotizacion.cliente.representante) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('black').text('Datos representante:', 50, (doc.y + 20));
        let representante = [
            `Nombre: ${cotizacion.cliente.representante.nombre}`,
            `Rut : ${cotizacion.cliente.representante.rut}`,
            `Teléfono : ${cotizacion.cliente.representante.telefono}`,
            `Correo : ${cotizacion.cliente.representante.correo}`,
            `Dirección : ${cotizacion.cliente.representante.direccion}`
        ]

        columnWidth = 170;

        let representanteStartX = 50;
        const representanteStartY = doc.y + 10;

        representante.forEach((dato, index) => {
            const column = index % 3; // Determinar columna
            const row = Math.floor(index / 3); // Determinar fila
            const x = representanteStartX + column * columnWidth; // Separación entre columnas
            const y = representanteStartY + row * 25; // Separación entre filas
            
            // Dividir el dato en "etiqueta" y "valor"
            const [etiqueta, valor] = dato.split(': '); // Asumiendo que la etiqueta y valor están separados por ": "
            
            // Etiqueta en negrita
            doc.font('Helvetica-Bold').text(`${etiqueta}:`, x, y, { align: 'left' });
            
            // Valor en fuente normal
            doc.font('Helvetica').text(valor, x + 50, y, { align: 'left' }); // Ajusta la posición X si es necesario
        });

        doc.moveDown();
    }


    // Crear tabla de productos
    const tableStartY = doc.y + 20;

    // Estilo para los encabezados
    doc.font('Helvetica-Bold').fontSize(12).fillColor('white'); // Negrita y color blanco
    doc.rect(50, tableStartY - 5, 500, 20).fill(cotizacion.empresa.colorTabla); // Fondo coral para los encabezados
    doc.fillColor(cotizacion.empresa.colorLetras); // Volver al color negro para el texto

    doc.text('Producto', 60, tableStartY, { width: 140, align: 'left' }); // Alinear producto a la izquierda
    doc.text('Cantidad', 200, tableStartY, { width: 80, align: 'center' }); // Centrar cantidad
    doc.text('Medida', 300, tableStartY, { width: 80, align: 'center' }); // Centrar cantidad
    doc.text('Precio', 370, tableStartY, { width: 80, align: 'center' }); // Centrar precio
    doc.text('Total', 470, tableStartY, { width: 80, align: 'center' }); // Centrar total

    // Líneas divisorias de la tabla
    const headerBottomY = tableStartY + 15;
    doc.moveTo(50, headerBottomY).lineTo(550, headerBottomY).strokeColor(cotizacion.empresa.colorTabla).lineWidth(1).stroke(); // Línea debajo del encabezado

    // Imprimir los productos
    doc.font('Helvetica').fontSize(10).fillColor('black'); // Fuente normal para los productos

    cotizacion.productos.forEach((producto, index) => {
        const y = headerBottomY + 10 + (index * 20);

        // Fondo alternativo para filas
        if (index % 2 === 0) {
            doc.rect(50, y - 5, 500, 20).fill('#F8F8F8'); // Fondo gris claro
        }

        // Información de cada producto
        doc.fillColor('black'); // Asegurarse de que el texto sea negro
        doc.text(producto.nombre, 60, y, { width: 140, align: 'left' }); // Producto alineado a la izquierda
        doc.text(producto.cantidad.toString(), 200, y, { width: 80, align: 'center' }); // Cantidad centrada
        doc.text(`${producto.unidad}`, 300, y, { width: 80, align: 'center' }); // Precio centrado (sin decimales)
        doc.text(`$${producto.precio}`, 370, y, { width: 80, align: 'center' }); // Precio centrado (sin decimales)
        doc.text(`$${producto.total}`, 470, y, { width: 80, align: 'center' }); // Total centrado (sin decimales)

        // Línea divisoria entre filas
        doc.moveTo(50, y + 15).lineTo(550, y + 15).strokeColor('#E0E0E0').lineWidth(0.5).stroke(); // Línea gris claro
    });

    // Línea final de la tabla
    const tableEndY = headerBottomY + 10 + cotizacion.productos.length * 20;
    doc.moveTo(50, tableEndY).lineTo(550, tableEndY).strokeColor(cotizacion.empresa.colorTabla).lineWidth(1).stroke(); // Línea final de la tabla

    doc.moveDown();

    let currentY = doc.y

    doc.font('Helvetica-Bold').text('Total sin IVA:', 50, currentY, { align: 'left' });
    doc.font('Helvetica').text(`$${cotizacion.totalSinIVA}`, 150, currentY, { align: 'left' });

    currentY +=  20

    doc.font('Helvetica-Bold').text('Valor IVA:', 50, currentY, { align: 'left'});
    doc.font('Helvetica').text(`$${cotizacion.valorIva}`, 150 ,currentY, {align: 'left'});

    currentY +=  20

    doc.font('Helvetica-Bold').text('Total con IVA:', 50, currentY, { align: 'left'});
    doc.font('Helvetica').text(`$${cotizacion.totalGeneral}`, 150 ,currentY, {align: 'left'});

    currentY +=  20

    if(cotizacion.descuentos.length >  0){
        doc.font('Helvetica-Bold').text('Descuento:', 50, currentY, { align: 'left' });
        doc.font('Helvetica').text(`${cotizacion.descuentos}`, 150, currentY, { align: 'left' });
    
        currentY +=  20
        
        doc.font('Helvetica-Bold').text('Valor descuento:', 50, currentY, { align: 'left' });
        doc.font('Helvetica').text(`$${cotizacion.valorDescuento}`, 150, currentY, { align: 'left' });
        
        currentY +=  20

        doc.font('Helvetica-Bold').text('Total con Descuento:', 50, currentY, { align: 'left' });
        doc.font('Helvetica').text(`$${cotizacion.totalConDescuento}`, 150, currentY, { align: 'left' });

        currentY +=  20
    }

    // Aseguramos de que la posición Y se actualice correctamente para los siguientes textos
    doc.moveDown();

    const fechaInicio = formatFecha(cotizacion.fechaInicio);
    const fechaTermino = formatFecha(cotizacion.fechaTermino);  

    // Espacio adicional para separar
    doc.moveDown(2); 

    // Imprimir el texto "Cotización disponible desde el"
    doc.font('Helvetica').text('Cotización disponible desde el ', 50, doc.y , { continued: true });

    // Obtener el ancho del texto fijo
    const offset = doc.widthOfString('Cotización disponible desde el ');

    // Imprimir la fecha de inicio en negrita
    const startXFechaInicio = offset;
    doc.font('Helvetica-Bold').text(fechaInicio, 50, doc.y, { continued: true });

    // Obtener el ancho de la fecha de inicio para la posición de "hasta"
    const offset2 = doc.widthOfString(fechaInicio);

    // Imprimir el texto "hasta el" en fuente normal
    const startXHasta = startXFechaInicio + offset2;
    doc.font('Helvetica').text(' hasta el ', 50, doc.y, { continued: true });

    // Imprimir la fecha de término en negrita
    const startXFechaTermino = startXHasta + doc.widthOfString(' hasta el ');
    doc.font('Helvetica-Bold').text(fechaTermino, 50, doc.y);

    // Actualizar la posición de Y manualmente para evitar el espacio extra
    doc.moveDown(); // Mueve hacia abajo para el siguiente contenido



    // Ahora aseguramos que el texto no se baje de la posición correcta:
    doc.moveDown();

    // Finalizar el documento
    doc.end();
    
    res.send('OK');
    
    doc.on('finish', () => {
        res.json({ mensaje: 'PDF generado', ruta: filePath });
    });
});


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