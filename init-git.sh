#!/bin/bash
# Initialize git repository and push to GitHub

set -e

echo "📦 Initializing Git Repository"
echo "=============================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi
echo ""

# Add all files
echo "📝 Adding files to git..."
git add .
echo "✅ Files added"
echo ""

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Hairven by Elyn salon website

- Immersive dynamic background with 5 cycling images
- Dark theme design with pink and gold accents
- Collapsible pricing sections
- Online booking form with JSON storage
- Fully responsive mobile-first design
- Docker containerization
- Caddy reverse proxy integration"
echo "✅ Initial commit created"
echo ""

# Add remote (if not exists)
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin git@github.com-hairven:shamarrz/hairven.git
    echo "✅ Remote added"
else
    echo "✅ Remote already configured"
    git remote set-url origin git@github.com-hairven:shamarrz/hairven.git
fi
echo ""

# Check if we can connect to GitHub
echo "🔍 Testing GitHub connection..."
if ssh -T git@github.com-hairven 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ GitHub connection successful"
    echo ""
    
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    echo ""
    echo "✅ Code pushed to GitHub successfully!"
    echo ""
    echo "Repository: https://github.com/shamarrz/hairven"
else
    echo "⚠️  GitHub SSH connection test failed"
    echo ""
    echo "Please:"
    echo "1. Run './generate-ssh-key.sh' to generate SSH key"
    echo "2. Add the public key to GitHub: https://github.com/settings/keys"
    echo "3. Run this script again: ./init-git.sh"
    echo ""
    exit 1
fi

