cargarMonedas();

async function cargarMonedas(){
    const monedas = await obtenerMonedas();
    const listadoMonedas = document.getElementById("listadoMonedas");
    listadoMonedas.innerHTML = "";
    monedas.forEach((moneda) => {
        const tr = document.createElement("tr");
        const tdNombre = document.createElement("td");
        tdNombre.innerText = moneda.nombre;
        tr.appendChild(tdNombre)
        const tdValor = document.createElement("td");
        tdValor.innerText = moneda.valor;
        tr.appendChild(tdValor)
        const tdDefecto = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = moneda.defecto; // Marca el checkbox si es por defecto
        checkbox.addEventListener("change", () => manejarSeleccionDefecto(moneda.id)); // Maneja la selección
        tdDefecto.appendChild(checkbox);
        tr.appendChild(tdDefecto);
        listadoMonedas.appendChild(tr);
    });
}

async function manejarSeleccionDefecto(idSeleccionado) {
    const checkboxes = document.querySelectorAll("#listadoMonedas input[type='checkbox']");
    
    // Asegurarse de que solo uno esté marcado
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // Marcar solo el checkbox seleccionado
    const checkboxSeleccionado = [...checkboxes].find((_, index) => {
        const monedaRow = checkboxes[index].closest("tr");
        const monedaId = monedaRow.getAttribute("data-id");
        return monedaId == idSeleccionado;
    });

    if (checkboxSeleccionado) checkboxSeleccionado.checked = true;

    // Actualizar en el backend cuál moneda es "Por Defecto"
    try {
        await actualizarCampoMoneda(idSeleccionado, "defecto", true);
        console.log(`Moneda con ID ${idSeleccionado} actualizada como 'Por Defecto'`);
        cargarMonedas();
    } catch (error) {
        console.error("Error al actualizar moneda por defecto:", error);
    }
}