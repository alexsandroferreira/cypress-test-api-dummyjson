import loginRequestSchema from '../../support/schemas/auth/loginRequestSchema.json';
import loginResponseSchema from '../../support/schemas/auth/loginResponseSchema.json';
import { generateValidAuth } from '../../support/utils/auth/authFactory';

describe('Validação de Contrato - Autenticação (Login)', () => {
  it('Deve validar o contrato da requisição e da resposta da API de login com credenciais válidas', () => {
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

