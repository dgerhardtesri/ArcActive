import React, { useState } from 'react';
import { Image, StyleSheet, Platform, Button, TextInput } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchWeatherData } from '@/views/apis/GetWeather';
import WeatherAirQualityComponent from "@/components/WeatherAirQualityComponent";

export default function HomeScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [runningVolume, setRunningVolume] = useState('');

  return (
      <ParallaxScrollView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
          headerImage={
            <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.reactLogo}
            />
          }
      >
        <WeatherAirQualityComponent />
        <Button
            onPress={() => fetchWeatherData(34.060659, -117.191143)}
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
        />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">ArcActive</ThemedText>
          <HelloWave />
        </ThemedView>
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
