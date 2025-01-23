let venta = {
    cliente : null,
    productos: [],
    total: 0,
    abonos: 0
};

let usuariosGlobal = [];

function checkData(){
    checkCliente();
    checkProductos();
}

function startPayment(){
    event.preventDefault();
    if(venta.cliente != null && venta.productos.length > 0){
        goToStep("metodosPago");
    }else{
        alert("No hay datos para realizar la venta");
    }
}