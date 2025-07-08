import MessagesUtils from '../../support/utils/messagesUtils';
import {
    generateProduct
} from '../../support/utils/product/productFactory';

describe('Produtos - Testes funcionais da API', () => {

  context('Validação de campos essenciais e opcionais por produto', () => {
    
    it('Cada produto retornado na listagem deve conter os campos obrigatórios', () => {
      cy.allProducts().then((res) => {
        expect(res.status).to.eq(200);
        const products = res.body.products;

        expect(products).to.be.an('array').and.have.length.greaterThan(0);

        products.forEach((product) => {
          expect(product).to.include.all.keys(
            'id', 'title', 'description', 'category', 'price',
            'discountPercentage', 'rating', 'stock'
          );
        });
      });
    });

    it('Campos opcionais como SKU, dimensões e reviews devem ser validados apenas quando presentes', () => {
      cy.allProducts().then((res) => {
        const products = res.body.products;

        products.forEach((product) => {
          if (product.sku) expect(product.sku).to.be.a('string');

          if (product.dimensions) {
            expect(product.dimensions).to.include.all.keys('width', 'height', 'depth');
          }

          if (product.meta) {
            expect(product.meta).to.have.property('barcode');
          }

          if (Array.isArray(product.reviews)) {
            product.reviews.forEach((r) => {
              expect(r).to.have.all.keys(
                'rating', 'comment', 'date',
                'reviewerName', 'reviewerEmail'
              );
            });
          }
        });
      });
    });
  });

  context('Paginação da listagem de produtos', () => {

    it('A API deve limitar a resposta a no máximo 30 produtos por página', () => {
      cy.allProducts().then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.limit).to.eq(30);
        expect(res.body.products.length).to.be.at.most(30);
      });
    });

    it('O valor do campo "limit" deve ser consistente com o número real de produtos retornados', () => {
      cy.getPaginationLimitProducts().then((limit) => {
        cy.allProducts().then((res) => {
          expect(res.body.products.length).to.eq(limit);
        });
      });
    });
  });

  context('Consulta de produto por ID e validação com fixture', () => {
    
    beforeEach(() => {
      cy.fixture('products/firstProductMock').as('expectedProduct');
    });

    it('Produto consultado deve conter os mesmos dados principais definidos na fixture', function () {
      const expected = this.expectedProduct;

      cy.request(`/products/${expected.id}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include({
          id: expected.id,
          title: expected.title,
          description: expected.description,
          price: expected.price,
          discountPercentage: expected.discountPercentage,
          rating: expected.rating,
          stock: expected.stock,
          brand: expected.brand,
          category: expected.category,
          thumbnail: expected.thumbnail
        });

        expect(res.body.tags).to.deep.equal(expected.tags);
        expect(res.body.sku).to.eq(expected.sku);
        expect(res.body.weight).to.eq(expected.weight);
        expect(res.body.availabilityStatus).to.eq(expected.availabilityStatus);
        expect(res.body.returnPolicy).to.eq(expected.returnPolicy);
        expect(res.body.minimumOrderQuantity).to.eq(expected.minimumOrderQuantity);
        expect(res.body.meta.barcode).to.eq(expected.meta.barcode);
        expect(res.body.meta.qrCode).to.eq(expected.meta.qrCode);
      });
    });

    it('O objeto do produto deve ser idêntico ao objeto da fixture correspondente', function () {
      const expected = this.expectedProduct;

      cy.request(`/products/${expected.id}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.deep.equal(expected);
      });
    });
  });

  context('Validação de limites de IDs de produtos (boundary values)', () => {

    beforeEach(() => {
      cy.setProductBoundaryAliases();
    });

    it('Deve retornar sucesso ao buscar o primeiro ID de produto válido', () => {
      cy.get('@minProductId').then((id) => {
        cy.getProductById(id).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(id);
        });
      });
    });

    it('Deve retornar erro 404 ao consultar ID abaixo do mínimo existente', () => {
      cy.get('@minProductId').then((id) => {
        const invalidId = id - 1;
        cy.getProductById(invalidId).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.message).to.eq(MessagesUtils.getProductNotFoundMessage(invalidId));
        });
      });
    });

    it('Deve retornar erro 404 ao consultar ID acima do total de produtos disponíveis', () => {
      cy.get('@totalProducts').then((total) => {
        const invalidId = total + 1;
        cy.getProductById(invalidId).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.message).to.eq(MessagesUtils.getProductNotFoundMessage(invalidId));
        });
      });
    });

    it('Deve retornar sucesso ao consultar o último ID de produto disponível', () => {
      cy.get('@totalProducts').then((id) => {
        cy.getProductById(id).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(id);
        });
      });
    });
  });

  context('Cadastro de produtos via API autenticada', () => {
    let token;

    beforeEach(() => {
      cy.loginViaApi().then(() => {
        token = Cypress.env('accessToken');
      });
    });

    it('Deve permitir o cadastro de produto documentado e retornar os dados esperados', () => {
      const product = generateProduct('documented');

      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        headers: { Authorization: `Bearer ${token}` },
        body: product,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.include({
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          brand: product.brand,
          category: product.category
        });
        expect(res.body).to.have.property('id');
      });
    });

    it('Deve cadastrar um produto aleatório com sucesso e retornar ID gerado', () => {
      const product = generateProduct();

      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        headers: { Authorization: `Bearer ${token}` },
        body: product,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('id');
        expect(res.body.title).to.eq(product.title);
      });
    });

    it('Cadastro com corpo vazio deve falhar com status de erro e mensagem explicativa', () => {
      const emptyProduct = {};

      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        headers: { Authorization: `Bearer ${token}` },
        body: emptyProduct,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 422]);
        expect(res.body).to.have.property('message');
      });
    });
  });

  context('Validações de autenticação na criação de produto', () => {
    let invalidToken;
    let expiredToken;

    beforeEach(() => {
      cy.clearCookies();
      cy.invalidToken().then((token) => { invalidToken = token; });
      cy.getExpiredToken().then((token) => { expiredToken = token; });
    });

    it('Deve falhar ao tentar cadastrar produto sem token de autenticação', () => {
      const product = generateProduct();

      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        body: product,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq(MessagesUtils.ACCESS_TOKEN_REQUIRED);
      });
    });

    it('Deve falhar ao tentar cadastrar produto com token inválido', () => {
      const product = generateProduct();

      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        headers: { Authorization: `Bearer ${invalidToken}` },
        body: product,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.be.oneOf([400, 500]);
        expect(res.body.message).to.eq(MessagesUtils.TOKEN_INVALID);
      });
    });

    it('Deve falhar ao tentar cadastrar produto com token expirado', () => {
      const product = generateProduct();

      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        headers: { Authorization: `Bearer ${expiredToken}` },
        body: product,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body).to.have.property('message');
      });
    });
  });

});
