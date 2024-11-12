// app/index.tsx
import { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface ScanHistoryItem {
  code: string;
  timestamp: Date;
  status: 'success' | 'error';
  message: string;
}

export default function HomeScreen() {
  const [history] = useState<ScanHistoryItem[]>([]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Control de Asistencia</Text>
        <Text style={styles.subtitle}>Boda A&N</Text>
      </View>

      <View style={styles.content}>
        <Link href="/scanner" asChild>
          <TouchableOpacity style={styles.scanButton}>
            <MaterialIcons name="qr-code-scanner" size={32} color="white" />
            <Text style={styles.buttonText}>Escanear QR</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/history" asChild>
          <TouchableOpacity style={styles.historyButton}>
            <MaterialIcons name="history" size={24} color="#1a1a1a" />
            <Text style={[styles.buttonText, { color: '#1a1a1a' }]}>
              Ver Historial
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  historyButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});