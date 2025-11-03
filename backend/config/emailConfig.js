import dotenv from 'dotenv';
import { sendEmailViaGmail, isGmailConfigured } from './gmailOAuth2.js';

dotenv.config();

// Check which email service is configured
const USE_GMAIL = isGmailConfigured();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.GMAIL_USER;

if (USE_GMAIL) {
  console.log('✅ Gmail OAuth2 configured in emailConfig');
} else if (SENDGRID_API_KEY) {
  console.log('✅ SendGrid configured in emailConfig (fallback)');
} else {
  console.warn('⚠️ No email service configured. Use Gmail OAuth2 or SendGrid.');
}

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

// Keep old function name for backward compatibility
const sendEmailViaSendGrid = sendEmail;

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
    console.log(`✅ Admin notification email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.warn('⚠️ Email sending failed (non-critical):', error.message);
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
    console.log(`✅ User acknowledgment email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.warn('⚠️ Email sending failed (non-critical):', error.message);
    return { success: false, error: error.message };
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order) => {
  const { user, items, totalAmount, shippingAddress } = order;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `✅ Order Confirmed - #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #E67E22; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .order-details { background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍯 Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Thank you for your order! We're excited to prepare your premium jaggery products.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</p>
              
              <h4>Items Ordered:</h4>
              ${items.map(item => `
                <div class="item">
                  <span>${item.product.name} x ${item.quantity}</span>
                  <span>₹${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              `).join('')}
              
              <h4>Shipping Address:</h4>
              <p>${shippingAddress.fullName}<br>
              ${shippingAddress.address}<br>
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
              ${shippingAddress.country}</p>
            </div>
            
            <p>We'll send you another email when your order ships!</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Order confirmation email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

// Send payment success email
export const sendPaymentSuccessEmail = async (order) => {
  const { user, totalAmount } = order;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `💳 Payment Successful - Order #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #27AE60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .success-box { background-color: #D5F4E6; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Payment Successful!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="success-box">
              <h3>✅ Payment Received</h3>
              <p>We've successfully received your payment of <strong>₹${totalAmount.toLocaleString()}</strong> for Order #${order._id}</p>
            </div>
            
            <p>Your order is now being processed and will be shipped soon. You'll receive a shipping confirmation email with tracking details.</p>
            
            <p>Thank you for choosing Dfoods for your premium jaggery needs!</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Payment success email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending payment success email:', error);
    throw error;
  }
};

// Send payment error email
export const sendPaymentErrorEmail = async (order, errorMessage) => {
  const { user } = order;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `❌ Payment Failed - Order #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #E74C3C; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .error-box { background-color: #FADBD8; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Payment Failed</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="error-box">
              <h3>Payment Processing Error</h3>
              <p>We encountered an issue processing your payment for Order #${order._id}.</p>
              <p><strong>Error:</strong> ${errorMessage}</p>
            </div>
            
            <p>Please try again or contact our support team if the issue persists.</p>
            <p>Your order has been placed but is pending payment confirmation.</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Payment error email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending payment error email:', error);
    throw error;
  }
};

// Send payment reminder email
export const sendPaymentReminderEmail = async (order) => {
  const { user, totalAmount } = order;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `⏰ Payment Reminder - Order #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #F39C12; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .reminder-box { background-color: #FEF9E7; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Payment Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="reminder-box">
              <h3>Complete Your Payment</h3>
              <p>Your order #${order._id} is still pending payment of <strong>₹${totalAmount.toLocaleString()}</strong>.</p>
              <p>Please complete your payment to confirm your order and start processing.</p>
            </div>
            
            <p>If you've already made the payment, please ignore this email.</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Payment reminder email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending payment reminder email:', error);
    throw error;
  }
};

// Send welcome email for new account
export const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `🎉 Welcome to Dfoods - Your Premium Jaggery Journey Begins!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #E67E22; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .welcome-box { background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍯 Welcome to Dfoods!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="welcome-box">
              <h3>🎉 Your Account is Ready!</h3>
              <p>Welcome to Dfoods - your gateway to premium, organic jaggery products!</p>
              <p>We're excited to have you join our community of jaggery lovers.</p>
            </div>
            
            <p>As a new member, you can now:</p>
            <ul>
              <li>🛍️ Browse our premium jaggery collection</li>
              <li>💝 Enjoy exclusive member discounts</li>
              <li>🚚 Get free delivery on all orders</li>
              <li>📱 Track your orders easily</li>
            </ul>
            
            <p>Start your jaggery journey today!</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Welcome email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

// Send shipping confirmation email
export const sendShippingConfirmationEmail = async (order) => {
  const { user, items, shippingAddress } = order;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `🚚 Your Order is Shipped - #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #3498DB; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .shipping-box { background-color: #EBF8FF; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Your Order is Shipped!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="shipping-box">
              <h3>📦 Order Shipped</h3>
              <p>Great news! Your order #${order._id} has been shipped and is on its way to you.</p>
              <p><strong>Expected Delivery:</strong> 2-3 business days</p>
              <p><strong>Tracking Number:</strong> DF${order._id.toString().slice(-8).toUpperCase()}</p>
            </div>
            
            <p>You can track your package using the tracking number above.</p>
            <p>Thank you for choosing Dfoods!</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Shipping confirmation email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending shipping confirmation email:', error);
    throw error;
  }
};

// Send delivery confirmation email
export const sendDeliveryConfirmationEmail = async (order) => {
  const { user } = order;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `✅ Order Delivered - #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #27AE60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .delivery-box { background-color: #D5F4E6; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Delivered!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="delivery-box">
              <h3>🎉 Your Order Has Been Delivered!</h3>
              <p>We hope you enjoy your premium jaggery products from Dfoods!</p>
              <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            </div>
            
            <p>Thank you for choosing Dfoods for your premium jaggery needs!</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Delivery confirmation email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending delivery confirmation email:', error);
    throw error;
  }
};

// Send order cancellation email
export const sendOrderCancellationEmail = async (order) => {
  const { user, totalAmount } = order;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `❌ Order Cancelled - #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #E74C3C; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .cancellation-box { background-color: #FADBD8; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Order Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="cancellation-box">
              <h3>Order Cancelled</h3>
              <p>Your order #${order._id} has been cancelled.</p>
              <p>If payment was made, a refund of ₹${totalAmount.toLocaleString()} will be processed within 3-5 business days.</p>
            </div>
            
            <p>We're sorry for any inconvenience. If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Order cancellation email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending order cancellation email:', error);
    throw error;
  }
};

// Send discount notification email
export const sendDiscountNotificationEmail = async (user, discountCode, discountPercent) => {
  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `🎉 Special Discount Just for You!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #E67E22; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .discount-box { background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Special Discount!</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="discount-box">
              <h3>${discountPercent}% OFF Your Next Order!</h3>
              <p>Use code: <strong>${discountCode}</strong></p>
              <p>Valid for a limited time only!</p>
            </div>
            
            <p>Don't miss out on this exclusive offer for our valued customers!</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Discount notification email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending discount notification email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Dfoods" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `🔐 Password Reset Request - Dfoods`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #E67E22; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
          .reset-box { background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="reset-box">
              <h3>Reset Your Password</h3>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" style="display: inline-block; background-color: #E67E22; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Password</a>
              <p>This link will expire in 1 hour.</p>
            </div>
            
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
          <div class="footer">
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
    console.log(`✅ Password reset email sent ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}`);
    return { success: true, messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

export default { sendEmailViaSendGrid: sendEmail };


