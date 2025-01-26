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

    server.get('/vista/ventas/crear-venta.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'crear-venta.html'));
    });

    server.get('/vista/ventas/ver-ventas.html', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'ver-ventas.html'));
    });

    server.get('/scripts/logic/index.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'logic', 'index.js'));
    });

    server.get('/scripts/logic/html2canvas.min.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'logic', 'html2canvas.min.js'));
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

    server.get('/scripts/apis/ventas.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'ventas.js'));
    });

    server.get('/scripts/apis/logo.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'logo.js'));
    });

    server.get('/scripts/apis/cristales.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'cristales.js'));
    });

    server.get('/scripts/apis/marcos.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'marcos.js'));
    });

    server.get('/scripts/apis/convenios.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'convenios.js'));
    });

    server.get('/scripts/apis/whatsappMessages.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'scripts', 'apis', 'whatsappMessages.js'));
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

    server.get('/vista/opciones/scripts/whatsappMessages.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'opciones', 'scripts', 'whatsappMessages.js'));
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

    server.get('/vista/promociones/scripts/listarConvenios.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'promociones', 'scripts', 'convenios.js'));
    });

    server.get('/vista/promociones/scripts/descuentos.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'promociones', 'scripts', 'listarConvenios.js'));
    });

    server.get('/vista/ventas/scripts/final.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'scripts', 'final.js'));
    });

    server.get('/vista/ventas/scripts/complete-glasses.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'scripts', 'complete-glasses.js'));
    });

    server.get('/vista/ventas/scripts/main-ventas.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'scripts', 'main-ventas.js'));
    });

    server.get('/vista/ventas/scripts/payment.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'scripts', 'payment.js'));
    });

    server.get('/vista/ventas/scripts/products-logic.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'scripts', 'products-logic.js'));
    });

    server.get('/vista/ventas/scripts/steps-logic.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'scripts', 'steps-logic.js'));
    });

    server.get('/vista/ventas/scripts/user-logic.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'scripts', 'user-logic.js'));
    });

    server.get('/vista/ventas/scripts/ver-ventas.js', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'vista', 'ventas', 'scripts', 'ver-ventas.js'));
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

    server.get('/estilos/calugas.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'calugas.css'));
    });

    server.get('/estilos/calugas.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'calugas.css'));
    });

    server.get('/estilos/fontawesome/css/all.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'all.css'));
    });

    server.get('/estilos/fontawesome/css/all.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'all.min.css'));
    });

    server.get('/estilos/fontawesome/css/brands.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'brands.css'));
    });

    server.get('/estilos/fontawesome/css/brands.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'brands.min.css'));
    });

    server.get('/estilos/fontawesome/css/fontawesome.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'fontawesome.css'));
    });

    server.get('/estilos/fontawesome/css/fontawesome.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'fontawesome.min.css'));
    });

    server.get('/estilos/fontawesome/css/regular.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'regular.css'));
    });

    server.get('/estilos/fontawesome/css/regular.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'regular.min.css'));
    });

    server.get('/estilos/fontawesome/css/solid.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'solid.css'));
    });

    server.get('/estilos/fontawesome/css/solid.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'solid.min.css'));
    });

    server.get('/estilos/fontawesome/css/svg-with-js.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'svg-with-js.css'));
    });

    server.get('/estilos/fontawesome/css/svg-with-js.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'svg-with-js.min.css'));
    });

    server.get('/estilos/fontawesome/css/v4-font-face.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'v4-font-face.css'));
    });

    server.get('/estilos/fontawesome/css/v4-font-face.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'v4-font-face.min.css'));
    });

    server.get('/estilos/fontawesome/css/v4-shims.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'v4-shims.css'));
    });

    server.get('/estilos/fontawesome/css/v4-shims.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'v4-shims.min.css'));
    });

    server.get('/estilos/fontawesome/css/v5-font-face.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'v5-font-face.css'));
    });

    server.get('/estilos/fontawesome/css/v5-font-face.min.css', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'css', 'v5-font-face.min.css'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-brands-400.ttf', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-brands-400.ttf'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-regular-400.ttf', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-regular-400.ttf'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-solid-400.ttf', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-solid-400.ttf'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-solid-900.ttf', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-solid-900.ttf'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-v4compatibility.ttf', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-v4compatibility.ttf'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-brands-400.woff2', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-brands-400.woff2'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-regular-400.woff2', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-regular-400.woff2'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-solid-400.woff2', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-solid-400.woff2'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-solid-900.woff2', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-solid-900.woff2'));
    });

    server.get('/estilos/fontawesome/webfonts/fa-v4compatibility.woff2', (req, res) => {
        res.sendFile(path.join(baseDir, 'public', 'estilos', 'fontawesome', 'webfonts', 'fa-v4compatibility.ttf'));
    });
}

module.exports = setupRoutes;