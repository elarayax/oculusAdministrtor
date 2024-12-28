const fs = require('fs');
const path = require('path');

module.exports = function (server, userDataPath, actualizarClientesWebSocket) {
    const productosFilePath = path.join(userDataPath, 'productos.json');

    // API para obtener los productos
    server.get('/api/productos', (req, res) => {
        fs.readFile(productosFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de productos');
            res.json(JSON.parse(data));
        });
    });

    // API para agregar un nuevo producto
    server.post('/api/productos', (req, res) => {
        fs.readFile(productosFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de productos');

            let productos = JSON.parse(data);
            const { nombre, precio, precioSinIva, moneda, unidadDeMedida, descripcion, tipo } = req.body;

            // Validar datos requeridos
            if (!nombre || precio == null || precioSinIva == null || !moneda || !unidadDeMedida || !descripcion || !tipo) {
                return res.status(400).json({ error: 'Faltan datos requeridos (nombre, precio, precioSinIva, moneda, unidadDeMedida, descripcion, tipo)' });
            }

            // Validar duplicados
            const existeDuplicado = productos.some(producto => producto.nombre === nombre);
            if (existeDuplicado) {
                return res.status(400).json({ error: 'El producto ya existe.' });
            }

            // Generar un nuevo id
            const nuevoId = productos.length > 0 ? Math.max(...productos.map(producto => producto.id)) + 1 : 1;
            const nuevoProducto = {
                id: nuevoId,
                nombre,
                precio,
                precioSinIva,
                moneda,
                unidadDeMedida,
                descripcion,
                tipo
            };

            // Agregar el nuevo producto y guardar
            productos.push(nuevoProducto);

            fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2), (err) => {
                if (err) return res.status(500).send('Error al guardar los datos del producto');
                actualizarClientesWebSocket("productos", productos);
                res.status(201).json(nuevoProducto);
            });
        });
    });

    // API para actualizar un producto existente
    server.put('/api/productos/:id', (req, res) => {
        const { id } = req.params;

        fs.readFile(productosFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de productos');

            let productos = JSON.parse(data);
            const { nombre, precio, precioSinIva, moneda, unidadDeMedida, descripcion, tipo } = req.body;

            // Buscar el producto a actualizar
            let productoExistente = productos.find(producto => producto.id === parseInt(id));

            if (!productoExistente) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Actualizar el producto
            productoExistente.nombre = nombre || productoExistente.nombre;
            productoExistente.precio = precio || productoExistente.precio;
            productoExistente.precioSinIva = precioSinIva || productoExistente.precioSinIva;
            productoExistente.moneda = moneda || productoExistente.moneda;
            productoExistente.unidadDeMedida = unidadDeMedida || productoExistente.unidadDeMedida;
            productoExistente.descripcion = descripcion || productoExistente.descripcion;
            productoExistente.tipo = tipo || productoExistente.tipo;

            fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2), (err) => {
                if (err) return res.status(500).send('Error al guardar los datos del producto');
                actualizarClientesWebSocket("productos", productos);
                res.status(200).json(productoExistente);
            });
        });
    });

    // API para actualizar un campo específico de un producto
    server.patch('/api/productos/:id/:campo', (req, res) => {
        const { id, campo } = req.params;
        const { valor } = req.body;

        fs.readFile(productosFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de productos');

            let productos = JSON.parse(data);

            // Buscar el producto a actualizar
            let productoExistente = productos.find(producto => producto.id === parseInt(id));

            if (!productoExistente) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Validar si el campo existe en el objeto
            if (!(campo in productoExistente)) {
                return res.status(404).json({ error: 'Campo no encontrado en el producto' });
            }

            // Actualizar el campo específico
            productoExistente[campo] = valor;

            fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2), (err) => {
                if (err) return res.status(500).send('Error al guardar los datos del producto');
                actualizarClientesWebSocket("productos", productos);
                res.status(200).json(productos.find(producto => producto.id === parseInt(id)));
            });
        });
    });

    // API para eliminar un producto
    server.delete('/api/productos/:id', (req, res) => {
        const { id } = req.params;

        fs.readFile(productosFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de productos');

            let productos = JSON.parse(data);

            // Buscar el producto a eliminar
            const index = productos.findIndex(producto => producto.id === parseInt(id));

            if (index === -1) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Eliminar el producto
            const productoEliminado = productos.splice(index, 1)[0];

            fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2), (err) => {
                if (err) return res.status(500).send('Error al escribir el archivo de productos');
                actualizarClientesWebSocket("productos", productos);
                res.status(200).json({ message: 'Producto eliminado correctamente', productoEliminado });
            });
        });
    });

    // API para obtener un producto por su ID
    server.get('/api/productos/:id', (req, res) => {
        const { id } = req.params;

        fs.readFile(productosFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo de productos');

            let productos = JSON.parse(data);

            // Buscar el producto por su ID
            const producto = productos.find(producto => producto.id === parseInt(id));

            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Devuelve el producto encontrado
            res.status(200).json(producto);
        });
    });

};
