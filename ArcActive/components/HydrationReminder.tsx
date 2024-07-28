// HydrationReminder.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateHydrationInterval } from '../views/calculateHydrationInterval';

const HydrationReminder: React.FC = () => {
    const [hydrationInterval, setHydrationInterval] = useState<number | null>(null);

    useEffect(() => {
        // Fetch the hydration interval when the component mounts
        const interval = calculateHydrationInterval({
            weight: 154, // in pounds
            height: 69, // in inches
            temperature: 77, // in Fahrenheit
            distance: 6.2, // in miles
            totalAscent: 656, // in feet
            totalDescent: 656 // in feet
        });
        setHydrationInterval(interval);
    }, []);

    if (hydrationInterval === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Hydration Reminder</Text>
            <Text style={styles.interval}>Drink water every {hydrationInterval} minutes</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2e86de',
        marginBottom: 20,
    },
    interval: {
        fontSize: 18,
        color: '#34495e',
    },
    text: {
        fontSize: 18,
        color: '#34495e',
    },
});

export default HydrationReminder;
