function final(){
    let tablaDatosUsuarioFinal = document.getElementById("tablaDatosUsuarioFinal");
    tablaDatosUsuarioFinal.innerHTML = "";

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

    tablaDatosUsuarioFinal.innerHTML = datosTablaUSuarioFinal;

    let detalleVentaFinal = document.getElementById("detalleVentaFinal");
    detalleVentaFinal.innerHTML = "";

    venta.productos.forEach(producto => {
        let datosDetalleVenta = `
        <tr>
            <td>
                ${producto.nombre}
            </td>
            <td>
                ${producto.cantidad}
            </td>
            <td>
                $${producto.precio}
            </td>
        </tr>`;
        detalleVentaFinal.innerHTML += datosDetalleVenta;
    });

    let tablaDatosPago = document.getElementById("tablaDatosPago");
    tablaDatosPago.innerHTML = "";

    let nombreMetodoPago = metodosPago.find(c => c.id == parseInt(venta.metodoPago));

    let datosTablaPago = `
        <tr>
            <td>
                <b>Total</b>
            </td>
            <td>
                $${venta.total}
            </td>
        </tr>
        <tr>
            <td>
                <b>Abono</b>
            </td>
            <td>
                $${venta.abonos}
            </td>
        <tr>
        <tr>
            <td>
                <b>Pendiente</b>
            </td>
            <td>
                $${venta.pendiente}
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
}

let mensajeWhatsapp;

async function guardarVenta(){
    venta.fecha = new Date().toLocaleDateString();
    venta.estado = document.getElementById("selectEstadoVenta").value;
    
    if(venta.estado == "Generada"){
        mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra a sido generada, te iremos contactando por este medio los cambios que tenga, adjuntamos el detalle de la compra`;
    }else{
        if(venta.estado == "Fabricando"){
            mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra a sido enviada a fabricación pronto estará lista, adjuntamos el detalle de la compra`;
        }else{
            if(venta.estado == "Finalizada"){
                mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra a sido finalizada, adjuntamos el detalle de la compra`;
            }
        }
    }

    const contenido = document.getElementById("ventaTotal");

    if (!contenido) {
        console.error("El elemento a capturar no existe.");
        return;
    }

    html2canvas(contenido)
        .then((canvas) => {
            const imagenBase64 = canvas.toDataURL("image/png");
            try{
                agregarVenta(venta);
                alert("Venta generada satisfactoriamente");
        
                if(verificarEstado() != null){
                    try{
                        enviarImagenWhatsapp(`56${venta.cliente.telefono}`, imagenBase64,mensajeWhatsapp);
                        alert("Mensaje enviado por whatsapp satisfactoriamente");
                    }catch(error){
                        alert("Error al enviar mensaje por whatsapp");
                    }
                }
            }catch(error){
                alert("Error al generar la venta");
            }
    })
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
