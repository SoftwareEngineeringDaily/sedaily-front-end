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

Cypress.Commands.add('register', () => {
  /* usage:
  cy.register()
   .then(({ user, token }) => {
      //do something with user and/or token
   })
  */
  const endpoint = `${BASE_API_URL}/auth/register`
  const randomName = uuidv4()
  const userData = {
    username: randomName,
    name: randomName,
    email: `${randomName}@mail.com`,
    password: 'fakePassword',
  }
  return cy
  .request('POST', endpoint, userData)
  .then((resp) => {
    const { user, token } = resp.body
    // want real (not salted) password for use in login spec etc
    user.password = userData.password
    return { user, token }
  })
})

/* usage:
cy.login()
 .then(({ user }) => {
    //do something with user
 })
*/
Cypress.Commands.add('login', () => {
  return cy.register().then(({ user, token }) => {
    cy.window().then((win) => {
      win.localStorage.token = token
    }).then(() => {
      return { user }
    })
  })
})
