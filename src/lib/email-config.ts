// EmailJS Configuration
// To set up real email sending:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Add an email service (Gmail, Outlook, etc.)
// 4. Create an email template
// 5. Replace the values below with your actual EmailJS credentials

export const EMAIL_CONFIG = {
  // Replace with your EmailJS service ID (from Step 2)
  SERVICE_ID: "service_yowvfc9",

  // Replace with your EmailJS template ID (from Step 3)
  TEMPLATE_ID: "template_kgpg70b",

  // Replace with your EmailJS public key (from Step 4)
  PUBLIC_KEY: "LBJgSdgpYpTjqWksd",

  // Set to true when you have pasted your real credentials above
  ENABLED: true, // Now enabled with real credentials!
};

// Email template should include these variables:
// {{to_email}} - recipient email
// {{otp_code}} - the 6-digit OTP
// {{user_role}} - student/teacher/parent
// {{expires_in}} - expiry time (5 minutes)

// Example email template:
/*
Subject: Your OTP for GetIn

Hello,

Your One-Time Password (OTP) for {{user_role}} login is: {{otp_code}}

This OTP is valid for {{expires_in}}.

If you didn't request this OTP, please ignore this email.

Best regards,
GetIn
*/
