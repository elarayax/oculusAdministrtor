let cristales;
let marcos;
let convenios;

async function cargarTodo(){
    cristales = await obtenerCristales();
    llenarDivCristales(cristales);
    marcos = await obtenerMarcasYModelos();
    llenarDivMarcos(marcos);
    convenios = await obtenerConvenios();
    llenarDivConvenios(convenios);
}

function llenarDivCristales(cristales) {
    let divCristales = document.getElementById("cristales");
    divCristales.innerHTML = "";

    // Checkbox para seleccionar todos

    const divCheckAll = document.createElement("div");
    divCheckAll.classList.add("check-div" , "sd-4");
    const checkAll = document.createElement("input");
    checkAll.type = "checkbox";
    checkAll.id = "checkAll";
    checkAll.onclick = function () {
        let checked = checkAll.checked;
        let checkboxes = divCristales.querySelectorAll("input[type='checkbox']:not(#checkAll)");
        
        // Actualizar todos los checkboxes de cristales
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = checked;
            if (checked) {
                llenarVariantesCristales(checkbox.id);
            } else {
                quitarVariantesCristales(checkbox.id);
            }
        });
    };
    divCheckAll.appendChild(checkAll);

    const labelAll = document.createElement("label");
    labelAll.textContent = "Seleccionar todos";
    labelAll.htmlFor = "checkAll";
    divCheckAll.appendChild(labelAll);
    divCristales.appendChild(divCheckAll);

    // Agregar checkboxes individuales para cada cristal
    cristales.forEach(cristal => {
        const divCheck = document.createElement("div");
        divCheck.classList.add("check-div", "sd-4");
        const checkBoxCristal = document.createElement("input");
        checkBoxCristal.type = "checkbox";
        checkBoxCristal.id = cristal.idCristal;
        checkBoxCristal.onclick = function () {
            let checked = checkBoxCristal.checked;
            if (checked) {
                llenarVariantesCristales(cristal.idCristal);
            } else {
                quitarVariantesCristales(cristal.idCristal);
            }

            // Verificar si todos los checkboxes están marcados/desmarcados
            checkAll.checked = Array.from(divCristales.querySelectorAll("input[type='checkbox']:not(#checkAll)"))
                .every(checkbox => checkbox.checked);
        };

        const labelCristal = document.createElement("label");
        labelCristal.textContent = cristal.nombreCristal;
        labelCristal.htmlFor = cristal.idCristal;

        divCheck.appendChild(checkBoxCristal);
        divCheck.appendChild(labelCristal);
        divCristales.appendChild(divCheck);
    });
}

function llenarDivMarcos(marcoss){
    let divMarcos = document.getElementById("marca");
    divMarcos.innerHTML = "";
    marcoss.marcas.forEach(marco => {
        const divCheck = document.createElement("div");
        divCheck.classList.add("check-div", "sd-4");
        const checkBoxMarco = document.createElement("input");
        checkBoxMarco.type = "checkbox";
        checkBoxMarco.id = "check" + marco.id;
        checkBoxMarco.onclick = function () {
            let checked = checkBoxMarco.checked;
            if (checked) {
                llenarVariantesMarcos(marco.id);
            } else {
                quitarVariantesMarcos(marco.id);
            }
        };
        const labelMarco = document.createElement("label");
        labelMarco.textContent = marco.nombre;
        labelMarco.htmlFor = "check" + marco.id;
        divCheck.appendChild(checkBoxMarco);
        divCheck.appendChild(labelMarco);
        divMarcos.appendChild(divCheck);
    });
}

function llenarVariantesMarcos(id){
    let divVariantes = document.getElementById("modelo");
    
    let modelos = marcos.modelos.filter(e => e.idMarca == id);

    const divModelos = document.createElement("div");
    divModelos.id = `modelos-${id}`;

    modelos.forEach(e => {
        const divCheck = document.createElement("div");
        divCheck.classList.add("check-div", "sd-4");

        const labelModelo = document.createElement("label");
        labelModelo.textContent = e.nombre;
        labelModelo.htmlFor = `check-${id}-${e.id}`;
        divCheck.appendChild(labelModelo);

        const checkBoxModelo = document.createElement("input");
        checkBoxModelo.type = "checkbox";
        checkBoxModelo.id = `check-${id}-${e.id}`;
        divCheck.appendChild(checkBoxModelo);
        
        divVariantes.appendChild(divCheck);
    });

    //divVariantes.appendChild(divModelos);

}

function quitarVariantesMarcos(id){
    let divVariantes = document.getElementById(`modelos-${id}`);
    if(divVariantes){
        divVariantes.remove();
    }
}

function llenarVariantesCristales(id){
    let divVariantes = document.getElementById("variantesCristales");
    let cristal = cristales.filter(e=> e.idCristal == id);
    const divContenedor = document.createElement("div");
    divContenedor.id = `variantesCristales${id}`;
    const nombre = document.createElement("h3");
    nombre.textContent = cristal[0].nombreCristal;
    divContenedor.appendChild(nombre);
    cristal[0].variantes.forEach(variante => {
        let divVariante = document.createElement("div");
        divVariante.classList.add ("check-div", "sd-4");
        const checkBoxVariante = document.createElement("input");
        checkBoxVariante.type = "checkbox";
        checkBoxVariante.id = `${id}-${variante.idVariante}`;
        checkBoxVariante.onclick = function () {
            let checked = checkBoxVariante.checked;
            if (checked) {
                mostrarCilindros(id,variante.idVariante, variante.nombreVariante);
            }else{
                quitarCilindros(id,variante.idVariante);
            }
        }
        const labelVariante = document.createElement("label");
        labelVariante.id = `${id}-${variante.idVariante}-label`;
        labelVariante.textContent = variante.nombreVariante;
        labelVariante.htmlFor = `${id}-${variante.idVariante}`;
        divVariante.appendChild(labelVariante);
        divVariante.appendChild(checkBoxVariante);
        divContenedor.appendChild(divVariante);
    });
    divVariantes.appendChild(divContenedor);
}

function quitarVariantesCristales(id){
    document.getElementById(`variantesCristales${id}`).remove();
}

function mostrarCilindros(id, idVariante, nombreVariante) {
    const divCilindros = document.getElementById("cilindrosVariantes");

    // Limpiar los cilindros previamente mostrados para esta combinación
    let existingDiv = document.getElementById(`cilindros${id}-${idVariante}`);
    if (existingDiv) {
        existingDiv.remove();
    }

    // Buscar el cristal y sus cilindros
    let cristal = cristales.find(c => c.idCristal == id);
    if (!cristal || !cristal.cilindros) return;

    // Crear contenedor para los cilindros
    const divContenedor = document.createElement("div");
    divContenedor.id = `cilindros${id}-${idVariante}`;
    divContenedor.classList.add("cilindros-div", "sd-8");

    const titulo = document.createElement("h4");
    titulo.textContent = `${cristal.nombreCristal} - ${nombreVariante}`;
    titulo.classList.add("text-center", "sd-8")
    divContenedor.appendChild(titulo);

    // Recorrer y mostrar los cilindros
    cristal.cilindros.forEach(cilindro => {
        const divCilindro = document.createElement("div");
        divCilindro.className = "cilindro-div";

        let divCilindroCheck = document.createElement("div");
        divCilindroCheck.classList.add ("check-div", "sd-4");

        const checkCilindro = document.createElement("input");
        checkCilindro.type = "checkbox";
        checkCilindro.id = `${id}-${idVariante}-${cilindro.cilindro}`;
        checkCilindro.name = `cilindros[${id}-${idVariante}]`;
        checkCilindro.value = cilindro.idCilindro;
        divCilindroCheck.appendChild(checkCilindro);

        checkCilindro.onclick = function () {
            let checked = checkCilindro.checked;
            if (checked) {
                mostrarEsferas(id, idVariante, cilindro.cilindro, nombreVariante);
            }else{
                quitarEsferas(id, idVariante, cilindro.cilindro);
            }
        }

        const labelCilindro = document.createElement("label");
        labelCilindro.textContent = `Cilindro ${cilindro.cilindro}`;
        labelCilindro.htmlFor = `${id}-${idVariante}-${cilindro.cilindro}`;

        divCilindroCheck.appendChild(labelCilindro);

        divContenedor.appendChild(divCilindroCheck);
    });

    // Agregar el contenedor al DOM
    divCilindros.appendChild(divContenedor);
}

function quitarCilindros(id, idVariante) {
    let divCilindros = document.getElementById(`cilindros${id}-${idVariante}`);
    if (divCilindros) {
        divCilindros.remove();
    }
}

function mostrarEsferas(id, idVariante, cilindro, nombreVariante){
    const divEsferas = document.getElementById("esferasCilindros");
    let existingDiv = document.getElementById(`esfera${id}-${idVariante}-${cilindro}`);
    if (existingDiv) {
        existingDiv.remove();
    }

    let esferas = [];

    let cristal = cristales.find(c => c.idCristal == id);
    if (!cristal || !cristal.cilindros) return;

    cristal.cilindros.forEach(e => {
        if(e.cilindro == cilindro){
            esferas = e.esferas;
        }
    });

    const divContainerEsfera = document.createElement("div");
    divContainerEsfera.id = `esfera${id}-${idVariante}-${cilindro}`;

    const titulo = document.createElement("h4");
    titulo.textContent = `${cristal.nombreCristal} - ${nombreVariante} - ${cilindro}`;
    titulo.classList.add("text-center");

    divContainerEsfera.appendChild(titulo);

    esferas.forEach(esfera => {
        let divEsferaCheck = document.createElement("div");
        divEsferaCheck.classList.add ("check-div", "sd-4");

        const labelEsfera = document.createElement("label");
        labelEsfera.textContent = `Esfera ${esfera.esfera}`;
        labelEsfera.htmlFor = `esfera${id}-${idVariante}-${cilindro}-${esfera.esfera}`;

        divEsferaCheck.appendChild(labelEsfera);

        const checkEsferas = document.createElement("input");
        checkEsferas.type = "checkbox";
        checkEsferas.id = `esfera${id}-${idVariante}-${cilindro}-${esfera.esfera}`;
        checkEsferas.name = `esfera${id}-${idVariante}-${cilindro}-${esfera.esfera}`;
        checkEsferas.value = `esfera${id}-${idVariante}-${cilindro}-${esfera.esfera}`;
        
        divEsferaCheck.appendChild(checkEsferas);

        divContainerEsfera.appendChild(divEsferaCheck);
    });

    divEsferas.appendChild(divContainerEsfera);
}

function quitarEsferas(id, idVariante, cilindro) {
    let divEsferas = document.getElementById(`esfera${id}-${idVariante}-${cilindro}`);
    if (divEsferas) {
        divEsferas.remove();
    }
}

function textoConvenio(){
    const valor = document.getElementById("activoConvenio");
    if (valor.checked) {
        document.getElementById("cambiarTexto").innerText = "Si";
    } else {
        document.getElementById("cambiarTexto").innerText = "No";
    }
}

async function addConvenio() {
    let convenio = {};

    // Validar y asignar nombre del convenio
    const nombreConvenio = document.getElementById("nombreConvenio")?.value.trim();
    if (!nombreConvenio) {
        alert("Ingrese el nombre del convenio");
        return;
    }
    convenio.nombre = nombreConvenio;

    // Asignar estado activo
    convenio.activo = document.getElementById("activoConvenio")?.checked || false;

    // Validar y asignar descuento
    const descuentoConvenio = document.getElementById("descuentoConvenio")?.value.trim();
    const descuento = parseFloat(descuentoConvenio);
    if (!descuentoConvenio || isNaN(descuento)) {
        alert("Ingrese un descuento válido para el convenio");
        return;
    }
    convenio.descuento = descuento;

    // Helper para procesar checkboxes de forma segura
    const obtenerSeleccionados = (selector, extraPropsCallback) => {
        const checkboxes = document.querySelectorAll(selector);
        if (!checkboxes.length) return []; // No checkboxes disponibles

        return Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => {
                const label = document.querySelector(`label[for="${checkbox.id}"]`);
                const baseData = {
                    id: checkbox.id,
                    nombre: label ? label.textContent.trim() : "Sin nombre",
                };
                return extraPropsCallback ? { ...baseData, ...extraPropsCallback(checkbox) } : baseData;
            });
    };

    // Procesar cristales (solo si existen)
    convenio.cristales = obtenerSeleccionados("#cristales input[type='checkbox']", cristal => ({
        variantes: obtenerSeleccionados(
            `#variantesCristales input[type='checkbox'][id^="${cristal.id}-"]`,
            variante => ({
                cilindros: obtenerSeleccionados(
                    `#cilindrosVariantes input[type='checkbox'][id^="${variante.id}-"]`,
                    cilindro => ({
                        esferas: obtenerSeleccionados(
                            `#esferasCilindros input[type='checkbox'][id^="${cilindro.id}-"]`
                        ),
                    })
                ),
            })
        ),
    }));

    // Procesar lentes (solo si existen)
    convenio.lentes = obtenerSeleccionados("#marca input[type='checkbox']", marca => ({
        modelos: obtenerSeleccionados(
            `#modelo input[type='checkbox'][id^="${marca.id.replace("check", "")}-"]`
        ),
    }));

    // Establecer flag general
    convenio.general = convenio.lentes.length === 0 && convenio.cristales.length === 0;

    // Intentar guardar el convenio
    try {
        await agregarConvenio(convenio); // Llama a tu función de backend
        alert("Convenio agregado correctamente");
        cargarTodo();
    } catch (error) {
        console.error("Error al agregar convenio:", error);
        alert("No se pudo agregar convenio");
    }

    // Mostrar resultado final
    console.log("Convenio generado:", convenio);
}


cargarTodo();