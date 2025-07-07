import productListSchema from '../../support/schemas/product/productListSchema.json';
import productSchema from '../../support/schemas/product/productSchema.json';

describe('Contrato - Produtos', () => {
  it('Deve validar contrato da listagem de produtos', () => {
    cy.request('/products').then((res) => {
      expect(res.status).to.eq(200);
      cy.validateContract(productListSchema, res.body);
    });
  });

  it('Cada produto na lista deve seguir o schema individual', () => {
    cy.request('/products').then((res) => {
      expect(res.status).to.eq(200);
      res.body.products.forEach((product) => {
        cy.validateContract(productSchema, product);
      });
    });
  });

});
