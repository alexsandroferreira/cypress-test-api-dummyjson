

describe('Health Check - API', () => {
  it('Deve retornar status 200 e status ok', () => {
    cy.request('/health')
      .should((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('status', 'ok');
        expect(res.body).to.have.property('method', 'GET');
      });
  });
});
