const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath, actualizarVendedoresWebSocket) {
    const vendedoresFilePath = path.join(userDataPath, 'vendedores.json');

    // Obtener todos los vendedores
    server.get('/api/vendedores', (req, res) => {
        fs.readFile(vendedoresFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de vendedores');
            }
            try {
                const vendedores = JSON.parse(data);
                res.json(vendedores);
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de vendedores');
            }
        });
    });

    // Agregar un nuevo vendedor
    server.post('/api/vendedores', (req, res) => {
        const nuevoVendedor = req.body;

        if (!nuevoVendedor || !nuevoVendedor.nombre) {
            return res.status(400).send('Faltan datos del vendedor');
        }

        fs.readFile(vendedoresFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de vendedores');
            }

            try {
                let vendedores = JSON.parse(data);
                const nuevoId = vendedores.length > 0 ? Math.max(...vendedores.map(c => c.id)) + 1 : 1;
                nuevoVendedor.id = nuevoId;

                vendedores.push(nuevoVendedor);

                fs.writeFile(vendedoresFilePath, JSON.stringify(vendedores, null, 2), (writeErr) => {
                    if (writeErr) {
                        return res.status(500).send('Error escribiendo el archivo de vendedores');
                    }
                    actualizarVendedoresWebSocket('vendedores', vendedores);
                    res.status(201).json(nuevoVendedor);
                });
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de vendedores');
            }
        });
    });

    // Eliminar un vendedor por ID
    server.delete('/api/vendedores/:id', (req, res) => {
        const idVendedor = parseInt(req.params.id, 10);

        fs.readFile(vendedoresFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de vendedores');
            }

            try {
                let vendedores = JSON.parse(data);
                const vendedoresFiltrados = vendedores.filter(v => v.id !== idVendedor);

                if (vendedores.length === vendedoresFiltrados.length) {
                    return res.status(404).send('Vendedor no encontrado');
                }

                fs.writeFile(vendedoresFilePath, JSON.stringify(vendedoresFiltrados, null, 2), (writeErr) => {
                    if (writeErr) {
                        return res.status(500).send('Error escribiendo el archivo de vendedores');
                    }
                    actualizarVendedoresWebSocket('vendedores', vendedoresFiltrados);
                    res.status(200).send('Vendedor eliminado correctamente');
                });
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de vendedores');
            }
        });
    });

    // Editar un vendedor por ID
    server.put('/api/vendedores/:id', (req, res) => {
        const idVendedor = parseInt(req.params.id, 10);
        const datosActualizados = req.body;

        if (!datosActualizados || !datosActualizados.nombre) {
            return res.status(400).send('Faltan datos para actualizar el vendedor');
        }

        fs.readFile(vendedoresFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de vendedores');
            }

            try {
                let vendedores = JSON.parse(data);
                const index = vendedores.findIndex(v => v.id === idVendedor);

                if (index === -1) {
                    return res.status(404).send('Vendedor no encontrado');
                }

                vendedores[index] = { ...vendedores[index], ...datosActualizados };

                fs.writeFile(vendedoresFilePath, JSON.stringify(vendedores, null, 2), (writeErr) => {
                    if (writeErr) {
                        return res.status(500).send('Error escribiendo el archivo de vendedores');
                    }
                    actualizarVendedoresWebSocket('vendedores', vendedores);
                    res.status(200).json(vendedores[index]);
                });
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de vendedores');
            }
        });
    });
};
