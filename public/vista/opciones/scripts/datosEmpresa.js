async function obtenerEmpresa() {
    try {
        const response = await fetch(`http://localhost:3001/api/empresa/`);
        if (!response.ok) throw new Error('Error al obtener los datos de la empresa');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos de la empresa:', error);
        return null;
    }
}

// Modificar la función que agrega campos personalizados
async function llenarDatosEmpresa() {
    try {
        const respuesta = await fetch('http://localhost:3001/api/empresa');
        const empresa = await respuesta.json();

        console.log('Datos de la empresa:', empresa);

        document.getElementById('nombreEmpresa').value = empresa.nombre || '';
        document.getElementById('rutEmpresa').value = empresa.rut || '';
        document.getElementById('direccionEmpresa').value = empresa.direccion || '';
        document.getElementById('telefonoEmpresa').value = empresa.telefono || '';
        document.getElementById('correoEmpresa').value = empresa.correo || '';
        document.getElementById('colorTabla').value = empresa.colorTabla || '';
        document.getElementById('colorLetras').value = empresa.colorLetras || '';

        const camposPersonalizados = empresa.camposPersonalizados || [];
        const tablaCampos = document.querySelector(".listado-datos tbody");

        camposPersonalizados.forEach(campo => {
            const nuevaFila = document.createElement("tr");

            nuevaFila.innerHTML = `
                <td><input type="text" value="${campo.nombre || ''}" placeholder="Nombre del campo" /></td>
                <td><input type="text" value="${campo.valor || ''}" placeholder="Valor del campo" /></td>
                <td><button class="btn btn-danger" onclick="eliminarCampoPersonalizado(this, '${campo.nombre}')">Eliminar</button></td>
            `;

            tablaCampos.appendChild(nuevaFila);
        });
    } catch (error) {
        console.error("Error al llenar los datos de la empresa:", error);
    }
}

// Función para eliminar un campo personalizado
function eliminarCampoPersonalizado(boton, nombre) {
    // Mostramos el cuadro de confirmación
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar el campo ${nombre}?`);
    
    // Si el usuario acepta, eliminamos la fila
    if (confirmacion) {
        const fila = boton.closest('tr');  // Encontramos la fila (tr) que contiene el botón
        fila.remove();  // Eliminamos la fila de la tabla
    } 
    // Si el usuario cancela, no se hace nada
}

// Función para agregar un campo personalizado dinámicamente
function agregarCampoPersonalizado() {
    const tabla = document.querySelector(".listado-datos tbody");
    const nuevaFila = document.createElement("tr");

    nuevaFila.innerHTML = `
        <td>
            <input type="text" placeholder="Nombre del campo" />
        </td>
        <td>
            <input type="text" placeholder="Valor del campo" />
        </td>
        <td>
            <button class="btn btn-danger" onclick="eliminarCampoPersonalizado(this, 'nuevo')">
                Eliminar
            </button>
        </td>
    `;

    tabla.appendChild(nuevaFila);
}

// Función para guardar los datos
async function guardarDatos() {
    // Obtener los datos de la empresa
    const nombreEmpresa = document.getElementById("nombreEmpresa").value;
    const rutEmpresa = document.getElementById("rutEmpresa").value;
    const direccionEmpresa = document.getElementById("direccionEmpresa").value;
    const telefonoEmpresa = document.getElementById("telefonoEmpresa").value;
    const correoEmpresa = document.getElementById("correoEmpresa").value;
    const colorTabla = document.getElementById("colorTabla").value;
    const colorLetras = document.getElementById("colorLetras").value;

    // Verificar que todos los campos de la empresa estén completos
    if (!nombreEmpresa || !rutEmpresa || !direccionEmpresa || !telefonoEmpresa || !correoEmpresa) {
        generarMensaje("red","Por favor complete todos los campos de la empresa.");
        return;
    }

    // Obtener los campos personalizados
    const camposPersonalizados = [];
    const filasCampos = document.querySelectorAll(".listado-datos tbody tr");

    filasCampos.forEach(fila => {
        const nombreCampo = fila.querySelector("td:nth-child(1) input");
        const valorCampo = fila.querySelector("td:nth-child(2) input");

        // Verificar si ambos campos (nombre y valor) existen y no están vacíos
        if (nombreCampo && valorCampo && nombreCampo.value && valorCampo.value) {
            camposPersonalizados.push({
                nombre: nombreCampo.value,
                valor: valorCampo.value
            });
        }
    });

    // Crear un objeto Empresa con los datos
    const empresaActualizada = {
        nombre: nombreEmpresa,
        rut: rutEmpresa,
        direccion: direccionEmpresa,
        telefono: telefonoEmpresa,
        correo: correoEmpresa,
        colorTabla: colorTabla,
        colorLetras: colorLetras,
        camposPersonalizados: camposPersonalizados
    };

    // Actualizar la empresa con los datos nuevos
    const empresa = await actualizarEmpresa(empresaActualizada);

    if (empresa) {
        generarMensaje("green","Datos de la empresa actualizados correctamente");
        console.log("Empresa actualizada:", empresa);
        document.getElementById("nombreEmpresa").focus();
    } else {
        generarMensaje("red","Hubo un error al actualizar los datos de la empresa.");
    }
}

// Llenar los datos cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    llenarDatosEmpresa();
});

function cargarLogo() {
    const inputLogo = document.getElementById('logoEmpresa');
    const archivoLogo = inputLogo.files[0]; // Obtener el archivo seleccionado

    if (archivoLogo) {
        const formData = new FormData();
        formData.append('logo', archivoLogo); // Agregar el archivo al FormData

        // Enviar el archivo al servidor a través de la API
        fetch('http://localhost:3001/api/subirLogo', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                generarMensaje("green",'Logo cargado correctamente');
                // Aquí podrías actualizar la interfaz para mostrar el logo
                mostrarLogo(data.logoPath);
            } else {
                generarMensaje("red",'Error al cargar el logo');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            generarMensaje("red",'Hubo un problema al cargar el logo');
        });
    } else {
        generarMensaje("red",'Por favor, selecciona un logo.');
    }
}

// Función para mostrar el logo cargado en la interfaz
function mostrarLogo(logoPath) {
    const logoImg = document.getElementById('logoEmpresaImagen');
    logoImg.src = 'http://localhost:3001/' + logoPath; // Asumimos que el logo es accesible públicamente
}

window.onload = function() {
    fetch('http://localhost:3001/api/logo')
        .then(response => response.json())
        .then(data => {
            if (data.logo) {
                mostrarLogo(data.logo); // Mostrar el logo ya cargado
            }
        })
        .catch(error => {
            console.error('Error al cargar el logo:', error);
        });
};