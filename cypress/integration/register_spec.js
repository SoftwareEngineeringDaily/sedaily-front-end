const uuidv4 = require('uuid/v4')

describe('The Register Page', function () {
  let existingUser = {
    name: 'test2',
    email: 'test2@test2.pl',
    username: 'test2',
    password: 'test2'
  };
  const randomName = uuidv4()
  const newUser = {
    username: randomName,
    name: randomName,
    lastName: randomName,
    email: `${randomName}@mail.com`,
    password: 'fakePassword',
    bio: 'My Bio',
  }
  before(function () {
    // create existing user
    cy.register()
    .then(({ user }) => {
      existingUser = user
    })
  })
  it('Successfully registers a new user', function () {
    // require hash when visiting directly
    cy.visit('/#/register')
    .then(() => {
      cy.get('#emailInput').type(newUser.email)
      cy.get('input[name=password]').type(newUser.password)
      cy.get('input[name=name]').type(newUser.name)
      cy.get('input[name=lastName]').type(newUser.lastName)
      cy.get('.login-view button[name=submit-button]').click()
    })
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
    cy.get('a[href="/profile"]').should('exist')
    cy.get('a[href="/login"]').should('not.exist')
    cy.get('a[href="/register"]').should('not.exist')
    cy.window().then((win) => {
      expect(win.localStorage).to.have.any.keys('token')
    })
  })
  // it('Displays error when registering existing user', function () {
  //   cy.visit('/#/register')
  //   .then(() => {
  //     cy.get('input[name=password]').type(existingUser.password)
  //     cy.get('input[name=confirmPassword]').type(newUser.password)
  //     cy.get('input[name=name]').type(existingUser.name)
  //     cy.get('input[name=lastName]').type(existingUser.lastName)
  //     cy.get('#emailInput').type(existingUser.email)
  //     cy.get('#emailConfirmInput').type(existingUser.email)
  //     cy.get('[for="allowNewsletter"]').click()
  //     cy.get('.login-view button[name=submit-button]').click()
  //   })
  //   cy.get('.toasted.error').should('contain', 'User already exists')
  // })
})
