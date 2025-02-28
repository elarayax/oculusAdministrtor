function modalStandarLista(textoTitulo, arrayObjetos, metodoBorrar, metodoEditar, refresh) {
    var modal = document.getElementById("modalStandarLista");
    var titulo = document.getElementById("tituloModalLista");
    var tablaBody = document.getElementById("tablaModalListaBody");

    // Mostrar el modal
    modal.style.display = "flex";
    titulo.innerText = textoTitulo;

    // Limpiar contenido anterior de la tabla
    tablaBody.innerHTML = "";

    if (arrayObjetos.length > 0) {
        // Obtener las claves del primer objeto y ocultar 'id'
        var headers = Object.keys(arrayObjetos[0]).filter(key => key !== "id");

        arrayObjetos.forEach((obj, index) => {
            let fila = document.createElement("tr");

            headers.forEach(key => {
                let celda = document.createElement("td");

                // Crear un input para editar valores
                let input = document.createElement("input");
                input.type = "text";
                input.value = obj[key];
                input.dataset.index = index;
                input.dataset.key = key;

                // Guardar cambios en el array local en tiempo real
                input.addEventListener("input", function () {
                    arrayObjetos[this.dataset.index][this.dataset.key] = this.value;
                });

                // Evento para enviar la actualización al servidor al perder el foco
                input.addEventListener("blur", async function () {
                    let id = arrayObjetos[this.dataset.index].id;
                    if (!id || !metodoEditar) return;

                    let datosActualizados = { [this.dataset.key]: this.value };

                    try {
                        const resultado = await metodoEditar(id, datosActualizados);
                        if (resultado) {
                            generarMensaje("green", "Cristal actualizado correctamente.");
                        } else {
                            generarMensaje("red", "Error al actualizar el cristal.");
                        }
                    } catch (error) {
                        generarMensaje("red", "Error en la actualización.");
                    }
                });

                celda.appendChild(input);
                fila.appendChild(celda);
            });

            // Botón de eliminación con confirmación
            let celdaEliminar = document.createElement("td");
            let btnEliminar = document.createElement("button");
            btnEliminar.innerText = "Eliminar";
            btnEliminar.classList.add("btn", "btn-danger")
            btnEliminar.style.cursor = "pointer";

            btnEliminar.addEventListener("click", function () {
                let id = obj.id;
                if (id && metodoBorrar) {
                    abrirModalEliminar(
                        obj.nombreCristal || "este elemento", 
                        "Cristal",
                        async () => await metodoBorrar(id),
                        () => {
                            arrayObjetos.splice(index, 1);
                            modalStandarLista(textoTitulo, arrayObjetos, metodoBorrar, metodoEditar, refresh);
                            refresh();
                        },
                        id
                    );
                } else {
                    generarMensaje("red", "No se puede eliminar sin ID.");
                }
            });

            celdaEliminar.appendChild(btnEliminar);
            fila.appendChild(celdaEliminar);
            tablaBody.appendChild(fila);
        });
    } else {
        // Si no hay datos, mostrar un mensaje
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.innerText = "No hay datos disponibles";
        celda.colSpan = 100;
        fila.appendChild(celda);
        tablaBody.appendChild(fila);
    }
}


function cerrarModalStandarLista() {
    document.getElementById("modalStandarLista").style.display = "none";
}

let impresoraSeleccionada = null;

function printModal(impresoras, contenido) {
    document.getElementById("modalPrinter").style.display = "flex";
    document.getElementById("modalPrinter").style.zIndex = 1000;

    let tablaImpresoras = document.getElementById("tablePrinters");
    tablaImpresoras.innerHTML = ''; // Limpiar la tabla antes de agregar las impresoras

    impresoras.forEach(impresora => {
        let fila = document.createElement("tr");

        // Crear una celda con el nombre de la impresora
        let celda = document.createElement("td");
        celda.innerText = impresora.nombre;
        fila.appendChild(celda);

        // Añadir un evento para seleccionar la impresora
        fila.addEventListener('click', () => {
            impresoraSeleccionada = impresora;
            // Resaltar la fila seleccionada
            let filas = tablaImpresoras.querySelectorAll('tr');
            filas.forEach(f => f.classList.remove('selected'));
            fila.classList.add('selected');
        });

        tablaImpresoras.appendChild(fila);
    });

    // Añadir un botón para imprimir
    let botonImprimir = document.createElement("button");
    botonImprimir.innerText = "Imprimir";
    botonImprimir.classList.add("btn", "btn-primary");
    botonImprimir.addEventListener('click', () => imprimirAhora(contenido));

    let modalFooter = document.getElementById("modalFooter");
    modalFooter.innerHTML = ''; // Limpiar el footer del modal antes de agregar el botón
    modalFooter.appendChild(botonImprimir);
}

function closePrintModal() {
    document.getElementById("modalPrinter").style.display = "none";
}

/// Función para imprimir
// Función para imprimir
async function imprimirAhora(contenido) {
    if (impresoraSeleccionada) {
        console.log("Imprimiendo en la impresora", impresoraSeleccionada.nombre);

        // Aquí generas el contenido del ticket
        let ticketData = {
            impresora: impresoraSeleccionada.nombre,  // Nombre de la impresora seleccionada
            contenido: contenido
        };

        try {
            // Llamamos a la función para imprimir el ticket
            const result = await imprimirTicket(ticketData);

            if (result) {
                generarMensaje("green", "Ticket impreso correctamente:", result.message);
                console.log(result.data);
            } else {
                generarMensaje("red", "No se pudo imprimir el ticket.");
            }
        } catch (error) {
            // Capturamos el error y mostramos el mensaje
            generarMensaje("red", `Error al imprimir: ${error.message}`);
            console.log(result.data);
        }
    } else {
        generarMensaje("red", "Por favor, selecciona una impresora.");
    }
}