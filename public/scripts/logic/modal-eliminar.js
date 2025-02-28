function abrirModalEliminar(valor, tipo, metodo, refresh, ...ids) {
    document.getElementById("mensajeEliminar").innerHTML = 
        `¿Está seguro de eliminar ${tipo} <span><b>${valor}</b></span>?`;
    
    document.getElementById("modalEliminar").style.display = "block";

    document.getElementById("btnEliminar").onclick = async () => {
        try {
            const resultado = await metodo(...ids); // Pasa los IDs dinámicamente
            if (resultado) {
                generarMensaje("green", `${tipo} eliminado correctamente.`);
                refresh();
            } else {
                generarMensaje("red", `Error al eliminar ${tipo}.`);
            }
            cerrarModalEliminar();
        } catch (error) {
            generarMensaje("red", `No se pudo eliminar ${tipo}.`);
            cerrarModalEliminar();
        }
    };
}

function cerrarModalEliminar() {
    document.getElementById("modalEliminar").style.display = "none";
}
