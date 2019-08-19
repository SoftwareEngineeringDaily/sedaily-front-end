describe('Episode comments', function () {
  let existingUser
  beforeEach(function () {
    // create existing user
    cy.login()
      .then(({ user }) => {
        existingUser = user
        cy.reload()
      })
  })
  it('As a user, I can add comments to an episode.', () => {
    cy.visit('/new')
    cy.get('.news-post:first-child .title > a').click().then(() => {
      cy.location().should((loc) => {
        expect(loc.pathname).to.match(/post/)
      });
      cy.wait(1000)
      cy.get('input.comment-box').type('This was such a great episode I wish there was more like it!')
      cy.get('.buttons-comment button.button-submit').click().then(() => {
        cy.contains('This was such a great episode I wish there was more like it!')
      })
    })
  })
});
