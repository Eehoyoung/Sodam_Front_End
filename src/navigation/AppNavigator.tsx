import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import Protected from '../components/Protected';
import UsageSelectionScreen from "../features/welcome/screens/UsageSelectionScreen.tsx";
import WelcomeMainScreen from "../features/welcome/screens/WelcomeMainScreen.tsx";

const Stack = createNativeStackNavigator();

interface Props {
  appReady?: boolean;
}

const HomeProtectedWrapper: React.FC = () => (
  <Protected>
    <HomeNavigator />
  </Protected>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppNavigator: React.FC<Props> = ({ appReady = true }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={UsageSelectionScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="HomeRoot" component={HomeProtectedWrapper} />
        <Stack.Screen name="WelcomeMain" component={WelcomeMainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
