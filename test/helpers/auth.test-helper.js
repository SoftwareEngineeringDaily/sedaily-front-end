// Import Selenium web driver
const webdriver = require('selenium-webdriver');
const {Builder, By, until, promise} = webdriver;
const seconds = 1000;
const minutes = 60 * seconds;

const timeout = 1 * minutes;

// TODO: add comments
async function register(driver, {username, name, password}) {
  // Click on the register nav button to load the registraion form:
  const $registerLink = await driver.wait(until.elementLocated(By.name('register-nav-link')), timeout);
  await $registerLink.click();

  // Fill in the registration form:
  const $usernameInput = await driver.wait(until.elementLocated(By.name('username')), timeout);
  await $usernameInput.sendKeys(username);

  // Fill in password
  const $passwordInput = await driver.wait(until.elementLocated(By.name('password')), timeout);
  await $passwordInput.sendKeys(password);

  // Fill in name
  const $nameInput  = await driver.wait(until.elementLocated(By.name('name')), timeout);
  await $nameInput.sendKeys(name);

  // Submit form;
  const $submitButton = await driver.wait(until.elementLocated(By.name('submit-button')), timeout);
  await $submitButton.click();
};

async function login(driver, username, password) {
  const $loginLink = await driver.wait(until.elementLocated(By.name('login-nav-link')), timeout);
  await $loginLink.click();
};

module.exports = {register, login};
