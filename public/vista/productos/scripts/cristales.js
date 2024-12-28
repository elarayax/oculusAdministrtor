cargarCristales();
let cristalesFull = [];

async function cargarCristales() {
    const cristales = await obtenerCristales(); // Obtén la lista completa de productos
    cristalesTotales = cristales;
    cristalesFull = cristales;
    loadCristals(cristalesFull);
}

function loadCristals(cristales){
    const divCristales  = document.getElementById("cristales");
    divCristales.innerHTML = "";
    const btnCristales = document.createElement("button");
    btnCristales.innerHTML = "Administrar cristales";
    btnCristales.classList.add("btn", "btn-primary");
    divCristales.appendChild(btnCristales);
    
    cristales.forEach(cristal => {
        const divCristal = document.createElement("div");
        divCristal.classList.add("listado-desplegable");
        const divContenidoCristal = document.createElement("div");
        divContenidoCristal.classList.add("listado-desplegable-contenido");

        const titulo = document.createElement("h2");
        titulo.innerHTML = cristal.nombreCristal;
        titulo.classList.add("toggle-cristal");

        titulo.addEventListener("click", () => {
            if(divContenidoCristal.classList.contains("active")){
                divContenidoCristal.classList.remove("active");
            }else{
                divContenidoCristal.classList.add("active");
            }
        });
        divCristal.appendChild(titulo);
        divCristales.appendChild(divCristal);

        

        // Crear un botón para agregar variante dentro de cada cristal
        const btnAgregarVariante = document.createElement("button");
        btnAgregarVariante.innerHTML = "Agregar Variante";
        btnAgregarVariante.classList.add("btn", "btn-secondary");
        btnAgregarVariante.addEventListener("click", () => {
            // Muestra el popup de agregar variante
            document.getElementById("popupAgregarVariante").style.display = "flex";
            // Guardamos el id del cristal al que se le quiere agregar la variante
            selectedCristalId = cristal.idCristal;
        });
        // Agregar el botón al DOM
        divContenidoCristal.appendChild(btnAgregarVariante);

        const btnAdministrarVariantes = document.createElement("button");
        btnAdministrarVariantes.innerHTML = "Administrar Variantes";
        btnAdministrarVariantes.classList.add("btn", "btn-secondary");
        btnAdministrarVariantes.addEventListener("click", () => {
            const divVariantes = document.getElementById("variantesCristales");
            divVariantes.innerHTML = "";
            divVariantes.style.display = "flex";
            const divVariantesPrimero = document.createElement("div");
            divVariantesPrimero.classList.add("popup-content");

            const listaVariantes = document.createElement("table");
            
            cristal.variantes.forEach(variante => {
                const liListaVariantes = document.createElement("tr");
                const nombreListaVariantes = document.createElement("td");
                const inputNombreVariante = document.createElement("input");
                inputNombreVariante.type = "text";
                inputNombreVariante.value = variante.nombreVariante;
                inputNombreVariante.disabled = true;
                const editarVariante = document.createElement("td");
                const btnEditarVariante = document.createElement("button");
                btnEditarVariante.innerHTML = "Editar";
                btnEditarVariante.classList.add("btn", "btn-secondary");
                btnEditarVariante.addEventListener("click", async () => {
                    if (inputNombreVariante.disabled) {
                        // Habilitar el campo de texto para edición
                        inputNombreVariante.disabled = false;
                        inputNombreVariante.focus();
                        btnEditarVariante.innerText = "Actualizar";
                        btnEditarVariante.classList.remove("btn-secondary");
                        btnEditarVariante.classList.add("btn-primary");
                    } else {
                        // Guardar los cambios de edición
                        const nuevoNombre = inputNombreVariante.value.trim();
                        if (nuevoNombre === "") {
                            alert("El nombre de la variante no puede estar vacío.");
                            inputNombreVariante.focus();
                            return;
                        }
                
                        try {
                            // Llamada al backend para actualizar el nombre de la variante
                            await actualizarVariante(cristal.idCristal, variante.idVariante, nuevoNombre);
                
                            // Actualizar la interfaz
                            variante.nombreVariante = nuevoNombre;
                            inputNombreVariante.disabled = true;
                            btnEditarVariante.innerText = "Editar";
                            btnEditarVariante.classList.remove("btn-primary");
                            btnEditarVariante.classList.add("btn-secondary");
                            alert("Variante actualizada con éxito.");
                            cargarCristales();

                        } catch (error) {
                            alert("Error al actualizar la variante: " + error.message);
                        }
                    }
                });

                const eliminarVariante = document.createElement("td");
                const btnEliminarVariante = document.createElement("button");
                btnEliminarVariante.innerHTML = "Eliminar";
                btnEliminarVariante.classList.add("btn", "btn-danger");
                btnEliminarVariante.onclick = () => eliminandoVariante(cristal.idCristal, variante.idVariante, variante.nombreVariante);
                nombreListaVariantes.appendChild(inputNombreVariante);
                editarVariante.appendChild(btnEditarVariante);
                eliminarVariante.appendChild(btnEliminarVariante);
                liListaVariantes.appendChild(nombreListaVariantes);
                liListaVariantes.appendChild(editarVariante);
                liListaVariantes.appendChild(eliminarVariante);
                listaVariantes.appendChild(liListaVariantes);
                
            });

            divVariantesPrimero.appendChild(listaVariantes);
            const buttonCerrar =  document.createElement("button");
            buttonCerrar.innerHTML = "Cerrar";
            buttonCerrar.classList.add("btn", "btn-secondary");
            buttonCerrar.id = "cerrarPopupVariantes";
            buttonCerrar.addEventListener("click", () => {
                document.getElementById("variantesCristales").style.display = "none";
            });
            divVariantesPrimero.appendChild(buttonCerrar);
            divVariantes.appendChild(divVariantesPrimero);
            // Muestra el popup de agregar variante
            document.getElementById("variantesCristales").style.display = "flex";

            // Guardamos el id del cristal al que se le quiere agregar la variante
            selectedCristalId = cristal.idCristal;
        });
        divContenidoCristal.appendChild(btnAdministrarVariantes);

        const btnAgregarCilindro = document.createElement("button");
        btnAgregarCilindro.innerHTML = "Agregar Cilindro";
        btnAgregarCilindro.classList.add("btn", "btn-secondary");
        btnAgregarCilindro.addEventListener("click", () =>{
            agregarCilindro(cristal.idCristal);
        });

        divContenidoCristal.appendChild(btnAgregarCilindro);

        cristal.cilindros.forEach(cilindros => {
            const divCilindro = document.createElement("div");
            divCilindro.classList.add("tablas-cilindros");
            const tituloCilindro = document.createElement("h3");
            tituloCilindro.innerHTML = `Cilindro ${cilindros.cilindro}`;
            divCilindro.appendChild(tituloCilindro);
            divContenidoCristal.appendChild(divCilindro);
            const contenidoCilindro = document.createElement("div");
            contenidoCilindro.classList.add("contenido-cilindro");
            tituloCilindro.addEventListener("click", () => {
                if(contenidoCilindro.classList.contains("active")){
                    contenidoCilindro.classList.remove("active");
                }else{
                    contenidoCilindro.classList.add("active");
                }
            });
            //divCristal
            const tablaValores = document.createElement("table");
            tablaValores.id = `${cristal.idCristal}-${cilindros.cilindro}`
            const thead = document.createElement("thead");
            const tr = document.createElement("tr");
            const thaux = document.createElement("th");
            tr.appendChild(thaux);
            cristal.variantes.forEach(variante => {
                const th = document.createElement("th");
                th.innerHTML = variante.nombreVariante;
                tr.appendChild(th);
            });
            thead.appendChild(tr);
            tablaValores.appendChild(thead);
            const tbody = document.createElement("tbody");
            cilindros.esferas.forEach(esfera =>{
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.innerHTML = `${esfera.esfera} - ${cilindros.cilindro}`;
                tr.appendChild(td);
                esfera.precios.forEach(precio => {
                    const td2 = document.createElement("td");
                    const label1 = document.createElement("label");
                    label1.innerHTML = `Precio Neto:`;
                    td2.appendChild(label1);
                    const input1 = document.createElement("input");
                    input1.type = "number";
                    input1.id = `neto-${cristal.idCristal}-${cilindros.cilindro}-${esfera.esfera}-${precio.idVariante}`;
                    input1.value = precio.precioNeto;
                    td2.appendChild(input1);
                    const br =  document.createElement("br");
                    td2.appendChild(br);
                    const label2 = document.createElement("label");
                    label2.innerHTML = `Precio Lista:`;
                    td2.appendChild(label2);
                    const input2 = document.createElement("input");
                    input2.type = "number";
                    input2.id = `lista-${cristal.idCristal}-${cilindros.cilindro}-${esfera.esfera}-${precio.idVariante}`;
                    input2.value = precio.precioLista;
                    td2.appendChild(input2);
                    /*td2.innerHTML = precio.precioNeto;
                    td2.innerHTML += precio.precioLista;*/
                    tr.appendChild(td2);
                });
                
                tbody.appendChild(tr);
            });
            tablaValores.appendChild(tbody);
            contenidoCilindro.appendChild(tablaValores);

            const btnAgregarEsfera = document.createElement("button");
            btnAgregarEsfera.innerHTML = "Agregar Esfera";
            btnAgregarEsfera.classList.add("btn", "btn-secondary");
            btnAgregarEsfera.addEventListener("click", async () => {
                const nuevaEsfera = await agregarEsfera(cristal.idCristal, cilindros.cilindro);
                cargarCristales()
            });

            contenidoCilindro.appendChild(btnAgregarEsfera);

            const btnGuardar = document.createElement("button");
            btnGuardar.innerHTML = "Guardar datos cilindro";
            btnGuardar.classList.add("btn");
            btnGuardar.classList.add("btn-primary");

            btnGuardar.addEventListener("click", async () => {
                let idTabla = `${cristal.idCristal}-${cilindros.cilindro}`;
                const esferasActualizadas = obtenerDatosEsferas(idTabla); // Función que recoge los datos actualizados de las esferas
                await guardarCilindro(cristal.idCristal, cilindros.cilindro, esferasActualizadas);
                alert("Datos guardados con exito")
                cargarCristales(); // Recargar la vista después de guardar
            });

            contenidoCilindro.appendChild(btnGuardar);
            divCilindro.appendChild(contenidoCilindro);
            divCristal.appendChild(divContenidoCristal);
        });
    });
    
    function obtenerDatosEsferas(idTabla) {
        const tabla = document.getElementById(idTabla);
        const precios = [];
    
        if (tabla) {
            // Recorremos las filas de la tabla (cada tamaño)
            tabla.querySelectorAll('tbody tr').forEach((fila) => {
                const celdas = fila.querySelectorAll('td'); // celdas de la fila
                const tamaño = celdas[0].textContent.trim(); // El tamaño "2 - 2", "4 - 2", etc.
                const esfera = parseInt(tamaño.split(' - ')[0]); // extraemos el valor de la esfera (ej. 2, 4, 6, 8, 10)
                const cilindro = parseInt(tamaño.split(' - ')[1]); // extraemos el valor del cilindro
    
                // Recorremos las celdas correspondientes a las variantes
                const preciosFila = [];
                celdas.forEach((celda, index) => {
                    if (index > 0) { // Ignoramos la primera celda que es el tamaño
                        const precioNetoInput = celda.querySelector('input[id^="neto"]');
                        const precioListaInput = celda.querySelector('input[id^="lista"]');
    
                        // Obtenemos los valores de los precios, con un valor predeterminado de 0 si está vacío
                        const precioNeto = parseFloat(precioNetoInput.value) || 0;
                        const precioLista = parseFloat(precioListaInput.value) || 0;
    
                        preciosFila.push({
                            idVariante: index, // 1 = Blanco, 2 = Antirreflejo, 3 = Polarizada
                            precioNeto: precioNeto,
                            precioLista: precioLista
                        });
                    }
                });
    
                // Almacenar los precios de cada fila con su esfera y cilindro correspondiente
                precios.push({
                    esfera: esfera,
                    precios: preciosFila
                });
            });
        }
    
        return precios;
    }  

    async function agregarCilindro(mineral){
        try{
            agregarCilindroBack(mineral);
        }catch(error){
            alert("no se pudo agregar cilindro");
        }
    }

    async function eliminandoVariante(idCristal, idVariante, nombreVariante) {
        const confirmacion = confirm(`¿Estás seguro de que deseas eliminar la variante "${nombreVariante}"?`);
        if (confirmacion) {
            try {
                const resultado = await eliminarVariante(idCristal, idVariante);
                if (resultado) {
                    console.log(`La variante "${nombreVariante}" fue eliminada exitosamente.`);
                    // Aquí puedes agregar lógica adicional, como actualizar la interfaz de usuario
                    cargarCristales();
                } else {
                    console.error('No se pudo eliminar la variante.');
                }
            } catch (error) {
                console.error('Ocurrió un error al intentar eliminar la variante:', error);
            }
        } else {
            console.log('Eliminación cancelada por el usuario.');
        }
    }
    
}

let selectedCristalId = null; // Variable para almacenar el id del cristal seleccionado

document.getElementById("guardarVarianteBtn").addEventListener("click", async () => {
    const nombreVariante = document.getElementById("nombreVariante").value;

    if (nombreVariante && selectedCristalId) {
        const nuevaVariante = {
            nombreVariante: nombreVariante
        };

        // Enviar la solicitud POST al backend para agregar la nueva variante
        const response = await fetch(`http://localhost:3001/api/cristales/${selectedCristalId}/variantes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaVariante)
        });

        if (response.ok) {
            alert('Variante agregada con éxito');
            cargarCristales(); // Recargar los cristales después de agregar la variante
            document.getElementById("popupAgregarVariante").style.display = "none"; // Cerrar el popup
        } else {
            alert('Error al agregar la variante');
        }
    } else {
        alert('Por favor, ingresa un nombre para la variante');
    }
});

// Función para cerrar el popup
document.getElementById("cerrarPopup").addEventListener("click", () => {
    document.getElementById("popupAgregarVariante").style.display = "none";
});

// Función para mostrar el formulario de agregar cristal
document.getElementById("btnAgregarCristal").addEventListener("click", () => {
    document.getElementById("popupAgregarCristal").style.display = "flex";
});

// Función para cerrar el formulario sin guardar
document.getElementById("cerrarPopupCristal").addEventListener("click", () => {
    document.getElementById("popupAgregarCristal").style.display = "none";
});

document.getElementById("guardarCristalBtn").addEventListener("click", async () => {
    const nombreCristal = document.getElementById("nombreCristal").value;

    if (nombreCristal.trim() === "") {
        alert("El nombre del cristal no puede estar vacío.");
        return;
    }

    try {
        // Llamada al backend para agregar el cristal
        const resultado = await agregarCristal({ nombreCristal });

        if (resultado) {
            alert("Cristal agregado exitosamente.");
            // Cerrar el popup
            document.getElementById("popupAgregarCristal").style.display = "none";
            // Recargar la lista de cristales
            cargarCristales();
        } else {
            alert("Hubo un error al agregar el cristal.");
        }
    } catch (error) {
        alert("Error al agregar el cristal: " + error.message);
    }
});



document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado");
    const toggles = document.querySelectorAll(".toggle-cristal");

    toggles.forEach(toggle => {
        console.log("Se encontró un toggle");
        toggle.addEventListener("click", () => {
            console.log("Toggle clickeado");
            const contenido = toggle.nextElementSibling;
            if (contenido) {
                contenido.classList.toggle("active");
                console.log("Clase activa alternada");
            } else {
                console.log("No se encontró el siguiente hermano");
            }
        });
    });
});
