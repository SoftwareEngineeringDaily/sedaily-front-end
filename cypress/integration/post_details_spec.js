const uuidv4 = require('uuid/v4')

describe('The Post Detail Page', function () {
  it('Successfully displays post details', function () {
    cy.visit('/#/new')
    cy.get('.title > a').first().invoke('text').then((title) => {
      cy.get('.title').first().click()
      cy.location().should((loc) => {
        expect(loc.pathname).to.match(/post/)
      })
      cy.contains(title)
    })
  })
  it('Successfully upvotes/downvotes post', function () {
    cy.visit('/#/new')
    cy.get('.title').first().click()
    cy.get('.post-header')
    .first()
    .upvoteToggle()
    cy.get('.toasted.error').should('contain', 'You must login to vote')
    cy.login().then(() => {
      cy.visit('/#/new')
      cy.get('.title').first().click()
      cy.get('.post-header')
      .first()
      .upvoteToggle()
      .parent()
      .expectActiveVote('up')
      cy
      .get('.post-header')
      .first()
      .downvoteToggle()
      .parent()
      .expectActiveVote('down')
      cy
      .get('.post-header')
      .first()
      .downvoteToggle()
      .parent()
      .expectActiveVote('none')
    })
  })
  it('Successfully comments on post', function () {
    const comment = `My opinion - ${uuidv4()}`
    const reply = `Also - ${uuidv4()}`
    cy.login().then(() => {
      cy.visit('/#/new')
      cy.get('.title').first().click()
      cy.get('.comment-box').first().type(comment)
      cy.contains('Add Comment').click()
      cy.contains(comment).should('exist')
      cy.get('.comment-box').should('have.value', '')
      cy.contains('Reply').first().click()
      cy.get('.reply-container').first()
      .within(() => {
        cy.get('.comment-box').type(reply)
        cy.contains('Reply').click()
      })
      cy.contains(reply).should('exist')
      cy.get('.replies').first().contains('Delete').click()
      cy.contains(reply).should('not.exist')
      cy.get('.comment-holder').first().contains('Delete').first().click()
      cy.contains(comment).should('not.exist')
    })
  })
})
