var chromedriver = require('chromedriver');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var test = require('selenium-webdriver/testing');
var assert = require('selenium-webdriver/testing/assert');

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

var path = 'http://localhost:8080/tests/basic.html';

test.describe('Fixto', function () {

    // this.timeout(50000);

    test.after(function () {
        driver.quit();
    });

    test.it('should stick', function () {
        driver.get(path);
        driver.executeScript('window.scroll(0, 100)');
        driver.executeScript('return document.querySelector(".child").getBoundingClientRect()').then(function(rect) {
            assert(rect.top).equals(0);
        });
    });

    test.it('should adjust', function () {
        driver.get(path);
        driver.executeScript('window.scroll(0, 175)');
        driver.executeScript('return document.querySelector(".child").getBoundingClientRect()').then(function(rect) {
            assert(rect.top).equals(-25);
            assert(rect.bottom).equals(25);
        });
    });
});

