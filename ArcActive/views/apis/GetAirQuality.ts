import {AIRNOW_KEY} from '@/constants/constants';
import {getDateFormatted} from '@/utils/date';
import axios from "axios";

export async function fetchAirQualityData(latitude: number, longitude: number): Promise<number> {
  const date = new Date();
  const dateFormatted = getDateFormatted(date);

  const url = `https://www.airnowapi.org/aq/forecast/latLong/?format=application/json&latitude=${latitude}&longitude=${longitude}&date=${dateFormatted}&distance=25&API_KEY=${AIRNOW_KEY}`;

  let aqiData = null;

  try {
    const response = await axios.get(url);
    aqiData = response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return 0;
  }

  if (!aqiData) {
    console.error('aqiData not found in the response');
    return 0;
  }

  // get AQI
  let highestAqi = 0;

  for (const data of aqiData) {
    if (data.AQI && data.AQI > highestAqi)
      highestAqi = data.AQI;
  }

  return highestAqi;
}