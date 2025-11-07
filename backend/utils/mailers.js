// utils/mailer.js
import dotenv from 'dotenv';
import { sendEmailViaGmail, isGmailConfigured } from '../config/gmailOAuth2.js';

dotenv.config();

// Check which email service is configured
const USE_GMAIL = isGmailConfigured();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.GMAIL_USER;

// Email service configuration check
// USE_GMAIL or SENDGRID_API_KEY will be used based on environment variables

/**
 * Send email using Gmail OAuth2 (preferred) or SendGrid (fallback)
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // Check configuration
    if (!FROM_EMAIL) {
      const error = 'FROM_EMAIL not configured in environment variables';
      return { success: false, error };
    }

    // Ensure logo header is present in all emails
    const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || process.env.APP_PUBLIC_URL || '';
    const logoUrl = process.env.EMAIL_LOGO_URL || (PUBLIC_BASE_URL ? `${PUBLIC_BASE_URL.replace(/\/$/, '')}/images/Dfood_logo.png` : '');

    const wrappedHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;background-color:#ffffff;padding:16px;">
        <div style="text-align:center;margin-bottom:16px;">
          ${logoUrl
            ? `<img src="${logoUrl}" alt="Dfoods" style="height:48px;width:auto;display:inline-block;" />`
            : `<div style=\"font-weight:700;font-size:20px;color:#1f2937;\">Dfoods</div>`}
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;">
          ${html}
        </div>
        <div style="text-align:center;color:#6b7280;font-size:12px;margin-top:12px;">© ${new Date().getFullYear()} Dfoods</div>
      </div>`;

    let result;

    if (USE_GMAIL) {
      // Use Gmail OAuth2
      result = await sendEmailViaGmail({
        to,
        from: `"Dfoods" <${FROM_EMAIL}>`,
        subject,
        html: wrappedHtml
      });
      
      return { success: true, info: result };
    } else if (SENDGRID_API_KEY) {
      // Fallback to SendGrid
      const sgMail = (await import('@sendgrid/mail')).default;
      sgMail.setApiKey(SENDGRID_API_KEY);

      const msg = {
        to,
        from: {
          email: FROM_EMAIL,
          name: 'Dfoods'
        },
        subject,
        html: wrappedHtml,
        text: wrappedHtml.replace(/<[^>]*>/g, ''),
      };

      const response = await sgMail.send(msg);
      
      return { success: true, info: response };
    } else {
      const error = 'No email service configured. Configure Gmail OAuth2 or SendGrid.';
      return { success: false, error };
    }
  } catch (error) {
    return { success: false, error: error.message, fullError: error };
  }
};

// Send welcome email for new account
export const sendWelcomeEmail = async (user) => {
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0;">
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
  `;

  try {
    const result = await sendEmail(user.email, '🎉 Welcome to Dfoods - Your Premium Jaggery Journey Begins!', html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send checkout pending email
export const sendCheckoutPendingEmail = async (order) => {
  const { user, totalAmount } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FEF9E7; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>⏳ Your Order is Pending Payment</h3>
      <p>Order #${order._id}</p>
      <p><strong>Amount Due:</strong> ₹${totalAmount.toLocaleString()}</p>
      <p>Please complete your payment to confirm your order.</p>
    </div>
    <p>If you have any questions, feel free to contact us.</p>
  `;

  try {
    const result = await sendEmail(user.email, `⏳ Complete Your Order - #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order) => {
  const { user, items, totalAmount, shippingAddress } = order;
  const itemsList = items.map(item => `
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
      <span>${item.product.name} x ${item.quantity}</span>
      <span>₹${(item.product.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');

  const html = `
    <p>Dear ${user.name},</p>
    <p>Thank you for your order! We're excited to prepare your premium jaggery products.</p>
    <div style="background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> #${order._id}</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</p>
      <h4>Items Ordered:</h4>
      ${itemsList}
      <h4 style="margin-top: 20px;">Shipping Address:</h4>
      <p>${shippingAddress.fullName}<br>
      ${shippingAddress.address}<br>
      ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
      ${shippingAddress.country}</p>
    </div>
    <p>We'll send you another email when your order ships!</p>
  `;

  try {
    const result = await sendEmail(user.email, `✅ Order Confirmed - #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send payment success email
export const sendPaymentSuccessEmail = async (order) => {
  const { user, totalAmount } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #D5F4E6; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
      <h3>✅ Payment Received</h3>
      <p>We've successfully received your payment of <strong>₹${totalAmount.toLocaleString()}</strong> for Order #${order._id}</p>
    </div>
    <p>Your order is now being processed and will be shipped soon. You'll receive a shipping confirmation email with tracking details.</p>
    <p>Thank you for choosing Dfoods for your premium jaggery needs!</p>
  `;

  try {
    const result = await sendEmail(user.email, `💳 Payment Successful - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send payment error email
export const sendPaymentErrorEmail = async (order, errorMessage) => {
  const { user } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FADBD8; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Payment Processing Error</h3>
      <p>We encountered an issue processing your payment for Order #${order._id}.</p>
      <p><strong>Error:</strong> ${errorMessage}</p>
    </div>
    <p>Please try again or contact our support team if the issue persists.</p>
    <p>Your order has been placed but is pending payment confirmation.</p>
  `;

  try {
    const result = await sendEmail(user.email, `❌ Payment Failed - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send payment reminder email
export const sendPaymentReminderEmail = async (order) => {
  const { user, totalAmount } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FEF9E7; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>⏰ Complete Your Payment</h3>
      <p>Your order #${order._id} is still pending payment of <strong>₹${totalAmount.toLocaleString()}</strong>.</p>
      <p>Please complete your payment to confirm your order and start processing.</p>
    </div>
    <p>If you've already made the payment, please ignore this email.</p>
  `;

  try {
    const result = await sendEmail(user.email, `⏰ Payment Reminder - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send shipping confirmation email
export const sendShippingConfirmationEmail = async (order) => {
  const { user } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #EBF8FF; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>📦 Order Shipped</h3>
      <p>Great news! Your order #${order._id} has been shipped and is on its way to you.</p>
      <p><strong>Expected Delivery:</strong> 2-3 business days</p>
      <p><strong>Tracking Number:</strong> DF${order._id.toString().slice(-8).toUpperCase()}</p>
    </div>
    <p>You can track your package using the tracking number above.</p>
    <p>Thank you for choosing Dfoods!</p>
  `;

  try {
    const result = await sendEmail(user.email, `🚚 Your Order is Shipped - #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send delivery confirmation email
export const sendDeliveryConfirmationEmail = async (order) => {
  const { user } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #D5F4E6; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>🎉 Your Order Has Been Delivered!</h3>
      <p>We hope you enjoy your premium jaggery products from Dfoods!</p>
      <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
    </div>
    <p>Thank you for choosing Dfoods for your premium jaggery needs!</p>
  `;

  try {
    const result = await sendEmail(user.email, `✅ Order Delivered - #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send order cancellation email
export const sendOrderCancellationEmail = async (order) => {
  const { user, totalAmount } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FADBD8; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>❌ Order Cancelled</h3>
      <p>Your order #${order._id} has been cancelled.</p>
      <p>If payment was made, a refund of ₹${totalAmount.toLocaleString()} will be processed within 3-5 business days.</p>
    </div>
    <p>We're sorry for any inconvenience. If you have any questions, please contact our support team.</p>
  `;

  try {
    const result = await sendEmail(user.email, `❌ Order Cancelled - #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send order edited email
export const sendOrderEditedEmail = async (order) => {
  const { user, totalAmount } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #EBF8FF; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>📝 Your Order Has Been Updated</h3>
      <p>Order #${order._id}</p>
      <p><strong>Updated Total:</strong> ₹${totalAmount.toLocaleString()}</p>
      <p>Please review your updated order details.</p>
    </div>
    <p>If you have any questions, please contact our support team.</p>
  `;

  try {
    const result = await sendEmail(user.email, `📝 Order Updated - #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send pickup order email
export const sendPickupOrderEmail = async (order) => {
  const { user, shippingAddress } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #D5F4E6; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>✅ Your Order is Ready!</h3>
      <p>Order #${order._id}</p>
      <p>Please visit our store to pickup your order at your convenience.</p>
      <p><strong>Pickup Location:</strong><br>
      ${shippingAddress?.address || 'Store Address'}<br>
      ${shippingAddress?.city || ''}, ${shippingAddress?.state || ''}</p>
    </div>
    <p>Don't forget to bring your order ID for quick pickup!</p>
  `;

  try {
    const result = await sendEmail(user.email, `📦 Order Ready for Pickup - #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send order invoice email
export const sendOrderInvoiceEmail = async (order) => {
  const { user, items, totalAmount, shippingAddress } = order;
  const itemsList = items.map(item => `
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
      <span>${item.product.name} x ${item.quantity}</span>
      <span>₹${(item.product.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');

  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>📄 Invoice Details</h3>
      <p><strong>Order ID:</strong> #${order._id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      <h4>Items:</h4>
      ${itemsList}
      <div style="font-size: 18px; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 2px solid #E67E22;">
        <div style="display: flex; justify-content: space-between;">
          <span>Total Amount:</span>
          <span>₹${totalAmount.toLocaleString()}</span>
        </div>
      </div>
      <h4 style="margin-top: 20px;">Billing Address:</h4>
      <p>${shippingAddress.fullName}<br>
      ${shippingAddress.address}<br>
      ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
      ${shippingAddress.country}</p>
    </div>
    <p>Thank you for your business!</p>
  `;

  try {
    const result = await sendEmail(user.email, `📄 Invoice for Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send discount notification email
export const sendDiscountNotificationEmail = async (user, discountCode, discountPercent) => {
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
      <h3>🎉 ${discountPercent}% OFF Your Next Order!</h3>
      <p>Use code: <strong>${discountCode}</strong></p>
      <p>Valid for a limited time only!</p>
    </div>
    <p>Don't miss out on this exclusive offer for our valued customers!</p>
  `;

  try {
    const result = await sendEmail(user.email, '🎉 Special Discount Just for You!', html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send greeting shopping again email
export const sendGreetingShoppingAgainEmail = async (user) => {
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
      <h3>🍯 It's Been a While!</h3>
      <p>We noticed you haven't visited us recently. We have new premium jaggery products that you might love!</p>
      <p>Come back and explore our latest collection.</p>
    </div>
    <p>Visit us today and enjoy exclusive deals on your favorite products!</p>
  `;

  try {
    const result = await sendEmail(user.email, '👋 We Miss You! Come Back for More Premium Jaggery', html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FDF6E3; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
      <h3>🔐 Reset Your Password</h3>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #E67E22; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    </div>
    <p>If you didn't request this password reset, please ignore this email.</p>
  `;

  try {
    const result = await sendEmail(user.email, '🔐 Password Reset Request - Dfoods', html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send shipping updated email
export const sendShippingUpdatedEmail = async (order, trackingInfo) => {
  const { user } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #EBF8FF; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>📦 Shipping Information Updated</h3>
      <p>Order #${order._id}</p>
      <p>${trackingInfo || 'Your package is in transit and will be delivered soon.'}</p>
    </div>
    <p>Track your order for the latest updates!</p>
  `;

  try {
    const result = await sendEmail(user.email, `📦 Shipping Update - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send out for delivery email
export const sendOutForDeliveryEmail = async (order) => {
  const { user } = order;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FEF9E7; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>📦 Your Package is On Its Way!</h3>
      <p>Order #${order._id}</p>
      <p>Your order is out for delivery and will arrive today!</p>
      <p>Please keep your phone handy for delivery updates.</p>
    </div>
    <p>Thank you for choosing Dfoods!</p>
  `;

  try {
    const result = await sendEmail(user.email, `🚚 Out for Delivery - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send return created email
export const sendReturnCreatedEmail = async (returnRequest) => {
  const { user, order } = returnRequest;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #F4ECF7; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>🔄 Your Return Request Has Been Received</h3>
      <p>Return ID: #${returnRequest._id}</p>
      <p>Order: #${order._id}</p>
      <p>We will review your request and get back to you within 24-48 hours.</p>
    </div>
    <p>Thank you for your patience!</p>
  `;

  try {
    const result = await sendEmail(user.email, `🔄 Return Request Created - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send return received email
export const sendReturnReceivedEmail = async (returnRequest) => {
  const { user, order } = returnRequest;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #D5F4E6; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>✅ We've Received Your Return</h3>
      <p>Return ID: #${returnRequest._id}</p>
      <p>We have received your returned item and are processing your refund.</p>
      <p>The refund will be credited within 5-7 business days.</p>
    </div>
    <p>Thank you for your patience!</p>
  `;

  try {
    const result = await sendEmail(user.email, `✅ Return Received - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send return approved email
export const sendReturnApprovedEmail = async (returnRequest) => {
  const { user, order } = returnRequest;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #D5F4E6; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>✅ Your Return Request Has Been Approved</h3>
      <p>Return ID: #${returnRequest._id}</p>
      <p>Please ship the item back to us. We'll send you a refund once we receive it.</p>
      <p>Return instructions have been sent to your email.</p>
    </div>
    <p>Thank you for choosing Dfoods!</p>
  `;

  try {
    const result = await sendEmail(user.email, `✅ Return Request Approved - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send return declined email
export const sendReturnDeclinedEmail = async (returnRequest, reason) => {
  const { user, order } = returnRequest;
  const html = `
    <p>Dear ${user.name},</p>
    <div style="background-color: #FADBD8; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>❌ Your Return Request Has Been Declined</h3>
      <p>Return ID: #${returnRequest._id}</p>
      <p><strong>Reason:</strong> ${reason || 'Does not meet return policy criteria'}</p>
      <p>If you have any questions, please contact our support team.</p>
    </div>
    <p>We're here to help!</p>
  `;

  try {
    const result = await sendEmail(user.email, `❌ Return Request Declined - Order #${order._id}`, html);
    return result;
  } catch (error) {
    throw error;
  }
};

// Send promotional email (custom template from admin)
export const sendPromotionalEmail = async (to, subject, htmlContent) => {
  try {
    const result = await sendEmail(to, subject, htmlContent);
    return result;
  } catch (error) {
    throw error;
  }
};

export default { sendEmail };
 