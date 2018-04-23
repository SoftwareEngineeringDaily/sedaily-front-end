module.exports = {
  plugins: [
    'cypress'
  ],
  env: {
    'cypress/globals': true
  },
  extends: [
    'plugin:cypress-dev/general',
    'plugin:cypress-dev/tests'
  ]
}