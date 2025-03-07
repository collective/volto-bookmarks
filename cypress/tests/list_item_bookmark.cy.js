context('Bookmark Acceptance Tests', () => {
  describe('bookmarking in listing block', () => {
    beforeEach(() => {
      cy.intercept('GET', `/**/*?expand*`).as('content');
      cy.intercept('GET', '/**/Document').as('schema');
      cy.intercept('GET', '/**/@bookmarks').as('bookmarks');

      cy.visit('/');
      cy.viewport('macbook-16');
      cy.createContent({
        contentType: 'Document',
        contentId: 'document',
        contentTitle: 'Test document',
      });
      cy.createContent({
        contentType: 'Document',
        contentId: 'brunch-on-sunday',
        contentTitle: 'Brunch on sunday',
        path: 'document',
      });
      // give a logged in admin
      cy.autologin();
      cy.wait('@content');
    });

    it('I can add bookmarks via list block', () => {
      cy.visit('/document/edit');
      cy.wait('@schema');

      // Add listing block
      cy.addNewBlock('listing');

      // select variation
      cy.get('#field-variation').click().type('summary_with_bookmarks{enter}');

      // Add Type criteria filter to force a call of getQueryStringResults
      cy.get('.querystring-widget .fields').contains('Add criteria').click();
      cy.get(
        '.querystring-widget .fields:first-of-type .field:first-of-type .react-select__menu .react-select__option',
      )
        .contains('Type')
        .click();
      cy.get('.querystring-widget .fields:first-of-type > .field').click();
      cy.get(
        '.querystring-widget .fields:first-of-type > .field .react-select__menu .react-select__option',
      )
        .contains('Page')
        .click();

      cy.get('#toolbar-save').click();
      cy.wait('@content');

      // Bookmark news item in listing
      cy.get('.block.listing button#toolbar-addbookmark').first().click();

      // Check if news item is bookmarked
      cy.get('button#toolbar-show-bookmarks').click();
      cy.wait('@bookmarks');
      cy.get('.volto-bookmarks-list').contains('Brunch');
    });
  });
});
