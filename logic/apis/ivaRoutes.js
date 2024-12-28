// logic/empresaRoutes.js
const fs = require('fs');
const path = require('path');

module.exports = function(server, userDataPath) {
    const ivaFilePath = path.join(userDataPath, 'iva.json');

    // API para obtener datos de la empresa
    server.get('/api/iva', (req, res) => {
        fs.readFile(ivaFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading iva file');
            }
            try {
                const ivaData = JSON.parse(data);
                res.json(ivaData);
            } catch (parseError) {
                res.status(500).send('Error parsing iva file');
            }
        });
    });

    // API para actualizar el IVA
    server.put('/api/iva', (req, res) => {
        const newIva = req.body.valor;

        if (typeof newIva !== 'number' || isNaN(newIva)) {
            return res.status(400).send('El valor del IVA debe ser un número válido');
        }

        fs.readFile(ivaFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading iva file');
            }

            try {
                const ivaData = JSON.parse(data);

                // Verificar que la estructura del archivo sea válida
                if (!Array.isArray(ivaData) || ivaData.length === 0 || !ivaData[0].hasOwnProperty('valor')) {
                    return res.status(500).send('La estructura del archivo IVA es incorrecta');
                }

                ivaData[0].valor = newIva;

                fs.writeFile(ivaFilePath, JSON.stringify(ivaData, null, 2), (err) => {
                    if (err) {
                        return res.status(500).send('Error writing iva file');
                    }
                    res.json({ message: 'IVA actualizado correctamente' });
                });
            } catch (parseError) {
                res.status(500).send('Error parsing iva file');
            }
        });
    });
};
