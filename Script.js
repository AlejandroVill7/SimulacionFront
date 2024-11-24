// Función al hacer clic en el botón CONSULTAR
document.getElementById("consultarBoton").addEventListener("click", function() {
    alert("Consulta en proceso...");
});

// Función al hacer clic en el botón LEER MÁS
document.getElementById("leerMasBoton").addEventListener("click", function() {
    alert("Mostrando más información...");
});

// Funcion para subir archivo jason
document.getElementById()

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
