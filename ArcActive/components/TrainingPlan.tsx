import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface TrainingPlanProps {}

const TrainingPlan: React.FC<TrainingPlanProps> = () => {
    const [raceType, setRaceType] = useState<string>('');
    const [mileTime, setMileTime] = useState<string>('');
    const [runningVolume, setRunningVolume] = useState<string>('');
    const [timeBeforeRace, setTimeBeforeRace] = useState<string>('');
    const [plan, setPlan] = useState<Array<{ day: number; distance: string; exertion: string }>>([]);

    const generatePlan = () => {
        const days = parseInt(timeBeforeRace, 10);
        const generatedPlan = [];

        for (let i = 1; i <= days; i++) {
            if (i % 7 === 0 || i % 7 === 6) {
                generatedPlan.push({ day: i, distance: 'Rest', exertion: 'Rest' });
            } else {
                const distance = (parseFloat(runningVolume) / 7).toFixed(2);
                const exertion = i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low';
                generatedPlan.push({ day: i, distance: `${distance} miles`, exertion });
            }
        }

        setPlan(generatedPlan);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Your Training Plan</Text>

            <Text style={styles.label}>Race Type</Text>
            <RNPickerSelect
                onValueChange={(value) => setRaceType(value)}
                items={[
                    { label: '5k', value: '5k' },
                    { label: '10k', value: '10k' },
                    { label: 'Marathon', value: 'Marathon' },
                ]}
                style={pickerSelectStyles}
            />

            <Text style={styles.label}>Current Mile Time (minutes)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={mileTime}
                onChangeText={setMileTime}
            />

            <Text style={styles.label}>Running Volume (miles per week)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={runningVolume}
                onChangeText={setRunningVolume}
            />

            <Text style={styles.label}>Time Before Race (days)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={timeBeforeRace}
                onChangeText={setTimeBeforeRace}
            />

            <Button title="Generate Plan" onPress={generatePlan} />

            {plan.length > 0 && (
                <View style={styles.planContainer}>
                    <Text style={styles.planTitle}>Your Training Plan</Text>
                    {plan.map((dayPlan, index) => (
                        <View key={index} style={styles.planItem}>
                            <Text>Day {dayPlan.day}: {dayPlan.distance}, Exertion: {dayPlan.exertion}</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 8,
        borderRadius: 5,
    },
    planContainer: {
        marginTop: 30,
    },
    planTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    planItem: {
        marginBottom: 10,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },
    inputAndroid: {
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },
});

export default TrainingPlan;
