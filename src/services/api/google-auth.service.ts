import { extractAuthToken } from '@/lib/authResponse.utils';
import { apiClient } from './config';
import { AuthResponse } from './types';

export const googleAuthService = {
  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/google', { credential });
    const token = extractAuthToken(response.data);
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    return response.data;
  }
}; 