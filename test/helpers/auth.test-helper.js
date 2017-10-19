// Import Selenium web driver
const webdriver = require('selenium-webdriver');
const {Builder, By, until, promise} = webdriver;
const seconds = 1000;
const minutes = 60 * seconds;


async function register(driver, username, password) {
  const $registerLink = await driver.wait(until.elementLocated(By.name('register-nav-link')), 5 * minutes);
  await $registerLink.click();
};

async function login(driver, username, password) {
  const $loginLink = await driver.wait(until.elementLocated(By.name('login-nav-link')), 5 * minutes);
  await $loginLink.click();
};

module.exports = {register, login};
