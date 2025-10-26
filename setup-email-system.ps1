# Dfood Email System Setup Script
# ================================

Write-Host "🚀 Setting up Dfood Email Notification System..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
try {
    $mongoStatus = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($mongoStatus -and $mongoStatus.Status -eq "Running") {
        Write-Host "✅ MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB service not found or not running" -ForegroundColor Yellow
        Write-Host "   Please start MongoDB manually or install it first" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not check MongoDB status" -ForegroundColor Yellow
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
Set-Location "backend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
Set-Location "../frontend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Go back to root directory
Set-Location ".."

Write-Host ""
Write-Host "🎉 Installation completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up your .env file in the backend folder" -ForegroundColor White
Write-Host "2. Configure Gmail app password for email sending" -ForegroundColor White
Write-Host "3. Start MongoDB service" -ForegroundColor White
Write-Host "4. Run 'npm start' in backend folder" -ForegroundColor White
Write-Host "5. Run 'npm run dev' in frontend folder" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see COMPLETE_INSTALLATION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Environment Variables needed in backend/.env:" -ForegroundColor Yellow
Write-Host "   MONGODB_URI=mongodb://localhost:27017/dfood" -ForegroundColor White
Write-Host "   JWT_SECRET=your-jwt-secret" -ForegroundColor White
Write-Host "   EMAIL_USER=your-email@gmail.com" -ForegroundColor White
Write-Host "   EMAIL_PASS=your-16-character-app-password" -ForegroundColor White
Write-Host "   FRONTEND_URL=http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📧 Gmail Setup:" -ForegroundColor Yellow
Write-Host "   1. Enable 2-Factor Authentication" -ForegroundColor White
Write-Host "   2. Generate App Password" -ForegroundColor White
Write-Host "   3. Use App Password as EMAIL_PASS" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to start! Run the servers and test the email system." -ForegroundColor Green




