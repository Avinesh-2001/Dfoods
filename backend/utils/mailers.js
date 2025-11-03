// utils/mailer.js
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

// Configure SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_USER;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('✅ SendGrid API Key configured');
  console.log(`   FROM_EMAIL: ${FROM_EMAIL || 'NOT SET'}`);
} else {
  console.warn('⚠️ SENDGRID_API_KEY not configured in environment variables');
  console.warn('   Emails will not be sent!');
  console.warn('   Add SENDGRID_API_KEY to your Render environment variables');
}

// SendGrid is ready - no transporter needed
console.log('\n✅ ============================================');
console.log('✅ SendGrid Email Service Ready!');
console.log('✅ ============================================\n');

/**
 * Send email using SendGrid
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // Validate SendGrid configuration
    if (!SENDGRID_API_KEY) {
      const error = 'SENDGRID_API_KEY not configured in environment variables';
      console.error(`\n❌ ${error}`);
      console.error(`   Add SENDGRID_API_KEY to your Render environment variables\n`);
      return { success: false, error };
    }

    if (!FROM_EMAIL) {
      const error = 'FROM_EMAIL not configured in environment variables';
      console.error(`\n❌ ${error}`);
      console.error(`   Add FROM_EMAIL to your Render environment variables\n`);
      return { success: false, error };
    }

    const msg = {
      to,
      from: {
        email: FROM_EMAIL,
        name: 'Dfoods'
      },
      subject,
      html,
      text: html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    console.log(`\n📧 Attempting to send email via SendGrid:`);
    console.log(`   To: ${to}`);
    console.log(`   From: ${FROM_EMAIL}`);
    console.log(`   Subject: ${subject}`);

    const response = await sgMail.send(msg);
    
    console.log(`✅ Email sent successfully via SendGrid!`);
    console.log(`   Status Code: ${response[0]?.statusCode || 'N/A'}`);
    console.log(`   To: ${to}\n`);
    
    return { success: true, info: response };
  } catch (error) {
    console.error(`\n❌ Error sending email to ${to}:`);
    console.error(`   Error Message: ${error.message}`);
    
    if (error.response) {
      console.error(`   Status Code: ${error.response.statusCode}`);
      console.error(`   Response Body:`, JSON.stringify(error.response.body, null, 2));
    }
    
    // Provide helpful error messages
    if (error.code === 401) {
      console.error(`\n   🔐 AUTHENTICATION ERROR:`);
      console.error(`   - Check SENDGRID_API_KEY in Render environment variables`);
      console.error(`   - Make sure the API key is valid and active\n`);
    } else if (error.code === 403) {
      console.error(`\n   🚫 PERMISSION ERROR:`);
      console.error(`   - Your SendGrid API key may not have send permissions`);
      console.error(`   - Verify API key permissions in SendGrid dashboard\n`);
    }
    
    console.error(`❌ Full error object:`, error);
    console.error('');
    
    return { success: false, error: error.message, fullError: error };
  }
};

export default { sendEmail };
 