import { faker } from '@faker-js/faker';
const userName = Cypress.env('AUTH_USERNAME')
const userPassword =  Cypress.env('AUTH_PASSWORD')

export function generateValidAuth() {
  return { username: userName , password:  userPassword};
}

export function generateNullAuth() {
  return { username: null, password: null };
}


export function generateInvalidPassword() {
  return { username: userName, password: faker.number.int({ min: 10000, max: 99999 }) };
}

export function generateInvalidUsername() {
  return { username: 'usuarioErrado', password:  userPassword };
}

export function generateEmptyAuth() {
  return { username: '', password: '' };
}

export function generateRandomAuth() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
}

export function generateNumericAuth() {
  return {
    username: faker.number.int({ min: 10000, max: 99999 }),
    password: faker.number.int({ min: 10000, max: 99999 }),
  };
}