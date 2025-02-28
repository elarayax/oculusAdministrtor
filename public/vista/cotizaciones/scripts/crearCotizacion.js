let empresa;
let clienteGlobal = null;
let marcoGlobal = null;
let lenteGlobal = null;
let totalGlobal = 0;
let logo;

cargarEmpresa();

function goToStep(step, aux) {
    event.preventDefault();

    // Limpia la clase 'actual-step' de todos los pasos
    const steps = document.querySelectorAll(".step");
    steps.forEach((el) => el.classList.remove("actual-step"));

    // Función para manejar la creación de la banderita
    function ensureBanderita(stepTarget, text) {
        let banderita = document.getElementById("banderita");
        if (!banderita) {
            document.getElementById("multipleSteps").innerHTML = 
                `<p id="banderita" onclick="goToStep('${stepTarget}', false)">${text}</p>`;
            return false;
        } else{
            return true;
        }
    }

    function ensureBanderita2(stepTarget, text) {
        let banderita = document.getElementById("banderita2");
        if (!banderita) {
            document.getElementById("multipleSteps2").innerHTML = 
                `<p id="banderita2" onclick="goToStep('${stepTarget}', false)">${text}</p>`;
            return false;
        } else{
            return true;
        }
    }

    if (step == "step1" && !aux) {
        clienteGlobal = null;
        document.getElementById(step).classList.add("actual-step");
        return;
    }

    if (step == "step3" && !aux) {
        
        document.getElementById(step).classList.add("actual-step");
        document.getElementById("esferaOD").focus();
        if(!ensureBanderita("step1", "Atrás")){
            clienteGlobal = null;
        }
        return;
    }

    if (step == "step2" && aux) {
        document.getElementById(step).classList.add("actual-step");
        clearClient();
        document.getElementById("nombreCliente").focus();
        return;
    }

    if (step == "step2" && !aux) {
        document.getElementById(step).classList.add("actual-step");
        document.getElementById("nombreCliente").focus();
        return;
    }

    if (step == "step3" && aux) {
        if (clienteGlobal != null) {
            document.getElementById(step).classList.add("actual-step");
            ensureBanderita("step2", "Atrás");
            document.getElementById("esferaOD").focus();
            return;
        } else {
            document.getElementById("step2").classList.add("actual-step");
            generarMensaje("yellow","Debe seleccionar un cliente");
            document.getElementById("nombreCliente").focus();
        }
    }

    if (step == "step4" && aux) {
        if (checkCristales() && checkVariantes()) {
            document.getElementById(step).classList.add("actual-step");
        }
    }

    if(step == "step4" && !aux){
        document.getElementById(step).classList.add("actual-step");
    }

    if(step == "step5" && aux){
        document.getElementById(step).classList.add("actual-step");
        cargarMarcos();
    }

    if(step == "step5" && !aux){
        document.getElementById(step).classList.add("actual-step");
    }

    if(step == "step6" && !aux){
        generarResumen();
        document.getElementById(step).classList.add("actual-step");
        ensureBanderita2("step4", "Atrás");
    }

    if(step == "step6" && aux){
        generarResumen();
        document.getElementById(step).classList.add("actual-step");
        ensureBanderita2("step5", "Atrás");
    }

    if(step == "step6"){
        if(clienteGlobal != null){
            const acciones = document.getElementById("accionesStep6");
            const btnWhatsapp = document.createElement("button");
            btnWhatsapp.classList.add("btn", "green-button");
            btnWhatsapp.textContent = "Enviar por WhatsApp";
            btnWhatsapp.onclick = enviarImagenGenerada;
            acciones.appendChild(btnWhatsapp);
        }
    }
}


function clearClient(){
    document.getElementById('nombreCliente').value = ""; // Nombre del cliente
    document.getElementById('rutCliente').value = ""; // Rut del cliente
    document.getElementById("telefonoCliente").value = "";
    document.getElementById("correoCliente").value = "";
    document.getElementById('nombreCliente').focus();
}

async function cargarEmpresa(){
    try{
        const empresas = await obtenerEmpresa();
        empresa = empresas;
    }catch(error){  
        console.log(error);
    }
}

let clientesArray = [];

window.onload = () => {
    document.getElementById("nombreCliente").focus();
};
    

// Cargar clientes desde la API al inicio
async function cargarClientes() {
    try {
        const clientes = await obtenerClientes(); // Función para obtener clientes de tu API
        clientesArray = clientes; 
    } catch (error) {
        generarMensaje("red","Error al cargar clientes");
    }
}

document.getElementById('nombreCliente').addEventListener('input', mostrarSugerencias);

function mostrarSugerencias(e) {
    const input = e.target.value.toLowerCase(); // Valor ingresado por el usuario
    const sugerenciasContainer = document.getElementById('sugerenciasCliente');
    sugerenciasContainer.innerHTML = ''; // Limpia sugerencias anteriores

    if (input.length === 0) return; // No mostrar sugerencias si el campo está vacío

    // Filtrar clientes que coincidan con el texto ingresado
    const sugerencias = clientesArray.filter(cliente =>
        cliente.nombre.toLowerCase().includes(input)
    );

    // Crear elementos de sugerencias
    sugerencias.forEach(cliente => {
        const sugerenciaDiv = document.createElement('div');
        sugerenciaDiv.classList.add('sugerencia');
        sugerenciaDiv.textContent = cliente.nombre; // Mostrar el nombre del cliente
        sugerenciaDiv.dataset.id = cliente.id; // Guardar el ID del cliente

        // Evento para seleccionar una sugerencia
        sugerenciaDiv.addEventListener('click', () => {
            seleccionarCliente(cliente); // Llenar los datos del cliente
            sugerenciasContainer.innerHTML = ''; // Limpiar las sugerencias
        });

        sugerenciasContainer.appendChild(sugerenciaDiv);
    });
}

// Función para seleccionar un cliente y llenar los datos en los campos
function seleccionarCliente(cliente) {
    // Rellenar los datos básicos del cliente
    document.getElementById('nombreCliente').value = cliente.nombre; // Nombre del cliente
    document.getElementById('rutCliente').value = cliente.rut; // Rut del cliente
    document.getElementById("telefonoCliente").value = cliente.telefono;
    document.getElementById("correoCliente").value = cliente.correo;

    clienteGlobal = {
        nombre: cliente.nombre,
        rut: cliente.rut,
        telefono: cliente.telefono,
        correo: cliente.correo
    }
}

// Cargar clientes al iniciar
cargarClientes();

let cristales = [];

cargarCristales();

async function cargarCristales(){
    try {
        cristales = await obtenerCristales(); // Función para obtener clientes de tu API
        botonesCristales(cristales);
    } catch (error) {
        generarMensaje("red","Error al cargar clientes");
    }
}

function botonesCristales(cristales){
    const divBotones = document.getElementById("cristalesBotones");
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
        generarMensaje("red","Debes ingresar todos los valores de los cristales");
        return false;
    }else{
        lenteGlobal = {
            cristales: {
                cilindroOD: cilndroOD,
                esferaOD: esferaOD,
                cilindroOI: cilindroOI,
                DP: DP,
                esferaOI: esferaOI,
                ADD: ADD,
                ejeOI: ejeOI,
                ejeOD: ejeOD
            }
        }
        return true;
    }
}

function checkVariantes(){
    let variante = document.querySelector('input[name="seleccionarCristal"]:checked');
    if(variante === null){
        generarMensaje("red","Debes seleccionar una variante");
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

cargarMarcos();

let marcas = [];
let modelos = [];

async function cargarMarcos(){
    try {
        const todo = await obtenerMarcasYModelos(); // Función para obtener clientes de tu API
        marcas = todo.marcas; 
        modelos = todo.modelos;
        console.log(marcas);
        selectMarcos(marcas);
    } catch (error) {
        generarMensaje("red","Error al cargar marcos");
    }
}

function selectMarcos(marcos) {
    const select = document.getElementById("selectMarco");
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
            option.value = modelo.precioLista;
            option.text = modelo.nombre;
            selectModelos.appendChild(option);
        }
    });
}

function generarResumen(){
    const contenidoResumen = document.getElementById("contenidoResumen");
    const cotizacionHTML = generarHTMLCotizacion();
    contenidoResumen.innerHTML = cotizacionHTML;
}

function mostrarModalPDF() {
    event.preventDefault();
    const modal = document.getElementById("modalPDF");
    const contenidoPDF = document.getElementById("contenidoPDF");
    
    // Genera el contenido de la cotización en HTML
    const cotizacionHTML = generarHTMLCotizacion();
    contenidoPDF.innerHTML = cotizacionHTML;

    modal.style.display = "block";
}

function cerrarModalPDF() {
    document.getElementById("modalPDF").style.display = "none";
}

function guardarCotizacion(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
    const cotizacion = obtenerDatosCotizacion(); // Implementa esta función según tu estructura
    guardarCotizacionEnBaseDeDatos(cotizacion); // Llama al backend o guarda localmente

    // Mostrar el mensaje después de 2 segundos
    setTimeout(() => {
        generarMensaje("green", "Cotización guardada con éxito");
        
        // Recargar la página 2 segundos después de mostrar el mensaje
        /*setTimeout(() => {
            location.reload();
        }, 2000);*/
    }, 2000);
}

function generarHTMLCotizacion() {
    // Aquí construyes la representación en HTML de la cotización
    const seleccionado = document.querySelector('input[name="seleccionarCristal"]:checked');

    const idCristal = seleccionado.value;
    const filaCristal = document.getElementById(idCristal);
    const nombreCristal = filaCristal.children[0].textContent || "Cristal";
    const precio = filaCristal.children[1].textContent || "0";

    const marca = document.getElementById("selectMarco");
    const modelo = document.getElementById("selectModelo");

    const nombreMarca = marca.options[marca.selectedIndex].text;  // Nombre de la marca
    const nombreModelo = modelo.options[modelo.selectedIndex].text; // Nombre del modelo
    let precioMarco = modelo.value;  // El value del modelo es el precio

    if(precioMarco == -1){
        precioMarco = 0;
    }

    const total = parseInt(precio) + parseInt(precioMarco);

    totalGlobal = parseInt(precio) + parseInt(precioMarco);

    let textoCLiente = "";

    if(clienteGlobal != null){
        textoCLiente = `
        <h2 class="text-center sd-8">Datos del cliente</h2>
        <div class="organizardor-datos-tabla">
            <p><b>Cliente:</b> ${document.getElementById("nombreCliente").value}</p>
            <p><b>RUT:</b> ${document.getElementById("rutCliente").value}</p>
        </div>
        <div class="organizardor-datos-tabla">
            <p><b>Teléfono:</b> ${document.getElementById("telefonoCliente").value}</p>
            <p><b>Correo:</b> ${document.getElementById("correoCliente").value}</p>
        </div>`;
    }

    let textoMarco = "";

    if(marca.value != -1){
        textoMarco = `
            <h2 class="text-center">Marco</h2>
                <table>
                    <tr>
                        <td><b>Marca:</b></td>
                        <td>${nombreMarca}</td>
                    </tr>
                    <tr>
                        <td><b>Modelo:</b></td>
                        <td>${nombreModelo}</td>
                    </tr>
                    <tr>
                        <td><b>Precio:</b></td>
                        <td>$${precioMarco}</td>
                    </tr>
            </table>
        `;
    }else{
        textoMarco = `
            <h2 class="text-center">Marco</h2>
            <p class="text-center">Lo trae el cliente</p>
        `;
    }

    return `
        <h1>Cotización</h1>
        <img src="http://localhost:3001/${logo}" class"sd-16" style="height:100px"id="logoOptica" alt="">
        <h2>Datos de la óptica</h2>
        <table id="tablaDatosOptica">
            <tr>
                <td>Nombre</td>
                <td id="nombreOptica">${empresa.nombre}</td>
                <td>Rut</td>
                <td>${empresa.rut}</td>
            </tr>
            <tr>
                <td>Telefono</td>
                <td>${empresa.telefono}</td>
                <td>Correo</td>
                <td id="correoOptica">${empresa.correo}</td>
            </tr>
            <tr>
                <td colspan="1">Dirección</td>
                <td colspan="3">${empresa.direccion}</td>
            </tr>
            </table>
        ${textoCLiente}
        <h2 class="text-center">Datos del lente</h2>
        <table>
            <tr>
                <td></td>
                <td>Esfera</td>
                <td>Cilindro</td>
                <td>Eje</td>
            </tr>
            <tr>
                <td>OD</td>
                <td>${document.getElementById("esferaOD").value}</td>
                <td>${document.getElementById("cilindroOD").value}</td>
                <td>${document.getElementById("ejeOD").value}</td>
            </tr>
            <tr>
                <td>OI</td>
                <td>${document.getElementById("esferaOI").value}</td>
                <td>${document.getElementById("cilindroOI").value}</td>
                <td>${document.getElementById("ejeOI").value}</td>
            </tr>
            <tr>
                <td>DP</td>
                <td>${document.getElementById("DP").value}</td>
            </tr>
            <tr>
                <td>ADD</td>
                <td>${document.getElementById("ADD").value}</td>
            </tr>
        </table>
        <h2 class="text-center">Cristal</h2>
        <table>
        <tr>
        <td><b>${nombreCristal} :</b></td>
        <td>$${precio}</td>
        </tr>
        </table>
        ${textoMarco}
        <table>
            <tr>
                <td><b>Total Cotización:</b></td>
                <td>$${total}</td>
            </tr>
        </table>
    `;
}

function generarImagenCotizacion() {
    event.preventDefault();
    
    const contenido = document.getElementById("contenidoResumen");
    console.log(contenido); // Verifica que el elemento existe y tiene contenido
    
    if (!contenido) {
        console.error("El elemento a capturar no existe.");
        return;
    }

    let nombre

    if(clienteGlobal != null){
        nombre = clienteGlobal.nombre
    }else{
        nombre = "anónimo";
    }

    html2canvas(contenido).then((canvas) => {
        const imagenURL = canvas.toDataURL("image/png");

        // Crear un enlace para descargar la imagen
        const link = document.createElement("a");
        link.href = imagenURL;
        link.download = `cotizacion${nombre}.png`;
        link.click();
    }).catch((error) => {
        console.error("Error al generar la imagen:", error);
        generarMensaje("red","Hubo un problema al generar la imagen. Inténtalo de nuevo.");
    });
}

function enviarImagenGenerada() {
    if(clienteGlobal == null){
        generarMensaje("red","no se puede enviar imagen, por que no hay un cliente registrado");
        return;
    }

    event.preventDefault();

    const contenido = document.getElementById("contenidoResumen");

    if (!contenido) {
        console.error("El elemento a capturar no existe.");
        return;
    }

    html2canvas(contenido)
        .then((canvas) => {
            const imagenBase64 = canvas.toDataURL("image/png"); // Genera la imagen en base64

            // Enviar la imagen al backend
            fetch('/send-whatsapp-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: `56${clienteGlobal.telefono}`, // Número de WhatsApp al que deseas enviar
                    image: imagenBase64,
                    caption: 'Aquí tienes tu cotización',
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    generarMensaje("green", 'Imagen enviada exitosamente por WhatsApp.');
                } else {
                    console.error('Error al enviar imagen:', data.error);
                     generarMensaje("red",'No se pudo enviar la imagen.');
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud al backend:', error);
                 generarMensaje("red",'Hubo un problema al enviar la imagen. Inténtalo de nuevo.');
            });
        })
        .catch((error) => {
            console.error("Error al generar la imagen:", error);
             generarMensaje("red","Hubo un problema al generar la imagen. Inténtalo de nuevo.");
        });
}

async function guardarCotización(){
    event.preventDefault();

    const marca = document.getElementById("selectMarco");
    const modelo = document.getElementById("selectModelo");

    if(marca.value != null){
        marcoGlobal = {
            marca: marca.value,
        }
        if(modelo.value != null){
            marcoGlobal = {
                marca: marca.value,
                modelo: modelo.options[modelo.selectedIndex].text,
            };
        }
    }

    const cotizacion = {
        cliente: clienteGlobal,
        cristales: lenteGlobal.cristales,
        marco: marcoGlobal,
        total: totalGlobal,
        fecha: new Date().toLocaleDateString()
    }

    try{
        await agregarCotizacion(cotizacion);
        setTimeout(() => {
            generarMensaje("green", "Cotización guardada con éxito");
            setTimeout(() => {
                location.reload();
            }, 2000);
        }, 1000);

    }catch(error){
        generarMensaje("red", "Fallo de conexión")
    }
}

getLogo();

async function getLogo(){
    try{
        const respuesta = await obtenerLogo();
        logo = respuesta;
    }catch(error){
        generarMensaje("red", "no se pudo obtener el logo");
    }
}