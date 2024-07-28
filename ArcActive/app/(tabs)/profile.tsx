import {Image, StyleSheet, Platform, TextInput, Alert} from 'react-native';
import {ScrollView, View, Text} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import React, {useState} from "react";
import {Form, Input, Radio, Selector, Space, Button} from 'antd-mobile'

export default function StartActivityScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState(0);
  const [weeklyVolume, setWeeklyVolume] = useState(0);

  const activityLevelOptions = [
    {
      label: 'Low',
      description: 'Chill',
      value: 1,
    },
    {
      label: 'Medium',
      description: 'Regular',
      value: 2,
    },
    {
      label: 'High',
      description: 'Tense',
      value: 3,
    },
  ]

  const volumeOptions = [
    {
      label: 'Low',
      description: '3 mi/wk',
      value: 1,
    },
    {
      label: 'Medium',
      description: '5 mi/wk',
      value: 2,
    },
    {
      label: 'High',
      description: '10 mi/wk',
      value: 3,
    },
  ]

  const onSubmit = async () => {
    const healthData = {
      age,
      height,
      weight,
      activityLevel,
      runningVolume: weeklyVolume,
    };

    // Save each value in SecureStore
    try {
      window.localStorage.setItem('age', age);
      window.localStorage.setItem('height', height);
      window.localStorage.setItem('weight', weight);
      window.localStorage.setItem('activityLevel', activityLevel.toString());
      window.localStorage.setItem('runningVolume', weeklyVolume.toString());

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
  console.log('activity', activityLevel, 'weekly volume', weeklyVolume);
  return (
    <>
      <Form
        layout='horizontal'
        footer={
          <Button block type='submit' color='primary' size='large' onClick={onSubmit}>
            Submit
          </Button>
        }
      >
        <Form.Item label='Age' name='Age'>
          <Input
            value={age}
            onChange={setAge}
            clearable
          />
        </Form.Item>
        <Form.Item label='Height' name='Height'>
          <Input
            value={height}
            onChange={setHeight}
            placeholder={'cm'}
            clearable
          />
        </Form.Item>
        <Form.Item label='Weight' name='Weight'>
          <Input
            value={weight}
            onChange={setWeight}
            placeholder={'kg'}
            clearable
          />
        </Form.Item>
        <Form.Item label='Level' name='Activity Level'>
          <Selector
            style={{
              '--border-radius': '100px',
              '--border': 'solid transparent 1px',
              '--checked-border': 'solid var(--adm-color-primary) 1px',
              '--padding': '8px 24px',
            }}
            options={activityLevelOptions}
            onChange={(arr) => setActivityLevel(arr[0])}
          />
        </Form.Item>
        <Form.Item label='Volumn' name='Weekly Volumn'>
          <Selector
            style={{
              '--border-radius': '100px',
              '--border': 'solid transparent 1px',
              '--checked-border': 'solid var(--adm-color-primary) 1px',
              '--padding': '8px 24px',
            }}
            options={volumeOptions}
            onChange={(arr) => setWeeklyVolume(arr[0])}
          />
        </Form.Item>
      </Form>
    </>
    // <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    //   <ThemedView style={styles.inputContainer}>
    //
    //     {/*<TextInput*/}
    //     {/*  style={styles.input}*/}
    //     {/*  placeholder="Age"*/}
    //     {/*  value={age}*/}
    //     {/*  onChangeText={setAge}*/}
    //     {/*  keyboardType="numeric"*/}
    //     {/*/>*/}
    //
    //     {/*<TextInput*/}
    //     {/*  style={styles.input}*/}
    //     {/*  placeholder="Height"*/}
    //     {/*  value={height}*/}
    //     {/*  onChangeText={setHeight}*/}
    //     {/*  keyboardType="numeric"*/}
    //     {/*/>*/}
    //     {/*<TextInput*/}
    //     {/*  style={styles.input}*/}
    //     {/*  placeholder="Weight"*/}
    //     {/*  value={weight}*/}
    //     {/*  onChangeText={setWeight}*/}
    //     {/*  keyboardType="numeric"*/}
    //     {/*/>*/}
    //     {/*<TextInput*/}
    //     {/*  style={styles.input}*/}
    //     {/*  placeholder="Activity Level"*/}
    //     {/*  value={activityLevel}*/}
    //     {/*  onChangeText={setActivityLevel}*/}
    //     {/*/>*/}
    //     {/*<TextInput*/}
    //     {/*  style={styles.input}*/}
    //     {/*  placeholder="Running Volume"*/}
    //     {/*  value={runningVolume}*/}
    //     {/*  onChangeText={setRunningVolume}*/}
    //     {/*  keyboardType="numeric"*/}
    //     {/*/>*/}
    //     <Button
    //       onPress={handleNextPress}
    //       title="Next"
    //       color="#841584"
    //     />
    //   </ThemedView>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: 50, // Adjust the padding as needed
  },
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