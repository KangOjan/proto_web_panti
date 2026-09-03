#!/bin/sh
set -e

# Ensure storage and bootstrap directories exist
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/database

# Ensure SQLite file exists if SQLite is used
if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ] && [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

# Set proper ownership and permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Generate application key if missing
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force --no-interaction || true
fi

# Link storage directory
php artisan storage:link --force --no-interaction || true

# Run database migrations
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force --no-interaction || true
fi

# Cache configuration, routes, and views in production
if [ "${APP_ENV:-production}" = "production" ]; then
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Execute supervisor to start PHP-FPM and Nginx
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
