# ==============================================================================
# STAGE 1: Frontend Asset Builder (Node.js + Vite + Tailwind CSS v4)
# ==============================================================================
FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app

# Copy package definition
COPY package.json ./

# Install npm dependencies (resolves Linux native bindings for Vite & Rolldown)
RUN npm install

# Copy application source code for Vite bundling
COPY vite.config.js ./
COPY resources ./resources
COPY public ./public

# Build compiled production assets to public/build
RUN npm run build

# ==============================================================================
# STAGE 2: Production Application Runtime (PHP 8.4-FPM + Nginx + Supervisord)
# ==============================================================================
FROM php:8.4-fpm-alpine

# Install system dependencies, Nginx, Supervisor, dos2unix, and required build tools
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    git \
    unzip \
    dos2unix \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    icu-dev \
    sqlite-dev \
    oniguruma-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        bcmath \
        gd \
        intl \
        mbstring \
        opcache \
        pdo \
        pdo_mysql \
        pdo_sqlite \
        xml \
        zip \
    && rm -rf /tmp/* /var/cache/apk/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configure PHP Opcache for Production
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.validate_timestamps=0'; \
    echo 'opcache.save_comments=1'; \
    echo 'opcache.fast_shutdown=1'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Configure Nginx & Supervisor & Entrypoint
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN dos2unix /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

# Create necessary logging and runtime directories
RUN mkdir -p /var/log/supervisor /var/run /var/log/nginx /var/www/html

WORKDIR /var/www/html

# Copy application source code
COPY . .

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/public/build /var/www/html/public/build

# Install PHP production dependencies via Composer
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Create storage directory structure and assign ownership to www-data
RUN mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    database \
    && chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# Expose internal port 80 (accessible only within Docker proxy network)
EXPOSE 80

# Run entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
