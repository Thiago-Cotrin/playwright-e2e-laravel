# Test cases and traceability

## Strategy

The suite runs on Chromium with Playwright. It uses a single worker and a
serial `describe` block to reproduce one continuous user journey. Every run
creates unique data (a run id in every value) and step 3 removes everything it
created, so the database ends as it started.

Locators use what a user sees (labels, roles, visible text) instead of CSS
classes or ids, so the tests break only when the user-facing behaviour changes.

## Step 1: open, list and create

| ID | Case | Main action | Expected result |
|---|---|---|---|
| TC-01 | Home page | Open `/` | Links to the five modules are visible |
| TC-02 | List users | Open `/users` | Table and "create" link are visible |
| TC-03 | List libraries | Open `/bibliotecas` | Table and "create" link are visible |
| TC-04 | List people | Open `/pessoas` | Table and "create" link are visible |
| TC-05 | List authors | Open `/autores` | Table and "create" link are visible |
| TC-06 | List books | Open `/livros` | Table and "create" link are visible |
| TC-07 | Create user | Name, email, password and role | User appears on the list with its role |
| TC-08 | Create library | Details and manager | Library appears with its manager |
| TC-09 | Create person | Details and password confirmation | Person appears on the list |
| TC-10 | Create author | Biographical details | Author appears on the list |
| TC-11 | Create book | Details and author | Book appears linked to the author |
| TC-12 | Link person to library | Pick the person in the library | Person appears in the library |

## Step 2: edit

| ID | Case | Fields changed | Expected result |
|---|---|---|---|
| TC-13.1 | Edit user | Name, email and role | New values on the list |
| TC-13.2 | Edit library | Name, address, phone and email | New values on the list |
| TC-13.3 | Edit person | Name, email, phone and registration number | New values on the list |
| TC-13.4 | Edit author | Name, nationality and birth date | New values on the list |
| TC-13.5 | Edit book | Title, ISBN and publication date | New values on the list, with the author's new name |

## Step 3: delete

| ID | Case | Order | Expected result |
|---|---|---|---|
| TC-14.1 | Delete book | 1 | Book no longer listed |
| TC-14.2 | Delete author | 2 | Author no longer listed |
| TC-14.3 | Delete library | 3 | Library no longer listed |
| TC-14.4 | Delete person | 4 | Person no longer listed |
| TC-14.5 | Delete user | 5 | User no longer listed |

The order respects the relations between records, so a cascade delete can never
hide a failed deletion.

## Pass criteria

- every page responds with a 2xx status;
- every create and edit is confirmed on the list screen;
- every delete asks for confirmation and removes the row;
- the three tests pass;
- on failure, Playwright keeps a trace, a screenshot and a video.
