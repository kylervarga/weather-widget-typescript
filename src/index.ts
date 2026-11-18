import type {
  WeatherResponse,
  FormattedWeather,
  FormattedHourlyWeather,
} from "./types";

//get HTML elements
const forecast = document.getElementById("forecast");
const loadingMessage = document.getElementById("status");
const tempToggle = document.getElementById("tempToggle");
const currentWeatherContent = document.getElementById("currentWeatherContent");
const hourlyForecast = document.getElementById("hourlyForecast");

// track the selected temp unit
let isCelsius: boolean = true;
// store the complete weather response from the API
let currentWeatherData: WeatherResponse | null = null;
//store formatted daily forecast
let weatherData: FormattedWeather[] = [];
//store formatted hourly forecast data
let hourlyWeatherData: FormattedHourlyWeather[] = [];

 
// Code review: The WeatherAPI key is currently exposed in the frontend source code, which creates a security risk. (i honestly cant remember where to put this or where this goes)
// Future improvement: Use a backend server to make API requests and keep the API key private.
const weatherURL =
  "https://api.weatherapi.com/v1/forecast.json?key=5cd2062afeb94a1b91500232262110&q=Calgary&days=3";

// Code review: Both Celsius and Fahrenheit temperatures are rounded
// consistently to improve readability and user experience.
// Future improvement: Move temperature conversion into a separate
// TypeScript utility module to improve code organization and reusability.
function convertTemperature(celsius: number): string {
  if (isCelsius) {
    const roundedCelsius = Math.round(celsius);
    return `${roundedCelsius}°C`;
  } else {
    const fahrenheit = (celsius * 9) / 5 + 32;
    const roundedFahrenheit = Math.round(fahrenheit);
    return `${roundedFahrenheit}°F`;
  }
}

function displayCurrentWeather(data: WeatherResponse): void {
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

function createWeatherCard(weather: FormattedWeather): string {
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
function createHourlyCard(hour: FormattedHourlyWeather): string {
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

function renderWeather(weatherData: FormattedWeather[]): void {
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

function renderHourlyWeather(hourlyData: FormattedHourlyWeather[]): void {
  if (!hourlyForecast) {
    return;
  }

  hourlyForecast.innerHTML = "";
  hourlyData.forEach((hour) => {
    const card = createHourlyCard(hour);
    hourlyForecast.insertAdjacentHTML("beforeend", card);
  });
}

// Code review: The temperature toggle updates all weather displays using data already stored in memory instead of making another API request. This improves performance and reduces unnecessary API calls.
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

// Code review: Using async/await with try/catch makes API requests easier to read and helps handle errors when fetching weather data.
// Checking response.ok ensures unsuccessful HTTP responses are caught.
// Future improvement: Display more specific error messages to users based on the type of API error.
async function fetchWeather(): Promise<WeatherResponse> {
  try {
    const response = await fetch(weatherURL);

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching weather:", error.message);
    } else {
      console.error("Unknown error fetching weather:", error);
    }

    throw error;
  }
}

// Code review: This function separates API data formatting from HTML
// rendering, making the code easier to read, test, and maintain.
// Future improvement: Move data formatting into a separate TypeScript
// module to improve code organization and reusability.
function formatWeatherData(data: WeatherResponse): FormattedWeather[] {
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

// Code review: This function converts hourly API data into a simplified format that can be displayed in the hourly forecast cards.
// Future improvement: Filter the hourly forecast to display only upcoming hours instead of every hour from the first forecast day.
function formatHourlyData(data: WeatherResponse): FormattedHourlyWeather[] {
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

// Code review: The loadWeather function retrieves, formats, and displays weather information while handling errors with try/catch. This keeps the main weather-loading process organized and readable.
// Future improvement: Display more specific error messages and
// provide a retry button if the weather data fails to load.
async function loadWeather(): Promise<void> {
  try {
    const data: WeatherResponse = await fetchWeather();

    currentWeatherData = data;

    weatherData = formatWeatherData(data);

    hourlyWeatherData = formatHourlyData(data);

    displayCurrentWeather(data);
    renderWeather(weatherData);
    renderHourlyWeather(hourlyWeatherData);
  } catch (error) {
    if (loadingMessage) {
      loadingMessage.textContent = "unable to load weather data.";
    }
    console.error("Unable to load weather", error);
  }
}

loadWeather();
