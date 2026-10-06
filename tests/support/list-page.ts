import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page object for the CRUD list screens of the library app
 * (/users, /bibliotecas, /pessoas, /autores, /livros).
 *
 * The app under test is in Portuguese, so the visible labels used by the
 * locators ("Editar", "Excluir", ...) stay in Portuguese on purpose.
 */
export class ListPage {
  constructor(
    private readonly page: Page,
    readonly path: string,
    private readonly createLinkName: RegExp,
  ) {}

  /** Opens the list and checks that it rendered: HTTP 2xx, a table and the "create" link. */
  async open(): Promise<void> {
    const response = await this.page.goto(this.path);
    expect(response?.ok(), `${this.path} should respond with a 2xx status`).toBeTruthy();
    await expect(this.page.locator('table')).toBeVisible();
    await expect(this.page.getByRole('link', { name: this.createLinkName })).toBeVisible();
  }

  /** The table row that contains the given text. */
  row(text: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: text });
  }

  async expectOnList(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${this.path}$`));
  }

  async openEdit(rowText: string): Promise<void> {
    await this.page.goto(this.path);
    await this.row(rowText).getByRole('link', { name: 'Editar' }).click();
  }

  /** Deletes a row, accepts the browser confirm dialog and checks the row is gone. */
  async delete(rowText: string): Promise<void> {
    await this.page.goto(this.path);
    await expect(this.row(rowText)).toHaveCount(1);

    this.page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await this.row(rowText).getByRole('button', { name: 'Excluir' }).click();
    await expect(this.row(rowText)).toHaveCount(0);
  }
}

/** One page object per module, in the order the journey uses them. */
export function listPages(page: Page) {
  return {
    users: new ListPage(page, '/users', /Criar Novo Usuário/i),
    libraries: new ListPage(page, '/bibliotecas', /Criar Nova Biblioteca/i),
    people: new ListPage(page, '/pessoas', /Criar Nova Pessoa/i),
    authors: new ListPage(page, '/autores', /Cadastrar novo Autor/i),
    books: new ListPage(page, '/livros', /Cadastrar Novo Livro/i),
  };
}
