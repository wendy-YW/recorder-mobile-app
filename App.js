import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import MainContainer from './src/MainContainer';
import 'react-native-get-random-values';

import { Home } from "./src/screens";
import RecordFormPage from './src/screens/RecordFormPage';
import SettingPage from './src/screens/SettingPage';
import ProjectsItemsPage from './src/screens/ProjectsItemsPage';


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 1000);

let customFonts = {
  'Inter-ExtraBold': require('./src/assets/fonts/Inter-ExtraBold.otf'),
  'Inter-Black': require('./src/assets/fonts/Inter-Black.otf'),
  'Inter-Bold': require('./src/assets/fonts/Inter-Bold.otf'),
  'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.otf'),
  'Inter-Light': require('./src/assets/fonts/Inter-Light.otf'),
  'Inter-Medium': require('./src/assets/fonts/Inter-Medium.otf'),
  'Inter-Regular': require('./src/assets/fonts/Inter-Regular.otf'),
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  }
}

const Stack = createStackNavigator();

export default class App extends React.Component {

  state = {
    fontsLoaded: false,
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return null;
    }

    return (
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
          {/* <Stack.Screen name="Home" component={Home} /> */}
          <Stack.Screen name="Main" component={MainContainer} />
          <Stack.Screen name="RecordForm" component={RecordFormPage} />
          <Stack.Screen
            name="Settings"
            component={SettingPage}
          />
           <Stack.Screen
            name="ProjectsItems"
            component={ProjectsItemsPage}
          />

        </Stack.Navigator>
      </NavigationContainer>

    );
  }
}
