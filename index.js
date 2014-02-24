'use strict';

var es = require('event-stream');
var gutil = require('gulp-util');
var mustache = require('mustache');

module.exports = function (view, options, partials) {
    options = options || {};
    options.extension = options.extension || '.html';
    partials = partials || {};

    return es.map(function (file, cb) {
        file.contents = new Buffer(mustache.render(file.contents.toString(), view, partials));
        file.path = gutil.replaceExtension(file.path, options.extension);
        cb(null, file);
    });
};
