# Testes E2E com Playwright para uma aplicação CRUD em Laravel

*[English version](README.md)*

Suíte de testes de ponta a ponta para uma aplicação de gestão de bibliotecas em Laravel e MySQL.
Um único comando sobe o banco, a aplicação e os testes em containers. Os testes percorrem, num navegador real, a jornada completa de um usuário: listar, cadastrar, editar e excluir registros em cinco módulos relacionados (usuários, bibliotecas, pessoas, autores e livros).

Fiz este projeto na disciplina de Qualidade de Software do curso de Sistemas de Informação (UEMG, 2026). Enquanto escrevia os testes, encontrei **11 defeitos** na aplicação testada e os corrigi numa camada separada, sem alterar o código original. Os defeitos estão descritos em [docs/findings.md](docs/findings.md) (em inglês).

## Destaques

- **Ambiente isolado e reproduzível:** MySQL 8.4, Laravel e Playwright rodam cada um no seu container, com healthchecks. A aplicação fica fixada num commit, então mudanças no repositório original não quebram a suíte.
- **A mesma execução no computador e no CI:** o GitHub Actions roda o mesmo `docker compose`, depois de uma verificação de tipos do TypeScript.
- **Seletores do ponto de vista do usuário:** rótulos, papéis e texto visível (`getByLabel`, `getByRole`), nunca classes CSS. Cada ação é conferida na listagem.
- **Page object e fábrica de dados:** `ListPage` concentra abrir, encontrar, editar e excluir linhas, incluindo o diálogo de confirmação. `createTestData` gera dados únicos em cada execução.
- **Não deixa dados para trás:** a etapa 3 exclui tudo o que a execução criou, na ordem que respeita as chaves estrangeiras.
- **Evidências em caso de falha:** relatório HTML, trace, captura de tela e vídeo, guardados como artefato do CI.

## Como executar

É preciso ter o Docker com `docker compose`.

```bash
docker compose up --build --abort-on-container-exit --exit-code-from tests
docker compose down --volumes
```

Resultado esperado: `3 passed`. O relatório fica em `playwright-report/`.

## Créditos

Aplicação testada: [guilherme-ferraz/qa-atividade-avaliativa-2](https://github.com/guilherme-ferraz/qa-atividade-avaliativa-2) (projeto-base da disciplina). São de minha autoria:
- a suíte de testes;
- o ambiente Docker;
- as correções em `docker/app/overrides`.

Thiago Cotrin · [LinkedIn](https://www.linkedin.com/in/thiago-cotrin/)
