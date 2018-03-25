describe('The Login Page', function () {
  it('Successfully logs user in', function () {
    cy.fixture('token').as('tokenJSON')
    cy.server()
    cy.route({
      method: 'POST',
      url: '/api/auth/login',
      response: '@tokenJSON',
    })
    // for redirect to home stub GET posts request
    cy.route({
      method: 'GET',
      url: '/api/posts*',
      response: [],
    })
    // not able to visit login directly with vue-router, need hash first
    cy.visit('/#/login')
    cy.fixture('user')
    .then((userJSON) => {
      cy.get('input[name=username]').type(userJSON.user.username)
      cy.get('input[name=password]').type(userJSON.user.password)
      cy.get('button[name=submit-button]').click()
    })
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
    cy.get('a[href="/profile"]').should('contain', 'Profile')
    cy.window().then((win) => {
      expect(win.localStorage).to.have.any.keys('token')
      expect(win.localStorage['token']).to.eq(this.tokenJSON.token)
    })
  })
})
