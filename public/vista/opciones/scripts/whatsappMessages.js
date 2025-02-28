let qrCodeData = null; // Variable para almacenar el QR temporalmente
let checkingQR = false; // Bandera para evitar la verificación simultánea

// Verifica el estado de WhatsApp en el backend
async function verificarEstado() {
    try {
        const estado = await obtenerEstadoWhatsapp();
        return estado ? estado : null;
    } catch (error) {
        console.log('Error al obtener el estado:', error);
        return null;
    }
}

// Función principal para iniciar la verificación de WhatsApp
async function inicioWhatsapp() {
    const estadoWhatsapp = await verificarEstado();
    const divWhatsapp = document.getElementById("whatsapp");
    const texto = document.createElement("p");

    const btnLimpiarSesion = document.createElement("button");
    btnLimpiarSesion.textContent = "Limpiar Sesión";
    btnLimpiarSesion.onclick = limpiarSesion;
    btnLimpiarSesion.classList.add("btn", "btn-primary");
    divWhatsapp.appendChild(btnLimpiarSesion);

    if (estadoWhatsapp && estadoWhatsapp.connected) {
        texto.textContent = `Whatsapp ya configurado`;
        divWhatsapp.appendChild(texto);
        const btnMensaje = document.createElement("button");
        btnMensaje.textContent = "Enviar mensaje";
        btnMensaje.onclick = enviarMensaje;
        btnMensaje.classList.add("btn", "btn-primary");
        divWhatsapp.appendChild(btnMensaje);
    } else {
        texto.textContent = `Whatsapp no configurado`;
        divWhatsapp.appendChild(texto);

        // Comienza a verificar el QR cada 2 segundos
        iniciarVerificacionQR();
    }
}

// Limpia la sesión de WhatsApp y genera un nuevo QR
async function limpiarSesion() {
    await clearWhatsappAuth(); // Limpiar sesión en el backend
    alert("Sesión cerrada");

    // Espera que se genere un nuevo QR sin necesidad de WebSocket
    iniciarVerificacionQR();
}

// Inicia la verificación del QR con un temporizador
function iniciarVerificacionQR() {
    if (checkingQR) return; // Evita iniciar múltiples verificaciones
    checkingQR = true;

    const intervalId = setInterval(async () => {
        try {
            const estadoWhatsapp = await verificarEstado();
            
            if (estadoWhatsapp && estadoWhatsapp.connected) {
                // Si la sesión está conectada, detenemos la verificación
                clearInterval(intervalId);
                checkingQR = false;
                const qrContainer = document.getElementById("whatsapp");
                qrContainer.innerHTML = ''; // Limpiar contenido previo
                console.log("Sesión iniciada correctamente");
                const divWhatsapp = document.getElementById("whatsapp");
                const texto = document.createElement("p");
                texto.textContent = `Whatsapp ya configurado`;
                divWhatsapp.appendChild(texto);
                const btnMensaje = document.createElement("button");
                btnMensaje.textContent = "Enviar mensaje";
                btnMensaje.classList.add("btn", "btn-primary");
                btnMensaje.onclick = enviarMensaje;
        divWhatsapp.appendChild(btnMensaje);
            } else {
                const qrWhatsapp = await getQR();
                if (qrWhatsapp) {
                    mostrarQR(qrWhatsapp); // Muestra el QR si se genera
                }
            }
        } catch (error) {
            console.error("Error al verificar el estado o obtener el QR:", error);
        }
    }, 2000); // Verifica cada 2 segundos
}

// Obtiene el QR desde el backend
async function getQR() {
    try {
        const response = await fetch('/get-whatsapp-qr');
        if (response.ok) {
            const data = await response.json();
            return data.qr;
        }
        return null;
    } catch (error) {
        console.error("Error al obtener el QR:", error);
        return null;
    }
}

// Muestra el código QR recibido
function mostrarQR(base64QR) {
    const qrContainer = document.getElementById("whatsapp");
    qrContainer.innerHTML = ''; // Limpiar contenido previo

    // Verifica que el base64QR sea una cadena válida
    if (base64QR && base64QR.startsWith('data:image/png;base64,')) {
        const qrCode = document.createElement("img");
        qrCode.src = base64QR; // Usa directamente el base64 para la imagen
        qrContainer.appendChild(qrCode);
    } else {
        console.error('QR Base64 inválido:', base64QR);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = 'Error al cargar el QR. Por favor intente de nuevo.';
        qrContainer.appendChild(errorMessage);
    }
}

// Enviar mensaje por WhatsApp (método de backend)
async function enviarMensajeWhatsapp(numero, mensaje) {
    try {
        const response = await
        
        fetch('/send-whatsapp-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: numero, message: mensaje })
        });

        const data = await response.json();
        if (data.success) {
            console.log('Mensaje enviado con éxito');
        } else {
            console.error('Error al enviar mensaje');
        }
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
    }
}

// Inicia la interacción con WhatsApp al cargar
inicioWhatsapp();

async function enviarMensaje() {
    const numero = '56954877780';  // Número al que se enviará el mensaje
    const mensaje = 'Hola, este es un mensaje de prueba';
    await enviarMensajeWhatsapp(numero, mensaje);
}