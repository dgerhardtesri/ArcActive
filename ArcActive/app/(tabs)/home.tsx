import React, { useState } from 'react';
import { Image, StyleSheet, Platform, Button, TextInput, View, Alert, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchWeatherData } from '@/views/apis/GetWeather';
import WeatherAirQualityComponent from "@/components/WeatherAirQualityComponent";
import {isGoodToStart} from "@/utils/tools";

export default function HomeScreen() {
  const [showWarning, setShowWarning] = useState(false);

  const onClickStart = async () => {
    let result: boolean = await isGoodToStart();
    if (result) {
      console.log("Good to start");
    } else {
      console.error("Not good to start");
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
    }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">ArcActive</ThemedText>
        <HelloWave/>
      </ThemedView>
      <WeatherAirQualityComponent/>
      <Button
        onPress={onClickStart}
        title="Start Running"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      {showWarning && <Text style={styles.warningText}>Running not recommended given the weather!</Text>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  warningText: {
    marginTop: 20,
    color: '#d9534f',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#d9534f',
    borderRadius: 10,
    backgroundColor: '#f9e0e0',
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
