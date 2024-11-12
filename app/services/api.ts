// app/services/api.ts
import axios from 'axios';

const BASE_URL = 'https://srv563460.hstgr.cloud/api';

export interface Guest {
  id: number;
  name: string;
  isAttending: number;
  tableNumber: number | null;
  didAttend: boolean | null;
}

export interface Invitation {
  id: number;
  mainGuestName: string;
  invitationCode: string;
  phoneNumber: string | null;
  guests: Guest[];
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const invitationService = {
  async validateInvitation(code: string): Promise<Invitation> {
    try {
      const response = await api.get(`/invitations`, {
        params: { code }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Invitación no encontrada');
      }
      throw new Error('Error al validar la invitación');
    }
  },

  async markAttendance(invitationId: number, guestAttendance: Record<number, boolean>): Promise<Guest[]> {
    try {
      const response = await api.put(
        `/invitations/${invitationId}/guests/attendance`,
        guestAttendance
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al registrar la asistencia');
    }
  }
};