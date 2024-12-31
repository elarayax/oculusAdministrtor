document.getElementById("btnAdministrarMarcas").addEventListener("click", () => {
    document.getElementById("popupadministrarMarcas").style.display = "flex";
    document.getElementById("nombreMarca").focus();
});

// Función para cerrar el formulario sin guardar
document.getElementById("cerrarPopupMarcas").addEventListener("click", () => {
    document.getElementById("popupadministrarMarcas").style.display = "none";
});

async function addMarca() {
    const nombre = document.getElementById('nombreMarca').value.trim();
    const descripcion = document.getElementById('descripcionMarca').value.trim();

    if (!nombre || !descripcion) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const nuevoMetodo = await agregarMarca(nombre, descripcion);
        if (nuevoMetodo) {
            alert('Marca agregada correctamente.');
            document.getElementById('nombreMarca').value = "";
            document.getElementById('nombreMarca').focus();
            document.getElementById('descripcionMarca').value = "";
            cargarTodo();
        }
    } catch (error) {
        alert('No fue posible agregar la marca.');
    }
}

async function cargarTodo() {
    const todo = await obtenerMarcasYModelos(); // Obtén la lista completa de productos
    let marcas = todo.marcas;
    cargarTablaMarcas(marcas);
}

function cargarTablaMarcas(marcas){
    const tablaMarcas = document.getElementById("tbodyMarcas");
    tablaMarcas.innerHTML = "";
    marcas.forEach(marca => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>
            <input type="text" value="${marca.nombre}" id="nombreMarca${marca.id}" name="nombreMarca${marca.id}" disabled>
        </td>
        <td>
            <input type="text" value="${marca.descripcion}" id="descripcionMarca${marca.id}" name="descripcionMarca${marca.id}" disabled>
        </td>
        <td>
        <button class="btn btn-secondary" id="editar${marca.id}" onclick="editarMarca(${marca.id})">Editar</button>
        <button class="btn btn-danger" onclick="eliminarMarca(${marca.id}, '${marca.nombre}')">Eliminar</button>
        `;
        tablaMarcas.appendChild(fila);
    });
}

function editarMarca(id){
    const boton = document.getElementById(`editar${id}`);
    const inputNombre = document.getElementById(`nombreMarca${id}`);
    const inputDescripcion = document.getElementById(`descripcionMarca${id}`);
    if(boton.innerText == "Editar"){
        boton.innerText = "Actualizar";
        boton.classList.remove("btn-secondary");
        boton.classList.add("btn-primary");
        inputNombre.disabled = false;
        inputDescripcion.disabled = false;
    } else {
        // Obtener los datos actualizados
        const nombreActualizado = inputNombre.value;
        const descripcionActualizada = inputDescripcion.value;

        // Enviar los datos al servidor
        const datosActualizados = {
            nombre: nombreActualizado,
            descripcion: descripcionActualizada
        };

        // Llamar a la función que hace la actualización al servidor
        actualizarMarcaOModelo('marcas', id, datosActualizados)
            .then(actualizado => {
                if (actualizado) {
                    alert('Marca actualizada exitosamente!');
                    document.getElementById('nombreMarca').focus();
                    cargarTodo();
                } else {
                    // Si hubo un error, mostrar un mensaje (opcional)
                    alert('Error al actualizar la marca.');
                }
            });

        // Cambiar el botón de vuelta a "Editar"
        boton.innerText = "Editar";
        boton.classList.remove("btn-primary");
        boton.classList.add("btn-secondary");
        
        // Deshabilitar los campos nuevamente
        inputNombre.disabled = true;
        inputDescripcion.disabled = true;
    }
}

function eliminarMarca(id, nombre){
    if (confirm(`¿Estás seguro de eliminar la marca "${nombre}"?`)) {
        try{
            let tipo = "marcas"
            eliminarMarcaOModelo(tipo, id);
            alert("Marca Eliminada exitosamente")
            cargarTodo();
            document.getElementById('nombreMarca').focus();
        }catch(error){
            console.error(error);
        }
    }
}

cargarTodo();