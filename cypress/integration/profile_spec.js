const uuidv4 = require('uuid/v4')


describe('The Profile Page', function () {
  let existingUser
  before(function () {
    // create existing user
    cy.login()
    .then(({ user }) => {
      existingUser = user
    })
  })
  it('Successfully displays and updates profile', function () {
    const newWebsite = 'www.me.com'
    const newBio = 'My Bio!'
    const newName = uuidv4()
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
    // populates with existing
    cy.get('input[name=username]').should('have.value', existingUser.username)
    cy.get('input[name=name]').should('have.value', existingUser.name)
    cy.get('input[name=email]').should('have.value', existingUser.email)
    // input and update
    cy.get('#websiteInput').type(newWebsite)
    cy.get('#bioInput').type(newBio)
    cy.get('input[name=name]').type(newName)
    cy.contains('Update').click()
    cy.contains('was Updated').should('exist')
    // check updated
    cy.get('a[href="/profile"]').click()
    cy.get(`a[href="//${newWebsite}"]`).should('exist')
    cy.get('.display-bio > small').should('contain', newBio)
    cy.get('.display-name').should('contain', newName)
  })
})
