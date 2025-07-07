import loginRequestSchema from '../../support/schemas/auth/loginRequestSchema.json';
import loginResponseSchema from '../../support/schemas/auth/loginResponseSchema.json';
import { generateValidAuth } from '../../support/utils/auth/authFactory';

describe('Contrato - Autenticação', () => {
  it('Deve validar contrato da resposta de login', () => {
    const credentials = generateValidAuth();

    cy.validateContract(loginRequestSchema, credentials);

    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: credentials
    }).then((res) => {
      expect(res.status).to.eq(200);
      cy.validateContract(loginResponseSchema, res.body);
    });
  });



});
