// Auth service is now handled by ApperUI - this is a placeholder for compatibility
class AuthService {
  constructor() {
    // Authentication is now handled by ApperUI
  }

  isAuthenticated() {
    // This will be overridden by Redux state in components
    return false;
  }

  getCurrentUser() {
    // This will be overridden by Redux state in components
    return null;
  }

  async login(credentials) {
    // Login is now handled by ApperUI
    throw new Error("Login should be handled by ApperUI");
  }

  async signup(userData) {
    // Signup is now handled by ApperUI
    throw new Error("Signup should be handled by ApperUI");
  }

  async logout() {
    // Logout is now handled by ApperUI
    throw new Error("Logout should be handled by ApperUI");
  }
}

export default new AuthService();