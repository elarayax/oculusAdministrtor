let marcasGeneral = [];
let marcosGeneral = [];

let currentPage = 1;
const pageSize = 10;

function getTotalPages(items, pageSize) {
    return Math.ceil(items.length / pageSize);
}

function changePage(direction) {
    // Calculamos el número total de páginas
    const totalPages = getTotalPages(marcosGeneral, pageSize);
    
    // Si la dirección es positiva y no estamos en la última página
    if (direction > 0 && currentPage < totalPages) {
        currentPage += direction;
    }
    
    // Si la dirección es negativa y no estamos en la primera página
    if (direction < 0 && currentPage > 1) {
        currentPage += direction;
    }
    
    cargarMarcosPaginated(marcosGeneral, currentPage, pageSize);

    // Mostrar o esconder el botón "Anterior"
    if (currentPage == 1) {
        document.getElementById("prev").style.display = "none";
    } else {
        document.getElementById("prev").style.display = "flex";
    }

    // Mostrar o esconder el botón "Siguiente"
    if (currentPage == totalPages) {
        document.getElementById("next").style.display = "none"; // Suponiendo que tienes un botón "Siguiente"
    } else {
        document.getElementById("next").style.display = "flex";
    }

    // Actualizar el número de página mostrado
    document.getElementById('pageNumber').innerText = `Página ${currentPage}`;
}
document.getElementById("btnAdministrarMarcas").addEventListener("click", () => {
    document.getElementById("popupadministrarMarcas").style.display = "flex";
    document.getElementById("nombreMarca").focus();
});

// Función para cerrar el formulario sin guardar
document.getElementById("cerrarPopupMarcas").addEventListener("click", () => {
    document.getElementById("popupadministrarMarcas").style.display = "none";
    document.getElementById('nombreMarca').value = "";
    document.getElementById('descripcionMarca').value = "";
});

document.getElementById("btnAgregarMarco").addEventListener("click", () => {
    document.getElementById("popupAgregarMarco").style.display = "flex";
    document.getElementById("nombreMarco").focus();
});

document.getElementById("cerrarPopupMarcos").addEventListener("click", () => {
    document.getElementById("popupAgregarMarco").style.display = "none";
    document.getElementById('nombreMarco').value = "";
    document.getElementById('descripcionMarco').value = "";
    document.getElementById('stockMarco').value = "";
    document.getElementById('marcaMarco').value = 0;
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

async function addMarco() {
    const nombre = document.getElementById("nombreMarco").value.trim();
    const descripcion = document.getElementById('descripcionMarco').value.trim();
    const stock = parseInt(document.getElementById('stockMarco').value.trim());
    const idMarca = document.getElementById('marcaMarco').value;
    const sku = document.getElementById('skuMarco').value.trim();
    const precioCosto = parseInt(document.getElementById('precioCostoMarco').value.trim());
    const precioLista = parseInt(document.getElementById('precioListaMarco').value.trim());

    if (!nombre || !descripcion || isNaN(stock) || idMarca == 0 || !sku || isNaN(precioCosto) || isNaN(precioLista)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    try{
        const nuevoMetodo = await agregarModelo(nombre, descripcion, idMarca, stock, sku, precioCosto, precioLista);
        if(nuevoMetodo){
            alert('Marco agregado correctamente.');
            document.getElementById("nombreMarco").value = "";
            document.getElementById("descripcionMarco").value = "";
            document.getElementById("stockMarco").value = "";
            document.getElementById("marcaMarco").value = 0;
            document.getElementById("skuMarco").value = "";
            document.getElementById("precioCostoMarco").value = "";
            document.getElementById("precioListaMarco").value = "";
            document.getElementById("nombreMarco").focus();
            cargarTodo();
        }
    }catch (error){
        alert('No fue posible agregar el Marco');
    }
}

async function cargarTodo() {
    try {
        const todo = await obtenerMarcasYModelos();
        marcasGeneral = todo.marcas;
        if (marcasGeneral && marcasGeneral.length > 0) {
            cargarTablaMarcas(marcasGeneral);
            cargarSelectMarco(marcasGeneral);
            cargarFiltroMarca(marcasGeneral);
        } else {
            alert('Hay que agregar al menos una marca.');
        }
        marcosGeneral = todo.modelos;
        if (marcosGeneral && marcosGeneral.length > 0) {
            currentPage = 1;
            cargarMarcosPaginated(marcosGeneral, currentPage, pageSize);
        }else{
            document.getElementById("marcos").innerText = "No hay marcos en el sistema"
        }
    } catch (error) {
        console.error("Error al cargar las marcas:", error);
        alert('No se pudo cargar la información de marcas.');
    }
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

function cargarSelectMarco(marcas){
    const select = document.getElementById("marcaMarco");
    select.innerHTML = "";
    const option0 = document.createElement("option");
    option0.value = 0;
    option0.text = "Seleccione una marca";
    select.appendChild(option0);
    marcas.forEach(marca => {
        const option = document.createElement("option");
        option.value = marca.id;
        option.text = marca.nombre;
        select.appendChild(option);
    });
}

function cargarFiltroMarca(marcas){
    const select = document.getElementById("filtroMarca");
    select.innerHTML = "";
    const option0 = document.createElement("option");
    option0.value = 0;
    option0.text = "Seleccione una marca";
    select.appendChild(option0);
    marcas.forEach(marca => {
        const option = document.createElement("option");
        option.value = marca.id;
        option.text = marca.nombre;
        select.appendChild(option);
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

function filtrarTablaPorMarca(){
    const inputFiltro = document.getElementById('filtroMarca');
    const valorFiltro = inputFiltro.value;
    if(valorFiltro == 0){
        currentPage = 1;
        cargarMarcosPaginated(marcosGeneral, currentPage, pageSize);
    }else{
        let filtrados = marcosGeneral.filter(e=> e.idMarca == valorFiltro);
        currentPage = 1;
        cargarMarcosPaginated(filtrados, currentPage, pageSize);
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

function filtroEscrito() {
    const inputFiltro = document.getElementById('filtroNombre').value.trim().toLowerCase();
    const metodo = document.getElementById("opcionFiltro").value;
    let filtrados = [];
    currentPage = 1;
    if (inputFiltro === "") {
        cargarMarcosPaginated(marcosGeneral, currentPage, pageSize);
        return;
    }
    if (metodo === "nombre") {
        filtrados = marcosGeneral.filter(e => e.nombre.toLowerCase().includes(inputFiltro));
    } else if (metodo === "sku") {
        filtrados = marcosGeneral.filter(e => e.sku.toLowerCase().includes(inputFiltro));
    }
    cargarMarcosPaginated(filtrados, currentPage, pageSize);
}

function cargarMarcosPaginated(marcos, currentPage, pageSize) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const marcosToDisplay = marcos.slice(startIndex, endIndex);

    const tablaMarcos = document.getElementById("tbodyMarcos");
    
    tablaMarcos.innerHTML = "";

    marcosToDisplay.forEach(marco => {
        let marca = marcasGeneral.filter(e => e.id == marco.idMarca);
        const fila = `
            <tr>
                <td>${marco.nombre}</td>
                <td>${marco.sku}</td>
                <td>${marco.descripcion}</td>
                <td>${marco.stock}</td>
                <td>${marca[0].nombre}</td>
                <td><button class="btn btn-secondary" onclick="accionesMarco(${marco.id})">Acciones</button></td>
            </tr>
        `;
        tablaMarcos.insertAdjacentHTML('beforeend', fila);
    });
    const totalPages = getTotalPages(marcos, pageSize);
    updatePaginationButtons(totalPages);
}

function updatePaginationButtons(totalPages) {
    // Mostrar u ocultar los botones de paginación
    if (currentPage === 1) {
        document.getElementById("prev").style.display = "none"; // Ocultar el botón "Anterior"
    } else {
        document.getElementById("prev").style.display = "flex"; // Mostrar el botón "Anterior"
    }

    if (currentPage === totalPages || totalPages === 0) {
        document.getElementById("next").style.display = "none"; // Ocultar el botón "Siguiente"
    } else {
        document.getElementById("next").style.display = "flex"; // Mostrar el botón "Siguiente"
    }

    // Actualizar el número de la página
    document.getElementById('pageNumber').innerText = `Página ${currentPage}`;
}

function accionesMarco(id) {
    // Filtrar el marco por ID
    let marco = marcosGeneral.filter(e => e.id == id);
    if (marco.length === 0) {
        console.error("Marco no encontrado");
        return;
    }
    marco = marco[0];

    // Filtrar la marca asociada
    let marca = marcasGeneral.filter(e => e.id == marco.idMarca);
    marca = marca.length > 0 ? marca[0] : { nombre: "Desconocida" };

    // Mostrar el popup
    document.getElementById("popupEditarMarco").style.display = "flex";

    const contenido = document.getElementById("contentEditarMarco");
    contenido.innerHTML = ""; // Limpiar contenido previo

    // Crear el título
    const titulo = document.createElement("h2");
    titulo.innerText = `Editar Marco ${marco.nombre}`;
    titulo.classList.add("text-center");
    contenido.appendChild(titulo);

    // Crear la tabla con los datos
    const tablaEditar = document.createElement("table");
    tablaEditar.innerHTML = `
        <tr>
            <td>Nombre marco:</td>
            <td><input type="text" id="nombreMarcoEditar" value="${marco.nombre}" autofocus></td>
        </tr>
        <tr>
            <td>Descripción:</td>
            <td><textarea id="descripcionMarcoEditar">${marco.descripcion}</textarea></td>
        </tr>
        <tr>
            <td>Marca asociada:</td>
            <td><input type="text" id="marcaMarcoEditar" value="${marca.nombre}" disabled></td>
        </tr>
        <tr>
            <td>Stock:</td>
            <td><input type="number" id="stockMarcoEditar" value="${marco.stock}"></td>
        </tr>
        <tr>
            <td>SKU:</td>
            <td><input type="text" id="skuMarcoEditar" value="${marco.sku}"></td>
        </tr>
        <tr>
            <td>Precio costo:</td>
            <td><input type="number" id="precioCostoMarcoEditar" value="${marco.precioCosto}"></td>
        </tr>
        <tr>
            <td>Precio lista:</td>
            <td><input type="number" id="precioListaMarcoEditar" value="${marco.precioLista}"></td>
        </tr>
    `;
    contenido.appendChild(tablaEditar);

    // Botón para guardar los cambios
    const buttonGuardar = document.createElement("button");
    buttonGuardar.classList.add("btn", "btn-primary");
    buttonGuardar.innerText = "Guardar cambios";
    buttonGuardar.onclick = () => {
        const nombre = document.getElementById("nombreMarcoEditar").value;
        const descripcion = document.getElementById("descripcionMarcoEditar").value;
        const stock = parseInt(document.getElementById("stockMarcoEditar").value);
        const sku = document.getElementById("skuMarcoEditar").value;
        const precioCosto = parseInt(document.getElementById("precioCostoMarcoEditar").value);
        const precioLista = parseInt(document.getElementById("precioListaMarcoEditar").value);

        // Actualizar los datos del marco

        let datosActualizados = {
            nombre: nombre,
            descripcion: descripcion,
            stock: stock,
            sku: sku,
            precioCosto: precioCosto,
            precioLista: precioLista
        }

        actualizarMarcaOModelo('modelo', id, datosActualizados)
            .then(actualizado => {
                if (actualizado) {
                    alert('Marco actualizado exitosamente!');
                    document.getElementById('nombreMarcoEditar').focus();
                    cargarTodo();
                } else {
                    // Si hubo un error, mostrar un mensaje (opcional)
                    alert('Error al actualizar el marco.');
                }
            });

        // Aquí puedes llamar a una función para guardar los cambios (por ejemplo, en el backend o en un archivo JSON)
        console.log("Datos actualizados:", marco);
        
        // Cerrar el popup
        document.getElementById("popupEditarMarco").style.display = "none";
    };
    contenido.appendChild(buttonGuardar);

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.innerText = "Eliminar marco";
    btnEliminar.onclick = () => {
        if (confirm(`¿Estás seguro de eliminar el marco "${marco.nombre}"?`)) {
            try{
                let tipo = "marco"
                eliminarMarcaOModelo(tipo, id);
                alert("Marco Eliminado exitosamente")
                cargarTodo();
                document.getElementById("popupEditarMarco").style.display = "none";
            }catch(error){
                console.error(error);
            }
        }
    }
    contenido.appendChild(btnEliminar);

    // Botón para cerrar el popup
    const buttonCerrar = document.createElement("button");
    buttonCerrar.classList.add("btn", "btn-secondary");
    buttonCerrar.innerText = "Cancelar";
    buttonCerrar.onclick = () => {
        document.getElementById("popupEditarMarco").style.display = "none";
    };
    contenido.appendChild(buttonCerrar);
    document.getElementById(`nombreMarcoEditar`).focus();
}

cargarTodo();