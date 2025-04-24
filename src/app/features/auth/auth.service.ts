import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
