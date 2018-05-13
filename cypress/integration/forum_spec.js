describe('End-to-End: The Forum Page', function () {
  let existingUser
  const forumThreadPost = {
    title: 'New Forum Thread',
    content: 'First post content',
  }
  before(function () {
    // create existing user
    cy.login()
    .then(({ user }) => {
      existingUser = user
    })
  })
  it('Successfully creates forum thread', function () {
    cy.visit('/#/forum')
    .then(() => {
      // cy.route('/forum/*')
      cy.contains('Create New Post').click()
      cy.get('input[name=title]').type(forumThreadPost.title)
      cy.get('input[name=content]').type(forumThreadPost.content)
      cy.contains('Create Thread').click()
    })
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/forum')
    })
    cy.contains(forumThreadPost.title).should('exist')
    cy.contains(existingUser.name).should('exist')
  })
})
