let chartInstance = null; // Variable global para almacenar la instancia del gráfico

function crearGrafico(id, tipo, labels, titulo, datos) {
    const canvas = document.getElementById(id);
    if (!canvas) {
        console.error("No se encontró el canvas con el ID:", id);
        return;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 300;

    // 🔹 Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
    /*if (chartInstance) {
        chartInstance.destroy();
    }*/

    chartInstance = new Chart(ctx, {
        type: tipo,
        data: {
            labels: labels,
            datasets: [{
                label: titulo,
                data: datos,
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
