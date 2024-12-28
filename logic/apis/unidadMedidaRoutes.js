const fs = require('fs');
const path = require('path');

module.exports = function(server, userDataPath, actualizarClientesWebSocket) {
    const unidadMedidaFilePath = path.join(userDataPath, 'unidadMedida.json');

    // API para obtener las unidades de medida
    server.get('/api/unidad-medida', (req, res) => {
        fs.readFile(unidadMedidaFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading unidad de medida file');
            res.json(JSON.parse(data));
        });
    });

    server.post('/api/unidad-medida', (req, res) => {
        fs.readFile(unidadMedidaFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error al leer el archivo de unidades de medida:", err);
                return res.status(500).json({ error: 'Error al leer el archivo de unidades de medida' });
            }
            
            let unidades = JSON.parse(data);
            const { nombre, abreviacion } = req.body;
        
            // Validar datos requeridos
            if (!nombre || !abreviacion) {
                console.warn("Faltan datos requeridos:", req.body);
                return res.status(400).json({ error: 'Faltan datos requeridos (nombre o abreviación)' });
            }
        
            // Validar duplicados
            const existeDuplicado = unidades.some(
                (unidad) => unidad.nombre === nombre || unidad.abreviacion === abreviacion
            );
            if (existeDuplicado) {
                console.warn("Unidad duplicada:", req.body);
                return res.status(400).json({ error: 'La unidad de medida ya existe.' });
            }
        
            // Generar un nuevo id
            const nuevoId = unidades.length > 0 ? Math.max(...unidades.map(unidad => unidad.id)) + 1 : 1;
            const nuevaUnidad = { id: nuevoId, nombre, abreviacion };
        
            // Agregar la nueva unidad y guardar
            unidades.push(nuevaUnidad);
        
            fs.writeFile(unidadMedidaFilePath, JSON.stringify(unidades, null, 2), (err) => {
                if (err) {
                    console.error("Error al guardar el archivo:", err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }
                console.log("Unidad agregada correctamente:", nuevaUnidad);
                actualizarClientesWebSocket("unidadMedida", unidades);
                res.status(201).json(nuevaUnidad);
            });
        });
    });
    

    // API para actualizar todas las unidades de medida
    server.put('/api/unidad-medida', (req, res) => {
        fs.readFile(unidadMedidaFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading unidad de medida file');
            
            let unidades = JSON.parse(data);
            const { id, nombre, abreviacion } = req.body;
    
            // Buscar la unidad a actualizar por su ID
            let unidadExistente = unidades.find(unidad => unidad.id === id);
    
            if (!unidadExistente) {
                return res.status(404).json({ error: 'Unidad de medida no encontrada' });
            }
    
            // Actualizar la unidad
            unidadExistente.nombre = nombre;
            unidadExistente.abreviacion = abreviacion;
    
            // Guardar los cambios en el archivo
            fs.writeFile(unidadMedidaFilePath, JSON.stringify(unidades, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing unidad de medida file');
                actualizarClientesWebSocket("unidadMedida", unidades); // Suponiendo que tienes esta función para actualizar a través de WebSocket
                res.status(200).json(unidadExistente); // Devolver la unidad actualizada
            });
        });
    });
    

    // API para actualizar un campo específico de una unidad de medida
    server.patch('/api/unidad-medida/:campo', (req, res) => {
        const campo = req.params.campo;
        fs.readFile(unidadMedidaFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading unidad de medida file');
            let unidades = JSON.parse(data);

            if (unidades[campo] === undefined) {
                return res.status(404).send('Campo no encontrado');
            }

            unidades[campo] = req.body.valor;

            fs.writeFile(unidadMedidaFilePath, JSON.stringify(unidades, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing unidad de medida file');
                actualizarClientesWebSocket("unidadMedida", unidades);
                res.status(200).json({ [campo]: unidades[campo] });
            });
        });
    });

    // API para eliminar una unidad de medida
    server.delete('/api/unidad-medida/:id', (req, res) => {
        const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
    
        fs.readFile(unidadMedidaFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading unidad de medida file');
            
            let unidades = JSON.parse(data);
            
            // Buscar la unidad a eliminar por su ID
            const index = unidades.findIndex(unidad => unidad.id === parseInt(id));
    
            if (index === -1) {
                return res.status(404).json({ error: 'Unidad de medida no encontrada' });
            }
    
            // Eliminar la unidad
            const unidadEliminada = unidades.splice(index, 1)[0];  // Eliminar la unidad y obtenerla
    
            // Guardar los cambios en el archivo
            fs.writeFile(unidadMedidaFilePath, JSON.stringify(unidades, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing unidad de medida file');
                
                // Actualizar a los clientes a través de WebSocket (si estás usando)
                actualizarClientesWebSocket("unidadMedida", unidades);
                
                // Responder con un mensaje de éxito
                res.status(200).json({ message: 'Unidad de medida eliminada correctamente', unidadEliminada });
            });
        });
    });    
};