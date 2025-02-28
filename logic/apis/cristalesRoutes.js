const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath, actualizarCristalesWebSocket) {
    const cristalesFilePath = path.join(userDataPath, 'cristales.json');

    // API para obtener todas las cotizaciones
    server.get('/api/cristales', (req, res) => {
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de cristales');
            res.json(JSON.parse(data));
        });
    });

    server.post('/api/cristales/:idCristal/cilindros/:cilindro/esferas', (req, res) => {
        const idCristal = parseInt(req.params.idCristal);
        const cilindroValue = parseInt(req.params.cilindro);
    
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo de cristales');
            }
    
            const cristales = JSON.parse(data);
            const cristal = cristales.find((c) => c.idCristal === idCristal);
    
            if (!cristal) {
                return res.status(404).json({ message: 'Cristal no encontrado' });
            }
    
            const cilindro = cristal.cilindros.find((c) => c.cilindro === cilindroValue);
    
            if (!cilindro) {
                return res.status(404).json({ message: 'Cilindro no encontrado' });
            }
    
            // Determinar el valor de la nueva esfera
            const ultimaEsfera = cilindro.esferas.length > 0
                ? cilindro.esferas[cilindro.esferas.length - 1].esfera
                : 0;
            const nuevaEsferaValor = ultimaEsfera + 2;
    
            // Obtener las variantes del cristal
            const variantes = cristal.variantes || [];
    
            if (variantes.length === 0) {
                return res.status(400).json({ message: 'No hay variantes definidas para este cristal' });
            }
    
            // Crear la nueva esfera con las variantes existentes
            const nuevaEsfera = {
                esfera: nuevaEsferaValor,
                precios: variantes.map((variante) => ({
                    idVariante: variante.idVariante,
                    precioNeto: 0,
                    precioLista: 0
                }))
            };
    
            // Agregar la nueva esfera al cilindro
            cilindro.esferas.push(nuevaEsfera);
    
            // Guardar los cambios en el archivo
            fs.writeFile(cristalesFilePath, JSON.stringify(cristales, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar los cambios en el archivo de cristales');
                }
    
                // Notificar a través del WebSocket si es necesario
                if (actualizarCristalesWebSocket) {
                    actualizarCristalesWebSocket();
                }
    
                res.status(201).json({ message: 'Esfera agregada exitosamente', esfera: nuevaEsfera });
            });
        });
    });
    

    server.put('/api/cristales/:idCristal/cilindros/:cilindro', (req, res) => {
        const idCristal = parseInt(req.params.idCristal);
        const cilindroValue = parseInt(req.params.cilindro);
        const datosActualizados = req.body; // Datos enviados desde el frontend
    
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo de cristales');
            }
    
            const cristales = JSON.parse(data);
            const cristal = cristales.find((c) => c.idCristal === idCristal);
    
            if (!cristal) {
                return res.status(404).json({ message: 'Cristal no encontrado' });
            }
    
            const cilindro = cristal.cilindros.find((c) => c.cilindro === cilindroValue);
    
            if (!cilindro) {
                return res.status(404).json({ message: 'Cilindro no encontrado' });
            }
    
            // Validar y aplicar los datos actualizados
            if (!datosActualizados.esferas || !Array.isArray(datosActualizados.esferas)) {
                return res.status(400).json({ message: 'Datos de esferas inválidos' });
            }
    
            // Actualizar las esferas del cilindro
            cilindro.esferas = datosActualizados.esferas;
    
            // Guardar los cambios en el archivo JSON
            fs.writeFile(cristalesFilePath, JSON.stringify(cristales, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar los cambios en el archivo de cristales');
                }
    
                // Notificar a través del WebSocket si es necesario
                if (actualizarCristalesWebSocket) {
                    actualizarCristalesWebSocket();
                }
    
                res.status(200).json({ message: 'Datos del cilindro actualizados exitosamente' });
            });
        });
    });
    
    // Ruta para agregar una variante a un cristal
    server.post('/api/cristales/:idCristal/variantes', (req, res) => {
        const idCristal = parseInt(req.params.idCristal);
        const { nombreVariante } = req.body;  // Nombre de la variante recibido en el cuerpo de la solicitud
    
        // Validación de los datos de entrada
        if (!nombreVariante) {
            return res.status(400).json({ message: 'El nombre de la variante es obligatorio' });
        }
    
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo de cristales');
            }
    
            const cristales = JSON.parse(data);
            const cristal = cristales.find(c => c.idCristal === idCristal);
    
            if (!cristal) {
                return res.status(404).json({ message: 'Cristal no encontrado' });
            }
    
            // Crear nueva variante
            const nuevaVariante = {
                idVariante: cristal.variantes.length + 1, // Generar un id para la nueva variante
                nombreVariante: nombreVariante,
                descripcion: "",
                observacion: ""
            };
    
            // Agregar la variante al cristal
            cristal.variantes.push(nuevaVariante);
    
            // Agregar precios a cada esfera en cada cilindro
            cristal.cilindros.forEach(cilindro => {
                cilindro.esferas.forEach(esfera => {
                    const newPrice = {
                        idVariante: nuevaVariante.idVariante,
                        precioNeto: 0, // Asignar un precio inicial si es necesario
                        precioLista: 0 // Asignar un precio inicial si es necesario
                    }
                    esfera.precios.push(newPrice);
                });
            });
    
            // Guardar los cambios en el archivo
            fs.writeFile(cristalesFilePath, JSON.stringify(cristales, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar los cambios en el archivo de cristales');
                }
    
                // Notificar a través del WebSocket si es necesario
                if (actualizarCristalesWebSocket) {
                    actualizarCristalesWebSocket();
                }
    
                res.status(201).json({
                    message: 'Variante agregada exitosamente',
                    variante: nuevaVariante
                });
            });
        });
    });    

    server.post('/api/cristales/:idCristal/nuevo-cilindro', (req, res) => {
        const idCristal = parseInt(req.params.idCristal);
    
        // Leemos el archivo de cristales
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo de cristales');
            }
    
            const cristales = JSON.parse(data);
            const cristal = cristales.find((c) => c.idCristal === idCristal);
    
            if (!cristal) {
                return res.status(404).json({ message: 'Cristal no encontrado' });
            }
    
            // Generamos las esferas dinámicamente, de 2 en 2 hasta llegar a 20
            const esferas = [];
            let valorEsfera = 2;  // Empezamos en 2
    
            while (valorEsfera <= 20) {
                const nuevaEsfera = {
                    esfera: valorEsfera,
                    precios: cristal.variantes.map((variante) => ({
                        idVariante: variante.idVariante,
                        precioNeto: 0,  // Precio inicial, puede ser modificado después
                        precioLista: 0  // Precio inicial, puede ser modificado después
                    }))
                };
                esferas.push(nuevaEsfera);
                valorEsfera += 2;  // Incrementamos de 2 en 2
            }
    
            // Obtenemos el último cilindro y le sumamos 2 para el nuevo cilindro
            const ultimoCilindro = cristal.cilindros[cristal.cilindros.length - 1];
            const nuevoNumeroCilindro = ultimoCilindro ? ultimoCilindro.cilindro + 2 : 2; // Si no hay cilindros, empezamos con 2
    
            // Crear un nuevo cilindro con las esferas generadas
            const nuevoCilindro = {
                cilindro: nuevoNumeroCilindro,  // Le sumamos 2 al último número de cilindro
                esferas: esferas  // Asignamos las esferas generadas
            };
    
            // Agregar el cilindro al cristal
            cristal.cilindros.push(nuevoCilindro);
    
            // Guardar los cambios en el archivo
            fs.writeFile(cristalesFilePath, JSON.stringify(cristales, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar los cambios en el archivo de cristales');
                }
    
                // Notificar al WebSocket si es necesario
                if (actualizarCristalesWebSocket) {
                    actualizarCristalesWebSocket();
                }
    
                // Enviar respuesta exitosa
                res.status(201).json({
                    message: 'Cilindro creado exitosamente',
                    cilindro: nuevoCilindro
                });
            });
        });
    });    

    server.delete('/api/cristales/:idCristal/variantes/:idVariante', (req, res) => {
        const idCristal = parseInt(req.params.idCristal);
        const idVariante = parseInt(req.params.idVariante);
    
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo de cristales');
            }
    
            const cristales = JSON.parse(data);
            const cristal = cristales.find((c) => c.idCristal === idCristal);
    
            if (!cristal) {
                return res.status(404).json({ message: 'Cristal no encontrado' });
            }
    
            // Buscar y eliminar la variante del cristal
            const varianteIndex = cristal.variantes.findIndex((v) => v.idVariante === idVariante);
            if (varianteIndex === -1) {
                return res.status(404).json({ message: 'Variante no encontrada' });
            }
    
            cristal.variantes.splice(varianteIndex, 1);
    
            // Eliminar los precios relacionados con la variante en todas las esferas
            cristal.cilindros.forEach((cilindro) => {
                cilindro.esferas.forEach((esfera) => {
                    esfera.precios = esfera.precios.filter((precio) => precio.idVariante !== idVariante);
                });
            });
    
            // Guardar los cambios en el archivo JSON
            fs.writeFile(cristalesFilePath, JSON.stringify(cristales, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar los cambios en el archivo de cristales');
                }
    
                // Notificar al WebSocket si es necesario
                if (actualizarCristalesWebSocket) {
                    actualizarCristalesWebSocket();
                }
    
                res.status(200).json({ message: 'Variante eliminada exitosamente' });
            });
        });
    });
    
    server.put('/api/cristales/:idCristal/variantes/:idVariante', (req, res) => {
        const idCristal = parseInt(req.params.idCristal);
        const idVariante = parseInt(req.params.idVariante);
        const datosActualizados = req.body; // Recibir datos de la variante desde el frontend
    
        // Validación de datos de entrada
        if (!datosActualizados || !datosActualizados.nombreVariante) {
            return res.status(400).json({ message: 'Datos de variante incompletos o inválidos' });
        }
    
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo de cristales');
            }
    
            const cristales = JSON.parse(data);
            const cristal = cristales.find((c) => c.idCristal === idCristal);
    
            if (!cristal) {
                return res.status(404).json({ message: 'Cristal no encontrado' });
            }
    
            const variante = cristal.variantes.find((v) => v.idVariante === idVariante);
    
            if (!variante) {
                return res.status(404).json({ message: 'Variante no encontrada' });
            }
    
            // Actualizar los datos de la variante
            variante.nombreVariante = datosActualizados.nombreVariante;
            variante.descripcion = datosActualizados.descripcion || variante.descripcion;
            variante.observacion = datosActualizados.observacion || variante.observacion;
    
            // Guardar los cambios en el archivo JSON
            fs.writeFile(cristalesFilePath, JSON.stringify(cristales, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar los cambios en el archivo de cristales');
                }
    
                // Notificar al WebSocket si es necesario
                if (actualizarCristalesWebSocket) {
                    actualizarCristalesWebSocket();
                }
    
                res.status(200).json({
                    message: 'Variante actualizada exitosamente',
                    variante: variante,
                });
            });
        });
    });

    server.post('/api/cristales', (req, res) => {
        const nuevoCristal = req.body;  // Recibir los datos del cristal desde el frontend
    
        // Validación de datos de entrada
        if (!nuevoCristal || !nuevoCristal.nombreCristal) {
            return res.status(400).json({ message: 'Datos de cristal incompletos o inválidos' });
        }
    
        // Leer el archivo de cristales
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo de cristales');
            }
    
            const cristales = JSON.parse(data);
    
            // Generar un ID único para el nuevo cristal (por ejemplo, el siguiente ID disponible)
            const idCristal = cristales.length > 0 ? cristales[cristales.length - 1].idCristal + 1 : 1;
    
            // Si no se ha proporcionado variantes, crear una variante por defecto
            if (!nuevoCristal.variantes || nuevoCristal.variantes.length === 0) {
                nuevoCristal.variantes = [
                    {
                        idVariante: 1,
                        nombreVariante: 'Blanco',
                        descripcion: '',
                        observacion: ''
                    }
                ];
            }
    
            // Crear cilindros con esferas y precios asociados
            const cilindros = [];
            for (let i = 2; i <= 20; i += 2) {
                const cilindro = {
                    cilindro: i,
                    esferas: []
                };
    
                // Crear esferas para cada cilindro, con precios por variante
                for (let j = 2; j <= 20; j += 2) {
                    const esfera = {
                        esfera: j,
                        precios: nuevoCristal.variantes.map((variante) => ({
                            idVariante: variante.idVariante,
                            precioNeto: 0,
                            precioLista: 0
                        }))
                    };
                    cilindro.esferas.push(esfera);
                }
    
                cilindros.push(cilindro);
            }
    
            // Crear un objeto de cristal
            const cristal = {
                idCristal,
                nombreCristal: nuevoCristal.nombreCristal,
                descripcion: nuevoCristal.descripcion || '',
                observacion: nuevoCristal.observacion || '',
                variantes: nuevoCristal.variantes,
                cilindros: cilindros
            };
    
            // Añadir el cristal a la lista de cristales
            cristales.push(cristal);
    
            // Guardar los cambios en el archivo JSON
            fs.writeFile(cristalesFilePath, JSON.stringify(cristales, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar el archivo de cristales');
                }
    
                // Responder al cliente con el cristal añadido
                res.status(201).json({
                    message: 'Cristal añadido exitosamente',
                    cristal: cristal
                });
            });
        });
    }); 

    server.delete('/api/cristales/:idCristal', (req, res) => {
        const idCristal = parseInt(req.params.idCristal);
    
        fs.readFile(cristalesFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo de cristales');
            }
    
            const cristales = JSON.parse(data);
            const cristalIndex = cristales.findIndex((c) => c.idCristal === idCristal);
    
            if (cristalIndex === -1) {
                return res.status(404).json({ message: 'Cristal no encontrado' });
            }
    
            // Eliminar el cristal encontrado
            cristales.splice(cristalIndex, 1);
    
            // Guardar los cambios en el archivo JSON
            fs.writeFile(cristalesFilePath, JSON.stringify(cristales, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar los cambios en el archivo de cristales');
                }
    
                // Notificar al WebSocket si es necesario
                if (actualizarCristalesWebSocket) {
                    actualizarCristalesWebSocket();
                }
    
                res.status(200).json({ message: 'Cristal eliminado exitosamente' });
            });
        });
    });    

    server.put('/api/cristales/:id', async (req, res) => {
        const { id } = req.params; // ID del cristal a editar
        const datosActualizados = req.body; // Datos nuevos que llegan del front-end
    
        try {
            // Buscar el cristal por su ID
            const cristal = await cristalesFilePath.findById(id); // Asegúrate de que "Cristal" es el modelo correcto
    
            if (!cristal) {
                return res.status(404).json({ message: 'Cristal no encontrado' });
            }
    
            // Actualizar los datos del cristal
            Object.assign(cristal, datosActualizados);
    
            // Guardar los cambios en la base de datos
            await cristal.save();
    
            return res.json(cristal); // Devolver los datos del cristal actualizado
        } catch (error) {
            console.error('Error al editar el cristal:', error);
            return res.status(500).json({ message: 'Error al editar el cristal', error: error.message });
        }
    });
    
};