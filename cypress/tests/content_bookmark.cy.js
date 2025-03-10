context('Bookmark Acceptance Tests', () => {
  describe('Visit a page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/**/*?expand*`).as('content');
      cy.intercept('GET', '/**/Document').as('schema');
      cy.intercept('GET', '/**/@bookmarks').as('bookmarks');
      // Wait a bit to previous teardown to complete correctly because Heisenbug in this point
      cy.wait(2000);
      // give a logged in admin
      cy.autologin();

      cy.createContent({
        contentType: 'Document',
        contentId: 'document',
        contentTitle: 'Test document',
      });
    });

    it('The bookmarks menu is initially empty', function () {
      cy.visit('/document');

      // Bookmarks menu is empty
      cy.get('button#toolbar-show-bookmarks').click();
      cy.wait('@bookmarks');
      cy.contains("You don't have any bookmarks.");
    });

    it('As authenticated user I can bookmark a Page and see it in my bookmarks menu', function () {
      cy.visit('/document');

      // Bookmark current page
      cy.get('#toolbar-addbookmark').click();
      cy.wait('@content');

      // Bookmarks menu contains new bookmark
      cy.get('#toolbar-show-bookmarks').click();
      cy.wait('@bookmarks');
      cy.get('.volto-bookmarks-list').contains('Test document');
    });
  });
});
