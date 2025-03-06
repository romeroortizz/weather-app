let positionX;
let positionY;
const btn = document.querySelector('.btn')
const input = document.querySelector('.search')

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
                    getWeatherData(cityName)
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
async function getWeatherData(cityName) {
    const weatherAPI = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${input.value || cityName}?key=5RLUDDTYJ228UMKJ3WH4NJEZK`

    try {
        const weatherResponse = await fetch(weatherAPI, { mode: 'cors' })
        const weatherData = await weatherResponse.json()
        const weatherToday = weatherData.days[0]
        console.log(weatherData)

        //location & time values
        const address = weatherData.resolvedAddress
        const time = weatherToday.datetime
        console.log(time)

        // Weather values
        const currentTemperature = weatherToday.temp
        const maxTemperature = weatherToday.tempmax
        const minTemperature = weatherToday.tempmin
        const humidityLevel = weatherToday.humidity
        const windSpeed = weatherToday.windspeed
        const precipitation = weatherToday.precip
       

        
        //fill content with weather and location values
        displayUi(address,time,currentTemperature,maxTemperature,minTemperature,humidityLevel,windSpeed,precipitation)

    } catch(error) {
        console.error('Error fetching weather data ', error )
    }
}



 

const section = document.querySelector('.section')
function displayUi(address,time,currentTemperature,maxTemperature,minTemperature,humidityLevel,windSpeed,precipitation) {
    section.innerHTML = ` <div class="weather-container">
        <h3 class="today">${time}</h3>
        <div class="description">Weather in ${address}</div>

        <div class="weather-contents">
            <div class="temperature">
                <div class="main-temperature">
                    <div class="current">${currentTemperature}</div>
                    <div class="sky">Overcast</div>
                </div>
                

                <div class="side">
                    <div class="high">High: ${maxTemperature}</div>
                    <div class="low">Low: ${minTemperature}</div>
                </div>

            </div>

            <div class="more-data">
                <div class="precipitation">Precipitation: ${Math.round(precipitation)}%</div>
                <div class="wind">Wind: ${windSpeed}</div>
                <div class="humility">Humility: ${humidityLevel}</div>
            </div>
        </div>
    </div>`

    
}

btn.addEventListener('click', () => {
    if (input.value !== "") {
        getWeatherData()
    } else {
        console.log('Enter value')
    }
})




