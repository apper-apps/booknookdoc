import { toast } from "react-toastify";

class AuthService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("bookbae_users") || "[]");
    this.currentUser = JSON.parse(localStorage.getItem("bookbae_current_user") || "null");
    this.initializeDefaultUsers();
  }

  initializeDefaultUsers() {
    if (this.users.length === 0) {
      this.users = [
        {
          Id: 1,
          username: "booklover123",
          email: "booklover@example.com",
          password: "password123",
          name: "Sarah Johnson",
          avatar: "/api/placeholder/32/32",
          bio: "Passionate reader and book club enthusiast",
          joinedDate: new Date().toISOString(),
          isActive: true
        },
        {
          Id: 2,
          username: "readingaddict",
          email: "reader@example.com",
          password: "bookworm456",
          name: "Michael Chen",
          avatar: "/api/placeholder/32/32",
          bio: "Fantasy and sci-fi lover",
          joinedDate: new Date().toISOString(),
          isActive: true
        }
      ];
      this.saveUsers();
    }
  }

  saveUsers() {
    localStorage.setItem("bookbae_users", JSON.stringify(this.users));
  }

  saveCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem("bookbae_current_user", JSON.stringify(user));
  }

  generateId() {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.Id)) + 1 : 1;
  }

  async login(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { identifier, password } = credentials;
        
        // Find user by email or username
        const user = this.users.find(u => 
          (u.email === identifier || u.username === identifier) && 
          u.password === password
        );

        if (user) {
          const userSession = {
            Id: user.Id,
            username: user.username,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            bio: user.bio,
            token: `token_${Date.now()}`,
            loginTime: new Date().toISOString()
          };
          
          this.saveCurrentUser(userSession);
          resolve({ 
            success: true, 
            user: userSession, 
            message: "Login successful!" 
          });
        } else {
          reject({ 
            success: false, 
            message: "Invalid username/email or password" 
          });
        }
      }, 500);
    });
  }

  async signup(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { username, email, password, name } = userData;

        // Check if user already exists
        const existingUser = this.users.find(u => 
          u.email === email || u.username === username
        );

        if (existingUser) {
          reject({ 
            success: false, 
            message: existingUser.email === email ? "Email already exists" : "Username already exists"
          });
          return;
        }

        // Validate required fields
        if (!username || !email || !password || !name) {
          reject({ 
            success: false, 
            message: "All fields are required" 
          });
          return;
        }

        // Create new user
        const newUser = {
          Id: this.generateId(),
          username,
          email,
          password, // In real app, this would be hashed
          name,
          avatar: "/api/placeholder/32/32",
          bio: "New BookBae member",
          joinedDate: new Date().toISOString(),
          isActive: true
        };

        this.users.push(newUser);
        this.saveUsers();

        // Auto-login after signup
        const userSession = {
          Id: newUser.Id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
          bio: newUser.bio,
          token: `token_${Date.now()}`,
          loginTime: new Date().toISOString()
        };

        this.saveCurrentUser(userSession);
        resolve({ 
          success: true, 
          user: userSession, 
          message: "Account created successfully!" 
        });
      }, 500);
    });
  }

  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        localStorage.removeItem("bookbae_current_user");
        resolve({ success: true, message: "Logged out successfully" });
      }, 200);
    });
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async validateToken(token) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.currentUser && this.currentUser.token === token);
      }, 100);
    });
  }

  async resetPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.email === email);
        if (user) {
          resolve({ success: true, message: "Password reset email sent" });
        } else {
          reject({ success: false, message: "Email not found" });
        }
      }, 300);
    });
  }

  async updateProfile(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.currentUser) {
          reject({ success: false, message: "Not authenticated" });
          return;
        }

        const userIndex = this.users.findIndex(u => u.Id === this.currentUser.Id);
        if (userIndex === -1) {
          reject({ success: false, message: "User not found" });
          return;
        }

        // Update user data
        const updatedUser = { ...this.users[userIndex], ...userData };
        this.users[userIndex] = updatedUser;
        this.saveUsers();

        // Update current user session
        const updatedSession = {
          ...this.currentUser,
          ...userData
        };
        this.saveCurrentUser(updatedSession);

        resolve({ 
          success: true, 
          user: updatedSession, 
          message: "Profile updated successfully" 
        });
      }, 300);
    });
  }
}

export default new AuthService();