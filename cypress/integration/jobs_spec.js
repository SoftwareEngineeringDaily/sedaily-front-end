const uuidv4 = require('uuid/v4')

describe('The Jobs Page', function () {
  const jobPosting = {
    companyName: 'Company',
    location: 'Worldwide',
    title: `Job - ${uuidv4()}`,
    applicationEmailAddress: 'a@a.com',
    description: 'Job Description',
  }
  const invalidJobTitle = 'Invalid Job Title'
  const invalidJobDescription = 'Invalid Job Description'
  it('Successfully posts a valid job', function () {
    cy.login().then(() => {
      cy.visit('/')
      cy.contains('Jobs').click()
      cy.contains('Employers: Post a Job').click()
      cy.location().then((loc) => {
        expect(loc.pathname).to.match(/add-job/)
      })
      cy.contains('Post a New Job')
      cy.get('input[name="companyName"]').type(jobPosting.companyName)
      cy.get('input[name="location"]').type(jobPosting.location)
      cy.get('input[name="remoteWorkingConsidered"]').check()
      cy.get('input[name="title"]').type(jobPosting.title)
      cy.get('input[name="employmentType"]').first().check()
      cy.get('textarea[name="description"]').type(jobPosting.description)
      cy.get('input[name="applicationEmailAddress"]').type(jobPosting.applicationEmailAddress)
      cy.get('.button-submit').click()
      cy.contains(jobPosting.title).should('exist')
    })
  })
  it('Successfully prevents posting invalid job', function () {
    cy.login().then(() => {
      cy.visit('/#/jobs')
      cy.contains('Employers: Post a Job').click()
      cy.contains('Post a New Job')
      cy.get('.button-submit').click()
      cy.contains('Invalid fields on form').should('exist')
      cy.get('.toasted > a').click()
      cy.get('input[name="companyName"]').type(jobPosting.companyName)
      cy.get('input[name="location"]').type(jobPosting.location)
      cy.get('input[name="title"]').type(invalidJobTitle)
      cy.get('textarea[name="description"]').type(invalidJobDescription)
      cy.get('input[name="applicationEmailAddress"]').type(jobPosting.applicationEmailAddress)
      // missing employmentType
      cy.get('.button-submit').click()
      cy.contains('Invalid fields on form').should('exist')
      cy.contains('The employmentType field is required').should('exist')
      cy.get('.toasted > a').click()
      cy.get('input[name="employmentType"]').first().check()
      // missing companyName
      cy.get('input[name="companyName"]').clear()
      cy.get('.button-submit').click()
      cy.contains('Invalid fields on form').should('exist')
      cy.contains('The companyName field is required').should('exist')
      cy.get('.toasted > a').click()
      cy.get('input[name="companyName"]').type(jobPosting.companyName)
      // missing location
      cy.get('input[name="location"]').clear()
      cy.get('.button-submit').click()
      cy.contains('Invalid fields on form').should('exist')
      cy.contains('The location field is required').should('exist')
      cy.get('.toasted > a').click()
      cy.get('input[name="location"]').type(jobPosting.location)
      // missing title
      cy.get('input[name="title"]').clear()
      cy.get('.button-submit').click()
      cy.contains('Invalid fields on form').should('exist')
      cy.contains('The title field is required').should('exist')
      cy.get('.toasted > a').click()
      cy.get('input[name="title"]').type(invalidJobTitle)
      // missing description
      cy.get('textarea[name="description"]').clear()
      cy.get('.button-submit').click()
      cy.contains('Invalid fields on form').should('exist')
      cy.contains('The description field is required').should('exist')
      cy.get('.toasted > a').click()
      cy.get('textarea[name="description"]').type(invalidJobDescription)
      // missing email
      cy.get('input[name="applicationEmailAddress"]').clear()
      cy.get('.button-submit').click()
      cy.contains('Invalid fields on form').should('exist')
      cy.contains('The applicationEmailAddress field is required').should('exist')
      cy.get('.toasted > a').click()
      // invalid email
      cy.get('input[name="applicationEmailAddress"]').type('a')
      cy.get('.button-submit').click()
      cy.contains('Invalid fields on form').should('exist')
      cy.contains('The applicationEmailAddress field must be a valid email').should('exist')
      // confirm no job added
      cy.contains('Jobs').click()
      cy.contains(invalidJobTitle).should('not.exist')
      cy.contains(invalidJobDescription).should('not.exist')
    })
  })
})
