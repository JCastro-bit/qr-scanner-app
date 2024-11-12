// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
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