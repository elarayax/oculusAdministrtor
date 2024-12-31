let cristales;

async function cargarTodo(){
    cristales = await obtenerCristales();
    llenarDivCristales(cristales);
}

function llenarDivCristales(cristales) {
    let divCristales = document.getElementById("cristales");
    divCristales.innerHTML = "";

    // Checkbox para seleccionar todos

    const divCheckAll = document.createElement("div");
    divCheckAll.classList.add("check-div");
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
        divCheck.className = "check-div";
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
        divVariante.className = "check-div";
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
    divContenedor.className = "cilindros-div";

    const titulo = document.createElement("h4");
    titulo.textContent = `Cilindros para Variante ${nombreVariante}`;
    divContenedor.appendChild(titulo);

    // Recorrer y mostrar los cilindros
    cristal.cilindros.forEach(cilindro => {
        const divCilindro = document.createElement("div");
        divCilindro.className = "cilindro-div";

        const nombreCilindro = document.createElement("p");
        nombreCilindro.textContent = `Cilindro: ${cilindro.cilindro}`;
        divCilindro.appendChild(nombreCilindro);

        divContenedor.appendChild(divCilindro);
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


cargarTodo();