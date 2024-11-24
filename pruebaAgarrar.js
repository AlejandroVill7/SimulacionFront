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
        const mesNombre = obtenerNombreMes(data.mostLikelyMonths); // Convertir número a nombre del mes
        resultadoElement.innerHTML = `
            <p><strong>Mes con mayor incidencia delictiva:</strong> ${mesNombre}</p>
            <p><strong>Tasa de investigación:</strong> ${data.averageResearchRate.toFixed(2)}</p>
            <p><strong>Municipio más conflictivo:</strong> ${data.mostLikelyMunicipality}</p>
        `;
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        cambioElement.textContent = 'Error al cargar datos';
    }

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


