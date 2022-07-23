import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getTheme from './native-base-theme/components';
import dark from './native-base-theme/variables/dark';
import light from './native-base-theme/variables/light';
import { StyleProvider, Root } from 'native-base';
import { clearThemeCache } from 'native-base-shoutem-theme';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import ThemeContext from './src/context/ThemeContext';
import defaultSettings from './src/config/defaultSettings';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import EditUserScreen from './src/screens/EditUserScreen';
import { refreshTables, createTables } from './src/database/migrations';
import * as Query from './src/database/query';
import * as DatabaseSeeder from './src/database/seed/DatabaseSeeder';
import { localized, setLocale } from './src/localization/Localize';

const Stack = createStackNavigator();

let initialRoute;

const lightTheme = getTheme(light);
const darkTheme = getTheme(dark);


export default function App() {

  const [loading, setLoading] = useState(true);
  const [themeName, setThemeName] = useState('light');
  const [theme, setTheme] = useState(lightTheme);

  // onMount
  useEffect(() => {
    (async () => {
      setLoading(true);

      // await refreshTables();
      // await DatabaseSeeder.seed();
      await createTables();
      // await DatabaseSeeder.seedUser();

      // localstorage default values
      await defaultSettings();

      // default loading=true
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });

      await Query.budgetDay(new moment().format('YYYY-MM-DD'));
      let users = await Query.fetchUsers();

      if (users.length == 0) {
        initialRoute = 'Register';
      }
      else
        initialRoute = 'Login';

      // if (users[0]){
      //   await AsyncStorage.setItem('user', JSON.stringify(users[0]));
      //   initialRoute = 'Main';
      // }

      const locale = await AsyncStorage.getItem('lang');
      setLocale(locale);

      let theme = await AsyncStorage.getItem('theme');
      setTheme(theme === 'light' ? lightTheme : darkTheme);
      setThemeName(theme);
      setLoading(false);
      if (process.env.DEBUG)
        console.log('APP READY');
    })();
  }, []);

  // theme change
  useEffect(() => {
    clearThemeCache();
    setTheme(themeName === 'light' ? lightTheme : darkTheme);
  }, [themeName]);

  if (loading)
    return <LoadingScreen />

  return (
    <ThemeContext.Provider value={[themeName, setThemeName]}>
      <Root>
        <StyleProvider style={theme}>
          <NavigationContainer theme={themeName === 'light' ? DefaultTheme : DarkTheme}>
            <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={SignupScreen} />
              <Stack.Screen name="EditUser" component={EditUserScreen} options={{ headerShown: true, title: localized('editAccount') }} />
            </Stack.Navigator>
          </NavigationContainer>
        </StyleProvider>
      </Root>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
