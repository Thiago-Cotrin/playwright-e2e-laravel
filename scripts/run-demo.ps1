# Starts the app, runs the suite and leaves the app running for a live demo (Windows).
$ErrorActionPreference = 'Stop'

docker compose up --build -d database app
docker compose run --rm tests

Write-Host ''
Write-Host 'App:    http://localhost:8000'
Write-Host 'Report: .\playwright-report\index.html'
Write-Host 'Stop:   docker compose down --volumes'
