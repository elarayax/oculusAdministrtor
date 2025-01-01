let cristales;
let marcos;

async function cargarTodo(){
    cristales = await obtenerCristales();
    llenarDivCristales(cristales);
    marcos = await obtenerMarcasYModelos();
    llenarDivMarcos(marcos);
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

/*function agregarConvenio(){
    let convenio = {}

    const nombreConvenio = document.getElementById("nombreConvenio");
    if(nombreConvenio.value.length == 0|| nombreConvenio.value.trim() == 0){
        alert("Ingrese el nombre del convenio");
        return;
    }else{
        convenio.nombre = nombreConvenio.value;
    }

    const convenioActivo = document.getElementById("activoConvenio");
    convenio.activo = convenioActivo.checked;

    const descuentoConvenio = document.getElementById("descuentoConvenio");
    if(descuentoConvenio.value.length == 0|| descuentoConvenio.value.trim() == 0 || isNaN(parseFloat(descuentoConvenio.value))){
        alert("Ingrese el descuento del convenio");
        return;
    }else{
        convenio.descuento = parseFloat(descuentoConvenio.value);
    }

    let cristales = [];
    const cristalesConvenio = document.querySelectorAll("#cristales input[type='checkbox']");
    cristalesConvenio.forEach((cristal) => {
        if (cristal.checked) {
            const label = document.querySelector(`label[for="${cristal.id}"]`);
            let cris = {
                id: cristal.id,
                nombre: label.textContent,
                variantes: []
            }
            cristales.push(cris);
        }
    });

    convenio.cristales = cristales;

    if(cristales.length > 0){
        const varianteCristalConvenio = document.querySelectorAll("#variantesCristales input[type='checkbox']");
        let banderita = 0;
        varianteCristalConvenio.forEach((variante) => {
            if (variante.checked) {
                let idVariante = variante.id.split("-")[1];
                let idCristal = variante.id.split("-")[0];
                const label = document.querySelector(`label[for="${variante.id}"]`);
                let cris = cristales.find(c => c.id == idCristal);
                banderita += 1;
                if(cris){
                    cris.variantes.push({
                        id: idVariante,
                        nombre: label.textContent,
                        cilindros: []
                    });
                }
            }
        });
        if(banderita > 0){
            const cilindrosConvenio = document.querySelectorAll("#cilindrosVariantes input[type='checkbox']");
        }
    }

    let lentes = [];

    const divMarcas = document.querySelectorAll("#marca input[type='checkbox']");

    divMarcas.forEach(marca => {
        const label = document.querySelector(`label[for="${marca.id}"]`);
        const newId = marca.id.replace("check", "");
        if (marca.checked) {
            const marcass = {
                marca: label.textContent,
                id: newId,
                modelos: []
            }
            lentes.push(marcass);
        }
    });

    if (lentes.length > 0){
        const divModelos = document.querySelectorAll(`#modelo input[type='checkbox']`);
        divModelos.forEach(modelo => {
            const label = document.querySelector(`label[for="${modelo.id}"]`);
            const newId = modelo.id.replace("check-", "");
            const parts = newId.split("-");
            const idMarca = parts[0];
            const idModelo = parts[1];
            const modeloValue = label.textContent;

            const marca = lentes.find(m => m.id === idMarca);
            if (marca && modelo.checked) {
                // Agregar el modelo a la marca correspondiente
                marca.modelos.push({
                    idModel: idModelo,
                    modelo: modeloValue
                });
            }
        });
    }
    convenio.lentes = lentes;
    if(lentes.length == 0){
        convenio.general = true;
    }else{
        convenio.general = false;
    }
    console.log("convenio: ", convenio);
}*/

function agregarConvenio() {
    let convenio = {};

    // Validar y asignar nombre del convenio
    const nombreConvenio = document.getElementById("nombreConvenio").value.trim();
    if (!nombreConvenio) {
        alert("Ingrese el nombre del convenio");
        return;
    }
    convenio.nombre = nombreConvenio;

    // Asignar estado activo
    convenio.activo = document.getElementById("activoConvenio").checked;

    // Validar y asignar descuento
    const descuentoConvenio = document.getElementById("descuentoConvenio").value.trim();
    const descuento = parseFloat(descuentoConvenio);
    if (!descuentoConvenio || isNaN(descuento)) {
        alert("Ingrese un descuento válido para el convenio");
        return;
    }
    convenio.descuento = descuento;

    // Helper para procesar checkboxes
    const obtenerSeleccionados = (selector, extraPropsCallback) => {
        return Array.from(document.querySelectorAll(selector))
            .filter(checkbox => checkbox.checked)
            .map(checkbox => {
                const label = document.querySelector(`label[for="${checkbox.id}"]`);
                return {
                    id: checkbox.id,
                    nombre: label.textContent,
                    ...(extraPropsCallback ? extraPropsCallback(checkbox) : {})
                };
            });
    };

    // Procesar cristales y variantes
    convenio.cristales = obtenerSeleccionados("#cristales input[type='checkbox']");
    convenio.cristales.forEach(cristal => {
        cristal.variantes = obtenerSeleccionados(
            `#variantesCristales input[type='checkbox'][id^="${cristal.id}-"]`,
            variante => ({
                cilindros: obtenerSeleccionados(
                    `#cilindrosVariantes input[type='checkbox'][id^="${variante.id}-"]`,
                    esferas => ({
                        esferas: obtenerSeleccionados(
                            `#esferasCilindros input[type='checkbox'][id^="${esferas.id}-"]`,
                        )
                    })
                )
            })
        );
    });

    // Procesar lentes
    convenio.lentes = obtenerSeleccionados("#marca input[type='checkbox']", marca => ({
        modelos: obtenerSeleccionados(
            `#modelo input[type='checkbox'][id^="${marca.id.replace("check", "")}-"]`
        )
    }));

    // Establecer flag general
    convenio.general = convenio.lentes.length === 0;

    // Salida del convenio
    console.log("Convenio:", convenio);
}


cargarTodo();