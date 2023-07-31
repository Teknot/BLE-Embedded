import React, {createContext, useContext, useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import navigationString from './src/utils/navigationString';
import Splash from './src/screens/SplashScreen';
import ConnectScreen from './src/screens/ConnectScreen';
import {DeviceContext} from './src/utils/context';
import LightScreen from './src/screens/topBar/LightScreen';
import BatteryScreen from './src/screens/topBar/BatteryScreen';
import OrientationScreen from './src/screens/topBar/OrientationScreen';


const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1480F3',
        },
        tabBarLabelStyle: {color: '#FFFFFF', fontSize: 14},
        tabBarIndicatorStyle: {bottom:-3,height: 3, backgroundColor: '#0A66C9'},
      }}>
      <Tab.Screen name={navigationString.LIGHT} component={LightScreen} />
      <Tab.Screen name={navigationString.BATTERY} component={BatteryScreen} />
      <Tab.Screen name={navigationString.ORIENTATION} component={OrientationScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [deviceId, setDeviceId] = useState(null);

  const contextValue = {
    deviceId,
    setDeviceId,
  };

//   useEffect(() => {
//     console.log(deviceId)
//   }, [deviceId])
  

  return (
    <DeviceContext.Provider value={contextValue}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name={navigationString.SplashScreen}
            component={Splash}
          />
          <Stack.Screen
            name={navigationString.ConnectScreen}
            component={ConnectScreen}
          />
          <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </DeviceContext.Provider>
    
  );
}
