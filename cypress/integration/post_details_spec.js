const uuidv4 = require('uuid/v4')

describe('The Post Detail Page', function () {
  it('Successfully displays post details', function () {
    let postTitle = '';
    cy.visit('/new')
    cy.get('.news-post .title').first().invoke('text').then(postTitle => {
      cy.get('.news-post .title > a').first().click().then(() => {
        cy.location().should((loc) => {
          expect(loc.pathname).to.match(/post/)
        })
        cy.get('h1').contains(postTitle)
      })
    })
  })
  xit('Successfully upvotes/downvotes post', function () {
    cy.visit('/new')
    cy.get('.title > a').first().click({ force: true })
    cy.get('.post-header')
    .first()
    .upvoteToggle()
    cy.get('.toasted.error').should('contain', 'You must login to vote')
    cy.login().then(() => {
      cy.visit('/new')
      cy.get('.title > a').first().click({ force: true })
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
  xit('Successfully adds related link', function () {
    const linkUrl = `https://google.com/${uuidv4()}`
    const linkTitle = `See also - ${uuidv4()}`
    cy.login().then(() => {
      cy.visit('/new')
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
  xit('Successfully plays episode', function () {
    cy.visit('/new')
    // some posts may be "text only" - want one that can play
    cy.get('.player-control')
    .first()
    .parents('.news-post')
    .first()
    .find('.title')
    .click()
    cy.get('.post-header-details').find('.player-control').click()
    cy.get('.player-holder').find('.music-time').contains(/^00:00/)
    /* TODO: consider adding tests that audio is actually playing, however it may not be worth it as:
      1) This was challenging with Cypress to get working
      2) The test would be flaky anyways at it requires an external resource
      3) Behaviour should be stable and routine testing may not be necessary
    */
  })
})
