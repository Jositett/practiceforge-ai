import { ApiResponse, User } from '../../worker/types';
class AuthService {
  private tokenKey = 'forge_session_id';
  async login(email: string, password: string): Promise<ApiResponse<{ sessionId: string; user: User }>> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && data.sessionId) {
        localStorage.setItem(this.tokenKey, data.sessionId);
      }
      return data;
    } catch (error) {
      return { success: false, error: 'Network error during login' };
    }
  }
  async signup(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        // Automatically login after signup
        return this.login(email, password) as any;
      }
      return data;
    } catch (error) {
      return { success: false, error: 'Network error during signup' };
    }
  }
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        this.logout();
        return null;
      }
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      return null;
    }
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
  getSessionId(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
export const authService = new AuthService();