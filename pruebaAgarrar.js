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

        // Mostrar datos en la interfaz
        cambioElement.textContent = 'Datos cargados exitosamente';
        resultadoElement.innerHTML = `
            <p><strong>Mes más feo:</strong> ${data.mostLikelyMonths}</p>
            <p><strong>Tasa de investigación:</strong> ${data.averageResearchRate.toFixed(2)}</p>
            <p><strong>Municipio más conflictivo:</strong> ${data.mostLikelyMunicipality}</p>
        `;
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        cambioElement.textContent = 'Error al cargar datos';
    }
}
