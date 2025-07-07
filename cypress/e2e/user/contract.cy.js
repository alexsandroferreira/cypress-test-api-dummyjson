import userListSchema from '../../support/schemas/user/userListSchema.json';
import userSchema from '../../support/schemas/user/userSchema.json';

describe('Contrato - Lista de Usuários', () => {

  it('Deve validar contrato da listagem de usuários', () => {
    cy.request('/users').then((res) => {
      expect(res.status).to.eq(200);
      cy.validateContract(userListSchema, res.body); 
    });
  });

  it('Cada usuário na lista deve seguir o schema individual', () => {
    cy.request('/users').then((res) => {
      expect(res.status).to.eq(200);

      res.body.users.forEach((user) => {
        cy.validateContract(userSchema, user); 
      });
    });
  });

  it('Deve retornar erro ao consultar usuário inválido', () => {
  cy.request({ url: '/users/99999', failOnStatusCode: false }).then((res) => {
    expect(res.status).to.eq(404);
    expect(res.body).to.have.property('message');
  });
});


});
