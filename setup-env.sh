#!/bin/bash

# Dfood Environment Setup Script for Mac/Linux

echo "🔧 Setting up Dfood environment files..."
echo ""

# Create backend .env
echo "📦 Creating backend/.env..."
cat > backend/.env << 'EOF'
MONGO_URI=mongodb://localhost:27017/dfood
JWT_SECRET=dfood_secret_key_2025_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key_here
EOF

if [ -f "backend/.env" ]; then
    echo "✅ backend/.env created successfully"
else
    echo "❌ Failed to create backend/.env"
    exit 1
fi

# Create frontend .env.local
echo "📦 Creating frontend/.env.local..."
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF

if [ -f "frontend/.env.local" ]; then
    echo "✅ frontend/.env.local created successfully"
else
    echo "❌ Failed to create frontend/.env.local"
    exit 1
fi

echo ""
echo "🎉 Environment files created successfully!"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. Change JWT_SECRET in backend/.env before production"
echo "   2. Add your Stripe API key if you want to test payments"
echo "   3. Make sure MongoDB is running"
echo ""
echo "📚 Next steps:"
echo "   1. Install dependencies: cd backend && npm install"
echo "   2. Install dependencies: cd frontend && npm install"
echo "   3. Start backend: cd backend && npm run dev"
echo "   4. Start frontend: cd frontend && npm run dev"
echo ""

