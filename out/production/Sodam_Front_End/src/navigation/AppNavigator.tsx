import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HybridMainScreen from '../features/welcome/screens/HybridMainScreen';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

interface Props {
  appReady?: boolean;
}

const AppNavigator: React.FC<Props> = ({ appReady = true }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={HybridMainScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        {/* Future routes for Main will be added here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
