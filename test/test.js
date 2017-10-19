// var webdriver = require('selenium-webdriver');
// var By = webdriver.By;
// var until = webdriver.until;
//
// var driver = new webdriver.Builder().forBrowser('chrome').build();


var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;

var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();


driver.manage().window().maximize();

driver.get('http://localhost:8080');
