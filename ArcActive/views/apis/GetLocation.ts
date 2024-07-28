import Geolocation from '@react-native-community/geolocation';

export async function fetchLocation(): Promise<{ latitude: number, longitude: number }> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      location => {
        resolve({latitude: location.coords.latitude, longitude: location.coords.longitude});
      },
      error => {
        console.error('Error fetching location:', error);
        reject(null);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    );
  });
}

