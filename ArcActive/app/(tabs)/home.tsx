import {Image, StyleSheet, Platform, Button, Text} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {fetchWeatherData} from '@/views/apis/GetWeather';
import WeatherAirQualityComponent from "@/components/WeatherAirQualityComponent";
import {isGoodToStart} from "@/utils/tools";
import {useState} from "react";

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
});
