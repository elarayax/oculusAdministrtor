const fs = require('fs');
const path = require('path');

module.exports = function(server, userDataPath, actualizarClientesWebSocket) {
    const clientesFilePath = path.join(userDataPath, 'clientes.json');

    // API para obtener todos los clientes
    server.get('/api/clientes', (req, res) => {
        fs.readFile(clientesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading clientes file');
            res.json(JSON.parse(data));
        });
    });

    // API para agregar un nuevo cliente
    server.post('/api/clientes', (req, res) => {
        const nuevoCliente = req.body;

        if (!nuevoCliente || !nuevoCliente.nombre || !nuevoCliente.rut) {
            return res.status(400).send('Faltan datos del cliente');
        }

        fs.readFile(clientesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading clientes file');

            let clientes = JSON.parse(data);

            // Verificar que el ID no esté repetido
            if (clientes.some(cliente => cliente.rut === nuevoCliente.rut)) {
                return res.status(400).send('El ID del cliente ya existe');
            }

            clientes.push(nuevoCliente);

            fs.writeFile(clientesFilePath, JSON.stringify(clientes, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing clientes file');
                actualizarClientesWebSocket("clientes", clientes);
                res.status(201).json(nuevoCliente);
            });
        });
    });

    // API para eliminar un cliente por ID
    server.delete('/api/clientes/:rut', (req, res) => {
        const clienteId = req.params.rut;

        fs.readFile(clientesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading clientes file');

            let clientes = JSON.parse(data);

            const clienteIndex = clientes.findIndex(cliente => cliente.rut === clienteId);
            if (clienteIndex === -1) {
                return res.status(404).send('Cliente no encontrado');
            }

            const clienteEliminado = clientes.splice(clienteIndex, 1);

            fs.writeFile(clientesFilePath, JSON.stringify(clientes, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing clientes file');
                actualizarClientesWebSocket("clientes", clientes);
                res.status(200).json(clienteEliminado);
            });
        });
    });

    server.get('/api/clientes/filtro', (req, res) => {
        const { campo, valor } = req.query;

        if (!campo || !valor) {
            return res.status(400).send('Faltan parámetros de filtro');
        }

        fs.readFile(clientesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading clientes file');

            const clientes = JSON.parse(data);
            const clientesFiltrados = clientes.filter(cliente => cliente[campo] && cliente[campo].toString() === valor.toString());

            res.json(clientesFiltrados);
        });
    });

    // API para obtener un cliente por RUT
    server.get('/api/clientes/:rut', (req, res) => {
        const rutCliente = req.params.rut;

        fs.readFile(clientesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading clientes file');

            const clientes = JSON.parse(data);
            const cliente = clientes.find(cliente => cliente.rut === rutCliente);

            if (!cliente) {
                return res.status(404).send('Cliente no encontrado');
            }

            res.json(cliente);
        });
    });

    // API para actualizar un cliente por RUT
    server.put('/api/clientes/:rut', (req, res) => {
        const rutCliente = req.params.rut; // Obtener el RUT del cliente desde los parámetros de la URL
        const datosActualizados = req.body; // Obtener los datos actualizados del cuerpo de la petición

        if (!datosActualizados || Object.keys(datosActualizados).length === 0) {
            return res.status(400).send('No se proporcionaron datos para actualizar');
        }

        fs.readFile(clientesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error leyendo el archivo de clientes');

            let clientes = JSON.parse(data);

            // Buscar el cliente por RUT
            const clienteIndex = clientes.findIndex(cliente => cliente.rut === rutCliente);
            if (clienteIndex === -1) {
                return res.status(404).send('Cliente no encontrado');
            }

            // Actualizar los datos del cliente
            const clienteExistente = clientes[clienteIndex];
            const clienteActualizado = { ...clienteExistente, ...datosActualizados }; // Mezclar los datos existentes con los nuevos
            clientes[clienteIndex] = clienteActualizado;

            // Escribir los cambios en el archivo
            fs.writeFile(clientesFilePath, JSON.stringify(clientes, null, 2), (err) => {
                if (err) return res.status(500).send('Error escribiendo el archivo de clientes');
                actualizarClientesWebSocket("clientes", clientes); // Notificar cambios a través de WebSocket
                res.status(200).json(clienteActualizado); // Responder con el cliente actualizado
            });
        });
    });
};
