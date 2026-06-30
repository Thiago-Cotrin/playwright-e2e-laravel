# Atividade Avaliativa 3 - Testes E2E

Suíte de testes ponta a ponta da aplicação de biblioteca do repositório
[`guilherme-ferraz/qa-atividade-avaliativa-2`](https://github.com/guilherme-ferraz/qa-atividade-avaliativa-2),
fixada no commit `e8a10ded520ae3acf9cb5cbcf9c4940e5671659c`.

O projeto usa Playwright com Chromium e executa todas as dependências em
containers: aplicação Laravel, MySQL e testes E2E.

## O que é testado

A jornada automatizada segue exatamente as três etapas pedidas no enunciado:

1. acesso às páginas, listagem e inclusão de usuário, biblioteca, pessoa, autor e livro;
2. edição dos cinco registros inseridos;
3. exclusão de todos os registros criados pelo teste.

O fluxo também associa a pessoa criada à biblioteca, validando uma operação
adicional da aplicação. Os dados recebem um identificador único em cada execução.

Consulte a rastreabilidade detalhada em [docs/CASOS_DE_TESTE.md](docs/CASOS_DE_TESTE.md).

## Pré-requisito

- Docker Desktop com o comando `docker compose` disponível.

Não é necessário instalar PHP, Composer, MySQL, Node.js ou Playwright na
máquina. As imagens Docker instalam e isolam todas essas dependências.

## Execução completa

No diretório deste repositório:

```bash
docker compose down --volumes
docker compose up --build --abort-on-container-exit --exit-code-from tests
```

Resultado esperado:

```text
3 passed
```

O relatório HTML é gravado em `playwright-report/`. Evidências de falha, como
vídeos, screenshots e traces, são gravadas em `test-results/`.

## Demonstração em tempo real

Para manter a aplicação disponível durante a apresentação:

```bash
docker compose up --build -d database app
docker compose run --rm tests
```

A aplicação fica acessível em <http://localhost:8000>. Para consultar o
resultado detalhado, abra `playwright-report/index.html` no navegador.

Ao terminar:

```bash
docker compose down --volumes
```

No Windows, o mesmo fluxo pode ser iniciado com:

```powershell
.\scripts\demonstrar.ps1
```

## Material de apresentação

O deck pronto está em
[`outputs/apresentacao-testes-e2e.pptx`](outputs/apresentacao-testes-e2e.pptx).
O roteiro falado está em
[`docs/ROTEIRO_APRESENTACAO.md`](docs/ROTEIRO_APRESENTACAO.md).

## Estrutura

```text
.
|-- .github/workflows/e2e.yml       # integração contínua
|-- docker/app/                     # imagem da aplicação sob teste
|   |-- overrides/                  # correções encontradas durante os testes
|   `-- entrypoint.sh               # banco, migrations, seed e servidor
|-- docs/
|   |-- ACHADOS_E_CORRECOES.md
|   |-- CASOS_DE_TESTE.md
|   `-- ROTEIRO_APRESENTACAO.md
|-- scripts/demonstrar.ps1
|-- tests/fluxo-crud.spec.ts        # as três etapas da atividade
|-- docker-compose.yml
|-- Dockerfile                      # ambiente Playwright
`-- playwright.config.ts
```

## Decisões de qualidade

- aplicação-base fixada por hash de commit para evitar alterações inesperadas;
- um worker e execução serial para preservar a jornada entre as três etapas;
- seletores baseados em rótulos, papéis e texto visível, como um usuário real;
- confirmação explícita antes das exclusões;
- relatório HTML e evidências automáticas em falhas;
- execução idêntica localmente e no GitHub Actions;
- dependências com versões fixadas em `package-lock.json`.

## Publicação e compartilhamento

Depois de criar o repositório no GitHub, conceda acesso ao professor:

1. abra `Settings > Collaborators`;
2. selecione `Add people`;
3. informe `guilherme-ferraz`;
4. conceda permissão de escrita.

Também é possível usar GitHub CLI:

```bash
gh api --method PUT repos/SEU_USUARIO/SEU_REPOSITORIO/collaborators/guilherme-ferraz \
  -f permission=push
```

O convite precisa ser aceito pelo usuário convidado para aparecer como
colaboração ativa.
