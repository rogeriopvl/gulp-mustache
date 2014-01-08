'use strict';

var es = require('event-stream');
var gutil = require('gulp-util');
var mustache = require('mustache');

module.exports = function (view) {
    return es.map(function (file, cb) {
        file.contents = new Buffer(mustache.render(file.contents.toString(), view));
        file.path = gutil.replaceExtension(file.path, '.html');
        cb(null, file);
    });
};
