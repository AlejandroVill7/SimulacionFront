async function fetchData() {
    const cambioElement = document.getElementById('cambio');
    const resultadoElement = document.getElementById('resultado');

    // Cambiar texto mientras se cargan datos
    cambioElement.textContent = 'Cargando...';

    try {
        // Llamada a la API
        const response = await fetch('http://localhost:3200/api/v2/generalSimulation');
        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        // Parsear datos recibidos
        const data = await response.json();

        // Función para obtener el nombre del mes
        function obtenerNombreMes(numeroMes) {
            const meses = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];
            const indice = parseInt(numeroMes, 10) - 1;

            return indice >= 0 && indice < 12 ? meses[indice] : "Mes no válido";
        }

        // Mostrar datos en la interfaz
        cambioElement.textContent = 'Datos cargados exitosamente';
        const mesNombre =obtenerNombreMes(data.mostLikelyMonths); // Convertir número a nombre del mes
        resultadoElement.innerHTML = `
            <p><strong>Mes con mayor incidencia delictiva:</strong> ${mesNombre}</p>
            <p><strong>Tasa de investigación:</strong> %${data.averageResearchRate.toFixed(2)}</p>
            <p><strong>Municipio más conflictivo:</strong> ${data.mostLikelyMunicipality}</p>
            <p><strong>Año:</strong> ${data.ano}</p>
        `;
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        cambioElement.textContent = '...';
    }

}


//Agregado nuevo para la grafica
// No mover, es para la grafica 
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const tasasInvestigacion = [25, 30, 15, 40, 20, 25, 50, 35, 60, 45, 55, 70]; // Ejemplo de tasas para el primer dataset
const tasasResolucion = [20, 25, 10, 35, 18, 22, 45, 30, 55, 40, 50, 65]; // Ejemplo de tasas para el segundo dataset

//agregado
// Aqui hace eso de crear la grafica, ahora con líneas y áreas coloreadas
document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("investigationChart").getContext("2d");
    const investigationChart = new Chart(ctx, {
        type: "line", 
        data: {
            labels: meses, // Eje X
            datasets: [
                {
                    label: "Tasa de Investigacion Actual (%)", // Primera línea
                    data: tasasInvestigacion, // Datos para la primera línea
                    backgroundColor: "rgba(0, 123, 255, 0.2)", // Color del área debajo de la línea
                    borderColor: "rgb(0, 121, 107)", // Color de la línea
                    borderWidth: 3, // Grosor de la línea
                    fill: false // Rellenar el área debajo de la línea
                },
                {
                    label: "Tasa de investigacion proyectada(%)", // Segunda línea
                    data: tasasResolucion, // Datos para la segunda línea
                    backgroundColor: "rgba(255, 99, 132, 0.2)", // Color del área debajo de la línea
                    borderColor: "rgba(255, 99, 132, 1)", // Color de la línea
                    borderWidth: 3, // Grosor de la línea
                    fill: false // Rellenar el área debajo de la línea
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top', // Posición de la leyenda
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Meses", // Título del eje X
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Tasa (%)", // Título del eje Y
                    }
                }
            }
        }
    });
});



// funcion nueva para enviar el archivo json al formulario
document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const uploadResultElement = document.getElementById('uploadResult');

    // Verificar que se seleccionó un archivo
    if (!fileInput.files[0]) {
        uploadResultElement.textContent = 'Por favor, selecciona un archivo JSON.';
        return;
    }

    // Crear un objeto FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        // Realizar la solicitud POST
        const response = await fetch('http://localhost:3200/api/v2/generalSimulation/upload-json', {
            method: 'POST',
            body: formData
        });

        // Manejar la respuesta
        if (!response.ok) {
            throw new Error('Error al subir el archivo');
        }

        const result = await response.json();
        uploadResultElement.innerHTML = `
            <p>Archivo subido con éxito.</p>
            <p><strong>Mensaje del servidor:</strong> ${result.message}</p>
        `;
    } catch (error) {
        console.error('Error:', error);
        uploadResultElement.textContent = 'Ocurrió un error al subir el archivo.';
    }
});


//agregado
document.getElementById("uploadButton").addEventListener("click", function () {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Por favor, selecciona un archivo JSON primero.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const datosJSON = JSON.parse(event.target.result);

            //Aqui de verdad no le muevan 
            actualizarGrafico(datosJSON);

            document.getElementById("uploadResult").textContent = "Archivo cargado y gráfico actualizado.";
        } catch (error) {
            document.getElementById("uploadResult").textContent = "Error al procesar el archivo JSON.";
        }
    };

    reader.readAsText(file);
});


//agregado
// Esta es la funcion del actualizar grafico de aqui arribita
function actualizarGrafico(datosJSON) {
    
    const meses = datosJSON.map(entry => entry.mes); 
    const tasas = datosJSON.map(entry => entry.tasa); 

    // Aqui es como actualizar los datos o algo asi dependiendo del documetno
    investigationChart.data.labels = meses; 
    investigationChart.data.datasets[0].data = tasas; 
    investigationChart.update(); 
}