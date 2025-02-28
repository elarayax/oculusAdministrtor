const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath, actualizarVendedoresWebSocket) {
    const tipoLentesFilePath = path.join(userDataPath, 'tipoLentes.json');

    // Obtener todos los vendedores
    server.get('/api/tipoLentes', (req, res) => {
        fs.readFile(tipoLentesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de tipo de lentes');
            }
            try {
                const tipoLentes = JSON.parse(data);
                res.json(tipoLentes);
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de tipo de lentes');
            }
        });
    });

    // Agregar un nuevo vendedor
    server.post('/api/tipoLentes', (req, res) => {
        const nuevoTipoLente = req.body;

        if (!nuevoTipoLente || !nuevoTipoLente.tipo) {
            return res.status(400).send('Faltan datos del tipo de lente');
        }

        fs.readFile(tipoLentesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de tipo de lentes');
            }

            try {
                let tiposLente = JSON.parse(data);
                const nuevoId = tiposLente.length > 0 ? Math.max(...tiposLente.map(c => c.id)) + 1 : 1;
                nuevoTipoLente.id = nuevoId;

                tiposLente.push(nuevoTipoLente);

                fs.writeFile(tipoLentesFilePath, JSON.stringify(tiposLente, null, 2), (writeErr) => {
                    if (writeErr) {
                        return res.status(500).send('Error escribiendo el archivo de tipos de lentes');
                    }
                    actualizarVendedoresWebSocket('tipoLentes', tiposLente);
                    res.status(201).json(tiposLente);
                });
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de tipos de lente');
            }
        });
    });

    // Eliminar un vendedor por ID
    server.delete('/api/tipoLentes/:id', (req, res) => {
        const idTipoLente = parseInt(req.params.id, 10);

        fs.readFile(tipoLentesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de tipos de lente');
            }

            try {
                let tiposLente = JSON.parse(data);
                const tipoLenteFiltrado = tiposLente.filter(v => v.id !== idTipoLente);

                if (tiposLente.length === tipoLenteFiltrado.length) {
                    return res.status(404).send('tipo de lente no encontrado');
                }

                fs.writeFile(tipoLentesFilePath, JSON.stringify(tipoLenteFiltrado, null, 2), (writeErr) => {
                    if (writeErr) {
                        return res.status(500).send('Error escribiendo el archivo de tipos de lentes');
                    }
                    actualizarVendedoresWebSocket('tipoLentes', tipoLenteFiltrado);
                    res.status(200).send('Tipo de lente eliminado correctamente');
                });
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de tipos de lente');
            }
        });
    });

    // Editar un vendedor por ID
    server.put('/api/tipoLentes/:id', (req, res) => {
        const idTipoLente = parseInt(req.params.id, 10);
        const datosActualizados = req.body;

        if (!datosActualizados || !datosActualizados.tipo) {
            return res.status(400).send('Faltan datos para actualizar el tipo de lente');
        }

        fs.readFile(tipoLentesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de tipos de lentes');
            }

            try {
                let tiposLente = JSON.parse(data);
                const index = tiposLente.findIndex(v => v.id === idTipoLente);

                if (index === -1) {
                    return res.status(404).send('tipo de lente no encontrado');
                }

                tiposLente[index] = { ...tiposLente[index], ...datosActualizados };

                fs.writeFile(tipoLentesFilePath, JSON.stringify(tiposLente, null, 2), (writeErr) => {
                    if (writeErr) {
                        return res.status(500).send('Error escribiendo el archivo de tipos de lentes');
                    }
                    actualizarVendedoresWebSocket('tipoLente', tiposLente);
                    res.status(200).json(tiposLente[index]);
                });
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de tipos de lentes');
            }
        });
    });
};
