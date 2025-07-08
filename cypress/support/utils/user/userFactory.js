

export function getExpectedUserFields() {
  return [
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
}




export function generateRandomUser() {
  return {
    id: Math.floor(Math.random() * 10000),
    firstName: `Test${Date.now()}`,
    lastName: 'User',
    age: Math.floor(Math.random() * 50 + 18),
    gender: 'male',
    email: `test${Date.now()}@example.com`,
    username: `test_user_${Math.floor(Math.random() * 1000)}`,
    birthDate: '1990-01-01',
    role: 'user'
  };
}
