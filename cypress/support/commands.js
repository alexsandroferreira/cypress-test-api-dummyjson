import {
  getValidUser,
  getValidToken,
  getInvalidToken,
  getExpiredToken,
  getLoginWithInvalidPassword,
  getLoginWithUsernameInvalid,
  getLoginWithEmptyAuth,
  getLoginWithNullAuth,
  getLoginWithNumericAuth

} from './utils/auth/authUtils';

import {
  assertUserFields,
  getAllUsers,
  getFirstUserId,
  getPaginationLimit,
  getUserTotal,
  getUserById
} from './utils/user/userUtils'
// Comandos personalizados para rota auth

import {
  assertProductFields,
  getAllProducts,
  getFirstProductId,
  getProductPaginationLimit,
  getProductById,
  getProductTotal,
  getSecondProductId
} from './utils/product/productUtils'

import { validateSchema } from './utils/schemaValidator';

Cypress.Commands.add('loginViaApi', () => {
  return getValidToken().then(({
    accessToken,
    refreshToken,
    userData
  }) => {
    // Salvar em variáveis globais de execução
    Cypress.env('accessToken', accessToken);
    Cypress.env('refreshToken', refreshToken);
    Cypress.env('userData', userData);

    // Setar cookies
    cy.setCookie('access_token', accessToken);
    cy.setCookie('refresh_token', refreshToken);

    cy.wrap(accessToken).as('accessToken');
    cy.wrap(refreshToken).as('refreshToken');
    cy.wrap(userData).as('userData');

  });
});

Cypress.Commands.add('loginWithEmptyAuth', () => {
  return getLoginWithEmptyAuth();
});

Cypress.Commands.add('loginWithNullAuth', () => {
  return getLoginWithNullAuth();
});

Cypress.Commands.add('loginWithNumericAuth', () => {
  return getLoginWithNumericAuth();
});

/**
 * Executa login com senha inválida e retorna resposta
 */
Cypress.Commands.add('loginWithInvalidPassword', () => {
  return getLoginWithInvalidPassword();
});

Cypress.Commands.add('loginInvalidUsername', () => {
  return getLoginWithUsernameInvalid();
});


/**
 * Retorna token válido
 */


/**
 * Retorna token inválido fake
 */
Cypress.Commands.add('invalidToken', () => {
  return getInvalidToken();
});

/**
 * Retorna token expirado fake
 */
Cypress.Commands.add('getExpiredToken', () => {
  return getExpiredToken();
});

// comandos personalizados para rota user


// Comando para obter todos os usuários
Cypress.Commands.add('allUsers', () => {
  return getAllUsers();
});

// Comando para obter usuário por ID
Cypress.Commands.add('getUserById', (id) => {
  return getUserById(id);
});

// Comando para obter o primeiro ID de usuário
Cypress.Commands.add('getFirstUserId', () => {
  return getFirstUserId();
});

// Comando para obter o segundo ID de usuário
Cypress.Commands.add('getSecondUserId', () => {
  return getSecondUserId();
});

// Comando para obter o limite de paginação
Cypress.Commands.add('getPaginationLimit', () => {
  return getPaginationLimit();
});

Cypress.Commands.add('getFieldtotal', () => {
  return getUserTotal();
});

Cypress.Commands.add('setUserBoundaryAliases', () => {
  return getAllUsers().then((res) => {
    const users = res.body.users;
    const total = res.body.total;
    const limit = res.body.limit;

    const minId = users[0].id;
    const maxId = users[users.length - 1].id;

    cy.wrap(minId).as('minUserId');
    cy.wrap(maxId).as('maxUserId');
    cy.wrap(total).as('totalUsers');
    cy.wrap(limit).as('limitUsersPerPage');

  });
});


// Comando para obter todos os produtos
Cypress.Commands.add('allProducts', () => {
  return getAllProducts();
});

// Comando para obter produto por ID
Cypress.Commands.add('getProductById', (id) => {
  return getProductById(id);
});

// Comando para obter o primeiro ID de produto
Cypress.Commands.add('getFirstProductId', () => {
  return getFirstProductId();
});

// Comando para obter o segundo ID de produto
Cypress.Commands.add('getSecondProductId', () => {
  return getSecondProductId();
});

// Comando para obter o limite de paginação
Cypress.Commands.add('getPaginationLimitProducts', () => {
  return getPaginationLimit();
});

// Comando para obter o total de produtos
Cypress.Commands.add('getTotalProducts', () => {
  return getProductTotal();
});

// Comando para definir aliases úteis com base nos limites dos produtos
Cypress.Commands.add('setProductBoundaryAliases', () => {
  return getAllProducts().then((res) => {
    const products = res.body.products;
    const total = res.body.total;
    const limit = res.body.limit;

    const minId = products[0].id;
    const maxId = products[products.length - 1].id;

    cy.wrap(minId).as('minProductId');
    cy.wrap(maxId).as('maxProductId');
    cy.wrap(total).as('totalProducts');
    cy.wrap(limit).as('limitProductsPerPage');
  });
});

// support/commands.js


Cypress.Commands.add('validateContract', (schema, data) => {
  const result = validateSchema(schema, data);

  if (!result.valid) {
    cy.log('Erros de contrato encontrados:');
    result.errors.forEach((err) => {
      const path = err.data || '/';
      cy.log(` ${path} - ${err.message}`);
    });

    throw new Error('Validação de contrato falhou. Verifique os logs acima.');
  }

  cy.log('Contrato válido.');
});

Cypress.Commands.add('checkApiHealth', () => {
  cy.log('Verificando saúde da API...');
  cy.request('/health').then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body).to.have.property('status', 'ok');
    expect(res.body).to.have.property('method', 'GET');
    cy.log('API está saudável.');
  });
});





