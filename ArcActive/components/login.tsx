import React from 'react';
import { StyleSheet, Image, View, TextInput, Button } from 'react-native';

interface LoginScreenProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginScreen({ setLoggedIn }: LoginScreenProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      <Button
        title="Log In"
        onPress={() => {
          // Handle login logic here
          setLoggedIn(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});