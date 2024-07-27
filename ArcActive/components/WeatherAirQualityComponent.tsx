// WeatherAirQualityComponent.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Image } from 'react-native';
import { fetchAirQualityData } from '../views/apis/GetAirQuality';
import { fetchWeatherData } from '../views/apis/GetWeather';

const WeatherAirQualityComponent: React.FC = () => {
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [airQuality, setAirQuality] = useState<number | null>(null);
    const [weather, setWeather] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleFetchData = async () => {
        if (!latitude || !longitude) {
            setErrorMsg('Please enter valid latitude and longitude');
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            const airQualityData = await fetchAirQualityData(lat, lon);
            setAirQuality(airQualityData);

            const weatherData = await fetchWeatherData(lat, lon);
            setWeather(weatherData);

        } catch (error) {
            setErrorMsg('Error fetching data. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Latitude and Longitude</Text>
            <TextInput
                style={styles.input}
                placeholder="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
            />
            <Button title="Fetch Data" onPress={handleFetchData} />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

            {!loading && airQuality !== null && (
                <Text style={styles.title}>Air Quality Index: {airQuality}</Text>
            )}

            {!loading && weather.length > 0 && (
                <View style={styles.weatherContainer}>
                    <Text style={styles.title}>Weather Forecast:</Text>
                    {weather.slice(0, 5).map((forecast, index) => (
                        <View key={index} style={styles.forecastContainer}>
                            <Image source={{ uri: forecast.icon }} style={styles.icon} />
                            <Text>{forecast.shortForecast}</Text>
                            <Text>{forecast.temperature} {forecast.temperatureUnit}</Text>
                            <Text>{forecast.windSpeed} {forecast.windDirection}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    weatherContainer: {
        width: '100%',
        marginTop: 20,
    },
    forecastContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    icon: {
        width: 50,
        height: 50,
    },
    error: {
        color: 'red',
        marginVertical: 10,
    },
});

export default WeatherAirQualityComponent;
