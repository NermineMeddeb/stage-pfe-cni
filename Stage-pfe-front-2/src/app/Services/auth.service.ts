import { Injectable } from '@angular/core';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Initialize from localStorage or session if needed
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(roleName: string): boolean {
    if (!this.currentUser || !this.currentUser.role) {
      return false;
    }
    return this.currentUser.role.includes(roleName);
  }

  /**
   * Get current user information
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Set current user (used after login)
   */
  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Clear user session (logout)
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}