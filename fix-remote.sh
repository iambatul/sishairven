#!/bin/bash
# Fix git remote URL to use correct SSH host alias

echo "🔧 Fixing git remote URL..."
git remote set-url origin git@github.com-hairven:shamarrz/hairven.git
echo "✅ Remote URL updated"
echo ""
echo "Current remote:"
git remote -v
echo ""
echo "Now try pushing again:"
echo "  git branch -M main"
echo "  git push -u origin main"

