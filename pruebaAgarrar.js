async function fetchData(){
    document.getElementById('cambio').textContent='Cargando...';
  
    try{
        
        const response=await fetch('http://localhost:3200/api/v2/generalSimulation');
        if(!response.ok){
            throw new Error('error mamando la ptm');
            
        }
        const data = await response.json();
        document.getElementById('cambio').textContent=`mes Mas feo:${data.mostLikelyMonths}
        tasaDeInvestigacion: ${data.averageResearchRate}
        municipioCulero: ${data.mostLikelyMunicipality}`;
    }catch(error){
        console.error('Error:',error);
        document.getElementById('cambio').textContent='error gay';
    }
}