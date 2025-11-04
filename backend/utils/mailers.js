// utils/mailer.js
import dotenv from 'dotenv';
import { sendEmailViaGmail, isGmailConfigured } from '../config/gmailOAuth2.js';

dotenv.config();

// Check which email service is configured
const USE_GMAIL = isGmailConfigured();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.GMAIL_USER;

if (USE_GMAIL) {
  console.log('\n✅ ============================================');
  console.log('✅ Gmail OAuth2 Email Service Ready!');
  console.log(`   FROM_EMAIL: ${FROM_EMAIL || 'NOT SET'}`);
  console.log('✅ ============================================\n');
} else if (SENDGRID_API_KEY) {
  console.log('\n✅ ============================================');
  console.log('✅ SendGrid Email Service Ready! (Fallback)');
  console.log(`   FROM_EMAIL: ${FROM_EMAIL || 'NOT SET'}`);
  console.log('✅ ============================================\n');
} else {
  console.warn('\n⚠️ ============================================');
  console.warn('⚠️ No email service configured!');
  console.warn('   Configure Gmail OAuth2 or SendGrid');
  console.warn('⚠️ ============================================\n');
}

/**
 * Send email using Gmail OAuth2 (preferred) or SendGrid (fallback)
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // Check configuration
    if (!FROM_EMAIL) {
      const error = 'FROM_EMAIL not configured in environment variables';
      console.error(`\n❌ ${error}`);
      console.error(`   Add FROM_EMAIL or GMAIL_USER to your environment variables\n`);
      return { success: false, error };
    }

    console.log(`\n📧 Attempting to send email ${USE_GMAIL ? 'via Gmail OAuth2' : 'via SendGrid'}:`);
    console.log(`   To: ${to}`);
    console.log(`   From: ${FROM_EMAIL}`);
    console.log(`   Subject: ${subject}`);

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
      
      console.log(`✅ Email sent successfully via Gmail OAuth2!`);
      console.log(`   Message ID: ${result.messageId || 'N/A'}`);
      console.log(`   To: ${to}\n`);
      
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
      
      console.log(`✅ Email sent successfully via SendGrid!`);
      console.log(`   Status Code: ${response[0]?.statusCode || 'N/A'}`);
      console.log(`   To: ${to}\n`);
      
      return { success: true, info: response };
    } else {
      const error = 'No email service configured. Configure Gmail OAuth2 or SendGrid.';
      console.error(`\n❌ ${error}\n`);
      return { success: false, error };
    }
  } catch (error) {
    console.error(`\n❌ Error sending email to ${to}:`);
    console.error(`   Error Message: ${error.message}`);
    
    if (error.response) {
      console.error(`   Status Code: ${error.response.statusCode}`);
      console.error(`   Response Body:`, JSON.stringify(error.response.body, null, 2));
    }
    
    // Provide helpful error messages
    if (USE_GMAIL) {
      if (error.message.includes('refresh_token')) {
        console.error(`\n   🔐 OAUTH2 ERROR:`);
        console.error(`   - Check GMAIL_REFRESH_TOKEN in environment variables`);
        console.error(`   - Run scripts/generateGmailRefreshToken.js to generate a refresh token\n`);
      } else if (error.message.includes('access_token')) {
        console.error(`\n   🔐 OAUTH2 ERROR:`);
        console.error(`   - Access token expired. Refresh token should auto-refresh.`);
        console.error(`   - Check GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET\n`);
      }
    } else if (error.code === 401) {
      console.error(`\n   🔐 AUTHENTICATION ERROR:`);
      console.error(`   - Check SENDGRID_API_KEY in environment variables`);
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
 