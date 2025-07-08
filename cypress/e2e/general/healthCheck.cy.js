describe('Verificação de Saúde da API - Endpoint /health', () => {
  it('Deve responder com status HTTP 200 e retornar status de serviço como "ok"', () => {
    cy.request('/health').should((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('status', 'ok');
      expect(res.body).to.have.property('method', 'GET');
    });
  });
});
