FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    supervisor \
    nodejs \
    npm

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN npm install -g pnpm

WORKDIR /var/www

COPY --chown=www-data:www-data . .

RUN composer install --no-dev --optimize-autoloader

RUN chmod -R 755 storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
