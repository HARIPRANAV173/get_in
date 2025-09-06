import React, { createContext, useContext, useState, useEffect } from "react";
import { otpService } from "../lib/otp-service";

export interface User {
  id: string;
  role: "student" | "teacher" | "parent";
  name: string;
  email: string;
  userId?: string;
  rollNumber?: string;
  phoneNumber?: string;
  department?: string;
  section?: string;
  subject?: string;
  semester?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  sendOTP: (
    email: string,
    role: "student" | "teacher" | "parent"
  ) => Promise<boolean>;
  verifyOTPAndLogin: (
    email: string,
    otp: string,
    name: string
  ) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const sendOTP = async (
    email: string,
    role: "student" | "teacher" | "parent"
  ): Promise<boolean> => {
    return await otpService.sendOTP(email, role);
  };

  const verifyOTPAndLogin = async (
    email: string,
    otp: string,
    name: string
  ): Promise<{ success: boolean; message: string }> => {
    const result = await otpService.verifyOTP(email, otp);

    if (result.success && result.role) {
      // Generate user ID based on role and timestamp
      const userId = `${result.role.toUpperCase()}${Date.now()}`;

      const userData: User = {
        id: userId,
        role: result.role,
        name: name,
        email: email,
        isVerified: true,
        // Set default values based on role
        ...(result.role === "student" && {
          rollNumber: `ROLL${Date.now()}`,
          department: "Computer Science",
          section: "A",
          semester: "6th",
        }),
        ...(result.role === "teacher" && {
          subject: "Computer Science",
          department: "Computer Science",
        }),
        ...(result.role === "parent" && {
          phoneNumber: "+1234567890",
        }),
      };

      login(userData);
      return { success: true, message: "Login successful!" };
    }

    return result;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, sendOTP, verifyOTPAndLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
