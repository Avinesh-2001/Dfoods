/**
 * Script to add Gmail OAuth2 credentials to .env file
 * This script will append Gmail OAuth2 variables if they don't exist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.join(__dirname, '../.env');

// Gmail OAuth2 credentials
const gmailVars = {
  GMAIL_CLIENT_ID: '435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com',
  GMAIL_CLIENT_SECRET: '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',
  GMAIL_REDIRECT_URI: 'https://dfoods.onrender.com',
  GMAIL_USER: 'abhishek020621@gmail.com'
};

try {
  let envContent = '';
  
  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Found existing .env file\n');
  } else {
    console.log('📝 Creating new .env file\n');
  }

  // Check which variables already exist
  const existingVars = [];
  const missingVars = [];

  Object.keys(gmailVars).forEach(key => {
    const regex = new RegExp(`^${key}=`, 'm');
    if (regex.test(envContent)) {
      existingVars.push(key);
    } else {
      missingVars.push(key);
    }
  });

  if (existingVars.length > 0) {
    console.log('⚠️  These variables already exist in .env:');
    existingVars.forEach(key => console.log(`   - ${key}`));
    console.log('');
  }

  if (missingVars.length > 0) {
    console.log('📝 Adding missing Gmail OAuth2 variables to .env:\n');
    
    // Add a separator comment if file has content
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    if (envContent) {
      envContent += '\n# ============================================\n';
      envContent += '# Gmail OAuth2 Configuration\n';
      envContent += '# ============================================\n';
    }

    // Add missing variables
    missingVars.forEach(key => {
      const value = gmailVars[key];
      envContent += `${key}=${value}\n`;
      console.log(`   ✅ Added: ${key}`);
    });

    // Add note about refresh token
    envContent += '\n# IMPORTANT: Generate GMAIL_REFRESH_TOKEN by running:\n';
    envContent += '#   node scripts/generateGmailRefreshToken.js\n';
    envContent += 'GMAIL_REFRESH_TOKEN=\n';

    // Write back to file
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('\n✅ .env file updated successfully!\n');
    console.log('📝 Next step: Run `node scripts/generateGmailRefreshToken.js` to generate the refresh token\n');
  } else {
    console.log('✅ All Gmail OAuth2 variables are already in .env file!\n');
    console.log('📝 Next step: Run `node scripts/generateGmailRefreshToken.js` to generate the refresh token\n');
  }

} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
  process.exit(1);
}

