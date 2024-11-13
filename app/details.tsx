import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
          initialAttendance[guest.id] = guest.didAttend === true;
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
      console.log('Estado actual de asistencia:', guestAttendance);

      const updatedGuests = await invitationService.markAttendance(
        invitation.id,
        guestAttendance
      );

      setInvitation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          guests: updatedGuests
        };
      });

      Alert.alert(
        'Éxito',
        'La asistencia se ha registrado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/');
            }
          }
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.message || 'No se pudo registrar la asistencia. Por favor, intenta de nuevo.',
        [
          {
            text: 'OK',
            onPress: () => setLoading(false)
          }
        ]
      );
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

        <View style={styles.guestsList}>
          <Text style={styles.sectionTitle}>Invitados:</Text>
          {invitation.guests.map((guest) => (
            <View key={guest.id} style={styles.guestItem}>
              <View style={styles.guestInfo}>
                <Text style={styles.guestName}>{guest.name}</Text>
                <Text style={styles.tableBadge}>Mesa {guest.tableNumber}</Text>
              </View>
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
    marginBottom: 24,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  guestInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guestName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  tableBadge: {
    fontSize: 15,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
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