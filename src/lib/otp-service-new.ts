// OTP Service for email-based authentication
import emailjs from "@emailjs/browser";
import { EMAIL_CONFIG } from "./email-config";

interface OTPData {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  role: "student" | "teacher" | "parent";
}

class OTPService {
  private otpStorage: Map<string, OTPData> = new Map();
  private readonly OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_ATTEMPTS = 3;

  constructor() {
    // Initialize EmailJS with your public key if enabled
    if (
      EMAIL_CONFIG.ENABLED &&
      EMAIL_CONFIG.PUBLIC_KEY !== "your_public_key_here"
    ) {
      emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    }
  }

  // Generate a 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to email (real email sending)
  async sendOTP(
    email: string,
    role: "student" | "teacher" | "parent"
  ): Promise<boolean> {
    try {
      const otp = this.generateOTP();
      const expiresAt = Date.now() + this.OTP_EXPIRY_TIME;

      const otpData: OTPData = {
        email,
        otp,
        expiresAt,
        attempts: 0,
        role,
      };

      this.otpStorage.set(email, otpData);

      // Try to send email using EmailJS if configured
      if (
        EMAIL_CONFIG.ENABLED &&
        EMAIL_CONFIG.SERVICE_ID !== "your_service_id_here" &&
        EMAIL_CONFIG.TEMPLATE_ID !== "your_template_id_here"
      ) {
        try {
          const templateParams = {
            to_email: email,
            otp_code: otp,
            user_role: role,
            expires_in: "5 minutes",
          };

          await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATE_ID,
            templateParams
          );

          console.log(`OTP sent to ${email} via EmailJS`);
          alert(
            `OTP has been sent to ${email}. Please check your email and enter the 6-digit code.`
          );
        } catch (emailError) {
          console.error("EmailJS error:", emailError);
          // Fallback to showing OTP in alert
          alert(
            `Email service error. OTP for ${email}: ${otp} (Valid for 5 minutes)`
          );
        }
      } else {
        // EmailJS not configured - show OTP in alert for demo
        alert(
          `OTP for ${email}: ${otp} (Valid for 5 minutes)\n\nTo receive real emails, configure EmailJS in email-config.ts`
        );
        console.log(`EmailJS not configured. OTP for ${email}: ${otp}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to send OTP:", error);
      return false;
    }
  }

  // Verify OTP
  async verifyOTP(
    email: string,
    enteredOTP: string
  ): Promise<{
    success: boolean;
    message: string;
    role?: "student" | "teacher" | "parent";
  }> {
    const otpData = this.otpStorage.get(email);

    if (!otpData) {
      return {
        success: false,
        message: "No OTP found for this email. Please request a new one.",
      };
    }

    if (Date.now() > otpData.expiresAt) {
      this.otpStorage.delete(email);
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
      };
    }

    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      this.otpStorage.delete(email);
      return {
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      };
    }

    if (otpData.otp !== enteredOTP) {
      otpData.attempts += 1;
      return {
        success: false,
        message: `Invalid OTP. ${
          this.MAX_ATTEMPTS - otpData.attempts
        } attempts remaining.`,
      };
    }

    // OTP verified successfully
    this.otpStorage.delete(email);
    return {
      success: true,
      message: "OTP verified successfully!",
      role: otpData.role,
    };
  }

  // Check if OTP exists for email
  hasOTP(email: string): boolean {
    const otpData = this.otpStorage.get(email);
    return otpData !== undefined && Date.now() <= otpData.expiresAt;
  }

  // Clean expired OTPs
  cleanExpiredOTPs(): void {
    const now = Date.now();
    for (const [email, otpData] of this.otpStorage.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStorage.delete(email);
      }
    }
  }
}

// Export singleton instance
export const otpService = new OTPService();

// Clean expired OTPs every minute
setInterval(() => {
  otpService.cleanExpiredOTPs();
}, 60000);
