#!/bin/bash
# Force push to overwrite remote (use with caution)

set -e

echo "⚠️  WARNING: This will overwrite the remote repository!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo "📤 Force pushing to GitHub..."
git push -u origin main --force
echo ""

echo "✅ Force push complete!"
echo "Repository: https://github.com/shamarrz/hairven"

