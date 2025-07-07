describe('Auth - Functional', () => {
    context('Validação de Token', function () {
        beforeEach(() => {
            cy.loginViaApi()
        });

        it('Deve conter accessToken e refreshToken válidos', () => {
            cy.get('@accessToken').then((accessToken) => {
                expect(accessToken).to.be.a('string').and.have.length.greaterThan(10);
            });

            cy.get('@refreshToken').then((refreshToken) => {
                expect(refreshToken).to.be.a('string').and.have.length.greaterThan(10);
            });
        });
        it('Token deve ter estrutura JWT válida (3 partes)', () => {
            cy.get('@accessToken').then(accessToken => {
                expect(accessToken).to.exist;
                const parts = accessToken.split('.');
                expect(parts).to.have.length(3);
            });

        });

        it('Token deve estar com data de expiração no futuro', () => {
            cy.get('@accessToken').then(accessToken => {
                expect(accessToken).to.exist;
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                const now = Math.floor(Date.now() / 1000);
                expect(payload.exp).to.be.greaterThan(now);

                expect(payload.exp).to.be.greaterThan(now);
            });


        });

        it('Cookies devem ser criados após login', () => {
            cy.getCookie('access_token').should('exist');
            cy.getCookie('refresh_token').should('exist');
        });
    });

    context('Cenários inválidos de autenticação', () => {
        it('Login com senha inválida deve retornar 400 e mensagem de erro', () => {
            cy.loginWithInvalidPassword().then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('message', 'Invalid credentials');
            });
        });

        it('Login com usuário inválido deve retornar 400 e mensagem de erro', () => {
            cy.loginInvalidUsername().then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('message', 'Invalid credentials');
            });
        });

        it('Login com campos vazios deve retornar 400 e mensagem obrigatória', () => {
            cy.loginWithEmptyAuth().then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('message', 'Username and password required');
            });
        });

        it('Login com campos null deve retornar 400 e mensagem obrigatória', () => {
            cy.loginWithNullAuth().then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('message', 'Username and password required');
            });
        });

        it('Login com campos numéricos deve retornar 400 e mensagem de erro', () => {
            cy.loginWithNumericAuth().then((res) => {
                expect(res.status).to.eq(400);
                expect(res.body).to.have.property('message', 'Username is not valid');
            });
        });
    });

    context('Validação do corpo da resposta de login', function () {
        beforeEach(() => {
            cy.loginViaApi();
        });

        it('Deve conter todos os campos esperados com os tipos corretos', () => {
            cy.get('@userData').then((user) => {
                expect(user).to.include.all.keys(
                    'id',
                    'username',
                    'email',
                    'firstName',
                    'lastName',
                    'gender',
                    'image'
                );

                expect(user.id).to.be.a('number');
                expect(user.username).to.be.a('string');
                expect(user.email).to.be.a('string').and.include('@');
                expect(user.firstName).to.be.a('string');
                expect(user.lastName).to.be.a('string');
                expect(user.gender).to.be.oneOf(['male', 'female']);
                expect(user.image).to.match(/^https?:\/\//);
            });
        });


        it('Deve ter valores esperados fixos para o usuário "emilys"', () => {
            cy.fixture('users/emilys').then((expected) => {
                cy.get('@userData').then((user) => {
                    expect(user.username).to.eq(expected.username);
                    expect(user.firstName).to.eq(expected.firstName);
                    expect(user.lastName).to.eq(expected.lastName);
                    expect(user.gender).to.eq(expected.gender);
                    expect(user.image).to.eq(expected.image);
                });
            });
        });
    });


});