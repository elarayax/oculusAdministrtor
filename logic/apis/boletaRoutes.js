const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath) {
    const boletasFilePath = path.join(userDataPath, 'boletas.json');

    // Si el archivo no existe, se crea con valores por defecto
    if (!fs.existsSync(boletasFilePath)) {
        fs.writeFileSync(boletasFilePath, JSON.stringify({ titulo: "", texto: "" }, null, 2));
    }

    // API para obtener las boletas
    server.get('/api/boletas', (req, res) => {
        fs.readFile(boletasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error leyendo el archivo de boletas');
            res.json(JSON.parse(data));
        });
    });

    // API para actualizar las boletas
    server.put('/api/boletas', (req, res) => {
        const nuevaBoleta = req.body;

        if (!nuevaBoleta || typeof nuevaBoleta.titulo !== "string" || typeof nuevaBoleta.texto !== "string") {
            return res.status(400).send('Datos inválidos');
        }

        fs.writeFile(boletasFilePath, JSON.stringify(nuevaBoleta, null, 2), (err) => {
            if (err) return res.status(500).send('Error escribiendo el archivo de boletas');
            res.status(200).json(nuevaBoleta);
        });
    });
};
