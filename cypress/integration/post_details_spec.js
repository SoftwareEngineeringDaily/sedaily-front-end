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
  it('Successfully adds related link', function () {
    const linkUrl = `https://google.com/${uuidv4()}`
    const linkTitle = `See also - ${uuidv4()}`
    cy.login().then(() => {
      cy.visit('/#/new')
      cy.get('.title').first().click()
      // test invalid input - bad url
      cy.get('.related-link-box').type('notUrl')
      cy.get('.related-title-box').type(linkTitle)
      cy.contains('Add New Link').click()
      cy.contains('The url field is not a valid URL').should('exist')
      cy.get('.related-links-list').should('not.contain', linkTitle)
      // test invalid input - no title
      cy.get('.related-link-box').clear()
      cy.get('.related-link-box').type(linkUrl)
      cy.get('.related-title-box').clear()
      cy.contains('Add New Link').click()
      cy.contains('The title field is required').should('exist')
      cy.get(`a[href="${linkUrl}"]`).should('not.exist')
      // test valid input
      cy.get('.related-link-box').clear()
      cy.get('.related-link-box').type(linkUrl)
      cy.get('.related-title-box').clear()
      cy.get('.related-title-box').type(linkTitle)
      cy.contains('Add New Link').click()
      cy.contains(linkTitle).should('have.attr', 'href', linkUrl)
      // delete
      cy.contains('Delete Link').click()
      cy.contains(linkTitle).should('not.exist')
    })
  })
})
