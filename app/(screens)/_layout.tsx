// app/(screens)/_layout.tsx
import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="scanner"
        options={{
          title: 'Escanear QR',
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: 'Historial',
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Detalles de Invitación',
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}