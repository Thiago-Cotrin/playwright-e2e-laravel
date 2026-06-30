# Roteiro de apresentação

Duração sugerida: 8 a 10 minutos.

## 1. Contexto - 1 minuto

- objetivo: validar de ponta a ponta a aplicação de biblioteca;
- repositório-base escolhido: `guilherme-ferraz/qa-atividade-avaliativa-2`;
- ferramenta: Playwright;
- ambiente: Docker Compose com Laravel, MySQL e Chromium.

## 2. Arquitetura - 1 minuto

Mostrar `docker-compose.yml` e explicar:

- `database`: MySQL 8.4;
- `app`: código Laravel fixado por commit e iniciado após migrations e seed;
- `tests`: imagem oficial do Playwright;
- GitHub Actions repete a mesma execução.

## 3. Executar - 1 minuto

```bash
docker compose up --build -d database app
docker compose run --rm tests
```

Enquanto os testes rodam, abrir `tests/fluxo-crud.spec.ts` e destacar o bloco
`describe.serial`.

## 4. Etapa 1 - 2 minutos

Explicar que o teste:

1. acessa as cinco listagens;
2. cria usuário responsável;
3. cria biblioteca;
4. cria pessoa;
5. cria autor;
6. cria livro associado ao autor;
7. associa a pessoa à biblioteca.

Mostrar no terminal o primeiro teste aprovado.

## 5. Etapa 2 - 1 minuto

Explicar que o segundo teste altera todos os registros e confirma os novos
valores nas tabelas. Ressaltar que a validação ocorre pela interface, e não
diretamente no banco.

## 6. Etapa 3 - 1 minuto

Explicar a ordem de exclusão: livro, autor, biblioteca, pessoa e usuário. Cada
ação aceita uma confirmação e verifica que o registro desapareceu.

## 7. Evidências e achados - 1 minuto

- abrir `playwright-report/`;
- mostrar que traces, screenshots e vídeos são retidos em falhas;
- citar as lacunas encontradas no sistema-base e o documento
  `docs/ACHADOS_E_CORRECOES.md`.

## 8. Encerramento

```bash
docker compose down --volumes
```

Mensagem final: a suíte cobre as três etapas do enunciado, é repetível,
isolada em containers e executada também pela integração contínua.

## Divisão sugerida para quatro integrantes

1. contexto, ferramenta e arquitetura;
2. etapa 1;
3. etapa 2;
4. etapa 3, evidências e conclusão.

Para três integrantes, a primeira pessoa também apresenta a etapa 1.

