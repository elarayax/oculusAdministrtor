const fs = require('fs');
const path = require('path');

module.exports = function(server, userDataPath, actualizarUnidadMedidaWebSocket) {
    const marcasFilePath = path.join(userDataPath, 'marcos.json');

    // API para obtener las marcas y modelos
    server.get('/api/marcas', (req, res) => {
        fs.readFile(marcasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading marcas file');
            res.json(JSON.parse(data));
        });
    });

    // API para agregar una nueva marca
    server.post('/api/marcas', (req, res) => {
        fs.readFile(marcasFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error al leer el archivo de marcas:", err);
                return res.status(500).json({ error: 'Error al leer el archivo de marcas' });
            }
            
            let marcasData = JSON.parse(data);
            const { nombre, descripcion } = req.body;

            if (!nombre) {
                return res.status(400).json({ error: 'El nombre de la marca es obligatorio' });
            }

            const nuevoId = marcasData.marcas.length > 0 ? Math.max(...marcasData.marcas.map(m => m.id)) + 1 : 1;
            const nuevaMarca = { id: nuevoId, nombre, descripcion: descripcion || '' };

            marcasData.marcas.push(nuevaMarca);

            fs.writeFile(marcasFilePath, JSON.stringify(marcasData, null, 2), (err) => {
                if (err) {
                    console.error("Error al guardar la marca:", err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }
                actualizarUnidadMedidaWebSocket("marcas", marcasData);
                res.status(201).json(nuevaMarca);
            });
        });
    });

    // API para agregar un nuevo modelo
    server.post('/api/modelos', (req, res) => {
        fs.readFile(marcasFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error al leer el archivo de modelos:", err);
                return res.status(500).json({ error: 'Error al leer el archivo de modelos' });
            }
            
            let marcasData = JSON.parse(data);
            const { nombre, descripcion, idMarca, stock } = req.body;

            if (!nombre || !idMarca) {
                return res.status(400).json({ error: 'El nombre del modelo y el id de la marca son obligatorios' });
            }

            const nuevaId = marcasData.modelos.length > 0 ? Math.max(...marcasData.modelos.map(m => m.id)) + 1 : 1;
            const nuevoModelo = { id: nuevaId, nombre, descripcion: descripcion || '', idMarca: parseInt(idMarca), stock: stock || 0 };

            marcasData.modelos.push(nuevoModelo);

            fs.writeFile(marcasFilePath, JSON.stringify(marcasData, null, 2), (err) => {
                if (err) {
                    console.error("Error al guardar el modelo:", err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }
                actualizarUnidadMedidaWebSocket("modelos", marcasData);
                res.status(201).json(nuevoModelo);
            });
        });
    });

    // API para actualizar una marca o modelo
    server.patch('/api/marcas-modelos/:type/:id', (req, res) => {
        const { type, id } = req.params;
        const datosActualizados = req.body;

        fs.readFile(marcasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error leyendo el archivo de marcas.');

            let marcasData = JSON.parse(data);
            let item = (type === 'marcas' ? marcasData.marcas : marcasData.modelos).find(i => i.id === parseInt(id));

            if (!item) {
                return res.status(404).send(`${type === 'marcas' ? 'Marca' : 'Modelo'} no encontrado.`);
            }

            for (const [campo, valor] of Object.entries(datosActualizados)) {
                if (Object.prototype.hasOwnProperty.call(item, campo)) {
                    item[campo] = valor;
                }
            }

            fs.writeFile(marcasFilePath, JSON.stringify(marcasData, null, 2), (err) => {
                if (err) return res.status(500).send('Error guardando el archivo.');
                actualizarUnidadMedidaWebSocket(type, marcasData);
                res.status(200).json(item);
            });
        });
    });

    // API para eliminar una marca o modelo
    server.delete('/api/marcas-modelos/:type/:id', (req, res) => {
        const { type, id } = req.params;

        fs.readFile(marcasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error leyendo el archivo de marcas.');

            let marcasData = JSON.parse(data);
            let collection = type === 'marcas' ? marcasData.marcas : marcasData.modelos;
            const index = collection.findIndex(i => i.id === parseInt(id));

            if (index === -1) {
                return res.status(404).send(`${type === 'marcas' ? 'Marca' : 'Modelo'} no encontrado.`);
            }

            const eliminado = collection.splice(index, 1)[0];

            fs.writeFile(marcasFilePath, JSON.stringify(marcasData, null, 2), (err) => {
                if (err) return res.status(500).send('Error guardando el archivo.');
                actualizarUnidadMedidaWebSocket(type, marcasData);
                res.status(200).json({ message: `${type === 'marcas' ? 'Marca' : 'Modelo'} eliminado correctamente`, eliminado });
            });
        });
    });
};
