import React, { useState } from "react";
import { ArrowLeft, Mail, Shield, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface EmailLoginProps {
  role: "student" | "teacher" | "parent";
  onBack: () => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ role, onBack }) => {
  const { sendOTP, verifyOTPAndLogin } = useAuth();
  const [step, setStep] = useState<"email" | "otp" | "name">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const roleStyles = {
    student: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      textHover: "hover:text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200",
      ring: "focus:ring-2 focus:ring-blue-500",
      icon: "🎓",
    },
    teacher: {
      bg: "bg-green-100",
      text: "text-green-600",
      textHover: "hover:text-green-700",
      button:
        "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200",
      ring: "focus:ring-2 focus:ring-green-500",
      icon: "👨‍🏫",
    },
    parent: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      textHover: "hover:text-purple-700",
      button:
        "bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200",
      ring: "focus:ring-2 focus:ring-purple-500",
      icon: "👪",
    },
  };

  const styles = roleStyles[role];

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await sendOTP(email, role);
      if (success) {
        setStep("otp");
        setTimer(300); // 5 minutes
        startTimer();
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a complete 6-digit OTP.");
      setLoading(false);
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyOTPAndLogin(
        email,
        otpValue,
        name.trim()
      );
      if (!result.success) {
        setError(result.message);
      }
    } catch {
      setError("An error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      const success = await sendOTP(email, role);
      if (success) {
        setTimer(300);
        startTimer();
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className={`flex items-center ${styles.text} ${styles.textHover} mb-8 font-medium`}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Role Selection
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* GetIn Logo */}
            <div className="mb-4">
              <img
                src="logo1.png"
                alt="GetIn Logo"
                className="h-12 w-12 mx-auto"
              />
            </div>
            <div
              className={`${styles.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {step === "email" && (
                <Mail className={`h-8 w-8 ${styles.text}`} />
              )}
              {step === "name" && <User className={`h-8 w-8 ${styles.text}`} />}
              {step === "otp" && (
                <Shield className={`h-8 w-8 ${styles.text}`} />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {role.charAt(0).toUpperCase() + role.slice(1)} Login {styles.icon}
            </h2>
            <p className="text-gray-600 mt-2">
              {step === "email" && "Enter your email to receive OTP"}
              {step === "name" && "Enter your name (optional)"}
              {step === "otp" && "Enter the OTP sent to your email"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Email Step */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${styles.ring} focus:border-transparent`}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className={`w-full ${styles.button} text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    OTP sent to:{" "}
                    <span className={`${styles.text} font-medium`}>
                      {email}
                    </span>
                  </p>
                  {timer > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Expires in: {formatTime(timer)}
                    </p>
                  )}
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter 6-Digit OTP
                </label>
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className={`w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg ${styles.ring} focus:border-transparent`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${styles.ring} focus:border-transparent`}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className={`w-full ${styles.button} text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors`}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                {timer === 0 && (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-full text-gray-600 hover:text-gray-700 py-2 font-medium"
                  >
                    Resend OTP
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-gray-600 hover:text-gray-700 py-2 font-medium"
                >
                  Change Email Address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;
