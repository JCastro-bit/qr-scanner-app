// app/scanner.tsx
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import { CameraView, BarcodeScanningResult } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestInitialPermission();
    }
  }, [permission]);

  const requestInitialPermission = async () => {
    try {
      await requestPermission();
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo solicitar el permiso de la cámara',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBarCodeScanned = useCallback((results: BarcodeScanningResult) => {
    if (scanned) return;

    const { type, data } = results;
    console.log(`Tipo de código: ${type}`);
    console.log(`Datos escaneados: ${data}`);
    
    setScanned(true);
    
    try {
      if (!data) {
        throw new Error('Código QR inválido');
      }

      // Validar el formato del QR según tus necesidades
      if (!isValidQRFormat(data)) {
        throw new Error('Formato de QR no válido');
      }

      router.replace({
        pathname: '/details',
        params: { code: data.trim() }
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo procesar el código QR',
        [{ 
          text: 'Reintentar',
          onPress: () => setScanned(false)
        }]
      );
    }
  }, [scanned]);

  const isValidQRFormat = (data: string): boolean => {
    // Implementa aquí la validación específica del formato de tus códigos QR
    return Boolean(data.trim());
  };

  const toggleTorch = useCallback(() => {
    setTorch(prev => !prev);
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Verificando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Se requiere acceso a la cámara para escanear códigos QR
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Permitir Acceso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
          // Intervalo de escaneo en ms
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          {/* Indicadores de esquina para mejor UX */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <TouchableOpacity 
          style={styles.torchButton}
          onPress={toggleTorch}
        >
          <MaterialIcons 
            name={torch ? "flash-on" : "flash-off"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          Coloca el código QR dentro del marco
        </Text>
      </View>
    </View>
  );
}

const CORNER_SIZE = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  topRight: {
    top: -2,
    right: -2,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  torchButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  instructionText: {
    color: 'white',
    position: 'absolute',
    bottom: 80,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
    maxWidth: '80%',
  },
});