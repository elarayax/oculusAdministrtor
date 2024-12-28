const fs = require('fs');
const path = require('path');
const multer = require('multer');

module.exports = function(server, userDataPath, actualizarClientesWebSocket) {
    const logosDir = path.join(userDataPath, 'logos');  // Carpeta donde se guardarán los logos
    const logoFilePath = path.join(userDataPath, 'logo.json');  // Archivo para guardar la ruta del logo

    // Asegurarse de que la carpeta de logos existe
    if (!fs.existsSync(logosDir)) {
        fs.mkdirSync(logosDir, { recursive: true });
    }

    // Asegurarse de que el archivo de logo.json exista
    if (!fs.existsSync(logoFilePath)) {
        fs.writeFileSync(logoFilePath, JSON.stringify({ logoPath: null }, null, 2));
    }

    // Configuración de Multer para manejar el archivo
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, logosDir);  // Establecer el destino para el archivo
        },
        filename: (req, file, cb) => {
            // Usar un nombre único para cada archivo (con timestamp)
            const ext = path.extname(file.originalname);
            const filename = `logo-${Date.now()}${ext}`;
            cb(null, filename);
        }
    });

    const upload = multer({ storage: storage });

    // API para subir el logo
    server.post('/api/subirLogo', upload.single('logo'), (req, res) => {
        if (!req.file) {
            return res.status(400).send('No se ha enviado ningún archivo.');
        }

        const logoPath = path.join('logos', req.file.filename);

        // Guardar la ruta del logo en el archivo JSON
        const logoData = { logoPath: logoPath };
        fs.writeFileSync(logoFilePath, JSON.stringify(logoData, null, 2));

        res.status(200).json({
            success: true,
            logoPath: logoPath,  // Devolver la ruta del logo
            message: 'Logo cargado correctamente'
        });
    });

    // API para obtener el logo actual de la empresa
    server.get('/api/logo', (req, res) => {
        fs.readFile(logoFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo logo.json:', err);
                return res.status(500).send('Error al leer el archivo de logo');
            }
    
            try {
                const logoData = JSON.parse(data);
    
                if (logoData.logoPath) {
                    console.log('Logo encontrado:', logoData.logoPath);
                    return res.status(200).json({ logo: logoData.logoPath });
                } else {
                    console.log('No se encontró un logo cargado');
                    return res.status(404).send('No se encontró un logo cargado');
                }
            } catch (parseError) {
                console.error('Error al parsear el archivo logo.json:', parseError);
                return res.status(500).send('Error al parsear el archivo de logo');
            }
        });
    });
};
