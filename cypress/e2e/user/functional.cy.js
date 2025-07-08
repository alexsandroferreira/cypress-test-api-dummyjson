import MessagesUtils from '../../support/utils/messagesUtils';

describe('Usuários - Testes funcionais da API', () => {

  context('Validação de campos obrigatórios na listagem de usuários', () => {
    it('Todos os usuários retornados devem conter os campos essenciais obrigatórios', () => {
      cy.allUsers().then((res) => {
        expect(res.status).to.eq(200);
        const users = res.body.users;

        expect(users).to.be.an('array').and.have.length.greaterThan(0);

        users.forEach((user) => {
          expect(user).to.include.all.keys(
            "id", "firstName", "lastName", "age", "gender", "email", "phone", "username", "password",
            "birthDate", "image", "bloodGroup", "height", "weight", "eyeColor", "hair", "ip", "address",
            "macAddress", "university", "bank", "company", "ein", "ssn", "userAgent", "crypto", "role"
          );
        });
      });
    });
  });

  context('Validação completa de um usuário com fixture individual', () => {
    beforeEach(() => {
      cy.fixture('users/userExample').as('userMock');
    });

    it('Deve retornar todos os dados do usuário com ID 1 exatamente como definido no mock', function () {
      const expectedUser = this.userMock;

      cy.request(`/users/${expectedUser.id}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.deep.equal(expectedUser);
      });
    });
  });

  context('Validação de dados principais ao consultar um usuário aleatório via fixture limitada', () => {
    beforeEach(() => {
      cy.fixture('users/usersMockLimited').as('mockUsers');
    });

    it('Deve buscar um usuário aleatório entre 1 e 10 e validar os campos principais', function () {
      const randomId = Math.floor(Math.random() * 10) + 1;
      const expectedUser = this.mockUsers.users.find(u => u.id === randomId);

      cy.request(`/users/${randomId}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.include({
          id: expectedUser.id,
          firstName: expectedUser.firstName,
          lastName: expectedUser.lastName,
          username: expectedUser.username,
          email: expectedUser.email,
          gender: expectedUser.gender,
          birthDate: expectedUser.birthDate,
          role: expectedUser.role
        });

        expect(res.body.id).to.be.a('number');
        expect(res.body.email).to.include('@');
        expect(res.body.birthDate).to.match(/^\d{4}-\d{1,2}-\d{1,2}$/);
      });
    });
  });

  context('Paginação da listagem de usuários', () => {
    it('A API deve limitar a resposta a no máximo 30 usuários por página', () => {
      cy.allUsers().then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.limit).to.eq(30);
        expect(res.body.users.length).to.be.at.most(30);
      });
    });

    it('O número de usuários retornados deve coincidir com o valor de "limit" informado na resposta', () => {
      cy.getPaginationLimit().then((limit) => {
        cy.allUsers().then((res) => {
          expect(res.body.users.length).to.eq(limit);
        });
      });
    });
  });

  context('Análise de valor limite para IDs de usuários', () => {
    beforeEach(() => {
      cy.setUserBoundaryAliases();
    });

    it('Deve retornar sucesso (200) ao consultar o primeiro ID de usuário válido', () => {
      cy.get('@minUserId').then((id) => {
        cy.getUserById(id).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(id);
        });
      });
    });

    it('Deve retornar erro 404 ao consultar um ID abaixo do mínimo existente', () => {
      cy.get('@minUserId').then((id) => {
        const invalidId = id - 1;
        cy.getUserById(invalidId).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.message).to.eq(MessagesUtils.getUserNotFoundMessage(invalidId));
        });
      });
    });

    it('Deve retornar erro 404 ao consultar um ID acima do número total de usuários disponíveis', () => {
      cy.get('@totalUsers').then((total) => {
        const invalidId = total + 1;
        cy.getUserById(invalidId).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.message).to.eq(MessagesUtils.getUserNotFoundMessage(invalidId));
        });
      });
    });

    it('Deve retornar sucesso (200) ao consultar o último ID de usuário válido', () => {
      cy.get('@totalUsers').then((id) => {
        cy.getUserById(id).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(id);
        });
      });
    });
  });

});
