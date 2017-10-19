// Import Selenium web driver
const webdriver = require('selenium-webdriver');
const {Builder, By, until, promise} = webdriver;
const test = require('selenium-webdriver/testing');
// Unit testing Helpers
const it = test.it;
const after = test.after;
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;

// Must turn off promises to make sure that await/async work correctly
promise.USE_PROMISE_MANAGER = false;

describe('Basic Auth', function() {
  let driver;

  beforeEach(async function() {

    var service = await new chrome.ServiceBuilder(path).build();
    chrome.setDefaultService(service);
    driver = await new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  });

  afterEach(async function() {
    await driver.quit();
  });

  it('login', async function() {
    await driver.get('http://localhost:8080');
    await driver.manage().window().maximize();


    var $loginLink = await driver.wait(until.elementLocated(By.name('login-nav-link')), 5000);
    await $loginLink.click();

  });
});
