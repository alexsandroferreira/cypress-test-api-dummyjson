import productListSchema from '../../support/schemas/product/productListSchema.json';
import productSchema from '../../support/schemas/product/productSchema.json';

describe('Validação de Contrato - Produtos', () => {
  
  it('Deve validar o contrato da resposta completa da listagem de produtos', () => {
    cy.request('/products').then((res) => {
      expect(res.status).to.eq(200);

      cy.validateContract(productListSchema, res.body);
    });
  });

  it('Cada item da lista de produtos deve estar em conformidade com o schema individual de produto', () => {
    cy.request('/products').then((res) => {
      expect(res.status).to.eq(200);

      res.body.products.forEach((product) => {
        cy.validateContract(productSchema, product);
      });
    });
  });

});

