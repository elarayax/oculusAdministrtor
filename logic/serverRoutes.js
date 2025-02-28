// serverRoutes.js
const setupRoutes = require('./routes');
const empresaRoutes = require('./apis/empresaRoutes');
const logoRoutes = require('./apis/logoRoutes');
const clientesRoutes = require('./apis/clientesRoutes');
const unidadMedidaRoutes = require('./apis/unidadMedidaRoutes')
const ivaRoutes = require('./apis/ivaRoutes');
const monedasRoutes = require('./apis/monedasRoutes');
const productosRoutes = require('./apis/productosRoutes');
const contizacionesRoutes = require('./apis/cotizacionesRoutes');
const cristalesRoutes = require('./apis/cristalesRoutes');
const metodosPagoRoutes = require('./apis/metodosPagoRoutes');
const marcosRoutes = require('./apis/marcosRoutes');
const conveniosRoutes = require('./apis/conveniosRoutes');
//const whastsappMessagesRoutes = require('./apis/whatsappMessagesRoutes');
const ventasRoutes = require('./apis/ventasRoutes');
const vendedoresRoutes = require('./apis/vendedoresRoutes');
const imprimirRoutes = require('./apis/imprimirRoutes');
const boletaRoutes = require('./apis/boletaRoutes');
const tipoLentes = require('./apis/tipoLentes');

function setupAppRoutes(server, baseDir, userDataPath, actualizarClientesWebSocket, mainWindow) {
    setupRoutes(server, baseDir);
    empresaRoutes(server, userDataPath, actualizarClientesWebSocket);
    logoRoutes(server, userDataPath, actualizarClientesWebSocket);
    clientesRoutes(server, userDataPath, actualizarClientesWebSocket);
    unidadMedidaRoutes(server, userDataPath, actualizarClientesWebSocket);
    ivaRoutes(server, userDataPath);
    monedasRoutes(server, userDataPath, actualizarClientesWebSocket);
    productosRoutes(server, userDataPath, actualizarClientesWebSocket);
    contizacionesRoutes(server, userDataPath, actualizarClientesWebSocket);
    cristalesRoutes(server, userDataPath, actualizarClientesWebSocket);
    metodosPagoRoutes(server, userDataPath, actualizarClientesWebSocket);
    marcosRoutes(server, userDataPath, actualizarClientesWebSocket);
    conveniosRoutes(server, userDataPath, actualizarClientesWebSocket);
    //whastsappMessagesRoutes(server);
    ventasRoutes(server, userDataPath, actualizarClientesWebSocket);
    vendedoresRoutes(server, userDataPath, actualizarClientesWebSocket);
    imprimirRoutes(server, userDataPath, mainWindow);
    boletaRoutes(server, userDataPath);
    tipoLentes(server, userDataPath, actualizarClientesWebSocket);

}

module.exports = setupAppRoutes;