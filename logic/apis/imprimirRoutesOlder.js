const { PosPrinter } = require("electron-pos-printer");
const { BrowserWindow } = require("electron");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const iconv = require('iconv-lite');
const Jimp = require("jimp");

module.exports = function (server, userDataPath, mainWindow) {
    const imprimirFilePath = path.join(userDataPath, 'imprimir.txt');

    async function convertImageToBitmap(imagePath) {
        const image = await Jimp.read(imagePath);
        // Redimensionar la imagen (ajusta el ancho según tu impresora)
        image.resize(384, Jimp.AUTO);
        // Convertir a blanco y negro
        image.grayscale().contrast(1).dither565();
        return image.bitmap;
    }

    function bitmapToEscPos(bitmap) {
        const { width, height, data } = bitmap;
        const rasterData = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x += 8) {
                let byte = 0;
                for (let b = 0; b < 8; b++) {
                    if (x + b < width) {
                        const pixel = data[(y * width + (x + b)) * 4];
                        if (pixel < 128) {
                            byte |= 1 << (7 - b);
                        }
                    }
                }
                rasterData.push(byte);
            }
        }

        const ESC = "\x1B";
        const GS = "\x1D";
        const command = [
            GS, "v", "0", // Comando para imprimir gráfico raster
            0, // Modo de impresión (0 para normal)
            (width / 8) % 256, (width / 8) >> 8, // Ancho en bytes
            height % 256, height >> 8, // Altura en píxeles
            ...rasterData, // Datos del bitmap
        ];

        return Buffer.from(command);
    }

    // Obtener lista de impresoras disponibles
    server.get('/api/impresoras', async (req, res) => {
        try {
            const printers = await mainWindow.webContents.getPrintersAsync();
            res.json(printers.map(p => ({ nombre: p.name, default: p.isDefault })));
        } catch (error) {
            console.error("Error obteniendo impresoras:", error);
            res.status(500).send("Error obteniendo la lista de impresoras");
        }
    });

    server.post("/api/imprimir", async (req, res) => {
        const { impresora, contenido } = req.body;

            if (!impresora || !contenido) {
                return res.status(400).send("Datos inválidos para impresión");
            }

            try {
                const printers = await mainWindow.webContents.getPrintersAsync();
            console.log("Impresoras disponibles:", printers);

            const printerName = printers.find((p) => p.name === impresora)?.name;
            const printerStatus = printers.find((p) => p.name === impresora)?.status;

            console.log("Estado de la impresora:", printerStatus);

            /*if (printerStatus !== 3) {
                return res.status(500).json({ message: `estado impresora: ${printerStatus}` });
            }

            if (!printerName) {
                return res.status(500).json({ message: "Impresora no encontrada" });
            }*/

            console.log(contenido);
    
            // Comandos ESC/POS
            const ESC = "\x1B";
            const GS = "\x1D";
            const LF = "\x0A"; // Nueva línea
    
            // Reset de la impresora
            let ticket = `${ESC}@`;
    
            // Establecer fuente normal (tamaño pequeño)
            ticket += `${ESC}a\x00`;// Fuente normal (tamaño pequeño)

            ticket += `${ESC}!\x00`;

            /*if (contenido.imagen) {
                try {
                    const imagePath = path.join(userDataPath, 'temp_image.png');
                    // Guardar la imagen en un archivo temporal
                    fs.writeFileSync(imagePath, Buffer.from(imagen, 'base64'));
                    // Convertir la imagen a bitmap
                    const bitmap = await convertImageToBitmap(imagePath);
                    // Convertir el bitmap a comandos ESC/POS
                    const imageData = bitmapToEscPos(bitmap);
                    // Añadir la imagen al ticket
                    ticket += imageData.toString('binary');
                    // Eliminar el archivo temporal
                    fs.unlinkSync(imagePath);
                } catch (error) {
                    console.error("Error procesando la imagen:", error);
                }
            }*/

            if (contenido.empresa) {
                ticket += `\n${contenido.empresa.nombre ? contenido.empresa.nombre.trim() : "Nombre no disponible"} \n`;
                ticket += `Rut: ${contenido.empresa.rut ? contenido.empresa.rut.trim() : "No disponible"} \n`;
                ticket += `Telefono: ${contenido.empresa.telefono ? contenido.empresa.telefono.trim() : "No disponible"} \n`;
                ticket += `Direccion: ${contenido.empresa.direccion ? contenido.empresa.direccion.trim() : "No disponible"} \n`;
            
                if (contenido.empresa.camposPersonalizados && Array.isArray(contenido.empresa.camposPersonalizados)) {
                    contenido.empresa.camposPersonalizados.forEach(dato => {
                        ticket += `${dato.nombre}: ${dato.valor} \n`;
                    });
                }
            } else {
                console.log("No se encontraron datos de la empresa.");
            }
            

            ticket += `\nFecha: ${contenido.fecha} \n`;

            ticket += `Atendido por: ${contenido.vendedor.nombre} \n \n`

            ticket += `Datos del cliente \n \n`;

            ticket += `Nombre: ${contenido.cliente.nombre} \n`;
            ticket += `Rut: ${contenido.cliente.rut} \n`;
            ticket += `Telefono: ${contenido.cliente.telefono} \n`;
            
            if(contenido.cliente.correo != ""){
                ticket += `Correo: ${contenido.cliente.correo} \n`;
            }

            if(contenido.cliente.direccion != ""){
                ticket += `Direccion: ${contenido.cliente.direccion} \n`;
            }

            if(contenido.observaciones != ""){
                ticket += `Observaciones: ${contenido.observaciones} \n \n`;
            }

            ticket += `\nDatos de la venta \n`;

            contenido.productos.forEach(producto => {
                if(producto.tipo == "lente"){
                    ticket += `\nTipo de lente: ${producto.cristales.cristales.tipoLente} \n`;
                    if(producto.cristales.variante != "blanco"){
                        ticket += `Cristal: ${producto.cristales.cristalBase} - ${producto.cristales.variante}`;
                    }else{
                        ticket += `Cristal: ${producto.cristales.cristalBase}`;
                    }
                    ticket += `\n    Esfera   Cilindro   Eje   \n`;
                    ticket += `OD:  ${producto.cristales.cristales.esferaOD}        ${producto.cristales.cristales.cilindroOD}          ${producto.cristales.cristales.ejeOD}\n`;
                    ticket += `OI:  ${producto.cristales.cristales.esferaOI}        ${producto.cristales.cristales.cilindroOI}          ${producto.cristales.cristales.ejeOI}\n`;
                    ticket += `DP:  ${producto.cristales.cristales.DP} \n`;
                    ticket += `ADD: ${producto.cristales.cristales.ADD} \n`;
                    ticket += `ALT: ${producto.cristales.cristales.ALT} \n`;
                    ticket += `Datos del Marco`;
                    ticket += `\nMarca:  ${producto.marco.marca.nombre}`;
                    ticket += `\nModelo:  ${producto.marco.modelo.nombre}`;
                }
                if(producto.tipo == "cristales"){
                    ticket += `\n\nTipo de cristal: ${producto.cristales.tipoLente} \n`;
                    if(producto.variante != "blanco"){
                        ticket += `Cristal: ${producto.cristalBase} - ${producto.variante}`;
                    }else{
                        ticket += `Cristal: ${producto.cristalBase}`;
                    }
                    ticket += `\n    Esfera   Cilindro   Eje   \n`;
                    ticket += `OD:  ${producto.cristales.esferaOD}          ${producto.cristales.cilindroOD}            ${producto.cristales.ejeOD}\n`;
                    ticket += `OI:  ${producto.cristales.esferaOI}          ${producto.cristales.cilindroOI}            ${producto.cristales.ejeOI}\n`;
                    ticket += `DP:  ${producto.cristales.DP} \n`;
                    ticket += `ADD: ${producto.cristales.ADD} \n`;
                    ticket += `ALT: ${producto.cristales.ALT} \n`;

                }
            });

            let c = 0;

            contenido.productos.forEach(producto => {
                if(producto.tipo == "random"){
                    c++;
                    if(c == 1){
                        ticket += `\nProducto       Cantidad \n`;
                    }
                    ticket += `${producto.nombre}           ${producto.cantidad} \n`;
                }
                if(producto.tipo == "marco"){
                    c++;
                    if(c == 1){
                        ticket += `\nProducto       Cantidad \n`;
                    }
                    ticket += `Marca: ${producto.marca.nombre} - ${producto.modelo.nombre}          ${producto.cantidad} \n`;
                }
            });

            

            ticket += `\n\nMetodo de pago: ${contenido.nombreMetodoPago.nombre}\n`;

            ticket += `Total: ${contenido.total} \n`;
            ticket += `Cancelado: ${contenido.abonos} \n`;
            ticket += `Pendiente: ${contenido.pendiente} \n`;

            if(contenido.boleta){
                ticket += `\n\n${contenido.boleta.titulo}: ${contenido.boleta.texto} \n`;
            }

            ticket += "\n \n \n \n";

            ticket += `${GS}V\x01`;

            // Codificar en CP437
            const textoCodificado = iconv.encode(ticket, "CP437");

        // Guardar el archivo imprimir.txt
        fs.writeFileSync(imprimirFilePath, textoCodificado);
        console.log(`Archivo guardado en: ${imprimirFilePath}`);

        // Enviar a la impresora (Windows)
        if (process.platform === "win32") {
            const notepadPath = path.join(process.env.SystemRoot, "System32", "notepad.exe");
            exec(`copy /B "${imprimirFilePath}" "\\\\${impresora}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error("Error al imprimir:", error);
                    return res.status(500).json({ message: "Error al imprimir: " + error.message });
                }
                console.log("Impresión enviada:", stdout);
                res.json({ success: true, message: "Impresión exitosa" });
            });
        } else {
            // Enviar a la impresora (Linux/macOS)
            exec(`lp -d ${printerName} "${imprimirFilePath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error("Error al imprimir:", error);
                    return res.status(500).json({ message: "Error al imprimir: " + error.message });
                }
                console.log("Impresión enviada:", stdout);
                res.json({ success: true, message: "Impresión exitosa" });
            });
        }

        } catch (error) {
            console.error("Error al imprimir:", error);
            res.status(500).send("Error al imprimir: " + error.message);
        }
    });
};