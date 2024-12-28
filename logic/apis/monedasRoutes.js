const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath, actualizarClientesWebSocket) {
    const monedasFilePath = path.join(userDataPath, 'monedas.json');

    // API para obtener las monedas
    server.get('/api/monedas', (req, res) => {
        fs.readFile(monedasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading monedas file');
            res.json(JSON.parse(data));
        });
    });

    // API para agregar una nueva moneda
    server.post('/api/monedas', (req, res) => {
        fs.readFile(monedasFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error al leer el archivo de monedas:", err);
                return res.status(500).json({ error: 'Error al leer el archivo de monedas' });
            }

            let monedas = JSON.parse(data);
            const { valor, defecto } = req.body;

            // Validar datos requeridos
            if (!valor || typeof defecto !== 'boolean') {
                console.warn("Faltan datos requeridos:", req.body);
                return res.status(400).json({ error: 'Faltan datos requeridos (valor o defecto)' });
            }

            // Validar duplicados
            const existeDuplicado = monedas.some((moneda) => moneda.valor === valor);
            if (existeDuplicado) {
                console.warn("Moneda duplicada:", req.body);
                return res.status(400).json({ error: 'La moneda ya existe.' });
            }

            // Generar un nuevo id
            const nuevoId = monedas.length > 0 ? Math.max(...monedas.map(moneda => moneda.id)) + 1 : 1;
            const nuevaMoneda = { id: nuevoId, valor, defecto };

            // Si la nueva moneda es defecto, actualizar las demás
            if (defecto) {
                monedas = monedas.map(moneda => ({ ...moneda, defecto: false }));
            }

            // Agregar la nueva moneda y guardar
            monedas.push(nuevaMoneda);

            fs.writeFile(monedasFilePath, JSON.stringify(monedas, null, 2), (err) => {
                if (err) {
                    console.error("Error al guardar el archivo:", err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }
                console.log("Moneda agregada correctamente:", nuevaMoneda);
                actualizarClientesWebSocket("monedas", monedas);
                res.status(201).json(nuevaMoneda);
            });
        });
    });

    // API para actualizar una moneda existente
    server.put('/api/monedas/:id', (req, res) => {
        const { id } = req.params;

        fs.readFile(monedasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading monedas file');

            let monedas = JSON.parse(data);
            const { valor, defecto } = req.body;

            // Buscar la moneda a actualizar
            let monedaExistente = monedas.find(moneda => moneda.id === parseInt(id));

            if (!monedaExistente) {
                return res.status(404).json({ error: 'Moneda no encontrada' });
            }

            // Actualizar la moneda
            monedaExistente.valor = valor || monedaExistente.valor;
            monedaExistente.defecto = typeof defecto === 'boolean' ? defecto : monedaExistente.defecto;

            // Si la moneda actualizada es defecto, actualizar las demás
            if (monedaExistente.defecto) {
                monedas = monedas.map(moneda => ({ ...moneda, defecto: moneda.id === monedaExistente.id }));
            }

            fs.writeFile(monedasFilePath, JSON.stringify(monedas, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing monedas file');
                actualizarClientesWebSocket("monedas", monedas);
                res.status(200).json(monedaExistente);
            });
        });
    });

    server.patch('/api/monedas/:id/:campo', (req, res) => {
        const { id, campo } = req.params;
        const { valor } = req.body;
    
        fs.readFile(monedasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading monedas file');
    
            let monedas = JSON.parse(data);
    
            // Buscar la moneda a actualizar
            let monedaExistente = monedas.find(moneda => moneda.id === parseInt(id));
    
            if (!monedaExistente) {
                return res.status(404).json({ error: 'Moneda no encontrada' });
            }
    
            // Validar si el campo existe en el objeto
            if (!(campo in monedaExistente)) {
                return res.status(404).json({ error: 'Campo no encontrado en la moneda' });
            }
    
            if (campo === 'defecto' && valor === true) {
                // Actualizar todas las monedas
                monedas = monedas.map(moneda => ({
                    ...moneda,
                    defecto: moneda.id === monedaExistente.id
                }));
            } else {
                // Actualizar solo el campo específico
                monedaExistente[campo] = valor;
            }
    
            fs.writeFile(monedasFilePath, JSON.stringify(monedas, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing monedas file');
                actualizarClientesWebSocket("monedas", monedas);
                res.status(200).json(monedas.find(moneda => moneda.id === parseInt(id)));
            });
        });
    });
    

    // API para eliminar una moneda
    server.delete('/api/monedas/:id', (req, res) => {
        const { id } = req.params;

        fs.readFile(monedasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading monedas file');

            let monedas = JSON.parse(data);

            // Buscar la moneda a eliminar
            const index = monedas.findIndex(moneda => moneda.id === parseInt(id));

            if (index === -1) {
                return res.status(404).json({ error: 'Moneda no encontrada' });
            }

            // Eliminar la moneda
            const monedaEliminada = monedas.splice(index, 1)[0];

            fs.writeFile(monedasFilePath, JSON.stringify(monedas, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing monedas file');
                actualizarClientesWebSocket("monedas", monedas);
                res.status(200).json({ message: 'Moneda eliminada correctamente', monedaEliminada });
            });
        });
    });
};
