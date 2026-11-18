//get HTML elements
const forecast = document.getElementById("forecast");
const loadingMessage = document.getElementById("status");
const tempToggle = document.getElementById("tempToggle");
const currentWeatherContent = document.getElementById("currentWeatherContent");
const hourlyForecast = document.getElementById("hourlyForecast");
// track the selected temp unit
let isCelsius = true;
// store the complete weather response from the API
let currentWeatherData = null;
//store formatted daily forecast
let weatherData = [];
//store formatted hourly forecast data
let hourlyWeatherData = [];
//code review:the API key is currently included in the frontend code move this 
const weatherURL = "https://api.weatherapi.com/v1/forecast.json?key=5cd2062afeb94a1b91500232262110&q=Calgary&days=3";
// convert and format temp
// code review: both temperature united are rounded consistently 
// future improvement: more temp conversion into separate
function convertTemperature(celsius) {
    if (isCelsius) {
        const roundedCelsius = Math.round(celsius);
        return `${roundedCelsius}°C`;
    }
    else {
        const fahrenheit = (celsius * 9) / 5 + 32;
        const roundedFahrenheit = Math.round(fahrenheit);
        return `${roundedFahrenheit}°F`;
    }
}
function displayCurrentWeather(data) {
    // Check that the current weather container exists
    if (!currentWeatherContent) {
        return;
    }
    const current = data.current;
    const temperature = convertTemperature(current.temp_c);
    const condition = current.condition.text;
    const icon = current.condition.icon;
    const feelsLike = convertTemperature(current.feelslike_c);
    const humidity = current.humidity;
    const windSpeed = current.wind_kph;
    currentWeatherContent.innerHTML = `
        <img
            src="https:${icon}"
            alt="${condition}"
            class="w-28 h-28 mx-auto"
        >

        <p class="text-5xl font-bold mb-3">
            ${temperature}
        </p>

        <p class="text-xl">
            ${condition}
        </p>
    
    <div class="grid grid-cols-3 gap-2 sm:gap-4 mt-8">

    <div class="bg-white/10 rounded-2xl p-4">
        <p class="text-sm text-white/70 mb-2">Feels Like</p>
        <p class="text-2xl font-bold">${feelsLike}</p>
    </div>

    <div class="bg-white/10 rounded-2xl p-4">
        <p class="text-sm text-white/70 mb-2">Humidity</p>
        <p class="text-2xl font-bold">${humidity}%</p>
    </div>

    <div class="bg-white/10 rounded-2xl p-4">
        <p class="text-sm text-white/70 mb-2">Wind Speed</p>
        <p class="text-2xl font-bold">${windSpeed} km/h</p>
    </div>
</div>
`;
}
function createWeatherCard(weather) {
    return `
        <article class="bg-white/15 backdrop-blur-lg border border-white/30 p-5 md:p-8 rounded-3xl shadow-xl text-center text-white hover:bg-white/25 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <h3 class="text-xl font-bold mb-3">
                ${weather.day}
            </h3>

            <img
                src="https:${weather.icon}"
                alt="${weather.condition}"
                class="w-24 h-24 mx-auto mb-4"
            >

            <p class="text-lg mb-3">
                ${weather.condition}
            </p>

            <p class="text-4xl font-bold text-white">
                ${convertTemperature(weather.temp_c)}
            </p>
        </article>
    `;
}
function createHourlyCard(hour) {
    return `
        <article class="bg-white/15 backdrop-blur-lg border border-white/30 rounded-2xl p-5 text-center text-white shadow-lg min-w-32 flex-shrink-0">

            <h3 class="text-lg font-bold mb-3">
                ${hour.time}
            </h3>

            <img
                src="https:${hour.icon}"
                alt="${hour.condition}"
                class="w-16 h-16 mx-auto mb-3"
            >

            <p class="text-2xl font-bold mb-2">
                ${convertTemperature(hour.temp_c)}
            </p>

            <p class="text-sm">
                ${hour.condition}
            </p>

        </article>
    `;
}
function renderWeather(weatherData) {
    if (!forecast || !loadingMessage) {
        return;
    }
    forecast.innerHTML = "";
    weatherData.forEach((weather) => {
        const card = createWeatherCard(weather);
        forecast.insertAdjacentHTML("beforeend", card);
    });
    loadingMessage.textContent = "";
}
function renderHourlyWeather(hourlyData) {
    if (!hourlyForecast) {
        return;
    }
    hourlyForecast.innerHTML = "";
    hourlyData.forEach((hour) => {
        const card = createHourlyCard(hour);
        hourlyForecast.insertAdjacentHTML("beforeend", card);
    });
}
//code review: the tempature toggle updates all weather displays using the data alreadt stored in memort, avoiding unnecessary API requests
if (tempToggle) {
    tempToggle.addEventListener("click", () => {
        isCelsius = !isCelsius;
        tempToggle.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
        if (currentWeatherData) {
            displayCurrentWeather(currentWeatherData);
        }
        renderWeather(weatherData);
        renderHourlyWeather(hourlyWeatherData);
    });
}
// code: review: the fetchWeather function uses async/await and try/catch
// to handle API requests and erros 
//future improvement: validate the API response data at run time
// before using it to prevent unexpected data from causing errors
async function fetchWeather() {
    try {
        const response = await fetch(weatherURL);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching weather:", error.message);
        }
        else {
            console.error("Unknown error fetching weather:", error);
        }
        throw error;
    }
}
// code review: this function seperates API data formatting from HTML rendering, making the code easier to read and maintain 
//future improvement: move data formatting function into a seperate TypeScript module to improve code organization and reusability
function formatWeatherData(data) {
    const forecastDays = data.forecast.forecastday;
    const formattedData = forecastDays.map((day) => {
        const date = new Date(day.date + "T12:00:00");
        const dayName = date.toLocaleDateString("en-CA", {
            weekday: "long",
        });
        return {
            day: dayName,
            condition: day.day.condition.text,
            temp_c: day.day.avgtemp_c,
            icon: day.day.condition.icon,
        };
    });
    return formattedData;
}
//code review: this function converts hourly API into a format that can be displayed in the hourly forcast cards
//future improvement: filter the hourly forecast to display only upcoming house instead of every hour from the first forcast day 
// Format API data for the hourly forecast cards
function formatHourlyData(data) {
    // Get the first day of forecast data
    const firstDay = data.forecast.forecastday[0];
    // Check that the forecast day exists
    if (!firstDay) {
        return [];
    }
    const hourlyData = firstDay.hour;
    const formattedHours = hourlyData.map((hour) => {
        const time = hour.time.split(" ")[1] ?? hour.time;
        return {
            time: time,
            condition: hour.condition.text,
            temp_c: hour.temp_c,
            icon: hour.condition.icon,
        };
    });
    return formattedHours;
}
//// code review: the loadweather function handles errors and displays a message when weather data cannot be retrieved
//fture improvement: display more specific error messages and provide a rety button so users can reload the forcast
async function loadWeather() {
    try {
        const data = await fetchWeather();
        currentWeatherData = data;
        weatherData = formatWeatherData(data);
        hourlyWeatherData = formatHourlyData(data);
        displayCurrentWeather(data);
        renderWeather(weatherData);
        renderHourlyWeather(hourlyWeatherData);
    }
    catch (error) {
        if (loadingMessage) {
            loadingMessage.textContent = "unable to load weather data.";
        }
        console.error("Unable to load weather", error);
    }
}
loadWeather();
export {};
//# sourceMappingURL=index.js.map