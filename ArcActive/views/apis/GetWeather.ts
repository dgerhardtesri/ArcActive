import axios from 'axios';

// return as an array, forecast from now on, hr by hr, 6.5 days (156 hours) in total
// [
//     {
//         "number": 1,
//         "name": "",
//         "startTime": "2024-07-26T19:00:00-07:00",
//         "endTime": "2024-07-26T20:00:00-07:00",
//         "isDaytime": false,
//         "temperature": 90,
//         "temperatureUnit": "F",
//         "temperatureTrend": "",
//         "probabilityOfPrecipitation": {
//             "unitCode": "wmoUnit:percent",
//             "value": 0
//         },
//         "dewpoint": {
//             "unitCode": "wmoUnit:degC",
//             "value": 15
//         },
//         "relativeHumidity": {
//             "unitCode": "wmoUnit:percent",
//             "value": 35
//         },
//         "windSpeed": "10 mph",
//         "windDirection": "W",
//         "icon": "https://api.weather.gov/icons/land/night/skc?size=small",
//         "shortForecast": "Clear",
//         "detailedForecast": ""
//     },
// ]
export async function fetchWeatherData(latitude: number, longitude: number) {
    const url = `https://api.weather.gov/points/${latitude},${longitude}`;

    let forecastGridUrl = null;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data && data.properties)
            forecastGridUrl = data.properties.forecastHourly;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }

    if (!forecastGridUrl) {
        console.error('forecast url not found in the response');
        return null;
    }

    // Call the next API to get the forecast data

    let forecastData = null;

    try {
        const response = await axios.get(forecastGridUrl);
        const data = response.data;
        console.log(data)
        if (data && data.properties && data.properties.periods) {
            forecastData = data.properties.periods;
        } else {
            console.error('forecastData not found in the response');
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }

    if (!forecastData) {
        console.error('forecastData not found in the response');
        return null;
    }

    return forecastData;
}

