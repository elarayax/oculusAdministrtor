function checkProductos() {
    const datosVenta = document.getElementById("datosVenta");
    const alertaVenta = document.getElementById("alertaVenta");
    const resumenVenta1 = document.getElementById("resumenVenta1");

    if (venta.productos.length > 0) {
        datosVenta.classList.remove("non-display");
        alertaVenta.classList.add("non-display");
        resumenVenta1.innerHTML = "";
        let total = 0;

        venta.productos.forEach((producto, index) => {
            const tr = document.createElement("tr");

            // Nombre del producto
            const tdNombre = document.createElement("td");
            tdNombre.textContent = producto.nombre;
            tr.appendChild(tdNombre);

            // Cantidad desactivada por defecto
            const tdCantidad = document.createElement("td");
            const inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.value = producto.cantidad;
            inputCantidad.min = 1; // Evitar cantidades negativas
            inputCantidad.disabled = true; // Desactivado por defecto
            tdCantidad.appendChild(inputCantidad);
            tr.appendChild(tdCantidad);

            // Precio
            const tdPrecio = document.createElement("td");
            tdPrecio.textContent = `$ ${(producto.cantidad * producto.precio).toFixed(2)}`;
            total += producto.cantidad * producto.precio;
            tr.appendChild(tdPrecio);

            // Botón Editar y Guardar
            const tdAcciones = document.createElement("td");
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn-secondary", "btn");

            const btnGuardar = document.createElement("button");
            btnGuardar.textContent = "Guardar";
            btnGuardar.classList.add("btn-primary", "btn");
            btnGuardar.style.display = "none"; // Oculto inicialmente

            // Acciones de editar
            btnEditar.addEventListener("click", (event) => {
                event.preventDefault();
                inputCantidad.disabled = false; // Activar el input
                btnEditar.style.display = "none"; // Ocultar botón Editar
                btnGuardar.style.display = "inline-block"; // Mostrar botón Guardar
            });

            // Acciones de guardar
            btnGuardar.addEventListener("click", (event) => {
                event.preventDefault();
                const nuevaCantidad = parseInt(inputCantidad.value, 10);
                if (nuevaCantidad > 0) {
                    // Actualizar cantidad en el array
                    producto.cantidad = nuevaCantidad;
                    // Actualizar tabla y totales
                    checkProductos();
                } else {
                    alert("La cantidad debe ser mayor a 0");
                    inputCantidad.value = producto.cantidad; // Restaurar valor previo
                }
            });

            tdAcciones.appendChild(btnEditar);
            tdAcciones.appendChild(btnGuardar);

            // Botón eliminar con confirmación
            const tdEliminar = document.createElement("td");
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("btn-danger", "btn");
            btnEliminar.addEventListener("click", (event) => {
                event.preventDefault();
                // Confirmación antes de eliminar
                const confirmar = confirm(`¿Estás seguro de que deseas eliminar "${producto.nombre}"?`);
                if (confirmar) {
                    // Eliminar el producto del array
                    venta.productos.splice(index, 1);
                    // Actualizar tabla y totales
                    checkProductos();
                }
            });
            tdAcciones.appendChild(btnEliminar);
            tr.appendChild(tdAcciones);

            resumenVenta1.appendChild(tr);
        });

        venta.total = total;

        document.getElementById("totalVentaResumen").innerText = `$ ${total.toFixed(2)}`;
    } else {
        datosVenta.classList.add("non-display");
        alertaVenta.classList.remove("non-display");
    }
}



function addRandomProduct(){
    event.preventDefault();
    const nombre = document.getElementById("nameRandomProduct").value;
    const precio = parseInt(document.getElementById("priceRandomProduct").value);
    const cantidad = parseFloat(document.getElementById("quantityRandomProduct").value);

    if(nombre == "" || precio <= 0 || cantidad <= 0){
        alert("Ingrese los datos del producto");
        return;
    }

    let producto = {
        nombre: nombre,
        precio: precio,
        cantidad: cantidad,
        tipo: "random"
    }

    venta.productos.push(producto);

    alert("Producto agregado satisfactoriamente");

    clearRandom();

    goToStep("origin");
}

function clearRandom(){
    document.getElementById("nameRandomProduct").value = "";
    document.getElementById("priceRandomProduct").value = "";
    document.getElementById("quantityRandomProduct").value = 1;
}

/* Sección de llamado de los marcos */

let marcas = [];
let modelos = [];

async function cargarMarcos(){
    try {
        const todo = await obtenerMarcasYModelos(); // Función para obtener clientes de tu API
        marcas = todo.marcas; 
        modelos = todo.modelos;
        selectMarcos(marcas);
    } catch (error) {
        alert("Error al cargar marcos");
    }
}

function selectMarcos(marcos) {
    const select = document.getElementById("selectMarco");
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
            actualizarModelos(marcaId); // Actualiza el segundo select
        }
    });
}

function actualizarModelos(marcaId){
    const selectModelos = document.getElementById("selectModelo");
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

function addMarco(){
    event.preventDefault();
    const select = document.getElementById("selectMarco");
    const selectModelo = document.getElementById("selectModelo");
    const marcaId = select.value;
    const modeloId = selectModelo.value;
    if(marcaId != -1 && modeloId != -1){
        const marca = marcas.find(marca => marca.id == marcaId);
        const modelo = modelos.find(modelo => modelo.id == modeloId);

        console.log(marca);
        console.log(modelo);

        let producto = {
            nombre: `${marca.nombre} ${modelo.nombre}`,
            precio: modelo.precioLista,
            cantidad: 1,
            marca: marca,
            modelo: modelo,
            tipo: "marco"
        };
        
        let existente = venta.productos.find(
            p => p.marca?.id === marca.id && p.modelo?.id === modelo.id && p.tipo === "marco"
        );
        
        
        if (existente) {
            existente.cantidad += 1;
        } else {
            venta.productos.push(producto);
        }
        
        marcas = [];
        modelos = [];

        alert("Producto agregado satisfactoriamente");

        goToStep("origin");
    }else{
        alert("Seleccione una marca y un modelo");
    }
}

/*Lógica cristales*/

let cristales = [];

async function cargarCristales(){
    try {
        cristales = await obtenerCristales(); // Función para obtener clientes de tu API
        botonesCristales(cristales);
    } catch (error) {
        alert("Error al cargar cristales");
    }
}

function botonesCristales(cristales){
    const divBotones = document.getElementById("cristalesBotones");
    divBotones.innerHTML = "";
    cristales.forEach(cristal => {
        const boton = document.createElement("button");
        boton.textContent = `${cristal.nombreCristal}`;
        boton.dataset.id = cristal.idCristal;
        boton.classList.add("btn", "blue-button" ,"big-btn");
        boton.addEventListener("click", () => {
            event.preventDefault();
            calcularConVariantes(cristal.idCristal);
        });
        divBotones.appendChild(boton);
    });
}

let lenteGlobal;

function cleanCristal(){
    document.getElementById("cilindroOD").value = "";
    document.getElementById("esferaOD").value = "";
    document.getElementById("cilindroOI").value = "";
    document.getElementById("DP").value = "";
    document.getElementById("esferaOI").value = "";
    document.getElementById("ADD").value = "";
    document.getElementById("ejeOI").value = "";
    document.getElementById("ejeOD").value = "";
    document.getElementById("tablaVariantesCristales").style.display = "none";
    document.getElementById("cristalesVariantes").innerHTML = "";
    document.getElementById("esferaOD").focus();
}

function checkCristales(){
    let cilndroOD = parseFloat(document.getElementById("cilindroOD").value.trim());
    let esferaOD = parseFloat(document.getElementById("esferaOD").value.trim());
    let cilindroOI = parseFloat(document.getElementById("cilindroOI").value.trim());
    let DP = parseFloat(document.getElementById("DP").value.trim());
    let esferaOI = parseFloat(document.getElementById("esferaOI").value.trim());
    let ADD = parseFloat(document.getElementById("ADD").value.trim());
    let ejeOI = parseFloat(document.getElementById("ejeOI").value.trim());
    let ejeOD = parseFloat(document.getElementById("ejeOD").value.trim());

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

function checkVariantes(){
    let variante = document.querySelector('input[name="seleccionarCristal"]:checked');
    if(variante === null){
        alert("Debes seleccionar una variante");
        return false;
    }else{
        return true;
    }
}

function calcularConVariantes(id){
    const cristal = cristales.find(c => c.idCristal == id);
    let cilndroOD;
    let esferaOD;
    let cilindroOI;
    let esferaOI;
    if(checkCristales()){
        cilndroOD = parseFloat(document.getElementById("cilindroOD").value.trim());
        esferaOD = parseFloat(document.getElementById("esferaOD").value.trim());
        cilindroOI = parseFloat(document.getElementById("cilindroOI").value.trim());
        esferaOI = parseFloat(document.getElementById("esferaOI").value.trim());
    }else{
        return;
    }

    const cristalesVariantes = document.getElementById("cristalesVariantes");
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
    document.getElementById("tablaVariantesCristales").style.display = "inline-table";
}

function precioVariantes(idCristal, idVariante, cl, es) {
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

function addCristal(){
    if(checkCristales()){
        const seleccionado = document.querySelector('input[name="seleccionarCristal"]:checked');

        const idCristal = seleccionado.value;
        const filaCristal = document.getElementById(idCristal);
        const nombreCristal = filaCristal.children[0].textContent || "Cristal";
        const precio = filaCristal.children[1].textContent || "0";

        let product = {
            nombre: nombreCristal,
            precio: precio,
            cantidad: 1,
            tipo: "cristales",
            cristales: lenteGlobal,
        }

        venta.productos.push(product);

        alert("Cristales agregados satisfactoriamente");

        lenteGlobal = {};

        cristales = [];
        
        goToStep("origin");
    }
}