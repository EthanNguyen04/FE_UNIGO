import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/notificationContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, createContext } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

interface FontContextType {
  fontFamily: string;
}

export const FontContext = createContext<FontContextType | undefined>(undefined);

export default function RootLayout() {
  // Tải font
  const [loaded] = useFonts({
    Fredoka_Regular: require('../assets/fonts/WorkSans-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <FontContext.Provider value={{ fontFamily: 'Fredoka_Regular' }}>
      <AuthProvider>
        <ThemeProvider value={DefaultTheme}>
          <NotificationProvider> 
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="dark" />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </FontContext.Provider>
  );
}
