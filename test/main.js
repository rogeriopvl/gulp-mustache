/*global describe, it*/
'use strict';

var fs = require('fs'),
should = require('should');
require('mocha');

var gutil = require('gulp-util'),
mustache = require('../');

describe('gulp-mustache', function () {

    var expectedFile = new gutil.File({
        path: 'test/expected/output.html',
        cwd: 'test/',
        base: 'test/expected',
        contents: fs.readFileSync('test/expected/output.html')
    });

    it('should produce correct html output when rendering a file', function (done) {

        var srcFile = new gutil.File({
            path: 'test/fixtures/ok.mustache',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/ok.mustache')
        });

        var stream = mustache({ title: 'gulp-mustache' });

        stream.on('error', function (err) {
            should.exist(err);
            done(err);
        });

        stream.on('data', function (newFile) {

            should.exist(newFile);
            should.exist(newFile.contents);

            String(newFile.contents).should.equal(String(expectedFile.contents));
            done();
        });

        stream.write(srcFile);
        stream.end();
    });

    // it('should throw error when syntax is incorrect', function (done) {

    //     var srcFile = new gutil.File({
    //         path: 'test/fixtures/nok.mustache',
    //         cwd: 'test/',
    //         base: 'test/fixtures',
    //         contents: fs.readFileSync('test/fixtures/nok.mustache')
    //     });

    //     var stream = mustache({ title: 'gulp-mustache' });

    //     stream.on('error', function (err) {
    //         should.exist(err);
    //         done();
    //     });

    //     stream.write(srcFile);
    //     stream.end();
    // });
});
