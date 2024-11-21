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
        function obtenerNombreMes(numeroMes){
            const meses = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Seotiembre", "Octubre", "Noviembre", "Diciembre"
            ];
            const indice = parseInt(numeroMes, 10) - 1;

            if(indice >= 0 && indice < 12){
                return meses[indice];
            }else{
                return "Numero de mes no valido"
            }
        }
        resultadoElement.innerHTML = `
            <p><strong>Mes con mayor incidencia delictiva:</strong> ${data.mostLikelyMonths}</p>
            <p><strong>Tasa de investigación:</strong> ${data.averageResearchRate.toFixed(2)}</p>
            <p><strong>Municipio más conflictivo:</strong> ${data.mostLikelyMunicipality}</p>
        `;
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        cambioElement.textContent = 'Error al cargar datos';
    }
}
