# Casos de teste e rastreabilidade

## Estratégia

Os casos são executados no Chromium por Playwright. A suíte usa um único worker
e um bloco serial para reproduzir uma jornada contínua. Cada execução cria
dados únicos e, na terceira etapa, remove tudo o que inseriu.

## Etapa 1 - acesso, listagem e inclusão

| ID | Caso | Ação principal | Resultado esperado |
|---|---|---|---|
| CT-01 | Acessar início | Abrir `/` | Links dos cinco módulos visíveis |
| CT-02 | Listar usuários | Abrir `/users` | Tabela e ação de cadastro visíveis |
| CT-03 | Listar bibliotecas | Abrir `/bibliotecas` | Tabela e ação de cadastro visíveis |
| CT-04 | Listar pessoas | Abrir `/pessoas` | Tabela e ação de cadastro visíveis |
| CT-05 | Listar autores | Abrir `/autores` | Tabela e ação de cadastro visíveis |
| CT-06 | Listar livros | Abrir `/livros` | Tabela e ação de cadastro visíveis |
| CT-07 | Incluir usuário | Preencher nome, email, senha e role | Usuário aparece na listagem |
| CT-08 | Incluir biblioteca | Preencher dados e selecionar responsável | Biblioteca aparece com responsável |
| CT-09 | Incluir pessoa | Preencher dados e confirmar senha | Pessoa aparece na listagem |
| CT-10 | Incluir autor | Preencher dados biográficos | Autor aparece na listagem |
| CT-11 | Incluir livro | Preencher dados e selecionar autor | Livro aparece vinculado ao autor |
| CT-12 | Associar pessoa | Selecionar pessoa na biblioteca | Pessoa aparece na biblioteca |

## Etapa 2 - edição

| ID | Caso | Campos alterados | Resultado esperado |
|---|---|---|---|
| CT-13.1 | Editar usuário | Nome, email e role | Novos valores na listagem |
| CT-13.2 | Editar biblioteca | Nome, endereço, telefone e email | Novos valores na listagem |
| CT-13.3 | Editar pessoa | Nome, email, telefone e matrícula | Novos valores na listagem |
| CT-13.4 | Editar autor | Nome, nacionalidade e nascimento | Novos valores na listagem |
| CT-13.5 | Editar livro | Título, ISBN e publicação | Novos valores na listagem |

## Etapa 3 - exclusão

| ID | Caso | Ordem | Resultado esperado |
|---|---|---|---|
| CT-14.1 | Excluir livro | 1 | Livro deixa de aparecer |
| CT-14.2 | Excluir autor | 2 | Autor deixa de aparecer |
| CT-14.3 | Excluir biblioteca | 3 | Biblioteca deixa de aparecer |
| CT-14.4 | Excluir pessoa | 4 | Pessoa deixa de aparecer |
| CT-14.5 | Excluir usuário | 5 | Usuário deixa de aparecer |

A ordem respeita as dependências entre os registros e evita exclusões em
cascata mascarando verificações posteriores.

## Critérios de aprovação

- todas as páginas respondem com sucesso;
- cada criação e edição é confirmada pela listagem;
- cada exclusão exige confirmação e remove o registro;
- os três testes terminam aprovados;
- em falha, Playwright salva trace, screenshot e vídeo.

