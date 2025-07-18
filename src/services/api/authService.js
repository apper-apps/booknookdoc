import { toast } from 'react-toastify';
import userService from './userService';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = null;
    this.initializeUser();
  }

  async initializeUser() {
    if (this.token) {
      try {
        this.user = await userService.getCurrentUser();
      } catch (error) {
        console.error('Failed to initialize user:', error);
        this.logout();
      }
    }
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  async login(credentials) {
    try {
      // Simulate API call for login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      this.token = data.token;
      this.user = data.user;
      
      localStorage.setItem('authToken', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      toast.success('Successfully logged in!');
      return { success: true, user: this.user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Clear instance variables
      this.token = null;
      this.user = null;
      
      toast.success('Successfully logged out!');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  async refreshToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('authToken', this.token);
      
      return { success: true, token: this.token };
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return { success: false, error: error.message };
    }
  }

  // Check if user has specific permissions
  hasPermission(permission) {
    if (!this.user) return false;
    return this.user.permissions?.includes(permission) || false;
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const updatedUser = await userService.updateProfile(userData);
      this.user = updatedUser;
      localStorage.setItem('user', JSON.stringify(this.user));
      toast.success('Profile updated successfully!');
      return { success: true, user: this.user };
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;