FROM php:8.4-cli-bookworm

ARG APP_REPOSITORY=https://github.com/guilherme-ferraz/qa-atividade-avaliativa-2.git
ARG APP_COMMIT=e8a10ded520ae3acf9cb5cbcf9c4940e5671659c

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libzip-dev \
    && docker-php-ext-install pdo_mysql bcmath zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /app

RUN git clone "${APP_REPOSITORY}" . \
    && git checkout "${APP_COMMIT}" \
    && rm -rf .git

COPY overrides/ /app/

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

COPY entrypoint.sh /usr/local/bin/app-entrypoint
RUN chmod +x /usr/local/bin/app-entrypoint \
    && chown -R www-data:www-data /app/storage /app/bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["app-entrypoint"]

