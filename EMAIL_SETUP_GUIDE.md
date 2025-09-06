# Email Setup Guide - Ho**Subject:** Your OTP for GetIn

**Content:**

````
Hello,

Your One-Time Password (OTP) for {{user_role}} login is: {{otp_code}}

This OTP is valid for {{expires_in}}.

If you didn't request this OTP, please ignore this email.

Best regards,
GetIn
```l OTP Emails

Currently, your application shows OTP codes in browser alerts instead of sending real emails. To receive actual emails, follow these steps:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the setup instructions to connect your email account
5. Note down the **Service ID** (something like `service_xxxxxxx`)

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

**Subject:** Your OTP for GetIn

**Content:**

````

Hello,

Your One-Time Password (OTP) for {{user_role}} login is: {{otp_code}}

This OTP is valid for {{expires_in}}.

If you didn't request this OTP, please ignore this email.

Best regards,
College Attendance System

````

4. Save the template and note down the **Template ID** (something like `template_xxxxxxx`)

## Step 4: Get Public Key

1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** (something like `user_xxxxxxxxxxxxxx`)

## Step 5: Configure Your Application

1. Open the file `src/lib/email-config.ts` in your project
2. Replace the placeholder values with your actual EmailJS credentials:

```typescript
export const EMAIL_CONFIG = {
  // Replace with your EmailJS service ID
  SERVICE_ID: "service_xw96qxf ",

  // Replace with your EmailJS template ID
  TEMPLATE_ID: "template_kgpg70b",

  // Replace with your EmailJS public key
  PUBLIC_KEY: "LBJgSdgpYpTjqWksdy",

  // Set to true when you have configured EmailJS
  ENABLED: true,
};
````

## Step 6: Test Your Setup

1. Save the configuration file
2. Restart your development server: `npm run dev`
3. Try logging in with your email address
4. You should now receive real OTP emails!

## Troubleshooting

- **Not receiving emails?** Check your spam folder
- **Invalid credentials error?** Double-check your Service ID, Template ID, and Public Key
- **Template variables not working?** Make sure you used the exact variable names: `{{to_email}}`, `{{otp_code}}`, `{{user_role}}`, `{{expires_in}}`

## Free Tier Limits

EmailJS free tier includes:

- 200 emails per month
- All features available
- No credit card required

This should be sufficient for development and small-scale testing.

---

**Current Status:** Your app is working with demo alerts. Once you complete the EmailJS setup above, you'll receive real emails with OTP codes!
