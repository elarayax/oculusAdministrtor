function goTo(go) {
    if (go == "opciones") {
        window.location.href = "vista/opciones/index.html";
    }
    else if(go == "agregarCliente"){
        window.location.href = "vista/clientes/agregar-clientes.html";
    }
    else if(go == "verClientes"){
        window.location.href = "vista/clientes/ver-clientes.html";
    }
    else if(go == "otrosDatos"){
        window.location.href = "vista/opciones/otrosDatos.html";
    }
    else if(go == "agregarProducto"){
        window.location.href = "vista/productos/agregar-producto.html";
    }
    else if(go == "verProductos"){
        window.location.href = "vista/productos/ver-productos.html";
    }
    else if(go == "crearCotizacion"){
        window.location.href = "vista/cotizaciones/crear-cotizacion.html"
    }
    else if(go == "verCotizaciones"){
        window.location.href = "vista/cotizaciones/ver-cotizaciones.html"
    }
    else if(go == "cristales"){
        window.location.href = "vista/productos/cristales.html"
    }
    else if(go == "marcos"){
        window.location.href = "vista/productos/marcos.html"
    }
}

function toggleCard(selectedCard) {
    const allCardsInColumn = selectedCard.closest('.lista-calugas').querySelectorAll('.caluga');
    allCardsInColumn.forEach(card => {
        card.classList.remove('achicada');  // Eliminar la clase de reducción de tamaño
        card.classList.remove('oculta');   // Asegurarnos de que todas las cards sean visibles
    });

    // Ahora solo reducimos la tarjeta seleccionada
    selectedCard.classList.add('achicada');

    // Ocultamos las tarjetas que están debajo de la seleccionada
    let showNext = false;
    allCardsInColumn.forEach(card => {
        if (card === selectedCard) {
            showNext = true;  // A partir de esta card, mostramos las siguientes
        }

        if (showNext) {
            card.classList.remove('oculta');  // Mostrar las cards debajo
        } else {
            card.classList.add('oculta');  // Ocultar las cards antes de la seleccionada
        }
    });
}
