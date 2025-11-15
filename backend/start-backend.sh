#!/bin/bash

echo "🚀 Power Meter Dashboard - Quick Start Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd server

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit server/.env with your database credentials!"
    echo ""
fi

if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

echo ""
echo "🧪 Testing database connection..."
node test-db.js

echo ""
echo "Press any key to start the backend server (Ctrl+C to exit)..."
read -n 1 -s

npm run dev
