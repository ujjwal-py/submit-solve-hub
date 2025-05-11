
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  { id: "1", username: "user", password: "password", isAdmin: false },
  { id: "2", username: "admin", password: "admin123", isAdmin: true }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const foundUser = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (!foundUser) {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        throw new Error("Invalid username or password");
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if username already exists
      if (MOCK_USERS.some((u) => u.username === username)) {
        toast({
          title: "Signup failed",
          description: "Username already exists",
          variant: "destructive",
        });
        throw new Error("Username already exists");
      }

      // In a real app, we would add the user to a database
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        username,
        isAdmin: false
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Signup successful",
        description: `Welcome, ${username}!`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
