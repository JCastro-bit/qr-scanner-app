// app/details.tsx
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { invitationService, Invitation } from './services/api';

export default function DetailsScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [guestAttendance, setGuestAttendance] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!code) {
      setError('Código de invitación no válido');
      setLoading(false);
      return;
    }
    loadInvitation();
  }, [code]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Consultando invitación:', code);
      
      const data = await invitationService.validateInvitation(code);
      
      if (!data || !data.guests) {
        throw new Error('Invitación no válida');
      }
      console.log('Datos de invitación:', data);
      setInvitation(data);
      
      // Inicializar estado de asistencia
      const initialAttendance: Record<number, boolean> = {};
      data.guests.forEach(guest => {
        if (guest && guest.id) {
          initialAttendance[guest.id] = Boolean(guest.didAttend);
        }
      });
      setGuestAttendance(initialAttendance);
      
    } catch (err: any) {
      console.error('Error al cargar invitación:', err);
      setError(err.message || 'Error al cargar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!invitation?.id) return;
    try {
      setLoading(true);
      console.log('Marcando asistencia:', guestAttendance);
      
      const updatedGuests = await invitationService.markAttendance(
        invitation.id,
        guestAttendance
      );
      
      if (!updatedGuests) {
        throw new Error('No se pudo actualizar la asistencia');
      }

      setInvitation(prev => prev ? {
        ...prev,
        guests: updatedGuests
      } : null);

      alert('Asistencia registrada correctamente');
      router.replace('/');
      
    } catch (err: any) {
      console.error('Error al registrar asistencia:', err);
      setError(err.message || 'Error al registrar la asistencia');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!invitation || !invitation.guests) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se encontró la invitación</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{invitation.mainGuestName}</Text>
        <Text style={styles.subtitle}>
          Mesa {invitation.guests[0]?.tableNumber || 'Sin asignar'}
        </Text>
        
        <View style={styles.guestsList}>
          <Text style={styles.sectionTitle}>Invitados:</Text>
          {invitation.guests.map((guest) => (
            <View key={guest.id} style={styles.guestItem}>
              <Text style={styles.guestName}>{guest.name}</Text>
              <TouchableOpacity
                onPress={() => setGuestAttendance(prev => ({
                  ...prev,
                  [guest.id]: !prev[guest.id]
                }))}
                style={[
                  styles.checkbox,
                  guestAttendance[guest.id] && styles.checkboxChecked
                ]}
              >
                {guestAttendance[guest.id] && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleMarkAttendance}
        >
          <Text style={styles.buttonText}>Confirmar Asistencia</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  guestsList: {
    marginTop: 16,
  },
  guestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  guestName: {
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
});