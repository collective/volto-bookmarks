context('Example Acceptance Tests', () => {
  describe('Visit a page', () => {
    beforeEach(() => {
      cy.autologin();
      cy.createContent({
        contentType: 'Document',
        contentId: 'document',
        contentTitle: 'Test document',
      });
    });

    it('As editor I can add edit a Page', function () {
      cy.visit('/document/edit');
      cy.get('#toolbar-save').click();
    });
  });
});
