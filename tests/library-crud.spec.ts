import { expect, test } from '@playwright/test';
import { listPages } from './support/list-page';
import { createTestData } from './support/test-data';

/**
 * Full user journey through the library app, in three steps that share data:
 *   1. open every list and create one record per module (+ link a person to a library)
 *   2. edit every record created in step 1
 *   3. delete everything this run created
 *
 * The steps run serially because each one depends on the previous one.
 * Form labels are the app's own (Portuguese) labels, as a real user sees them.
 */
const data = createTestData();

test.describe.serial('Library app: complete CRUD journey', () => {
  test('1 - lists every module and creates new records', async ({ page }) => {
    const lists = listPages(page);

    await test.step('Open the home page and every list', async () => {
      await page.goto('/');
      for (const name of ['Bibliotecas', 'Usuários', 'Pessoas', 'Autores', 'Livros']) {
        await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
      }
      for (const list of Object.values(lists)) {
        await list.open();
      }
    });

    await test.step('Create the user who will manage the library', async () => {
      await page.goto('/users/create');
      await page.getByLabel('Nome:').fill(data.user.name);
      await page.getByLabel('Email:').fill(data.user.email);
      await page.getByLabel('Senha:').fill(data.user.password);
      await page.getByLabel('Role:').selectOption('admin', { force: true });
      await page.getByRole('button', { name: 'Criar Usuário' }).click();

      await lists.users.expectOnList();
      await expect(lists.users.row(data.user.email)).toContainText('admin');
    });

    await test.step('Create a library', async () => {
      await page.goto('/bibliotecas/new');
      await page.getByLabel('Nome:').fill(data.library.name);
      await page.getByLabel('Endereço:').fill(data.library.address);
      await page.getByLabel('Telefone:').fill(data.library.phone);
      await page.getByLabel('Email:').fill(data.library.email);
      await page.getByLabel('Responsável:').selectOption({ label: data.user.name }, { force: true });
      await page.getByRole('button', { name: 'Criar Biblioteca' }).click();

      await lists.libraries.expectOnList();
      const row = lists.libraries.row(data.library.name);
      await expect(row).toContainText(data.library.address);
      await expect(row).toContainText(data.user.name);
    });

    await test.step('Create a person', async () => {
      await page.goto('/pessoas/create');
      await page.getByLabel('Nome:').fill(data.person.name);
      await page.getByLabel('Email:').fill(data.person.email);
      await page.getByLabel('Telefone:').fill(data.person.phone);
      await page.getByLabel('Matrícula:').fill(data.person.registration);
      await page.getByLabel('Senha:', { exact: true }).fill(data.person.password);
      await page.getByLabel('Confirmar Senha:').fill(data.person.password);
      await page.getByRole('button', { name: 'Criar Pessoa' }).click();

      await lists.people.expectOnList();
      await expect(lists.people.row(data.person.email)).toContainText(data.person.registration);
    });

    await test.step('Create an author', async () => {
      await page.goto('/autores/create');
      await page.getByLabel('Nome:').fill(data.author.name);
      await page.getByLabel('Nacionalidade:').fill(data.author.nationality);
      await page.getByLabel('Data de Nascimento:').fill(data.author.birthDate);
      await page.getByRole('button', { name: 'Cadastrar Autor' }).click();

      await lists.authors.expectOnList();
      await expect(lists.authors.row(data.author.name)).toContainText(data.author.nationality);
    });

    await test.step('Create a book linked to the author', async () => {
      await page.goto('/livros/create');
      await page.getByLabel('Título:').fill(data.book.title);
      await page.getByLabel('ISBN:').fill(data.book.isbn);
      await page.getByLabel('Data de Publicação:').fill(data.book.publishedOn);
      await page.getByLabel('Autor:').selectOption({ label: data.author.name }, { force: true });
      await page.getByRole('button', { name: 'Cadastrar Livro' }).click();

      await lists.books.expectOnList();
      const row = lists.books.row(data.book.title);
      await expect(row).toContainText(data.author.name);
      await expect(row).toContainText(data.book.isbn);
    });

    await test.step('Add the person to the library', async () => {
      await lists.libraries.openEdit(data.library.name);
      await page.getByRole('link', { name: /Adicionar Pessoa à Biblioteca/i }).click();
      await page
        .getByLabel('Pessoa')
        .selectOption({ label: `${data.person.name} (${data.person.email})` }, { force: true });
      await page.getByRole('button', { name: 'Adicionar Pessoa' }).click();

      await expect(page).toHaveURL(/\/bibliotecas\/edit\/\d+$/);
      await expect(page.locator('tbody tr').filter({ hasText: data.person.email })).toContainText(
        data.person.name,
      );
    });
  });

  test('2 - edits every record created in step 1', async ({ page }) => {
    const lists = listPages(page);

    await test.step('Edit the user', async () => {
      await lists.users.openEdit(data.user.email);
      await page.getByLabel('Nome:').fill(data.user.updatedName);
      await page.getByLabel('Email:').fill(data.user.updatedEmail);
      await page.getByLabel('Role:').selectOption('user', { force: true });
      await page.getByRole('button', { name: 'Atualizar Usuário' }).click();

      const row = lists.users.row(data.user.updatedEmail);
      await expect(row).toContainText(data.user.updatedName);
      await expect(row).toContainText('user');
    });

    await test.step('Edit the library', async () => {
      await lists.libraries.openEdit(data.library.name);
      await page.getByLabel('Nome:').fill(data.library.updatedName);
      await page.getByLabel('Endereço:').fill(data.library.updatedAddress);
      await page.getByLabel('Telefone:').fill(data.library.updatedPhone);
      await page.getByLabel('Email:').fill(data.library.updatedEmail);
      await page.getByRole('button', { name: 'Atualizar Biblioteca' }).click();

      const row = lists.libraries.row(data.library.updatedName);
      await expect(row).toContainText(data.library.updatedAddress);
      await expect(row).toContainText(data.library.updatedPhone);
    });

    await test.step('Edit the person', async () => {
      await lists.people.openEdit(data.person.email);
      await page.getByLabel('Nome:').fill(data.person.updatedName);
      await page.getByLabel('Email:').fill(data.person.updatedEmail);
      await page.getByLabel('Telefone:').fill(data.person.updatedPhone);
      await page.getByLabel('Matrícula:').fill(data.person.updatedRegistration);
      await page.getByRole('button', { name: 'Atualizar Pessoa' }).click();

      const row = lists.people.row(data.person.updatedEmail);
      await expect(row).toContainText(data.person.updatedName);
      await expect(row).toContainText(data.person.updatedRegistration);
    });

    await test.step('Edit the author', async () => {
      await lists.authors.openEdit(data.author.name);
      await page.getByLabel('Nome:').fill(data.author.updatedName);
      await page.getByLabel('Nacionalidade:').fill(data.author.updatedNationality);
      await page.getByLabel('Data de Nascimento:').fill(data.author.updatedBirthDate);
      await page.getByRole('button', { name: 'Atualizar Autor' }).click();

      const row = lists.authors.row(data.author.updatedName);
      await expect(row).toContainText(data.author.updatedNationality);
      await expect(row).toContainText(data.author.updatedBirthDate);
    });

    await test.step('Edit the book', async () => {
      await lists.books.openEdit(data.book.title);
      await page.getByLabel('Título:').fill(data.book.updatedTitle);
      await page.getByLabel('ISBN:').fill(data.book.updatedIsbn);
      await page.getByLabel('Data de Publicação:').fill(data.book.updatedPublishedOn);
      await page.getByRole('button', { name: 'Atualizar Livro' }).click();

      const row = lists.books.row(data.book.updatedTitle);
      await expect(row).toContainText(data.book.updatedIsbn);
      // The book list shows the author's current name, so it must reflect "Edit the author".
      await expect(row).toContainText(data.author.updatedName);
    });
  });

  test('3 - deletes every record this run created', async ({ page }) => {
    const lists = listPages(page);

    // Order respects the relations (book -> author, library -> user), so no
    // cascade delete can hide a failed deletion.
    await lists.books.delete(data.book.updatedTitle);
    await lists.authors.delete(data.author.updatedName);
    await lists.libraries.delete(data.library.updatedName);
    await lists.people.delete(data.person.updatedEmail);
    await lists.users.delete(data.user.updatedEmail);
  });
});
