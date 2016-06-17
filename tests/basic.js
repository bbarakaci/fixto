var chromedriver = require('chromedriver');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var test = require('selenium-webdriver/testing');
var assert = require('selenium-webdriver/testing/assert');

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

var path = 'http://localhost:8080/tests/';

var helper = {
    scroll: function(value) {
        driver.executeScript('window.scrollTo(0, '+value+')');
    },
    getRect: function() {
        return driver.executeAsyncScript(function(callback) {
            setTimeout(function() {
                callback(document.querySelector(".child").getBoundingClientRect());
            });
        });
    }
}

test.describe('Fixto', function () {

    // this.timeout(50000);

    test.after(function () {
        driver.quit();
    });

    test.it('should stick', function () {
        driver.get(path + 'basic.html');
        helper.scroll(100);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(0);
        });
    });

    test.it('should adjust', function () {
        driver.get(path + 'basic.html');
        helper.scroll(175);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(-25);
            assert(rect.bottom).equals(25);
        });
    });

    test.it('should stick with transformed parents', function () {
        driver.get(path + 'context.html');
        helper.scroll(100);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(0);
        });
    });

    test.it('should adjust with transformed parents', function () {
        driver.get(path + 'context.html');
        helper.scroll(175);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(-25);
            assert(rect.bottom).equals(25);
        });
    });

    test.it('should be responsive', function () {
        driver.get(path + 'basic.html');
        helper.scroll(100);
        driver.manage().window().setSize(400, 400);
        helper.getRect().then(function(rect) {
            assert(rect.width).equals(400);
        });
    });
});

