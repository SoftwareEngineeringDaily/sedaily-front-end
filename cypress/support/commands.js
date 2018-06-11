const uuidv4 = require('uuid/v4')
const BASE_API_URL = 'http://localhost:4040/api'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('register', () => {
  /* usage:
  cy.register()
   .then(({ user, resp }) => {
      //do something with user and/or resp
   })
  */
  const endpoint = `${BASE_API_URL}/auth/register`
  const randomName = uuidv4()
  const user = {
    username: randomName,
    name: randomName,
    email: `${randomName}@mail.com`,
    password: 'fakePassword',
  }
  return cy
  .request('POST', endpoint, user)
  .then((resp) => ({ user, resp }))
})

Cypress.Commands.add('login', () => {
  return cy.register().then(({ user }) => {
    cy.visit('/#/login').then(() => {
      cy.get('input[name=username]').type(user.username)
      cy.get('input[name=password]').type(user.password)
      cy.get('button[name=submit-button]').click()
    }).then(() => {
      return { user }
    })
  })
})
