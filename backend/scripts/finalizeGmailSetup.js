/**
 * Final setup script - prepares everything for Render deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.join(__dirname, '../.env');

console.log('\n🔧 Finalizing Gmail OAuth2 Setup...\n');

// Read current .env
let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

// Ensure all required variables are set
const requiredVars = {
  GMAIL_CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
  GMAIL_CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE',
  GMAIL_REDIRECT_URI: 'https://dfoods.onrender.com',
  GMAIL_USER: 'avijangid7011@gmail.com'
};

// Update or add each variable
Object.entries(requiredVars).forEach(([key, value]) => {
  const regex = new RegExp(`^${key}=.*`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
    console.log(`✅ Updated: ${key}`);
  } else {
    if (!envContent.endsWith('\n') && envContent.length > 0) {
      envContent += '\n';
    }
    envContent += `${key}=${value}\n`;
    console.log(`✅ Added: ${key}`);
  }
});

// Ensure GMAIL_REFRESH_TOKEN line exists (even if empty)
if (!envContent.includes('GMAIL_REFRESH_TOKEN=')) {
  envContent += 'GMAIL_REFRESH_TOKEN=\n';
  console.log('✅ Added: GMAIL_REFRESH_TOKEN (placeholder)');
}

fs.writeFileSync(envPath, envContent, 'utf8');

console.log('\n✅ .env file configured!\n');

// Create Render environment variables template
const renderEnvTemplate = `# ============================================
# Render Environment Variables
# Copy these to your Render dashboard
# ============================================

GMAIL_CLIENT_ID=435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=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
GMAIL_REFRESH_TOKEN=<GET THIS FROM OAUTH FLOW>
GMAIL_REDIRECT_URI=https://dfoods.onrender.com
GMAIL_USER=avijangid7011@gmail.com

# ============================================
# Instructions to get GMAIL_REFRESH_TOKEN:
# ============================================
# 
# Option 1: Use the OAuth callback endpoint
# 1. Add this route to your server.js temporarily:
#    app.get('/oauth2callback', async (req, res) => {
#      const { google } = await import('googleapis');
#      const OAuth2 = google.auth.OAuth2;
#      const oauth2Client = new OAuth2(
#        process.env.GMAIL_CLIENT_ID,
#        process.env.GMAIL_CLIENT_SECRET,
#        'https://dfoods.onrender.com/oauth2callback'
#      );
#      const { tokens } = await oauth2Client.getToken(req.query.code);
#      res.send('Refresh Token: ' + tokens.refresh_token);
#    });
#
# 2. Visit: https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https://www.googleapis.com/auth/gmail.send&prompt=consent&response_type=code&client_id=435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com&redirect_uri=https://dfoods.onrender.com/oauth2callback
#
# 3. After authorization, you'll be redirected and see the refresh token
#
# Option 2: Use local script
# 1. Run: node scripts/generateGmailRefreshToken.js
# 2. Follow the prompts
# 3. Copy the refresh token

`;

const renderEnvPath = path.join(__dirname, '../RENDER_ENV_VARIABLES.txt');
fs.writeFileSync(renderEnvPath, renderEnvTemplate, 'utf8');

console.log('✅ Created: RENDER_ENV_VARIABLES.txt');
console.log('\n📋 Next Steps:');
console.log('   1. Get your GMAIL_REFRESH_TOKEN (see instructions above)');
console.log('   2. Add all variables to Render dashboard');
console.log('   3. Redeploy your backend service');
console.log('\n');

