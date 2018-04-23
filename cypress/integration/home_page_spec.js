describe('The Home Page - Unauthenticated', function () {
  it('Unauthenticated, successfully loads with login and register links', function () {
    // stubbing server and response
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/posts*',
      response: [], // just testing header so return nothing
    })
    cy.visit('/')
    cy.get('a[href="/login"]').should('contain', 'Login')
    cy.get('a[href="/register"]').should('contain', 'Register')
  })
  it('Displays new posts', function () {
    // stubbing server and response
    cy.fixture('posts').as('postsJSON')
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/posts*',
      response: '@postsJSON',
    })
    cy.visit('/')
    cy.get('div.news-content > div.title').first()
    .then((el) => {
      expect(el.text()).to.eq(this.postsJSON[0].title.rendered)
    })
  })
})