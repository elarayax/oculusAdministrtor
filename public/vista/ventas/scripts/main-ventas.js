let venta = {
    cliente : null,
    productos: [],
    total: 0
};

let usuariosGlobal = [];

function checkData(){
    checkCliente();
    checkProductos();
}