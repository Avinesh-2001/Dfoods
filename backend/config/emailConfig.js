import dotenv from 'dotenv';
import { sendEmailViaGmail, isGmailConfigured } from './gmailOAuth2.js';

dotenv.config();

// Check which email service is configured
const USE_GMAIL = isGmailConfigured();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.GMAIL_USER;

// Helper function to send email (prefers Gmail OAuth2, falls back to SendGrid)
const sendEmail = async (mailOptions) => {
  if (USE_GMAIL) {
    // Use Gmail OAuth2
    return await sendEmailViaGmail(mailOptions);
  } else if (SENDGRID_API_KEY && FROM_EMAIL) {
    // Fallback to SendGrid
    const sgMail = (await import('@sendgrid/mail')).default;
    if (!sgMail) {
      throw new Error('SendGrid not available. Install @sendgrid/mail package.');
    }
    
    sgMail.setApiKey(SENDGRID_API_KEY);
    
    const msg = {
      to: mailOptions.to,
      from: {
        email: FROM_EMAIL,
        name: mailOptions.from?.split('<')[0]?.trim() || 'Dfoods'
      },
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.html?.replace(/<[^>]*>/g, '') || '',
    };

    return await sgMail.send(msg);
  } else {
    throw new Error('No email service configured. Configure Gmail OAuth2 or SendGrid.');
  }
};

// Send email to admin when new contact form is submitted
export const sendContactNotificationToAdmin = async (contactData) => {
  const { name, email, phone, message } = contactData;

  const mailOptions = {
    from: `"Dfoods Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || 'abhishek020621@gmail.com',
    subject: `🔔 New Contact Form Submission from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #E67E22; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .field { margin-bottom: 15px; padding: 10px; background-color: #FDF6E3; border-left: 4px solid #E67E22; }
          .field-label { font-weight: bold; color: #8B4513; }
          .field-value { margin-top: 5px; color: #333; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <p>You have received a new message from your Dfoods website contact form:</p>
            
            <div class="field">
              <div class="field-label">👤 Name:</div>
              <div class="field-value">${name}</div>
            </div>
            
            <div class="field">
              <div class="field-label">📧 Email:</div>
              <div class="field-value"><a href="mailto:${email}">${email}</a></div>
            </div>
            
            ${phone ? `
            <div class="field">
              <div class="field-label">📱 Phone:</div>
              <div class="field-value">${phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="field-label">💬 Message:</div>
              <div class="field-value">${message}</div>
            </div>
            
            <p style="margin-top: 20px; padding: 15px; background-color: #E67E22; color: white; border-radius: 5px; text-align: center;">
              Please respond to this inquiry at your earliest convenience.
            </p>
          </div>
          <div class="footer">
            <p>This email was sent from your Dfoods website contact form.</p>
            <p>&copy; ${new Date().getFullYear()} Dfoods. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const response = await sendEmail(mailOptions);
    const messageId = response.messageId || response[0]?.headers['x-message-id'] || 'N/A';
    return { success: true, messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send acknowledgment email to user who submitted the form
export const sendContactAcknowledgmentToUser = async (contactData) => {
  const { name, email } = contactData;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✅ Thank you for contacting Dfoods!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #E67E22; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .logo { font-size: 48px; margin-bottom: 10px; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          .highlight { background-color: #FDF6E3; padding: 15px; border-left: 4px solid #E67E22; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🍯</div>
            <h1>Thank You for Contacting Us!</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            
            <p>Thank you for reaching out to <strong>Dfoods</strong> - your source for pure traditional sweetness!</p>
            
            <div class="highlight">
              <p style="margin: 0;"><strong>✅ We've received your message!</strong></p>
              <p style="margin: 10px 0 0 0;">Our team will review your inquiry and get back to you within 24-48 hours.</p>
            </div>
            
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>🛍️ Browse our collection of organic jaggery products</li>
              <li>📖 Learn more about our traditional sweetening methods</li>
              <li>🎁 Check out our special offers and bundles</li>
            </ul>
            
            <p>If your matter is urgent, please call us directly at <strong>[Your Phone Number]</strong>.</p>
            
            <p>Best regards,<br>
            <strong>The Dfoods Team</strong><br>
            Pure Traditional Sweetness</p>
          </div>
          <div class="footer">
            <p>This is an automated acknowledgment email.</p>
            <p>&copy; ${new Date().getFullYear()} Dfoods. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const response = await sendEmail(mailOptions);
    const messageId = response.messageId || response[0]?.headers['x-message-id'] || 'N/A';
    return { success: true, messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Re-export all email functions from mailers.js
export {
  sendWelcomeEmail,
  sendCheckoutPendingEmail,
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
  sendPaymentErrorEmail,
  sendPaymentReminderEmail,
  sendShippingConfirmationEmail,
  sendDeliveryConfirmationEmail,
  sendOrderCancellationEmail,
  sendOrderEditedEmail,
  sendPickupOrderEmail,
  sendOrderInvoiceEmail,
  sendDiscountNotificationEmail,
  sendGreetingShoppingAgainEmail,
  sendPasswordResetEmail,
  sendShippingUpdatedEmail,
  sendOutForDeliveryEmail,
  sendReturnCreatedEmail,
  sendReturnReceivedEmail,
  sendReturnApprovedEmail,
  sendReturnDeclinedEmail,
  sendPromotionalEmail
} from '../utils/mailers.js';

export default { sendEmailViaSendGrid: sendEmail };
