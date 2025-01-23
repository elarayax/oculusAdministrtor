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

function bridgeCristal(){
    event.preventDefault();
    document.getElementById("addLente").classList.add("actual-step");
    document.getElementById("addMarcoL").classList.remove("actual-step");
}

/** logica de los marcos */

async function cargarMarcosL(){
    try {
        const todo = await obtenerMarcasYModelos(); // Función para obtener clientes de tu API
        marcas = todo.marcas; 
        modelos = todo.modelos;
        selectMarcosL(marcas);
    } catch (error) {
        alert("Error al cargar marcos");
    }
}

function selectMarcosL(marcos) {
    const select = document.getElementById("selectMarcoL");
    select.innerHTML = "";
    const optionFirst = document.createElement("option");
    optionFirst.value = "-1";
    optionFirst.text = "Seleccione un marco";
    select.appendChild(optionFirst);

    marcos.forEach(marco => {
        const option = document.createElement("option");
        option.value = marco.id;
        option.text = marco.nombre;
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        if(e.target.value != -1){
            const marcaId = e.target.value; // Obtén el ID de la marca seleccionada
            actualizarModelosL(marcaId); // Actualiza el segundo select
        }
    });
}

function actualizarModelosL(marcaId){
    const selectModelos = document.getElementById("selectModeloL");
    selectModelos.innerHTML = "";
    modelos.forEach(modelo => {
        if(modelo.idMarca == marcaId){
            const option = document.createElement("option");
            option.value = modelo.id;
            option.text = modelo.nombre;
            selectModelos.appendChild(option);
        }
    });
}

/** logica de crear el lente completo */

function createLente(){
    event.preventDefault();

    const select = document.getElementById("selectMarcoL");
    const selectModelo = document.getElementById("selectModeloL");
    const marcaId = select.value;
    const modeloId = selectModelo.value;
    if(marcaId != -1 && modeloId != -1){
        const marca = marcas.find(marca => marca.id == marcaId);
        const modelo = modelos.find(modelo => modelo.id == modeloId);

        let marco = {
            nombre: `${marca.nombre} ${modelo.nombre}`,
            precio: modelo.precioLista,
            cantidad: 1,
            marca: marca,
            modelo: modelo,
            tipo: "marco"
        };

        const seleccionado = document.querySelector('input[name="seleccionarCristal"]:checked');

        const idCristal = seleccionado.value;
        const filaCristal = document.getElementById(idCristal);
        const nombreCristal = filaCristal.children[0].textContent || "Cristal";
        const precio = filaCristal.children[1].textContent || "0";

        let cristales = {
            nombre: `${nombreCristal} OD(${lenteGlobal.esferaOD} , ${lenteGlobal.cilindroOD}) OI (${lenteGlobal.esferaOI} , ${lenteGlobal.cilindroOI})`,
            precio: precio,
            cantidad: 1,
            tipo: "cristales",
            cristales: lenteGlobal,
        }

        let producto = {
            nombre: `Cristales : ${cristales.nombre}, Marca Lente: ${marca.nombre}, Modelo Lente: ${modelo.nombre}`,
            precio: parseInt(precio) + parseInt(modelo.precioLista),
            cantidad: 1,
            tipo: "lente",
            cristales: cristales,
            marco: marco,
        }

        venta.productos.push(producto);
        
        marcas = [];
        modelos = [];

        lenteGlobal = {};

        cristales = [];

        cleanCristalL();

        alert("Lente agregado satisfactoriamente");

        goToStep("origin");
    }else{
        alert("Seleccione una marca y un modelo");
    }
}