/*global describe, it*/
'use strict';

var fs = require('fs'),
should = require('should'),
path = require('path');
require('mocha');

var gutil = require('gulp-util'),
mustache = require('../');

var makeFile = function (path, base) {
    return new gutil.File({
        path: path,
        cwd: 'test/',
        base: base,
        contents: fs.readFileSync(path)
    });
};

var makeExpectedFile = function (path) {
    return makeFile(path, 'test/expected');
};

var makeFixtureFile = function (path) {
    return makeFile(path, 'test/fixtures');
};

describe('gulp-mustache', function () {

    it('should produce correct html output when rendering a file', function (done) {

        var expectedFile = makeExpectedFile('test/expected/output.html');
        var srcFile = makeFixtureFile('test/fixtures/ok.mustache');
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

    it('should produce correct html output when rendering included partials', function (done) {

        var expectedFile = makeExpectedFile('test/expected/outputWithPartial.html');
        var srcFile = makeFixtureFile('test/fixtures/okWithPartial.mustache');
        var partialFile = makeFixtureFile('test/fixtures/partial.mustache');

        var stream = mustache(
            { title: 'gulp-mustache', nested: 'I am nested' },
            {},
            { partial: partialFile.contents.toString() }
        );

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

    it('should produce output file with correct chosen extension', function (done) {

        var expectedFile = makeExpectedFile('test/expected/output.html');
        var srcFile = makeFixtureFile('test/fixtures/ok.mustache');

        var stream = mustache({ title: 'gulp-mustache' }, { extension: '.txt' });

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
        String(path.extname(srcFile.path)).should.equal('.txt');
        stream.end();
    });

    it('should emit mustache errors', function (done) {
        var srcFile = makeFixtureFile('test/fixtures/nok.mustache');

        var stream = mustache({ title: 'gulp-mustache' });

        stream.on('error', function (err) {
            should.exist(err);
            done();
        });

        stream.write(srcFile);
        stream.end();
    });

    it('should produce correct html output using json file', function (done) {
        var srcFile = new gutil.File({
            path: 'test/fixtures/ok.mustache',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/ok.mustache')
        });
        var expectedFile = makeExpectedFile('test/expected/output.html');

        var stream = mustache('test/fixtures/ok.json');

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

    it('should detect malformed json and emit error', function (done) {
        var srcFile = new gutil.File({
            path: 'test/fixtures/ok.mustache',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/ok.mustache')
        });

        var stream = mustache('test/fixtures/nok.json');

        stream.on('error', function (err) {
            should.exist(err);
            done();
        });

        stream.write(srcFile);
        stream.end();
    });

    it('should emit partial not found error when partial is missing', function (done) {
        var srcFile = new gutil.File({
            path: 'test/fixtures/missing-partial.mustache',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/missing-partial.mustache')
        });

        var stream = mustache({});

        stream.on('error', function (err) {
            should.exist(err);
            should(err.message.indexOf('Unable to load partial')).equal(0);
            done();
        });

        stream.write(srcFile);
        stream.end();
    });

    it('should allow the change of mustache delimiters', function (done) {
        var expectedFile = makeExpectedFile('test/expected/output.html');
        var srcFile = makeFixtureFile('test/fixtures/custom-tags.mustache');
        var stream = mustache(
            { title: 'gulp-mustache' },
            { tags: ['{{m', 'm}}'] }
        );

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

    it('should produce correct html output when rendering a file using inverse behaviour', function (done) {

        var expectedFile = makeExpectedFile('test/expected/output.html');
        var srcFile = makeFixtureFile('test/fixtures/ok.json');
        var stream = mustache('test/fixtures/ok.mustache');

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

    it('should recognise an unusual file extension as json with isView flag', function (done) {

        var expectedFile = makeExpectedFile('test/expected/output.html');
        var srcFile = makeFixtureFile('test/fixtures/ok.mustache');
        var stream = mustache('test/fixtures/ok-json.strange-extension', {isView: true});

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

    it('should recognise an unusual file extension as a mustache template without isView flag', function (done) {

        var expectedFile = makeExpectedFile('test/expected/output.html');
        var srcFile = makeFixtureFile('test/fixtures/ok.json');
        var stream = mustache('test/fixtures/ok-mustache.strange-extension');

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
});
