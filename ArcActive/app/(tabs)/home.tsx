import React, { useState } from 'react';
import { Image, StyleSheet, Platform, Button, TextInput, View, Alert, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchWeatherData } from '@/views/apis/GetWeather';
import WeatherAirQualityComponent from "@/components/WeatherAirQualityComponent";
import HydrationReminder from "@/components/HydrationReminder";
import {isGoodToStart} from "@/utils/tools";

export default function HomeScreen() {
  const [showWarning, setShowWarning] = useState(false);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [runningVolume, setRunningVolume] = useState('');

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

  const handleNextPress = async () => {
    const healthData = {
      age,
      height,
      weight,
      activityLevel,
      runningVolume,
    };

    // Save each value in SecureStore
    try {
      window.localStorage.setItem('age', age);
      window.localStorage.setItem('height', height);
      window.localStorage.setItem('weight', weight);
      window.localStorage.setItem('activityLevel', activityLevel);
      window.localStorage.setItem('runningVolume', runningVolume);

      // await SecureStore.setItemAsync('age', age);
      // await SecureStore.setItemAsync('height', height);
      // await SecureStore.setItemAsync('weight', weight);
      // await SecureStore.setItemAsync('activityLevel', activityLevel);
      // await SecureStore.setItemAsync('runningVolume', runningVolume);
      console.log('Health data saved successfully');
    } catch (error) {
      console.error('Error saving health data', error);
    }

    Alert.alert("Health Data", JSON.stringify(healthData, null, 2));
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
      <WeatherAirQualityComponent/>
      <Button
        onPress={onClickStart}
        title="Start"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      {showWarning && <Text style={styles.warningText}>Don't run</Text>}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">ArcActive</ThemedText>
        <HelloWave />
      </ThemedView>
        <HydrationReminder/>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Activity Level"
          value={activityLevel}
          onChangeText={setActivityLevel}
        />
        <TextInput
          style={styles.input}
          placeholder="Running Volume"
          value={runningVolume}
          onChangeText={setRunningVolume}
          keyboardType="numeric"
        />
        <Button
          onPress={handleNextPress}
          title="Next"
          color="#841584"
        />
      </ThemedView>
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
