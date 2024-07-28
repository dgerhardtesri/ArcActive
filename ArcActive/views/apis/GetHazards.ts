import {TOMTOM_KEY, HAZARD_CODE} from "@/constants/constants";
import axios from "axios";

export async function fetchHazardsData(minLon: number, minLat: number, maxLon: number, maxLat: number) {
  const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_KEY}&bbox=${minLon},${minLat},${maxLon},${maxLat}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory}}}&language=en-US&timeValidityFilter=present`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data && data.incidents) {
      return data.incidents.map((incident: any) =>
        ({
          "type": HAZARD_CODE[incident.properties.iconCategory],
          "geometry": incident.geometry,
        }));
    }
  } catch (error) {
    console.error('Error fetching hazards data:', error);
    return [];
  }

  console.log('No hazards data found');

  return [];
}