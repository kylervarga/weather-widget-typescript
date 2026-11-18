# weather forecast widget

## project overview

This project is a Weather Forecast Widget developed for CPRG-309 Web Application Development at SAIT.

The widget displays a three-day weather forecast for Calgary, Alberta, using real weather data retrieved from WeatherAPI.

The purpose of this assignment is to practise asynchronous JavaScript, API integration, dynamic content rendering, and responsive web design.

## features 

- Displays a three-day weather forecast for Calgary.
- Shows the day of the week, weather conditions, and average temperature.
- Displays weather icons that match the forecast conditions.
- Allows users to toggle between Celsius and Fahrenheit.
- Uses asynchronous JavaScript to retrieve weather information.
- Includes error handling when weather information cannot be retrieved.


## technologies used 

- html 
- tailwind css
- javasctipt 
- weather API
- node.js and npm

## how the widget works

When the webpage loads, JavaScript uses `fetch()` and `async/await` to request forecast information from WeatherAPI.

The returned JSON data is formatted and displayed in individual weather cards. Each card includes the day, weather condition, icon, and temperature.

Users can switch between Celsius and Fahrenheit by clicking the temperature toggle button.

## API information

This project uses [WeatherAPI](https://www.weatherapi.com/) to retrieve weather forecast information.

The widget displays a three-day forecast based on the API access available for this project.

## resources and Attributes


- [WeatherAPI](https://www.weatherapi.com/) - Weather forecast data and weather condition icons.
- [Tailwind CSS](https://tailwindcss.com/) - CSS utility framework.

## AI usage disclaimer

ChatGPT Was used as a learnign and development aid during this assignment

AI assistance included:
- explained JavaScript concepts and functions
- providing guidance with asynchronous programming and API intergration
- assisting with troubleshooting and debugging
- helping the organization of the documents 

## author 

created for CRPG-309 programming languages at SAIT

## installation and Setup 

1. clone or download the github repoitory
2. open the project folder in VS Code
3. open the terminal and install dependencies:
    npm install
4. compile tailwind CSS, run
    npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --watch
5. configure a valid WeatherAPI key for local testing 
6. open index.html in a web browser

## testing and debugging

the following functionality was tested during development 

- weather forecast cards display correctly 
- weather data is reterived from weatherAPI
- weather icons display according to the forecast
- weather cards remain visable when switching temperature units
- browser console was used to identift and trouble Javascript errors

resposive design should also be tested on different sizes



## Project Limitations

- The widget displays a three-day forecast based on the WeatherAPI access available for this project.
- The forecast is currently set to Calgary, Alberta.
- An internet connection is required to retrieve weather information.
- The widget requires a valid WeatherAPI key to retrieve forecast data.


## Refractored weather widget Typescript

For Assignment 3.2, the original weather forecast widget developed in JavaScript was refactored using TypeScript.

The purpose of this assignment was to practice working with a different programming language while improving code organization type safety, readability, and maintainability.

The widget continues to display current weather conditions, an hourly forecast, and a three-day forecast for Calgary, Alberta. Users can also switch between Celsius and Fahrenheit.


## TypeScript Refactoring

The following improvements were made when converting the original
JavaScript weather widget into TypeScript:

- Converted the original JavaScript code into TypeScript.
- Created a separate `types.ts` file to organize interfaces.
- Added type annotations to variables, function parameters, and return values.
- Created interfaces to define the structure of the WeatherAPI response.
- Added checks to ensure HTML elements exist before updating them.
- Organized the code into functions for fetching, formatting, and displaying weather data.
- Used TypeScript's strict type checking to identify potential errors.
- Added inline code-review comments to identify improvements in readability, performance, and maintainability.
- Preserved the original weather widget functionality, including the Celsius and Fahrenheit temperature toggle.

# Technologys Used

- TypeScript: Used to add type safety, interfacesm and improve code organization.
- JavaScript : Generated from TypeScript to run the application in the browser.
- HTML: Used to structure the weather widget.
- Tailwind CSS: Used to create the responsive design and styling.
- WeatherAPI: Uesed to create the responsive design and styling.
- Node.js and npm: Used to manage project dependencies and run build commands.
- Visual Studio Code: Used to deelop and organize the project.
- Prettier Code Formatter: Used to maintain consistent code formatting.

# Compliling TypeScript

The TypeScript sourse files are located int the 'src' folder.

To compile the TypeScript code, open the terminal in the project file and run:

    npm run build

This comand used the Typescrip compiler ('tsc') to connvert the TypeScript files into JavaScript.

The compiled JavaScript files are generated in the 'dist' folder.

The 'index.html' file uses the compiled JavaScript to run the weather widget in the browser.


# Testing and Debugging

The following functionality was tested during development:

- TypeScript compiled successfully using `npm run build` without errors.
- Current weather conditions displayed correctly using WeatherAPI.
- Three-day weather forecast cards displayed correctly.
- Hourly weather forecast cards displayed correctly.
- Weather icons displayed according to the forecast conditions.
- Celsius and Fahrenheit temperature conversion worked correctly.
- Switching temperature units updated all weather displays without making additional API requests.
- The widget displayed correctly on desktop and mobile screen sizes.
- Browser developer tools were used to identify and troubleshoot errors.

The following improvements were identified during the TypeScript
code review to improve functionality, performance, security,
and user experience.

## AI Usage

- ChatGPT was used as a learning and a resource during this TypeScript refactoring process

AI assistance included

- explaining TypeScrip concepts and interfaces
- providing guidence when a lack of understanding was happening 
- helping touble shooting Typescript in compilation errors
- guidence on code and file organization