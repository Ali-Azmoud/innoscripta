#!/bin/sh

# Exit immediately if a command fails
set -e

# Install dependencies
echo "Running composer install..."
composer install --no-dev --optimize-autoloader

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Fetch news articles (optional, if required)
echo "Fetching news articles..."
php artisan news:fetch || echo "News fetch command failed, continuing..."

# Execute the main container command (e.g., php-fpm)
exec "$@"
