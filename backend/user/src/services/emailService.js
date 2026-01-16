// ============================================
// FILE: backend/user/src/services/emailService.js
// MOCK VERSION - Logs emails to console
// ============================================

const logger = require("../utils/logger");

// Mock transporter for development
const mockTransporter = {
  sendMail: async (options) => {
    console.log("\n📧 ========== EMAIL SENT (MOCK) ==========");
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    console.log("=========================================\n");
    return { messageId: "mock-" + Date.now() };
  },
};

const emailTemplates = {
  emailVerification: (data) => ({
    subject: "Email Verification - skillspocket",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #137fec;">Welcome to skillspocket!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering. Please use the following code to verify your email:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${data.otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">skillspocket - Premium Freelancing Marketplace</p>
      </div>
    `,
  }),

  passwordReset: (data) => ({
    subject: "Password Reset - skillspocket",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #137fec;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested to reset your password. Use the following code:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${data.otp}
        </div>
        <p>This code will expire in 30 minutes.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">skillspocket - Premium Freelancing Marketplace</p>
      </div>
    `,
  }),

  proposalAccepted: (data) => ({
    subject: "Congratulations! Your Proposal Was Accepted",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #137fec;">Proposal Accepted!</h2>
        <p>Hi ${data.name},</p>
        <p>Great news! Your proposal for "<strong>${data.jobTitle}</strong>" has been accepted.</p>
        <p>The client is ready to work with you. Please log in to discuss project details.</p>
        <a href="${process.env.FRONTEND_URL}/jobs/${data.jobId}" style="display: inline-block; background-color: #137fec; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">View Job Details</a>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">skillspocket - Premium Freelancing Marketplace</p>
      </div>
    `,
  }),

  newProposal: (data) => ({
    subject: "New Proposal Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #137fec;">New Proposal Received</h2>
        <p>Hi ${data.name},</p>
        <p>You've received a new proposal for your job "<strong>${data.jobTitle}</strong>".</p>
        <p>Freelancer: ${data.freelancerName}</p>
        <p>Proposed Budget: $${data.proposedBudget}</p>
        <a href="${process.env.FRONTEND_URL}/jobs/${data.jobId}" style="display: inline-block; background-color: #137fec; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Review Proposal</a>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">skillspocket - Premium Freelancing Marketplace</p>
      </div>
    `,
  }),
};

exports.sendEmail = async ({ to, template, data }) => {
  try {
    const emailTemplate = emailTemplates[template](data);

    const mailOptions = {
      from: `"skillspocket" <${process.env.EMAIL_FROM || "noreply@skillspocket.com"}>`,
      to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    // Log the OTP/verification code to console for testing
    if (data.otp) {
      console.log(`\n🔑 VERIFICATION CODE for ${to}: ${data.otp}\n`);
    }

    await mockTransporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}`);

    return { messageId: "mock-success" };
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    return null;
  }
};

console.log(
  "📧 Email Service loaded in MOCK mode - emails will be logged to console"
);
