import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HybridMainScreen from '../features/welcome/screens/HybridMainScreen';

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
        {/* Future routes for Auth and Main will be added here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
