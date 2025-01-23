async function cargarCristalesL(){
    try {
        cristales = await obtenerCristales(); // Función para obtener clientes de tu API
        botonesCristalesL(cristales);
    } catch (error) {
        alert("Error al cargar cristales");
    }
}

function botonesCristalesL(cristales){
    const divBotones = document.getElementById("cristalesBotonesL");
    divBotones.innerHTML = "";
    cristales.forEach(cristal => {
        const boton = document.createElement("button");
        boton.textContent = `${cristal.nombreCristal}`;
        boton.dataset.id = cristal.idCristal;
        boton.classList.add("btn", "blue-button" ,"big-btn");
        boton.addEventListener("click", () => {
            event.preventDefault();
            calcularConVariantesL(cristal.idCristal);
        });
        divBotones.appendChild(boton);
    });
}

function cleanCristalL(){
    document.getElementById("cilindroODL").value = "";
    document.getElementById("esferaODL").value = "";
    document.getElementById("cilindroOIL").value = "";
    document.getElementById("DPL").value = "";
    document.getElementById("esferaOIL").value = "";
    document.getElementById("ADDL").value = "";
    document.getElementById("ejeOIL").value = "";
    document.getElementById("ejeODL").value = "";
    document.getElementById("tablaVariantesCristalesL").style.display = "none";
    document.getElementById("cristalesVariantesL").innerHTML = "";
    document.getElementById("esferaODL").focus();
}

function checkCristalesL(){
    let cilndroOD = parseFloat(document.getElementById("cilindroODL").value.trim());
    let esferaOD = parseFloat(document.getElementById("esferaODL").value.trim());
    let cilindroOI = parseFloat(document.getElementById("cilindroOIL").value.trim());
    let DP = parseFloat(document.getElementById("DPL").value.trim());
    let esferaOI = parseFloat(document.getElementById("esferaOIL").value.trim());
    let ADD = parseFloat(document.getElementById("ADDL").value.trim());
    let ejeOI = parseFloat(document.getElementById("ejeOIL").value.trim());
    let ejeOD = parseFloat(document.getElementById("ejeODL").value.trim());

    if(isNaN(cilndroOD) || isNaN(esferaOI) || isNaN(cilindroOI) || isNaN(esferaOD) || isNaN(DP) || isNaN(ADD) || isNaN(ejeOI) || isNaN(ejeOD)){
        alert("Debes ingresar todos los valores de los cristales");
        return false;
    }else{
        lenteGlobal = {
                cilindroOD: cilndroOD,
                esferaOD: esferaOD,
                cilindroOI: cilindroOI,
                DP: DP,
                esferaOI: esferaOI,
                ADD: ADD,
                ejeOI: ejeOI,
                ejeOD: ejeOD
        }
        return true;
    }
}

function checkVariantesL(){
    let variante = document.querySelector('input[name="seleccionarCristal"]:checked');
    if(variante === null){
        alert("Debes seleccionar una variante");
        return false;
    }else{
        return true;
    }
}

function calcularConVariantesL(id){
    const cristal = cristales.find(c => c.idCristal == id);
    let cilndroOD;
    let esferaOD;
    let cilindroOI;
    let esferaOI;
    if(checkCristalesL()){
        cilndroOD = parseFloat(document.getElementById("cilindroODL").value.trim());
        esferaOD = parseFloat(document.getElementById("esferaODL").value.trim());
        cilindroOI = parseFloat(document.getElementById("cilindroOIL").value.trim());
        esferaOI = parseFloat(document.getElementById("esferaOIL").value.trim());
    }else{
        return;
    }

    const cristalesVariantes = document.getElementById("cristalesVariantesL");
    cristalesVariantes.innerHTML = "";

    cristal.variantes.forEach(variante => {
        const trVairante = document.createElement("tr");
        trVairante.id = `${cristal.idCristal}-${variante.idVariante}`;
        const tdNombre = document.createElement("td");
        tdNombre.innerText = `${cristal.nombreCristal} + ${variante.nombreVariante}`;
        trVairante.appendChild(tdNombre);
        cristalesVariantes.appendChild(trVairante);
        const tdPrecio = document.createElement("td");

        let valorOD = precioVariantes(cristal.idCristal, variante.idVariante, cilndroOD, esferaOD);
        let valorOI = precioVariantes(cristal.idCristal, variante.idVariante, cilindroOI, esferaOI);
        let valor = valorOD + valorOI;

        tdPrecio.innerText = valor;
        trVairante.appendChild(tdPrecio);

        const tdSelect = document.createElement("td");
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "seleccionarCristal"; // Misma agrupación para todos los radios
        radioButton.value = `${cristal.idCristal}-${variante.idVariante}`;
        tdSelect.appendChild(radioButton);
        trVairante.appendChild(tdSelect);
    });
    document.getElementById("tablaVariantesCristalesL").style.display = "inline-table";
}

function precioVariantesL(idCristal, idVariante, cl, es) {
    const cristal = cristales.find(c => c.idCristal == idCristal);

    for (const cilindro of cristal.cilindros) {
        if (cilindro.cilindro >= cl) {
            for (const esfera of cilindro.esferas) {
                if (esfera.esfera >= es) {
                    for (const precio of esfera.precios) {
                        if (precio.idVariante == idVariante) {
                            return precio.precioLista;
                        }
                    }
                }
            }
        }
    }
    return 0; // Si no se encuentra ningún precio, retornar 0.
}

function checkGlass(){
    event.preventDefault();
    const seleccionado = document.querySelector('input[name="seleccionarCristal"]:checked');
    if(checkCristalesL && seleccionado){
        goToStep("addMarcoL");
    }else{
        alert("Debe completar los datos requeridos");
        document.getElementById("esferaODL").focus();
    }
}

function addMarcoL(){
    
}