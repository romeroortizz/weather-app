let positionX;
let positionY;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        getCordinates(position)
    })
} 

function getCordinates(position) {
     positionX = position.coords.latitude
     positionY= position.coords.longitude  
    getCityName(positionX,positionY)
}

// AIzaSyDDAVn2_WR0QjOgRKS7HnMzz0gdgpQ0fKo

const API_KEY = "AIzaSyDDAVn2_WR0QjOgRKS7HnMzz0gdgpQ0fKo"
function getCityName(lat, long) {
    const geoLocationApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`

    fetch(geoLocationApi, { mode: 'cors' })
        .then(response => {
            return response.json()
           
        })
        .then(data => {
            if (data.results.length > 0) {
                const addressComponents = data.results[0].address_components
                
                let cityComponent = addressComponents.find(component => 
                    component.types.includes('locality'))
                
                cityComponent? console.log(cityComponent.long_name): console.log('no city found')

            }
            
        })
  
}