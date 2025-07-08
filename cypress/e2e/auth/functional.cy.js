describe('Autenticação - Cenários funcionais da API', () => {
  
  context('Validação da integridade dos tokens após login', function () {
    beforeEach(() => {
      cy.loginViaApi();
    });

    it('Deve retornar accessToken e refreshToken como strings válidas com tamanho mínimo esperado', () => {
      cy.get('@accessToken').should('be.a', 'string').and('have.length.greaterThan', 10);
      cy.get('@refreshToken').should('be.a', 'string').and('have.length.greaterThan', 10);
    });

    it('O accessToken deve estar no formato JWT (três partes separadas por ponto)', () => {
      cy.get('@accessToken').then(token => {
        const parts = token.split('.');
        expect(parts).to.have.length(3);
      });
    });

    it('O accessToken deve conter data de expiração (exp) no futuro', () => {
      cy.get('@accessToken').then(token => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        expect(payload.exp).to.be.greaterThan(now);
      });
    });

    it('Os cookies "access_token" e "refresh_token" devem ser criados com sucesso após login', () => {
      cy.getCookie('access_token').should('exist');
      cy.getCookie('refresh_token').should('exist');
    });
  });

  context('Cenários negativos de autenticação com dados inválidos', () => {
    it('Login com senha incorreta deve retornar erro 400 com mensagem apropriada', () => {
      cy.loginWithInvalidPassword().then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('message', 'Invalid credentials');
      });
    });

    it('Login com nome de usuário inexistente deve retornar erro 400 com mensagem apropriada', () => {
      cy.loginInvalidUsername().then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('message', 'Invalid credentials');
      });
    });

    it('Login com campos vazios deve retornar erro 400 com mensagem obrigatória', () => {
      cy.loginWithEmptyAuth().then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('message', 'Username and password required');
      });
    });

    it('Login com valores nulos nos campos deve retornar erro 400 com mensagem obrigatória', () => {
      cy.loginWithNullAuth().then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('message', 'Username and password required');
      });
    });

    it('Login com dados numéricos deve retornar erro 400 com mensagem indicando erro de tipo', () => {
      cy.loginWithNumericAuth().then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('message', 'Username is not valid');
      });
    });
  });

  context('Validação detalhada do corpo da resposta de login', function () {
    beforeEach(() => {
      cy.loginViaApi();
    });

    it('A resposta de login deve conter todos os campos esperados com seus tipos de dados corretos', () => {
      cy.get('@userData').then(user => {
        expect(user).to.include.all.keys('id', 'username', 'email', 'firstName', 'lastName', 'gender', 'image');
        expect(user.id).to.be.a('number');
        expect(user.username).to.be.a('string');
        expect(user.email).to.be.a('string').and.include('@');
        expect(user.firstName).to.be.a('string');
        expect(user.lastName).to.be.a('string');
        expect(user.gender).to.be.oneOf(['male', 'female']);
        expect(user.image).to.match(/^https?:\/\//);
      });
    });

    it('Usuário "emilys" deve retornar valores fixos conforme o fixture definido', () => {
      cy.fixture('users/emilys').then(expected => {
        cy.get('@userData').then(user => {
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
