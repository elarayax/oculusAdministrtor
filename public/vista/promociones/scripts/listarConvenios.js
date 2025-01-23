function llenarDivConvenios(convenios){
    const tablaConvenios = document.getElementById("conveniosTable");
    tablaConvenios.innerHTML = "";
    convenios.forEach(convenio => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${convenio.nombre}</td>
        <td>${convenio.activo}</td>
        <td>${convenio.descuento}</td>
        <td>
        <button class="btn btn-primary" onclick="editarConvenio(${convenio.id})">Editar</button>
        <button class="btn btn-danger" onclick="eliminarConvenio(${convenio.id})">Eliminar</button>
        </td>
        `;
        tablaConvenios.appendChild(fila);
    });
}