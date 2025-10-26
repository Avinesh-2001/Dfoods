# Dfood Environment Setup Script for Windows PowerShell

Write-Host "🔧 Setting up Dfood environment files..." -ForegroundColor Cyan
Write-Host ""

# Create backend .env
Write-Host "📦 Creating backend/.env..." -ForegroundColor Yellow
$backendEnv = @"
MONGO_URI=mongodb://localhost:27017/dfood
JWT_SECRET=dfood_secret_key_2025_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key_here
"@

try {
    $backendEnv | Out-File -FilePath "backend/.env" -Encoding utf8 -NoNewline
    Write-Host "✅ backend/.env created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create backend/.env" -ForegroundColor Red
    exit 1
}

# Create frontend .env.local
Write-Host "📦 Creating frontend/.env.local..." -ForegroundColor Yellow
$frontendEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
"@

try {
    $frontendEnv | Out-File -FilePath "frontend/.env.local" -Encoding utf8 -NoNewline
    Write-Host "✅ frontend/.env.local created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create frontend/.env.local" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Environment files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   1. Change JWT_SECRET in backend/.env before production"
Write-Host "   2. Add your Stripe API key if you want to test payments"
Write-Host "   3. Make sure MongoDB is running"
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Install dependencies: cd backend; npm install"
Write-Host "   2. Install dependencies: cd frontend; npm install"
Write-Host "   3. Start backend: cd backend; npm run dev"
Write-Host "   4. Start frontend: cd frontend; npm run dev"
Write-Host ""

