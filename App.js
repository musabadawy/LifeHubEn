import React, { useState } from 'react';
import { Provider as PaperProvider, DarkTheme, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './screens/Login';
import Register from './screens/Register';
import Profile from './screens/Profile';
import QRScanner from './screens/QRScanner';

const Drawer = createDrawerNavigator();

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <PaperProvider theme={darkMode ? DarkTheme : DefaultTheme}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Login">
          <Drawer.Screen name="Login" component={Login} />
          <Drawer.Screen name="Register" component={Register} />
          <Drawer.Screen name="Profile">
            {props => <Profile {...props} toggleTheme={() => setDarkMode(!darkMode)} />}
          </Drawer.Screen>
          <Drawer.Screen name="QR Scanner" component={QRScanner} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}