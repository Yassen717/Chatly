import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'index',
};

// Custom Dark Theme to match our app design
const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#101022', // Match our app background
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={MyDarkTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: '#101022' },
          headerStyle: { backgroundColor: '#101022' },
          headerTintColor: '#fff',
          animation: 'none',
          presentation: 'card',
        }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'About Chatly',
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor="#101022" />
    </ThemeProvider>
  );
}
