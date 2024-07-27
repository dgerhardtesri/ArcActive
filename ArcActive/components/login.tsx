import React, { useState } from 'react';
import { StyleSheet, Image, View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface LoginScreenProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginScreen({ setLoggedIn }: LoginScreenProps) {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
      />
      <ThemedText type="title" style={styles.titleText}>Welcome!</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitleText}>Please Log In.</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          // Handle login logic here
          setLoggedIn(true);
        }}
      >
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => {
          // Handle sign up navigation here
          console.log('Navigate to Sign Up screen');
        }}
      >
        <Text style={styles.signUpButtonText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  titleText: {
    color: '#333',
    fontSize: 32,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#666',
    fontSize: 18,
    marginBottom: 32,
  },
  checkbox: {
    marginRight: 8,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButton: {
    marginTop: 16,
  },
  signUpButtonText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});