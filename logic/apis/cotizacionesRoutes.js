const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath, actualizarClientesWebSocket) {
    const cotizacionesFilePath = path.join(userDataPath, 'cotizaciones.json');

    // API para obtener todas las cotizaciones
    server.get('/api/cotizaciones', (req, res) => {
        fs.readFile(cotizacionesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de cotizaciones');
            res.json(JSON.parse(data));
        });
    });

    // API para agregar una nueva cotización
    server.post('/api/cotizaciones', (req, res) => {
        const nuevaCotizacion = req.body;

        // Validar que se envíe un objeto
        if (typeof nuevaCotizacion !== 'object' || Object.keys(nuevaCotizacion).length === 0) {
            return res.status(400).json({ error: 'Se debe enviar un objeto válido de cotización' });
        }

        fs.readFile(cotizacionesFilePath, 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                return res.status(500).send('Error al leer el archivo de cotizaciones');
            }

            // Si el archivo no existe, inicializamos un array vacío
            const cotizaciones = data ? JSON.parse(data) : [];

            // Generar un nuevo id para la cotización
            const nuevoId = cotizaciones.length > 0 ? Math.max(...cotizaciones.map(c => c.id)) + 1 : 1;
            nuevaCotizacion.id = nuevoId;

            // Agregar la nueva cotización al array
            cotizaciones.push(nuevaCotizacion);

            fs.writeFile(cotizacionesFilePath, JSON.stringify(cotizaciones, null, 2), (err) => {
                if (err) return res.status(500).send('Error al guardar la cotización');
                actualizarClientesWebSocket("cotizaciones", cotizaciones);
                res.status(201).json(nuevaCotizacion);
            });
        });
    });

    // API para obtener una cotización por su ID
    server.get('/api/cotizaciones/:id', (req, res) => {
        const { id } = req.params;

        fs.readFile(cotizacionesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de cotizaciones');

            const cotizaciones = JSON.parse(data);
            const cotizacion = cotizaciones.find(c => c.id === parseInt(id));

            if (!cotizacion) {
                return res.status(404).json({ error: 'Cotización no encontrada' });
            }

            res.status(200).json(cotizacion);
        });
    });

    // API para eliminar una cotización
    server.delete('/api/cotizaciones/:id', (req, res) => {
        const { id } = req.params;

        fs.readFile(cotizacionesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de cotizaciones');

            let cotizaciones = JSON.parse(data);
            const index = cotizaciones.findIndex(c => c.id === parseInt(id));

            if (index === -1) {
                return res.status(404).json({ error: 'Cotización no encontrada' });
            }

            const cotizacionEliminada = cotizaciones.splice(index, 1)[0];

            fs.writeFile(cotizacionesFilePath, JSON.stringify(cotizaciones, null, 2), (err) => {
                if (err) return res.status(500).send('Error al guardar el archivo de cotizaciones');
                actualizarClientesWebSocket("cotizaciones", cotizaciones);
                res.status(200).json({ message: 'Cotización eliminada correctamente', cotizacionEliminada });
            });
        });
    });

    // API para buscar cotizaciones por fechaInicio, fechaTermino o estadoCotizacion
    server.get('/api/cotizaciones/buscar', (req, res) => {
        const { fechaInicio, fechaTermino, estadoCotizacion } = req.query;

        if (!fechaInicio && !fechaTermino && !estadoCotizacion) {
            return res.status(400).json({ error: 'Debe proporcionar al menos fechaInicio, fechaTermino o estadoCotizacion' });
        }

        fs.readFile(cotizacionesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de cotizaciones');

            const cotizaciones = JSON.parse(data);
            const resultados = cotizaciones.filter(cotizacion => {
                const fechaCotizacion = new Date(cotizacion.fecha);
                const inicio = fechaInicio ? new Date(fechaInicio) : null;
                const termino = fechaTermino ? new Date(fechaTermino) : null;
                const estado = estadoCotizacion ? cotizacion.estadoCotizacion === estadoCotizacion : true;

                return (
                    (!inicio || fechaCotizacion >= inicio) &&
                    (!termino || fechaCotizacion <= termino) &&
                    estado
                );
            });

            res.status(200).json(resultados);
        });
    });

};