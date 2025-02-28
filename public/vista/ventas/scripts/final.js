let empresa;
let logo;



async function final(){
    let tablaDatosUsuarioFinal = document.getElementById("tablaDatosUsuarioFinal");
    tablaDatosUsuarioFinal.innerHTML = "";

    document.getElementById("logoOptica").src = 'http://localhost:3001/' + logo;

    venta.imagen = 'http://localhost:3001/' + logo;

    document.getElementById("logoOptica").style.height = "150px";
    document.getElementById("logoOptica").classList.add("sd-16");

    document.getElementById("nombreOptica").innerText = empresa.nombre;
    document.getElementById("direccionOptica").innerText = `Dirección: ${empresa.direccion}`;
    document.getElementById("telefonoOptica").innerText = `Teléfono: ${empresa.telefono}`;
    document.getElementById("correoOptica").innerText = `Correo: ${empresa.correo}`;
    document.getElementById("rutOptica").innerText = `Rut: ${empresa.rut}`;

    let datosExtra  = document.getElementById("datosExtra")

    empresa.camposPersonalizados.forEach(datos => {
        const texto = document.createElement("p");
        texto.innerText = `${datos.nombre}: ${datos.valor}`;
        datosExtra.appendChild(texto);
    });

    document.getElementById("vendedorNombre").innerText = venta.vendedor.nombre;
    document.getElementById("fechaFinal").innerText = venta.fecha;

    let datosTablaUSuarioFinal = `
        <tr>
            <td>
                <b>Nombre</b>
            </td>
            <td>
                ${venta.cliente.nombre}
            </td>
            <td>
                <b>Rut</b>
            </td>
            <td>
                ${venta.cliente.rut}
            </td>
        </tr>
        <tr>
            <td>
                <b>Teléfono</b>
            </td>
            <td>
                ${venta.cliente.telefono}
            </td>
            <td>
                <b>Correo</b>
            </td>
            <td>
                ${venta.cliente.correo}
            </td>
        </tr>
    `;

    if(venta.cliente.direccion != undefined){
        datosTablaUSuarioFinal += `
        <tr>
            <td>
                <b>Dirección</b>
            </td>
            <td colspan="3">
                ${venta.cliente.direccion}
            </td>
        </tr>
        `;
    }

    let detalleCristalesFinal = document.getElementById("detalleCristalesFinal");

    let tablasCristalesFinal = "";

    venta.productos.forEach(producto => {
        if(producto.tipo == "cristales"){
            let variantecristal = "";

            if(producto.cristales.variante != "blanco"){
                variantecristal = ` <span>- ${producto.variante}</span>`;
            }

            tablasCristalesFinal += `
                <div>
                    <p class="sd-12"><b>Tipo de lente:</b> <span>${producto.cristales.tipoLente}</span></p>
                    <p class="sd-12"><b>Cristal: </b> <span>${producto.cristalBase}</span> ${variantecristal}</p>
                    <table>
                        <tr>
                            <td></td>
                            <td>
                                <b>Esfera</b>
                            </td>
                            <td>
                                <b>Cilindro</b>
                            </td>
                            <td>
                                <b>Eje</b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>OD</b>
                            </td>
                            <td>
                                ${producto.cristales.esferaOD}
                            </td>
                            <td>
                                ${producto.cristales.cilindroOD}
                            </td>
                            <td>
                                ${producto.cristales.ejeOD}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>OI</b>
                            </td>
                            <td>
                                ${producto.cristales.esferaOI}
                            </td>
                            <td>
                                ${producto.cristales.cilindroOI}
                            </td>
                            <td>
                                ${producto.cristales.ejeOI}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>DP</b>
                            </td>
                            <td>
                                ${producto.cristales.DP}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>ADD</b>
                            <td>
                                ${producto.cristales.ADD}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>ALT</b>
                            <td>
                                ${producto.cristales.ALT}
                            </td>
                        </tr>
                    </table>
                </div>
            `
        }
        if(producto.tipo == "lente"){
            let variantecristal = "";

            if(producto.cristales.variante != "blanco"){
                variantecristal = ` <span>- ${producto.cristales.variante}</span>`;
            }

            tablasCristalesFinal += `
                <div>
                    <p class="sd-12"><b>Tipo de lente:</b> <span>${producto.cristales.cristales.tipoLente}</span></p>
                    <p class="sd-12"><b>Cristal: </b> <span>${producto.cristales.cristalBase}</span> ${variantecristal}</p>
                    <table>
                        <tr>
                            <td></td>
                            <td>
                                <b>Esfera</b>
                            </td>
                            <td>
                                <b>Cilindro</b>
                            </td>
                            <td>
                                <b>Eje</b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>OD</b>
                            </td>
                            <td>
                                ${producto.cristales.cristales.esferaOD}
                            </td>
                            <td>
                                ${producto.cristales.cristales.cilindroOD}
                            </td>
                            <td>
                                ${producto.cristales.cristales.ejeOD}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>OI</b>
                            </td>
                            <td>
                                ${producto.cristales.cristales.esferaOI}
                            </td>
                            <td>
                                ${producto.cristales.cristales.cilindroOI}
                            </td>
                            <td>
                                ${producto.cristales.cristales.ejeOI}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>DP</b>
                            </td>
                            <td>
                                ${producto.cristales.cristales.DP}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>ADD</b>
                            <td>
                                ${producto.cristales.cristales.ADD}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>ALT</b>
                            <td>
                                ${producto.cristales.cristales.ALT}
                            </td>
                        </tr>
                    </table>
                </div>`
        }
    });
    detalleCristalesFinal.innerHTML = tablasCristalesFinal;
    tablaDatosUsuarioFinal.innerHTML = datosTablaUSuarioFinal;

    let detalleVentaFinal = document.getElementById("detalleVentaFinal");
    detalleVentaFinal.innerHTML = "";

    let contador = 0;

    venta.productos.forEach(producto => {
        if(producto.tipo != 'lente' && producto.tipo != 'cristales'){
            let datosDetalleVenta = `
            <tr>
                <td>
                    ${producto.nombre}
                </td>
                <td>
                    ${producto.cantidad}
                </td>
            </tr>`;
            detalleVentaFinal.innerHTML += datosDetalleVenta;
            contador++;
        }
        if(producto.tipo == 'lente'){
            let datosDetalleVenta = `
            <tr>
                <td>
                    Marco ${producto.marco.nombre}
                </td>
                <td>
                    ${producto.marco.cantidad}
                </td>
            </tr>`;
            detalleVentaFinal.innerHTML += datosDetalleVenta;
            contador++;
        }
    });

    if(contador == 0){
        document.getElementById("detalleVentaFinalShow").style.display = "none";
    }

    let tablaDatosPago = document.getElementById("tablaDatosPago");
    tablaDatosPago.innerHTML = "";

    if(venta.observaciones != ""){
        document.getElementById("observacionesFinal").innerText = venta.observaciones;
    }else{
        document.getElementById("divObservaciones").style.display = "none";
    }

    let nombreMetodoPago = metodosPago.find(c => c.id == parseInt(venta.metodoPago));
    venta.nombreMetodoPago = nombreMetodoPago;

    let ventaPendiente = 0;

    if (isNaN(venta.pendiente)) { // Usar isNaN para verificar si es NaN
        venta.pendiente = venta.total; // Asignar el valor de venta.total si pendiente es NaN
        ventaPendiente = venta.total;
    } else {
        ventaPendiente = venta.pendiente; // Usar el valor de pendiente si no es NaN
    }

    let datosTablaPago = `
        <tr>
            <td>
                <b>Total</b>
            </td>
            <td>
                $${venta.total.toLocaleString("es-CL")}
            </td>
        </tr>
        <tr>
            <td>
                <b>Cancelado</b>
            </td>
            <td>
                $${venta.abonos.toLocaleString("es-CL")}
            </td>
        <tr>
        <tr>
            <td>
                <b>Pendiente</b>
            </td>
            <td>
                $${ventaPendiente.toLocaleString("es-CL")}
            </td>
        <tr>
        <tr>
            <td>
                <b>Método de pago</b>
            </td>
            <td>
                ${nombreMetodoPago.nombre}
            </td>
        </tr>
    `;

    tablaDatosPago.innerHTML = datosTablaPago;

    const boleta = await obtenerBoleta();
    if (boleta) {
        document.getElementById("tituloTextoBoleta").innerText = boleta.titulo || "";
        document.getElementById("textoTextoBoleta").innerText = boleta.texto || "";
        venta.boleta = boleta;
    }
}

let mensajeWhatsapp;

async function guardarVenta() {
    venta.estado = document.getElementById("selectEstadoVenta").value;
    
    let mensajeWhatsapp = "";
    if (venta.estado === "Generada") {
        mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra ha sido generada, te iremos contactando por este medio con los cambios que tenga. Adjuntamos el detalle de la compra.`;
    } else if (venta.estado === "Fabricando") {
        mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra ha sido enviada a fabricación, pronto estará lista. Adjuntamos el detalle de la compra.`;
    } else if (venta.estado === "Finalizada") {
        mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra ha sido finalizada. Adjuntamos el detalle de la compra.`;
    }

    const contenido = document.getElementById("ventaTotal");
    if (!contenido) {
        console.error("El elemento a capturar no existe.");
        return;
    }

    try {
        const canvas = await html2canvas(contenido);
        const imagenBase64 = canvas.toDataURL("image/png");

        await agregarVenta(venta);
        generarMensaje("green", "Venta generada satisfactoriamente");

        if (verificarEstado() != null) {
            try {
                await enviarImagenWhatsapp(`56${venta.cliente.telefono}`, imagenBase64, mensajeWhatsapp);
                generarMensaje("green", "Mensaje enviado por WhatsApp satisfactoriamente");
            } catch (error) {
                generarMensaje("red", "Error al enviar mensaje por WhatsApp");
            }
        }
    } catch (error) {
        generarMensaje("red", "Error al generar la venta");
    }

    for (const producto of venta.productos) {
        if (producto.tipo === "lente" && producto.marco && !marcoNuevo) {
            const modeloId = producto.marco.modelo.id;
            const cantidadVendida = producto.marco.cantidad;

            const resultado = await actualizarStockModelo(modeloId, cantidadVendida);
            if (!resultado) {
                generarMensaje("red", `Error al actualizar el stock del marco ${producto.marco.modelo.nombre}`);
            }
        } else if (producto.tipo === "marco" && !marcoNuevoSolo) {
            const modeloId = producto.modelo.id;
            const cantidadVendida = producto.cantidad;
            const resultado = await actualizarStockModelo(modeloId, cantidadVendida);
            if (!resultado) {
                generarMensaje("red", `Error al actualizar el stock del marco ${producto.modelo.nombre}`);
            }
        }
    }

    if (newClient) {
        try {
            await agregarCliente(venta.cliente);
            generarMensaje("green", "Cliente agregado satisfactoriamente");
        } catch (error) {
            generarMensaje("red", "Error al agregar cliente");
        }
    }

    // Agregar un temporizador de 2 segundos antes de recargar la página
   setTimeout(() => {
        location.reload();
    }, 2000);
}


async function verificarEstado() {
    const estado = await obtenerEstadoWhatsapp();
    if (estado) {
        return estado;
    } else {
        console.log('No se pudo obtener el estado');
        return null;
    }
}

datosEmpresa();
getLogo();

async function datosEmpresa() {
    try{
        const respuesta = await obtenerEmpresa();
        empresa = respuesta;
        venta.empresa = empresa;
    }catch(error){
        generarMensaje("red", "no se pudieron obtener los datos de la empresa");
    }
}

async function getLogo(){
    try{
        const respuesta = await obtenerLogo();
        logo = respuesta;
    }catch(error){
        generarMensaje("red", "no se pudo obtener el logo");
    }
}

function generarImagenCotizacion() {
    event.preventDefault();
    
    const contenido = document.getElementById("ventaTotal");
    console.log(contenido); // Verifica que el elemento existe y tiene contenido
    
    if (!contenido) {
        console.error("El elemento a capturar no existe.");
        return;
    }

    let nombre = venta.cliente.nombre;

    html2canvas(contenido).then((canvas) => {
        const imagenURL = canvas.toDataURL("image/png");

        // Crear un enlace para descargar la imagen
        const link = document.createElement("a");
        link.href = imagenURL;
        link.download = `venta${nombre}.png`;
        link.click();
    }).catch((error) => {
        console.error("Error al generar la imagen:", error);
        generarMensaje("red","Hubo un problema al generar la imagen. Inténtalo de nuevo.");
    });
}

async function newPrint() {
    let impresoras = await obtenerImpresoras();
    printModal(impresoras, venta, imprimirAhora);

    // Imprimir el objeto impresoras en la consola de manera legible
    console.log(JSON.stringify(impresoras, null, 2));
}