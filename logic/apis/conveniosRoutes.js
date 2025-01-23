const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath, actualizarConveniosWebSocket) {
    const conveniosFilePath = path.join(userDataPath, 'convenios.json');

    // API para obtener todos los convenios
    server.get('/api/convenios', (req, res) => {
        fs.readFile(conveniosFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de convenios');
            }
            try {
                const convenios = JSON.parse(data);
                res.json(convenios);
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de convenios');
            }
        });
    });

    // API para agregar un nuevo convenio
    server.post('/api/convenios', (req, res) => {
        const nuevoConvenio = req.body;

        // Validación básica de entrada
        if (!nuevoConvenio || !nuevoConvenio.nombre) {
            return res.status(400).send('Faltan datos del convenio');
        }

        fs.readFile(conveniosFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de convenios');
            }

            try {
                let convenios = JSON.parse(data);
                const nuevoId = convenios.length > 0 ? Math.max(...convenios.map(c => c.id)) + 1 : 1;
                nuevoConvenio.id = nuevoId;

                convenios.push(nuevoConvenio);

                fs.writeFile(conveniosFilePath, JSON.stringify(convenios, null, 2), (writeErr) => {
                    if (writeErr) {
                        return res.status(500).send('Error escribiendo el archivo de convenios');
                    }
                    actualizarConveniosWebSocket('convenios', convenios);
                    res.status(201).json(nuevoConvenio);
                });
            } catch (parseError) {
                res.status(500).send('Error al parsear el archivo de convenios');
            }
        });
    });
};
