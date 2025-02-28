async function mostrarBoleta() {
    const boleta = await obtenerBoleta();
    if (boleta) {
        document.getElementById("tituloBoleta").value = boleta.titulo || "";
        document.getElementById("textoBoleta").value = boleta.texto || "";
        document.getElementById("tituloQR").value = boleta.tituloQR || "";
        document.getElementById("enlaceQR").value = boleta.enlaceQR || "";
    } else {
        generarMensaje("red",'No se ha configurado la boleta.');
    }
}

async function actualizarTextoBoleta() {
    const titulo = document.getElementById("tituloBoleta").value.trim();
    const texto = document.getElementById("textoBoleta").value.trim();
    const tituloQR = document.getElementById("tituloQR").value.trim();
    const enlaceQR = document.getElementById("enlaceQR").value.trim();

    const nuevaBoleta = { titulo, texto, tituloQR, enlaceQR };
    const result = await actualizarBoleta(nuevaBoleta);

    if (result) {
        generarMensaje("green",'Boleta actualizada correctamente');
    } else {
        generarMensaje("red",'Error al actualizar la boleta');
    }
}

// Llamamos a mostrarBoleta() para cargar la información cuando la página se cargue
document.addEventListener("DOMContentLoaded", mostrarBoleta);
