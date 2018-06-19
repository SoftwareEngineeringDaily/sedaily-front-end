const uuidv4 = require('uuid/v4')

describe('The Forum Page', function () {
  let existingUser
  const forumThreadPost = {
    title: `New Forum Thread - ${uuidv4()}`,
    content: 'Just some content',
  }
  const forumPostReply = 'Just a reply'
  before(function () {
    // create existing user
    cy.login()
    .then(({ user }) => {
      existingUser = user
    })
  })
  it('Successfully creates forum post', function () {
    cy.visit('/')
    .then(() => {
      cy.contains('Forum').click()
      cy.contains('Create New Post').click()
      cy.get('input[name=title]').type(forumThreadPost.title)
      cy.get('textarea[name=content]').type(forumThreadPost.content)
      cy.contains('Create Thread').click()
    })
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/forum')
    })
    cy.contains(forumThreadPost.title).should('exist')
    cy.contains(existingUser.name).should('exist')
  })
  it('Successfully replies to forum post', function () {
    cy.contains('Forum').click()
    // vue-router may inject anchor after content (title) is rendered
    // can't just use cy.contains() in this case
    cy.get('.forum-summary-title>a').contains(forumThreadPost.title).click()
    cy.get('textarea.comment-box').type(forumPostReply)
    cy.contains('Add Comment').click()
    cy.contains(forumPostReply).should('exist')
    cy.get('textarea.comment-box').should('have.value', '')
  })
  it('Successfully deletes reply', function () {
    cy.get('.comment-holder')
    .first()
    .contains('Delete')
    .click()
    cy.contains(forumPostReply).should('not.exist')
    cy.get('.comment-holder')
    .first()
    .contains('Deleted')
    .should('exist')
  })
  it('Successfully views forum when logged out', function () {
    cy.contains('Logout').click()
    cy.contains('Forum').click()
    cy.contains('Create New Post').should('not.exist')
    cy.get('.forum-summary-title>a').contains(forumThreadPost.title).click()
    cy.contains(forumThreadPost.content).should('exist')
    cy.get('textarea.comment-box').should('not.exist')
  })
})
