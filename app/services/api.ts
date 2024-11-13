// app/services/api.ts
import axios from 'axios';

export interface Guest {
  id: number;
  name: string;
  isAttending?: boolean;
  didAttend?: boolean;
  tableNumber?: number;
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
      const response = await api.put(`/invitations/${invitationId}/attendance`, {
        attendance: guestAttendance
      });
      return response.data;
    } catch (error: any) {
      console.error('Error en markAttendance:', error);
      throw new Error(error.response?.data?.message || 'Error al registrar la asistencia');
    }
  }
};