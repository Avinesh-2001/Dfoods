import mongoose from 'mongoose';
import EmailTemplate from '../models/EmailTemplate.js';
import dotenv from 'dotenv';

dotenv.config();

const emailTemplates = [
  // Account / User Emails
  {
    name: 'Create Account',
    category: 'Account / User Emails',
    subject: 'Verify Your Email - Dfood',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Dfood</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Verify Your Email Address</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Thank you for registering with Dfood! Please verify your email address by entering the OTP below:
          </p>
          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h3 style="color: #92400e; margin: 0; font-size: 32px; letter-spacing: 5px;">{{otp}}</h3>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This OTP will expire in 5 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2024 Dfood. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['otp'],
    isActive: true
  },
  {
    name: 'Welcome Email',
    category: 'Account / User Emails',
    subject: 'Welcome to Dfood!',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Dfood!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Hello {{user_name}}!</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Welcome to Dfood! Your account has been successfully created and verified.
          </p>
          <p style="color: #6b7280; margin-bottom: 20px;">
            You can now start shopping for the finest organic jaggery products.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{frontend_url}}" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Shopping
            </a>
          </div>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2024 Dfood. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['user_name', 'frontend_url'],
    isActive: true
  },
  {
    name: 'Forgot Password',
    category: 'Account / User Emails',
    subject: 'Reset Your Password - Dfood',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Dfood</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Reset Your Password</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Hello {{user_name}},
          </p>
          <p style="color: #6b7280; margin-bottom: 20px;">
            We received a request to reset your password. Click the button below to reset it:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{reset_link}}" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2024 Dfood. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['user_name', 'reset_link'],
    isActive: true
  },
  // Order Emails
  {
    name: 'Order Confirmation',
    category: 'Checkout / Order Emails',
    subject: 'Order Confirmed - {{order_id}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Hello {{user_name}}!</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Your order has been confirmed and we're preparing it for you.
          </p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 15px;">Order Details</h3>
            <p><strong>Order ID:</strong> {{order_id}}</p>
            <p><strong>Total Amount:</strong> ₹{{order_total}}</p>
            <p><strong>Items:</strong> {{order_items}}</p>
          </div>
          <p style="color: #6b7280; margin-bottom: 20px;">
            We'll send you another email when your order ships.
          </p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2024 Dfood. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['user_name', 'order_id', 'order_total', 'order_items'],
    isActive: true
  },
  {
    name: 'Shipping Confirmation',
    category: 'Shipping Emails',
    subject: 'Your Order is Shipped - {{order_id}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Your Order is Shipped!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Hello {{user_name}}!</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Great news! Your order has been shipped and is on its way to you.
          </p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 15px;">Shipping Details</h3>
            <p><strong>Order ID:</strong> {{order_id}}</p>
            <p><strong>Tracking Number:</strong> {{tracking_number}}</p>
            <p><strong>Estimated Delivery:</strong> {{estimated_delivery}}</p>
          </div>
          <p style="color: #6b7280; margin-bottom: 20px;">
            You can track your package using the tracking number above.
          </p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2024 Dfood. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['user_name', 'order_id', 'tracking_number', 'estimated_delivery'],
    isActive: true
  },
  {
    name: 'Delivered Order',
    category: 'Shipping Emails',
    subject: 'Order Delivered - {{order_id}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Delivered!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Hello {{user_name}}!</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Your order has been successfully delivered! We hope you enjoy your organic jaggery products.
          </p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 15px;">Delivery Details</h3>
            <p><strong>Order ID:</strong> {{order_id}}</p>
            <p><strong>Delivered On:</strong> {{delivery_date}}</p>
          </div>
          <p style="color: #6b7280; margin-bottom: 20px;">
            Thank you for choosing Dfood! We'd love to hear about your experience.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{review_link}}" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Leave a Review
            </a>
          </div>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2024 Dfood. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['user_name', 'order_id', 'delivery_date', 'review_link'],
    isActive: true
  },
  {
    name: 'Discount Notification',
    category: 'Discount / Marketing Emails',
    subject: 'Special Discount for You - {{discount_code}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Special Discount!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Hello {{user_name}}!</h2>
          <p style="color: #6b7280; margin-bottom: 20px;">
            We have a special discount just for you on our premium organic jaggery collection!
          </p>
          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h3 style="color: #92400e; margin: 0; font-size: 24px;">{{discount_amount}}% OFF</h3>
            <p style="color: #92400e; margin: 10px 0 0 0;">Use code: <strong>{{discount_code}}</strong></p>
          </div>
          <p style="color: #6b7280; margin-bottom: 20px;">
            This offer is valid until {{valid_until}}. Don't miss out!
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{shop_link}}" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Shop Now
            </a>
          </div>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2024 Dfood. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['user_name', 'discount_code', 'discount_amount', 'valid_until', 'shop_link'],
    isActive: true
  }
];

const initializeTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dfood');
    console.log('Connected to MongoDB');

    // Clear existing templates
    await EmailTemplate.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    for (const template of emailTemplates) {
      const emailTemplate = new EmailTemplate(template);
      await emailTemplate.save();
      console.log(`Created template: ${template.name}`);
    }

    console.log('All email templates initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing templates:', error);
    process.exit(1);
  }
};

initializeTemplates();



