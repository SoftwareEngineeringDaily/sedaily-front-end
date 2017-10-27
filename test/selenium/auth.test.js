// Import Selenium web driver
const webdriver = require('selenium-webdriver');
const {Builder, By, until, promise} = webdriver;
const test = require('selenium-webdriver/testing');
// Unit testing Helpers
const it = test.it;
const after = test.after;
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;
const {register, login} = require('../helpers/auth.test-helper')

// Must turn off promises to make sure that await/async work correctly
promise.USE_PROMISE_MANAGER = false;
const seconds = 1000;
const minutes = 60 * seconds;


describe('Basic Auth', function() {
  let driver;
  const username = 'userZ4';
  const password = 'password';
  const name = 'Alex Smith'

  // beforeEach(async function() {
  before(async function() {
    var service = await new chrome.ServiceBuilder(path).build();
    chrome.setDefaultService(service);
    driver = await new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
    await driver.manage().window().maximize();
  });

  // afterEach(async function() {
  after(async function() {
    //  await driver.quit();
  });

  it('register', async function() {
    await driver.get('http://localhost:8080');
    await register(driver, {username, password, name});
    // Check for logout login link
    const $registerLink = await driver.wait(until.elementLocated(By.name('logouts-nav-link')), 1.5 * minutes);
  });

});
