import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import RoutePlanner from '../../components/RoutePlanner';
import ArcGISMap from '@/components/ArcGISMap';

export default function PlanRouteScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Plan Route</ThemedText>
      </ThemedView>
      <RoutePlanner />
      <ArcGISMap />
      <ThemedText>This app includes example code to help you get started.</ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
});