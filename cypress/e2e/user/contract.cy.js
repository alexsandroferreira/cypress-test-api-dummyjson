import userListSchema from '../../support/schemas/user/userListSchema.json';
import userSchema from '../../support/schemas/user/userSchema.json';

describe('Validação de Contrato - Usuários', () => {

  it('Deve validar o contrato da resposta completa da listagem de usuários', () => {
    cy.request('/users').then((res) => {
      expect(res.status).to.eq(200);

      cy.validateContract(userListSchema, res.body);
    });
  });

  it('Cada usuário da lista deve estar em conformidade com o schema individual de usuário', () => {
    cy.request('/users').then((res) => {
      expect(res.status).to.eq(200);

      res.body.users.forEach((user) => {
        
        cy.validateContract(userSchema, user);
      });
    });
  });

  it('Deve retornar erro 404 com mensagem adequada ao consultar usuário inexistente', () => {
    cy.request({
      url: '/users/99999',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('message'); 
    });
  });

});
