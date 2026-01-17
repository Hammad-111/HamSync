import './src/global.css';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { View, LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Suppress all LogBox warnings/errors
LogBox.ignoreAllLogs(true);
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold
} from '@expo-google-fonts/inter';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastProvider } from './src/contexts/ToastContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <ThemeProvider initialTheme="midnight">
          <ToastProvider>
            <RootNavigator />
          </ToastProvider>
        </ThemeProvider>
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}
