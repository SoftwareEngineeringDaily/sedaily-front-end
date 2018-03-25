describe('The Register Page', function () {
  it('Successfully registers the user', function () {
    cy.fixture('registration').as('registrationJSON')
    cy.server()
    cy.route({
      method: 'POST',
      url: '/api/auth/register',
      response: '@registrationJSON',
    })
    // for redirect to home stub GET posts request
    cy.route({
      method: 'GET',
      url: '/api/posts*',
      response: [],
    })
    // not able to visit login directly with vue-router, need hash first
    cy.visit('/#/register')
    .then(() => {
      cy.get('input[name=username]').type(this.registrationJSON.user.username)
      cy.get('input[name=password]').type(this.registrationJSON.user.password)
      cy.get('input[name=name]').type(this.registrationJSON.user.name)
      cy.get('#emailInput').type(this.registrationJSON.user.email)
      cy.get('#allowNewsletter').click()
      cy.get('button[name=submit-button]').click()
    })
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
    cy.get('a[href="/profile"]').should('contain', 'Profile')
    cy.window().then((win) => {
      expect(win.localStorage).to.have.any.keys('token')
      expect(win.localStorage['token']).to.eq(this.registrationJSON.token)
    })
  })
})
