describe('The Posts Pages', function () {
  it('Successfully displays new episode posts in descending order', function () {
    cy.getPosts('type=new&limit=20').then((posts) => {
      // hash to visit directly
      cy.visit('/#/new')
      //first ten
      cy.get('.news-post').should('have.length', 10)
      cy.get('.news-post').each(($el, index) => {
        cy.decodeHTML(posts[index].title.rendered).then((title) => {
          cy
          .wrap($el)
          .get('.title')
          .contains(title)
          // scroll so eventually next 10 load
          cy.wrap($el).scrollIntoView()
        })
      })
      //first twenty
      cy.get('.news-post').should('have.length', 20)
      cy.get('.news-post').each(($el, index) => {
        cy.decodeHTML(posts[index].title.rendered).then((title) => {
          cy
          .wrap($el)
          .get('.title')
          .contains(title)
        })
      })
    })
  })
  it('Successfully filters by category', function () {
    // this should likely not change, but if need be can be changed here
    const JAVASCRIPT_CATEGORY = 1084
    cy.visit('/#/new')
    cy.getPosts(`type=new&limit=10&categories=${JAVASCRIPT_CATEGORY}`).then((posts) => {
      cy.contains('JavaScript').first().click()
      cy.contains('JavaScript').first().should('have.class', 'category-active')
      cy.get('.news-post').each(($el, index) => {
        cy.decodeHTML(posts[index].title.rendered).then((title) => {
          cy
          .wrap($el)
          .get('.title')
          .contains(title)
        })
      })
    })
    cy.getPosts('type=new&limit=10').then((posts) => {
      cy.contains('All').first().click()
      cy.contains('All').first().should('have.class', 'category-active')
      cy.get('.news-post').each(($el, index) => {
        cy.decodeHTML(posts[index].title.rendered).then((title) => {
          cy
          .wrap($el)
          .get('.title')
          .contains(title)
        })
      })
    })
  })
  it('Successfully plays episode', function () {
    cy.visit('/#/new')
    cy.get('.player-control').first().click()
    cy.get('.player-holder').find('.music-time').contains(/^00:00/)
    /* TODO: consider adding tests that audio is actually playing, however it may not be worth it as:
      1) This was challenging with Cypress to get working
      2) The test would be flaky anyways at it requires an external resource
      3) Behaviour should be stable and routine testing may not be necessary
    */
  })
  it('Successfully upvotes and downvotes episodes', function () {
    cy.visit('/#/new')
    cy
    .get('.news-post')
    .first()
    .upvoteToggle()
    cy.get('.toasted.error').should('contain', 'You must login to vote')
    cy.login().then(() => {
      cy.visit('/#/new')
      cy
      .get('.news-post')
      .first()
      .upvoteToggle()
      .parent()
      .expectActiveVote('up')
      cy
      .get('.news-post')
      .first()
      .downvoteToggle()
      .parent()
      .expectActiveVote('down')
      cy
      .get('.news-post')
      .first()
      .downvoteToggle()
      .parent()
      .expectActiveVote('none')
    })
  })
  //TODO: Add tests after back-end issue fixed along with fixing front-end issue
  //Back-end issue: type=top will return those downvoted (-1 score) before those with no votes
  //Front-end issue: see https://github.com/SoftwareEngineeringDaily/sedaily-front-end/issues/317
  it('Successfully displays top episode posts in descending order', function () {})
})
