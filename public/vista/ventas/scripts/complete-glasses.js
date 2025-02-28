async function cargarCristalesL(){
    document.getElementById("esferaODL").focus();
    try {
        cristales = await obtenerCristales(); // Función para obtener clientes de tu API
        botonesCristalesL(cristales);
    } catch (error) {
        generarMensaje("red","Error al cargar cristales");
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
    document.getElementById("ALTL").value = "";
    document.getElementById("tablaVariantesCristalesL").style.display = "none";
    document.getElementById("cristalesVariantesL").innerHTML = "";
    document.getElementById("esferaODL").focus();
    document.getElementById("tipoLenteL").value = "-1";
}

function checkCristalesL() {
    let cilndroOD = document.getElementById("cilindroODL").value.trim();
    let esferaOD = document.getElementById("esferaODL").value.trim();
    let cilindroOI = document.getElementById("cilindroOIL").value.trim();
    let DP = document.getElementById("DPL").value.trim();
    let esferaOI = document.getElementById("esferaOIL").value.trim();
    let ADD = document.getElementById("ADDL").value.trim();
    let ALT = document.getElementById("ALTL").value.trim();
    let ejeOI = document.getElementById("ejeOIL").value.trim();
    let ejeOD = document.getElementById("ejeODL").value.trim();
    let tipoLente = document.getElementById("tipoLenteL").value;

    // Validar que al menos un cilindro o un eje esté presente
    if ((cilndroOD === "" && esferaOD === "") && (cilindroOI === "" && esferaOI === "")) {
        generarMensaje("red", "Debes ingresar al menos un valor en cilindro y/o esfera.");
        return false;
    }

    // Validar que tipo de lente sea diferente de -1
    if (tipoLente == '-1') {
        generarMensaje("red", "Debes seleccionar un tipo de lente válido.");
        return false;
    }

    // Crear objeto con los valores ingresados
    lenteGlobal = {
        cilindroOD: cilndroOD || "-",
        esferaOD: esferaOD || '-',
        cilindroOI: cilindroOI || '-',
        DP: DP || '-',
        esferaOI: esferaOI || '-',
        ADD: ADD || '-',
        ejeOI: ejeOI || '-',
        ejeOD: ejeOD || '-',
        ALT: ALT || '-',
        tipoLente: tipoLente
    };

    return true;
}


function checkVariantesL(){
    let variante = document.querySelector('input[name="seleccionarCristal"]:checked');
    if(variante === null){
        generarMensaje("red" ,"Debes seleccionar una variante");
        return false;
    }else{
        return true;
    }
}

function limpiarNumero(valor) {
    // Eliminar espacios y convertir "," en "."
    valor = valor.trim().replace(",", ".");

    // Si el valor es vacío, devolver "-"
    if (valor === "") return "-";

    // Verificar si el valor tiene un signo + o -
    const tieneSigno = valor.startsWith("+") || valor.startsWith("-");

    // Extraer el signo si existe
    const signo = tieneSigno ? valor[0] : "";

    // Extraer el número sin el signo
    const numeroStr = tieneSigno ? valor.slice(1) : valor;

    // Convertir a número
    const numero = parseFloat(numeroStr);

    // Si no es un número válido, devolver "-"
    if (isNaN(numero)) return "-";

    // Retornar el número con el signo original o un signo + si es positivo
    return signo === "+" || signo === "" ? `+${numero}` : `${signo}${numero}`;
}

function calcularConVariantesL(id) {
    const cristal = cristales.find(c => c.idCristal == id);
    if (!cristal) {
        generarMensaje("red", "Cristal no encontrado.");
        return;
    }

    if (!checkCristalesL()) {
        return;
    }

    let cilindroODAux = document.getElementById("cilindroODL").value;
    // Crear variables temporales para los cálculos
    const cilindroOD = cilindroODAux;
    lenteGlobal.cilindroOD = cilindroOD;
    const esferaOD = document.getElementById("esferaODL").value.trim();
    lenteGlobal.esferaOD = esferaOD;
    lenteGlobal.ejeOD = document.getElementById("ejeODL").value.trim();

    const cilindroOI = document.getElementById("cilindroOIL").value.trim();
    lenteGlobal.cilindroOI = cilindroOI;
    const esferaOI = document.getElementById("esferaOIL").value.trim();
    lenteGlobal.esferaOI = esferaOI;
    lenteGlobal.ejeOI = document.getElementById("ejeOIL").value.trim();

    lenteGlobal.DP = document.getElementById("DPL").value.trim();
    lenteGlobal.ADD = document.getElementById("ADDL").value.trim();
    lenteGlobal.ALT = document.getElementById("ALTL").value.trim();


    // Limpiar la tabla antes de agregar nuevas variantes
    const cristalesVariantes = document.getElementById("cristalesVariantesL");
    cristalesVariantes.innerHTML = "";

    cristal.variantes.forEach(variante => {
        const trVariante = document.createElement("tr");
        trVariante.id = `${cristal.idCristal}-${variante.idVariante}`;

        // Celda para el nombre
        const tdNombre = document.createElement("td");
        tdNombre.innerText = `${cristal.nombreCristal} + ${variante.nombreVariante}`;
        trVariante.appendChild(tdNombre);

        // Calcular precios correctamente
        let valorOD = precioVariantes(cristal.idCristal, variante.idVariante, cilindroOD, esferaOD);
        let valorOI = precioVariantes(cristal.idCristal, variante.idVariante, cilindroOI, esferaOI);
        let valor = valorOD + valorOI;

        // Celda para el precio calculado
        const tdPrecio = document.createElement("td");
        tdPrecio.innerText = valor; // Formato con 2 decimales
        trVariante.appendChild(tdPrecio);

        // Celda para mostrar los valores corregidos
        /*const tdValores = document.createElement("td");
        tdValores.innerText = `OD: ${cilindroOD} / ${esferaOD} | ` + 
                              `OI: ${cilindroOI} / ${esferaOI}`;
        trVariante.appendChild(tdValores);*/

        // Celda para el radio button de selección
        const tdSelect = document.createElement("td");
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "seleccionarCristal";
        radioButton.value = `${cristal.idCristal}-${variante.idVariante}`;
        tdSelect.appendChild(radioButton);
        trVariante.appendChild(tdSelect);

        // Agregar la fila a la tabla
        cristalesVariantes.appendChild(trVariante);
    });

    // Mostrar la tabla
    document.getElementById("tablaVariantesCristalesL").style.display = "inline-table";
}

function precioVariantesL(idCristal, idVariante, cl, es) {
    const cristal = cristales.find(c => c.idCristal == idCristal);

    // Convertir cl y es a números para la comparación
    const cilindro = parseFloat(cl);
    const esfera = parseFloat(es);

    for (const cilindro of cristal.cilindros) {
        if (cilindro.cilindro >= cilindro) {
            for (const esfera of cilindro.esferas) {
                if (esfera.esfera >= esfera) {
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
        generarMensaje("red", "Debe completar los datos requeridos");
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
        generarMensaje("red", "Error al cargar marcos");
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
    const optionFirst = document.createElement("option");
    optionFirst.value = "-1";
    optionFirst.text = "Seleccione un modelo";
    optionFirst.disabled = true;
    optionFirst.selected = true;
    selectModelos.appendChild(optionFirst);

    const optionSecond = document.createElement("option");
    optionSecond.value = "otro";
    optionSecond.text = "otro (Escribir Modelo)";
    selectModelos.appendChild(optionSecond);

    modelos.forEach(modelo => {
        if(modelo.idMarca == marcaId){
            const option = document.createElement("option");
            option.value = modelo.id;
            option.text = modelo.nombre;
            selectModelos.appendChild(option);
        }
    });
}

let marcoNuevo = false;
let modeloNuevo = [];

function toggleModeloInput() {
    let selectModelo = document.getElementById("selectModeloL");
    let inputModelo = document.getElementById("inputModeloL");

    if (selectModelo.value === "otro") {
        inputModelo.classList.remove("non-display");
        inputModelo.focus(); // Colocar el cursor automáticamente
        marcoNuevo = true;
    } else {
        inputModelo.classList.add("non-display");
        marcoNuevo = false;
    }
}

/** logica de crear el lente completo */

async function createLente(){
    event.preventDefault();

    const select = document.getElementById("selectMarcoL");
    const selectModelo = document.getElementById("selectModeloL");
    const marcaId = select.value;
    const modeloId = selectModelo.value;



    if(marcaId != -1 && modeloId != -1){
        const marca = marcas.find(marca => marca.id == marcaId);
        let modelo;

        if(!marcoNuevo){
            modelo = modelos.find(modelo => modelo.id == modeloId);
        }else{
            let nombreModelo = document.getElementById("inputModeloL").value;

            if(nombreModelo.trim() === ""){
                generarMensaje("red","Debes ingresar el nombre del modelo");
                return null;
            }

            modelo = {
                nombre: nombreModelo,
                descripcion: "modelo generado desde venta",
                sku: generarSKU(marca.nombre, nombreModelo),
                idMarca: marca.id,
                stock: 100,
                precioLista: 0,
                precioVenta: 0,
            };

            agregandoModelo(modelo.nombre, modelo.descripcion, modelo.idMarca, modelo.stock, modelo.sku, modelo.precioCosto, modelo.precioLista);

        }        

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

        const [nombreCristalF, nombreVariante] = nombreCristal.split(" + ");

        let cristales = {
            nombre: `${nombreCristal} OD(${lenteGlobal.esferaOD} , ${lenteGlobal.cilindroOD}) OI (${lenteGlobal.esferaOI} , ${lenteGlobal.cilindroOI})`,
            precio: precio,
            cristalBase: nombreCristalF,
            variante: nombreVariante,
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

        generarMensaje("green","Lente agregado satisfactoriamente");

        goToStep("origin");
    }else{
        generarMensaje("red","Seleccione una marca y un modelo");
    }
}

function generarSKU(marca, modelo) {
    function formatearTexto(texto) {
        return texto.charAt(0).toUpperCase() + (texto.charAt(1) || "").toLowerCase();
    }

    let palabrasModelo = modelo.split(" ");
    let modeloSKU = palabrasModelo.slice(0, 3).map(formatearTexto).join(""); // Tomamos hasta 3 palabras

    let sku = formatearTexto(marca) + modeloSKU + "01";

    return sku;
}

async function agregandoModelo(nombre, descripcion, idMarca, stock, sku, precioCosto, precioLista){
    try{
        await agregarModelo(nombre, descripcion, idMarca, stock, sku, precioCosto, precioLista);
        generarMensaje("green","Modelo agregado satisfactoriamente");
    }catch(error){
        generarMensaje("red", "no se pudo agregar el modelo");
    }
}

async function cargarTiposDeLenteL(){
    try{
        let tipos = await obtenerTiposLente();
        let select = document.getElementById("tipoLenteL");
        select.innerHTML = "";
        let opcion = document.createElement("option");
        opcion.value = "-1";
        opcion.text = "Seleccione un tipo de lente";
        opcion.disabled = true;
        opcion.selected = true;
        select.appendChild(opcion);
        tipos.forEach(tipo => {
            let option = document.createElement("option");
            option.value = tipo.tipo;
            option.text = "Lente " + tipo.tipo;
            select.appendChild(option);
        });    
    }catch(error){
        generarMensaje("red", "error al cargar los tipos de lente")
    }
}