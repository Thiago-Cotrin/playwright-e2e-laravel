# Playwright E2E tests for a Laravel CRUD app

[![E2E tests](https://github.com/Thiago-Cotrin/playwright-e2e-laravel/actions/workflows/e2e.yml/badge.svg)](https://github.com/Thiago-Cotrin/playwright-e2e-laravel/actions/workflows/e2e.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.61-2EAD33)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED)

*[Versão em português](README.pt-BR.md)*

End-to-end test suite for a library management app built with Laravel and MySQL.
One command starts the database, the app and the tests in containers, and runs
a complete user journey in a real browser: list, create, edit and delete
records in five related modules (users, libraries, people, authors, books).

I built it for the Software Quality course of my Information Systems degree
(UEMG, Brazil, 2026). While writing the tests I found **11 defects** in the app
under test and fixed them in a separate layer. See [docs/findings.md](docs/findings.md).

## Highlights

- **Isolated and reproducible:** MySQL 8.4, the Laravel app and Playwright each run in their own container, with health checks so the tests only start when the app is ready. The app is pinned to a commit, so upstream changes cannot break the suite.
- **Same run locally and in CI:** GitHub Actions runs the same `docker compose` command, after a TypeScript type check.
- **User-facing locators:** the tests use labels, roles and visible text (`getByLabel`, `getByRole`), never CSS selectors, and check every action on the list screen.
- **Page object + test data factory:** [`ListPage`](tests/support/list-page.ts) wraps opening, finding, editing and deleting rows (including the confirm dialog). [`createTestData`](tests/support/test-data.ts) gives every run unique values.
- **Leaves no data behind:** step 3 deletes everything the run created, in an order that respects foreign keys.
- **Evidence on failure:** HTML report, trace, screenshot and video, uploaded as a CI artifact.

## What is tested

| Step | Journey |
|---|---|
| 1 | Open the home page and the five lists; create a user, a library (managed by that user), a person, an author and a book (by that author); add the person to the library |
| 2 | Edit every record and check the new values on each list, including the author's new name on the book list |
| 3 | Delete every record, confirming the browser dialog, and check that each row is gone |

Full traceability (TC-01 to TC-14.5): [docs/test-cases.md](docs/test-cases.md).

## Run it

Requirement: Docker with `docker compose`. Nothing else needs to be installed.

```bash
docker compose up --build --abort-on-container-exit --exit-code-from tests
docker compose down --volumes
```

Expected result: `3 passed`. The HTML report is written to `playwright-report/`.

Keep the app running for a live demo:

```bash
docker compose up --build -d database app   # app on http://localhost:8000
docker compose run --rm tests
```

On Windows, `.\scripts\run-demo.ps1` does the same.

Type check only (Node 22): `npm ci && npm run typecheck`.

## Project structure

```text
tests/
  library-crud.spec.ts       the three-step journey
  support/list-page.ts       page object for the list screens
  support/test-data.ts       unique data per run
docker/app/
  Dockerfile                 clones the app at a pinned commit and applies the fixes
  overrides/                 fixed files (see docs/findings.md)
  entrypoint.sh              waits for MySQL, runs migrations and seed, starts the server
docker-compose.yml           database, app and tests services
Dockerfile                   Playwright test image
playwright.config.ts         serial run, 1 worker, retries in CI, evidence on failure
.github/workflows/e2e.yml    type check + Docker Compose run on every push and PR
```

## Notes

- The database credentials in `docker-compose.yml` are for this disposable test environment only.
- The labels in the tests (`Nome:`, `Excluir`, ...) are in Portuguese because the app's interface is in Portuguese.
- Application under test: [guilherme-ferraz/qa-atividade-avaliativa-2](https://github.com/guilherme-ferraz/qa-atividade-avaliativa-2) (course base project). The test suite, the Docker setup and the fixes in `docker/app/overrides` are mine.

## Author

Thiago Cotrin · [LinkedIn](https://www.linkedin.com/in/thiago-cotrin/) · [GitHub](https://github.com/Thiago-Cotrin)
