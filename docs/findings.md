# Defects found while writing the tests

The application under test is pinned to commit `e8a10de` of
[`guilherme-ferraz/qa-atividade-avaliativa-2`](https://github.com/guilherme-ferraz/qa-atividade-avaliativa-2).
While planning the end-to-end journey, I found defects that made the CRUD flow
impossible to complete. The upstream code is left untouched: the Docker image
copies the fixed files from [`docker/app/overrides`](../docker/app/overrides)
on top of it at build time.

| # | Defect | Impact for the user | Fix |
|---|---|---|---|
| 1 | No delete buttons on the list screens | Records could not be deleted | Delete actions with a confirm dialog |
| 2 | `PessoaController::destroy()` was empty | The person stayed in the database | Deletion implemented, with redirect and message |
| 3 | `AutorController` had no `destroy()` | The delete route failed with an error | Method implemented |
| 4 | Author form used `method="PUT"` | Browsers sent the request incorrectly (HTML forms only support GET/POST) | `POST` with `_method=PUT` (Laravel method spoofing) |
| 5 | Creating a library ignored phone and email | Typed data was lost | All fields validated and saved |
| 6 | Updating a library ignored the phone | Edits were incomplete | Field added to the update |
| 7 | Library edit form did not send the manager | Updates were inconsistent | Manager select added |
| 8 | User creation form did not send a password | Invalid users were created | Password field and validation added |
| 9 | User creation ignored the role | The chosen role was not saved | Field included on create |
| 10 | `data_nascimento` was not mass-assignable in `Autor` | The birth date could be discarded | Added to `$fillable` |
| 11 | Edit actions were not available on every list | The user journey was incomplete | Edit actions made consistent |

The fixes are small and limited to the tested CRUD flow; no behaviour outside
the assignment was added.
