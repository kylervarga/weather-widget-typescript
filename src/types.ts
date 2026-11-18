// Weather condition information
export interface WeatherCondition {
    text: string;
    icon: string;
}

// Current weather information
export interface CurrentWeather {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_kph: number;
    condition: WeatherCondition;
}

// Daily weather information
export interface DailyWeather {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: WeatherCondition;
}

// Forecast information for one day
export interface ForecastDay {
    date: string;
    day: DailyWeather;
    hour: HourlyWeather[];
}

// Hourly weather information
export interface HourlyWeather {
    time: string;
    temp_c: number;
    condition: WeatherCondition;
}

// Location information 
export interface WeatherLocation {
    name: string;
    region: string;
    country: string;
}

// Forecast data
export interface WeatherForecast {
    forecastday: ForecastDay[];
}

// Complete WeatherAPI response
export interface WeatherResponse {
    location: WeatherLocation;
    current: CurrentWeather;
    forecast: WeatherForecast;
}

// format daily weather data for display
export interface FormattedWeather {
    day: string;
    condition: string;
    temp_c: number;
    icon: string;
}

// formatted hourly weather data for display

export interface FormattedHourlyWeather {
    time: string;
    condition: string;
    temp_c: number;
    icon: string;
}