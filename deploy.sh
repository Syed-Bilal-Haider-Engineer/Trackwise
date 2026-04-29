#!/usr/bin/env bash
# TrackWise — Production deploy script
# Run on your server: bash deploy.sh

set -euo pipefail

INSTALL_DIR="/opt/trackwise"
REPO_URL="${REPO_URL:-https://github.com/yourname/trackwise.git}"

echo "🚀 TrackWise Deployment"
echo "========================"

# Create install dir
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Check for .env
if [ ! -f .env ]; then
  echo "❌ No .env file found at $INSTALL_DIR/.env"
  echo "   Copy .env.example and fill in your values, then re-run."
  exit 1
fi

# Load env
set -a; source .env; set +a

echo "📦 Pulling latest images..."
export GITHUB_REPOSITORY="${GITHUB_REPOSITORY:-yourname/trackwise}"
export IMAGE_TAG="${IMAGE_TAG:-latest}"

docker compose -f docker-compose.prod.yml pull

echo "♻️  Restarting services..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "🧹 Pruning old images..."
docker image prune -f

echo ""
echo "✅ Deployment complete!"
echo "   App running at http://$(curl -s ifconfig.me 2>/dev/null || echo 'your-server-ip')"
echo ""
docker compose -f docker-compose.prod.yml ps
