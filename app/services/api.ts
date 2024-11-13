// app/services/api.ts
import axios from 'axios';

export interface Guest {
  id: number;
  name: string;
  isAttending: number;
  didAttend: boolean | null;
  tableNumber: number;
}

export interface Invitation {
  id: number;
  invitationCode: string;
  mainGuestName: string;
  phoneNumber: string;
  guests: Guest[];
}

const BASE_URL = 'https://srv563460.hstgr.cloud/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const invitationService = {
  async validateInvitation(code: string): Promise<Invitation> {
    try {
      const response = await api.get<Invitation[]>('/invitations');
      const invitation = response.data.find(inv => inv.invitationCode === code);
      
      if (!invitation) {
        throw new Error('Invitación no encontrada');
      }

      console.log('Invitación encontrada:', invitation);
      return invitation;
    } catch (error: any) {
      console.error('Error en validateInvitation:', error);
      throw new Error(error.response?.data?.message || 'Error al validar la invitación');
    }
  },

  async markAttendance(invitationId: number, guestAttendance: Record<number, boolean>): Promise<Guest[]> {
    try {
      // Usamos el nuevo endpoint para marcar asistencia múltiple
      const endpoint = `/invitations/${invitationId}/guests/attendance`;
      
      console.log('Enviando actualización de asistencia:', guestAttendance);
      
      const response = await api.put<Guest[]>(endpoint, guestAttendance);
      
      if (!response.data) {
        throw new Error('Respuesta inválida del servidor');
      }

      console.log('Respuesta después de actualizar:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error detallado en markAttendance:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 404) {
        throw new Error('Invitación no encontrada');
      }
      
      throw new Error(error.response?.data?.message || 'Error al registrar la asistencia');
    }
  },

  // Método adicional para marcar asistencia individual si se necesita
  async markSingleAttendance(invitationId: number, guestId: number, didAttend: boolean): Promise<Guest> {
    try {
      const endpoint = `/invitations/${invitationId}/guests/${guestId}/attendance`;
      
      const response = await api.put<Guest>(endpoint, didAttend);
      
      if (!response.data) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error en markSingleAttendance:', error);
      throw new Error(error.response?.data?.message || 'Error al registrar la asistencia');
    }
  }
};