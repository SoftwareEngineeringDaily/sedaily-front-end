describe('End-to-End: The Profile Page', function () {
  let existingUser
  before(function () {
    // create existing user
    cy.login()
    .then(({ user }) => {
      existingUser = user
    })
  })
  it('Successfully displays and updates profile', function () {
    let newWebsite = 'www.me.com'
    cy.visit('/')
    .then(() => {
      cy.get('a[href="/profile"]').click()
    })
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/profile')
    })
    cy.contains('Edit Profile').click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.contain('edit')
    })
    cy.get('input[name=username]').should('have.value', existingUser.username)
    cy.get('input[name=name]').should('have.value', existingUser.name)
    cy.get('input[name=email]').should('have.value', existingUser.email)
    cy.get('#websiteInput').type(newWebsite)
    cy.contains('Update').click()
    cy.contains('was Updated').should('exist')
    cy.get('a[href="/profile"]').click()
    cy.get(`a[href="//${newWebsite}"]`).should('exist')
  })
})
