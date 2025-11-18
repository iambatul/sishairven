#!/bin/bash
# Fix git push rejection by pulling remote changes first

set -e

echo "🔧 Fixing git push rejection..."
echo ""

# Check current status
echo "📊 Current status:"
git status
echo ""

# Pull remote changes and allow unrelated histories
echo "📥 Pulling remote changes..."
git pull origin main --allow-unrelated-histories --no-edit
echo ""

# If there are uncommitted changes, add them
if ! git diff-index --quiet HEAD --; then
    echo "📝 Staging uncommitted changes..."
    git add .
    git commit -m "Update local changes"
    echo ""
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main
echo ""

echo "✅ Successfully pushed to GitHub!"
echo "Repository: https://github.com/shamarrz/hairven"

