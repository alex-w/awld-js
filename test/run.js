// Tests require PhantomJS and Casper.js

var casper = require('casper').create({
        verbose: true
        // logLevel: 'debug'
    }),
    t = casper.test,
    baseUrl = casper.baseUrl = "http://localhost:8080/test/pages/";
    
// for easier syntax
casper.describe = function(msg) {
    if (this.started) {
        this.then(function() { t.comment(msg) });
        // let's clear the page state while we're at it
        this.thenOpen('about:blank');
    } else {
        t.comment(msg);
    }
    return this;
};
    
// extend the tester with some custom assertions

t.assertText = function(selector, expected, message) {
    f = new Function("return $('" + selector + "').first().text().trim()");
    t.assertEvalEquals(f, expected, message);
}

t.assertInText = function(selector, expected, message) {
    f = new Function("return $('" + selector + "').first().text().trim()");
    var text = casper.evaluate(f);
    t.assert(text.indexOf(expected) >= 0, message);
}

t.assertVisible = function(selector, message) {
    f = new Function("return !!$('" + selector + ":visible').length")
    t.assertEval(f, message);
}
t.assertNotVisible = function(selector, message) {
    f = new Function("return !$('" + selector + ":visible').length")
    t.assertEval(f, message);
}
t.assertDoesNotExist = function(selector, message) {
    f = new Function("return !$('" + selector + "').length")
    t.assertEval(f, message);
}

// app-specific helpers

casper.waitUntilLoaded = function() {
    return this.waitFor(function() {
        return casper.evaluate(function() {
            return awld.loaded;
        })
    }, function() {
        t.pass('Library is loaded');
    }, function() {
        t.fail('Library never loaded');
    });
};

t.assertLoadCount = function(expected) {
    t.assertEvalEquals(function() {
            var loaded = [];
            for (var key in awld.modules) loaded.push(key);
            return loaded.length;
        }, expected,
        expected + ' modules were loaded');
};

t.assertModuleLoaded = function(module) {
    var success = casper.evaluate(function(module) {
        return module in awld.modules;
    }, { module: module });
    t.assert(success, 'Module "' + module + '" is loaded');
};

// set up and run suites
var fs = require('fs'),
    tests = [];

if (casper.cli.args.length) {
    tests = casper.cli.args.filter(function(path) {
        return fs.isFile(path) || fs.isDirectory(path);
    });
} else {
    casper.echo('No test path passed, exiting.', 'RED_BAR', 80);
    casper.exit(1);
}

t.on('tests.complete', function() {
    this.renderResults(true);
});

t.runSuites.apply(casper.test, tests);