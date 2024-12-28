async function mostrarIva() {
    const iva = await obtenerIva();
    if (iva) {
        // Asignar el valor con el '%' al final
        document.getElementById("iva").value = iva[0].valor + '%';
    } else {
        alert('No se ha configurado el IVA.');
    }
}

async function cambiarIva() {
    const ivaValue = document.getElementById('iva').value.replace('%', '');  // Eliminar el símbolo '%' antes de enviar
    const nuevoIva = parseInt(ivaValue);
    if (nuevoIva) {
        const result = await actualizarIva(nuevoIva);
        if (result) {
            alert('IVA actualizado correctamente');
        } else {
            alert('Error al actualizar el IVA');
        }
    }
}

function formatIva(event) {
    const input = event.target;
    let value = input.value.replace('%', '');  // Eliminar el símbolo '%' si el usuario lo escribe
    value = value.trim();  // Eliminar cualquier espacio al principio y al final

    // Si el valor es un número válido (o vacío), actualiza el campo sin el '%'
    if (value !== '' && !isNaN(value)) {
        // Solo agregamos el '%' al final si el valor es un número
        input.value = value + '%';
    } else if (value === '') {
        // Si el campo está vacío, lo dejamos vacío
        input.value = '';
    }
}

// Llamamos a mostrarIva() para cargar el IVA cuando la página se cargue
mostrarIva();
