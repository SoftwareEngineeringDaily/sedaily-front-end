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
    lastName: randomName,
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

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.token = ''
  })
})

Cypress.Commands.add('getPostsByTopic', (topic) => {
  const endpoint = `${BASE_API_URL}/topics/${topic}`
  return cy
  .request('GET', endpoint)
  .then((resp) => (resp.body))
})

Cypress.Commands.add('getPosts', (query) => {
  const endpoint = `${BASE_API_URL}/posts?${query}`
  return cy
  .request('GET', endpoint)
  .then((resp) => (resp.body))
})

Cypress.Commands.add('decodeHTML', (html) => {
  cy.document().then((doc) => {
    const txt = doc.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  })
})

Cypress.Commands.add('upvoteToggle', {
  prevSubject: true,
}, (subject) => {
  cy.wrap(subject)
  .within(() => {
    cy.get('.arrow.upvote')
    .first()
    .click()
  })
})

Cypress.Commands.add('downvoteToggle', {
  prevSubject: true,
}, (subject) => {
  cy.wrap(subject)
  .within(() => {
    cy.get('.arrow.downvote')
    .first()
    .click()
  })
})

Cypress.Commands.add('expectActiveVote', {
  prevSubject: true,
}, (subject, active) => {
  cy.wrap(subject)
  .within(() => {
    cy.get('.arrow').each(($el, index) => {
      switch (active) {
        case 'up':
          index === 0 ? //first index is up
            cy.wrap($el).should('have.class', 'active') :
            cy.wrap($el).should('not.have.class', 'active')
          break
        case 'down':
          index === 0 ?
            cy.wrap($el).should('not.have.class', 'active') :
            cy.wrap($el).should('have.class', 'active')
          break
        case 'none':
          cy.wrap($el).should('not.have.class', 'active')
          break
        default:
          throw new Error('expectActiveVote first argument must be \'up\', \'down\' or \'none\'')
      }
    })
  })
})
