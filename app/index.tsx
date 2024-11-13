// app/index.tsx
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [showInput, setShowInput] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');

  const handleManualCode = () => {
    if (!invitationCode.trim()) {
      Alert.alert('Error', 'Por favor ingresa un código de invitación');
      return;
    }

    router.push({
      pathname: '/details',
      params: { code: invitationCode.trim().toUpperCase() }
    });
    
    // Limpiar después de navegar
    setInvitationCode('');
    setShowInput(false);
  };

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

        {!showInput ? (
          <TouchableOpacity 
            style={styles.manualButton}
            onPress={() => setShowInput(true)}
          >
            <MaterialIcons name="keyboard" size={24} color="#1a1a1a" />
            <Text style={[styles.buttonText, { color: '#1a1a1a' }]}>
              Ingresar Código
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={invitationCode}
              onChangeText={setInvitationCode}
              placeholder="Código de invitación"
              autoCapitalize="characters"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleManualCode}
            />
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleManualCode}
            >
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
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
  manualButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 300,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});