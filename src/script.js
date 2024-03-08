// Making object of weatherapi
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

// Anonymous function
// Adding event listener for key press of enter
let searchInputBox = document.getElementById('input-box');
searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);
    }
})

// Get weather report
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(weather => {
            return weather.json();
        }).then(showWeatherReport);
}

// Show weather report
function showWeatherReport(weather) {
    let cityCode = weather.cod;
    if (cityCode === '400') {
        swal("Empty Input", "Please enter any city", "error");
        reset();
    } else if (cityCode === '404') {
        swal("Bad Input", "Entered city didn't match", "warning");
        reset();
    } else {
        let op = document.getElementById('weather-body');
        op.style.display = 'block';
        let todayDate = new Date();
        let parent = document.getElementById('parent');
        let weatherBody = document.getElementById('weather-body');
        weatherBody.innerHTML = `
            <div class="location-details">
                <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
                <div class="date" id="date">${dateManage(todayDate)}</div>
            </div>
            <div class="weather-status">
                <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C </div>
                <div class="weather" id="weather">${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i></div>
                <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max) </div>
                <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
            </div>
            <hr>
            <div class="day-details">
                <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}%  <br> Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
            </div>
        `;
        parent.append(weatherBody);
        changeBg(weather.weather[0].main);
        reset();
    }
}

// Making a function for the last update current time 
function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

// Date manage for returning current date
function dateManage(dateArg) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    return `${date} ${month} (${day}) , ${year}`
}

// Function for dynamic background change according to weather status
function changeBg(status) {
    const imageFolderPath = `images/${status.toLowerCase()}`;
    const defaultImagePath = `images/default`;

    const backgroundImages = {
        'clouds': 'clouds_image.jpg',
        'rain': 'rain_image.jpg',
        'clear': 'clear_image.jpg',
        'snow': 'snow_image.jpg',
        'sunny': 'sunny_image.jpg',
        'thunderstorm': 'thunderstorm_image.jpg',
        'drizzle': 'drizzle_image.jpg',
        'mist': 'mist_image.jpg'
    };

    // Use the corresponding image for the weather status or fallback to the default image
    const imagePath = backgroundImages[status] ? `${imageFolderPath}/${backgroundImages[status]}` : `${defaultImagePath}/default_image.jpg`;

    // Set the background image
    document.body.style.backgroundImage = `url(${imagePath})`;
}

// Making a function for the classname of icon
function getIconClass(classArg) {
    const iconClasses = {
        'Rain': 'fas fa-cloud-showers-heavy',
        'Clouds': 'fas fa-cloud',
        'Clear': 'fas fa-cloud-sun',
        'Snow': 'fas fa-snowman',
        'Sunny': 'fas fa-sun',
        'Mist': 'fas fa-smog',
        'Thunderstorm': 'fas fa-thunderstorm',
        'Drizzle': 'fas fa-thunderstorm', // Example, change to the appropriate class
        'Default': 'fas fa-cloud-sun' // Example, change to the appropriate class
    };

    // Use the corresponding class for the weather status or fallback to the default class
    return iconClasses[classArg] || iconClasses['Default'];
}

function reset() {
    let input = document.getElementById('input-box');
    input.value = "";
}

// Function to add zero if hour and minute are less than 10
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
