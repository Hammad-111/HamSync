import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { AppNavigator } from './AppNavigator';
import { MeritCalculatorScreen } from '../screens/MeritCalculatorScreen';

import { ChatScreen } from '../screens/ChatScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
                <Stack.Screen name="App" component={AppNavigator} />
                <Stack.Screen name="MeritCalculator" component={MeritCalculatorScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
