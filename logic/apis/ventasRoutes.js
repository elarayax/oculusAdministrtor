const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath, actualizarClientesWebSocket) {
    const ventasFilePath = path.join(userDataPath, 'ventas.json');

    // API para obtener todas las ventas
    server.get('/api/ventas', (req, res) => {
        fs.readFile(ventasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de cotizaciones');
            res.json(JSON.parse(data));
        });
    });

    // API para agregar una nueva venta
    server.post('/api/ventas', (req, res) => {
        const nuevaVenta = req.body;

        // Validar que se envíe un objeto
        if (typeof nuevaVenta !== 'object' || Object.keys(nuevaVenta).length === 0) {
            return res.status(400).json({ error: 'Se debe enviar un objeto válido de venta' });
        }

        fs.readFile(ventasFilePath, 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                return res.status(500).send('Error al leer el archivo de ventas');
            }

            // Si el archivo no existe, inicializamos un array vacío
            const ventas = data ? JSON.parse(data) : [];

            // Generar un nuevo id para la cotización
            const nuevoId = ventas.length > 0 ? Math.max(...ventas.map(c => c.id)) + 1 : 1;
            nuevaVenta.id = nuevoId;

            // Agregar la nueva cotización al array
            ventas.push(nuevaVenta);

            fs.writeFile(ventasFilePath, JSON.stringify(ventas, null, 2), (err) => {
                if (err) return res.status(500).send('Error al guardar la cotización');
                actualizarClientesWebSocket("ventas", ventas);
                res.status(201).json(nuevaVenta);
            });
        });
    });

    // API para actualizar una venta existente
    server.put('/api/ventas/:id', (req, res) => {
        const ventaId = parseInt(req.params.id, 10); // Convertir ID a número
        const actualizacion = req.body; // Datos para actualizar

        // Validar que se envíen datos para actualizar
        if (typeof actualizacion !== 'object' || Object.keys(actualizacion).length === 0) {
            return res.status(400).json({ error: 'Se deben enviar datos para actualizar' });
        }

        fs.readFile(ventasFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de ventas');

            // Parsear el archivo y buscar la venta por ID
            let ventas = JSON.parse(data);
            const ventaIndex = ventas.findIndex(v => v.id === ventaId);

            if (ventaIndex === -1) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }

            // Actualizar los datos de la venta
            ventas[ventaIndex] = { ...ventas[ventaIndex], ...actualizacion };

            // Guardar el archivo actualizado
            fs.writeFile(ventasFilePath, JSON.stringify(ventas, null, 2), (err) => {
                if (err) return res.status(500).send('Error al guardar la venta actualizada');
                actualizarClientesWebSocket("ventas", ventas);
                res.json(ventas[ventaIndex]);
            });
        });
    });

};