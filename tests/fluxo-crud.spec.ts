import { expect, type Locator, type Page, test } from '@playwright/test';

const runId = `${Date.now()}-${process.pid}`;

const dados = {
  usuario: {
    nome: `E2E Usuário ${runId}`,
    nomeAtualizado: `E2E Usuário Atualizado ${runId}`,
    email: `usuario.${runId}@example.test`,
    emailAtualizado: `usuario.atualizado.${runId}@example.test`,
  },
  biblioteca: {
    nome: `E2E Biblioteca ${runId}`,
    nomeAtualizado: `E2E Biblioteca Atualizada ${runId}`,
    endereco: 'Rua dos Testes, 100',
    enderecoAtualizado: 'Avenida Playwright, 200',
    telefone: '(11) 4002-8922',
    telefoneAtualizado: '(11) 99999-0000',
    email: `biblioteca.${runId}@example.test`,
    emailAtualizado: `biblioteca.atualizada.${runId}@example.test`,
  },
  pessoa: {
    nome: `E2E Pessoa ${runId}`,
    nomeAtualizado: `E2E Pessoa Atualizada ${runId}`,
    email: `pessoa.${runId}@example.test`,
    emailAtualizado: `pessoa.atualizada.${runId}@example.test`,
    telefone: '(21) 3000-1000',
    telefoneAtualizado: '(21) 98888-1000',
    matricula: `MAT-${runId}`,
    matriculaAtualizada: `MAT-ALT-${runId}`,
    senha: 'Teste@123456',
  },
  autor: {
    nome: `E2E Autor ${runId}`,
    nomeAtualizado: `E2E Autor Atualizado ${runId}`,
    nacionalidade: 'Brasileira',
    nacionalidadeAtualizada: 'Portuguesa',
    nascimento: '1985-03-10',
    nascimentoAtualizado: '1986-04-11',
  },
  livro: {
    titulo: `E2E Livro ${runId}`,
    tituloAtualizado: `E2E Livro Atualizado ${runId}`,
    isbn: `978-${runId}`,
    isbnAtualizado: `979-${runId}`,
    publicacao: '2024-06-01',
    publicacaoAtualizada: '2025-06-01',
  },
};

function linhaDaTabela(page: Page, texto: string): Locator {
  return page.locator('tbody tr').filter({ hasText: texto });
}

async function abrirListagem(page: Page, caminho: string, novoRegistro: RegExp) {
  const resposta = await page.goto(caminho);
  expect(resposta?.ok(), `A página ${caminho} deve responder com sucesso`).toBeTruthy();
  await expect(page.locator('table')).toBeVisible();
  await expect(page.getByRole('link', { name: novoRegistro })).toBeVisible();
}

async function excluirRegistro(page: Page, caminho: string, identificador: string) {
  await page.goto(caminho);
  const linha = linhaDaTabela(page, identificador);
  await expect(linha).toHaveCount(1);

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    await dialog.accept();
  });

  await linha.getByRole('button', { name: 'Excluir' }).click();
  await expect(linhaDaTabela(page, identificador)).toHaveCount(0);
}

test.describe.serial('Jornada completa de um usuário da Biblioteca', () => {
  test('1 - acessa listagens e inclui novos registros', async ({ page }) => {
    await test.step('Acessar a página inicial e todas as listagens', async () => {
      await page.goto('/');

      for (const nome of ['Bibliotecas', 'Usuários', 'Pessoas', 'Autores', 'Livros']) {
        await expect(page.getByRole('link', { name: new RegExp(nome, 'i') })).toBeVisible();
      }

      await abrirListagem(page, '/users', /Criar Novo Usuário/i);
      await abrirListagem(page, '/bibliotecas', /Criar Nova Biblioteca/i);
      await abrirListagem(page, '/pessoas', /Criar Nova Pessoa/i);
      await abrirListagem(page, '/autores', /Cadastrar novo Autor/i);
      await abrirListagem(page, '/livros', /Cadastrar Novo Livro/i);
    });

    await test.step('Cadastrar usuário responsável', async () => {
      await page.goto('/users/create');
      await page.getByLabel('Nome:').fill(dados.usuario.nome);
      await page.getByLabel('Email:').fill(dados.usuario.email);
      await page.getByLabel('Senha:').fill(dados.pessoa.senha);
      await page.getByLabel('Role:').selectOption('admin', { force: true });
      await page.getByRole('button', { name: 'Criar Usuário' }).click();

      await expect(page).toHaveURL(/\/users$/);
      await expect(linhaDaTabela(page, dados.usuario.email)).toContainText('admin');
    });

    await test.step('Cadastrar biblioteca', async () => {
      await page.goto('/bibliotecas/new');
      await page.getByLabel('Nome:').fill(dados.biblioteca.nome);
      await page.getByLabel('Endereço:').fill(dados.biblioteca.endereco);
      await page.getByLabel('Telefone:').fill(dados.biblioteca.telefone);
      await page.getByLabel('Email:').fill(dados.biblioteca.email);
      await page
        .getByLabel('Responsável:')
        .selectOption({ label: dados.usuario.nome }, { force: true });
      await page.getByRole('button', { name: 'Criar Biblioteca' }).click();

      await expect(page).toHaveURL(/\/bibliotecas$/);
      const linha = linhaDaTabela(page, dados.biblioteca.nome);
      await expect(linha).toContainText(dados.biblioteca.endereco);
      await expect(linha).toContainText(dados.usuario.nome);
    });

    await test.step('Cadastrar pessoa', async () => {
      await page.goto('/pessoas/create');
      await page.getByLabel('Nome:').fill(dados.pessoa.nome);
      await page.getByLabel('Email:').fill(dados.pessoa.email);
      await page.getByLabel('Telefone:').fill(dados.pessoa.telefone);
      await page.getByLabel('Matrícula:').fill(dados.pessoa.matricula);
      await page.getByLabel('Senha:', { exact: true }).fill(dados.pessoa.senha);
      await page.getByLabel('Confirmar Senha:').fill(dados.pessoa.senha);
      await page.getByRole('button', { name: 'Criar Pessoa' }).click();

      await expect(page).toHaveURL(/\/pessoas$/);
      await expect(linhaDaTabela(page, dados.pessoa.email)).toContainText(dados.pessoa.matricula);
    });

    await test.step('Cadastrar autor', async () => {
      await page.goto('/autores/create');
      await page.getByLabel('Nome:').fill(dados.autor.nome);
      await page.getByLabel('Nacionalidade:').fill(dados.autor.nacionalidade);
      await page.getByLabel('Data de Nascimento:').fill(dados.autor.nascimento);
      await page.getByRole('button', { name: 'Cadastrar Autor' }).click();

      await expect(page).toHaveURL(/\/autores$/);
      await expect(linhaDaTabela(page, dados.autor.nome)).toContainText(dados.autor.nacionalidade);
    });

    await test.step('Cadastrar livro vinculado ao autor', async () => {
      await page.goto('/livros/create');
      await page.getByLabel('Título:').fill(dados.livro.titulo);
      await page.getByLabel('ISBN:').fill(dados.livro.isbn);
      await page.getByLabel('Data de Publicação:').fill(dados.livro.publicacao);
      await page.getByLabel('Autor:').selectOption({ label: dados.autor.nome }, { force: true });
      await page.getByRole('button', { name: 'Cadastrar Livro' }).click();

      await expect(page).toHaveURL(/\/livros$/);
      const linha = linhaDaTabela(page, dados.livro.titulo);
      await expect(linha).toContainText(dados.autor.nome);
      await expect(linha).toContainText(dados.livro.isbn);
    });

    await test.step('Associar a pessoa à biblioteca', async () => {
      await page.goto('/bibliotecas');
      await linhaDaTabela(page, dados.biblioteca.nome)
        .getByRole('link', { name: 'Editar' })
        .click();
      await page.getByRole('link', { name: /Adicionar Pessoa à Biblioteca/i }).click();
      await page
        .getByLabel('Pessoa')
        .selectOption(
          { label: `${dados.pessoa.nome} (${dados.pessoa.email})` },
          { force: true },
        );
      await page.getByRole('button', { name: 'Adicionar Pessoa' }).click();

      await expect(page).toHaveURL(/\/bibliotecas\/edit\/\d+$/);
      await expect(linhaDaTabela(page, dados.pessoa.email)).toContainText(dados.pessoa.nome);
    });
  });

  test('2 - edita os registros existentes', async ({ page }) => {
    await test.step('Editar usuário', async () => {
      await page.goto('/users');
      await linhaDaTabela(page, dados.usuario.email).getByRole('link', { name: 'Editar' }).click();
      await page.getByLabel('Nome:').fill(dados.usuario.nomeAtualizado);
      await page.getByLabel('Email:').fill(dados.usuario.emailAtualizado);
      await page.getByLabel('Role:').selectOption('user', { force: true });
      await page.getByRole('button', { name: 'Atualizar Usuário' }).click();

      const linha = linhaDaTabela(page, dados.usuario.emailAtualizado);
      await expect(linha).toContainText(dados.usuario.nomeAtualizado);
      await expect(linha).toContainText('user');
    });

    await test.step('Editar biblioteca', async () => {
      await page.goto('/bibliotecas');
      await linhaDaTabela(page, dados.biblioteca.nome).getByRole('link', { name: 'Editar' }).click();
      await page.getByLabel('Nome:').fill(dados.biblioteca.nomeAtualizado);
      await page.getByLabel('Endereço:').fill(dados.biblioteca.enderecoAtualizado);
      await page.getByLabel('Telefone:').fill(dados.biblioteca.telefoneAtualizado);
      await page.getByLabel('Email:').fill(dados.biblioteca.emailAtualizado);
      await page.getByRole('button', { name: 'Atualizar Biblioteca' }).click();

      const linha = linhaDaTabela(page, dados.biblioteca.nomeAtualizado);
      await expect(linha).toContainText(dados.biblioteca.enderecoAtualizado);
      await expect(linha).toContainText(dados.biblioteca.telefoneAtualizado);
    });

    await test.step('Editar pessoa', async () => {
      await page.goto('/pessoas');
      await linhaDaTabela(page, dados.pessoa.email).getByRole('link', { name: 'Editar' }).click();
      await page.getByLabel('Nome:').fill(dados.pessoa.nomeAtualizado);
      await page.getByLabel('Email:').fill(dados.pessoa.emailAtualizado);
      await page.getByLabel('Telefone:').fill(dados.pessoa.telefoneAtualizado);
      await page.getByLabel('Matrícula:').fill(dados.pessoa.matriculaAtualizada);
      await page.getByRole('button', { name: 'Atualizar Pessoa' }).click();

      const linha = linhaDaTabela(page, dados.pessoa.emailAtualizado);
      await expect(linha).toContainText(dados.pessoa.nomeAtualizado);
      await expect(linha).toContainText(dados.pessoa.matriculaAtualizada);
    });

    await test.step('Editar autor', async () => {
      await page.goto('/autores');
      await linhaDaTabela(page, dados.autor.nome).getByRole('link', { name: 'Editar' }).click();
      await page.getByLabel('Nome:').fill(dados.autor.nomeAtualizado);
      await page.getByLabel('Nacionalidade:').fill(dados.autor.nacionalidadeAtualizada);
      await page.getByLabel('Data de Nascimento:').fill(dados.autor.nascimentoAtualizado);
      await page.getByRole('button', { name: 'Atualizar Autor' }).click();

      const linha = linhaDaTabela(page, dados.autor.nomeAtualizado);
      await expect(linha).toContainText(dados.autor.nacionalidadeAtualizada);
      await expect(linha).toContainText(dados.autor.nascimentoAtualizado);
    });

    await test.step('Editar livro', async () => {
      await page.goto('/livros');
      await linhaDaTabela(page, dados.livro.titulo).getByRole('link', { name: 'Editar' }).click();
      await page.getByLabel('Título:').fill(dados.livro.tituloAtualizado);
      await page.getByLabel('ISBN:').fill(dados.livro.isbnAtualizado);
      await page.getByLabel('Data de Publicação:').fill(dados.livro.publicacaoAtualizada);
      await page.getByRole('button', { name: 'Atualizar Livro' }).click();

      const linha = linhaDaTabela(page, dados.livro.tituloAtualizado);
      await expect(linha).toContainText(dados.livro.isbnAtualizado);
      await expect(linha).toContainText(dados.autor.nomeAtualizado);
    });
  });

  test('3 - exclui todos os registros inseridos no teste', async ({ page }) => {
    await excluirRegistro(page, '/livros', dados.livro.tituloAtualizado);
    await excluirRegistro(page, '/autores', dados.autor.nomeAtualizado);
    await excluirRegistro(page, '/bibliotecas', dados.biblioteca.nomeAtualizado);
    await excluirRegistro(page, '/pessoas', dados.pessoa.emailAtualizado);
    await excluirRegistro(page, '/users', dados.usuario.emailAtualizado);
  });
});
