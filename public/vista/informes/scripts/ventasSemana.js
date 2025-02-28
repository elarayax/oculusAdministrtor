let ventasHoy;
let jsonVentas = {
    "ventas": {},
    "tipoMetodo": [],
    "vendedores": [],
    "ventasPorFecha": []
};

async function llamarVentasSemana() {
    try {
        const ventas = await obtenerVentasSemana();
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

    const ventasAgrupadasPorFecha = ventasHoy.reduce((acumulador, venta) => {
        const fecha = venta.fecha; // Asegúrate de que la fecha esté en formato DD/MM/YYYY
    
        if (!acumulador[fecha]) {
            acumulador[fecha] = { total: 0, cantidad: 0, abonos: 0 };
        }
    
        acumulador[fecha].total += venta.total;
        acumulador[fecha].cantidad += 1;
        acumulador[fecha].abonos += venta.abonos;
    
        return acumulador;
    }, {});

    const labelsFechas = Object.keys(ventasAgrupadasPorFecha);
    const datosFechas = labelsFechas.map(fecha => ventasAgrupadasPorFecha[fecha].total);

    crearGrafico("graficoFechas", "bar", labelsFechas, "Ventas por fecha", datosFechas);
    
    // Mostrar las ventas agrupadas en la tabla
    let listadoPorFecha = document.getElementById("listadoPorFecha");
    listadoPorFecha.innerHTML = ""; // Limpiar la tabla antes de llenarla
    
    for (const fecha in ventasAgrupadasPorFecha) {
        let tr = document.createElement("tr");
    
        let tdFecha = document.createElement("td");
        tdFecha.textContent = fecha;
        tr.appendChild(tdFecha);
    
        let tdCantidad = document.createElement("td");
        tdCantidad.textContent = ventasAgrupadasPorFecha[fecha].cantidad;
        tr.appendChild(tdCantidad);
    
        let tdTotal = document.createElement("td");
        tdTotal.textContent = "$" + ventasAgrupadasPorFecha[fecha].total.toLocaleString("es-CL");
        tr.appendChild(tdTotal);
    
        let tdAbonos = document.createElement("td");
        tdAbonos.textContent = "$" + ventasAgrupadasPorFecha[fecha].abonos.toLocaleString("es-CL");
        tr.appendChild(tdAbonos);
    
        listadoPorFecha.appendChild(tr);

        let ventaFecha = {
            fecha,
            cantidad: ventasAgrupadasPorFecha[fecha].cantidad,
            total: ventasAgrupadasPorFecha[fecha].total,
            abonos: ventasAgrupadasPorFecha[fecha].abonos
        }

        jsonVentas.ventasPorFecha.push(ventaFecha);
    }
}

async function newPrint() {
    let impresoras = await obtenerImpresoras();
    let metodo = imprimirInformesSemanales;
    printModal(impresoras, jsonVentas, metodo);

    // Imprimir el objeto impresoras en la consola de manera legible
    console.log(JSON.stringify(impresoras, null, 2));
}

llamarVentasSemana();

function corregirFormatoFecha(fechaStr) {
    const partes = fechaStr.split("/");
    if (partes.length === 3) {
        let [dia, mes, anio] = partes;
        mes = mes.padStart(2, "0"); // Asegurar dos dígitos en el mes
        dia = dia.padStart(2, "0"); // Asegurar dos dígitos en el día
        return `${anio}-${mes}-${dia}`; // Convertir a YYYY-MM-DD
    }
    return fechaStr; // Si no es formato esperado, devolver como está
}


function getWeekInfo(fechaStr) {
    const fechaCorregida = corregirFormatoFecha(fechaStr); // Corregir formato
    const [anio, mes, dia] = fechaCorregida.split("-").map(Number); // Separar YYYY-MM-DD
    const fecha = new Date(Date.UTC(anio, mes - 1, dia)); // Usar UTC para evitar zonas horarias

    if (isNaN(fecha)) {
        console.error("Fecha inválida después de conversión:", fechaCorregida);
        return { semana: "Error", fechaLunes: "Fecha inválida", fechaActual: "Fecha inválida" };
    }

    const dayOfWeek = fecha.getUTCDay(); // Día de la semana en UTC (0 = domingo, 1 = lunes, ..., 6 = sábado)

    // Calcular el lunes
    const lunes = new Date(fecha);
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Restar días para llegar al lunes
    lunes.setUTCDate(fecha.getUTCDate() - daysToSubtract);

    // Formatear fechas en YYYY-MM-DD
    const formatoFecha = (date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Calcular número de semana ISO
    const firstThursday = new Date(Date.UTC(lunes.getUTCFullYear(), 0, 4));
    const weekNumber = Math.ceil((((lunes - firstThursday) / 86400000) + firstThursday.getUTCDay() + 1) / 7);

    return {
        semana: weekNumber,
        fechaLunes: formatoFecha(lunes),
        fechaActual: formatoFecha(fecha)
    };
}



function toExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]); // Crear una hoja vacía
    
    let currentRow = 0;

    const { semana, fechaLunes, fechaActual } = getWeekInfo(jsonVentas.ventas.fecha);

    const tituloPrincipal = [`Resumen de Ventas desde el ${fechaLunes} al ${fechaActual}`];
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
    currentRow += tablaMetodoPago().length + 2;
    XLSX.utils.sheet_add_aoa(ws, [["Ventas por fecha"]], { origin: `A${currentRow+1}` });
    ws["!merges"].push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 3 } });
    currentRow += 2;
    XLSX.utils.sheet_add_json(ws, tablaFechas(), { origin: `A${currentRow}` });

    XLSX.utils.book_append_sheet(wb, ws, "Ventas");

    let nombreArchivo = `ventas-semana${semana}-${fechaLunes}-${fechaActual}.xlsx`;
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

function tablaFechas(){
    let tabla = [];
    jsonVentas.ventasPorFecha.forEach(fecha => {
        tabla.push({
            "Fecha": fecha.fecha,
            "Cantidad de ventas": fecha.cantidad,
            "Total de ventas": "$" + fecha.total.toLocaleString("es-CL"),
            "Total Recibido": "$" + fecha.abonos.toLocaleString("es-CL")
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