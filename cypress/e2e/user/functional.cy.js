import MessagesUtils from '../../support/utils/messagesUtils';

describe('Usuários - Functional', () => {

  context('Campos obrigatórios por usuário', () => {
    it('Cada usuário deve conter os campos essenciais', () => {
      cy.allUsers().then((res) => {
        expect(res.status).to.eq(200);
        const users = res.body.users;

        expect(users).to.be.an('array').and.have.length.greaterThan(0);

        users.forEach((user) => {
          expect(user).to.include.all.keys(
            "id",
            "firstName",
            "lastName",
            "age",
            "gender",
            "email",
            "phone",
            "username",
            "password",
            "birthDate",
            "image",
            "bloodGroup",
            "height",
            "weight",
            "eyeColor",
            "hair", // sempre presente com "color" e "type"
            "ip",
            "address", // sempre completo com nested fields
            "macAddress",
            "university",
            "bank", // sempre presente com card info
            "company", // sempre presente com address
            "ein",
            "ssn",
            "userAgent",
            "crypto", // presente com coin, wallet, network
            "role"
          );
        });
      });
    });
  });

  context('Consulta individual com mock', () => {
  beforeEach(() => {
    cy.fixture('users/userExample').as('userMock');
  });

  it('Deve validar todos os dados do usuário com ID 1', function () {
    const expectedUser = this.userMock;

    cy.request(`/users/${expectedUser.id}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal(expectedUser);
    });
  });
});

context('Buscar usuário por ID e validar dados com fixture', () => {
  beforeEach(() => {
    cy.fixture('users/usersMockLimited').as('mockUsers');
  });

  it('Deve buscar um usuário aleatório de 1 a 10 e validar os dados principais', function () {
    // Função auxiliar para gerar ID aleatório entre 1 e 10
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

      // Tipagem e formato
      expect(res.body.id).to.be.a('number');
      expect(res.body.email).to.include('@');
      expect(res.body.birthDate).to.match(/^\d{4}-\d{1,2}-\d{1,2}$/);
    });
  });
});


  context('Paginação', () => {
    it('Deve retornar no máximo 30 usuários por página', () => {
      cy.allUsers().then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.limit).to.eq(30);
        expect(res.body.users.length).to.be.at.most(30);
      });
    });

    it('Campo limit deve bater com o número de usuários retornados', () => {
      cy.getPaginationLimit().then((limit) => {
        cy.allUsers().then((res) => {
          expect(res.body.users.length).to.eq(limit);
        });
      });
    });
  });




  context('Usuários por analise de valor limite', () => {

    beforeEach(() => {
      cy.setUserBoundaryAliases();
    });

    it('Deve retornar 200 para o primeiro ID válido', () => {
      cy.get('@minUserId').then((id) => {
        cy.getUserById(id).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(id);
        });
      });
    });

    it('Deve retornar 404 para o ID abaixo do mínimo', () => {
      cy.get('@minUserId').then((id) => {
        const invalidId = id - 1;
        cy.getUserById(invalidId).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.message).to.eq(MessagesUtils.getUserNotFoundMessage(invalidId));
        });
      });
    });



    it('Deve retornar 404 para o ID acima do máximo', () => {
      cy.get('@totalUsers').then((total) => {
        const invalidId = total + 1;
        cy.getUserById(invalidId).then((res) => {
          expect(res.status).to.eq(404);
          expect(res.body.message).to.eq(MessagesUtils.getUserNotFoundMessage(invalidId));
        });
      });
    });

    it('Deve retornar 200 para o ID do ultimo usuario', () => {
      cy.get('@totalUsers').then((id) => {

        cy.getUserById(id).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(id);
        });
      });
    });

  });

});