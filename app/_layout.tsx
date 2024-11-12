// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

export default function RootLayout() {
  const [loaded] = useFonts({
    // Aquí puedes agregar fuentes personalizadas si las necesitas
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
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="scanner"
        options={{
          title: 'Escanear QR',
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Detalles de Invitación',
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: 'Historial',
        }}
      />
    </Stack>
  );
}