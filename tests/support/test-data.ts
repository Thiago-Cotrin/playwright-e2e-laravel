/**
 * Unique test data for one run.
 *
 * Every value carries a run id, so parallel or repeated runs never collide
 * and the clean-up step can find exactly the records this run created.
 */
export function createTestData(runId = `${Date.now()}-${process.pid}`) {
  const password = 'Teste@123456';

  return {
    runId,
    user: {
      name: `E2E User ${runId}`,
      updatedName: `E2E User Updated ${runId}`,
      email: `user.${runId}@example.test`,
      updatedEmail: `user.updated.${runId}@example.test`,
      password,
    },
    library: {
      name: `E2E Library ${runId}`,
      updatedName: `E2E Library Updated ${runId}`,
      address: 'Rua dos Testes, 100',
      updatedAddress: 'Avenida Playwright, 200',
      phone: '(11) 4002-8922',
      updatedPhone: '(11) 99999-0000',
      email: `library.${runId}@example.test`,
      updatedEmail: `library.updated.${runId}@example.test`,
    },
    person: {
      name: `E2E Person ${runId}`,
      updatedName: `E2E Person Updated ${runId}`,
      email: `person.${runId}@example.test`,
      updatedEmail: `person.updated.${runId}@example.test`,
      phone: '(21) 3000-1000',
      updatedPhone: '(21) 98888-1000',
      registration: `MAT-${runId}`,
      updatedRegistration: `MAT-UPD-${runId}`,
      password,
    },
    author: {
      name: `E2E Author ${runId}`,
      updatedName: `E2E Author Updated ${runId}`,
      nationality: 'Brasileira',
      updatedNationality: 'Portuguesa',
      birthDate: '1985-03-10',
      updatedBirthDate: '1986-04-11',
    },
    book: {
      title: `E2E Book ${runId}`,
      updatedTitle: `E2E Book Updated ${runId}`,
      isbn: `978-${runId}`,
      updatedIsbn: `979-${runId}`,
      publishedOn: '2024-06-01',
      updatedPublishedOn: '2025-06-01',
    },
  };
}

export type TestData = ReturnType<typeof createTestData>;
