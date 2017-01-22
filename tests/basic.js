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
        // TODO: Something is not ok, sometimes tests fail randomly.
        driver.sleep(10);
    },
    getRect: function() {
        return driver.executeAsyncScript(function(callback) {
            setTimeout(function() {
                callback(document.querySelector(".child").getBoundingClientRect());
            });
        });
    }
};

test.describe('Fixto', function () {

    //this.timeout(50000);

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

    test.it('should mind', function () {
        driver.get(path + 'mind.html');
        helper.scroll(100);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(100);
        });
    });

    test.it('should adjust with mind', function () {
        driver.get(path + 'mind.html');
        helper.scroll(175);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(75);
        });
    });

    test.it('should add class', function () {
        driver.get(path + 'basic.html');
        helper.scroll(100);
        var child = driver.findElement(By.css('.child'));
        child.getAttribute('class').then(function(value) {
            assert(value).equals('child fixto-fixed');
        });
    });

    test.it('should remove class', function () {
        driver.get(path + 'basic.html');
        helper.scroll(100);
        var child = driver.findElement(By.css('.child'));
        child.getAttribute('class').then(function(value) {
            assert(value).equals('child fixto-fixed');
        });
        helper.scroll(250);
        child.getAttribute('class').then(function(value) {
            assert(value).equals('child');
        });
    });

    test.it('should stop', function () {
        driver.get(path + 'basic.html');
        helper.scroll(100);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(0);
        });
        driver.executeScript(function() {
            collection.stop();
        });
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(-100);
        });
    });

    test.it('should start', function () {
        driver.get(path + 'basic.html');
        helper.scroll(100);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(0);
        });
        driver.executeScript(function() {
            collection.stop();
        });
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(-100);
        });
        driver.executeScript(function() {
            collection.start();
        });
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(0);
        });
    });

    test.it('should destroy', function () {
        driver.get(path + 'basic.html');
        helper.scroll(100);
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(0);
        });
        driver.executeScript(function() {
            collection.destroy();
        });
        helper.getRect().then(function(rect) {
            assert(rect.top).equals(-100);
        });
        driver.executeScript(function() {
            count = 0;
            for(var x in collection) {
                count++;
            }
            return count;
        }).then(function(value) {
            assert(value).equals(0);
        });
    });


    test.it('should refresh', function () {
        driver.get(path + 'basic.html');
        helper.scroll(100);
        driver.executeScript(function() {
            document.querySelector('.parent').style.width = '200px';
            collection.refresh();
        });
        helper.getRect().then(function(rect) {
            assert(rect.width).equals(200);
        });
    });

});

