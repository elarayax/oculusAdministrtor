const path = require('path');

function setupRoutes(server,baseDir) {
    server.get('/', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'index.html'));
    });

    server.get('/splash.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'splash.html'));
    });

    server.get('/vista/opciones/index.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'opciones', 'index.html'));
    });

    server.get('/vista/opciones/otrosDatos.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'opciones', 'otrosDatos.html'));
    });

    server.get('/vista/opciones/datosEmpresa.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'opciones', 'datosEmpresa.html'));
    });

    server.get('/vista/clientes/agregar-clientes.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'clientes', 'agregar-clientes.html'));
    });

    server.get('/vista/clientes/ver-clientes.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'clientes', 'ver-clientes.html'));
    });

    server.get('/vista/productos/agregar-producto.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'productos', 'agregar-producto.html'));
    });

    server.get('/vista/productos/ver-productos.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'productos', 'ver-productos.html'));
    });

    server.get('/vista/productos/cristales.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'productos', 'cristales.html'));
    });

    server.get('/vista/productos/marcos.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'productos', 'cristales.html'));
    });

    server.get('/vista/cotizaciones/crear-cotizacion.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'cotizaciones', 'crear-cotizacion.html'));
    });

    server.get('/vista/cotizaciones/ver-cotizaciones.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'cotizaciones', 'ver-cotizaciones.html'));
    });

    server.get('/vista/promociones/convenios.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'promociones', 'convenios.html'));
    });

    server.get('/vista/promociones/descuentos.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'promociones', 'descuentos.html'));
    });

    server.get('/scripts/logic/index.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'logic', 'index.js'));
    });

    server.get('/scripts/apis/empresa.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'empresa.js'));
    });

    server.get('/scripts/apis/clientes.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'clientes.js'));
    });

    server.get('/scripts/apis/unidadMedida.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'unidadMedida.js'));
    });

    server.get('/scripts/apis/iva.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'iva.js'));
    });

    server.get('/scripts/apis/monedas.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'monedas.js'));
    });

    server.get('/scripts/apis/productos.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'productos.js'));
    });

    server.get('/scripts/apis/cotizaciones.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'cotizaciones.js'));
    });

    server.get('/scripts/apis/logo.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'logo.js'));
    });

    server.get('/scripts/apis/cristales.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'cristales.js'));
    });

    server.get('/scripts/apis/marcos.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'cristales.js'));
    });

    server.get('/vista/opciones/scripts/datosEmpresa.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'opciones', 'scripts', 'datosEmpresa.js'));
    });

    server.get('/vista/opciones/scripts/unidadMedida.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'opciones', 'scripts', 'unidadMedida.js'));
    });

    server.get('/vista/opciones/scripts/iva.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'opciones', 'scripts', 'iva.js'));
    });

    server.get('/vista/opciones/scripts/monedas.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'opciones', 'scripts', 'monedas.js'));
    });

    server.get('/vista/clientes/scripts/agregarCliente.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'clientes', 'scripts', 'agregarCliente.js'));
    });

    server.get('/vista/clientes/scripts/verClientes.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'clientes', 'scripts', 'verClientes.js'));
    });

    server.get('/vista/productos/scripts/agregarProducto.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'productos', 'scripts', 'agregarProducto.js'));
    });

    server.get('/vista/productos/scripts/verProductos.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'productos', 'scripts', 'verProductos.js'));
    });

    server.get('/vista/productos/scripts/cristales.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'productos', 'scripts', 'cristales.js'));
    });

    server.get('/vista/productos/scripts/marcos.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'productos', 'scripts', 'marcos.js'));
    });

    server.get('/vista/cotizaciones/scripts/crearCotizacion.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'cotizaciones', 'scripts', 'crearCotizacion.js'));
    });

    server.get('/vista/cotizaciones/scripts/verCotizaciones.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'cotizaciones', 'scripts', 'verCotizaciones.js'));
    });

    server.get('/vista/promociones/scripts/convenios.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'promociones', 'scripts', 'convenios.js'));
    });

    server.get('/vista/promociones/scripts/descuentos.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'promociones', 'scripts', 'descuentos.js'));
    });

    server.get('/estilos/global.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'global.css'));
    });

    server.get('/estilos/index.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'index.css'));
    });

    server.get('/estilos/botones.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'botones.css'));
    });

    server.get('/estilos/paginacion.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'paginacion.css'));
    });

    server.get('/estilos/cristales.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'cristales.css'));
    });

    server.get('/estilos/pop-up.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'pop-up.css'));
    });
}

module.exports = setupRoutes;