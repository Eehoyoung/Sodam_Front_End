import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeMainScreen from '../features/welcome/screens/WelcomeMainScreen';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import Protected from '../components/Protected';

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
        <Stack.Screen name="Welcome" component={WelcomeMainScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="HomeRoot" component={HomeProtectedWrapper} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
