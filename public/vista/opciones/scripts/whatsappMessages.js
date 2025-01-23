async function verificarEstado() {
    const estado = await obtenerEstadoWhatsapp();
    if (estado) {
        return estado;
    } else {
        console.log('No se pudo obtener el estado');
        return null;
    }
}

async function inicioWhatsapp(){
    const estadoWhatsapp = await verificarEstado();
    const divWhatsapp = document.getElementById("whatsapp");
    const texto = document.createElement("p");

    const btnLimpiarSesion = document.createElement("button");
    btnLimpiarSesion.textContent = "Limpiar Sesion";
    btnLimpiarSesion.onclick = limpiarSesion;
    divWhatsapp.appendChild(btnLimpiarSesion);

    console.log(estadoWhatsapp)

    if(estadoWhatsapp.connected){
        texto.textContent = `Whatsapp ya configurado`;
        divWhatsapp.appendChild(texto);
        const btnMensaje = document.createElement("button");
        btnMensaje.textContent = "Enviar mensaje";
        btnMensaje.onclick = enviarMensaje;
        divWhatsapp.appendChild(btnMensaje);
    }else{
        texto.textContent = `Whatsapp no configurado`;
        divWhatsapp.appendChild(texto);
        const qrWhatsapp = await getQR();
        console.log("qr recibido: ",qrWhatsapp);
        if(qrWhatsapp){
            const qrCode = document.createElement("img");
            qrCode.src = qrWhatsapp;
            divWhatsapp.appendChild(qrCode);
        }
    }
}

async function limpiarSesion(){
    await clearWhatsappAuth(); // Limpiar sesión en el backend
    alert("sesión cerrada");

    // Luego de limpiar la sesión, forzar la generación de un nuevo QR
    const nuevoQR = await getQR();
    if (nuevoQR) {
        console.log("Nuevo QR generado: ", nuevoQR);
        // Aquí puedes manejar la visualización del QR generado
        const qrCode = document.createElement("img");
        qrCode.src = nuevoQR;
        document.getElementById("whatsapp").appendChild(qrCode);
    } else {
        console.error("No se pudo generar el QR.");
    }
}

async function getQR() {
    try {
        const qrImage = await obtenerWhatsappQR();
        if (qrImage && qrImage.startsWith('data:image/png;base64,')) {
            console.log("imagen valida");
            return qrImage;
        } else {
            console.error("QR inválido o no recibido correctamente");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener el QR:", error);
        return null;
    }
}


async function enviarMensaje() {
    enviarMensajeWhatsapp("56954877780", "mensaje de prueba");
}
inicioWhatsapp();