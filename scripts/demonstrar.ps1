$ErrorActionPreference = 'Stop'

docker compose up --build -d database app
docker compose run --rm tests

Write-Host ''
Write-Host 'Aplicação: http://localhost:8000'
Write-Host 'Relatório: .\playwright-report\index.html'
Write-Host 'Encerrar: docker compose down --volumes'
