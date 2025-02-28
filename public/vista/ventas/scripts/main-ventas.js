let venta = {
    cliente : null,
    productos: [],
    vendedor: null,
    total: 0,
    abonos: 0
};

let usuariosGlobal = [];

let vendedores = [];

let newClient = false;

async function loadSalesMan(){
    try{
        let respuesta = await obtenerVendedores();
        vendedores = respuesta;
        cargarVendedores(vendedores);
    }catch(error){
        generarMensaje("red",`Error al cargar vendedores ${error}`);
    }
}

function checkData(){
    checkCliente();
    checkProductos();
}

function startPayment(){
    event.preventDefault();

    if(venta.cliente != null){
        if(venta.productos.length > 0){
            if(venta.vendedor != null){
                const observaciones = document.getElementById("observaciones").value;
                let fechaInput = document.getElementById("fechaVenta").value;
                let partes = fechaInput.split("-");
                let fecha = new Date(partes[0], partes[1] - 1, partes[2]);
                let dia = String(fecha.getDate());
                let mes = String(fecha.getMonth() + 1);
                let anio = fecha.getFullYear();
                venta.fecha = `${dia}/${mes}/${anio}`;

                if(observaciones.trim() != ""){
                    venta.observaciones = observaciones;
                }else{
                    venta.observaciones = "";
                }
                goToStep("metodosPago");
            }else{
                generarMensaje("red",`Debes seleccionar un vendedor`);
            }
        }else{
            generarMensaje("red",`No hay productos agregados`);
        }
    }else{
        generarMensaje("red",`No hay un cliente seleccionado`);
    }
}

if(venta.vendedor == null){
    loadSalesMan();
}

function cargarVendedores(vendedores) {
    let select = document.getElementById("vendedoresList");
    select.innerHTML = "";

    // Agregar una opción por defecto (opcional)
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Seleccione un vendedor";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Agregar cada vendedor como una opción
    vendedores.forEach(vendedor => {
        let option = document.createElement("option");
        option.value = vendedor.id; // Usamos el ID del vendedor como valor
        option.text = vendedor.nombre; // Mostramos el nombre del vendedor
        select.appendChild(option);
    });

    // Agregar evento para guardar el vendedor seleccionado
    select.addEventListener("change", (event) => {
        const vendedorId = event.target.value; // Obtener el ID del vendedor seleccionado
        if (vendedorId) {
            const vendedorSeleccionado = vendedores.find(v => v.id === parseInt(vendedorId));
            if (vendedorSeleccionado) {
                venta.vendedor = vendedorSeleccionado; // Guardar el vendedor en el objeto venta
                console.log("Vendedor seleccionado:", venta.vendedor);
            }
        } else {
            venta.vendedor = null; // Si no se selecciona un vendedor, se limpia
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const inputFecha = document.getElementById("fechaVenta");
    const hoy = new Date();
    
    // Formatear la fecha en DD-MM-YYYY
    let dia = String(hoy.getDate()).padStart(2, '0');
    let mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0
    let anio = hoy.getFullYear();

    // Convertir a formato YYYY-MM-DD para que sea válido en <input type="date">
    let fechaFormateada = `${anio}-${mes}-${dia}`;
    inputFecha.value = fechaFormateada;
});

function formatearNumero(input) {
    let valor = input.value.replace(/\D/g, ""); // Eliminar cualquier carácter no numérico
    input.value = valor ? Number(valor).toLocaleString("es-CL") : ""; // Formatear con separadores de miles
}