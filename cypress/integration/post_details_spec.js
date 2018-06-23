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
})
