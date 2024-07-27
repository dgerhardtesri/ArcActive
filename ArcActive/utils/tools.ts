import {fetchLocation} from "@/views/apis/GetLocation";
import {fetchAirQualityData} from "@/views/apis/GetAirQuality";
import {fetchHazardsData} from "@/views/apis/GetHazards";
import {fetchHeartBeatData} from "@/views/apis/GetHeartBeat";
import {fetchWeatherData} from "@/views/apis/GetWeather";

export async function isGoodToStart(): Promise<boolean> {
  const {latitude, longitude} = await fetchLocation();
  const aqi = await fetchAirQualityData(latitude, longitude);
  // const hazardList = await fetchHazardsData(longitude - 0.1, latitude- 0.1, longitude + 0.1, latitude + 0.1);
  // const heartbeat = await fetchHeartBeatData();
  const weather = await fetchWeatherData(latitude, longitude);
  for (const data of weather.slice(0, 3)) {
    if (data.probabilityOfPrecipitation.value > 30) {
      console.log("Bad weather");
      return false;
    }
    if (data.temperature > 90) {
      console.log("Too hot");
      return false;
    }
  }
  if (aqi > 100) {
    console.log("Bad air quality");
    return false;
  }

  return true;
}