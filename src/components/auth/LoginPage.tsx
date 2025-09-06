import React, { useState } from "react";
import { GraduationCap, Heart, BookOpen } from "lucide-react";
import EmailLogin from "./EmailLogin";

type LoginType = "student" | "teacher" | "parent" | null;

const LoginPage: React.FC = () => {
  const [selectedLogin, setSelectedLogin] = useState<LoginType>(null);

  if (selectedLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <EmailLogin
          role={selectedLogin}
          onBack={() => setSelectedLogin(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img src="logo1.png" alt="GetIn Logo" className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GetIn</h1>
          <p className="text-xl text-gray-600">
            Login with your email - OTP verification required
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Student Login */}
          <div
            onClick={() => setSelectedLogin("student")}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200"
          >
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Student</h3>
              <p className="text-gray-600 mb-6">
                Access your attendance records with secure email verification
                and OTP authentication
              </p>
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Login as Student
              </button>
            </div>
          </div>

          {/* Teacher Login */}
          <div
            onClick={() => setSelectedLogin("teacher")}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-green-200"
          >
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Teacher</h3>
              <p className="text-gray-600 mb-6">
                Manage classes and mark attendance with secure email login and
                OTP verification
              </p>
              <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Login as Teacher
              </button>
            </div>
          </div>

          {/* Parent Login */}
          <div
            onClick={() => setSelectedLogin("parent")}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200"
          >
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Parent</h3>
              <p className="text-gray-600 mb-6">
                Monitor your child's attendance with secure email verification
                and real-time notifications
              </p>
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Login as Parent
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            🔐 Secure Email Login • 📧 OTP Verification • 🚀 Real-time Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
