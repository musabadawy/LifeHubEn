import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Profile');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button mode="contained" onPress={handleLogin}>Login</Button>
      <Button onPress={() => navigation.navigate('Register')}>Register</Button>
    </View>
  );
}
