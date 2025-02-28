const { PosPrinter } = require("electron-pos-printer");
const { BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const iconv = require('iconv-lite');
const Jimp = require("jimp");

module.exports = function (server, userDataPath, mainWindow) {
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

            const printerName = printers.find((p) => p.name === impresora)?.name;
            const printerStatus = printers.find((p) => p.name === impresora)?.status;

            console.log("Estado de la impresora:", printerStatus);

            /*if (printerStatus !== 3) { // 3 significa "Lista"
                return res.status(500).json({ message: `La impresora no está lista. Estado: ${printerStatus}` });
            }

            if (!printerName) {
                return res.status(500).json({ message: "Impresora no encontrada" });
            }*/

            let ticketData = [];

            let ordenTrabajo = [];

            //ticketData.push(createImageItem(contenido.imagen.replace(/\\/g, "/")));

            //Datos de la empresa
            ordenTrabajo.push(createTextItem("Orden de Trabajo"));

            if (contenido.empresa) {
                ticketData.push(createTextItem(contenido.empresa.nombre));
                ticketData.push(createTextItem(`Rut: ${contenido.empresa.rut}`));
                ticketData.push(createTextItem(`Telefono: ${contenido.empresa.telefono}`));
                ticketData.push(createTextItem(`Direccion: ${contenido.empresa.direccion}`));

                ordenTrabajo.push(createTextItem(contenido.empresa.nombre));
                ordenTrabajo.push(createTextItem(`Rut: ${contenido.empresa.rut}`));

                if (contenido.empresa.camposPersonalizados && Array.isArray(contenido.empresa.camposPersonalizados)) {
                    contenido.empresa.camposPersonalizados.forEach(dato => {
                        ticketData.push(createTextItem(`${dato.nombre}: ${dato.valor}\n`));
                    });
                }
            } else {
                console.log("No se encontraron datos de la empresa.");
            }
            
            //datos del momento
            ticketData.push(createTextItem("-----------------"));
            ticketData.push(createTextItem(`Fecha: ${contenido.fecha}`));
            ticketData.push(createTextItem(`Atendido por: ${contenido.vendedor.nombre}`));
            ticketData.push(createTextItem("-----------------"));

            ordenTrabajo.push(createTextItem("-----------------"));
            ordenTrabajo.push(createTextItem(`Fecha: ${contenido.fecha}`));
            ordenTrabajo.push(createTextItem(`Atendido por: ${contenido.vendedor.nombre}`));
            ordenTrabajo.push(createTextItem("-----------------"));

            //datos del cliente
            ticketData.push(createTextItem("Datos del cliente"));
            ticketData.push(createTextItem(`Nombre: ${contenido.cliente.nombre}`));
            ticketData.push(createTextItem(`Rut: ${contenido.cliente.rut}`));
            ticketData.push(createTextItem(`Telefono: ${contenido.cliente.telefono}`));

            ordenTrabajo.push(createTextItem("Datos del cliente"));
            ordenTrabajo.push(createTextItem(`Nombre: ${contenido.cliente.nombre}`));
            ordenTrabajo.push(createTextItem(`Rut: ${contenido.cliente.rut}`));
            ordenTrabajo.push(createTextItem(`Telefono: ${contenido.cliente.telefono}`));

            if (contenido.cliente.correo && contenido.cliente.correo.trim() !== "") {
                ticketData.push(createTextItem(`Correo: ${contenido.cliente.correo}`));
            }

            if (contenido.cliente.direccion && contenido.cliente.direccion.trim() !== "") {
                ticketData.push(createTextItem(`Direccion: ${contenido.cliente.direccion}`));
            }            

            if (contenido.observaciones != "") {
                ticketData.push(createTextItem("-----------------"));
                ticketData.push(createTextItem(`Observaciones: ${contenido.observaciones}`));

                ordenTrabajo.push(createTextItem("-----------------"));
                ordenTrabajo.push(createTextItem(`Observaciones: ${contenido.observaciones}`));
            }

            //datos de la venta
            ticketData.push(createTextItem("-----------------"));
            ticketData.push(createTextItem("Datos de la venta"));

            ordenTrabajo.push(createTextItem("-----------------"));
            ordenTrabajo.push(createTextItem("Datos de la venta"));

            contenido.productos.forEach(producto => {
                if (producto.tipo == "lente") {
                    ticketData.push(createTextItem("-----------------"));
                    ticketData.push(createTextItem(`Tipo de lente: ${producto.cristales.cristales.tipoLente}`));

                    ordenTrabajo.push(createTextItem("-----------------"));
                    ordenTrabajo.push(createTextItem(`Tipo de lente: ${producto.cristales.cristales.tipoLente}`));
                    if (producto.cristales.variante != "blanco") {
                        ticketData.push(createTextItem(`Cristal: ${producto.cristales.cristalBase} - ${producto.cristales.variante}`));
                        ticketData.push(createTextItem(`Cristal: ${producto.cristales.cristalBase} - ${producto.cristales.variante}`));

                        ordenTrabajo.push(createTextItem(`Cristal: ${producto.cristales.cristalBase} - ${producto.cristales.variante}`));
                        ordenTrabajo.push(createTextItem(`Cristal: ${producto.cristales.cristalBase} - ${producto.cristales.variante}`));
                    } else {
                        ticketData.push(createTextItem(`Cristal: ${producto.cristales.cristalBase}`));

                        ordenTrabajo.push(createTextItem(`Cristal: ${producto.cristales.cristalBase}`));
                    }
                    let header = ["-", "Esfera", "Cilindro", "Eje"];
                    let body = [
                        ["OD", producto.cristales.cristales.esferaOD || "-", producto.cristales.cristales.cilindroOD || "-", producto.cristales.cristales.ejeOD || "-"],
                        ["OI", producto.cristales.cristales.esferaOI || "-", producto.cristales.cristales.cilindroOI || "-", producto.cristales.cristales.ejeOI || "-"],
                        ["DP", producto.cristales.cristales.DP || "", ""],
                        ["ADD", producto.cristales.cristales.ADD || "", ""],
                        ["ALT", producto.cristales.cristales.ALT || "", ""],
                    ];
                    
                    /*let body = [
                        ["OD", "-2.00", "-1.00", "180"],
                        ["OI", "-1.50", "-0.75", "170"],
                        ["DP", "62", "", ""],
                        ["ADD", "+2.00", "", ""],
                        ["ALT", "28", "", ""],
                    ];*/
                    ticketData.push(createTableItem(header, body));
                    ordenTrabajo.push(createTableItem(header, body));
                    ticketData.push(createTextItem("-----------------"));
                    ticketData.push(createTextItem(`Datos del Marco`));
                    ticketData.push(createTextItem(`Marca: ${producto.marco.marca.nombre}`));
                    ticketData.push(createTextItem(`Modelo: ${producto.marco.modelo.nombre}`));

                    ordenTrabajo.push(createTextItem("-----------------"));
                    ordenTrabajo.push(createTextItem(`Datos del Marco`));
                    ordenTrabajo.push(createTextItem(`Marca: ${producto.marco.marca.nombre}`));
                    ordenTrabajo.push(createTextItem(`Modelo: ${producto.marco.modelo.nombre}`));
                }
                if (producto.tipo == "cristales") {
                    ticketData.push(createTextItem("-----------------"));
                    ticketData.push(createTextItem(`Tipo de cristal: ${producto.cristales.tipoLente}`));

                    ordenTrabajo.push(createTextItem("-----------------"));
                    ordenTrabajo.push(createTextItem(`Tipo de cristal: ${producto.cristales.tipoLente}`));
                    if (producto.variante != "blanco") {
                        ticketData.push(createTextItem(`Cristal: ${producto.cristalBase} - ${producto.variante}`));
                        ordenTrabajo.push(createTextItem(`Cristal: ${producto.cristalBase} - ${producto.variante}`));
                    } else {
                        ticketData.push(createTextItem(`Cristal: ${producto.cristalBase}`));
                        ordenTrabajo.push(createTextItem(`Cristal: ${producto.cristalBase}`));
                    }
                    let header = ["-", "Esfera", "Cilindro", "Eje"];
                    let body = [
                        ["OD", producto.cristales.esferaOD, producto.cristales.cilindroOD, producto.cristales.ejeOD],
                        ["OI", producto.cristales.esferaOI, producto.cristales.cilindroOI, producto.cristales.ejeOI],
                        ["DP", producto.cristales.DP, "", ""],
                        ["ADD", producto.cristales.ADD, "", ""],
                        ["ALT", producto.cristales.ALT, "", ""],
                    ];
                    ticketData.push(createTableItem(header, body));
                    ordenTrabajo.push(createTableItem(header, body));
                }
            });

            let c = 0;
            let headerProductos = [];
            let bodyProductos = [];
            contenido.productos.forEach(producto => {
                if (producto.tipo == "random") {
                    c++;
                    if (c == 1) {
                        headerProductos = ["Producto", "Cantidad"];
                    }
                    let auxArray = [producto.nombre,producto.cantidad];
                    bodyProductos.push(auxArray);
                }
                if (producto.tipo == "marco") {
                    c++;
                    if (c == 1) {
                        headerProductos = ["Producto", "Cantidad"];
                    }
                    let auxArray = [`Marca: ${producto.marca.nombre} - ${producto.modelo.nombre}`,producto.cantidad];
                    bodyProductos.push(auxArray);
                }
            });

            if(c > 0){
                ticketData.push(createTableItem(headerProductos, bodyProductos));
                ordenTrabajo.push(createTableItem(headerProductos, bodyProductos));
            }

            //datos finales
            ticketData.push(createTextItem("-----------------"));
            ticketData.push(createTextItem(`Metodo de pago: ${contenido.nombreMetodoPago.nombre}`));
            ticketData.push(createTextItem(`Total: ${contenido.total.toLocaleString("es-CL")}`));
            ticketData.push(createTextItem(`Cancelado: ${contenido.abonos.toLocaleString("es-CL")}`));
            ticketData.push(createTextItem(`Pendiente: ${contenido.pendiente.toLocaleString("es-CL")}`));

            ordenTrabajo.push(createTextItem("-----------------"));
            ordenTrabajo.push(createTextItem(`Metodo de pago: ${contenido.nombreMetodoPago.nombre}`));
            ordenTrabajo.push(createTextItem(`Total: ${contenido.total.toLocaleString("es-CL")}`));
            ordenTrabajo.push(createTextItem(`Cancelado: ${contenido.abonos.toLocaleString("es-CL")}`));
            ordenTrabajo.push(createTextItem(`Pendiente: ${contenido.pendiente.toLocaleString("es-CL")}`));

            if (contenido.boleta) {
                ticketData.push(createTextItem("-----------------"));
                ticketData.push(createTextItem(`${contenido.boleta.titulo}: ${contenido.boleta.texto}`));
                if (contenido.boleta.tituloQR) {
                    ticketData.push(createTextItem(`${contenido.boleta.tituloQR}`));
                }

                if (contenido.boleta.enlaceQR) {
                    ticketData.push(createQr(contenido.boleta.enlaceQR));
                }
            }

            // Configuración de la impresión

            const ticketWidth = printerName.includes("80") ? "80mm" : "58mm";

            const options = {
                preview: false, // No mostrar vista previa
                width: '58mm', // Ancho del ticket
                printerName: printerName, // Nombre de la impresora
                timeOutPerLine: 400,
                silent: true, // No mostrar diálogos de impresión
                margin: '0 0 0 0'
            };
            // Imprimir usando PosPrinter
            
            await PosPrinter.print(ticketData, options);
            await PosPrinter.print(ordenTrabajo, options);

            res.json({ success: true, message: "Impresión exitosa", data: ticketData });
        } catch (error) {
            console.error("Error al imprimir:", error);
            res.status(500).send("Error al imprimir: " + error.message + ticketData);
        }
    });

    server.post("/api/imprimir-informe", async (req, res) => {
        const { impresora, contenido } = req.body;

        if (!impresora || !contenido) {
            return res.status(400).send("Datos inválidos para impresión");
        }

        try {
            const printers = await mainWindow.webContents.getPrintersAsync();

            const printerName = printers.find((p) => p.name === impresora)?.name;
            //const printerStatus = printers.find((p) => p.name === impresora)?.status;

            //console.log("Estado de la impresora:", printerStatus);

            let ticketData = [];

            ticketData.push(createTitleItemCenter(`Informe de ventas`));
            ticketData.push(createTextItem(contenido.ventas.fecha));
            ticketData.push(createSpace());
            ticketData.push(createTextItem(`Cantidad de ventas: ${contenido.ventas.cantidad}`));
            ticketData.push(createTextItem(`Total vendido: ${contenido.ventas.total}`));
            ticketData.push(createTextItem(`Total recibido : ${contenido.ventas.totalRecibido}`));
            ticketData.push(createSpace());

            let labelMetodos = ["Método", "Cantidad", "Total", "Total Recibido"];
            let datosMetodos = [];

            ticketData.push(createTitleItemCenter(`Ventas por método de pago`));
            contenido.tipoMetodo.forEach(metodo => {
                let dato = [metodo.nombre, metodo.cantidad, metodo.total.toLocaleString("es-CL"), metodo.abonos.toLocaleString("es-CL")];
                datosMetodos.push(dato);
            });

            ticketData.push(createTableItem(labelMetodos, datosMetodos));
            ticketData.push(createSpace());

            ticketData.push(createTitleItemCenter(`Ventas por vendedor`));

            let labelVendedores = ["nombre", "cantidad", "total"];
            let datosVendedores = [];

            contenido.vendedores.forEach(vendedor => {
                let dato = [vendedor.nombre, vendedor.cantidadVentas, "$"+vendedor.totalVentas];
                datosVendedores.push(dato);
            });

            ticketData.push(createTableItem(labelVendedores, datosVendedores));

            const options = {
                preview: false, // No mostrar vista previa
                width: '58mm', // Ancho del ticket
                printerName: printerName, // Nombre de la impresora
                timeOutPerLine: 400,
                silent: true, // No mostrar diálogos de impresión
                margin: '0 0 0 0'
            };
            
            await PosPrinter.print(ticketData, options);
            res.json({ success: true, message: "Impresión exitosa", data: ticketData });
        }catch(error){
            console.error("Error al imprimir:", error);
        }
    });

    server.post("/api/imprimir-informe-semanal", async (req, res) => {
        const { impresora, contenido } = req.body;

        if (!impresora || !contenido) {
            return res.status(400).send("Datos inválidos para impresión");
        }

        try {
            const printers = await mainWindow.webContents.getPrintersAsync();

            const printerName = printers.find((p) => p.name === impresora)?.name;
            //const printerStatus = printers.find((p) => p.name === impresora)?.status;

            //console.log("Estado de la impresora:", printerStatus);

            let ticketData = [];

            ticketData.push(createTitleItemCenter(`Informe de ventas`));
            ticketData.push(createTextItem(contenido.ventas.fecha));
            ticketData.push(createSpace());
            ticketData.push(createTextItem(`Cantidad de ventas: ${contenido.ventas.cantidad}`));
            ticketData.push(createTextItem(`Total vendido: ${contenido.ventas.total}`));
            ticketData.push(createTextItem(`Total recibido : ${contenido.ventas.totalRecibido}`));
            ticketData.push(createSpace());

            let labelMetodos = ["Método", "Cantidad", "Total", "Total Recibido"];
            let datosMetodos = [];

            ticketData.push(createTitleItemCenter(`Ventas por método de pago`));
            contenido.tipoMetodo.forEach(metodo => {
                let dato = [metodo.nombre, metodo.cantidad, metodo.total.toLocaleString("es-CL"), metodo.abonos.toLocaleString("es-CL")];
                datosMetodos.push(dato);
            });

            ticketData.push(createTableItem(labelMetodos, datosMetodos));
            ticketData.push(createSpace());

            ticketData.push(createTitleItemCenter(`Ventas por vendedor`));

            let labelVendedores = ["nombre", "cantidad", "total"];
            let datosVendedores = [];

            contenido.vendedores.forEach(vendedor => {
                let dato = [vendedor.nombre, vendedor.cantidadVentas, "$"+vendedor.totalVentas];
                datosVendedores.push(dato);
            });

            ticketData.push(createTableItem(labelVendedores, datosVendedores));

            ticketData.push(createSpace());

            let labelFecha = ["Fecha", "Cantidad", "Total", "Total Recibido"];
            let datosFechas = [];

            ticketData.push(createTitleItemCenter(`Ventas por día`));
            contenido.ventasPorFecha.forEach(fecha => {
                let dato = [fecha.fecha, fecha.cantidad, fecha.total.toLocaleString("es-CL"), fecha.abonos.toLocaleString("es-CL")];
                datosFechas.push(dato);
            });

            ticketData.push(createTableItem(labelFecha, datosFechas));
            ticketData.push(createSpace());

            const options = {
                preview: false, // No mostrar vista previa
                width: '58mm', // Ancho del ticket
                printerName: printerName, // Nombre de la impresora
                timeOutPerLine: 400,
                silent: true, // No mostrar diálogos de impresión
                margin: '0 0 0 0'
            };
            
            await PosPrinter.print(ticketData, options);
            res.json({ success: true, message: "Impresión exitosa", data: ticketData });
        }catch(error){
            console.error("Error al imprimir:", error);
        }
    });
};

function createTextItem(value, style = {}) {
    return {
        type: 'text',
        value: value || " ", // Si el valor es vacío, se reemplaza con un espacio
        style: { fontWeight: "500", textAlign: 'left', fontSize: "12px", wordWrap: true, whiteSpace: 'pre-line',...style }
    };
}

function createTitleItemCenter(value, style = {}) {
    return {
        type: 'text',
        value: value || " ", // Si el valor es vacío, se reemplaza con un espacio
        style: { fontWeight: "800", textAlign: 'center', fontSize: "16px", wordWrap: true, whiteSpace: 'pre-line',...style }
    };
}

function createTableItem(header, body){
    return {
        type: 'table',
        style: {border: '0.5px solid #ddd'},
        tableHeader: header,
        tableBody: body,
        alignment: 'center'
    };
}

function createImageItem(url){
    return{
        type: 'image',
        url: url,     
        position: 'center',                                           
        height: '60px',     
    }
}

function createQr(enlace){
    return {
        type: 'qrCode',
        value: enlace,
        height: 150,
        width: 150,
        style: { margin: '10 20px 20 20px' }
    }
}

function createSpace(height = 10) {
    return {
        type: 'text',
        value: ' ',
        style: { fontSize: `${height}px` }
    };
}

function createPaperCut() {
    return {
        type: 'cut',
        value: ''
    };
}