import MessagesUtils from '../../support/utils/messagesUtils';
import {
    generateProduct
} from '../../support/utils/product/productFactory';

describe('Produtos - Functional', () => {

    context('Campos obrigatórios por produto', () => {
        it('Cada produto deve conter os campos ESSENCIAIS (comuns a todos)', () => {
            cy.allProducts().then((res) => {
                expect(res.status).to.eq(200);
                const products = res.body.products;

                expect(products).to.be.an('array').and.have.length.greaterThan(0);

                products.forEach((product) => {
                    expect(product).to.include.all.keys(
                        'id',
                        'title',
                        'description',
                        'category',
                        'price',
                        'discountPercentage',
                        'rating',
                        'stock',
                    );
                });
            });
        });
    });

    context('Validação opcional de campos extras (quando existirem)', () => {
        it('Campos como SKU e dimensões devem existir apenas quando presentes', () => {
            cy.allProducts().then((res) => {
                const products = res.body.products;

                products.forEach((product) => {
                    if (product.sku) {
                        expect(product.sku).to.be.a('string');
                    }

                    if (product.dimensions) {
                        expect(product.dimensions).to.include.all.keys('width', 'height', 'depth');
                    }

                    if (product.meta) {
                        expect(product.meta).to.have.property('barcode');
                    }

                    if (Array.isArray(product.reviews)) {
                        product.reviews.forEach((r) => {
                            expect(r).to.have.all.keys(
                                'rating',
                                'comment',
                                'date',
                                'reviewerName',
                                'reviewerEmail'
                            );
                        });
                    }
                });
            });
        });
    });

    context('Paginação', () => {
        it('Deve retornar no máximo 30 produtos por página', () => {
            cy.allProducts().then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.limit).to.eq(30);
                expect(res.body.products.length).to.be.at.most(30);
            });
        });

        it('Campo limit deve bater com o número de produtos retornados', () => {
            cy.getPaginationLimitProducts().then((limit) => {
                cy.allProducts().then((res) => {
                    expect(res.body.products.length).to.eq(limit);
                });
            });
        });
    });

    context('Buscar produto por ID e validar dados com fixture', () => {
        beforeEach(() => {
            cy.fixture('products/firstProductMock').as('expectedProduct');
        });

        it('Deve buscar o produto e validar os campos principais com a fixture', function () {
            const expected = this.expectedProduct;

            cy.request(`/products/${expected.id}`).then((res) => {
                expect(res.status).to.eq(200);
                const product = res.body;

                expect(product).to.include({
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

                expect(product.tags).to.deep.equal(expected.tags);
                expect(product.sku).to.eq(expected.sku);
                expect(product.weight).to.eq(expected.weight);
                expect(product.availabilityStatus).to.eq(expected.availabilityStatus);
                expect(product.returnPolicy).to.eq(expected.returnPolicy);
                expect(product.minimumOrderQuantity).to.eq(expected.minimumOrderQuantity);
                expect(product.meta.barcode).to.eq(expected.meta.barcode);
                expect(product.meta.qrCode).to.eq(expected.meta.qrCode);
            });
        });

        it('Deve comparar o objeto do produto completo com o fixture', function () {
            const expected = this.expectedProduct;

            cy.request(`/products/${expected.id}`).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body).to.deep.equal(expected);
            });
        });
    });

    context('Produtos por análise de valor limite', () => {

        beforeEach(() => {
            cy.setProductBoundaryAliases();
        });

        it('Deve retornar 200 para o primeiro ID válido', () => {
            cy.get('@minProductId').then((id) => {
                cy.getProductById(id).then((res) => {
                    expect(res.status).to.eq(200);
                    expect(res.body.id).to.eq(id);
                });
            });
        });

        it('Deve retornar 404 para o ID abaixo do mínimo', () => {
            cy.get('@minProductId').then((id) => {
                const invalidId = id - 1;
                cy.getProductById(invalidId).then((res) => {
                    expect(res.status).to.eq(404);
                    expect(res.body.message).to.eq(MessagesUtils.getProductNotFoundMessage(invalidId));
                });
            });
        });

        it('Deve retornar 404 para o ID acima do máximo', () => {
            cy.get('@totalProducts').then((total) => {
                const invalidId = total + 1;
                cy.getProductById(invalidId).then((res) => {
                    expect(res.status).to.eq(404);
                    expect(res.body.message).to.eq(MessagesUtils.getProductNotFoundMessage(invalidId));
                });
            });
        });

        it('Deve retornar 200 para o ID do último produto', () => {
            cy.get('@totalProducts').then((id) => {
                cy.getProductById(id).then((res) => {
                    expect(res.status).to.eq(200);
                    expect(res.body.id).to.eq(id);
                });
            });
        });

    });

    context('Cadastro de produtos', () => {
        let token

        beforeEach(() => {
            cy.loginViaApi().then(() => {
                token = Cypress.env('accessToken');
            });
        });

        it('Deve cadastrar um produto documentado com sucesso', () => {
            const product = generateProduct('documented');

            cy.request({
                method: 'POST',
                url: '/auth/products/add',
                headers: {
                    Authorization: `Bearer ${token}`
                },
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

        it('Deve cadastrar um produto aleatório com sucesso', () => {
            const product = generateProduct();

            cy.request({
                method: 'POST',
                url: '/auth/products/add',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: product,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(201);
                expect(res.body).to.have.property('id');
                expect(res.body.title).to.eq(product.title);
            });
        });


        it('Deve falhar ao tentar cadastrar um produto com campos vazios', () => {
            const emptyProduct = {};

            cy.request({
                method: 'POST',
                url: '/auth/products/add',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: emptyProduct,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.be.oneOf([400, 422]);
                expect(res.body).to.have.property('message');
            });
        });
    });

    context('Validações de autenticação', () => {
        let invalidToken;
        let expiredToken;

        beforeEach(() => {
            cy.clearCookies();
            cy.invalidToken().then((token) => {
                invalidToken = token;
            });

            cy.getExpiredToken().then((token) => {
                expiredToken = token;
            });
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
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eq(MessagesUtils.ACCESS_TOKEN_REQUIRED);
            });
        });

        it('Deve falhar ao tentar cadastrar produto com token inválido', () => {
            const product = generateProduct();

            cy.request({
                method: 'POST',
                url: '/auth/products/add',
                headers: {
                    Authorization: `Bearer ${invalidToken}`
                },
                body: product,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.be.oneOf([400, 500]);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eq(MessagesUtils.TOKEN_INVALID);
            });
        });

        it('Deve falhar ao tentar cadastrar produto com token expirado', () => {
            const product = generateProduct();

            cy.request({
                method: 'POST',
                url: '/auth/products/add',
                headers: {
                    Authorization: `Bearer ${expiredToken}`
                },
                body: product,
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(401); // ou 403 conforme sua API
                expect(res.body).to.have.property('message');
            });
        });
    });
});