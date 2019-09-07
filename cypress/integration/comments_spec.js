describe('Episode comments', function () {
  let existingUser
  beforeEach(function () {
    // create existing user
    cy.login()
      .then(({ user }) => {
        existingUser = user
        cy.reload().then(() => cy.visit('/new'))
      })
  })
  it('As a user, I can add comments to a post.', () => {
    cy.get('.news-post:first-child .title > a').click().then(() => {
      cy.location().should((loc) => {
        expect(loc.pathname).to.match(/post/)
      });
      cy.wait(1000)
      cy.get('.comment-add-form input.comment-box').type('This was such a great episode I wish there was more like it!');
      cy.get('.comment-add-form .buttons-comment button.button-submit').click().then(() => {
        cy.contains('This was such a great episode I wish there was more like it!');
        cy.get('.comment-holder').within(() => {
          cy.get('.reply').should('contain', 'Reply');
          cy.get('.delete').should('contain', 'Delete');
          cy.get('.edit').should('contain', 'Edit');
          // Clean up application state.
          cy.get('.delete').contains('Delete').click()
          cy.should('not.contain', 'This was such a great episode I wish there was more like it!');
        })
      })
    })
  })
  it('As a user, I can edit my own comment on a post.', () => {
    cy.get('.news-post:first-child .title > a').click().then(() => {
      cy.location().should((loc) => {
        expect(loc.pathname).to.match(/post/)
      });
      cy.wait(1000)
      cy.get('.comment-add-form input.comment-box').type('This was such a great esipode I wish there was mor elike it!');
      cy.get('.comment-add-form .buttons-comment button.button-submit').click().then(() => {
        cy.contains('This was such a great esipode I wish there was mor elike it!');
        cy.get('.edit').click();
        cy.get('.comment-edit-form input.comment-box').clear();
        cy.get('.comment-edit-form input.comment-box').type('This was such a great episode I wish there was more like it!');
        cy.get('.comment-edit-form').contains('Save');
        // Cannot chain on the above `contains` as the element becomes detached from the DOM.
        cy.get('.comment-edit-form button.button-submit').click()
        cy.should('not.contain','This was such a great esipode I wish there was mor elike it!');
        cy.contains('This was such a great episode I wish there was more like it!');
        cy.get('.comment-holder').within(() => {
          // Clean up application state.
          cy.get('.delete').contains('Delete').click()
          cy.should('not.contain', 'This was such a great episode I wish there was more like it!');
        })
      })
    })
  })
});
