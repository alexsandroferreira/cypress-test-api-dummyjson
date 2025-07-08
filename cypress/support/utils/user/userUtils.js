

export function getAllUsers() {
  return cy.request({
    method: 'GET',
    url: '/users',
    failOnStatusCode: false
  });
}

export function getUserById(id) {
  return cy.request({
    method: 'GET',
    url: `/users/${id}`,
    failOnStatusCode: false
  });
}

export function getFirstUserId() {
  return getAllUsers().then((res) => res.body.users[0].id);
}

export function getSecondUserId() {
  return getAllUsers().then((res) => res.body.users[1].id);
}

export function getPaginationLimit() {
  return getAllUsers().then((res) => res.body.limit);
}
export function getUserTotal() {
  return getAllUsers().then((res) => res.body.total);
}

export function assertUserFields(user) {
  const requiredFields = [
    'id',
    'firstName',
    'lastName',
    'age',
    'gender',
    'email',
    'username',
    'birthDate',
    'role'
  ];

  requiredFields.forEach((field) => {
    expect(user).to.have.property(field);
  });
}
