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
            <p><strong>Municipio con mayor incidencia:</strong> ${data.mostLikelyMunicipality}</p>
            <p><strong>Año:</strong> ${data.ano}</p>
        `;
        mostrarGrafico();
        mostrarGraficoIncidencia();
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        cambioElement.textContent = '...';
    }

}



function generarNumerosRandom(cantidad, min, max) {
    const numeros = [];
    for (let i = 0; i < cantidad; i++) {
        numeros.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return numeros;
}

let investigationChart; // Declarar la variable globalmente para actualizarla más tarde

// Crear o actualizar la gráfica
function mostrarGrafico() {
    const chartContainer = document.getElementById("chartContainer");
    chartContainer.classList.remove("hidden"); // Hacer visible el contenedor del gráfico

    const ctx = document.getElementById("investigationChart").getContext("2d");

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const tasasInvestigacion = generarNumerosRandom(12, 10, 30);
    const tasasResolucion = generarNumerosRandom(12, 10, 38);

    // Crear o actualizar la gráfica
    if (investigationChart) {
        investigationChart.data.datasets[0].data = tasasInvestigacion; // Actualizar datos de investigación
        investigationChart.data.datasets[1].data = tasasResolucion;   // Actualizar datos de resolución
        investigationChart.update(); // Refrescar la gráfica
    } else {
        investigationChart = new Chart(ctx, {
            type: "line", 
            data: {
                labels: meses, // Eje X
                datasets: [
                    {
                        label: "Tasa de Investigación Actual (%)", // Primera línea
                        data: tasasInvestigacion, // Datos para la primera línea
                        backgroundColor: "rgba(0, 0, 0, 0)", // Sin relleno
                        borderColor: "rgb(0, 121, 107)", // Color de la línea
                        borderWidth: 3, // Grosor de la línea
                        fill: false // No rellenar el área debajo de la línea
                    },
                    {
                        label: "Tasa de Investigación Proyectada (%)", // Segunda línea
                        data: tasasResolucion, // Datos para la segunda línea
                        backgroundColor: "rgba(0, 0, 0, 0)", // Sin relleno
                        borderColor: "rgba(255, 99, 132, 1)", // Color de la línea
                        borderWidth: 3, // Grosor de la línea
                        fill: false // No rellenar el área debajo de la línea
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
    }
}


let incidenciaChart; // Variable global para la nueva gráfica

// Crear o actualizar la nueva gráfica
function mostrarGraficoIncidencia() {
    const chartContainer2 = document.getElementById("chartContainer2");
    chartContainer2.classList.remove("hidden"); // Hacer visible el contenedor del gráfico

    const ctx = document.getElementById("incidenciaChart").getContext("2d");

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const incidenciaDelictivaReal = generarNumerosRandom(12, 50, 100); // Datos para la incidencia real
    const incidenciaDelictivaSimulada = generarNumerosRandom(12, 30, 80); // Datos para la incidencia simulada

    // Crear o actualizar la gráfica
    if (incidenciaChart) {
        incidenciaChart.data.datasets[0].data = incidenciaDelictivaReal; // Actualizar datos reales
        incidenciaChart.data.datasets[1].data = incidenciaDelictivaSimulada; // Actualizar datos simulados
        incidenciaChart.update(); // Refrescar la gráfica
    } else {
        incidenciaChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: meses, // Eje X
                datasets: [
                    {
                        label: "Incidencia Delictiva Real (%)", // Línea de datos reales
                        data: incidenciaDelictivaReal,
                        backgroundColor: "rgba(0, 0, 0, 0)", // Sin relleno
                        borderColor: "rgba(255, 0, 0, 1)", // Color rojo
                        borderWidth: 3, // Grosor de la línea
                        fill: false // No rellenar el área debajo de la línea
                    },
                    {
                        label: "Incidencia Delictiva Simulada (%)", // Línea de datos simulados
                        data: incidenciaDelictivaSimulada,
                        backgroundColor: "rgba(0, 0, 0, 0)", // Sin relleno
                        borderColor: "rgba(0, 255, 0, 0.7)", // Color verde claro
                        borderWidth: 3, // Grosor de la línea
                        fill: false // No rellenar el área debajo de la línea
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
                            text: "Incidencia (%)", // Título del eje Y
                        }
                    }
                }
            }
        });
    }
}



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

// Arrays de municipios
const municipiosReales = [
    "Oaxaca de Juárez", "Santa Cruz Xoxocotlán", "Huajuapan de León", 
    "Salina Cruz", "Juchitán de Zaragoza", "Puerto Escondido", 
    "Miahuatlán de Porfirio Díaz", "Tehuantepec", "Tlacolula de Matamoros", 
    "Huatulco", "Tuxtepec", "San Juan Bautista Valle Nacional"
];

const municipiosSimulados = [
    "Zimatlán de Álvarez", "Santa Lucía del Camino", "Santo Domingo Tehuantepec", 
    "Pinotepa Nacional", "Ejutla de Crespo", "San Pedro Mixtepec", 
    "Villa de Etla", "Santa María Huatulco", "San Blas Atempa", 
    "Ixtepec", "San Andrés Huayápam", "Villa Sola de Vega"
];

  // Meses del año
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

  // Referencia al cuerpo de la tabla
const tbody = document.querySelector("#municipiosTable tbody");

  // Generar filas dinámicamente
meses.forEach((mes, index) => {
    const row = document.createElement("tr");

    // Celda de mes
    const cellMes = document.createElement("td");
    cellMes.textContent = mes;
    row.appendChild(cellMes);

    // Celda de municipio real
    const cellMunicipioReal = document.createElement("td");
    cellMunicipioReal.textContent = municipiosReales[index];
    row.appendChild(cellMunicipioReal);

    // Celda de municipio simulado
    const cellMunicipioSimulado = document.createElement("td");
    cellMunicipioSimulado.textContent = municipiosSimulados[index];
    row.appendChild(cellMunicipioSimulado);

    // Agregar fila a la tabla
    tbody.appendChild(row);
});