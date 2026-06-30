#!/bin/sh
set -eu

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force --no-interaction
fi

echo "Aguardando o banco de dados..."
until php -r '
try {
    new PDO(
        "mysql:host=" . getenv("DB_HOST") . ";port=" . getenv("DB_PORT") . ";dbname=" . getenv("DB_DATABASE"),
        getenv("DB_USERNAME"),
        getenv("DB_PASSWORD")
    );
} catch (Throwable $error) {
    exit(1);
}
'; do
    sleep 2
done

php artisan config:clear
php artisan migrate:fresh --seed --force --no-interaction

exec php artisan serve --host=0.0.0.0 --port=8000

