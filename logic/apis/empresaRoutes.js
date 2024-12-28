// logic/empresaRoutes.js
const fs = require('fs');
const path = require('path');

module.exports = function(server, userDataPath, actualizarClientesWebSocket) {
    const empresaFilePath = path.join(userDataPath, 'empresa.json');
    
    // API para obtener datos de la empresa
    server.get('/api/empresa', (req, res) => {
        fs.readFile(empresaFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading empresa file');
            res.json(JSON.parse(data));
        });
    });
    
    // API para actualizar los datos de la empresa
    server.put('/api/empresa', (req, res) => {
        fs.readFile(empresaFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading empresa file');
            let empresa = JSON.parse(data);
            
            // Actualizar la empresa con los nuevos datos del body
            empresa = { ...empresa, ...req.body };

            fs.writeFile(empresaFilePath, JSON.stringify(empresa, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing empresa file');
                actualizarClientesWebSocket("empresa", empresa);
                res.status(200).json(empresa);
            });
        });
    });

    // API para actualizar un campo específico de la empresa
    server.patch('/api/empresa/:campo', (req, res) => {
        const campo = req.params.campo;
        fs.readFile(empresaFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading empresa file');
            let empresa = JSON.parse(data);

            if (empresa[campo] === undefined) {
                return res.status(404).send('Campo no encontrado');
            }

            empresa[campo] = req.body.valor;

            fs.writeFile(empresaFilePath, JSON.stringify(empresa, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing empresa file');
                actualizarClientesWebSocket("empresa", empresa);
                res.status(200).json({ [campo]: empresa[campo] });
            });
        });
    });
};
