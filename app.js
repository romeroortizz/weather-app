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
// Google geolocation API key

const API_KEY = "AIzaSyDDAVn2_WR0QjOgRKS7HnMzz0gdgpQ0fKo"
function getCityName(lat, long) {
    const geoLocationApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`

    fetch(geoLocationApi, { mode: 'cors' })
        .then(response => {
            if (response.status == 200) {
                return response.json()
            } else {
                console.log(response.status)
            }
           
        })
        .then(data => {
            if (data.results.length > 0) {
                const addressComponents = data.results[0].address_components
                
                let cityComponent = addressComponents.find(component => 
                    component.types.includes('locality'))
                if (cityComponent) {
                    const cityName = cityComponent.long_name
                    console.log(cityName)
                        
                } else {
                    console.log('no city found')
                }
            }
            
        })
        .catch((err) => {
            console.log('Error fetching data: ' + err)
        })
}

//Current temperature(cast type),feels like, wind, humidity
async function getWeatherData() {
    const weatherAPI = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/ofallon?key=5RLUDDTYJ228UMKJ3WH4NJEZK"

    try {
        const weatherResponse = await fetch(weatherAPI, { mode: 'cors' })
        const weatherData = await weatherResponse.json()
        const weatherToday = weatherData.days[0]
        console.log(weatherData)

        //location values
        const address = weatherData.resolvedAddress
        console.log(address)

        // Weather values
        const currentTemperature = weatherToday.temp
        const maxTemperature = weatherToday.tempmax
        const minTemperature = weatherToday.tempmin
        const humilityLevel = weatherToday.humility
        const windSpeed = weatherToday.windSpeed
        const precipitation = weatherToday.precip
        console.log(currentTemperature,precipitation)

    } catch(error) {
        console.error('Error fetching weather data ', error )
    }
}

getWeatherData()