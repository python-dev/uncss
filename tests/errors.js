'use strict';

var expect    = require('chai').expect,
    uncss     = require('./../lib/uncss.js');

var invalid_css = 'We need to create a string longer than 40 characters to ' +
                  'check if the error string we are creating is helpful';

describe('Error reporting', function () {

    it('No callback', function () {
        var throw_test = function () {
            uncss('<html></html>', { stylesheets: ['nonexistant'] });
        };
        expect(throw_test).to.throw(TypeError);
    });

    it('Invalid options.stylesheets', function (done) {
        uncss('<html></html>', { stylesheets: ['nonexistent'] }, function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('Invalid options.stylesheets with url', function (done) {
        uncss('<html></html>', { stylesheets: ['http://invalid'] }, function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('Invalid options.raw', function (done) {
        uncss('<html></html>', { raw: ['.test { margin: 0 }'] }, function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('No stylesheet found should output an error', function (done) {
        uncss('<html><body></body></html>', function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('Outputs PhantomJS errors', function (done) {
        uncss(['nonexistent.html'], function (error, output) {
            expect(output).to.not.exist;
            expect(error).to.exist;
            done();
        });
    });

    it('Outputs css-parse errors', function (done) {
        uncss(
            ['tests/selectors/index.html'],
            { raw: invalid_css },
            function (error, output) {
                expect(output).to.not.exist;
                expect(error.message).to.contain('uncss/node_modules/css: unable to parse tests/selectors/fixtures/vendor.css');
                done();
            }
        );
    });

    it('Report should be generated only if specified', function (done) {
        uncss(['tests/selectors/index.html'], function (error, output, report) {
            expect(report).to.be.undefined;
            done();
        });
    });
});
