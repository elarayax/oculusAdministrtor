let ventasHoy;
let jsonVentas = {
    "ventas": {},
    "tipoMetodo": [],
    "vendedores": [],
};

async function llamarVentasHoy() {
    try {
        const ventas = await obtenerVentasHoy();
        ventasHoy = ventas;
        llenarTablaVentas(ventasHoy);
    } catch (error) {
        console.log(`no se pudieron obtener las ventas de hoy ${error}`);
    }
}

function llenarTablaVentas(ventasHoy) {
    const tablaVentas = document.getElementById("resultadoInforme");
    tablaVentas.innerHTML = ""; // Limpiar la tabla antes de llenarla

    let trCantidad = document.createElement("tr");
    let tdCantidad = document.createElement("td");
    tdCantidad.textContent = "Cantidad de Ventas";
    trCantidad.appendChild(tdCantidad);

    let tdCantidadd = document.createElement("td");
    tdCantidadd.textContent = ventasHoy.length;
    trCantidad.appendChild(tdCantidadd);

    const sumaTotal = ventasHoy.reduce((acumulador, venta) => acumulador + venta.abonos, 0);
    const sumaTotalTotal = ventasHoy.reduce((acumulador, venta) => acumulador + venta.total, 0);

    let trTotal = document.createElement("tr");
    let tdTotal = document.createElement("td");
    tdTotal.textContent = "Total dinero ingresado";
    trTotal.appendChild(tdTotal);

    let tdTotald = document.createElement("td");
    tdTotald.textContent = "$" + sumaTotal.toLocaleString("es-CL");
    trTotal.appendChild(tdTotald);

    tablaVentas.appendChild(trCantidad);
    tablaVentas.appendChild(trTotal);

    let trTotalTotal = document.createElement("tr");
    let tdTotalTotal = document.createElement("td");
    tdTotalTotal.textContent = "Total en ventas";
    trTotalTotal.appendChild(tdTotalTotal);

    let tdTotalTotald = document.createElement("td");
    tdTotalTotald.textContent = "$" + sumaTotalTotal.toLocaleString("es-CL");
    trTotalTotal.appendChild(tdTotalTotald);

    tablaVentas.appendChild(trTotalTotal);

    const hoy = new Date();
    const fechaActual = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;

    jsonVentas.ventas = {
        fecha: fechaActual,
        cantidad: ventasHoy.length,
        total: "$" + sumaTotal.toLocaleString("es-CL"),
        totalRecibido: "$" + sumaTotalTotal.toLocaleString("es-CL")
    };

    // 🔹 Agrupar ventas por método de pago
    const agrupadoPorMetodoPago = ventasHoy.reduce((acumulador, venta) => {
        const metodo = venta.nombreMetodoPago.nombre; // Acceder correctamente al nombre del método de pago

        if (!acumulador[metodo]) {
            acumulador[metodo] = { total: 0, cantidad: 0, abonos: 0 };
        }

        acumulador[metodo].total += venta.total;
        acumulador[metodo].cantidad += 1;
        acumulador[metodo].abonos += venta.abonos;

        return acumulador;
    }, {});

    // 🔹 Convertir los datos para el gráfico
    const labelsMetodos = Object.keys(agrupadoPorMetodoPago);
    const datosMetodos = labelsMetodos.map(metodo => agrupadoPorMetodoPago[metodo].total);

    // 🔹 Enviar datos al gráfico
    crearGrafico("graficoMetodos", "pie", labelsMetodos, "Ventas por Método de Pago", datosMetodos);

    // 🔹 Mostrar los totales agrupados por método de pago
    let metodosPagoDiv = document.getElementById("metodosPago");
    metodosPagoDiv.innerHTML = ""; // Limpiar antes de agregar nuevos datos

    let listadoPorVentas = document.getElementById("listadoPorVentas");

    for (const metodoPago in agrupadoPorMetodoPago) {
        let tr = document.createElement("tr");
        let tdNombre = document.createElement("td");
        tdNombre.textContent = metodoPago;
        tr.appendChild(tdNombre);

        let trCantidadVentas = document.createElement("td");
        trCantidadVentas.textContent = agrupadoPorMetodoPago[metodoPago].cantidad;
        tr.appendChild(trCantidadVentas);

        let trTotalVenta = document.createElement("td");
        trTotalVenta.textContent = "$" + (agrupadoPorMetodoPago[metodoPago].total.toLocaleString("es-CL"));
        tr.appendChild(trTotalVenta);

        let trRecibido = document.createElement("td");
        trRecibido.textContent = "$" + (agrupadoPorMetodoPago[metodoPago].abonos.toLocaleString("es-CL"));
        tr.appendChild(trRecibido);

        listadoPorVentas.appendChild(tr);

        let metodos = {
            nombre: metodoPago,
            total: agrupadoPorMetodoPago[metodoPago].total.toLocaleString("es-CL"),
            cantidad: agrupadoPorMetodoPago[metodoPago].cantidad,
            abonos: agrupadoPorMetodoPago[metodoPago].abonos.toLocaleString("es-CL")
        }

        jsonVentas.tipoMetodo.push(metodos);


    }

    const agrupadoPorVendedor = ventasHoy.reduce((acumulador, venta) => {
        const vendedor = venta.vendedor.nombre; // Acceder correctamente al nombre del vendedor

        if (!acumulador[vendedor]) {
            acumulador[vendedor] = { total: 0, cantidad: 0 };
        }

        acumulador[vendedor].total += venta.total;
        acumulador[vendedor].cantidad += 1;

        return acumulador;
    }, {});

    const labelsVendedores = Object.keys(agrupadoPorVendedor);
    const datosVendedores = labelsVendedores.map(vendedor => agrupadoPorVendedor[vendedor].total);

    crearGrafico("graficoVendedores", "pie", labelsVendedores, "Ventas por Vendedor", datosVendedores);

    let listadoPorVendedor = document.getElementById("listadoPorVendedor");
    listadoPorVendedor.innerHTML = "";

    for (const vendedor in agrupadoPorVendedor) {
        let tr = document.createElement("tr");
        let tdNombre = document.createElement("td");
        tdNombre.textContent = vendedor;
        tr.appendChild(tdNombre);

        let tdCantidadVentas = document.createElement("td");
        tdCantidadVentas.textContent = agrupadoPorVendedor[vendedor].cantidad;
        tr.appendChild(tdCantidadVentas);

        let tdTotalVenta = document.createElement("td");
        tdTotalVenta.textContent = "$" + agrupadoPorVendedor[vendedor].total.toLocaleString("es-CL");
        tr.appendChild(tdTotalVenta);

        listadoPorVendedor.appendChild(tr);

        let vendedors = {
            nombre: vendedor,
            cantidadVentas: agrupadoPorVendedor[vendedor].cantidad,
            totalVentas: agrupadoPorVendedor[vendedor].total.toLocaleString("es-CL")
        }

        jsonVentas.vendedores.push(vendedors);
    }
}

async function newPrint() {
    let impresoras = await obtenerImpresoras();
    let metodo = imprimirInformes;
    printModal(impresoras, jsonVentas, metodo);

    // Imprimir el objeto impresoras en la consola de manera legible
    console.log(JSON.stringify(impresoras, null, 2));
}

llamarVentasHoy();

// Función para exportar a Excel
function toExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]); // Crear una hoja vacía
    
    let currentRow = 0;

    const tituloPrincipal = [`Resumen de Ventas - ${jsonVentas.ventas.fecha}`];
    XLSX.utils.sheet_add_aoa(ws, [tituloPrincipal], { origin: `A${currentRow + 1}` });
    ws["!merges"] = [{ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 2 } }]; // Fusionar celdas A1:C1
    currentRow += 2; // Dejar una fila vacía después del título

    XLSX.utils.sheet_add_json(ws, inicioTabla(), { origin: `A${currentRow}` });
    currentRow += 2; // Avanza filas (1 encabezado + 1 datos + 1 espacio)

    XLSX.utils.sheet_add_aoa(ws, [["Ventas por Vendedor"]], { origin: `A${currentRow+1}` });
    ws["!merges"].push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 2 } });
    currentRow += 2;
    XLSX.utils.sheet_add_json(ws, tablaVendedores(), { origin: `A${currentRow}` });
    currentRow += tablaVendedores().length + 2;

    XLSX.utils.sheet_add_aoa(ws, [["Ventas por Métodos de Pago"]], { origin: `A${currentRow+1}` });
    ws["!merges"].push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 3 } });
    currentRow += 2;
    XLSX.utils.sheet_add_json(ws, tablaMetodoPago(), { origin: `A${currentRow}` });

    XLSX.utils.book_append_sheet(wb, ws, "Ventas");

    let nombreArchivo = `ventas-${jsonVentas.ventas.fecha}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
}

function inicioTabla(){
    let tabla = [
        {
            "Cantidad de ventas": jsonVentas.ventas.cantidad,
            "Total de ventas": jsonVentas.ventas.totalRecibido,
            "Total Recibido": jsonVentas.ventas.total
        }
    ];
    return tabla;
}

function tablaMetodoPago(){
    let tabla = [];
    jsonVentas.tipoMetodo.forEach(metodo => {
        tabla.push({
            "Metodo de pago": metodo.nombre,
            "Cantidad de ventas": metodo.cantidad,
            "Total de ventas": "$" + metodo.total,
            "Total Recibido": "$" + metodo.abonos
        });
    });
    return tabla;
}

function tablaVendedores(){
    let tabla = [];
    jsonVentas.vendedores.forEach(vendedor => {
        tabla.push({
            "Nombre": vendedor.nombre,
            "Cantidad de ventas": vendedor.cantidadVentas,
            "Total de ventas": "$" + vendedor.totalVentas
        });
    });
    return tabla;
}