async function fetchData() {
    const cambioElement = document.getElementById('cambio');
    const resultadoElement = document.getElementById('resultado');

    // Cambiar texto mientras se cargan datos
    cambioElement.textContent = 'Cargando...';

    try {
        // Llamar a las gráficas para asegurar que estén actualizadas
        await mostrarGrafico();
        await mostrarGraficoIncidencia();

        // Obtener datos directamente de las gráficas y la tabla
        const incidenciaSimuladaData = incidenciaChart.data.datasets[1].data; // Datos simulados de incidencia
        const tasaChartData = investigationChart.data.datasets[1].data; // Datos de tasas
        const labels = incidenciaChart.data.labels; // Etiquetas de los meses (misma para ambas gráficas)

        // Obtener el mes con mayor incidencia (datos simulados)
        const maxIncidenciaIndex = incidenciaSimuladaData.indexOf(Math.max(...incidenciaSimuladaData));
        const mesMayorIncidencia = labels[maxIncidenciaIndex];
        const valorMayorIncidencia = incidenciaSimuladaData[maxIncidenciaIndex];

        // Obtener el mes con mayor tasa
        const maxTasaIndex = tasaChartData.indexOf(Math.max(...tasaChartData));
        const mesMayorTasa = labels[maxTasaIndex];
        const valorMayorTasa = tasaChartData[maxTasaIndex];

        // Obtener el municipio más repetido de la tabla
        const municipiosReales = Array.from(
            document.querySelectorAll("#municipiosTable tbody tr td:nth-child(2)")
        ).map(td => td.textContent);

        const municipioMasRepetido = municipiosReales.reduce((acc, municipio) => {
            acc[municipio] = (acc[municipio] || 0) + 1;
            return acc;
        }, {});

        const municipioMasFrecuente = Object.entries(municipioMasRepetido).reduce((acc, [municipio, count]) => {
            return count > acc[1] ? [municipio, count] : acc;
        }, ["", 0])[0];

        // Mostrar los resultados en la interfaz
        cambioElement.textContent = 'Datos cargados exitosamente';
        resultadoElement.innerHTML = `
            <p><strong>Mes con mayor incidencia delictiva:</strong> ${mesMayorIncidencia} (${valorMayorIncidencia} carpetas)</p>
            <p><strong>Mes con mayor tasa:</strong> ${mesMayorTasa} (${valorMayorTasa.toFixed(2)}%)</p>
            <p><strong>Municipio más frecuente en la tabla:</strong> ${municipioMasFrecuente}</p>
        `;
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        cambioElement.textContent = 'Ocurrió un error al cargar los datos.';
    }
}


//GRAFICA DE LAS TASAS DE INVESTIGACIÓN -ABAJO
let investigationChart; // Declarar la variable globalmente para actualizarla más tarde

async function mostrarGrafico() {
    try {
        const chartContainer = document.getElementById("chartContainer");
        chartContainer.classList.remove("hidden"); // Hacer visible el contenedor del gráfico

        const ctx = document.getElementById("investigationChart").getContext("2d");

        // Llamar a la API para los datos reales
        const responseReal = await fetch('http://localhost:3200/api/data/perMonth');
        if (!responseReal.ok) {
            throw new Error('Error al obtener datos reales de la API');
        }
        const dataReal = await responseReal.json();

        // Llamar a la API para los datos simulados
        const responseSimulada = await fetch('http://localhost:3200/api/simulation/months');
        if (!responseSimulada.ok) {
            throw new Error('Error al obtener datos simulados de la API');
        }
        const dataSimulada = await responseSimulada.json();

        // Extraer valores para la gráfica
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const tasasInvestigacion = [
            dataReal.january.tasa,
            dataReal.february.tasa,
            dataReal.march.tasa,
            dataReal.april.tasa,
            dataReal.may.tasa,
            dataReal.juny.tasa,
            dataReal.july.tasa,
            dataReal.august.tasa,
            dataReal.september.tasa,
            dataReal.october.tasa,
            dataReal.november.tasa,
            dataReal.december.tasa
        ];

        const tasasResolucion = [
            dataSimulada.january.tasa,
            dataSimulada.february.tasa,
            dataSimulada.march.tasa,
            dataSimulada.april.tasa,
            dataSimulada.may.tasa,
            dataSimulada.june.tasa,
            dataSimulada.july.tasa,
            dataSimulada.august.tasa,
            dataSimulada.september.tasa,
            dataSimulada.october.tasa,
            dataSimulada.november.tasa,
            dataSimulada.december.tasa
        ];

        // Crear o actualizar la gráfica
        if (investigationChart) {
            investigationChart.data.labels = meses;
            investigationChart.data.datasets[0].data = tasasInvestigacion;
            investigationChart.data.datasets[1].data = tasasResolucion;
            investigationChart.update();
        } else {
            investigationChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: meses, // Eje X
                    datasets: [
                        {
                            label: "Tasa de Investigación Real (%)", // Línea de datos reales
                            data: tasasInvestigacion,
                            backgroundColor: "rgba(0, 0, 0, 0)", // Sin relleno
                            borderColor: "rgba(255, 99, 132, 1)", // Rojo
                            borderWidth: 3
                        },
                        {
                            label: "Tasa de Investigación Simulada (%)", // Línea de datos simulados
                            data: tasasResolucion,
                            backgroundColor: "rgba(0, 0, 0, 0)", // Sin relleno
                            borderColor: "rgb(0, 121, 107)", // Verde oscuro
                            borderWidth: 3
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
                                text: "Meses" // Título del eje X
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Tasa (%)" // Título del eje Y
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error al mostrar la gráfica:', error);
    }
}

//GRAFICA DE INCIDENCIA -ARRIBA
let incidenciaChart; // Variable global para la nueva gráfica

async function mostrarGraficoIncidencia() {
    try {
        // Llamar a la API para los datos reales
        const responseReal = await fetch('http://localhost:3200/api/data/perMonth');
        if (!responseReal.ok) {
            throw new Error('Error al obtener datos reales de la API');
        }
        const dataReal = await responseReal.json();

        // Llamar a la API para los datos simulados
        const responseSimulada = await fetch('http://localhost:3200/api/simulation/months');
        if (!responseSimulada.ok) {
            throw new Error('Error al obtener datos simulados de la API');
        }
        const dataSimulada = await responseSimulada.json();
        console.log(dataSimulada.january.folder);

        // Extraer valores para la gráfica
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const incidenciaDelictivaReal = [
            dataReal.january.folder,
            dataReal.february.folder,
            dataReal.march.folder,
            dataReal.april.folder,
            dataReal.may.folder,
            dataReal.juny.folder,
            dataReal.july.folder,
            dataReal.august.folder,
            dataReal.september.folder,
            dataReal.october.folder,
            dataReal.november.folder,
            dataReal.december.folder
        ];

        const incidenciaDelictivaSimulada = [
            dataSimulada.january.folder,
            dataSimulada.february.folder,
            dataSimulada.march.folder,
            dataSimulada.april.folder,
            dataSimulada.may.folder,
            dataSimulada.june.folder,
            dataSimulada.july.folder,
            dataSimulada.august.folder,
            dataSimulada.september.folder,
            dataSimulada.october.folder,
            dataSimulada.november.folder,
            dataSimulada.december.folder
        ];

        // Crear o actualizar la gráfica
        const chartContainer2 = document.getElementById("chartContainer2");
        chartContainer2.classList.remove("hidden");

        const ctx = document.getElementById("incidenciaChart").getContext("2d");

        if (incidenciaChart) {
            incidenciaChart.data.labels = meses;
            incidenciaChart.data.datasets[0].data = incidenciaDelictivaReal;
            incidenciaChart.data.datasets[1].data = incidenciaDelictivaSimulada;
            incidenciaChart.update();
        } else {
            incidenciaChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: meses,
                    datasets: [
                        {
                            label: "Incidencia Delictiva Real (Folders)",
                            data: incidenciaDelictivaReal,
                            borderColor: "rgba(255, 0, 0, 1)", // Rojo
                            borderWidth: 3
                        },
                        {
                            label: "Incidencia Delictiva Simulada (Folders)",
                            data: incidenciaDelictivaSimulada,
                            borderColor: "rgba(0, 255, 0, 0.7)", // Verde claro
                            borderWidth: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: "Meses" } },
                        y: { beginAtZero: true, title: { display: true, text: "Incidencia (Folders)" } }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error al mostrar la gráfica de incidencia:', error);
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
    //'http://localhost:3200/api/data/per-month'
    try {
        // Realizar la solicitud POST
        const response = await fetch('http://localhost:3200/api/upload/json', {
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

// API URLs
const apiReal = 'http://localhost:3200/api/data/perMonth';
const apiSimulada = 'http://localhost:3200/api/simulation/months';

// Referencia al cuerpo de la tabla
const tbody = document.querySelector("#municipiosTable tbody");

// Llamar a las APIs y generar la tabla
async function generarTablaMunicipios() {
    try {
        // Llamar a la API para municipios reales
        const responseReal = await fetch(apiReal);
        if (!responseReal.ok) {
            throw new Error('Error al obtener datos reales de la API');
        }
        const dataReal = await responseReal.json();

        // Llamar a la API para municipios simulados
        const responseSimulada = await fetch(apiSimulada);
        if (!responseSimulada.ok) {
            throw new Error('Error al obtener datos simulados de la API');
        }
        const dataSimulada = await responseSimulada.json();

        // Meses del año
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        // Generar filas dinámicamente
        meses.forEach((mes, index) => {
            const row = document.createElement("tr");

            // Celda de mes
            const cellMes = document.createElement("td");
            cellMes.textContent = mes;
            row.appendChild(cellMes);

            // Celda de municipio real
            const cellMunicipioReal = document.createElement("td");
            const keyReal = Object.keys(dataReal)[index]; // Accede al mes correspondiente
            cellMunicipioReal.textContent = dataReal[keyReal].mostLikelyMunicipality;
            row.appendChild(cellMunicipioReal);

            // Celda de municipio simulado
            const cellMunicipioSimulado = document.createElement("td");
            const keySimulada = Object.keys(dataSimulada)[index]; // Accede al mes correspondiente
            cellMunicipioSimulado.textContent = dataSimulada[keySimulada].mostLikelyMunicipality;
            row.appendChild(cellMunicipioSimulado);

            // Agregar fila a la tabla
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al generar la tabla de municipios:', error);
    }
}

// Llamar a la función para generar la tabla al cargar el DOM
document.addEventListener("DOMContentLoaded", generarTablaMunicipios);
