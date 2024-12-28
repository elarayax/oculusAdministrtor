let clientesArray = [];
let unidadesMedida = [];

window.onload = () => {
    document.getElementById("nombreCliente").focus();
};
    

// Cargar clientes desde la API al inicio
async function cargarClientes() {
    try {
        const clientes = await obtenerClientes(); // Función para obtener clientes de tu API
        clientesArray = clientes; // Almacenar clientes en el array
        const unidades = await obtenerUnidadesMedida();
        unidadesMedida = unidades;
    } catch (error) {
        alert("Error al cargar clientes");
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
    document.getElementById('tipoCliente').value = cliente.tipo; // Tipo de cliente
    document.getElementById("telefonoCliente").value = cliente.telefono;
    document.getElementById("correoCliente").value = cliente.correo;
    document.getElementById("direccionCliente").value = cliente.direccion;

    // Verificar si es una empresa y tiene representantes
    const representanteContainer = document.getElementById("isEmpresa");
    const representanteSelect = document.getElementById("representanteCliente");
    const divRepresentante = document.getElementById("divRepresentante");
    if (cliente.tipo === "empresa" && cliente.representante?.length > 0) {
        representanteContainer.style.display = "contents"; // Mostrar el contenedor de representante
        representanteSelect.innerHTML = ''; // Limpiar opciones previas
        divRepresentante.style.display = "contents";
        
        // Agregar representantes al select
        cliente.representante.forEach(representante => {
            const option = document.createElement('option');
            option.value = representante.rut;
            option.textContent = representante.nombre;
            representanteSelect.appendChild(option);
        });

        // Llenar datos del primer representante por defecto (si aplica)
        llenarDatosRepresentante(cliente.representante[0]);

        // Manejar el cambio de selección
        representanteSelect.addEventListener('change', (event) => {
            const selectedRut = event.target.value;
            const selectedRepresentante = cliente.representante.find(rep => rep.rut === selectedRut);
            if (selectedRepresentante) {
                llenarDatosRepresentante(selectedRepresentante);
            }
        });
    } else {
        representanteContainer.style.display = "none"; // Ocultar si no es una empresa o no tiene representantes
        representanteSelect.innerHTML = ''; // Limpiar select
        divRepresentante.style.display = "none";
    }
}

function llenarDatosRepresentante(representante) {

    document.getElementById("nombreRepresentante").value = representante.nombre || '';
    document.getElementById("rutRepresentante").value = representante.rut || '';
    document.getElementById("correoRepresentante").value = representante.correo || '';
    document.getElementById("telefonoRepresentante").value = representante.telefono || '';
    document.getElementById("direccionRepresentante").value = representante.direccion || '';
}


// Cargar clientes al iniciar
cargarClientes();
let productosArray = [];
let productosAgregados = [];

// Cargar productos desde la API al inicio
async function cargarProductos() {
    try {
        const productos = await obtenerProductos(); // Función para obtener productos de tu API
        productosArray = productos;
    } catch (error) {
        alert("Error al cargar productos");
    }
}

// Mostrar sugerencias mientras el usuario escribe
document.getElementById('nombreProducto').addEventListener('input', mostrarSugerenciasProducto);

function mostrarSugerenciasProducto(e) {
    const input = e.target.value.toLowerCase();
    const sugerenciasContainer = document.getElementById('sugerenciasProducto');
    const nombreProducto = document.getElementById("nombreProducto");
    sugerenciasContainer.innerHTML = '';

    if (input.length === 0) return;

    const sugerencias = productosArray.filter(producto =>
        producto.nombre.toLowerCase().includes(input)
    );

    sugerencias.forEach(producto => {
        const sugerenciaDiv = document.createElement('div');
        sugerenciaDiv.classList.add('sugerencia');
        sugerenciaDiv.textContent = producto.nombre;
        sugerenciaDiv.dataset.id = producto.id;

        sugerenciaDiv.addEventListener('click', () => {
            agregarProducto(producto);
            sugerenciasContainer.innerText = '';
            nombreProducto.value = '';
            nombreProducto.focus();
        });

        sugerenciasContainer.appendChild(sugerenciaDiv);
    });
}

// Agregar producto al listado
function agregarProducto(producto) {
    const existe = productosAgregados.find(p => p.id === producto.id);

    if (existe) {
        existe.cantidad++;
        actualizarTabla();
    } else {
        const unidad = unidadesMedida.find(e => e.id == producto.unidadDeMedida)?.nombre || "Sin unidad";
        productosAgregados.push({ 
            ...producto, 
            cantidad: 1, 
            observaciones: '', 
            unidad 
        });
        actualizarTabla();
    }
}

function actualizarTabla() {
    const tabla = document.getElementById('productosAgregados').querySelector('tbody');
    let descuento = document.getElementById('descuento').value;
    descuento = parseFloat(descuento.replace('%', '')) || 0;
    console.log(`valor descuento ${descuento}`);
    tabla.innerHTML = '';

    let totalGeneral = 0;
    let totalSinIVA = 0;
    let totalIVA = 0;

    const monedasConteo = { CLP: 0, UF: 0, UTM: 0, USD: 0 }; // Contadores de monedas

    productosAgregados.forEach((producto, index) => {
        const totalProducto = producto.precio * producto.cantidad;
        const totalProductoSinIVA = producto.precioSinIva * producto.cantidad;
        const valorIVA = parseFloat(totalProducto) - parseFloat(totalProductoSinIVA);

        totalGeneral += totalProducto;
        totalSinIVA += totalProductoSinIVA;
        totalIVA += valorIVA;

        let unidad = "";
        unidadesMedida.forEach(e => {
            if (e.id == producto.unidadDeMedida) {
                unidad = e.nombre;
            }
        });

        let moneda = "";
        if (producto.moneda == 1) {
            moneda = "CLP";
            monedasConteo.CLP++;
        } else if (producto.moneda == 2) {
            moneda = "UF";
            monedasConteo.UF++;
        } else if (producto.moneda == 3) {
            moneda = "UTM";
            monedasConteo.UTM++;
        } else if (producto.moneda == 4) {
            moneda = "USD";
            monedasConteo.USD++;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>
                <input type="number" min="1" step="${producto.moneda !== '1' ? '0.01' : '1'}" 
                    value="${producto.cantidad}" 
                    onchange="actualizarCantidad(${index}, this.value)">
            </td>
            <td>${unidad}</td>
            <td>${producto.precio} ${moneda}</td>
            <td>${Math.round(totalProducto)} ${moneda}</td>
            <td>
                <button onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    let ivaDescuento = 0;

    const descuentoValor = document.getElementById("descuentoValor");
    const valorDescuentoTotal = document.getElementById("valorDescuentoTotal");

    if(descuento > 0){
        descuentoValor.style.display = "table-row";
        valorDescuentoTotal.style.display = "table-row";
    }else{
        descuentoValor.style.display = "none";
        valorDescuentoTotal.style.display = "none";
        descuento.innerText = "0";
    }

    const totalDescuento = (totalGeneral * descuento) / 100;
    const totalConDescuento = totalGeneral - totalDescuento;

    // Determinar la moneda más frecuente
    const monedaDominante = Object.keys(monedasConteo).reduce((a, b) => 
        monedasConteo[a] > monedasConteo[b] ? a : b
    );

    // Actualizar totales
    document.getElementById('totalGeneral').textContent = `${Math.round(totalGeneral)} ${monedaDominante}`;
    document.getElementById('totalGeneral').dataset.monedaDominante = monedaDominante;
    document.getElementById('totalSinIVA').textContent = `${Math.round(totalSinIVA)} ${monedaDominante}`;
    document.getElementById('valorIVA').textContent = `${Math.round(totalIVA)} ${monedaDominante}`;
    document.getElementById('totalDescuento').textContent = `${Math.round(totalDescuento)} ${monedaDominante}`;
    document.getElementById('totalConDescuento').textContent = `${Math.round(totalConDescuento)} ${monedaDominante}`;
}



// Actualizar cantidad de un producto
function actualizarCantidad(index, nuevaCantidad) {
    productosAgregados[index].cantidad = parseFloat(nuevaCantidad);
    actualizarTabla();
}

// Actualizar observaciones de un producto
function actualizarObservaciones(index, observacion) {
    productosAgregados[index].observaciones = observacion;
}

// Eliminar producto
function eliminarProducto(index) {
    productosAgregados.splice(index, 1);
    actualizarTabla();
}

// Cargar productos al iniciar
cargarProductos();

// Generar la cotización y crear el archivo PDF
async function generarCotizacion(event) {
    event.preventDefault(); // Evitar el envío del formulario

    try {

        const fechaInicio = document.getElementById("cotizacionDesde").value;
        const fechaTermino = document.getElementById("cotizacionHasta").value;

        if (!fechaInicio || !fechaTermino) {
            alert('Debe ingresar tanto la fecha de inicio como la fecha de término.');
            return;
        }

        const fechaInicioDate = new Date(fechaInicio);
        const fechaTerminoDate = new Date(fechaTermino);

        if (fechaTerminoDate <= fechaInicioDate) {
            alert('La fecha de término debe ser posterior a la fecha de inicio.');
            return;
        }

        // Recopilar los datos del cliente
        let cliente;

        if (document.getElementById("tipoCliente").value === "persona") {
            cliente = {
                nombre: document.getElementById('nombreCliente').value,
                rut: document.getElementById('rutCliente').value,
                telefono: document.getElementById('telefonoCliente').value,
                correo: document.getElementById('correoCliente').value,
                direccion: document.getElementById('direccionCliente').value,
                tipo: document.getElementById('tipoCliente').value,
            };
        } else {
            const representante = {
                nombre: document.getElementById('nombreRepresentante').value,
                rut: document.getElementById('rutRepresentante').value,
                telefono: document.getElementById('telefonoRepresentante').value,
                correo: document.getElementById('correoRepresentante').value,
                direccion: document.getElementById('direccionRepresentante').value,
            };
            cliente = {
                nombre: document.getElementById('nombreCliente').value,
                rut: document.getElementById('rutCliente').value,
                telefono: document.getElementById('telefonoCliente').value,
                correo: document.getElementById('correoCliente').value,
                direccion: document.getElementById('direccionCliente').value,
                tipo: document.getElementById('tipoCliente').value,
                representante: representante, // Nota: Usar un array si hay más de un representante.
            };
        }

        // Verificar si los datos del cliente son válidos
        if (!cliente.nombre || !cliente.rut) {
            alert('El cliente debe tener nombre y rut');
            return;
        }

        // Verificar si hay productos agregados antes de crear cotización
        if (productosAgregados.length === 0) {
            alert('Debes agregar al menos un producto');
            return;
        }

        const monedasConteo = ["CLP", "UF", "UTM", "USD"]
        
        let productos = productosAgregados.map(producto => ({
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precio: producto.precio,
            total: producto.precio * producto.cantidad,
            unidad: producto.unidad,
            moneda: producto.moneda,
        }));

        productos.forEach(producto => {
            let moneda = "";
            if (producto.moneda == 1) {
                moneda = "CLP";
            } else if (producto.moneda == 2) {
                moneda = "UF";
            } else if (producto.moneda == 3) {
                moneda = "UTM";
            } else if (producto.moneda == 4) {
                moneda = "USD";
            }
            producto.precio = `${producto.precio} ${moneda}`;
            producto.total = `${producto.total} ${moneda}`;
        });

        const totalGeneral = document.getElementById("totalGeneral").innerText;
        const totalSinIVA = document.getElementById("totalSinIVA").innerText;
        const valorIva = document.getElementById("valorIVA").innerText;
        const descuentos = document.getElementById("descuento").value;
        const valorDescuento = document.getElementById("totalDescuento").innerText;
        const totalConDescuento = document.getElementById("totalConDescuento").innerText;

        const empresa = await obtenerEmpresa();
        const logo = await obtenerLogo();

        console.log(`logo recibido: ${logo}`)

        let rutaLogo = `${logo}`;

        // Crear la cotización con todos los datos
        const cotizacion = {
            rutaLogo,
            empresa,
            cliente,
            productos,
            totalGeneral,
            totalSinIVA,
            valorIva,
            descuentos,
            valorDescuento,
            totalConDescuento,
            fechaInicio,
            fechaTermino
        };

        // Guardar la cotización en el archivo JSON (utilizando la API que ya tienes configurada)
        await agregarCotizacion(cotizacion);

        console.log('Cotización que se va a enviar:', cotizacion);

        // Solicitar la generación del PDF desde la API
        const response = await fetch('http://localhost:3001/generar-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cotizacion) // Enviar la cotización al backend para generar el PDF
        });

        if (response.ok) {
            alert("Cotización generada y guardada en el archivo.");
            clearData();
        } else {
            console.error('Error al generar el PDF:', response.statusText);
            alert("Error al generar el PDF.");
        }
    } catch (error) {
        console.error('Error al generar la cotización:', error);
        alert("Error al guardar la cotización.");
    }
}

function clearData(){
    location.reload();
}

const descuentoInput = document.getElementById("descuento");

    descuentoInput.addEventListener("input", () => {
      let value = descuentoInput.value;

      // Eliminar cualquier carácter que no sea número o porcentaje
      value = value.replace(/[^\d]/g, "");

      // Limitar el valor al 100%
      if (parseInt(value) > 100) {
        value = "100";
      }

      // Añadir el símbolo de porcentaje al final
      descuentoInput.value = value + "%";
    });

    descuentoInput.addEventListener("focus", () => {
      // Quitar el porcentaje al enfocar para facilitar la edición
      descuentoInput.value = descuentoInput.value.replace("%", "");
    });

    descuentoInput.addEventListener("blur", () => {
      // Volver a añadir el porcentaje si no está vacío
      if (descuentoInput.value !== "") {
        let value = descuentoInput.value.replace(/[^\d]/g, "");
        if (parseInt(value) > 100) value = "100";
        descuentoInput.value = value + "%";
      }
    });