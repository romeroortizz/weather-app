import {obj} from './svgIcons.js'

let positionX;
let positionY;
const btn = document.querySelector('.btn')
const input = document.querySelector('.search')
const loader = document.querySelector('.loader')

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
    console.log(loader)
    loader.style.display = 'block'
    const weatherAPI = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${input.value || cityName}?key=5RLUDDTYJ228UMKJ3WH4NJEZK`

    try {
        const weatherResponse = await fetch(weatherAPI, { mode: 'cors' })
        const weatherData = await weatherResponse.json()
        const weatherToday = weatherData.days[0]
       
        console.log(weatherToday)
        //location & time values
        const address = weatherData.resolvedAddress
        const time = weatherToday.datetime
       
        //Get icon type 
        const iconType = weatherToday.icon
        const svgType = obj[iconType]
        
        // Weather values
        const currentTemperature = Math.round(weatherToday.temp)
        const maxTemperature = Math.round(weatherToday.tempmax)
        const minTemperature = Math.round(weatherToday.tempmin)
        const humidityLevel = Math.round(weatherToday.humidity)
        const windSpeed = Math.round((weatherToday.windspeed)* 0.621371)
        const precipitation = Math.round(weatherToday.precip)
        const condition = weatherToday.conditions
        
        //fill content with weather and location values
        displayUi(svgType,address,time,currentTemperature,maxTemperature,minTemperature,humidityLevel,windSpeed,precipitation,condition)

    } catch(error) {
        console.error('Error fetching weather data ', error )
    }
}

const section = document.querySelector('.section')
function displayUi(svgType,address,time,currentTemperature,maxTemperature,minTemperature,humidityLevel,windSpeed,precipitation,condition) {
    loader.style.display ='none'
    section.innerHTML = ` <div class="weather-container">
        <h3 class="today">${time}</h3>
        <div class="description">Weather in ${address}</div>

        <div class="weather-contents">
            <div class="temperature">
                <div class="main-temperature">
                    <div class="current">${Math.round(currentTemperature)}°F</div>
                    <div class="sky">${condition}</div>
                </div>
                

                <div class="side">
                    <div class="high">High: ${maxTemperature}°</div>
                    <div class="low">Low: ${minTemperature}°</div>
                </div>

            </div>

            <div class="more-data">
                <div class="precipitation"><svg class="small-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-fog</title><path d="M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66
                 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5
                 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1
                 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0
                  0,1 7,20A1,1 0 0,1 8,19Z" /></svg>Precipitation: ${Math.round(precipitation)}%</div>

                <div class="wind"><svg class="small-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-dust</title><path d="M3 5C3 4.4 3.4 4 4
                 4H5C5.6 4 6 4.4 6 5S5.6 6 5 6H4C3.4 6 3 5.6 3 5M4 13C4 12.4 4.4 12 5 12H6C6.6 12 7 12.4 7 13S6.6 14 6
                 14H5C4.4 14 4 13.6 4 13M4 16C3.4 16 3 16.4 3 17S3.4 18 4 18H9C9.6 18 10 17.6 10 17S9.6 16 9 16H4M18 5C18 4.4 18.4 4 19 4H21C21.6 4 22 4.4 22 5S21.6 6 21 6H19C18.4 6 18 5.6 18 5M7 20C6.4 20 6 20.4 6 21S6.4 22 7 22H11C11.6 22 12 21.6 12 21S11.6 20 11 20H7M3 10C2.4 10 2 9.6 2 9S2.4 
                 8 3 8H12C13.1 8 14 7.1 14 6S13.1 4 12 4C11.4 4 10.9 4.2 10.6 4.6C10.2 5 9.6 5 9.2 4.6C8.8 4.2 8.8 3.6 9.2 3.2C9.9 2.5 10.9 2 12 2C14.2 2 16 3.8 16 6S14.2 10 12 10H3M19 12C19.6 12 20 11.6 20 11S19.6 10 19 10C18.7 10 18.5 10.1 18.3 10.3C17.9 10.7 17.3 10.7 16.9 10.3C16.5 
                 9.9 16.5 9.3 16.9 8.9C17.4 8.3 18.2 8 19 8C20.7 8 22 9.3 22 11S20.7 14 19 14H10C9.4 14
                  9 13.6 9 13S9.4 12 10 12H19M18 18H13C12.4 18 12 17.6 12 17S12.4 16 13 16H18C19.7 16 21 17.3 21 19S19.7 22 18 22C17.2 22 16.4 21.7 15.9 21.1C15.5 20.7 15.5 20.1 15.9 19.7C16.3 19.3 16.9 19.3 17.3
                19.7C17.5 19.9 17.7 20 18 20C18.6 20 19 19.6 19 19S18.6 18 18 18Z" /></svg>Wind: ${windSpeed} mph</div>

                <div class="humility"><svg class="small-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>water-thermometer</title><path d="M19 5C17.89 5 17 5.89 17 7V13.76C16.36 14.33 16 15.15 16 16C16 17.66 17.34 19 19 19S22 17.66 22 16C22 15.15 21.64 14.33 21 13.77V7C21 5.89 20.11 5 19 5M19 6C19.55 6 20 6.45 20 7V8H18V7C18 6.45 18.45
                 6 19 6M8 20C4.69 20 2 17.31 2 14C2 10 8 3.25 8 3.25S14 10 14 14C14 17.31 11.31 20 8 20Z" /></svg>Humidity: ${humidityLevel}%</div>
            </div>
        </div>
    </div>`
    const temperatureImage = document.querySelector('.current')
    temperatureImage.insertAdjacentHTML('afterbegin',svgType)

    
}

btn.addEventListener('click', () => {
    if (input.value !== "") {
        getWeatherData()
    } else {
        console.log('Enter value')
    }
})

const searchId = document.querySelector('#search')
searchId.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchId.value.length > 0) {
       getWeatherData()
    }
})



