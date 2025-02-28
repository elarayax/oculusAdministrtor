const fs = require('fs');
const path = require('path');

module.exports = function(server, userDataPath, actualizarUnidadMedidaWebSocket) {
    const metodoPagoFilePath = path.join(userDataPath, 'metodosPago.json');

    // API para obtener las unidades de medida
    server.get('/api/metodo-pago', (req, res) => {
        fs.readFile(metodoPagoFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading metodo de pago file');
            res.json(JSON.parse(data));
        });
    });

    server.post('/api/metodo-pago', (req, res) => {
        fs.readFile(metodoPagoFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error al leer el archivo de metodos de pago:", err);
                return res.status(500).json({ error: 'Error al leer el archivo de metodos de pago' });
            }
            
            let metodos = JSON.parse(data);
            const { nombre, comision } = req.body;
        
            // Validar datos requeridos
            if (!nombre) {
                console.warn("Faltan datos requeridos:", req.body);
                return res.status(400).json({ error: 'Faltan datos requeridos (nombre o comisión)' });
            }

            if (typeof comision !== 'number' || comision < 0 || comision > 100) {
                return res.status(400).json({ error: 'La comisión debe ser un número entre 0 y 100.' });
            }
        
            // Validar duplicados
            const existeDuplicado = metodos.some(
                (unidad) => unidad.nombre === nombre
            );

            if (existeDuplicado) {
                console.warn("Unidad duplicada:", req.body);
                return res.status(400).json({ error: 'El método de pago ya existe.' });
            }
        
            // Generar un nuevo id
            const nuevoId = metodos.length > 0 ? Math.max(...metodos.map(metodos => metodos.id)) + 1 : 1;
            const nuevaMetodo = { id: nuevoId, nombre, comision };
        
            // Agregar la nueva unidad y guardar
            metodos.push(nuevaMetodo);
        
            fs.writeFile(metodoPagoFilePath, JSON.stringify(metodos, null, 2), (err) => {
                if (err) {
                    console.error("Error al guardar el archivo:", err);
                    return res.status(500).json({ error: 'Error al guardar los datos.' });
                }
                console.log("Unidad agregada correctamente:", nuevaMetodo);
                actualizarUnidadMedidaWebSocket("metodoDePago", metodos);
                res.status(201).json(nuevaMetodo);
            });
        });
    });

    server.patch('/api/metodo-pago/:id', (req, res) => {
        const { id } = req.params;
        const datosActualizados = req.body;
    
        fs.readFile(metodoPagoFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error leyendo el archivo de métodos de pago.');
            }
    
            let metodos = JSON.parse(data);
            const metodo = metodos.find(m => m.id === parseInt(id));
    
            if (!metodo) {
                return res.status(404).send('Método de pago no encontrado.');
            }
    
            // Validar y actualizar los campos proporcionados
            for (const [campo, valor] of Object.entries(datosActualizados)) {
                if (Object.prototype.hasOwnProperty.call(metodo, campo)) {
                    metodo[campo] = valor;
                } else {
                    return res.status(400).send(`Campo no válido: ${campo}`);
                }
            }
    
            fs.writeFile(metodoPagoFilePath, JSON.stringify(metodos, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error guardando el archivo.');
                }
    
                actualizarUnidadMedidaWebSocket('metodoDePago', metodos);
                res.status(200).json(metodo);
            });
        });
    });
    
    

    // API para eliminar una unidad de medida
    server.delete('/api/metodo-pago/:id', (req, res) => {
        const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
    
        fs.readFile(metodoPagoFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error reading metodo de pago file');
            
            let metodos = JSON.parse(data);
            
            // Buscar la unidad a eliminar por su ID
            const index = metodos.findIndex(unidad => unidad.id === parseInt(id));
    
            if (index === -1) {
                return res.status(404).json({ error: 'Metodo de pago no encontrado' });
            }
    
            // Eliminar la unidad
            const metodoEliminado = metodos.splice(index, 1)[0];  // Eliminar la unidad y obtenerla
    
            // Guardar los cambios en el archivo
            fs.writeFile(metodoPagoFilePath, JSON.stringify(metodos, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing metodo de pago file');
                
                // Actualizar a los clientes a través de WebSocket (si estás usando)
                actualizarUnidadMedidaWebSocket("metodoDePago", metodos);
                
                // Responder con un mensaje de éxito
                res.status(200).json({ message: 'Metodo de pago eliminado correctamente', metodoEliminado });
            });
        });
    });    
};